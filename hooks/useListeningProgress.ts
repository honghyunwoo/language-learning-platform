import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  completeListeningActivity,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { ListeningProgress } from '@/types/progress';

/**
 * Listening Activity 진행률 관리 Hook
 *
 * 기능:
 * - 듣기 횟수 추적
 * - 스크립트 열람 여부
 * - 받아쓰기 점수
 * - 이해도 점수
 * - 평균 청취 속도
 */
export function useListeningProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<ListeningProgress | null>(null);
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
        const data = await getActivityProgress<ListeningProgress>(
          user.uid,
          activityId
        );
        setProgress(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching listening progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, activityId]);

  /**
   * Listening Activity 완료 처리
   * @param listenCount 듣기 횟수
   * @param transcriptViewed 스크립트를 봤는지
   * @param dictationScore 받아쓰기 점수 (0-100)
   * @param comprehensionScore 이해도 점수 (0-100)
   * @param averageSpeed 평균 청취 속도 (0.5 ~ 1.5)
   */
  const completeActivity = async (
    listenCount: number,
    transcriptViewed: boolean,
    dictationScore: number,
    comprehensionScore: number,
    averageSpeed: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeListeningActivity(
        user.uid,
        activityId,
        weekId,
        listenCount,
        transcriptViewed,
        dictationScore,
        comprehensionScore,
        averageSpeed
      );

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<ListeningProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error completing listening activity:', err);
      throw err;
    }
  };

  /**
   * 진행률 부분 업데이트
   * 예: 듣기 횟수 증가, 스크립트 열람 기록
   */
  const updateProgress = async (
    updates: Partial<Omit<ListeningProgress, 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates);

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<ListeningProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error updating listening progress:', err);
      throw err;
    }
  };

  /**
   * 듣기 횟수 증가
   */
  const incrementListenCount = async () => {
    if (!user || !progress) return;

    const newCount = (progress.listenCount || 0) + 1;
    await updateProgress({ listenCount: newCount });
  };

  /**
   * 스크립트 열람 기록
   */
  const markTranscriptViewed = async () => {
    if (!user || !progress) return;

    if (!progress.transcriptViewed) {
      await updateProgress({ transcriptViewed: true });
    }
  };

  return {
    progress,
    loading,
    error,
    completeActivity,
    updateProgress,
    incrementListenCount,
    markTranscriptViewed,
    isCompleted: progress?.completed || false,
    // 추가 헬퍼
    listenCount: progress?.listenCount || 0,
    transcriptViewed: progress?.transcriptViewed || false,
    dictationScore: progress?.dictationScore || 0,
    comprehensionScore: progress?.comprehensionScore || 0,
    averageSpeed: progress?.averageSpeed || 1.0,
  };
}
