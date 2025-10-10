import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment,
  QueryFieldFilterConstraint,
  type DocumentReference,
  type CollectionReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui';
import type { PostType, PostCategory } from '@/types/community';
import { useFirestoreQuery, useFirestoreDocument, useCreateDocument, useToggleSubcollectionDoc } from './useFirestore';

export interface Post {
  id: string;
  authorId: string;
  authorNickname: string;
  authorLevel: string;
  authorProfilePic?: string;
  authorName?: string; // 작성자 이름 (추가)
  title: string;
  content: string;
  type?: PostType; // 게시글 타입 (types/community.ts와 호환)
  category: PostCategory; // types/community.ts와 호환
  tags: string[];
  level?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likeCount: number;
  commentCount: number;
  replyCount?: number; // 답글 수 (추가)
  viewCount: number;
  bookmarkCount: number;
  likes?: string[]; // 좋아요한 사용자 ID 목록 (추가)
  isPublished: boolean;
  isResolved?: boolean; // 질문이 해결되었는지 (추가)
  isBookmarked?: boolean; // 현재 사용자가 북마크했는지 (클라이언트용, 추가)
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  authorName?: string; // 작성자 이름 (추가)
  authorLevel?: string; // 작성자 레벨 (추가)
  authorProfilePic?: string;
  content: string;
  createdAt: Timestamp;
  likeCount: number;
  likes?: string[]; // 좋아요한 사용자 ID 목록 (추가)
  parentCommentId?: string; // 답글인 경우
  isAccepted?: boolean; // 답변이 채택되었는지 (질문 게시글용, 추가)
}

// 게시글 목록 조회
export function usePosts(filters?: {
  category?: string;
  level?: string[];
  search?: string;
  sortBy?: 'latest' | 'popular' | 'trending';
}) {
  return useQuery({
    queryKey: ['posts', filters], // 검색은 클라이언트에서 하므로 queryKey에 포함
    queryFn: async () => {
      const baseQuery = query(
        collection(db, 'posts'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const q = [
        filters?.category && filters.category !== 'all' && where('category', '==', filters.category),
        filters?.level && filters.level.length > 0 && where('level', 'in', filters.level),
      ].filter((constraint): constraint is QueryFieldFilterConstraint => Boolean(constraint));

      const snapshot = await getDocs(query(baseQuery, ...q));
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        return posts.filter(p => p.title.toLowerCase().includes(searchTerm) || p.content.toLowerCase().includes(searchTerm));
      }
      return posts;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 게시글 상세 조회
export function usePost(postId: string) {
  return useFirestoreDocument<Post>('posts', postId, { incrementViewCount: true });
}

// 게시글 작성
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const createPostMutation = useCreateDocument<Post>('posts');

  return useMutation({
    mutationFn: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount' | 'viewCount' | 'bookmarkCount'>) => {
      return await createPostMutation.mutateAsync({
        ...postData,
        likeCount: 0,
        commentCount: 0,
        viewCount: 0,
        bookmarkCount: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '게시글이 작성되었습니다!',
        description: '커뮤니티에 새로운 글이 추가되었습니다.',
      });
    },
  });
}

// 게시글 수정
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, updates }: { postId: string; updates: Partial<Post> }) => {
      try {
        const docRef = doc(db, 'posts', postId);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('게시글 수정에 실패했습니다.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '게시글이 수정되었습니다!',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '게시글 수정 실패',
        description: error.message,
      });
    },
  });
}

// 게시글 삭제
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error('Failed to delete post:', error);
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '게시글이 삭제되었습니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '게시글 삭제 실패',
        description: error.message,
      });
    },
  });
}

// 댓글 목록 조회
export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('createdAt', 'asc')
        );

        const snapshot = await getDocs(q);
        const comments: Comment[] = [];
        
        snapshot.forEach((doc) => {
          comments.push({ id: doc.id, ...doc.data() } as Comment);
        });

        return comments;
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// 댓글 작성
export function useCreateComment() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (commentData: Omit<Comment, 'id' | 'createdAt' | 'likeCount'>) => {
      try {
        const docRef = await addDoc(collection(db, 'comments'), {
          ...commentData,
          likeCount: 0,
          createdAt: serverTimestamp(),
        });

        // 게시글의 댓글 수 증가 (원자적 증가)
        const postRef = doc(db, 'posts', commentData.postId);
        await updateDoc(postRef, { commentCount: increment(1) });

        return docRef.id;
      } catch (error) {
        console.error('Failed to create comment:', error);
        throw new Error('댓글 작성에 실패했습니다.');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '댓글이 작성되었습니다!',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '댓글 작성 실패',
        description: error.message,
      });
    },
  });
}

