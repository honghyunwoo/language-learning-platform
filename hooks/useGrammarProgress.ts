import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  completeGrammarActivity,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { GrammarProgress } from '@/types/progress';

/**
 * Grammar Activity 진행률 관리 Hook
 *
 * 기능:
 * - 연습 문제 완료 추적
 * - 정답률 계산
 * - 취약점 분석 (자주 틀린 문법 포인트)
 */
export function useGrammarProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<GrammarProgress | null>(null);
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
        const data = await getActivityProgress<GrammarProgress>(
          user.uid,
          activityId
        );
        setProgress(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching grammar progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, activityId]);

  /**
   * Grammar Activity 완료 처리
   * @param exercisesCompleted 완료한 연습 문제 수
   * @param totalExercises 전체 연습 문제 수
   * @param correctAnswers 정답 수
   * @param totalAttempts 전체 시도 수
   * @param weakPoints 취약점 목록 (예: ["present_simple", "past_tense"])
   */
  const completeActivity = async (
    exercisesCompleted: number,
    totalExercises: number,
    correctAnswers: number,
    totalAttempts: number,
    weakPoints: string[] = []
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeGrammarActivity(
        user.uid,
        activityId,
        weekId,
        exercisesCompleted,
        totalExercises,
        correctAnswers,
        totalAttempts,
        weakPoints
      );

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<GrammarProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error completing grammar activity:', err);
      throw err;
    }
  };

  /**
   * 진행률 부분 업데이트
   * 예: 연습 문제 하나씩 완료할 때마다 호출
   */
  const updateProgress = async (
    updates: Partial<Omit<GrammarProgress, 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates);

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<GrammarProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error updating grammar progress:', err);
      throw err;
    }
  };

  /**
   * 취약점 추가
   * @param grammarPoint 문법 포인트 (예: "be_verb", "present_simple")
   */
  const addWeakPoint = async (grammarPoint: string) => {
    if (!user || !progress) return;

    const weakPoints = progress.weakPoints || [];
    if (!weakPoints.includes(grammarPoint)) {
      weakPoints.push(grammarPoint);
      await updateProgress({ weakPoints });
    }
  };

  return {
    progress,
    loading,
    error,
    completeActivity,
    updateProgress,
    addWeakPoint,
    isCompleted: progress?.completed || false,
    // 추가 헬퍼
    accuracy: progress?.accuracy || 0,
    weakPoints: progress?.weakPoints || [],
    exercisesCompleted: progress?.exercisesCompleted || 0,
  };
}
