import { useEffect, useRef, useState } from 'preact/hooks';
import { startSession, sendEvent, uploadRecording, emailRecording } from './session-api';
import { startEngine, type EngineHandle } from './runtime-engine';
import { startPersonDetection, type PersonDetection } from './person-detection';
import { addVariantToCart } from './cart';
import type { ProductInfo, ShopperBlockReason } from './types';
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
import { BackIcon, BagIcon, CheckIcon, DownloadIcon, InfoIcon, MailIcon, Silhouette } from './components/icons';

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

// Everything ErrorScreen can render: camera/session failures plus the
// shopper gates (login requirement / try limit), which arrive either from
// /config (via the `blocked` prop, before any camera work) or as the
// backend's error_code when /session rejects mid-flow.
type ModalError = ErrorKind | ShopperBlockReason | 'billing_failed';

const DEFAULT_COUNTDOWN_SECONDS = 8;

interface Props {
  configToken: string;
  productId: string;
  variantId: string;
  // Liquid-stamped customer id ("" for guests) — sent with every /session
  // call so the per-product try limit and login gate key off THIS shopper.
  customerId: string;
  product: ProductInfo | null;
  // Pre-camera block from /config — see widget.tsx MountOptions
  blocked?: ShopperBlockReason;
  // Master switch from /config — when true the intro offers the optional
  // recording checkbox. The shopper's opt-in, not this flag, starts the
  // recorder (checked together with the /session response server-side).
  recording?: boolean;
  countdownSeconds?: number;
  onClose: () => void;
}