// 좋아요 토글
export function useToggleLike() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    { toggled: boolean },
    Error,
    { parentId: string; userId: string }
  >({
    mutationFn: async ({ parentId, userId }: { parentId: string; userId: string }) => {
      if (!db) throw new Error('Firestore is not initialized.');

      const subDocRef = doc(db, 'posts', parentId, 'likes', userId);
      const subDocSnap = await getDoc(subDocRef);
      const parentRef = doc(db, 'posts', parentId);

      if (subDocSnap.exists()) {
        await deleteDoc(subDocRef);
        await updateDoc(parentRef, { likeCount: increment(-1) });
        return { toggled: false };
      } else {
        await setDoc(subDocRef, { createdAt: new Date().toISOString() });
        await updateDoc(parentRef, { likeCount: increment(1) });
        return { toggled: true };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: data.toggled ? '게시글에 좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.',
      });
    },
  });
}

// 댓글 삭제
export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string; postId: string }) => {
      try {
        await deleteDoc(doc(db, 'comments', commentId));

        // 게시글의 댓글 수 감소
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { commentCount: increment(-1) });
      } catch (error) {
        console.error('Failed to delete comment:', error);
        throw new Error('댓글 삭제에 실패했습니다.');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '댓글이 삭제되었습니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '댓글 삭제 실패',
        description: error.message,
      });
    },
  });
}

// 북마크 토글
export function useToggleBookmark() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    { toggled: boolean },
    Error,
    { parentId: string; userId: string }
  >({
    mutationFn: async ({ parentId, userId }: { parentId: string; userId: string }) => {
      if (!db) throw new Error('Firestore is not initialized.');

      const subDocRef = doc(db, 'posts', parentId, 'bookmarks', userId);
      const subDocSnap = await getDoc(subDocRef);
      const parentRef = doc(db, 'posts', parentId);

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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: data.toggled ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '북마크 처리 실패',
        description: (error as Error).message,
      });
    },
  });
}

