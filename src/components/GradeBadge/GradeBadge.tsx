import type { Rating } from "@/types/rating";
import "./GradeBadge.css";

interface GradeBadgeProps {
  rating: Rating;
}

export function GradeBadge({ rating }: GradeBadgeProps) {
  return (
    <span className={`grade-badge grade-badge--${rating.band}`}>
      {rating.grade}
    </span>
  );
}
