import { useEffect, useRef, useState } from 'preact/hooks';
import { startSession, sendEvent, buildUrl } from './session-api';
import { connectEngine, type EngineConnection } from './realtime-engine';
import { startPersonDetection, type PersonDetection } from './person-detection';

type Status =
  | 'idle' // modal open, waiting for the shopper to hit Start
  | 'requesting_camera'
  | 'detecting' // camera live, waiting for a person to step into frame
  | 'connecting'
  | 'streaming'
  | 'waiting_person' // was streaming; person left, engine disconnected to stop billing
  | 'ended'
  | 'error';

interface Props {
  configToken: string;
  productId: string;
  variantId: string;
  onClose: () => void;
}

export function TryOnModal({ configToken, productId, variantId, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<EngineConnection | null>(null);
  const detectionRef = useRef<PersonDetection | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const currentVariantRef = useRef(variantId);

  // Detection callbacks fire long after the mount effect's closure is gone,
  // so liveness lives in a ref rather than the effect's `cancelled` variable.
  const aliveRef = useRef(true);
  const personPresentRef = useRef(false);
  const connectingRef = useRef(false);

  // Streamed time accumulates across reconnects; each connection contributes
  // one segment. duration_seconds reported to the backend is the total.
  const totalStreamMsRef = useRef(0);
  const segmentStartRef = useRef<number | null>(null);
  const completedSentRef = useRef(false);
  const durationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.addEventListener('change', handleVariantChange, true);

    return () => {
      aliveRef.current = false;
      document.removeEventListener('change', handleVariantChange, true);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Everything expensive (camera, detection, backend session) starts only
  // after the shopper explicitly hits Start inside the modal.
  async function begin() {
    if (!aliveRef.current) return;
    setStatus('requesting_camera');
    try {
      // 1. Camera first — nothing is written server-side or billed before
      //    this succeeds (permission denied / no camera are the common exits).
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      if (!aliveRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setStatus('detecting');

      // 2. Person detection gates every connection. The realtime engine is
      //    billed from connect to disconnect, so it only ever runs while a
      //    person is actually in frame.
      try {
        detectionRef.current = await startPersonDetection(localVideoRef.current!, {
          onPresent: handlePersonPresent,
          onAbsent: handlePersonAbsent,
        });
      } catch {
        // Detection couldn't load (CDN blocked, no WebGL). Degrade to the
        // old always-connected behavior rather than blocking the try-on.
          console.log("Detection error");
        personPresentRef.current = true;
        void ensureConnected();
      }
    } catch (err: any) {
      if (aliveRef.current) handleFatalError(mapErrorMessage(err));
    }
  }

  function handlePersonPresent() {
    console.log('[tryon] person present — connecting');
    personPresentRef.current = true;
    void ensureConnected();
  }

  function handlePersonAbsent() {
    console.log('[tryon] person absent — disconnecting to stop billing');
    personPresentRef.current = false;
    if (!engineRef.current) return;
    // Detach before disconnecting so the engine's own onDisconnect/onError
    // (which check engineRef) no-op instead of reporting a "loss".
    const engine = engineRef.current;
    engineRef.current = null;
    stopSegment();
    engine.disconnect();
    setStatus('waiting_person');
  }

  async function ensureConnected() {
    if (!aliveRef.current || connectingRef.current || engineRef.current) return;
    connectingRef.current = true;
    setStatus('connecting');

    try {
      // Reconnects pass the existing session_token: the backend mints a fresh
      // client token against the SAME session row instead of creating a new one.
      const session = await startSession(
        configToken,
        productId,
        currentVariantRef.current,
        sessionTokenRef.current ?? undefined
      );
      if (!aliveRef.current) return;
      sessionTokenRef.current = session.session_token;

      const connection = await connectEngine({
        clientToken: session.client_token,
        modelName: session.model_name,
        prompt: session.prompt,
        referenceImageFileId: session.reference_image_file_id,
        stream: localStreamRef.current!,
        onRemoteStream: (remoteStream) => {
          if (!aliveRef.current || engineRef.current !== connection) return;
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

          // Person left while we were still connecting — drop the connection
          // immediately instead of streaming (and billing) to an empty room.
          if (!personPresentRef.current) {
            handlePersonAbsent();
            return;
          }

          segmentStartRef.current = Date.now();
          setStatus('streaming');
          sendEvent(session.session_token, 'tryon_started');
          armDurationCap(session.max_duration_seconds);
        },
        onError: (err) => {
          if (!aliveRef.current || engineRef.current !== connection) return;
          handleFatalError(err.message || 'Connection lost');
        },
        onDisconnect: () => {
          if (!aliveRef.current || engineRef.current !== connection) return;
          handleUnexpectedDisconnect();
        },
      });

      if (!aliveRef.current) {
        connection.disconnect();
        return;
      }
      engineRef.current = connection;
    } catch (err: any) {
      if (aliveRef.current) handleFatalError(mapErrorMessage(err));
    } finally {
      connectingRef.current = false;
    }
  }

  // The engine died on its own (network drop, server-side close). If the
  // person is still in frame, reconnect right away with a fresh token;
  // otherwise drop to waiting state and let detection drive the reconnect.
  function handleUnexpectedDisconnect() {
    engineRef.current = null;
    stopSegment();
    if (personPresentRef.current) {
      void ensureConnected();
    } else {
      setStatus('waiting_person');
    }
  }

  function armDurationCap(maxSeconds: number) {
    durationTimerRef.current = window.setTimeout(() => {
      if (aliveRef.current) endSession();
    }, maxSeconds * 1000);
  }

  function stopSegment() {
    if (durationTimerRef.current) {
      window.clearTimeout(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (segmentStartRef.current !== null) {
      totalStreamMsRef.current += Date.now() - segmentStartRef.current;
      segmentStartRef.current = null;
    }
  }

  function endSession() {
    if (completedSentRef.current) return;
    completedSentRef.current = true;

    stopSegment();
    if (engineRef.current) {
      const engine = engineRef.current;
      engineRef.current = null;
      engine.disconnect();
    }

    if (sessionTokenRef.current && totalStreamMsRef.current > 0) {
      sendEvent(sessionTokenRef.current, 'tryon_completed', {
        duration_seconds: Math.round(totalStreamMsRef.current / 1000),
      });
    }
    setStatus('ended');
  }

  function handleVariantChange(e: Event) {
    const target = e.target as HTMLElement;
    const isVariantControl =
      target.matches('select[name="id"], input[name="id"]') ||
      target.closest('[data-variant-input]');
    if (!isVariantControl) return;

    const newVariantId = (target as HTMLInputElement | HTMLSelectElement).value;
    if (!newVariantId || newVariantId === currentVariantRef.current) return;
    currentVariantRef.current = newVariantId;

    // Not connected (detecting/waiting)? Nothing to do — the next connection
    // already picks up this variant because startSession sends currentVariant.
    if (!engineRef.current) return;

    // Lightweight lookup, not a session restart — swapping the prompt is what
    // makes variant switching instant on an already-open connection.
    fetch(buildUrl('/variant-prompt', { product_id: productId, variant_id: newVariantId }))
      .then((r) => r.json())
      .then((data: { prompt: string }) => {
        engineRef.current?.setPrompt(data.prompt);
      })
      .catch(() => {
        /* non-fatal — stream continues showing the previous variant's look */
      });
  }

  async function handleAddToCart() {
    try {
      const form = new FormData();
      form.set('id', currentVariantRef.current);
      form.set('quantity', '1');

      await fetch('/cart/add.js', { method: 'POST', body: form });
      const cart = await fetch('/cart.js').then((r) => r.json());

      if (sessionTokenRef.current) {
        sendEvent(sessionTokenRef.current, 'added_to_cart', { cart_token: cart.token });
      }
      setAddedToCart(true);
    } catch {
      setErrorMessage("Couldn't add to cart — please use the product page instead.");
    }
  }

  function handleFatalError(message: string) {
    setErrorMessage(message);
    setStatus('error');
    cleanup();
  }

  function cleanup() {
    aliveRef.current = false;
    detectionRef.current?.stop();
    detectionRef.current = null;
    if (durationTimerRef.current) window.clearTimeout(durationTimerRef.current);
    engineRef.current?.disconnect();
    engineRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
  }

  const showLocalPreview =
    status === 'detecting' || status === 'connecting' || status === 'waiting_person';

  return (
    <div class="tryon-overlay" role="dialog" aria-modal="true" aria-label="Live try-on">
      <div class="tryon-panel">
        <button
          class="tryon-close"
          onClick={() => {
            endSession();
            onClose();
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {status === 'idle' && (
          <div class="tryon-status">
            <p>See this on you — live, using your camera.</p>
            <button class="tryon-cta" onClick={begin}>Start try-on</button>
          </div>
        )}

        {status === 'requesting_camera' && (
          <div class="tryon-status"><p>Requesting camera access&hellip;</p></div>
        )}

        {/* Both videos stay mounted from the first render so refs exist before
            any async stream/callback lands; visibility is style-driven. */}
        <div
          class="tryon-stage"
          style={{ display: showLocalPreview || status === 'streaming' ? '' : 'none' }}
        >
          <video
            class="tryon-video tryon-video-local"
            style={{ display: showLocalPreview ? '' : 'none' }}
            autoPlay
            playsInline
            muted
            ref={(el) => {
              localVideoRef.current = el;
              if (el && localStreamRef.current) el.srcObject = localStreamRef.current;
            }}
          />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            class="tryon-video tryon-video-remote"
            style={{ display: status === 'streaming' ? '' : 'none' }}
            autoPlay
            playsInline
            muted
            ref={(el) => {
              remoteVideoRef.current = el;
              if (el && remoteStreamRef.current) el.srcObject = remoteStreamRef.current;
            }}
          />
          {showLocalPreview && (
            <div class="tryon-stage-hint">
              <p>
                {status === 'connecting'
                  ? 'Starting your live try-on…'
                  : status === 'waiting_person'
                    ? 'Step back into the frame to continue'
                    : 'Step into the frame to start your try-on'}
              </p>
            </div>
          )}
        </div>

        {status === 'streaming' && !addedToCart && (
          <div class="tryon-actions">
            <button class="tryon-cta" onClick={handleAddToCart}>Add to cart</button>
          </div>
        )}

        {addedToCart && (
          <div class="tryon-confirmation">
            <p>Added to your cart.</p>
            <button onClick={() => { endSession(); onClose(); }}>Done</button>
          </div>
        )}

        {status === 'ended' && !addedToCart && (
          <div class="tryon-confirmation">
            <p>How did that look?</p>
            <button class="tryon-cta" onClick={handleAddToCart}>Add to cart</button>
            <button onClick={onClose}>Close</button>
          </div>
        )}

        {status === 'error' && (
          <div class="tryon-status tryon-error">
            <p>{errorMessage ?? 'Something went wrong.'}</p>
            <button onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function mapErrorMessage(err: any): string {
  if (err?.name === 'NotAllowedError') return 'Camera access was denied. Enable it in your browser settings to try this on.';
  if (err?.name === 'NotFoundError') return 'No camera was found on this device.';
  return 'Live try-on is unavailable right now — please try again in a moment.';
}