// 사용자 북마크 목록 조회
export function useUserBookmarks(userId: string) {
  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      try {
        const bookmarkedPosts: Post[] = [];

        // 모든 게시글을 조회하고 해당 사용자의 북마크를 필터링
        const postsQuery = query(
          collection(db, 'posts'),
          where('isPublished', '==', true)
        );

        const postsSnapshot = await getDocs(postsQuery);

        for (const postDoc of postsSnapshot.docs) {
          const bookmarkRef = doc(db, 'posts', postDoc.id, 'bookmarks', userId);
          const bookmarkSnap = await getDoc(bookmarkRef);

          if (bookmarkSnap.exists()) {
            bookmarkedPosts.push({ id: postDoc.id, ...postDoc.data() } as Post);
          }
        }

        return bookmarkedPosts;
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
        throw new Error('북마크 목록을 불러오는데 실패했습니다.');
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// 게시글의 좋아요 목록 조회
export function usePostLikes(postId: string) {
  return useQuery({
    queryKey: ['likes', postId],
    queryFn: async () => {
      try {
        const likesQuery = query(collection(db, 'posts', postId, 'likes'));
        const snapshot = await getDocs(likesQuery);

        const likes: string[] = [];
        snapshot.forEach((doc) => {
          likes.push(doc.id); // doc.id는 userId
        });

        return likes;
      } catch (error) {
        console.error('Failed to fetch likes:', error);
        throw new Error('좋아요 목록을 불러오는데 실패했습니다.');
      }
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
}

// ===== 레거시 호환성을 위한 추가 함수들 =====

// Reply 인터페이스 (댓글과 동일하게 처리)
export type Reply = Comment;

// useReplies - 답글/댓글 조회 (useComments와 동일)
export function useReplies(postId: string) {
  const commentsQuery = useComments(postId);

  return {
    ...commentsQuery,
    refresh: () => commentsQuery.refetch(),
  };
}

// useLike - 좋아요 상태 및 토글
export function useLike(userId: string | undefined, postId: string, type: 'post' | 'comment') {
  const { data: likes } = usePostLikes(postId);
  const toggleLikeMutation = useToggleLike();

  const isLiked = userId && likes ? likes.includes(userId) : false;

  const toggleLike = async () => {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    await toggleLikeMutation.mutateAsync({ parentId: postId, userId });
  };

  return {
    isLiked,
    toggleLike,
  };
}

// StudyGroup 인터페이스
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  members: string[];
  memberCount: number;
  maxMembers: number;
  level: string;
  category: string;
  meetingSchedule?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// useStudyGroups - 스터디 그룹 목록 조회
export function useStudyGroups(limitCount: number = 20) {
  const queryResult = useQuery({
    queryKey: ['studyGroups', limitCount],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, 'studyGroups'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );

        const snapshot = await getDocs(q);
        const groups: StudyGroup[] = [];

        snapshot.forEach((doc) => {
          groups.push({ id: doc.id, ...doc.data() } as StudyGroup);
        });

        return groups;
      } catch (error) {
        console.error('Failed to fetch study groups:', error);
        throw new Error('스터디 그룹 목록을 불러오는데 실패했습니다.');
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...queryResult,
    refresh: () => queryResult.refetch(),
  };
}

// useCommunityActions - 커뮤니티 CRUD 작업 모음
export function useCommunityActions(
  userId: string | undefined,
  userNickname: string | undefined,
  userLevel: string | undefined
) {
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const queryClient = useQueryClient();

  const createPost = async (postData: {
    type?: PostType;
    category: PostCategory;
    title: string;
    content: string;
    tags?: string[];
  }) => {
    if (!userId || !userNickname || !userLevel) {
      throw new Error('로그인이 필요합니다.');
    }

    return await createPostMutation.mutateAsync({
      authorId: userId,
      authorNickname: userNickname,
      authorLevel: userLevel,
      title: postData.title,
      content: postData.content,
      type: postData.type,
      category: postData.category,
      tags: postData.tags || [],
      isPublished: true,
    });
  };

  const createReply = async (replyData: {
    postId: string;
    content: string;
    parentCommentId?: string;
  }) => {
    if (!userId || !userNickname) {
      throw new Error('로그인이 필요합니다.');
    }

    return await createCommentMutation.mutateAsync({
      postId: replyData.postId,
      authorId: userId,
      authorNickname: userNickname,
      content: replyData.content,
      parentCommentId: replyData.parentCommentId,
    });
  };

  const acceptReply = async (postId: string, replyId: string) => {
    // 답변 채택 기능
    await updatePostMutation.mutateAsync({
      postId,
      updates: {
        isResolved: true,
      },
    });
  };

  const deleteReply = async (commentId: string, postId: string) => {
    return await deleteCommentMutation.mutateAsync({ commentId, postId });
  };

  const deletePost = async (postId: string) => {
    return await deletePostMutation.mutateAsync(postId);
  };

  const joinGroup = async (groupId: string) => {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    const groupRef = doc(db, 'studyGroups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error('스터디 그룹을 찾을 수 없습니다.');
    }

    const group = groupSnap.data() as StudyGroup;

    if (group.members.includes(userId)) {
      throw new Error('이미 가입한 그룹입니다.');
    }

    if (group.members.length >= group.maxMembers) {
      throw new Error('그룹이 가득 찼습니다.');
    }

    await updateDoc(groupRef, {
      members: [...group.members, userId],
      memberCount: increment(1),
    });

    queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
  };

  const isSubmitting =
    createPostMutation.isPending ||
    updatePostMutation.isPending ||
    deletePostMutation.isPending ||
    createCommentMutation.isPending ||
    deleteCommentMutation.isPending;

  return {
    createPost,
    createReply,
    acceptReply,
    deleteReply,
    deletePost,
    joinGroup,
    isSubmitting,
  };
}