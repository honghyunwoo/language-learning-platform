import type { Badge, BadgeCategory } from '@/types/achievement';

// 모든 배지 정의
export const allBadges: Badge[] = [
  // 연속 학습 배지
  {
    id: 'streak_3',
    type: 'streak',
    tier: 'bronze',
    name: '꾸준함의 시작',
    description: '3일 연속 학습 완료',
    icon: '🔥',
    requirement: 3,
    color: 'orange',
  },
  {
    id: 'streak_7',
    type: 'streak',
    tier: 'silver',
    name: '일주일 챌린저',
    description: '7일 연속 학습 완료',
    icon: '🔥',
    requirement: 7,
    color: 'orange',
  },
  {
    id: 'streak_30',
    type: 'streak',
    tier: 'gold',
    name: '한 달 마스터',
    description: '30일 연속 학습 완료',
    icon: '🔥',
    requirement: 30,
    color: 'orange',
  },
  {
    id: 'streak_100',
    type: 'streak',
    tier: 'platinum',
    name: '백일장',
    description: '100일 연속 학습 완료',
    icon: '🔥',
    requirement: 100,
    color: 'orange',
  },

  // 학습 시간 배지
  {
    id: 'time_10h',
    type: 'time',
    tier: 'bronze',
    name: '시간 투자자',
    description: '총 10시간 학습 달성',
    icon: '⏰',
    requirement: 600, // 분 단위
    color: 'blue',
  },
  {
    id: 'time_50h',
    type: 'time',
    tier: 'silver',
    name: '학습 열정가',
    description: '총 50시간 학습 달성',
    icon: '⏰',
    requirement: 3000,
    color: 'blue',
  },
  {
    id: 'time_100h',
    type: 'time',
    tier: 'gold',
    name: '백시간 클럽',
    description: '총 100시간 학습 달성',
    icon: '⏰',
    requirement: 6000,
    color: 'blue',
  },
  {
    id: 'time_500h',
    type: 'time',
    tier: 'platinum',
    name: '시간의 지배자',
    description: '총 500시간 학습 달성',
    icon: '⏰',
    requirement: 30000,
    color: 'blue',
  },

  // 활동 완료 배지
  {
    id: 'activity_10',
    type: 'activity',
    tier: 'bronze',
    name: '활동 시작',
    description: '10개 활동 완료',
    icon: '✅',
    requirement: 10,
    color: 'green',
  },
  {
    id: 'activity_50',
    type: 'activity',
    tier: 'silver',
    name: '활동 중독자',
    description: '50개 활동 완료',
    icon: '✅',
    requirement: 50,
    color: 'green',
  },
  {
    id: 'activity_100',
    type: 'activity',
    tier: 'gold',
    name: '백전노장',
    description: '100개 활동 완료',
    icon: '✅',
    requirement: 100,
    color: 'green',
  },
  {
    id: 'activity_500',
    type: 'activity',
    tier: 'platinum',
    name: '활동 마스터',
    description: '500개 활동 완료',
    icon: '✅',
    requirement: 500,
    color: 'green',
  },

  // 영역별 숙련도 배지
  {
    id: 'skill_listening',
    type: 'skill',
    tier: 'gold',
    name: '듣기 마스터',
    description: '듣기 활동 30개 완료',
    icon: '👂',
    requirement: 30,
    color: 'purple',
  },
  {
    id: 'skill_speaking',
    type: 'skill',
    tier: 'gold',
    name: '말하기 마스터',
    description: '말하기 활동 30개 완료',
    icon: '🗣️',
    requirement: 30,
    color: 'purple',
  },
  {
    id: 'skill_reading',
    type: 'skill',
    tier: 'gold',
    name: '읽기 마스터',
    description: '읽기 활동 30개 완료',
    icon: '📖',
    requirement: 30,
    color: 'purple',
  },
  {
    id: 'skill_writing',
    type: 'skill',
    tier: 'gold',
    name: '쓰기 마스터',
    description: '쓰기 활동 30개 완료',
    icon: '✍️',
    requirement: 30,
    color: 'purple',
  },
  {
    id: 'skill_vocabulary',
    type: 'skill',
    tier: 'gold',
    name: '어휘 마스터',
    description: '어휘 활동 30개 완료',
    icon: '📚',
    requirement: 30,
    color: 'purple',
  },
  {
    id: 'skill_grammar',
    type: 'skill',
    tier: 'gold',
    name: '문법 마스터',
    description: '문법 활동 30개 완료',
    icon: '📝',
    requirement: 30,
    color: 'purple',
  },

  // 주차 완료 배지
  {
    id: 'week_1',
    type: 'week',
    tier: 'bronze',
    name: '첫 걸음',
    description: '첫 주차 완료',
    icon: '🎯',
    requirement: 1,
    color: 'indigo',
  },
  {
    id: 'week_4',
    type: 'week',
    tier: 'silver',
    name: '한 달 완주',
    description: '4주차 완료',
    icon: '🎯',
    requirement: 4,
    color: 'indigo',
  },
  {
    id: 'week_8',
    type: 'week',
    tier: 'gold',
    name: '두 달 챔피언',
    description: '8주차 완료',
    icon: '🎯',
    requirement: 8,
    color: 'indigo',
  },

  // 특수 배지
  {
    id: 'special_early_bird',
    type: 'special',
    tier: 'silver',
    name: '아침형 인간',
    description: '오전 7시 전에 학습 10회 완료',
    icon: '🌅',
    requirement: 10,
    color: 'yellow',
  },
  {
    id: 'special_night_owl',
    type: 'special',
    tier: 'silver',
    name: '올빼미족',
    description: '밤 10시 이후 학습 10회 완료',
    icon: '🦉',
    requirement: 10,
    color: 'yellow',
  },
  {
    id: 'special_perfect_week',
    type: 'special',
    tier: 'gold',
    name: '완벽한 일주일',
    description: '한 주간 매일 목표 달성',
    icon: '⭐',
    requirement: 1,
    color: 'yellow',
  },
];

