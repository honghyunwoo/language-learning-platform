/**
 * useProgress Hook
 *
 * 사용자 학습 진행 상황 관리를 위한 React Hook
 *
 * 기능:
 * - Week별 진행률 조회
 * - Activity 완료 저장
 * - 전체 진행률 요약
 * - 실시간 업데이트
 */

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  Timestamp,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  ActivityProgress,
  WeekProgress,
  UserProgressSummary,
  SaveActivityProgressRequest,
  FirestorePaths,
  ProgressUtils,
} from '@/lib/firestore/progress-schema';
import { useAuth } from '@/lib/hooks/useAuth';

interface UseProgressReturn {
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 */
  error: string | null;
  /** Activity 완료 저장 */
  saveActivityProgress: (data: SaveActivityProgressRequest) => Promise<void>;
  /** Week 진행률 조회 */
  getWeekProgress: (weekId: string) => Promise<WeekProgress | null>;
  /** Activity 진행 상황 조회 */
  getActivityProgress: (weekId: string, activityId: string) => Promise<ActivityProgress | null>;
  /** 전체 진행률 요약 조회 */
  getUserProgressSummary: () => Promise<UserProgressSummary | null>;
  /** 진행률 새로고침 */
  refreshProgress: () => Promise<void>;
}

/**
 * useProgress Hook
 */
