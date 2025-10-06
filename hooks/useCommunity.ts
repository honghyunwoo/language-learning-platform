import { useState, useEffect } from 'react';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getReplies,
  createReply,
  deleteReply,
  acceptReply,
  addLike,
  removeLike,
  checkLike,
  incrementViewCount,
  getStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
} from '@/lib/firebase/community';
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

// 게시물 목록 Hook
export function usePosts(type?: PostType, category?: PostCategory, limitCount: number = 20) {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getPosts(type, category, limitCount);
        setData(posts);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [type, category, limitCount]);

  const refresh = async () => {
    try {
      const posts = await getPosts(type, category, limitCount);
      setData(posts);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { data, isLoading, error, refresh };
}

// 단일 게시물 Hook
export function usePost(postId: string | null) {
  const [data, setData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const post = await getPost(postId);
        setData(post);
        setError(null);

        // 조회수 증가
        if (post) {
          await incrementViewCount(postId);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { data, isLoading, error };
}

// 답변 목록 Hook
export function useReplies(postId: string | null) {
  const [data, setData] = useState<Reply[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    const fetchReplies = async () => {
      try {
        setIsLoading(true);
        const replies = await getReplies(postId);
        setData(replies);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [postId]);

  const refresh = async () => {
    if (!postId) return;
    try {
      const replies = await getReplies(postId);
      setData(replies);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { data, isLoading, error, refresh };
}

// 좋아요 Hook
export function useLike(userId: string | undefined, targetId: string, targetType: 'post' | 'reply') {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const checkLikeStatus = async () => {
      try {
        const liked = await checkLike(userId, targetId, targetType);
        setIsLiked(liked);
      } catch (err) {
        console.error('좋아요 확인 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLikeStatus();
  }, [userId, targetId, targetType]);

  const toggleLike = async () => {
    if (!userId) return;

    try {
      if (isLiked) {
        await removeLike(userId, targetId, targetType);
        setIsLiked(false);
      } else {
        await addLike(userId, targetId, targetType);
        setIsLiked(true);
      }
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      throw err;
    }
  };

  return { isLiked, isLoading, toggleLike };
}

// 스터디 그룹 목록 Hook
export function useStudyGroups(limitCount: number = 20) {
  const [data, setData] = useState<StudyGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const groups = await getStudyGroups(limitCount);
        setData(groups);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [limitCount]);

  const refresh = async () => {
    try {
      const groups = await getStudyGroups(limitCount);
      setData(groups);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { data, isLoading, error, refresh };
}

// 커뮤니티 액션 Hook
export function useCommunityActions(
  userId: string | undefined,
  userName: string | undefined,
  userLevel: string | undefined
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (data: CreatePostData): Promise<string> => {
    if (!userId || !userName) {
      throw new Error('로그인이 필요합니다.');
    }

    setIsSubmitting(true);
    try {
      const postId = await createPost(userId, userName, userLevel, data);
      return postId;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (postId: string, data: UpdatePostData): Promise<void> => {
    setIsSubmitting(true);
    try {
      await updatePost(postId, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      await deletePost(postId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (data: CreateReplyData): Promise<string> => {
    if (!userId || !userName) {
      throw new Error('로그인이 필요합니다.');
    }

    setIsSubmitting(true);
    try {
      const replyId = await createReply(userId, userName, userLevel, data);
      return replyId;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReply = async (postId: string, replyId: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      await deleteReply(postId, replyId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptReply = async (postId: string, replyId: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      await acceptReply(postId, replyId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGroup = async (data: CreateGroupData): Promise<string> => {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    setIsSubmitting(true);
    try {
      const groupId = await createStudyGroup(userId, data);
      return groupId;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinGroup = async (groupId: string): Promise<void> => {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    setIsSubmitting(true);
    try {
      await joinStudyGroup(groupId, userId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveGroup = async (groupId: string): Promise<void> => {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    setIsSubmitting(true);
    try {
      await leaveStudyGroup(groupId, userId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    createReply: handleCreateReply,
    deleteReply: handleDeleteReply,
    acceptReply: handleAcceptReply,
    createGroup: handleCreateGroup,
    joinGroup: handleJoinGroup,
    leaveGroup: handleLeaveGroup,
  };
}
