import { useEffect, useRef, useState } from 'preact/hooks';
import { startSession, sendEvent, buildUrl } from './session-api';
import { connectEngine, type EngineConnection } from './realtime-engine';

type Status = 'requesting_camera' | 'connecting' | 'streaming' | 'ended' | 'error';

interface Props {
  configToken: string;
  productId: string;
  variantId: string;
  onClose: () => void;
}

export function TryOnModal({ configToken, productId, variantId, onClose }: Props) {
  const [status, setStatus] = useState<Status>('requesting_camera');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<EngineConnection | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const durationTimerRef = useRef<number | null>(null);
  const currentVariantRef = useRef(variantId);

  useEffect(() => {
    let cancelled = false;

    async function begin() {
      try {
        // 1. Mint a session + realtime engine credentials from our backend.
        //    camera_opened_at is written server-side the moment this call lands.
        const session = await startSession(configToken, productId, variantId);
        if (cancelled) return;
        sessionTokenRef.current = session.session_token;

        // 2. Request the camera. This is the step most likely to fail
        //    (denied permission, no camera, insecure context).
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        setStatus('connecting');

        // 3. Connect to the realtime engine directly from the browser.
        const connection = await connectEngine({
          clientToken: session.client_token,
          modelName: session.model_name,
          prompt: session.prompt,
          referenceImageFileId: session.reference_image_file_id,
          stream,
          onRemoteStream: (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            if (!cancelled) {
              startedAtRef.current = Date.now();
              setStatus('streaming');
              sendEvent(session.session_token, 'tryon_started');
              armDurationCap(session.max_duration_seconds);
            }
          },
          onError: (err) => {
            if (!cancelled) handleFatalError(err.message || 'Connection lost');
          },
          onDisconnect: (reason) => {
            if (!cancelled && status === 'streaming') handleFatalError(`Connection ended (${reason})`);
          },
        });

        if (cancelled) {
          connection.disconnect();
          return;
        }
        engineRef.current = connection;
      } catch (err: any) {
        if (!cancelled) handleFatalError(mapErrorMessage(err));
      }
    }

    begin();

    // Listen for the shopper changing color/size on the product page while
    // the modal is open, and push the new prompt live without reconnecting.
    document.addEventListener('change', handleVariantChange, true);

    return () => {
      cancelled = true;
      document.removeEventListener('change', handleVariantChange, true);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleVariantChange(e: Event) {
    const target = e.target as HTMLElement;
    const isVariantControl =
      target.matches('select[name="id"], input[name="id"]') ||
      target.closest('[data-variant-input]');
    if (!isVariantControl || !engineRef.current) return;

    const newVariantId = (target as HTMLInputElement | HTMLSelectElement).value;
    if (!newVariantId || newVariantId === currentVariantRef.current) return;
    currentVariantRef.current = newVariantId;

    // Lightweight lookup, not a full session restart — swapping the prompt
    // is what makes variant switching instant on an already-open connection.
    fetch(buildUrl('/variant-prompt', { product_id: productId, variant_id: newVariantId }))
      .then((r) => r.json())
      .then((data: { prompt: string }) => {
        engineRef.current?.setPrompt(data.prompt);
      })
      .catch(() => {
        /* non-fatal — stream continues showing the previous variant's look */
      });
  }

  function armDurationCap(maxSeconds: number) {
    durationTimerRef.current = window.setTimeout(() => {
      endSession('duration_cap_reached');
    }, maxSeconds * 1000);
  }

  function endSession(_reason: string) {
    if (status !== 'streaming' || !sessionTokenRef.current || !startedAtRef.current) {
      cleanup();
      onClose();
      return;
    }
    const durationSeconds = Math.round((Date.now() - startedAtRef.current) / 1000);
    sendEvent(sessionTokenRef.current, 'tryon_completed', { duration_seconds: durationSeconds });
    setStatus('ended');
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
    if (durationTimerRef.current) window.clearTimeout(durationTimerRef.current);
    engineRef.current?.disconnect();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
  }

  return (
    <div class="tryon-overlay" role="dialog" aria-modal="true" aria-label="Live try-on">
      <div class="tryon-panel">
        <button class="tryon-close" onClick={() => { endSession('user_closed'); onClose(); }} aria-label="Close">
          &times;
        </button>

        {status === 'requesting_camera' && (
          <div class="tryon-status"><p>Requesting camera access&hellip;</p></div>
        )}

        {status === 'connecting' && (
          <div class="tryon-status"><p>Starting your live try-on&hellip;</p></div>
        )}

        {(status === 'connecting' || status === 'streaming') && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video ref={remoteVideoRef} class="tryon-video" autoPlay playsInline muted />
        )}

        {status === 'streaming' && !addedToCart && (
          <div class="tryon-actions">
            <button class="tryon-cta" onClick={handleAddToCart}>Add to cart</button>
          </div>
        )}

        {addedToCart && (
          <div class="tryon-confirmation">
            <p>Added to your cart.</p>
            <button onClick={() => { endSession('user_closed'); onClose(); }}>Done</button>
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
