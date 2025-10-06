import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  completeReadingActivity,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { ReadingProgress } from '@/types/progress';

/**
 * Reading Activity 진행률 관리 Hook
 *
 * 기능:
 * - 읽기 시간 및 WPM 추적
 * - 이해도 문제 점수 저장
 * - 완료 상태 관리
 */
export function useReadingProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 진행률 불러오기
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getActivityProgress<ReadingProgress>(
          user.uid,
          activityId
        );
        setProgress(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching reading progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, activityId]);

  /**
   * Reading Activity 완료 처리
   * @param readingTime 읽기 소요 시간 (초)
   * @param wpm Words Per Minute
   * @param comprehensionScore 이해도 점수 (0-100)
   * @param questionsAnswered 답변한 문제 수
   * @param totalQuestions 전체 문제 수
   */
  const completeActivity = async (
    readingTime: number,
    wpm: number,
    comprehensionScore: number,
    questionsAnswered: number,
    totalQuestions: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeReadingActivity(
        user.uid,
        activityId,
        weekId,
        readingTime,
        wpm,
        comprehensionScore,
        questionsAnswered,
        totalQuestions
      );

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<ReadingProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error completing reading activity:', err);
      throw err;
    }
  };

  /**
   * 진행률 부분 업데이트
   * 예: 읽기 시작 시간 기록, 중간 저장 등
   */
  const updateProgress = async (
    updates: Partial<Omit<ReadingProgress, 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates);

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<ReadingProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error updating reading progress:', err);
      throw err;
    }
  };

  return {
    progress,
    loading,
    error,
    completeActivity,
    updateProgress,
    isCompleted: progress?.completed || false,
    // 추가 헬퍼
    readingTime: progress?.readingTime || 0,
    wpm: progress?.wpm || 0,
    comprehensionScore: progress?.comprehensionScore || 0,
  };
}
