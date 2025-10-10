import { useActivityProgress } from './useActivityProgress';
import {
  completeGrammarActivity,
} from '@/lib/firebase/progress';
import type { GrammarProgress } from '@/types/progress';
import { useAuth } from './useAuth';

/**
 * Grammar Activity 진행률 관리 Hook
 */
export function useGrammarProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const { progress, loading, error, updateProgress, fetchProgress } =
    useActivityProgress<GrammarProgress>(activityId);

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

      // 완료 후 상태 리프레시
      await fetchProgress();
    } catch (err) {
      console.error('Error completing grammar activity:', err);
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
