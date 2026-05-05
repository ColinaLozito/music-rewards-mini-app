// useChallenges - Read challenge data, mark complete
// Returns: { challenges, completedChallenges, error, refreshChallenges, completeChallenge }

import { useCallback, useState } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import type { UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  
  const [error, setError] = useState<string | null>(null);

  const markChallengeComplete = useMusicStore((s) => s.markChallengeComplete);
  const completeChallenge = useUserStore((s) => s.completeChallenge);

  const refreshChallenges = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      // TODO: implement actual refresh logic (fetch from API/store)
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
