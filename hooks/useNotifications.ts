import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/lib/notifications/notifications';

/**
 * 사용자 알림 목록 조회
 */
export const useNotifications = (userId: string | undefined, limitCount: number = 50) => {
  return useQuery({
    queryKey: ['notifications', userId, limitCount],
    queryFn: async () => {
      if (!userId) return [];
      return await getUserNotifications(userId, limitCount);
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 자동 갱신
  });
};

/**
 * 읽지 않은 알림 수 조회
 */
export const useUnreadCount = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['notifications', 'unread', userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await getUnreadCount(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

/**
 * 알림 읽음 처리
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 모든 알림 읽음 처리
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await markAllAsRead(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
