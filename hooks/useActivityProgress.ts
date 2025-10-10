import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { ActivityProgress } from '@/types/progress';

/**
 * 모든 Activity 타입의 진행률을 관리하는 제네릭 Hook
 *
 * @template T - 특정 Activity의 Progress 타입을 나타냅니다 (예: GrammarProgress).
 * @param {string} activityId - 현재 Activity의 ID.
 * @returns 진행률 상태와 관리 함수들을 포함하는 객체.
 */
export function useActivityProgress<T extends ActivityProgress>(
  activityId: string
) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getActivityProgress<T>(user.uid, activityId);
      setProgress(data);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching progress for activity ${activityId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [user, activityId]);

  // 진행률 불러오기
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  /**
   * 진행률 부분 업데이트
   * @param updates - 업데이트할 진행률 데이터의 일부.
   */
  const updateProgress = async (updates: Partial<Omit<T, 'id' | 'userId'>>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates as Partial<ActivityProgress>);
      // 로컬 상태를 즉시 리프레시
      await fetchProgress();
    } catch (err) {
      setError(err as Error);
      console.error(`Error updating progress for activity ${activityId}:`, err);
      throw err;
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    isCompleted: progress?.completed || false,
    fetchProgress, // 외부에서 수동으로 리프레시할 수 있도록 노출
  };
}