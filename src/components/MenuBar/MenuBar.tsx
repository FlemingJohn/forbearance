import "./MenuBar.css";

export type ScreenName = "entry" | "tour" | "dashboard";

interface MenuBarProps {
  currentScreen: ScreenName;
  onOpenTour: () => void;
  onOpenDashboard: () => void;
  onOpenEntry: () => void;
}

export function MenuBar({
  currentScreen,
  onOpenTour,
  onOpenDashboard,
  onOpenEntry,
}: MenuBarProps) {
  return (
    <nav className="menu-bar">
      <span className="menu-bar-mark" aria-hidden="true">
        <span />
      </span>
      <span className="menu-bar-name">Forbearance</span>

      <div className="menu-bar-actions">
        <button
          type="button"
          className={`menu-bar-action ${currentScreen === "entry" ? "is-current" : ""}`}
          onClick={onOpenEntry}
        >
          Start
        </button>
        <button
          type="button"
          className={`menu-bar-action ${currentScreen === "tour" ? "is-current" : ""}`}
          onClick={onOpenTour}
        >
          Tour
        </button>
        <button
          type="button"
          className={`menu-bar-action ${currentScreen === "dashboard" ? "is-current" : ""}`}
          onClick={onOpenDashboard}
        >
          Registry
        </button>
      </div>
    </nav>
  );
}
