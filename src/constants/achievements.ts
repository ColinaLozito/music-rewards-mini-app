import { Achievement } from '../types/achievement';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_100_points',
    icon: '🏆',
    title: 'First 100 Points!',
    description: 'Earned your first 100 points',
    isUnlocked: (stats) => stats.totalPoints >= 100,
  },
  {
    id: 'music_lover',
    icon: '🎵',
    title: 'Music Lover',
    description: 'Completed your first music challenge',
    isUnlocked: (stats) => stats.completedChallengesCount >= 1,
  },
  {
    id: 'perfect_score',
    icon: '🌟',
    title: 'Perfect Score!',
    description: 'Completed all challenges with 100% rate',
    isUnlocked: (stats) => stats.completionRate >= 100,
  },
];
