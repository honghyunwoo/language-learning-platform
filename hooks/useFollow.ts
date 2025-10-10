import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getUserStats,
} from '@/lib/social/follow';

/**
 * 팔로우 여부 확인
 */
export const useIsFollowing = (followerId: string | undefined, followingId: string | undefined) => {
  return useQuery({
    queryKey: ['isFollowing', followerId, followingId],
    queryFn: async () => {
      if (!followerId || !followingId) return false;
      return await isFollowing(followerId, followingId);
    },
    enabled: !!followerId && !!followingId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 팔로워 목록 조회
 */
export const useFollowers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getFollowers(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 팔로잉 목록 조회
 */
export const useFollowing = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getFollowing(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 사용자 통계 조회
 */
export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserStats(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 팔로우
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => {
      await followUser(followerId, followingId);
    },
    onSuccess: (_data, variables) => {
      // 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['isFollowing', variables.followerId, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['followers', variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['following', variables.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userStats', variables.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userStats', variables.followingId],
      });
    },
  });
};

/**
 * 언팔로우
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => {
      await unfollowUser(followerId, followingId);
    },
    onSuccess: (_data, variables) => {
      // 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['isFollowing', variables.followerId, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['followers', variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['following', variables.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userStats', variables.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userStats', variables.followingId],
      });
    },
  });
};
