import type { ReactNode } from "react";
import "./Window.css";

interface WindowProps {
  fileName: string;
  children: ReactNode;
}

export function Window({ fileName, children }: WindowProps) {
  return (
    <section className="window">
      <header className="window-titlebar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="window-filename">{fileName}</span>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}
