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
import type { PostType, PostCategory } from '@/types/community';

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
    queryKey: ['posts', filters],
    queryFn: async () => {
      try {
        let q = query(
          collection(db, 'posts'),
          where('isPublished', '==', true),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        // 카테고리 필터
        if (filters?.category && filters.category !== 'all') {
          q = query(q, where('category', '==', filters.category));
        }

        // 레벨 필터
        if (filters?.level && filters.level.length > 0) {
          q = query(q, where('level', 'in', filters.level));
        }

        const snapshot = await getDocs(q);
        const posts: Post[] = [];
        
        snapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() } as Post);
        });

        // 클라이언트 사이드 검색 (Firestore 제한으로 인해)
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }

        return posts;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 게시글 상세 조회
export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        // 조회수 증가 (백그라운드에서 실행)
        updateDoc(docRef, { viewCount: increment(1) }).catch(console.error);

        return { id: docSnap.id, ...docSnap.data() } as Post;
      } catch (error) {
        console.error('Failed to fetch post:', error);
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
}

// 게시글 작성
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount' | 'viewCount' | 'bookmarkCount'>) => {
      try {
        const docRef = await addDoc(collection(db, 'posts'), {
          ...postData,
          likeCount: 0,
          commentCount: 0,
          viewCount: 0,
          bookmarkCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return docRef.id;
      } catch (error) {
        console.error('Failed to create post:', error);
        throw new Error('게시글 작성에 실패했습니다.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: '게시글이 작성되었습니다!',
        description: '커뮤니티에 새로운 글이 추가되었습니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '게시글 작성 실패',
        description: error.message,
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
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      try {
        // likes 서브컬렉션 확인 및 토글
        const likeDocRef = doc(db, 'posts', postId, 'likes', userId);
        const likeSnap = await getDoc(likeDocRef);
        const postRef = doc(db, 'posts', postId);

        if (likeSnap.exists()) {
          await deleteDoc(likeDocRef);
          await updateDoc(postRef, { likeCount: increment(-1) });
          return { liked: false } as const;
        }

        await setDoc(likeDocRef, { userId, createdAt: serverTimestamp() });
        await updateDoc(postRef, { likeCount: increment(1) });
        return { liked: true } as const;
      } catch (error) {
        console.error('Failed to toggle like:', error);
        throw new Error('좋아요 처리에 실패했습니다.');
      }
    },
    // 낙관적 UI 업데이트 (즉시 반응)
    onMutate: async ({ postId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData(['posts']);
      
      // 낙관적으로 UI 업데이트 (좋아요 수 즉시 변경)
      queryClient.setQueryData(['posts'], (old: Post[] | undefined) => {
        if (!old) return old;
        return old.map((post: Post) =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount + 1 } // 임시로 증가
            : post
        );
      });
      
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      // 에러 발생시 이전 데이터로 복구
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      addToast({
        type: 'error',
        title: '좋아요 처리 실패',
        description: error.message,
      });
    },
    onSettled: () => {
      // 서버 데이터로 최종 동기화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      try {
        const bookmarkDocRef = doc(db, 'posts', postId, 'bookmarks', userId);
        const bookmarkSnap = await getDoc(bookmarkDocRef);
        const postRef = doc(db, 'posts', postId);

        if (bookmarkSnap.exists()) {
          await deleteDoc(bookmarkDocRef);
          await updateDoc(postRef, { bookmarkCount: increment(-1) });
          return { bookmarked: false } as const;
        }

        await setDoc(bookmarkDocRef, { userId, createdAt: serverTimestamp() });
        await updateDoc(postRef, { bookmarkCount: increment(1) });
        return { bookmarked: true } as const;
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        throw new Error('북마크 처리에 실패했습니다.');
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      addToast({
        type: 'success',
        title: result.bookmarked ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: '북마크 처리 실패',
        description: error.message,
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

    await toggleLikeMutation.mutateAsync({ postId, userId });
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