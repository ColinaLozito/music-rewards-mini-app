// Pure helpers for challenge components

const SECONDS_PER_MINUTE = 60;

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getButtonTitle(
  challenge: { completed: boolean },
  isCurrentTrack: boolean,
  isPlaying: boolean
): string {
  if (challenge.completed) return 'Play Again';
  if (isCurrentTrack && isPlaying) return 'Open Player';
  if (isCurrentTrack && !isPlaying) return 'Resume';
  return 'Play Challenge';
}