export function useProgress(): UseProgressReturn {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Activity 완료 저장
   */
  const saveActivityProgress = useCallback(
    async (data: SaveActivityProgressRequest) => {
      if (!user) {
        setError('로그인이 필요합니다.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userId = user.uid;
        const { weekId, activityId } = data;

        // 1. Activity Progress 저장
        const activityRef = doc(
          db,
          FirestorePaths.activityProgress(userId, weekId, activityId)
        );

        const existingActivity = await getDoc(activityRef);
        const attempts = existingActivity.exists()
          ? (existingActivity.data().attempts || 0) + 1
          : 1;

        const accuracy = ProgressUtils.calculateAccuracy(
          data.correctAnswers,
          data.totalQuestions
        );

        const activityProgress: ActivityProgress = {
          activityId,
          weekId,
          completed: accuracy >= 60, // 60% 이상 완료로 간주
          score: data.score,
          totalQuestions: data.totalQuestions,
          correctAnswers: data.correctAnswers,
          accuracy,
          attempts,
          firstAttempt: existingActivity.exists()
            ? existingActivity.data().firstAttempt
            : Timestamp.now(),
          lastAttempt: Timestamp.now(),
          timeSpent: data.timeSpent,
          answers: data.answers,
          metadata: {
            activityType: data.activityType,
            level: data.level,
          },
        };

        await setDoc(activityRef, activityProgress, { merge: true });

        // 2. Week Progress 업데이트
        await updateWeekProgress(userId, weekId);

        // 3. User Progress Summary 업데이트
        await updateUserProgressSummary(userId);

        console.log(`[useProgress] Activity saved: ${activityId}`);
      } catch (err: any) {
        console.error('[useProgress] Error saving activity:', err);
        setError(err.message || 'Activity 저장 실패');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Week 진행률 조회
   */
  const getWeekProgress = useCallback(
    async (weekId: string): Promise<WeekProgress | null> => {
      if (!user) return null;

      setLoading(true);
      setError(null);

      try {
        const weekRef = doc(db, FirestorePaths.weekProgress(user.uid, weekId));
        const weekSnap = await getDoc(weekRef);

        if (!weekSnap.exists()) {
          return null;
        }

        return weekSnap.data() as WeekProgress;
      } catch (err: any) {
        console.error('[useProgress] Error getting week progress:', err);
        setError(err.message || 'Week 진행률 조회 실패');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /**
   * Activity 진행 상황 조회
   */
  const getActivityProgress = useCallback(
    async (weekId: string, activityId: string): Promise<ActivityProgress | null> => {
      if (!user) return null;

      try {
        const activityRef = doc(
          db,
          FirestorePaths.activityProgress(user.uid, weekId, activityId)
        );
        const activitySnap = await getDoc(activityRef);

        if (!activitySnap.exists()) {
          return null;
        }

        return activitySnap.data() as ActivityProgress;
      } catch (err: any) {
        console.error('[useProgress] Error getting activity progress:', err);
        return null;
      }
    },
    [user]
  );

  /**
   * 전체 진행률 요약 조회
   */
  const getUserProgressSummary = useCallback(async (): Promise<UserProgressSummary | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const summaryRef = doc(db, FirestorePaths.progressSummary(user.uid));
      const summarySnap = await getDoc(summaryRef);

      if (!summarySnap.exists()) {
        // 요약이 없으면 생성
        await updateUserProgressSummary(user.uid);
        const newSummarySnap = await getDoc(summaryRef);
        return newSummarySnap.exists() ? (newSummarySnap.data() as UserProgressSummary) : null;
      }

      return summarySnap.data() as UserProgressSummary;
    } catch (err: any) {
      console.error('[useProgress] Error getting user progress summary:', err);
      setError(err.message || '진행률 요약 조회 실패');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * 진행률 새로고침
   */
  const refreshProgress = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await updateUserProgressSummary(user.uid);
    } catch (err: any) {
      console.error('[useProgress] Error refreshing progress:', err);
      setError(err.message || '진행률 새로고침 실패');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    saveActivityProgress,
    getWeekProgress,
    getActivityProgress,
    getUserProgressSummary,
    refreshProgress,
  };
}

/**
 * Week Progress 업데이트 (내부 헬퍼)
 */
async function updateWeekProgress(userId: string, weekId: string): Promise<void> {
  // Week의 모든 Activity 조회
  const activitiesRef = collection(
    db,
    FirestorePaths.weekProgress(userId, weekId),
    'activities'
  );
  const activitiesSnap = await getDocs(activitiesRef);

  const activities: ActivityProgress[] = [];
  activitiesSnap.forEach((doc) => {
    activities.push(doc.data() as ActivityProgress);
  });

  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.completed).length;
  const progressPercentage = ProgressUtils.calculateProgress(
    completedActivities,
    totalActivities
  );

  const totalAccuracy = activities.reduce((sum, a) => sum + a.accuracy, 0);
  const averageAccuracy = totalActivities > 0 ? Math.round(totalAccuracy / totalActivities) : 0;

  const totalTimeSpent = activities.reduce((sum, a) => sum + a.timeSpent, 0);

  const weekNumber = parseInt(weekId, 10);

  const activitiesMap: WeekProgress['activities'] = {};
  activities.forEach((activity) => {
    activitiesMap[activity.activityId] = {
      completed: activity.completed,
      accuracy: activity.accuracy,
      attempts: activity.attempts,
      lastAttempt: activity.lastAttempt,
    };
  });

  const isCompleted = ProgressUtils.isWeekCompleted(completedActivities, totalActivities);

  const weekProgressData: Partial<WeekProgress> = {
    weekId,
    weekNumber,
    totalActivities,
    completedActivities,
    progressPercentage,
    averageAccuracy,
    totalTimeSpent,
    lastActivityAt: Timestamp.now(),
    isCompleted,
    activities: activitiesMap,
  };

  // startedAt은 첫 생성 시에만
  const weekRef = doc(db, FirestorePaths.weekProgress(userId, weekId));
  const existingWeek = await getDoc(weekRef);

  if (!existingWeek.exists()) {
    weekProgressData.startedAt = Timestamp.now();
  }

  // completedAt 설정
  if (isCompleted && !existingWeek.data()?.completedAt) {
    weekProgressData.completedAt = Timestamp.now();
  }

  await setDoc(weekRef, weekProgressData, { merge: true });
}

/**
 * User Progress Summary 업데이트 (내부 헬퍼)
 */
async function updateUserProgressSummary(userId: string): Promise<void> {
  // 모든 Week Progress 조회
  const progressRef = collection(db, FirestorePaths.userProgress(userId));
  const progressSnap = await getDocs(progressRef);

  const weekProgresses: WeekProgress[] = [];
  progressSnap.forEach((doc) => {
    const data = doc.data();
    if (data.weekNumber) {
      // Week progress 문서만 (activities subcollection 제외)
      weekProgresses.push(data as WeekProgress);
    }
  });

  const totalWeeks = 16;
  const completedWeeks = weekProgresses.filter((w) => w.isCompleted).length;
  const overallProgress = ProgressUtils.calculateProgress(completedWeeks, totalWeeks);

  const totalAccuracy = weekProgresses.reduce((sum, w) => sum + w.averageAccuracy, 0);
  const overallAccuracy =
    weekProgresses.length > 0 ? Math.round(totalAccuracy / weekProgresses.length) : 0;

  const totalLearningTime = weekProgresses.reduce((sum, w) => sum + w.totalTimeSpent, 0);

  // 현재 학습 중인 Week (가장 최근 활동 Week)
  const sortedWeeks = weekProgresses.sort((a, b) => {
    const aTime = a.lastActivityAt?.toMillis() || 0;
    const bTime = b.lastActivityAt?.toMillis() || 0;
    return bTime - aTime;
  });
  const currentWeek = sortedWeeks.length > 0 ? sortedWeeks[0].weekNumber : 1;

  const weeklyProgress: UserProgressSummary['weeklyProgress'] = {};
  weekProgresses.forEach((week) => {
    weeklyProgress[week.weekId] = {
      completed: week.isCompleted,
      progressPercentage: week.progressPercentage,
      completedAt: week.completedAt,
    };
  });

  // 통계: 모든 Activity 조회
  let totalActivities = 0;
  let totalActivitiesCompleted = 0;
  const allActivities: ActivityProgress[] = [];

  for (const weekProgress of weekProgresses) {
    const activitiesRef = collection(
      db,
      FirestorePaths.weekProgress(userId, weekProgress.weekId),
      'activities'
    );
    const activitiesSnap = await getDocs(activitiesRef);

    activitiesSnap.forEach((doc) => {
      const activity = doc.data() as ActivityProgress;
      allActivities.push(activity);
      totalActivities++;
      if (activity.completed) totalActivitiesCompleted++;
    });
  }

  const averagesByType = ProgressUtils.calculateAverageAccuracyByType(allActivities);
  const { strengths, weaknesses } = ProgressUtils.analyzeStrengthsWeaknesses(averagesByType);

  const summaryData: Partial<UserProgressSummary> = {
    userId,
    currentWeek,
    totalWeeks,
    completedWeeks,
    overallProgress,
    overallAccuracy,
    totalLearningTime,
    lastLearningAt: Timestamp.now(),
    weeklyProgress,
    stats: {
      totalActivitiesCompleted,
      totalActivities,
      strengths,
      weaknesses,
    },
  };

  // startedAt은 첫 생성 시에만
  const summaryRef = doc(db, FirestorePaths.progressSummary(userId));
  const existingSummary = await getDoc(summaryRef);

  if (!existingSummary.exists()) {
    summaryData.startedAt = Timestamp.now();
    summaryData.currentStreak = 0;
    summaryData.longestStreak = 0;
  } else {
    // 연속 학습 일수 계산 (간단 버전: 마지막 학습일 기준)
    const lastLearning = existingSummary.data()?.lastLearningAt;
    if (lastLearning) {
      const daysSinceLastLearning = Math.floor(
        (Date.now() - lastLearning.toMillis()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastLearning === 0) {
        // 오늘 학습 계속
        summaryData.currentStreak = existingSummary.data()?.currentStreak || 0;
      } else if (daysSinceLastLearning === 1) {
        // 어제 학습 후 오늘 학습 (연속)
        summaryData.currentStreak = (existingSummary.data()?.currentStreak || 0) + 1;
      } else {
        // 중단됨
        summaryData.currentStreak = 1;
      }

      summaryData.longestStreak = Math.max(
        summaryData.currentStreak || 0,
        existingSummary.data()?.longestStreak || 0
      );
    }
  }

  await setDoc(summaryRef, summaryData, { merge: true });
}

export default useProgress;
