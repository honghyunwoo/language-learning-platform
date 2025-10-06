import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getOverallProgress, getWeekProgress } from '@/lib/firebase/progress';
import type { OverallProgress, WeekProgress } from '@/types/progress';

/**
 * Overall Progress 관리 Hook
 *
 * 기능:
 * - 전체 주차 진행률 조회
 * - 현재 주차 결정
 * - 주차별 완료율 계산
 * - 전체 완료율 계산
 */
export function useOverallProgress() {
  const { currentUser: user } = useAuth();
  const [overallProgress, setOverallProgress] =
    useState<OverallProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 전체 진행률 불러오기
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOverallProgress = async () => {
      try {
        setLoading(true);
        const data = await getOverallProgress(user.uid);
        setOverallProgress(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching overall progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallProgress();
  }, [user]);

  /**
   * 특정 주차 진행률 조회
   * @param weekId 주차 ID (예: "week-1")
   */
  const getWeekProgressById = async (
    weekId: string
  ): Promise<WeekProgress | null> => {
    if (!user) return null;

    try {
      const weekProgress = await getWeekProgress(user.uid, weekId);
      return weekProgress;
    } catch (err) {
      console.error(`Error fetching progress for ${weekId}:`, err);
      return null;
    }
  };

  /**
   * 전체 진행률 새로고침
   */
  const refreshProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getOverallProgress(user.uid);
      setOverallProgress(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error refreshing overall progress:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 현재 주차 결정
   * 로직: 첫 번째 미완료 주차 또는 마지막 주차
   */
  const getCurrentWeek = (): string => {
    if (!overallProgress || overallProgress.weeks.length === 0) {
      return 'week-1'; // 기본값
    }

    // 첫 번째 미완료 주차 찾기
    const incompleteWeek = overallProgress.weeks.find(
      (week) => week.progressPercentage < 100
    );

    if (incompleteWeek) {
      return incompleteWeek.weekId;
    }

    // 모든 주차가 완료되었으면 마지막 주차 반환
    const lastWeek =
      overallProgress.weeks[overallProgress.weeks.length - 1];
    return lastWeek.weekId;
  };

  /**
   * 특정 주차가 완료되었는지 확인
   * @param weekId 주차 ID
   */
  const isWeekCompleted = (weekId: string): boolean => {
    if (!overallProgress) return false;

    const week = overallProgress.weeks.find((w) => w.weekId === weekId);
    return week ? week.progressPercentage === 100 : false;
  };

  /**
   * 다음 주차로 진행 가능한지 확인
   * @param currentWeekId 현재 주차 ID
   */
  const canProgressToNextWeek = (currentWeekId: string): boolean => {
    return isWeekCompleted(currentWeekId);
  };

  return {
    overallProgress,
    loading,
    error,
    refreshProgress,
    getWeekProgressById,
    getCurrentWeek,
    isWeekCompleted,
    canProgressToNextWeek,
    // 추가 헬퍼
    totalActivitiesCompleted: overallProgress?.totalActivitiesCompleted || 0,
    totalActivities: overallProgress?.totalActivities || 0,
    overallCompletionPercentage:
      overallProgress?.progressPercentage || 0,
    weekProgress: overallProgress?.weeks || [],
  };
}
