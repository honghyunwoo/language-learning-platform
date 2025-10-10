// Achievement & Badge System

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'learning' | 'community' | 'streak' | 'social' | 'special';
  points: number;
  requirement: number;
  hidden?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Learning Milestones
  {
    id: 'first_activity',
    title: 'First Step',
    description: 'Complete your first learning activity',
    icon: '🎯',
    tier: 'bronze',
    category: 'learning',
    points: 50,
    requirement: 1,
  },
  {
    id: 'activities_10',
    title: 'Getting Started',
    description: 'Complete 10 learning activities',
    icon: '📚',
    tier: 'bronze',
    category: 'learning',
    points: 100,
    requirement: 10,
  },
  {
    id: 'activities_50',
    title: 'Dedicated Learner',
    description: 'Complete 50 learning activities',
    icon: '🌟',
    tier: 'silver',
    category: 'learning',
    points: 200,
    requirement: 50,
  },
  {
    id: 'activities_100',
    title: 'Century Club',
    description: 'Complete 100 learning activities',
    icon: '💯',
    tier: 'gold',
    category: 'learning',
    points: 500,
    requirement: 100,
  },
  {
    id: 'activities_500',
    title: 'Master Student',
    description: 'Complete 500 learning activities',
    icon: '👑',
    tier: 'platinum',
    category: 'learning',
    points: 2000,
    requirement: 500,
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'On Fire',
    description: '3 days learning streak',
    icon: '🔥',
    tier: 'bronze',
    category: 'streak',
    points: 50,
    requirement: 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7 days learning streak',
    icon: '⚡',
    tier: 'silver',
    category: 'streak',
    points: 150,
    requirement: 7,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: '30 days learning streak',
    icon: '💪',
    tier: 'gold',
    category: 'streak',
    points: 500,
    requirement: 30,
  },
  {
    id: 'streak_100',
    title: 'Unstoppable',
    description: '100 days learning streak',
    icon: '🚀',
    tier: 'platinum',
    category: 'streak',
    points: 2000,
    requirement: 100,
  },

  // Community Achievements
  {
    id: 'first_post',
    title: 'First Voice',
    description: 'Create your first community post',
    icon: '✍️',
    tier: 'bronze',
    category: 'community',
    points: 50,
    requirement: 1,
  },
  {
    id: 'posts_10',
    title: 'Active Member',
    description: 'Create 10 community posts',
    icon: '📝',
    tier: 'silver',
    category: 'community',
    points: 150,
    requirement: 10,
  },
  {
    id: 'helpful_answer',
    title: 'Helper',
    description: 'Get your answer accepted in Q&A',
    icon: '🤝',
    tier: 'silver',
    category: 'community',
    points: 100,
    requirement: 1,
  },
  {
    id: 'popular_post',
    title: 'Influencer',
    description: 'Get 50 likes on a single post',
    icon: '⭐',
    tier: 'gold',
    category: 'community',
    points: 300,
    requirement: 50,
  },

  // Social Achievements
  {
    id: 'followers_10',
    title: 'Popular',
    description: 'Get 10 followers',
    icon: '👥',
    tier: 'bronze',
    category: 'social',
    points: 100,
    requirement: 10,
  },
  {
    id: 'followers_50',
    title: 'Community Leader',
    description: 'Get 50 followers',
    icon: '🌟',
    tier: 'silver',
    category: 'social',
    points: 300,
    requirement: 50,
  },

  // Special/Hidden Achievements
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete an activity between 12 AM - 5 AM',
    icon: '🦉',
    tier: 'bronze',
    category: 'special',
    points: 100,
    requirement: 1,
    hidden: true,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete an activity before 6 AM',
    icon: '🌅',
    tier: 'bronze',
    category: 'special',
    points: 100,
    requirement: 1,
    hidden: true,
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all weekly activities with 100% accuracy',
    icon: '💎',
    tier: 'platinum',
    category: 'special',
    points: 1000,
    requirement: 1,
    hidden: true,
  },
];

export function getTierColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze':
      return 'from-orange-600 to-yellow-700';
    case 'silver':
      return 'from-gray-400 to-gray-600';
    case 'gold':
      return 'from-yellow-400 to-yellow-600';
    case 'platinum':
      return 'from-cyan-400 to-blue-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

export function getCategoryIcon(category: Achievement['category']): string {
  switch (category) {
    case 'learning':
      return '📚';
    case 'community':
      return '💬';
    case 'streak':
      return '🔥';
    case 'social':
      return '👥';
    case 'special':
      return '✨';
    default:
      return '🏆';
  }
}

export function checkAchievement(
  achievementId: string,
  currentValue: number
): boolean {
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) return false;
  return currentValue >= achievement.requirement;
}
