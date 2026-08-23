import type { Rating } from "@/types/rating";
import "./ExposureBanner.css";

interface ExposureBannerProps {
  suppliedLabel: string;
  marketName: string;
  rating: Rating;
}

export function ExposureBanner({
  suppliedLabel,
  marketName,
  rating,
}: ExposureBannerProps) {
  return (
    <div className={`exposure-banner exposure-banner--${rating.band}`}>
      <span className="exposure-banner-title">
        You have {suppliedLabel} in {marketName}
      </span>
      <span className="exposure-banner-note">
        We rate this market {rating.grade}. {rating.verdict}.
      </span>
    </div>
  );
}
