import type { Rating } from "@/types/rating";
import "./GradeCard.css";

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface GradeCardProps {
  rating: Rating;
  marketName: string;
}

export function GradeCard({ rating, marketName }: GradeCardProps) {
  const dashOffset =
    RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * rating.ringPercent) / 100;

  return (
    <div className={`grade-card grade-card--${rating.band}`}>
      <svg
        className="grade-card-ring"
        viewBox="0 0 128 128"
        role="img"
        aria-label={`Rated ${rating.grade}`}
      >
        <circle
          className="grade-card-track"
          cx="64"
          cy="64"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className="grade-card-arc"
          cx="64"
          cy="64"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="8"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
        <text className="grade-card-letter" x="64" y="70">
          {rating.grade}
        </text>
        <text className="grade-card-scale" x="64" y="92">
          RATING
        </text>
      </svg>

      <div className="grade-card-body">
        <span className="grade-card-market">{marketName}</span>
        <span className="grade-card-verdict">{rating.verdict}</span>
        <p className="grade-card-summary">{rating.summary}</p>
      </div>
    </div>
  );
}
