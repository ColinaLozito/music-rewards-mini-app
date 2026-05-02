// Utility: Calculate total points from challenges + listened time
import type { MusicChallenge } from '../types';

export function calculateTotalPoints(
  challenges: { id: string; duration: number; points: number }[],
  listenedTimeMap: Record<string, number>,
  awardedChallenges: Record<string, number>
): number {
  return challenges.reduce((sum, challenge) => {
    if (awardedChallenges[challenge.id] !== undefined) {
      return sum + awardedChallenges[challenge.id];
    }
    const listened = listenedTimeMap[challenge.id] || 0;
    if (challenge.duration === 0) return sum;
    return sum + Math.floor((listened / challenge.duration) * challenge.points);
  }, 0);
}
