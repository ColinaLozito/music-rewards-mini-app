export interface UserStats {
  totalPoints: number;
  completedChallengesCount: number;
  completionRate: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  isUnlocked: (stats: UserStats) => boolean;
}