export function TryOnModal({
  configToken,
  productId,
  variantId,
  customerId,
  product,
  blocked,
  recording = false,
  countdownSeconds = DEFAULT_COUNTDOWN_SECONDS,
  onClose,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  // A /config block renders immediately — the shopper never reaches the
  // intro, let alone the camera.
  const [error, setError] = useState<ModalError | null>(blocked ?? null);
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // --- optional recording (intro checkbox) + result-screen extras ---
  // The checkbox state mirrors into a ref because ensureConnected() runs
  // inside callbacks whose closures predate any re-render.
  const [recordOptIn, setRecordOptIn] = useState(false);
  const recordOptInRef = useRef(false);
  // The recorded Blob stays in the browser so the result screen can offer a
  // download / email without another server round-trip. Ref + state pair:
  // recorder callbacks fire outside render closures, the state drives the UI.
  const recordingBlobRef = useRef<Blob | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  // Final segment's upload promise — the email action awaits it so a fast
  // "Send" click can't beat the megabytes still in flight.
  const recordingUploadRef = useRef<Promise<unknown> | null>(null);
  const downloadUrlRef = useRef<string | null>(null);
  const [emailValue, setEmailValue] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  // Checkbox handler — mirrors into the ref for the session-callback closures.
  const handleRecordChange = (value: boolean) => {
    recordOptInRef.current = value;
    setRecordOptIn(value);
  };

  const overlayRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  // The try-on render target — a transparent three.js canvas composited over
  // the local video. CSS mirrors it exactly like the video element.
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const detectionRef = useRef<PersonDetection | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const currentVariantRef = useRef(variantId);

  // Try-on recording (intro checkbox opt-in). Set per-run in
  // ensureConnected() from the shopper's checkbox AND the /session
  // response's merchant master switch — both must be true.
  const recordingEnabledRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingDrawTimerRef = useRef<number | null>(null);

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
  // after the shopper explicitly hit Start inside the modal.
  async function begin() {
    if (!aliveRef.current) return;
    setError(null);

    // Fresh run: drop the previous run's recording artifacts (download blob,
    // email form) so the next result screen only ever offers THIS run's video.
    recordingBlobRef.current = null;
    setRecordingBlob(null);
    recordingUploadRef.current = null;
    setEmailValue('');
    setEmailState('idle');
    setEmailError('');
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }

    // Restart-safe: a previous run's engine, detector and camera may still
    // be alive (Try again from the result screen re-enters here) — stop them
    // first so two render loops never fight over the canvas.
    engineRef.current?.destroy();
    engineRef.current = null;
    detectionRef.current?.stop();
    detectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    personPresentRef.current = false;

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
    personPresentRef.current = true;
    const engine = engineRef.current;
    if (engine) {
      // Stepped back into frame mid-session — resume the SAME engine, no
      // new /session call needed (rendering is client-side and free).
      engine.setPaused(false);
      markStreaming();
    } else {
      console.log('[tryon] person present — starting engine');
      void ensureConnected();
    }
  }

  function handlePersonAbsent() {
    console.log('[tryon] person absent — pausing engine');
    personPresentRef.current = false;
    const engine = engineRef.current;
    if (!engine) return;
    // Pause rather than disconnect: rendering is client-side, so nothing is
    // billed while the shopper is out of frame and resuming is instant.
    engine.setPaused(true);
    stopSegment();
    stopSessionRecording();
    setStatus('waiting_person');
  }

  async function ensureConnected() {
    if (!aliveRef.current || connectingRef.current || engineRef.current) return;
    connectingRef.current = true;
    setStatus('connecting');

    try {
      // Reconnects pass the existing session_token: the backend resumes the
      // SAME session row instead of creating a new one (which would consume
      // another try against the per-product limit).
      const session = await startSession(
        configToken,
        productId,
        currentVariantRef.current,
        customerId,
        sessionTokenRef.current ?? undefined
      );
      if (!aliveRef.current) return;
      sessionTokenRef.current = session.session_token;
      maxDurationRef.current = session.max_duration_seconds;
      // Recording needs BOTH: the shopper's explicit opt-in (intro checkbox)
      // and the merchant's master switch echoed by /session.
      recordingEnabledRef.current = recordOptInRef.current && !!session.recording;

      // Build layers from the session payload: a rig (cutout + anchor data)
      // when the pipeline has produced one, else the raw reference image
      // with the engine's geometric defaults.
      const layers = [];
      const textureUrl = session.rig?.asset_url ?? session.reference_image_url;
      if (textureUrl) {
        layers.push({
          slot: session.rig?.template_type ?? 'top',
          textureUrl,
          rig: session.rig ?? null,
        });
      }

      const engine = await startEngine({
        video: localVideoRef.current!,
        canvas: overlayCanvasRef.current!,
        layers,
        onReady: markStreaming,
        onError: (err) => failSession(err.message),
      });

      if (!aliveRef.current) {
        engine.destroy();
        return;
      }
      engineRef.current = engine;
      // Resume (paused is the engine's initial state) unless the person
      // already left frame — then the pause path owns it.
      engine.setPaused(personPresentRef.current);

      // Person left while we were still starting — markStreaming never ran,
      // so nothing else would pause this fresh engine.
      if (!personPresentRef.current) handlePersonAbsent();
    } catch (err: any) {
      failSession(err?.message, err?.errorCode);
    } finally {
      connectingRef.current = false;
    }
  }

  // Idempotent "try-on is live" transition, fired by the engine's onReady
  // (first rendered pose frame).
  function markStreaming() {
    if (!aliveRef.current || segmentStartRef.current !== null) return;

    // Person left while we were still starting — pause the engine instead
    // of rendering to an empty room.
    if (!personPresentRef.current) {
      handlePersonAbsent();
      return;
    }

    segmentStartRef.current = Date.now();
    setStatus('streaming');
    if (sessionTokenRef.current) {
      sendEvent(sessionTokenRef.current, 'tryon_started');
    }
    startSessionRecording(overlayCanvasRef.current);
    armDurationCap(maxDurationRef.current);
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

  // Freezes the current try-on view (camera + garment overlay, both CSS-
  // mirrored on screen — mirror here too so the snapshot matches what the
  // shopper sees) for the result screen.
  function captureSnapshot(): string | null {
    try {
      const video = localVideoRef.current;
      const overlay = overlayCanvasRef.current;
      if (!video || !video.videoWidth) return null;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (overlay) ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch {
      return null;
    }
  }

  // Try-on recording. The stream recorded is the try-on OUTPUT the shopper
  // sees — the mirrored camera feed with the garment overlay drawn on top —
  // never the raw camera feed. Both the video and the overlay canvas are
  // drawn through an off-screen canvas every 40ms (MediaRecorder can't take
  // the composite directly) and the recorder captures canvas.captureStream()
  // — identical to what the shopper sees. Everything is gated on the
  // merchant's recording flag; the upload endpoint re-checks that flag
  // server-side.
  function startSessionRecording(overlay: HTMLCanvasElement | null) {
    if (!recordingEnabledRef.current || recorderRef.current) return;
    if (typeof MediaRecorder === 'undefined') return;
    try {
      // A reconnect supersedes the previous segment — the result screen
      // should only ever offer the newest recording.
      recordingBlobRef.current = null;
      setRecordingBlob(null);
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        const video = localVideoRef.current;
        if (!video || !video.videoWidth) return;
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        // Mirror exactly like the on-screen elements (see captureSnapshot).
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (overlay) ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      };
      draw();
      const drawTimer = window.setInterval(draw, 40);

      const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'].find(
        (t) => MediaRecorder.isTypeSupported(t)
      );
      const recorder = new MediaRecorder(canvas.captureStream(30), mime ? { mimeType: mime } : undefined);
      recordingChunksRef.current = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
      recordingDrawTimerRef.current = drawTimer;
    } catch (err) {
      // Recording is best-effort — never block the try-on over it
      console.warn('[tryon] recording could not start', err);
    }
  }

  function stopSessionRecording(image?: Blob) {
    if (recordingDrawTimerRef.current !== null) {
      window.clearInterval(recordingDrawTimerRef.current);
      recordingDrawTimerRef.current = null;
    }

    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder) return;

    const token = sessionTokenRef.current;
    recorder.onstop = () => {
      const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'video/webm' });
      recordingChunksRef.current = [];

      // Keep the video in the browser for the result screen's download /
      // email options (only reachable when the shopper opted in).
      recordingBlobRef.current = blob;
      setRecordingBlob(blob);

      const upload =
        token && blob.size > 0
          ? uploadRecording(customerId, token, blob, image ?? null)
          : null;
      recordingUploadRef.current = upload;
      upload?.catch((err) => console.warn('[tryon] recording upload failed', err));
    };
    try {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    } catch (err) {
      console.warn('[tryon] recording stop failed', err);
    }
  }

  // --- result-screen recording extras (only rendered when a recording exists) ---

  function downloadRecording() {
    const blob = recordingBlobRef.current;
    if (!blob) return;
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    const url = URL.createObjectURL(blob);
    downloadUrlRef.current = url;
    const link = document.createElement('a');
    link.href = url;
    link.download = `mirrly-try-on.${blob.type.includes('mp4') ? 'mp4' : 'webm'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleEmailRecording() {
    const email = emailValue.trim();
    if (!email || !sessionTokenRef.current || emailState === 'sending') return;
    setEmailState('sending');
    setEmailError('');
    try {
      // The server emails the stored file — wait for the upload to land so a
      // fast "Send" click can't beat the megabytes still in flight.
      await recordingUploadRef.current;
    } catch {
      /* upload failure surfaces below as the server's "not available" reply */
    }
    try {
      await emailRecording(customerId, sessionTokenRef.current, email);
      setEmailState('sent');
    } catch (err: any) {
      setEmailState('error');
      setEmailError(err?.message || 'Could not send the email');
    }
  }

  function endSession() {
    if (completedSentRef.current) return;
    completedSentRef.current = true;

    stopSegment();
    const captured = captureSnapshot();
    setSnapshot((current) => current ?? captured);
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    if (sessionTokenRef.current && totalStreamMsRef.current > 0) {
      sendEvent(sessionTokenRef.current, 'tryon_completed', {
        duration_seconds: Math.round(totalStreamMsRef.current / 1000),
      });
    }

    // Close out the recording segment, attaching the final frame as the
    // result snapshot when recording is on.
    if (recordingEnabledRef.current && captured && sessionTokenRef.current) {
      fetch(captured)
        .then((r) => r.blob())
        .then((image) => stopSessionRecording(image))
        .catch(() => stopSessionRecording());
    } else {
      stopSessionRecording();
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
      stopSessionRecording();
      setSnapshot((current) => current ?? captureSnapshot());
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      setAdded(true);
      setStatus('ended');
    } catch {
      setError('session_failed');
    } finally {
      setAdding(false);
    }
  }

  function cameraLive(): boolean {
    return !!localStreamRef.current?.getVideoTracks().some((t) => t.readyState === 'live');
  }

  function tryAgain() {
    setAdded(false);
    setSnapshot(null);
    completedSentRef.current = false;
    setError(null);

    // From the result screen the previous run is fully torn down — its
    // camera feed went with the engine disconnect, so the mid-session fast
    // path below would sit on a dead preview waiting for detection that can
    // never fire. Restart the whole flow; the fresh /session call re-checks
    // the shopper gates, so an exhausted limit lands on the limit screen
    // instead of silently reconnecting.
    if (status === 'ended' || !cameraLive()) {
      void begin();
      return;
    }

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

  function failSession(_message?: string, errorCode?: string) {
    engineRef.current = null;
    stopSegment();
    setStatus('idle');
    // /session can reject with a shopper-gate code even when /config said
    // allowed (limit hit between calls, tampered identity) — show the
    // matching screen instead of a generic failure. billing_failed is the
    // backend refusing the session because the plan's usage charge couldn't
    // be taken; retry stays available in case it was transient.
    setError(
      errorCode === 'login_required' ||
      errorCode === 'try_limit_reached' ||
      errorCode === 'billing_failed'
        ? errorCode
        : 'session_failed'
    );
  }

  function cleanup() {
    aliveRef.current = false;
    detectionRef.current?.stop();
    detectionRef.current = null;
    if (durationTimerRef.current) window.clearTimeout(durationTimerRef.current);
    stopSessionRecording();
    engineRef.current?.destroy();
    engineRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
  }

  function mapCameraError(err: any): ErrorKind {
    if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') return 'camera_denied';
    if (err?.name === 'NotFoundError') return 'camera_denied';
    return 'camera_unsupported';
  }

  // --- derived view state ---
  const inCameraStep =
    status === 'requesting_camera' || status === 'detecting' || status === 'connecting' || status === 'waiting_person';
  // The overlay canvas composites over the live camera feed, so the local
  // video stays visible during 'streaming' too (it hides only on the result
  // screen, where the snapshot takes over).
  const showLocal = inCameraStep || status === 'streaming';
  const showRemote = status === 'streaming';

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
          <TryOnIntro
            product={product}
            showRecordOption={recording}
            recordOptIn={recordOptIn}
            onRecordChange={handleRecordChange}
            onStart={begin}
            onCancel={onClose}
          />
        ) : (
          <div class="tryon-split">
            <aside class="tryon-side">
              <span class="tryon-brand">
                Powered by <b>Mirrly</b>
              </span>
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
                    Try-on is running live in your browser. Keep moving — the garment follows you.
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
              <canvas
                class="tryon-canvas"
                style={{ display: showRemote ? '' : 'none' }}
                ref={(el) => {
                  overlayCanvasRef.current = el;
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

                  {recordingBlob && (
                    <div class="tryon-share">
                      <button
                        type="button"
                        class="tryon-btn tryon-btn--outline tryon-share__download"
                        onClick={downloadRecording}
                      >
                        <DownloadIcon size={16} />
                        <span>Download video</span>
                      </button>

                      <div class="tryon-share__email">
                        <MailIcon size={16} />
                        <input
                          type="email"
                          class="tryon-share__input"
                          placeholder="Email me this video"
                          value={emailValue}
                          disabled={emailState === 'sent'}
                          onInput={(e) => setEmailValue((e.target as HTMLInputElement).value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') void handleEmailRecording();
                          }}
                        />
                        <button
                          type="button"
                          class="tryon-share__send"
                          onClick={() => void handleEmailRecording()}
                          disabled={emailState === 'sending' || emailState === 'sent' || !emailValue.trim()}
                        >
                          <span>
                            {emailState === 'sending' ? 'Sending…' : emailState === 'sent' ? 'Sent' : 'Send'}
                          </span>
                        </button>
                      </div>
                      {emailState === 'sent' && <p class="tryon-share__note">Sent — check your inbox.</p>}
                      {emailState === 'error' && (
                        <p class="tryon-share__note tryon-share__note--error">{emailError}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
