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
  serverTimestamp,
  setDoc,
  increment,
  Query,
  DocumentData,
  Firestore,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui';

type DocumentInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Firestore 컬렉션에서 여러 문서를 조회하는 제네릭 훅
 * @param queryKey React Query 키
 * @param queryFn Firestore 쿼리를 생성하는 함수
 */
export function useFirestoreQuery<T>(
  queryKey: unknown[],
  queryFn: (firestoreDb: Firestore) => Query<DocumentData>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!db) throw new Error('Firestore is not initialized.');
      const snapshot = await getDocs(queryFn(db));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * Firestore에서 단일 문서를 조회하는 제네릭 훅
 * @param collectionName 컬렉션 이름
 * @param docId 문서 ID
 * @param options.incrementViewCount 조회수 증가 여부
 */
export function useFirestoreDocument<T>(
  collectionName: string,
  docId: string,
  options: { incrementViewCount?: boolean } = {}
) {
  return useQuery({
    queryKey: [collectionName, docId],
    queryFn: async () => {
      if (!db) throw new Error('Firestore is not initialized.');
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }

      if (options.incrementViewCount) {
        updateDoc(docRef, { viewCount: increment(1) }).catch(console.error);
      }

      return { id: docSnap.id, ...docSnap.data() } as T;
    },
    enabled: !!docId,
  });
}

/**
 * Firestore에 새 문서를 생성하는 제네릭 훅
 * @param collectionName 컬렉션 이름
 * @param options.onSuccess 성공 콜백
 */
export function useCreateDocument<T>(
  collectionName: string,
  options?: { onSuccess?: (id: string) => void }
) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: DocumentInput<T>) => {
      if (!db) throw new Error('Firestore is not initialized.');
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      options?.onSuccess?.(id);
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: '생성 실패', description: error.message });
    },
  });
}

/**
 * 서브컬렉션의 문서를 토글하고 부모 문서의 카운터를 업데이트하는 제네릭 훅 (좋아요/북마크용)
 * @param parentCollectionName 부모 컬렉션 이름
 * @param subcollectionName 서브컬렉션 이름
 * @param counterFieldName 부모 문서의 카운터 필드 이름
 */
export function useToggleSubcollectionDoc(
  parentCollectionName: string,
  subcollectionName: string,
  counterFieldName: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentId, userId }: { parentId: string; userId: string }) => {
      if (!db) throw new Error('Firestore is not initialized.');

      const subDocRef = doc(db, parentCollectionName, parentId, subcollectionName, userId);
      const subDocSnap = await getDoc(subDocRef);
      const parentRef = doc(db, parentCollectionName, parentId);

      if (subDocSnap.exists()) {
        await deleteDoc(subDocRef);
        await updateDoc(parentRef, { [counterFieldName]: increment(-1) });
        return { toggled: false };
      } else {
        await setDoc(subDocRef, { userId, createdAt: serverTimestamp() });
        await updateDoc(parentRef, { [counterFieldName]: increment(1) });
        return { toggled: true };
      }
    },
    onSuccess: (_, variables) => {
      // 낙관적 업데이트 대신, 성공 후 쿼리를 무효화하여 정확한 데이터를 다시 가져옵니다.
      // 이 방식이 더 간단하고 데이터 정합성을 보장합니다.
      queryClient.invalidateQueries({ queryKey: [parentCollectionName, variables.parentId] });
      queryClient.invalidateQueries({ queryKey: [parentCollectionName] });
      queryClient.invalidateQueries({ queryKey: [subcollectionName, variables.parentId] });
    },
    onError: (error: Error) => {
      console.error(`Failed to toggle ${subcollectionName}:`, error);
      throw new Error('요청 처리에 실패했습니다.');
    },
  });
}