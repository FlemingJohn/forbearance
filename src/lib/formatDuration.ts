export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function formatWaitClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatEvidenceAge(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);

  if (hours >= 1) {
    return `${hours}h`;
  }

  return `${Math.floor(totalSeconds / 60)}m`;
}
