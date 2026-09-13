import { useEffect, useRef, useState } from 'preact/hooks';
import { startSession, sendEvent } from './session-api';
import { connectEngine, type EngineConnection } from './realtime-engine';
import { startPersonDetection, type PersonDetection } from './person-detection';
import { addVariantToCart } from './cart';
import type { ProductInfo } from './types';
import { TryOnIntro } from './components/TryOnIntro';
import { ErrorScreen, type TryOnError } from './components/ErrorScreen';
import {
  CloseButton,
  CountdownRing,
  GlassBottomBar,
  IconButton,
  ProductSummary,
  StatusPill,
} from './components/ui';
import { BackIcon, BagIcon, CheckIcon, InfoIcon, Silhouette } from './components/icons';

type Status =
  | 'idle' // intro — modal open, waiting for the shopper to hit Start
  | 'requesting_camera'
  | 'detecting' // camera live, waiting for a person to step into frame
  | 'connecting'
  | 'streaming'
  | 'waiting_person' // was streaming; person left, engine disconnected to stop billing
  | 'ended';

// Design-spec error screens. 'camera_denied' also covers "no camera found"
// with adjusted copy — same blocked-camera remedy.
type ErrorKind = 'camera_denied' | 'camera_unsupported' | 'session_failed';

const DEFAULT_COUNTDOWN_SECONDS = 8;

interface Props {
  configToken: string;
  productId: string;
  variantId: string;
  product: ProductInfo | null;
  countdownSeconds?: number;
  onClose: () => void;
}

