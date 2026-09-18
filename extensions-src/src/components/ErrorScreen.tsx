// Error screens for the try-on modal, matching the design spec's failure
// states. The camera_denied preset also covers "no camera found". The two
// shopper-gate presets explain a Settings-side block (login requirement /
// per-product try limit) — they can't be retried from here, so they only
// offer Close.

export type TryOnError =
  | 'camera_denied'
  | 'camera_unsupported'
  | 'session_failed'
  | 'login_required'
  | 'try_limit_reached';

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
  login_required: {
    title: 'Log in to try it on',
    copy: 'This store offers live try-on to signed-in customers only. Log in and come back to start your try-on.',
  },
  try_limit_reached: {
    title: "You've reached the try-on limit",
    copy: "You've used all your try-ons for this product. Pick another product and try it on there.",
  },
};

export function ErrorScreen(props: {
  kind: TryOnError;
  onRetry: () => void;
  onClose: () => void;
}) {
  const preset = PRESETS[props.kind];
  const unsupported = props.kind === 'camera_unsupported';
  const noRetry =
    props.kind === 'camera_unsupported' ||
    props.kind === 'login_required' ||
    props.kind === 'try_limit_reached';

  return (
    <div class="tryon-error-screen">
      <h2 class="tryon-headline" id="tryon-title">
        {preset.title}
      </h2>
      <p class="tryon-body">{preset.copy}</p>
      <div class="tryon-result__actions">
        {!noRetry && (
          <button type="button" class="tryon-btn tryon-btn--accent" onClick={props.onRetry}>
            Try again
          </button>
        )}
        <button type="button" class="tryon-btn tryon-btn--outline" onClick={props.onClose}>
          {unsupported || noRetry ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
