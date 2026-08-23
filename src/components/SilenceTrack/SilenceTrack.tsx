import { formatBlockHeight } from "@/lib/formatNumber";
import "./SilenceTrack.css";

const RAIL_START_PERCENT = 4;
const RAIL_WIDTH_PERCENT = 92;

interface SilenceTrackProps {
  openedAtBlock: number;
  closedAtBlock: number;
  attemptBlocks: number[];
  caption?: string;
}

function placeAttempt(
  attemptBlock: number,
  openedAtBlock: number,
  closedAtBlock: number,
): number {
  const span = closedAtBlock - openedAtBlock;

  if (span <= 0) {
    return RAIL_START_PERCENT;
  }

  const progress = (attemptBlock - openedAtBlock) / span;
  return RAIL_START_PERCENT + progress * RAIL_WIDTH_PERCENT;
}

export function SilenceTrack({
  openedAtBlock,
  closedAtBlock,
  attemptBlocks,
  caption,
}: SilenceTrackProps) {
  const hasAttempts = attemptBlocks.length > 0;
  const variant = hasAttempts ? "mechanism" : "incentive";

  const describedAs = hasAttempts
    ? `${attemptBlocks.length} failed attempts during this interval`
    : "No attempts were made during this interval";

  return (
    <figure className={`silence-track silence-track--${variant}`}>
      <div className="silence-track-ends">
        <span>opens · {formatBlockHeight(openedAtBlock)}</span>
        <span>{formatBlockHeight(closedAtBlock)} · closes</span>
      </div>

      <div className="silence-track-rail" role="img" aria-label={describedAs}>
        <span className="silence-track-span" />
        <span className="silence-track-cap silence-track-cap--start" />
        <span className="silence-track-cap silence-track-cap--end" />

        {attemptBlocks.map((attemptBlock) => (
          <svg
            key={attemptBlock}
            className="silence-track-attempt"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              left: `${placeAttempt(attemptBlock, openedAtBlock, closedAtBlock)}%`,
            }}
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        ))}
      </div>

      {caption && (
        <figcaption className="silence-track-caption">{caption}</figcaption>
      )}
    </figure>
  );
}
