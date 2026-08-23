import type { ReactNode } from "react";
import "./PressButton.css";

type PressButtonVariant = "primary" | "secondary" | "onDark" | "ghost";

interface PressButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: PressButtonVariant;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  label?: string;
}

export function PressButton({
  children,
  onClick,
  variant = "secondary",
  isFullWidth = false,
  isDisabled = false,
  label,
}: PressButtonProps) {
  const classNames = [
    "press-button",
    `press-button--${variant}`,
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
