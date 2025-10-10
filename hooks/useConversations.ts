// hooks/useConversations.ts
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import type {
  Conversation,
  ConversationProgress,
  ConversationResult
} from '@/types/conversation';

// 모든 대화 시나리오 가져오기
export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      // JSON 파일에서 로드
      const fileNames = [
        'cafe-order',
        'asking-directions',
        'self-introduction',
        'phone-reservation',
        'shopping',
      ];

      const conversations = await Promise.all(
        fileNames.map(async (fileName) => {
          try {
            const response = await fetch(`/data/conversations/${fileName}.json`);
            if (!response.ok) throw new Error(`Failed to load ${fileName}`);
            return await response.json();
          } catch (error) {
            console.error(`Error loading conversation ${fileName}:`, error);
            return null;
          }
        })
      );

      return conversations.filter((c): c is Conversation => c !== null);
    },
    staleTime: 60 * 60 * 1000, // 1시간 (JSON 파일이므로 자주 변하지 않음)
  });
}

// 특정 대화 시나리오 가져오기
export function useConversation(conversationId: string) {
  return useQuery<Conversation>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const filename = conversationId.replace('conv-', '');
      const response = await fetch(`/data/conversations/${filename}.json`);
      if (!response.ok) throw new Error('Conversation not found');
      return await response.json();
    },
    enabled: !!conversationId,
    staleTime: 60 * 60 * 1000,
  });
}

// 사용자의 대화 진행 상황 가져오기
export function useConversationProgress(conversationId: string) {
  const { currentUser } = useAuth();

  return useQuery<ConversationProgress | null>({
    queryKey: ['conversationProgress', conversationId, currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid || !db) return null;

      const docRef = doc(db, 'users', currentUser.uid, 'conversationProgress', conversationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        ...data,
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
      } as ConversationProgress;
    },
    enabled: !!currentUser?.uid && !!conversationId,
  });
}

// 사용자의 모든 대화 결과 가져오기
export function useConversationResults() {
  const { currentUser } = useAuth();

  return useQuery<ConversationResult[]>({
    queryKey: ['conversationResults', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid || !db) return [];

      const q = query(
        collection(db, 'users', currentUser.uid, 'conversationResults'),
        orderBy('completedAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          completedAt: data.completedAt?.toDate(),
        } as ConversationResult;
      });
    },
    enabled: !!currentUser?.uid,
  });
}

// 대화 진행 상황 저장
export function useSaveConversationProgress() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: Omit<ConversationProgress, 'userId'>) => {
      if (!currentUser?.uid || !db) throw new Error('Not authenticated');

      const docRef = doc(
        db,
        'users',
        currentUser.uid,
        'conversationProgress',
        progress.conversationId
      );

      await setDoc(docRef, {
        userId: currentUser.uid,
        ...progress,
        startedAt: progress.startedAt || serverTimestamp(),
        ...(progress.completedAt && { completedAt: serverTimestamp() }),
      });

      return progress.conversationId;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ['conversationProgress', conversationId, currentUser?.uid]
      });
    },
  });
}

// 대화 완료 및 결과 저장
export function useSaveConversationResult() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: Omit<ConversationResult, 'userId'>) => {
      if (!currentUser?.uid || !db) throw new Error('Not authenticated');

      // 결과 저장
      const resultDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'conversationResults',
        `${result.conversationId}-${Date.now()}`
      );

      await setDoc(resultDocRef, {
        userId: currentUser.uid,
        ...result,
        completedAt: serverTimestamp(),
      });

      // 진행 상황을 완료로 표시
      const progressDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'conversationProgress',
        result.conversationId
      );

      await setDoc(progressDocRef, {
        userId: currentUser.uid,
        conversationId: result.conversationId,
        currentNodeId: 'end',
        score: result.score,
        maxScore: result.maxScore,
        choices: result.choices,
        startedAt: serverTimestamp(),
        completedAt: serverTimestamp(),
        isCompleted: true,
      });

      return result.conversationId;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversationResults', currentUser?.uid] });
      queryClient.invalidateQueries({
        queryKey: ['conversationProgress', conversationId, currentUser?.uid]
      });
    },
  });
}

// 대화 진행 상황 관리 hook (로컬 state + Firestore 동기화)
export function useConversationSession(conversationId: string) {
  const { data: conversation } = useConversation(conversationId);
  const { data: savedProgress } = useConversationProgress(conversationId);
  const saveProgress = useSaveConversationProgress();
  const saveResult = useSaveConversationResult();

  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [score, setScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());

  // 저장된 진행 상황 로드
  useEffect(() => {
    if (savedProgress && !savedProgress.isCompleted) {
      setCurrentNodeId(savedProgress.currentNodeId);
      setScore(savedProgress.score);
      setMaxScore(savedProgress.maxScore);
      setChoices(savedProgress.choices);
    }
  }, [savedProgress]);

  // 현재 노드 가져오기
  const currentNode = conversation?.dialogue.find(node => node.id === currentNodeId);

  // 선택 처리
  const makeChoice = (optionId: string) => {
    if (!currentNode || !conversation) return;

    const option = currentNode.options?.find(opt => opt.id === optionId);
    if (!option) return;

    // 점수 추가
    const newScore = score + option.feedback.points;
    const newMaxScore = maxScore + 10; // 각 선택의 최대 점수는 10점
    const newChoices = { ...choices, [currentNodeId]: optionId };

    setScore(newScore);
    setMaxScore(newMaxScore);
    setChoices(newChoices);

    // 다음 노드로 이동
    if (option.nextNodeId) {
      setCurrentNodeId(option.nextNodeId);

      // 진행 상황 저장 (비동기)
      saveProgress.mutate({
        conversationId,
        currentNodeId: option.nextNodeId,
        score: newScore,
        maxScore: newMaxScore,
        choices: newChoices,
        startedAt: new Date(startTime),
        isCompleted: false,
      });
    }
  };

  // 대화 완료
  const completeConversation = () => {
    if (!conversation) return;

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    let performanceLevel: 'excellent' | 'good' | 'needs-improvement' | 'failing';

    if (percentage >= conversation.scoring.excellentThreshold) {
      performanceLevel = 'excellent';
    } else if (percentage >= conversation.scoring.goodThreshold) {
      performanceLevel = 'good';
    } else if (percentage >= conversation.scoring.passingThreshold) {
      performanceLevel = 'needs-improvement';
    } else {
      performanceLevel = 'failing';
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    saveResult.mutate({
      conversationId,
      score,
      maxScore,
      percentage,
      performanceLevel,
      completedAt: new Date(),
      timeSpent,
      choices,
    });
  };

  // 대화 재시작
  const restartConversation = () => {
    setCurrentNodeId('start');
    setScore(0);
    setMaxScore(0);
    setChoices({});
  };

  return {
    conversation,
    currentNode,
    currentNodeId,
    score,
    maxScore,
    choices,
    makeChoice,
    completeConversation,
    restartConversation,
    isCompleted: currentNode?.isEnd || false,
    isSaving: saveProgress.isPending || saveResult.isPending,
  };
}