// 카테고리별로 배지 그룹화
export const badgeCategories: BadgeCategory[] = [
  {
    type: 'streak',
    name: '연속 학습',
    description: '매일 꾸준히 학습하여 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'streak'),
  },
  {
    type: 'time',
    name: '학습 시간',
    description: '총 학습 시간을 기록하여 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'time'),
  },
  {
    type: 'activity',
    name: '활동 완료',
    description: '활동을 완료하여 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'activity'),
  },
  {
    type: 'skill',
    name: '영역별 숙련도',
    description: '특정 영역에서 숙련도를 쌓아 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'skill'),
  },
  {
    type: 'week',
    name: '주차 완료',
    description: '주차를 완료하여 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'week'),
  },
  {
    type: 'special',
    name: '특수 배지',
    description: '특별한 조건을 달성하여 획득하는 배지',
    badges: allBadges.filter(b => b.type === 'special'),
  },
];

// 배지 ID로 배지 찾기
export function getBadgeById(id: string): Badge | undefined {
  return allBadges.find(badge => badge.id === id);
}

// 배지 티어별 색상 가져오기
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    bronze: 'text-amber-700 dark:text-amber-500',
    silver: 'text-gray-500 dark:text-gray-400',
    gold: 'text-yellow-500 dark:text-yellow-400',
    platinum: 'text-cyan-400 dark:text-cyan-300',
  };
  return colors[tier] || colors.bronze;
}

// 배지 배경 색상 가져오기
export function getTierBgColor(tier: string): string {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-100 dark:bg-amber-900/30',
    silver: 'bg-gray-100 dark:bg-gray-800',
    gold: 'bg-yellow-100 dark:bg-yellow-900/30',
    platinum: 'bg-cyan-100 dark:bg-cyan-900/30',
  };
  return colors[tier] || colors.bronze;
}
