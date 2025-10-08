import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  Post,
  Reply,
  StudyGroup,
  CreatePostData,
  UpdatePostData,
  CreateReplyData,
  CreateGroupData,
  PostType,
  PostCategory,
} from '@/types/community';

// 컬렉션 참조 헬퍼 함수
const getPostsCollection = () => collection(db!, 'posts');
const getRepliesCollection = () => collection(db!, 'replies');
const getLikesCollection = () => collection(db!, 'likes');
const getGroupsCollection = () => collection(db!, 'studyGroups');

// ============= 게시물 관련 =============

// 게시물 생성
export async function createPost(
  userId: string,
  userName: string,
  userLevel: string | undefined,
  data: CreatePostData
): Promise<string> {
  const postData = {
    ...data,
    authorId: userId,
    authorName: userName,
    authorLevel: userLevel,
    likes: 0,
    viewCount: 0,
    replyCount: 0,
    isResolved: data.type === 'question' ? false : undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(getPostsCollection(), postData);
  return docRef.id;
}

// 게시물 조회 (단일)
export async function getPost(postId: string): Promise<Post | null> {
  const docRef = doc(getPostsCollection(), postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
  } as Post;
}

// 게시물 목록 조회
export async function getPosts(
  type?: PostType,
  category?: PostCategory,
  limitCount: number = 20
): Promise<Post[]> {
  let q = query(getPostsCollection(), orderBy('createdAt', 'desc'), limit(limitCount));

  if (type) {
    q = query(q, where('type', '==', type));
  }

  if (category) {
    q = query(q, where('category', '==', category));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Post;
  });
}

// 게시물 업데이트
export async function updatePost(postId: string, data: UpdatePostData): Promise<void> {
  const docRef = doc(getPostsCollection(), postId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// 게시물 삭제
export async function deletePost(postId: string): Promise<void> {
  const docRef = doc(getPostsCollection(), postId);
  await deleteDoc(docRef);
}

// 조회수 증가
export async function incrementViewCount(postId: string): Promise<void> {
  const docRef = doc(getPostsCollection(), postId);
  await updateDoc(docRef, {
    viewCount: increment(1),
  });
}

// ============= 답변/댓글 관련 =============

// 답변 생성
export async function createReply(
  userId: string,
  userName: string,
  userLevel: string | undefined,
  data: CreateReplyData
): Promise<string> {
  const replyData = {
    ...data,
    authorId: userId,
    authorName: userName,
    authorLevel: userLevel,
    likes: 0,
    isAccepted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(getRepliesCollection(), replyData);

  // 게시물의 답변 수 증가
  const postRef = doc(getPostsCollection(), data.postId);
  await updateDoc(postRef, {
    replyCount: increment(1),
  });

  return docRef.id;
}

// 답변 목록 조회
export async function getReplies(postId: string): Promise<Reply[]> {
  const q = query(
    getRepliesCollection(),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Reply;
  });
}

// 답변 채택
export async function acceptReply(postId: string, replyId: string): Promise<void> {
  // 답변을 채택으로 표시
  const replyRef = doc(getRepliesCollection(), replyId);
  await updateDoc(replyRef, {
    isAccepted: true,
  });

  // 게시물을 해결됨으로 표시
  const postRef = doc(getPostsCollection(), postId);
  await updateDoc(postRef, {
    isResolved: true,
    acceptedReplyId: replyId,
  });
}

// 답변 삭제
export async function deleteReply(postId: string, replyId: string): Promise<void> {
  const replyRef = doc(getRepliesCollection(), replyId);
  await deleteDoc(replyRef);

  // 게시물의 답변 수 감소
  const postRef = doc(getPostsCollection(), postId);
  await updateDoc(postRef, {
    replyCount: increment(-1),
  });
}

// ============= 좋아요 관련 =============

// 좋아요 추가
export async function addLike(
  userId: string,
  targetId: string,
  targetType: 'post' | 'reply'
): Promise<void> {
  // 좋아요 기록 추가
  await addDoc(getLikesCollection(), {
    userId,
    targetId,
    targetType,
    createdAt: serverTimestamp(),
  });

  // 대상의 좋아요 수 증가
  const collectionRef = targetType === 'post' ? getPostsCollection() : getRepliesCollection();
  const targetRef = doc(collectionRef, targetId);
  await updateDoc(targetRef, {
    likes: increment(1),
  });
}

// 좋아요 제거
export async function removeLike(
  userId: string,
  targetId: string,
  targetType: 'post' | 'reply'
): Promise<void> {
  // 좋아요 기록 찾기 및 삭제
  const q = query(
    getLikesCollection(),
    where('userId', '==', userId),
    where('targetId', '==', targetId),
    where('targetType', '==', targetType)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await deleteDoc(snapshot.docs[0].ref);

    // 대상의 좋아요 수 감소
    const collectionRef = targetType === 'post' ? getPostsCollection() : getRepliesCollection();
    const targetRef = doc(collectionRef, targetId);
    await updateDoc(targetRef, {
      likes: increment(-1),
    });
  }
}

// 좋아요 여부 확인
export async function checkLike(
  userId: string,
  targetId: string,
  targetType: 'post' | 'reply'
): Promise<boolean> {
  const q = query(
    getLikesCollection(),
    where('userId', '==', userId),
    where('targetId', '==', targetId),
    where('targetType', '==', targetType)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// ============= 스터디 그룹 관련 =============

// 그룹 생성
export async function createStudyGroup(
  userId: string,
  data: CreateGroupData
): Promise<string> {
  const groupData = {
    ...data,
    creatorId: userId,
    memberIds: [userId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(getGroupsCollection(), groupData);
  return docRef.id;
}

// 그룹 목록 조회
export async function getStudyGroups(limitCount: number = 20): Promise<StudyGroup[]> {
  const q = query(
    getGroupsCollection(),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as StudyGroup;
  });
}

// 그룹 가입
export async function joinStudyGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(getGroupsCollection(), groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error('그룹을 찾을 수 없습니다.');
  }

  const group = groupSnap.data() as StudyGroup;

  if (group.memberIds.includes(userId)) {
    throw new Error('이미 가입한 그룹입니다.');
  }

  if (group.memberIds.length >= group.maxMembers) {
    throw new Error('그룹이 가득 찼습니다.');
  }

  await updateDoc(groupRef, {
    memberIds: [...group.memberIds, userId],
    updatedAt: serverTimestamp(),
  });
}

// 그룹 탈퇴
export async function leaveStudyGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(getGroupsCollection(), groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error('그룹을 찾을 수 없습니다.');
  }

  const group = groupSnap.data() as StudyGroup;

  await updateDoc(groupRef, {
    memberIds: group.memberIds.filter(id => id !== userId),
    updatedAt: serverTimestamp(),
  });
}
