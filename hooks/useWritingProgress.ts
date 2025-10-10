import { useActivityProgress } from './useActivityProgress';
import { useAuth } from './useAuth';
import {
  completeWritingActivity,
} from '@/lib/firebase/progress';
import type { WritingProgress } from '@/types/progress';

/**
 * Writing Activity 진행률 관리 Hook
 *
 * 기능:
 * - 작성 중인 글 임시 저장 (draft)
 * - 제출된 글 저장
 * - 단어 수 추적
 * - 작성 시간 추적
 * - 자가 평가 결과 저장
 */
export function useWritingProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const { progress, loading, error, updateProgress, fetchProgress } =
    useActivityProgress<WritingProgress>(activityId);

  /**
   * Writing Activity 완료 처리
   * @param submittedText 제출한 글
   * @param wordCount 단어 수
   * @param writingTime 작성 시간 (초)
   * @param selfEvaluation 자가 평가 결과
   */
  const completeActivity = async (
    submittedText: string,
    wordCount: number,
    writingTime: number,
    selfEvaluation?: { checkedItems: number; totalItems: number }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeWritingActivity(
        user.uid,
        activityId,
        weekId,
        submittedText,
        wordCount,
        writingTime,
        selfEvaluation
      );

      // 완료 후 상태 리프레시
      await fetchProgress();
    } catch (err) {
      console.error('Error completing writing activity:', err);
      throw err;
    }
  };

  /**
   * Draft 저장 (Firestore에 임시 저장)
   * @param draft 작성 중인 글
   * @param wordCount 현재 단어 수
   */
  const saveDraft = async (draft: string, wordCount: number) => {
    if (!user) return;

    try {
      await updateProgress({
        draft,
        wordCount,
        submitted: false,
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      // Draft 저장 실패는 사용자에게 알리지 않음 (localStorage 사용 가능)
    }
  };

  /**
   * 자가 평가 결과 저장
   * @param checkedItems 체크한 항목 수
   * @param totalItems 전체 항목 수
   */
  const saveSelfEvaluation = async (
    checkedItems: number,
    totalItems: number
  ) => {
    if (!user) return;

    await updateProgress({
      selfEvaluation: { checkedItems, totalItems },
    });
  };

  return {
    progress,
    loading,
    error,
    completeActivity,
    updateProgress,
    saveDraft,
    saveSelfEvaluation,
    isCompleted: progress?.completed || false,
    // 추가 헬퍼
    draft: progress?.draft || '',
    submitted: progress?.submitted || false,
    wordCount: progress?.wordCount || 0,
    writingTime: progress?.writingTime || 0,
    selfEvaluation: progress?.selfEvaluation,
  };
}
