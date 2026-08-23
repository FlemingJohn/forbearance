import "./StatTile.css";

type StatTone = "neutral" | "watch" | "alarm";

interface StatTileProps {
  label: string;
  value: string;
  note: string;
  tone?: StatTone;
}

export function StatTile({
  label,
  value,
  note,
  tone = "neutral",
}: StatTileProps) {
  return (
    <div className={`stat-tile stat-tile--${tone}`}>
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">{value}</span>
      <span className="stat-tile-note">{note}</span>
    </div>
  );
}
