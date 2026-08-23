import type { ReactNode } from "react";
import "./Tag.css";

export type TagTone = "neutral" | "accent" | "calm" | "watch" | "alarm";

interface TagProps {
  tone?: TagTone;
  children: ReactNode;
}

export function Tag({ tone = "neutral", children }: TagProps) {
  return <span className={`tag tag--${tone}`}>{children}</span>;
}
