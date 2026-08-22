import "./TopBar.css";

interface TopBarProps {
  title: string;
  meta: string;
  isPanelVisible: boolean;
  onTogglePanel: () => void;
}

export function TopBar({
  title,
  meta,
  isPanelVisible,
  onTogglePanel,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        type="button"
        className="top-bar-toggle"
        onClick={onTogglePanel}
        aria-label={isPanelVisible ? "Hide the side panel" : "Show the side panel"}
        aria-expanded={isPanelVisible}
      >
        <span />
        <span />
        <span />
      </button>
      <span className="top-bar-title">{title}</span>
      <span className="top-bar-meta">{meta}</span>
    </header>
  );
}
