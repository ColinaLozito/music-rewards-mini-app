// Zustand store for user data and points
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  // State
  completedChallenges: string[];
  totalSecondsListened: number;
  awardedChallenges: Record<string, number>; // challengeId -> pointsAwarded

  // Actions
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
  recordAward: (challengeId: string, points: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      completedChallenges: [],
      totalSecondsListened: 0,
      awardedChallenges: {},

      // Actions
      completeChallenge: (challengeId: string) => {
        set((state) => ({
          completedChallenges: state.completedChallenges.includes(challengeId)
            ? state.completedChallenges
            : [...state.completedChallenges, challengeId],
        }));
      },

      resetProgress: () => {
        set({
          completedChallenges: [],
          totalSecondsListened: 0,
          awardedChallenges: {},
        });
      },

      recordAward: (challengeId: string, points: number) => {
        set((state) => ({
          awardedChallenges: { ...state.awardedChallenges, [challengeId]: points },
        }));
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist challenges and awarded points, NOT totalPoints (derived)
      partialize: (state) => ({
        completedChallenges: state.completedChallenges,
        awardedChallenges: state.awardedChallenges,
        totalSecondsListened: state.totalSecondsListened,
      }),
    }
  )
);

// Selector functions
export const selectCompletedChallenges = (state: UserStore) => state.completedChallenges;
export const selectTotalSecondsListened = (state: UserStore) => state.totalSecondsListened;
export const selectAwardedChallenges = (state: UserStore) => state.awardedChallenges;
export const selectTotalPoints = (state: UserStore) => {
  // Calculate totalPoints from awardedChallenges (not persisted directly)
  return Object.values(state.awardedChallenges).reduce((sum, points) => sum + points, 0);
};
