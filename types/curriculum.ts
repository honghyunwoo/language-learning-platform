import { UserLevel } from './user';

// 활동 타입
export type ActivityType =
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'vocabulary'
  | 'grammar';

// 활동 난이도
export type ActivityDifficulty = 1 | 2 | 3 | 4;

// 활동 상태
export type ActivityStatus = 'not_started' | 'in_progress' | 'completed';

// 주차 상태
export type WeekStatus = 'locked' | 'available' | 'in_progress' | 'completed';

// 활동 리소스
export interface ActivityResource {
  contentUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
}

// 활동
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  duration: number; // 예상 소요 시간 (분)
  difficulty: ActivityDifficulty;
  order: number;
  requiredForCompletion: boolean; // 필수 활동 여부
  resources?: ActivityResource;
  tags?: string[]; // 주제 태그
}

// 커리큘럼 주차
export interface CurriculumWeek {
  id: string; // 예: "A1-W1"
  level: UserLevel;
  weekNumber: number; // 1-12
  title: string;
  description: string;
  objectives: string[]; // 학습 목표
  activities: Activity[];
  estimatedTime: number; // 총 예상 소요 시간 (분)
  order: number; // 전체 순서 (레벨 내)
}

// 사용자 주차 진행률
export interface UserWeekProgress {
  id: string; // userId_weekId
  userId: string;
  weekId: string;
  status: WeekStatus;
  startedAt?: string; // ISO date
  completedAt?: string;
  completedActivities: string[]; // Activity IDs
  timeSpent: number; // 총 소요 시간 (분)
  lastAccessedAt: string;
  notes?: string; // 사용자 메모
}

// 활동 진행 세션
export interface ActivitySession {
  id: string;
  userId: string;
  weekId: string;
  activityId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // 실제 소요 시간 (분)
  completed: boolean;
}

// 커리큘럼 통계
export interface CurriculumStats {
  totalWeeks: number;
  completedWeeks: number;
  inProgressWeeks: number;
  totalActivities: number;
  completedActivities: number;
  totalTimeSpent: number; // 분
  averageCompletionTime: number; // 주당 평균 (분)
  currentLevel: UserLevel;
  currentWeek: string;
}
