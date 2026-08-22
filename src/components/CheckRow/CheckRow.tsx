import "./CheckRow.css";

interface CheckRowProps {
  label: string;
  value: string;
}

export function CheckRow({ label, value }: CheckRowProps) {
  return (
    <div className="check-row">
      <span className="check-row-label">{label}</span>
      <span className="check-row-leader" aria-hidden="true" />
      <span className="check-row-value">{value}</span>
    </div>
  );
}
