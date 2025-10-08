import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserWeekProgress, ActivitySession } from '@/types/curriculum';
import { curriculumData, getWeekById } from '@/lib/curriculum/curriculumData';

// 레벨별 주차 목록 조회
export const useCurriculumWeeks = (level?: string) => {
  return useQuery({
    queryKey: ['curriculum', 'weeks', level],
    queryFn: async () => {
      if (!level) return [];
      // 현재는 로컬 데이터 사용, 추후 Firestore로 전환
      return curriculumData.filter((week) => week.level === level);
    },
    enabled: !!level,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 특정 주차 상세 조회
export const useCurriculumWeek = (weekId: string | undefined) => {
  return useQuery({
    queryKey: ['curriculum', 'week', weekId],
    queryFn: async () => {
      if (!weekId) return null;
      // 현재는 로컬 데이터 사용
      return getWeekById(weekId) || null;
    },
    enabled: !!weekId,
    staleTime: 1000 * 60 * 10,
  });
};

// 사용자 주차 진행률 조회
export const useWeekProgress = (userId: string | undefined, weekId: string | undefined) => {
  return useQuery({
    queryKey: ['weekProgress', userId, weekId],
    queryFn: async () => {
      if (!userId || !weekId || !db) return null;

      const progressId = `${userId}_${weekId}`;
      const progressDoc = await getDoc(doc(db, 'weekProgress', progressId));

      if (!progressDoc.exists()) {
        // 진행률 데이터가 없으면 초기 상태 반환
        return {
          id: progressId,
          userId,
          weekId,
          status: 'available' as const,
          completedActivities: [],
          timeSpent: 0,
          lastAccessedAt: new Date().toISOString(),
        } as UserWeekProgress;
      }

      return progressDoc.data() as UserWeekProgress;
    },
    enabled: !!userId && !!weekId && !!db,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 사용자의 모든 주차 진행률 조회
export const useAllWeekProgress = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['weekProgress', userId, 'all'],
    queryFn: async () => {
      if (!userId || !db) return [];

      const q = query(
        collection(db, 'weekProgress'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data() as UserWeekProgress);
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 5,
  });
};

// 활동 시작
export const useStartActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      weekId,
      activityId,
    }: {
      userId: string;
      weekId: string;
      activityId: string;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const sessionId = `${userId}_${weekId}_${activityId}_${Date.now()}`;
      const session: ActivitySession = {
        id: sessionId,
        userId,
        weekId,
        activityId,
        startedAt: new Date().toISOString(),
        timeSpent: 0,
        completed: false,
      };

      await setDoc(doc(db, 'activitySessions', sessionId), session);

      // 주차 진행률 업데이트 (시작 상태)
      const progressId = `${userId}_${weekId}`;
      const progressRef = doc(db, 'weekProgress', progressId);
      const progressDoc = await getDoc(progressRef);

      if (!progressDoc.exists()) {
        // 새 진행률 생성
        const newProgress: UserWeekProgress = {
          id: progressId,
          userId,
          weekId,
          status: 'in_progress',
          startedAt: new Date().toISOString(),
          completedActivities: [],
          timeSpent: 0,
          lastAccessedAt: new Date().toISOString(),
        };
        await setDoc(progressRef, newProgress);
      } else {
        // 기존 진행률 업데이트
        await updateDoc(progressRef, {
          status: 'in_progress',
          lastAccessedAt: new Date().toISOString(),
        });
      }

      return session;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['weekProgress', variables.userId, variables.weekId],
      });
    },
  });
};

