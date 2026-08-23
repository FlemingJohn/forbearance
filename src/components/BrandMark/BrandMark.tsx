interface BrandMarkProps {
  size?: number;
}

export function BrandMark({ size = 28 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brandFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5AD2F4" />
          <stop offset="100%" stopColor="#1B6CA8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#brandFill)" />
      <path
        d="M16 6l8 3.4v6.9c0 5.1-3.3 9.2-8 10.9-4.7-1.7-8-5.8-8-10.9V9.4z"
        fill="#031C26"
        fillOpacity="0.24"
      />
      <path
        d="M16 6l8 3.4v6.9c0 5.1-3.3 9.2-8 10.9-4.7-1.7-8-5.8-8-10.9V9.4z"
        stroke="#EAF9FF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.5l2.8 2.8L21 13"
        stroke="#EAF9FF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
