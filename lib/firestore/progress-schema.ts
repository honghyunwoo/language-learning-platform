/**
 * Firestore Progress Schema
 *
 * 사용자 학습 진행 상황 추적을 위한 데이터 구조
 *
 * Collection 구조:
 * users/{uid}/progress/{weekId}/activities/{activityId}
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Activity 완료 기록
 *
 * 경로: users/{uid}/progress/{weekId}/activities/{activityId}
 */
export interface ActivityProgress {
  /** Activity ID (예: "week-1-vocabulary") */
  activityId: string;

  /** Week ID (예: "1") */
  weekId: string;

  /** 완료 여부 */
  completed: boolean;

  /** 점수 (정답 수) */
  score: number;

  /** 총 문제 수 */
  totalQuestions: number;

  /** 정답 수 */
  correctAnswers: number;

  /** 정답률 (%) */
  accuracy: number;

  /** 시도 횟수 */
  attempts: number;

  /** 첫 시도 시각 */
  firstAttempt: Timestamp;

  /** 마지막 시도 시각 */
  lastAttempt: Timestamp;

  /** 소요 시간 (초) */
  timeSpent: number;

  /** 사용자 답안 (JSON) */
  answers: Record<string, any>;

  /** 메타데이터 */
  metadata?: {
    /** Activity 타입 */
    activityType?: string;
    /** 난이도 레벨 */
    level?: string;
    /** 추가 데이터 */
    [key: string]: any;
  };
}

/**
 * Week 전체 진행률 요약
 *
 * 경로: users/{uid}/progress/{weekId}
 */
export interface WeekProgress {
  /** Week ID */
  weekId: string;

  /** Week 번호 (1-16) */
  weekNumber: number;

  /** 전체 Activity 수 */
  totalActivities: number;

  /** 완료한 Activity 수 */
  completedActivities: number;

  /** 진행률 (%) */
  progressPercentage: number;

  /** 평균 정답률 (%) */
  averageAccuracy: number;

  /** 총 소요 시간 (초) */
  totalTimeSpent: number;

  /** 시작일 */
  startedAt: Timestamp;

  /** 마지막 활동일 */
  lastActivityAt: Timestamp;

  /** 완료일 (80% 이상 완료 시) */
  completedAt?: Timestamp;

  /** Week 완료 여부 */
  isCompleted: boolean;

  /** Activity별 진행 상태 */
  activities: {
    [activityId: string]: {
      completed: boolean;
      accuracy: number;
      attempts: number;
      lastAttempt: Timestamp;
    };
  };
}

/**
 * 사용자 전체 학습 진행률
 *
 * 경로: users/{uid}/progressSummary
 */
export interface UserProgressSummary {
  /** 사용자 ID */
  userId: string;

  /** 현재 학습 중인 Week */
  currentWeek: number;

  /** 전체 Week 수 (16) */
  totalWeeks: number;

  /** 완료한 Week 수 */
  completedWeeks: number;

  /** 전체 진행률 (%) */
  overallProgress: number;

  /** 전체 평균 정답률 (%) */
  overallAccuracy: number;

  /** 총 학습 시간 (초) */
  totalLearningTime: number;

  /** 학습 시작일 */
  startedAt: Timestamp;

  /** 마지막 학습일 */
  lastLearningAt: Timestamp;

  /** 연속 학습 일수 */
  currentStreak: number;

  /** 최장 연속 학습 일수 */
  longestStreak: number;

  /** Week별 진행 상태 */
  weeklyProgress: {
    [weekId: string]: {
      completed: boolean;
      progressPercentage: number;
      completedAt?: Timestamp;
    };
  };

  /** 통계 */
  stats: {
    /** 총 완료한 Activity 수 */
    totalActivitiesCompleted: number;
    /** 총 Activity 수 */
    totalActivities: number;
    /** 강점 Activity 타입 (정답률 기준) */
    strengths: string[];
    /** 약점 Activity 타입 (정답률 기준) */
    weaknesses: string[];
  };
}

/**
 * Activity 완료 요청 데이터
 */
export interface SaveActivityProgressRequest {
  weekId: string;
  activityId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: Record<string, any>;
  activityType?: string;
  level?: string;
}

/**
 * Week 진행률 조회 응답
 */
export interface GetWeekProgressResponse {
  weekProgress: WeekProgress;
  activities: ActivityProgress[];
}

/**
 * Firestore 경로 헬퍼
 */
export const FirestorePaths = {
  /** 사용자 진행률 루트 */
  userProgress: (userId: string) => `users/${userId}/progress`,

  /** Week 진행률 */
  weekProgress: (userId: string, weekId: string) =>
    `users/${userId}/progress/${weekId}`,

  /** Activity 진행률 */
  activityProgress: (userId: string, weekId: string, activityId: string) =>
    `users/${userId}/progress/${weekId}/activities/${activityId}`,

  /** 전체 진행률 요약 */
  progressSummary: (userId: string) => `users/${userId}/progressSummary`,
};

/**
 * 진행률 계산 유틸리티
 */
export const ProgressUtils = {
  /**
   * 정답률 계산
   */
  calculateAccuracy(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  },

  /**
   * 진행률 계산
   */
  calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  /**
   * Week 완료 여부 판정 (80% 이상)
   */
  isWeekCompleted(completedActivities: number, totalActivities: number): boolean {
    const progress = this.calculateProgress(completedActivities, totalActivities);
    return progress >= 80;
  },

  /**
   * Activity 타입별 평균 정답률 계산
   */
  calculateAverageAccuracyByType(
    activities: ActivityProgress[]
  ): Record<string, number> {
    const typeGroups: Record<string, number[]> = {};

    activities.forEach((activity) => {
      const type = activity.metadata?.activityType || 'unknown';
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(activity.accuracy);
    });

    const averages: Record<string, number> = {};
    Object.entries(typeGroups).forEach(([type, accuracies]) => {
      const sum = accuracies.reduce((acc, val) => acc + val, 0);
      averages[type] = Math.round(sum / accuracies.length);
    });

    return averages;
  },

  /**
   * 강점/약점 분석 (상위/하위 2개)
   */
  analyzeStrengthsWeaknesses(
    averages: Record<string, number>
  ): { strengths: string[]; weaknesses: string[] } {
    const sorted = Object.entries(averages).sort(([, a], [, b]) => b - a);

    return {
      strengths: sorted.slice(0, 2).map(([type]) => type),
      weaknesses: sorted.slice(-2).map(([type]) => type),
    };
  },
};
