// 기분 상태
export type Mood = 'great' | 'good' | 'okay' | 'bad';

// 난이도 평가
export type DifficultyRating = 1 | 2 | 3 | 4 | 5;

// 학습 활동 로그
export interface ActivityLog {
  weekId: string;
  activityId: string;
  activityTitle: string;
  activityType: string;
  timeSpent: number; // 분
  completedAt: string; // ISO timestamp
}

// 학습 일지
export interface JournalEntry {
  id: string; // userId_YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  learningTime: number; // 총 학습 시간 (분)
  completedActivities: ActivityLog[];
  notes: string; // 사용자 메모 (Markdown)
  mood?: Mood;
  difficulty?: DifficultyRating;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 스트릭 기록
export interface StreakRecord {
  date: string; // YYYY-MM-DD
  maintained: boolean; // 학습 여부
  learningTime?: number; // 학습 시간 (분)
}

// 학습 스트릭
export interface LearningStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLearningDate: string; // YYYY-MM-DD
  streakHistory: StreakRecord[]; // 최근 30일
  totalLearningDays: number; // 총 학습 일수
  updatedAt: string;
}

// 학습 통계 (월간)
export interface MonthlyStats {
  month: string; // YYYY-MM
  totalLearningTime: number; // 분
  learningDays: number;
  completedActivities: number;
  averageDailyTime: number; // 분
  mostProductiveDay: string; // 요일
  favoriteActivityType?: string;
}

// 일지 생성 데이터
export interface CreateJournalData {
  date: string;
  notes?: string;
  mood?: Mood;
  difficulty?: DifficultyRating;
  tags?: string[];
}

// 일지 업데이트 데이터
export interface UpdateJournalData {
  notes?: string;
  mood?: Mood;
  difficulty?: DifficultyRating;
  tags?: string[];
}