export function TryOnModal({
  configToken,
  productId,
  variantId,
  product,
  countdownSeconds = DEFAULT_COUNTDOWN_SECONDS,
  onClose,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<ErrorKind | null>(null);
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);
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
  const maxDurationRef = useRef(30);

  useEffect(() => {
    const overlay = overlayRef.current;
    const previouslyFocused = openerRef.current;

    // Lock page scroll behind the modal and trap Tab inside it.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dismiss();
        return;
      }
      if (e.key !== 'Tab' || !overlay) return;
      const focusables = overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      aliveRef.current = false;
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Preparing your look…" ring — restarts on every connection because the
  // garment re-renders from scratch each time.
  useEffect(() => {
    if (status !== 'streaming') {
      setCountdownLeft(0);
      return;
    }
    setCountdownLeft(countdownSeconds);
    const interval = window.setInterval(() => {
      setCountdownLeft((left) => {
        if (left <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return left - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Everything expensive (camera, detection, backend session) starts only
  // after the shopper explicitly hits Start inside the modal.
  async function begin() {
    if (!aliveRef.current) return;
    setError(null);
    setStatus('requesting_camera');
    try {
      // 1. Camera first — nothing is written server-side or billed before
      //    this succeeds (permission denied / no camera are the common exits).
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('idle');
        setError('camera_unsupported');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
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
        personPresentRef.current = true;
        void ensureConnected();
      }
    } catch (err: any) {
      setStatus('idle');
      setError(mapCameraError(err));
    }
  }

  function backToIntro() {
    detectionRef.current?.stop();
    detectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    personPresentRef.current = false;
    setStatus('idle');
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
      maxDurationRef.current = session.max_duration_seconds;

      // No "is this still the current connection?" identity checks in these
      // callbacks: the engine suppresses events after disconnect(), and
      // early callbacks (the remote track can arrive BEFORE connectEngine
      // resolves) must never be dropped — that stranded the modal in
      // 'connecting'.
      const connection = await connectEngine({
        clientToken: session.client_token,
        modelName: session.model_name,
        prompt: session.prompt,
        referenceImageUrl: session.reference_image_url ?? undefined,
        stream: localStreamRef.current!,
        onRemoteStream: (remoteStream) => {
          if (!aliveRef.current) return;
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          markStreaming();
        },
        onStateChange: (state) => {
          if (!aliveRef.current) return;
          // 'generating' = the model is actively producing frames — the
          // authoritative "try-on is live" signal.
          if (state === 'generating') markStreaming();
        },
        onError: (err) => {
          if (!aliveRef.current) return;
          failSession(err.message);
        },
        onDisconnect: () => {
          if (!aliveRef.current) return;
          handleUnexpectedDisconnect();
        },
      });

      if (!aliveRef.current) {
        connection.disconnect();
        return;
      }
      engineRef.current = connection;

      // Person left while we were still connecting — markStreaming never ran,
      // so nothing else would tear this fresh connection down.
      if (!personPresentRef.current) handlePersonAbsent();
    } catch (err: any) {
      failSession(err?.message);
    } finally {
      connectingRef.current = false;
    }
  }

  // Idempotent "try-on is live" transition. Both the remote track arrival
  // and the 'generating' connection state funnel into this — whichever comes
  // first wins, so ordering races can't strand the modal in 'connecting'.
  function markStreaming() {
    if (!aliveRef.current || segmentStartRef.current !== null) return;

    // Person left while we were still connecting — drop the connection
    // immediately instead of streaming (and billing) to an empty room.
    if (!personPresentRef.current) {
      handlePersonAbsent();
      return;
    }

    segmentStartRef.current = Date.now();
    setStatus('streaming');
    if (sessionTokenRef.current) {
      sendEvent(sessionTokenRef.current, 'tryon_started');
    }
    armDurationCap(maxDurationRef.current);
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

  // Freezes the current remote frame so the result screen can show it blurred.
  function captureSnapshot(): string | null {
    try {
      const video = remoteVideoRef.current;
      if (!video || !video.videoWidth) return null;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch {
      return null;
    }
  }

  function endSession() {
    if (completedSentRef.current) return;
    completedSentRef.current = true;

    stopSegment();
    setSnapshot((current) => current ?? captureSnapshot());
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

  function dismiss() {
    endSession();
    onClose();
  }

  async function handleAddToCart() {
    setAdding(true);
    try {
      await addVariantToCart(currentVariantRef.current, 1, sessionTokenRef.current);

      // Attribution: cart token lets the orders webhook match purchases back
      // to this session server-side.
      let cartToken: string | undefined;
      try {
        const cart = await fetch('/cart.js').then((r) => r.json());
        cartToken = cart.token;
      } catch {
        /* attribution is best-effort — the add itself already succeeded */
      }
      if (sessionTokenRef.current) {
        sendEvent(sessionTokenRef.current, 'added_to_cart', {
          ...(cartToken ? { cart_token: cartToken } : {}),
        });
      }

      completedSentRef.current = true;
      stopSegment();
      setSnapshot((current) => current ?? captureSnapshot());
      if (engineRef.current) {
        const engine = engineRef.current;
        engineRef.current = null;
        engine.disconnect();
      }
      setAdded(true);
      setStatus('ended');
    } catch {
      setError('session_failed');
    } finally {
      setAdding(false);
    }
  }

  function tryAgain() {
    setAdded(false);
    setSnapshot(null);
    completedSentRef.current = false;
    setError(null);

    if (!detectionRef.current) {
      // Degradation mode (no person detection) — just reconnect.
      void ensureConnected();
      return;
    }
    setStatus('detecting');
    if (personPresentRef.current) void ensureConnected();
  }

  function retryFromError() {
    if (error === 'session_failed') {
      setError(null);
      if (localStreamRef.current) {
        tryAgain();
      } else {
        void begin();
      }
      return;
    }
    // Camera errors: restart the whole camera flow.
    void begin();
  }

  function failSession(_message?: string) {
    engineRef.current = null;
    stopSegment();
    setStatus('idle');
    setError('session_failed');
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

  function mapCameraError(err: any): ErrorKind {
    if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') return 'camera_denied';
    if (err?.name === 'NotFoundError') return 'camera_denied';
    return 'camera_unsupported';
  }

  // --- derived view state ---
  const inCameraStep =
    status === 'requesting_camera' || status === 'detecting' || status === 'connecting' || status === 'waiting_person';
  const showLocal = inCameraStep;
  const showRemote = status === 'streaming' || (status === 'ended' && !!snapshot);

  const pill =
    status === 'requesting_camera'
      ? { tone: 'loading' as const, text: 'Requesting camera access…' }
      : status === 'connecting'
        ? { tone: 'success' as const, text: "You're ready" }
        : { tone: 'neutral' as const, text: 'Position yourself in frame' };

  const cameraTips = (
    <ul class="tryon-tips">
      <li><span class="tryon-tips__icon"><InfoIcon size={16} /></span>Good lighting</li>
      <li><span class="tryon-tips__icon"><CheckIcon size={16} /></span>Stand facing the camera</li>
      <li><span class="tryon-tips__icon"><CheckIcon size={16} /></span>Keep your upper body visible</li>
    </ul>
  );

  return (
    <div
      ref={overlayRef}
      class="tryon-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tryon-title"
      data-step={status === 'idle' ? 'intro' : status === 'streaming' ? 'streaming' : status === 'ended' ? 'result' : 'camera'}
    >
      <div class="tryon-panel">
        <div class="tryon-topbar">
          {inCameraStep && status !== 'requesting_camera' && (
            <IconButton label="Back" onClick={backToIntro} class="tryon-topbar__back">
              <BackIcon size={18} />
            </IconButton>
          )}
          <CloseButton onClick={dismiss} />
        </div>

        {error ? (
          <ErrorScreen kind={error} onRetry={retryFromError} onClose={onClose} />
        ) : status === 'idle' ? (
          <TryOnIntro product={product} onStart={begin} onCancel={onClose} />
        ) : (
          <div class="tryon-split">
            <aside class="tryon-side">
              {inCameraStep && (
                <>
                  <ProductSummary product={product} compact />
                  <h2 class="tryon-headline tryon-camera-headline" id="tryon-title">
                    Position yourself in frame
                  </h2>
                  <p class="tryon-body">
                    Make sure your whole upper body is visible for the best results.
                  </p>
                  {cameraTips}
                </>
              )}
              {status === 'streaming' && (
                <>
                  <ProductSummary product={product} compact />
                  <h2 class="tryon-headline" id="tryon-title">
                    Try-on in progress&hellip;
                  </h2>
                  <p class="tryon-body">
                    Your live try-on is running with AI. This usually takes just a few seconds.
                  </p>
                  {countdownLeft > 0 && (
                    <div class="tryon-preparing">
                      <CountdownRing remaining={countdownLeft} total={countdownSeconds} size={88} />
                      <span class="tryon-preparing__label">Preparing your look&hellip;</span>
                    </div>
                  )}
                </>
              )}
            </aside>

            <div class="tryon-media">
              <video
                class="tryon-video tryon-video--local"
                style={{ display: showLocal ? '' : 'none' }}
                autoPlay
                playsInline
                muted
                ref={(el) => {
                  localVideoRef.current = el;
                  if (el && localStreamRef.current) el.srcObject = localStreamRef.current;
                }}
              />
              <video
                class="tryon-video tryon-video--remote"
                style={{ display: showRemote ? '' : 'none' }}
                autoPlay
                playsInline
                muted
                ref={(el) => {
                  remoteVideoRef.current = el;
                  if (el && remoteStreamRef.current) el.srcObject = remoteStreamRef.current;
                }}
              />
              {status === 'ended' && snapshot && (
                <img class="tryon-snapshot" src={snapshot} alt="Your try-on result" />
              )}

              {inCameraStep && (
                <>
                  <Silhouette class="tryon-silhouette" />
                  <div class="tryon-pill-anchor">
                    <StatusPill tone={pill.tone} text={pill.text} />
                  </div>
                  {(status === 'detecting' || status === 'waiting_person') && (
                    <div class="tryon-guidance">
                      <InfoIcon size={16} />
                      <span>Make sure your whole upper body is visible</span>
                    </div>
                  )}
                </>
              )}

              {status === 'streaming' && (
                <>
                  <span class="tryon-live" aria-hidden="true">LIVE</span>
                  {countdownLeft > 0 && (
                    <div class="tryon-preparing tryon-preparing--overlay">
                      <CountdownRing remaining={countdownLeft} total={countdownSeconds} size={52} />
                    </div>
                  )}
                  <GlassBottomBar product={product} onAddToCart={handleAddToCart} adding={adding} />
                </>
              )}

              {status === 'ended' && (
                <div class="tryon-result">
                  <span class="tryon-result__check">
                    <CheckIcon size={26} />
                  </span>
                  <h2 class="tryon-headline" id="tryon-title">
                    {added ? 'Added to your cart.' : 'How did that look?'}
                  </h2>
                  <p class="tryon-body">
                    {added
                      ? 'Ready for checkout whenever you are.'
                      : 'Add it to your cart or try again with a different look.'}
                  </p>
                  <div class="tryon-result__actions">
                    {added ? (
                      <button type="button" class="tryon-btn tryon-btn--accent" onClick={dismiss}>
                        <BagIcon size={17} />
                        <span>Done</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        class="tryon-btn tryon-btn--accent"
                        onClick={handleAddToCart}
                        disabled={adding}
                      >
                        <BagIcon size={17} />
                        <span>{adding ? 'Adding…' : 'Add to cart'}</span>
                      </button>
                    )}
                    <button type="button" class="tryon-btn tryon-btn--outline" onClick={tryAgain}>
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
