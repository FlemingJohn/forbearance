import "./LivenessMeter.css";

const SEGMENT_COUNT = 10;

interface LivenessMeterProps {
  score: number;
}

export function LivenessMeter({ score }: LivenessMeterProps) {
  const segments = Array.from({ length: SEGMENT_COUNT }, (_, index) => index);

  return (
    <span
      className="liveness-meter"
      role="img"
      aria-label={`Liveness ${score} out of ${SEGMENT_COUNT}`}
    >
      {segments.map((index) => (
        <i key={index} className={index < score ? "is-filled" : ""} />
      ))}
    </span>
  );
}
