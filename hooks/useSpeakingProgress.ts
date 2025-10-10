import { useActivityProgress } from './useActivityProgress';
import {
  completeSpeakingActivity,
} from '@/lib/firebase/progress';
import type { SpeakingProgress } from '@/types/progress';
import { useAuth } from './useAuth';

/**
 * Speaking Activity 진행률 관리 Hook
 */
export function useSpeakingProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const { progress, loading, error, updateProgress, fetchProgress } =
    useActivityProgress<SpeakingProgress>(activityId);

  /**
   * Speaking Activity 완료 처리
   * @param recordingsCompleted 녹음 완료한 문장 수
   * @param totalSentences 전체 문장 수
   * @param recordingDuration 총 녹음 시간 (초)
   * @param attempts 녹음 시도 횟수
   * @param selfEvaluation 자가 평가 결과
   */
  const completeActivity = async (
    recordingsCompleted: number,
    totalSentences: number,
    recordingDuration: number,
    attempts: number,
    selfEvaluation?: { checkedItems: number; totalItems: number }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await completeSpeakingActivity(
        user.uid,
        activityId,
        weekId,
        recordingsCompleted,
        totalSentences,
        recordingDuration,
        attempts,
        selfEvaluation
      );

      // 완료 후 상태 리프레시
      await fetchProgress();
    } catch (err) {
      console.error('Error completing speaking activity:', err);
      throw err;
    }
  };

  /**
   * 녹음 완료 문장 수 증가
   */
  const incrementRecordingsCompleted = async () => {
    if (!user || !progress) return;

    const newCount = (progress.recordingsCompleted || 0) + 1;
    await updateProgress({ recordingsCompleted: newCount });
  };

  /**
   * 녹음 시도 횟수 증가
   */
  const incrementAttempts = async () => {
    if (!user || !progress) return;

    const newAttempts = (progress.attempts || 0) + 1;
    await updateProgress({ attempts: newAttempts });
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
    incrementRecordingsCompleted,
    incrementAttempts,
    saveSelfEvaluation,
    isCompleted: progress?.completed || false,
    // 추가 헬퍼
    recordingsCompleted: progress?.recordingsCompleted || 0,
    totalSentences: progress?.totalSentences || 0,
    recordingDuration: progress?.recordingDuration || 0,
    attempts: progress?.attempts || 0,
    selfEvaluation: progress?.selfEvaluation,
  };
}
