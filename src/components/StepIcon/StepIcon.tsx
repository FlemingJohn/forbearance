export type StepIconName = "watch" | "prove" | "verify" | "score" | "act";

interface StepIconProps {
  name: StepIconName;
  size?: number;
}

const paths: Record<StepIconName, JSX.Element> = {
  watch: (
    <>
      <rect x="6" y="14" width="52" height="36" />
      <path d="M6 22h52" />
      <circle cx="32" cy="36" r="9" />
      <circle cx="32" cy="36" r="3" fill="currentColor" stroke="none" />
      <path d="M11 18h3M17 18h3" />
    </>
  ),
  prove: (
    <>
      <path d="M14 8h24l12 12v36H14z" />
      <path d="M38 8v12h12" />
      <path d="M21 30h22M21 37h22M21 44h14" />
    </>
  ),
  verify: (
    <>
      <circle cx="32" cy="30" r="16" />
      <path d="M24 30l6 6 11-13" />
      <path d="M25 45l-4 12 11-5 11 5-4-12" />
    </>
  ),
  score: (
    <>
      <path d="M8 54h48" />
      <path d="M8 54V10" />
      <rect x="16" y="38" width="8" height="16" />
      <rect x="30" y="26" width="8" height="28" />
      <rect x="44" y="16" width="8" height="38" />
    </>
  ),
  act: (
    <>
      <rect x="8" y="12" width="20" height="14" />
      <rect x="36" y="38" width="20" height="14" />
      <path d="M28 19h12a6 6 0 016 6v13" />
      <path d="M40 32l6 6 6-6" />
    </>
  ),
};

export function StepIcon({ name, size = 64 }: StepIconProps) {
  return (
    <svg
      className="step-icon"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
