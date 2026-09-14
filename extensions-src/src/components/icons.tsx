// Minimal inline icon set — 24px viewBox, stroked to match the modal's
// editorial style. All inherit currentColor.

interface IconProps {
  size?: number;
  class?: string;
}

function base(props: IconProps) {
  return {
    width: props.size ?? 20,
    height: props.size ?? 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 1.8,
    'stroke-linecap': 'round' as const,
    'stroke-linejoin': 'round' as const,
    'aria-hidden': true,
    class: props.class,
  };
}

export const CameraIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const BoltIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const SunIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
  </svg>
);

export const UserIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const FrameIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2m8 0h2a2 2 0 0 1 2 2v2m0 8v2a2 2 0 0 1-2 2h-2m-8 0H6a2 2 0 0 1-2-2v-2" />
    <circle cx="12" cy="10" r="2.5" />
    <path d="M7.5 17c.8-2 2.5-3 4.5-3s3.7 1 4.5 3" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const BackIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M19 12H5m7-7-7 7 7 7" />
  </svg>
);

export const BagIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const RefreshIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 3v6h-6" />
  </svg>
);

export const InfoIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8h.01M12 12v4" />
  </svg>
);

// Dashed body silhouette shown over the camera preview while detection is
// waiting for a person. Purely decorative.
export const Silhouette = (props: { class?: string }) => (
  <svg
    viewBox="0 0 200 320"
    fill="none"
    stroke="rgba(255,255,255,0.85)"
    stroke-width="2.5"
    stroke-dasharray="7 8"
    stroke-linecap="round"
    aria-hidden="true"
    class={props.class}
  >
    <circle cx="100" cy="62" r="38" />
    <path d="M100 100c-40 0-64 26-70 62l-8 58c-.8 6 3 10 8 10h14l6 78c.5 6 4 10 9 10h82c5 0 8.5-4 9-10l6-78h14c5 0 8.8-4 8-10l-8-58c-6-36-30-62-70-62z" />
  </svg>
);
