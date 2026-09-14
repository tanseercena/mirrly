// Error screens for the try-on modal, matching the design spec's three
// failure states. The camera_denied preset also covers "no camera found".

export type TryOnError = 'camera_denied' | 'camera_unsupported' | 'session_failed';

const PRESETS: Record<TryOnError, { title: string; copy: string }> = {
  camera_denied: {
    title: 'Camera access is blocked',
    copy: 'Allow camera access in your browser settings, then try again.',
  },
  camera_unsupported: {
    title: "Live camera isn't supported here",
    copy: 'Open this product in Safari or Chrome to use live try-on.',
  },
  session_failed: {
    title: "We couldn't complete this try-on",
    copy: 'Something went wrong on our side. Please try again in a moment.',
  },
};

export function ErrorScreen(props: {
  kind: TryOnError;
  onRetry: () => void;
  onClose: () => void;
}) {
  const preset = PRESETS[props.kind];
  const unsupported = props.kind === 'camera_unsupported';

  return (
    <div class="tryon-error-screen">
      <h2 class="tryon-headline" id="tryon-title">
        {preset.title}
      </h2>
      <p class="tryon-body">{preset.copy}</p>
      <div class="tryon-result__actions">
        {!unsupported && (
          <button type="button" class="tryon-btn tryon-btn--accent" onClick={props.onRetry}>
            Try again
          </button>
        )}
        <button type="button" class="tryon-btn tryon-btn--outline" onClick={props.onClose}>
          {unsupported ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
