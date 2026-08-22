import type { ReactNode } from "react";
import "./Tag.css";

interface TagProps {
  children: ReactNode;
  isInverted?: boolean;
}

export function Tag({ children, isInverted = false }: TagProps) {
  const classNames = ["tag", isInverted ? "tag--inverted" : ""]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{children}</span>;
}
