'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 레벨 테스트 결과 타입
export interface LevelTestResult {
  userId: string;
  testDate: string;
  grammarScore: number;
  vocabularyScore: number;
  listeningScore: number;
  averageScore: number;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  recommendedWeek: string;
  grammarCorrect: number;
  vocabularyCorrect: number;
  listeningCorrect: number;
  totalQuestions: number;
}

// 테스트 결과 저장 훅
export const useSaveLevelTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: LevelTestResult) => {
      if (!db) {
        throw new Error('Firestore가 초기화되지 않았습니다.');
      }

      const { userId } = result;

      // 1. 테스트 결과를 levelTestResults 컬렉션에 저장
      const testResultRef = await addDoc(collection(db, 'levelTestResults'), {
        ...result,
        createdAt: Timestamp.now(),
      });

      // 2. 사용자의 최신 레벨 정보를 users 컬렉션에 업데이트
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          level: result.level,
          lastLevelTest: result.testDate,
          recommendedWeek: result.recommendedWeek,
          updatedAt: Timestamp.now(),
        },
        { merge: true } // 기존 데이터 유지하면서 업데이트
      );

      return {
        id: testResultRef.id,
        ...result,
      };
    },
    onSuccess: (data) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['levelTest', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['user', data.userId] });
    },
    onError: (error) => {
      console.error('레벨 테스트 저장 실패:', error);
    },
  });
};

// 최신 테스트 결과 조회 훅
export const useLatestLevelTest = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['levelTest', userId],
    queryFn: async () => {
      if (!userId || !db) {
        return null;
      }

      try {
        // 최신 테스트 결과 1개만 가져오기
        const q = query(
          collection(db, 'levelTestResults'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return null;
        }

        const latestDoc = snapshot.docs[0];
        return {
          id: latestDoc.id,
          ...latestDoc.data(),
        } as LevelTestResult & { id: string };
      } catch (error) {
        console.error('레벨 테스트 결과 조회 실패:', error);
        return null;
      }
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });
};

// 테스트 히스토리 조회 훅
export const useLevelTestHistory = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['levelTestHistory', userId],
    queryFn: async () => {
      if (!userId || !db) {
        return [];
      }

      try {
        const q = query(
          collection(db, 'levelTestResults'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Array<LevelTestResult & { id: string }>;
      } catch (error) {
        console.error('레벨 테스트 히스토리 조회 실패:', error);
        return [];
      }
    },
    enabled: !!userId && !!db,
    staleTime: 1000 * 60 * 30, // 30분
  });
};

// 사용자가 이미 테스트를 완료했는지 확인
export const useHasCompletedLevelTest = (userId: string | undefined) => {
  const { data: latestTest, isLoading } = useLatestLevelTest(userId);

  return {
    hasCompleted: !!latestTest,
    latestTest,
    isLoading,
  };
};