// 활동 완료
export const useCompleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      weekId,
      activityId,
      timeSpent,
    }: {
      userId: string;
      weekId: string;
      activityId: string;
      timeSpent: number;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const progressId = `${userId}_${weekId}`;
      const progressRef = doc(db, 'weekProgress', progressId);
      const progressDoc = await getDoc(progressRef);

      const currentData = progressDoc.exists()
        ? (progressDoc.data() as UserWeekProgress)
        : null;

      const completedActivities = currentData?.completedActivities || [];
      const currentTimeSpent = currentData?.timeSpent || 0;

      // 이미 완료한 활동이 아니면 추가
      if (!completedActivities.includes(activityId)) {
        completedActivities.push(activityId);
      }

      // 주차 데이터 가져오기
      const weekData = getWeekById(weekId);
      const requiredActivities =
        weekData?.activities.filter((a) => a.requiredForCompletion) || [];
      const allRequiredCompleted = requiredActivities.every((a) =>
        completedActivities.includes(a.id)
      );

      const updatedProgress: UserWeekProgress = {
        id: progressId,
        userId,
        weekId,
        status: allRequiredCompleted ? 'completed' : 'in_progress',
        startedAt: currentData?.startedAt || new Date().toISOString(),
        completedAt: allRequiredCompleted ? new Date().toISOString() : undefined,
        completedActivities,
        timeSpent: currentTimeSpent + timeSpent,
        lastAccessedAt: new Date().toISOString(),
      };

      await setDoc(progressRef, updatedProgress);

      // 일지 자동 업데이트
      const today = new Date().toISOString().split('T')[0];
      const activity = weekData?.activities.find((a) => a.id === activityId);

      if (activity) {
        const journalId = `${userId}_${today}`;
        const journalRef = doc(db, 'journalEntries', journalId);
        const journalDoc = await getDoc(journalRef);

        const activityLog = {
          weekId,
          activityId,
          activityTitle: activity.title,
          activityType: activity.type,
          timeSpent,
          completedAt: new Date().toISOString(),
        };

        if (!journalDoc.exists()) {
          // 새 일지 생성
          await setDoc(journalRef, {
            id: journalId,
            userId,
            date: today,
            learningTime: timeSpent,
            completedActivities: [activityLog],
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // 기존 일지 업데이트
          const current = journalDoc.data();
          await updateDoc(journalRef, {
            learningTime: (current.learningTime || 0) + timeSpent,
            completedActivities: [...(current.completedActivities || []), activityLog],
            updatedAt: new Date().toISOString(),
          });
        }
      }

      return updatedProgress;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['weekProgress', variables.userId, variables.weekId],
      });
      queryClient.invalidateQueries({
        queryKey: ['weekProgress', variables.userId, 'all'],
      });
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId],
      });
    },
  });
};

// 활동 완료 취소
export const useUncompleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      weekId,
      activityId,
    }: {
      userId: string;
      weekId: string;
      activityId: string;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const progressId = `${userId}_${weekId}`;
      const progressRef = doc(db, 'weekProgress', progressId);
      const progressDoc = await getDoc(progressRef);

      if (!progressDoc.exists()) return null;

      const currentData = progressDoc.data() as UserWeekProgress;
      const completedActivities = currentData.completedActivities.filter(
        (id) => id !== activityId
      );

      await updateDoc(progressRef, {
        completedActivities,
        status: completedActivities.length === 0 ? 'available' : 'in_progress',
        completedAt: null,
        lastAccessedAt: new Date().toISOString(),
      });

      return { ...currentData, completedActivities };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['weekProgress', variables.userId, variables.weekId],
      });
      queryClient.invalidateQueries({
        queryKey: ['weekProgress', variables.userId, 'all'],
      });
    },
  });
};

// 커리큘럼 통계
export const useCurriculumStats = (userId: string | undefined) => {
  const { data: allProgress } = useAllWeekProgress(userId);

  return useQuery({
    queryKey: ['curriculumStats', userId],
    queryFn: async () => {
      if (!userId || !allProgress) return null;

      const totalWeeks = curriculumData.length;
      const completedWeeks = allProgress.filter((p) => p.status === 'completed').length;
      const inProgressWeeks = allProgress.filter((p) => p.status === 'in_progress').length;

      const totalActivities = curriculumData.reduce(
        (sum, week) => sum + week.activities.length,
        0
      );
      const completedActivities = allProgress.reduce(
        (sum, progress) => sum + progress.completedActivities.length,
        0
      );
      const totalTimeSpent = allProgress.reduce(
        (sum, progress) => sum + progress.timeSpent,
        0
      );

      const averageCompletionTime =
        completedWeeks > 0 ? totalTimeSpent / completedWeeks : 0;

      // 현재 진행 중인 주차 찾기
      const inProgress = allProgress.find((p) => p.status === 'in_progress');
      const currentWeek = inProgress?.weekId || 'A1-W1';
      const currentWeekData = getWeekById(currentWeek);

      return {
        totalWeeks,
        completedWeeks,
        inProgressWeeks,
        totalActivities,
        completedActivities,
        totalTimeSpent,
        averageCompletionTime,
        currentLevel: currentWeekData?.level || 'A1',
        currentWeek,
      };
    },
    enabled: !!userId && !!allProgress,
  });
};
