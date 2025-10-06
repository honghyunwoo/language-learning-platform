import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  JournalEntry,
  CreateJournalData,
  UpdateJournalData,
  ActivityLog,
} from '@/types/journal';

// 특정 날짜 일지 조회
export const useJournalEntry = (userId: string | undefined, date: string | undefined) => {
  return useQuery({
    queryKey: ['journal', userId, date],
    queryFn: async () => {
      if (!userId || !date || !db) return null;

      const entryId = `${userId}_${date}`;
      const entryDoc = await getDoc(doc(db, 'journalEntries', entryId));

      if (!entryDoc.exists()) return null;

      return entryDoc.data() as JournalEntry;
    },
    enabled: !!userId && !!date && !!db,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 날짜 범위로 일지 조회
export const useJournalEntries = (
  userId: string | undefined,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['journal', userId, 'range', startDate, endDate],
    queryFn: async () => {
      if (!userId || !db) return [];

      let q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      if (startDate && endDate) {
        q = query(
          collection(db, 'journalEntries'),
          where('userId', '==', userId),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as JournalEntry);
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 5,
  });
};

// 일지 생성
export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: CreateJournalData;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const entryId = `${userId}_${data.date}`;
      const entry: JournalEntry = {
        id: entryId,
        userId,
        date: data.date,
        learningTime: 0,
        completedActivities: [],
        notes: data.notes || '',
        mood: data.mood,
        difficulty: data.difficulty,
        tags: data.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'journalEntries', entryId), entry);
      return entry;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId],
      });
    },
  });
};

// 일지 업데이트
export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      date,
      data,
    }: {
      userId: string;
      date: string;
      data: UpdateJournalData;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const entryId = `${userId}_${date}`;
      await updateDoc(doc(db, 'journalEntries', entryId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      return { userId, date, data };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId, 'range'],
      });
    },
  });
};

// 활동 로그 추가 (자동 일지 업데이트)
export const useAddActivityLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      date,
      activityLog,
    }: {
      userId: string;
      date: string;
      activityLog: ActivityLog;
    }) => {
      if (!db) throw new Error('Firestore not initialized');

      const entryId = `${userId}_${date}`;
      const entryRef = doc(db, 'journalEntries', entryId);
      const entryDoc = await getDoc(entryRef);

      if (!entryDoc.exists()) {
        // 일지가 없으면 새로 생성
        const newEntry: JournalEntry = {
          id: entryId,
          userId,
          date,
          learningTime: activityLog.timeSpent,
          completedActivities: [activityLog],
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(entryRef, newEntry);
        return newEntry;
      } else {
        // 기존 일지에 추가
        const currentEntry = entryDoc.data() as JournalEntry;
        const updatedActivities = [...currentEntry.completedActivities, activityLog];
        const updatedTime = currentEntry.learningTime + activityLog.timeSpent;

        await updateDoc(entryRef, {
          completedActivities: updatedActivities,
          learningTime: updatedTime,
          updatedAt: new Date().toISOString(),
        });

        return {
          ...currentEntry,
          completedActivities: updatedActivities,
          learningTime: updatedTime,
        };
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId, 'range'],
      });
    },
  });
};

// 일지 삭제
export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, date }: { userId: string; date: string }) => {
      if (!db) throw new Error('Firestore not initialized');

      const entryId = `${userId}_${date}`;
      await deleteDoc(doc(db, 'journalEntries', entryId));

      return { userId, date };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['journal', variables.userId],
      });
    },
  });
};

// 월간 통계 계산
export const useMonthlyStats = (userId: string | undefined, month: string | undefined) => {
  const startDate = month ? `${month}-01` : undefined;
  const endDate = month
    ? `${month}-${new Date(month + '-01').getDate() === 31 ? 31 : 30}`
    : undefined;

  const { data: entries } = useJournalEntries(userId, startDate, endDate);

  return useQuery({
    queryKey: ['monthlyStats', userId, month],
    queryFn: () => {
      if (!entries || entries.length === 0) return null;

      const totalLearningTime = entries.reduce((sum, e) => sum + e.learningTime, 0);
      const learningDays = entries.filter((e) => e.learningTime > 0).length;
      const completedActivities = entries.reduce(
        (sum, e) => sum + e.completedActivities.length,
        0
      );
      const averageDailyTime = learningDays > 0 ? totalLearningTime / learningDays : 0;

      // 가장 많이 학습한 요일 계산
      const dayCount: Record<string, number> = {};
      entries.forEach((entry) => {
        const day = new Date(entry.date).toLocaleDateString('ko-KR', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + entry.learningTime;
      });
      const mostProductiveDay =
        Object.keys(dayCount).length > 0
          ? Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
          : '없음';

      // 가장 많이 한 활동 타입
      const typeCount: Record<string, number> = {};
      entries.forEach((entry) => {
        entry.completedActivities.forEach((activity) => {
          typeCount[activity.activityType] =
            (typeCount[activity.activityType] || 0) + 1;
        });
      });
      const favoriteActivityType =
        Object.keys(typeCount).length > 0
          ? Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0]
          : undefined;

      return {
        month: month || '',
        totalLearningTime,
        learningDays,
        completedActivities,
        averageDailyTime,
        mostProductiveDay,
        favoriteActivityType,
      };
    },
    enabled: !!entries,
  });
};
