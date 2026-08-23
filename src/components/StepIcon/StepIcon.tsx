export type StepIconName = "watch" | "prove" | "verify" | "score" | "act";

interface StepIconProps {
  name: StepIconName;
}

const glyphs: Record<StepIconName, JSX.Element> = {
  watch: (
    <>
      <circle cx="32" cy="32" r="21" opacity="0.24" />
      <circle cx="32" cy="32" r="13.5" opacity="0.5" />
      <circle cx="32" cy="32" r="6" fill="url(#stepFill)" stroke="none" />
      <circle cx="32" cy="32" r="6" />
      <path d="M32 4v6M32 54v6M4 32h6M54 32h6" opacity="0.7" />
    </>
  ),
  prove: (
    <>
      <path d="M14 12h22l14 13v27H14z" fill="url(#stepFill)" />
      <path d="M14 12h22l14 13v27H14z" />
      <path d="M36 12v13h14" />
      <path d="M32 32v6M32 38h-8v6M32 38h8v6" opacity="0.8" />
      <circle cx="32" cy="30" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="24" cy="46" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="40" cy="46" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  verify: (
    <>
      <path d="M32 6l20 8v18c0 12-8.4 21.6-20 26-11.6-4.4-20-14-20-26V14z" fill="url(#stepFill)" />
      <path d="M32 6l20 8v18c0 12-8.4 21.6-20 26-11.6-4.4-20-14-20-26V14z" />
      <path d="M23 32.5l6.5 6.5L42 26" strokeWidth="3" />
    </>
  ),
  score: (
    <>
      <path d="M10 54h44" opacity="0.7" />
      <rect x="15" y="38" width="9" height="16" rx="1.5" opacity="0.45" />
      <rect x="27.5" y="28" width="9" height="26" rx="1.5" opacity="0.7" />
      <rect x="40" y="17" width="9" height="37" rx="1.5" fill="url(#stepFill)" />
      <rect x="40" y="17" width="9" height="37" rx="1.5" />
      <path d="M14 33l12-7 12-8 12-8" opacity="0.85" strokeDasharray="3 3" />
    </>
  ),
  act: (
    <>
      <rect x="7" y="11" width="20" height="15" rx="2.5" opacity="0.6" />
      <rect x="37" y="38" width="20" height="15" rx="2.5" fill="url(#stepFill)" />
      <rect x="37" y="38" width="20" height="15" rx="2.5" />
      <path d="M27 18.5h11a7 7 0 017 7v10" />
      <path d="M40.5 31.5L45 36l4.5-4.5" strokeWidth="2.8" />
    </>
  ),
};

export function StepIcon({ name }: StepIconProps) {
  return (
    <svg
      className="step-icon"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stepFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {glyphs[name]}
    </svg>
  );
}
