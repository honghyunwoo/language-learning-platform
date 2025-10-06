// 알림 타입
export type NotificationType =
  | 'daily_reminder'     // 일일 학습 리마인더
  | 'streak_warning'     // 스트릭 위험 알림
  | 'badge_unlocked'     // 배지 획득
  | 'weekly_report'      // 주간 리포트
  | 'community_reply'    // 커뮤니티 답변
  | 'community_like'     // 좋아요
  | 'achievement';       // 성취 달성

// 알림 우선순위
export type NotificationPriority = 'low' | 'medium' | 'high';

// 알림
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, unknown>; // 추가 데이터
  link?: string; // 클릭 시 이동할 링크
  isRead: boolean;
  createdAt: string;
}

// 알림 설정
export interface NotificationSettings {
  userId: string;
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:MM 형식
  streakWarning: boolean;
  weeklyReport: boolean;
  weeklyReportDay: number; // 0=일요일, 6=토요일
  achievements: boolean;
  community: boolean;
  updatedAt: string;
}

// 알림 생성 데이터
export interface CreateNotificationData {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  link?: string;
}
