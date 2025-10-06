import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  completeVocabularyActivity,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { VocabularyProgress } from '@/types/progress';

export function useVocabularyProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<VocabularyProgress | null>(null);
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
        const data = await getActivityProgress<VocabularyProgress>(
          user.uid,
          activityId
        );
        setProgress(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, activityId]);

  // 완료 처리
  const completeActivity = async (
    wordsMastered: number,
    totalWords: number,
    quizScore: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeVocabularyActivity(
        user.uid,
        activityId,
        weekId,
        wordsMastered,
        totalWords,
        quizScore
      );

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<VocabularyProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // 부분 업데이트
  const updateProgress = async (
    updates: Partial<Omit<VocabularyProgress, 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates);

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<VocabularyProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
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
  };
}
