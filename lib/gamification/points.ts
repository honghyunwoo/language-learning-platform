// Points System

export const POINT_REWARDS = {
  // Learning Activities
  COMPLETE_LISTENING: 15,
  COMPLETE_SPEAKING: 20,
  COMPLETE_READING: 15,
  COMPLETE_WRITING: 20,
  COMPLETE_GRAMMAR: 10,
  COMPLETE_VOCABULARY: 10,
  COMPLETE_CONVERSATION: 25,

  // Streak Bonuses
  DAILY_GOAL: 50,
  WEEKLY_COMPLETION: 100,
  MONTHLY_COMPLETION: 500,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  STREAK_100_DAYS: 2000,

  // Community Activities
  CREATE_POST: 10,
  CREATE_COMMENT: 5,
  RECEIVE_LIKE: 2,
  POST_POPULAR: 50, // 10+ likes
  ANSWER_ACCEPTED: 30,

  // Social
  FOLLOW_USER: 5,
  PROFILE_COMPLETE: 20,

  // Special
  LEVEL_UP: 100,
  ACHIEVEMENT_UNLOCK: 50,
  FIRST_TIME_BONUS: 10,
} as const;

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: keyof typeof POINT_REWARDS;
  description: string;
  timestamp: Date;
}

export interface UserPoints {
  totalPoints: number;
  availablePoints: number;
  spentPoints: number;
  rank: number;
  percentile: number;
}

export function calculateRank(totalPoints: number): string {
  if (totalPoints < 100) return 'Bronze';
  if (totalPoints < 500) return 'Silver';
  if (totalPoints < 2000) return 'Gold';
  if (totalPoints < 5000) return 'Platinum';
  return 'Diamond';
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case 'Bronze':
      return 'from-orange-600 to-yellow-700';
    case 'Silver':
      return 'from-gray-400 to-gray-600';
    case 'Gold':
      return 'from-yellow-400 to-yellow-600';
    case 'Platinum':
      return 'from-cyan-400 to-blue-600';
    case 'Diamond':
      return 'from-purple-400 to-pink-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

export function getPointsToNextRank(totalPoints: number): number {
  if (totalPoints < 100) return 100 - totalPoints;
  if (totalPoints < 500) return 500 - totalPoints;
  if (totalPoints < 2000) return 2000 - totalPoints;
  if (totalPoints < 5000) return 5000 - totalPoints;
  return 0;
}
