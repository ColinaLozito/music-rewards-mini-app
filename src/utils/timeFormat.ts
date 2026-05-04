const SECONDS_PER_MINUTE = 60
// Pure functions (moved outside hook per CODE_RULES.md)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
