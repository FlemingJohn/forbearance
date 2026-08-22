import type { ReactNode } from "react";
import "./PressButton.css";

type PressButtonVariant = "default" | "primary" | "quiet";

interface PressButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: PressButtonVariant;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  label?: string;
}

const variantClassNames: Record<PressButtonVariant, string> = {
  default: "",
  primary: "press-button--primary",
  quiet: "press-button--quiet",
};

export function PressButton({
  children,
  onClick,
  variant = "default",
  isFullWidth = false,
  isDisabled = false,
  label,
}: PressButtonProps) {
  const classNames = [
    "press-button",
    variantClassNames[variant],
    isFullWidth ? "press-button--block" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
    >
      {children}
    </button>
  );
}
