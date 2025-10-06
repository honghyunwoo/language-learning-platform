import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getActivityProgress,
  completeSpeakingActivity,
  updateActivityProgress,
} from '@/lib/firebase/progress';
import type { SpeakingProgress } from '@/types/progress';

/**
 * Speaking Activity 진행률 관리 Hook
 *
 * 기능:
 * - 녹음 완료한 문장 수 추적
 * - 녹음 시간 추적
 * - 녹음 시도 횟수 추적
 * - 자가 평가 결과 저장
 */
export function useSpeakingProgress(activityId: string, weekId: string) {
  const { currentUser: user } = useAuth();
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);
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
        const data = await getActivityProgress<SpeakingProgress>(
          user.uid,
          activityId
        );
        setProgress(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching speaking progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, activityId]);

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

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<SpeakingProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error completing speaking activity:', err);
      throw err;
    }
  };

  /**
   * 진행률 부분 업데이트
   * 예: 녹음 하나씩 완료할 때마다 호출
   */
  const updateProgress = async (
    updates: Partial<Omit<SpeakingProgress, 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await updateActivityProgress(user.uid, activityId, updates);

      // 로컬 상태 업데이트
      const updatedProgress = await getActivityProgress<SpeakingProgress>(
        user.uid,
        activityId
      );
      setProgress(updatedProgress);
    } catch (err) {
      setError(err as Error);
      console.error('Error updating speaking progress:', err);
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
