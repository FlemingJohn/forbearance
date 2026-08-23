import type { ReactNode } from "react";
import "./Panel.css";

type PanelVariant = "default" | "flush" | "quiet";

interface PanelProps {
  title?: string;
  action?: ReactNode;
  variant?: PanelVariant;
  children: ReactNode;
}

const variantClassNames: Record<PanelVariant, string> = {
  default: "",
  flush: "panel--flush",
  quiet: "panel--quiet",
};

export function Panel({
  title,
  action,
  variant = "default",
  children,
}: PanelProps) {
  const hasHeader = Boolean(title || action);

  return (
    <section className={`panel ${variantClassNames[variant]}`}>
      {hasHeader && (
        <header className="panel-head">
          {title && <span className="panel-title">{title}</span>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
