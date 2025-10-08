'use client';

import { useQuery } from '@tanstack/react-query';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProgress } from '@/types/user';

export const useUserProgress = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProgress', userId],
    queryFn: async () => {
      if (!userId || !db) {
        throw new Error('User ID or Firestore not available');
      }

      // 현재 진행 중인 주차 데이터 가져오기
      const progressDoc = await getDoc(
        doc(db, 'userProgress', `${userId}_current`)
      );

      if (progressDoc.exists()) {
        return progressDoc.data() as UserProgress;
      }

      // 데이터가 없으면 기본값 반환 (첫 사용자)
      return null;
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
  });
};

// 주간 통계 계산 훅
export const useWeeklyStats = (userId: string | undefined) => {
  const { data: progress } = useUserProgress(userId);

  // 최근 7일 학습 시간 데이터
  const weeklyData = progress?.learningTimeLog?.slice(-7) || [];

  // 이번 주 총 학습 시간
  const totalWeeklyTime = weeklyData.reduce(
    (sum, entry) => sum + entry.minutes,
    0
  );

  // 목표 달성 여부
  const dailyGoal = 30; // 기본값 (나중에 사용자 설정으로 변경)
  const daysAchieved = weeklyData.filter(
    (entry) => entry.minutes >= dailyGoal
  ).length;

  return {
    weeklyData,
    totalWeeklyTime,
    daysAchieved,
    dailyGoal,
  };
};

// 스트릭 계산 훅 (일지 데이터 기반)
export const useStreak = (userId?: string) => {
  return useQuery({
    queryKey: ['streak', userId],
    queryFn: async () => {
      if (!userId || !db) {
        return { currentStreak: 0, lastLearningDate: '', learnedToday: false };
      }

      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      // 최근 30일 일지 조회
      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId),
        where('date', '>=', thirtyDaysAgo),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map((doc) => doc.data());

      // 학습한 날짜들 (learningTime > 0)
      const learningDates = entries
        .filter((e) => (e.learningTime || 0) > 0)
        .map((e) => e.date)
        .sort()
        .reverse();

      if (learningDates.length === 0) {
        return { currentStreak: 0, lastLearningDate: '', learnedToday: false };
      }

      const lastLearningDate = learningDates[0];
      const learnedToday = lastLearningDate === today;

      // 연속 학습일 계산
      let currentStreak = 0;
      let checkDate = today;

      for (const date of learningDates) {
        if (date === checkDate) {
          currentStreak++;
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
        } else {
          break;
        }
      }

      // 오늘 학습하지 않았다면 어제부터 시작
      if (!learnedToday && learningDates.length > 0) {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        if (lastLearningDate === yesterday) {
          currentStreak = 1;
          const tempDate = new Date(yesterday);
          tempDate.setDate(tempDate.getDate() - 1);
          let tempDateStr = tempDate.toISOString().split('T')[0];

          for (const date of learningDates.slice(1)) {
            if (date === tempDateStr) {
              currentStreak++;
              tempDate.setDate(tempDate.getDate() - 1);
              tempDateStr = tempDate.toISOString().split('T')[0];
            } else {
              break;
            }
          }
        } else {
          currentStreak = 0;
        }
      }

      return {
        currentStreak,
        lastLearningDate,
        learnedToday,
      };
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 5,
  });
};

// 총 학습 시간 계산 훅 (일지 데이터 기반)
export const useLearningTime = (userId?: string) => {
  return useQuery({
    queryKey: ['learningTime', userId],
    queryFn: async () => {
      if (!userId || !db) {
        return { totalMinutes: 0, hours: 0, minutes: 0, formatted: '0시간 0분' };
      }

      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map((doc) => doc.data());

      const totalMinutes = entries.reduce(
        (sum, entry) => sum + (entry.learningTime || 0),
        0
      );
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        totalMinutes,
        hours,
        minutes,
        formatted: `${hours}시간 ${minutes}분`,
      };
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 5,
  });
};

// 이번 주 진행률 계산 훅
export const useWeekProgress = (userId: string | undefined) => {
  const { data: progress } = useUserProgress(userId);

  const totalActivities = progress?.weeklyGoals?.length || 0;
  const completedActivities = progress?.checkedActivities?.length || 0;
  const percentage =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return {
    totalActivities,
    completedActivities,
    percentage,
  };
};
