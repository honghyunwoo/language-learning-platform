import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  setDoc,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui';

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
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      try {
        let q = query(
          collection(db, 'resources'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        // 타입 필터
        if (filters?.type && filters.type !== 'all') {
          q = query(q, where('type', '==', filters.type));
        }

        // 카테고리 필터
        if (filters?.category && filters.category !== 'all') {
          q = query(q, where('category', '==', filters.category));
        }

        // 레벨 필터
        if (filters?.level && filters.level !== 'all') {
          q = query(q, where('level', '==', filters.level));
        }

        // 추천 리소스 필터
        if (filters?.isRecommended) {
          q = query(q, where('isRecommended', '==', true));
        }

        const snapshot = await getDocs(q);
        const resources: Resource[] = [];
        
        snapshot.forEach((doc) => {
          resources.push({ id: doc.id, ...doc.data() } as Resource);
        });

        // 클라이언트 사이드 검색
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return resources.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }

        return resources;
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        throw new Error('리소스를 불러오는데 실패했습니다.');
      }
    },
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// 추천 리소스 조회
export function useRecommendedResources() {
  return useQuery({
    queryKey: ['resources', 'recommended'],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, 'resources'),
          where('isRecommended', '==', true),
          orderBy('rating', 'desc'),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const resources: Resource[] = [];
        
        snapshot.forEach((doc) => {
          resources.push({ id: doc.id, ...doc.data() } as Resource);
        });

        return resources;
      } catch (error) {
        console.error('Failed to fetch recommended resources:', error);
        throw new Error('추천 리소스를 불러오는데 실패했습니다.');
      }
    },
    staleTime: 15 * 60 * 1000, // 15분
  });
}

// 리소스 상세 조회
export function useResource(resourceId: string) {
  return useQuery({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      try {
        const docRef = doc(db, 'resources', resourceId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('리소스를 찾을 수 없습니다.');
        }

        // 조회수 증가 (백그라운드에서 실행)
        updateDoc(docRef, { viewCount: increment(1) }).catch(console.error);

        return { id: docSnap.id, ...docSnap.data() } as Resource;
      } catch (error) {
        console.error('Failed to fetch resource:', error);
        throw new Error('리소스를 불러오는데 실패했습니다.');
      }
    },
    enabled: !!resourceId,
    staleTime: 5 * 60 * 1000,
  });
}

// 리소스 리뷰 조회
export function useResourceReviews(resourceId: string) {
  return useQuery({
    queryKey: ['resourceReviews', resourceId],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, 'resourceReviews'),
          where('resourceId', '==', resourceId),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const snapshot = await getDocs(q);
        const reviews: ResourceReview[] = [];
        
        snapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() } as ResourceReview);
        });

        return reviews;
      } catch (error) {
        console.error('Failed to fetch resource reviews:', error);
        throw new Error('리뷰를 불러오는데 실패했습니다.');
      }
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
      try {
        const docRef = await addDoc(collection(db, 'resourceReviews'), {
          ...reviewData,
          helpfulCount: 0,
          createdAt: serverTimestamp(),
        });

        return docRef.id;
      } catch (error) {
        console.error('Failed to create resource review:', error);
        throw new Error('리뷰 작성에 실패했습니다.');
      }
    },
    onSuccess: (_, variables) => {
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
    mutationFn: async ({ resourceId, userId }: { resourceId: string; userId: string }) => {
      try {
        // bookmarks 서브컬렉션 토글
        const bookmarkDocRef = doc(db, 'resources', resourceId, 'bookmarks', userId);
        const bookmarkSnap = await getDoc(bookmarkDocRef);
        const resourceRef = doc(db, 'resources', resourceId);

        if (bookmarkSnap.exists()) {
          await deleteDoc(bookmarkDocRef);
          await updateDoc(resourceRef, { bookmarkCount: increment(-1) });
          return { bookmarked: false } as const;
        }

        await setDoc(bookmarkDocRef, { userId, createdAt: serverTimestamp() });
        await updateDoc(resourceRef, { bookmarkCount: increment(1) });
        return { bookmarked: true } as const;
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        throw new Error('북마크 처리에 실패했습니다.');
      }
    },
    // 낙관적 UI 업데이트 (즉시 반응)
    onMutate: async ({ resourceId }) => {
      await queryClient.cancelQueries({ queryKey: ['resources'] });
      const previousResources = queryClient.getQueryData(['resources']);
      
      // 북마크 수 즉시 업데이트
      queryClient.setQueryData(['resources'], (old: Resource[] | undefined) => {
        if (!old) return old;
        return old.map((resource: Resource) =>
          resource.id === resourceId
            ? { ...resource, bookmarkCount: resource.bookmarkCount + 1 }
            : resource
        );
      });
      
      return { previousResources };
    },
    onError: (error, variables, context) => {
      if (context?.previousResources) {
        queryClient.setQueryData(['resources'], context.previousResources);
      }
      addToast({
        type: 'error',
        title: '북마크 처리 실패',
        description: error.message,
      });
    },
    onSuccess: (data) => {
      addToast({
        type: 'success',
        title: data.bookmarked ? '북마크에 추가되었습니다!' : '북마크가 해제되었습니다.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}
