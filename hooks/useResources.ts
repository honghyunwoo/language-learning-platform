import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  serverTimestamp,
  QueryFieldFilterConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui';
import { useFirestoreQuery, useFirestoreDocument, useCreateDocument, useToggleSubcollectionDoc } from './useFirestore';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  type: 'youtube' | 'podcast' | 'website' | 'app';
  category: 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  duration?: string; // 분 단위
  rating: number; // 1-5
  viewCount: number;
  bookmarkCount: number;
  isRecommended: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  userId: string;
  userNickname: string;
  rating: number; // 1-5
  content: string;
  createdAt: Timestamp;
  helpfulCount: number;
}

// 리소스 목록 조회
export function useResources(filters?: {
  type?: string;
  category?: string;
  level?: string;
  search?: string;
  isRecommended?: boolean;
}) {
  const queryResult = useFirestoreQuery<Resource>(['resources', filters], (db) => {
    const baseQuery = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(50));
    const q = [
      filters?.type && filters.type !== 'all' && where('type', '==', filters.type),
      filters?.category && filters.category !== 'all' && where('category', '==', filters.category),
      filters?.level && filters.level !== 'all' && where('level', '==', filters.level),
      filters?.isRecommended && where('isRecommended', '==', true),
    ].filter((constraint): constraint is QueryFieldFilterConstraint => Boolean(constraint));
    return query(baseQuery, ...q);
  });

  // 클라이언트 사이드 검색
  if (filters?.search && queryResult.data) {
    const searchTerm = filters.search.toLowerCase();
    const filteredData = queryResult.data.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm) ||
      resource.description.toLowerCase().includes(searchTerm) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    return { ...queryResult, data: filteredData };
  }

  return { ...queryResult,
    staleTime: 10 * 60 * 1000, // 10분
  };
}

// 추천 리소스 조회
export function useRecommendedResources() {
  return useQuery({
    queryKey: ['resources', 'recommended'],
    queryFn: async () => {
      const q = query(
        collection(db, 'resources'),
        where('isRecommended', '==', true),
        orderBy('rating', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
    },
    staleTime: 15 * 60 * 1000, // 15분
  });
}

// 리소스 상세 조회
export function useResource(resourceId: string) {
  return useFirestoreDocument<Resource>('resources', resourceId, { incrementViewCount: true });
}

// 리소스 리뷰 조회
export function useResourceReviews(resourceId: string) {
  return useQuery({
    queryKey: ['resourceReviews', resourceId],
    queryFn: async () => {
      if (!db) throw new Error('Firestore is not initialized.');
      const q = query(
        collection(db, 'resourceReviews'),
        where('resourceId', '==', resourceId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ResourceReview[];
    },
    enabled: !!resourceId,
    staleTime: 5 * 60 * 1000,
  });
}

// 리소스 리뷰 작성
export function useCreateResourceReview() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (reviewData: Omit<ResourceReview, 'id' | 'createdAt' | 'helpfulCount'>) => {
      if (!db) throw new Error('Firestore is not initialized.');
      const docRef = await addDoc(collection(db, 'resourceReviews'), {
        ...reviewData,
        helpfulCount: 0,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: (docId, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resourceReviews', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.resourceId] });
      addToast({
        type: 'success',
        title: '리뷰가 작성되었습니다!',
        description: '다른 사용자들이 도움이 될 것입니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '리뷰 작성 실패',
        description: error.message,
      });
    },
  });
}

// 북마크 토글
export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ parentId, userId }: { parentId: string; userId: string }) => {
      if (!db) throw new Error('Firestore is not initialized.');

      const subDocRef = doc(db, 'resources', parentId, 'bookmarks', userId);
      const subDocSnap = await getDoc(subDocRef);
      const parentRef = doc(db, 'resources', parentId);

      if (subDocSnap.exists()) {
        await deleteDoc(subDocRef);
        await updateDoc(parentRef, { bookmarkCount: increment(-1) });
        return { toggled: false };
      } else {
        await setDoc(subDocRef, { createdAt: new Date().toISOString() });
        await updateDoc(parentRef, { bookmarkCount: increment(1) });
        return { toggled: true };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      addToast({
        type: 'success',
        title: data.toggled ? '북마크에 추가되었습니다!' : '북마크가 해제되었습니다.',
      });
    },
  });
}
