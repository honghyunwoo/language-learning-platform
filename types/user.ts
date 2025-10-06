// 사용자 타입 정의
export type UserLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type LearningGoal = 'travel' | 'business' | 'exam' | 'hobby';
export type DailyLearningTime = 30 | 60 | 90;

export interface User {
  uid: string;
  email: string;
  nickname: string;
  level: UserLevel;
  learningGoal: LearningGoal;
  dailyLearningTime: DailyLearningTime;
  profilePictureUrl: string | null;
  bio: string;
  createdAt: string;
  currentWeek: string; // 'A2-W2' 형식
  streak: number;
  lastLearningDate: string; // YYYY-MM-DD
  totalLearningTime: number; // 분 단위
  badges: string[];
  followerCount: number;
  followingCount: number;
  settings: UserSettings;
}

export interface UserSettings {
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  textSize: 'small' | 'medium' | 'large';
  profilePublic: boolean;
}

export interface UserProgress {
  weekId: string;
  level: UserLevel;
  weekNumber: number;
  startedAt: string;
  completedAt: string | null;
  checkedActivities: string[];
  weeklyGoals: string[];
  goalsAchieved: string[];
  learningTimeLog: LearningTimeEntry[];
  notes: string;
}

export interface LearningTimeEntry {
  date: string; // YYYY-MM-DD
  minutes: number;
}
