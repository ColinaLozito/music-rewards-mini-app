// Zustand store for user data and points
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  // State
  completedChallenges: string[];
  listenedTimeMap: Record<string, number>; // challengeId -> max seconds listened
  awardedChallenges: Record<string, number>; // challengeId -> pointsAwarded

  // Actions
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
  recordAward: (challengeId: string, points: number) => void;
  updateMaxListenedTime: (challengeId: string, currentPosition: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      completedChallenges: [],
      listenedTimeMap: {},
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
          listenedTimeMap: {},
          awardedChallenges: {},
        });
      },

      recordAward: (challengeId: string, points: number) => {
        set((state) => ({
          awardedChallenges: { ...state.awardedChallenges, [challengeId]: points },
        }));
      },

      updateMaxListenedTime: (challengeId: string, currentPosition: number) => {
        set((state) => {
          const currentMax = state.listenedTimeMap[challengeId] || 0;
          const newMax = Math.max(currentMax, currentPosition);
          if (newMax === currentMax) return state;
          return { listenedTimeMap: { ...state.listenedTimeMap, [challengeId]: newMax } };
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist challenges, listenedTimeMap, and awarded points
      // NOT totalPoints (derived)
      partialize: (state) => ({
        completedChallenges: state.completedChallenges,
        listenedTimeMap: state.listenedTimeMap,
        awardedChallenges: state.awardedChallenges,
      }),
    }
  )
);

// Selector functions
export const selectCompletedChallenges = (state: UserStore) => state.completedChallenges;
export const selectListenedTimeMap = (state: UserStore) => state.listenedTimeMap;
export const selectAwardedChallenges = (state: UserStore) => state.awardedChallenges;
export const selectTotalPoints = (state: UserStore) => {
  // Calculate totalPoints from awardedChallenges (not persisted directly)
  return Object.values(state.awardedChallenges).reduce((sum, points) => sum + points, 0);
};
