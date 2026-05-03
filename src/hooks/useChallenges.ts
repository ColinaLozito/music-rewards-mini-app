// useChallenges hook - Manages challenge data and operations
//
// Purpose: Centralizes challenge-related logic that was previously scattered
// across components. Provides a clean interface for:
// - Reading challenges from musicStore
// - Reading completed challenges from userStore
// - Refreshing challenge list (re-load from source)
// - Marking challenges as complete (updates both stores)
//
// Returns: UseChallengesReturn interface (see types/index.ts)
// - challenges: Array of MusicChallenge from musicStore
// - completedChallenges: Array of completed challenge IDs from userStore
// - loading: Whether an async operation is in progress
// - error: Error message if operation failed
// - refreshChallenges(): Reload challenges
// - completeChallenge(id): Mark a challenge as complete

import { useCallback, useState } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import { updateLockScreenControls } from '../services/audioService';
import type { MusicChallenge, UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  
  const [error, setError] = useState<string | null>(null);

  const markChallengeComplete = useMusicStore((s) => s.markChallengeComplete);
  const completeChallenge = useUserStore((s) => s.completeChallenge);

  const refreshChallenges = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh challenges';
      setError(message);
    }
  }, []);

  const completeChallengeById = useCallback(async (challengeId: string): Promise<void> => {
    try {
      setError(null);
      markChallengeComplete(challengeId);
      completeChallenge(challengeId);
      await updateLockScreenControls(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete challenge';
      setError(message);
    }
  }, [markChallengeComplete, completeChallenge]);

  return {
    challenges,
    completedChallenges,
    error,
    refreshChallenges,
    completeChallenge: completeChallengeById,
  };
};
