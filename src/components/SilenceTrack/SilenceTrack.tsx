import "./SilenceTrack.css";

const TRACK_START_PERCENT = 5;
const TRACK_WIDTH_PERCENT = 90;

interface SilenceTrackProps {
  openedAtBlock: number;
  closedAtBlock: number;
  attemptBlocks: number[];
}

function placeAttempt(
  attemptBlock: number,
  openedAtBlock: number,
  closedAtBlock: number,
): number {
  const span = closedAtBlock - openedAtBlock;

  if (span <= 0) {
    return TRACK_START_PERCENT;
  }

  const progress = (attemptBlock - openedAtBlock) / span;
  return TRACK_START_PERCENT + progress * TRACK_WIDTH_PERCENT;
}

export function SilenceTrack({
  openedAtBlock,
  closedAtBlock,
  attemptBlocks,
}: SilenceTrackProps) {
  const describedAs =
    attemptBlocks.length === 0
      ? "No attempts were made during this interval"
      : `${attemptBlocks.length} failed attempts during this interval`;

  return (
    <div className="silence-track-scroll">
      <div className="silence-track" role="img" aria-label={describedAs}>
        <span className="silence-track-rail" />
        <span className="silence-track-cap silence-track-cap--start" />
        <span className="silence-track-cap silence-track-cap--end" />
        {attemptBlocks.map((attemptBlock) => (
          <span
            key={attemptBlock}
            className="silence-track-attempt"
            style={{
              left: `${placeAttempt(attemptBlock, openedAtBlock, closedAtBlock)}%`,
            }}
          >
            ✕
          </span>
        ))}
      </div>
    </div>
  );
}
