import "./StatTile.css";

interface StatTileProps {
  label: string;
  value: string;
  note: string;
  isAlert?: boolean;
}

export function StatTile({ label, value, note, isAlert = false }: StatTileProps) {
  const classNames = ["stat-tile", isAlert ? "stat-tile--alert" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-note">{note}</span>
    </div>
  );
}
