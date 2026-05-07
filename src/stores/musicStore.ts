// Zustand store for music playback and challenges
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicChallenge } from '../types';
import { SAMPLE_CHALLENGES } from '../constants/challenges';

export interface MusicStore {
  // State
  challenges: MusicChallenge[];
  activeChallengeId: string | null;
  
  // Actions
  setActiveChallengeId: (id: string | null) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
  reset: () => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // Initial state - will be overridden by persisted state if it exists
      challenges: SAMPLE_CHALLENGES,
      activeChallengeId: null,

      setActiveChallengeId: (id: string | null) => {
        set({ activeChallengeId: id });
      },

      updateProgress: (challengeId: string, progress: number) => {
        // Validate inputs
        if (!challengeId || typeof progress !== 'number' || progress < 0) return;
         
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, progress: Math.min(progress, 100) }
              : challenge
          ),
        }));
      },

      markChallengeComplete: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { 
                  ...challenge, 
                  completed: true, 
                  progress: 100,
                  completedAt: new Date().toISOString()
                }
              : challenge
          ),
        }));
      },

      reset: () => {
        set({
          challenges: SAMPLE_CHALLENGES,
          activeChallengeId: null,
        });
      },
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist challenges, not playback state
      partialize: (state) => ({
        challenges: state.challenges,
      }),
    }
  )
);

// Selector functions for performance
export const selectCurrentTrack = (state: MusicStore) => 
  state.challenges.find((c) => c.id === state.activeChallengeId) || null;
export const selectActiveChallengeId = (state: MusicStore) => state.activeChallengeId;
export const selectChallenges = (state: MusicStore) => state.challenges;