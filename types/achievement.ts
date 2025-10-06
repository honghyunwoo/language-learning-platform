// 배지 타입
export type BadgeType =
  | 'streak'      // 연속 학습 관련
  | 'time'        // 학습 시간 관련
  | 'activity'    // 활동 완료 관련
  | 'skill'       // 영역별 숙련도 관련
  | 'week'        // 주차 완료 관련
  | 'special';    // 특수 배지

// 배지 티어
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

// 배지 정의
export interface Badge {
  id: string;
  type: BadgeType;
  tier: BadgeTier;
  name: string;
  description: string;
  icon: string; // 이모지 또는 아이콘 이름
  requirement: number; // 달성 조건 값
  color: string; // Tailwind 색상 클래스
}

// 사용자 배지 획득 기록
export interface UserBadge {
  badgeId: string;
  userId: string;
  unlockedAt: string; // ISO timestamp
  progress?: number; // 현재 진행률 (0-100)
}

// 배지 카테고리
export interface BadgeCategory {
  type: BadgeType;
  name: string;
  description: string;
  badges: Badge[];
}

// 배지 진행 상태
export interface BadgeProgress {
  badge: Badge;
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  percentage: number;
  unlockedAt?: string;
}
