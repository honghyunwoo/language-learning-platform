import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'achievement'
  | 'streak'
  | 'level_up'
  | 'post_popular';

export interface Notification {
  id: string;
  userId: string; // 알림 받는 사람
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    fromUserId?: string;
    fromUserName?: string;
    postId?: string;
    achievementId?: string;
    points?: number;
  };
}

/**
 * 알림 생성
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Notification['metadata']
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const notificationId = `${userId}_${Date.now()}`;
  const notification: Notification = {
    id: notificationId,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    metadata,
  };

  await setDoc(doc(db, 'notifications', notificationId), notification);
}

/**
 * 사용자의 알림 목록 조회
 */
export async function getUserNotifications(
  userId: string,
  limitCount: number = 50
): Promise<Notification[]> {
  if (!db) return [];

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Notification);
}

/**
 * 읽지 않은 알림 수 조회
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (!db) return 0;

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * 알림 읽음 처리
 */
export async function markAsRead(notificationId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    read: true,
  });
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllAsRead(userId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const notifications = await getUserNotifications(userId);
  const unreadNotifications = notifications.filter((n) => !n.read);

  await Promise.all(
    unreadNotifications.map((notification) =>
      updateDoc(doc(db, 'notifications', notification.id), { read: true })
    )
  );
}

/**
 * 팔로우 알림 생성
 */
export async function notifyFollow(
  followingUserId: string,
  followerUserId: string,
  followerName: string
): Promise<void> {
  await createNotification(
    followingUserId,
    'follow',
    '새로운 팔로워',
    `${followerName}님이 회원님을 팔로우했습니다.`,
    {
      fromUserId: followerUserId,
      fromUserName: followerName,
    }
  );
}

/**
 * 좋아요 알림 생성
 */
export async function notifyLike(
  postAuthorId: string,
  likerUserId: string,
  likerName: string,
  postId: string
): Promise<void> {
  await createNotification(
    postAuthorId,
    'like',
    '좋아요',
    `${likerName}님이 회원님의 게시글을 좋아합니다.`,
    {
      fromUserId: likerUserId,
      fromUserName: likerName,
      postId,
    }
  );
}

/**
 * 댓글 알림 생성
 */
export async function notifyComment(
  postAuthorId: string,
  commenterUserId: string,
  commenterName: string,
  postId: string
): Promise<void> {
  await createNotification(
    postAuthorId,
    'comment',
    '새로운 댓글',
    `${commenterName}님이 회원님의 게시글에 댓글을 남겼습니다.`,
    {
      fromUserId: commenterUserId,
      fromUserName: commenterName,
      postId,
    }
  );
}

/**
 * 업적 달성 알림 생성
 */
export async function notifyAchievement(
  userId: string,
  achievementTitle: string,
  achievementId: string,
  points: number
): Promise<void> {
  await createNotification(
    userId,
    'achievement',
    '업적 달성!',
    `"${achievementTitle}" 업적을 달성했습니다! (+${points} 포인트)`,
    {
      achievementId,
      points,
    }
  );
}

/**
 * 스트릭 보너스 알림 생성
 */
export async function notifyStreak(
  userId: string,
  streakDays: number,
  points: number
): Promise<void> {
  await createNotification(
    userId,
    'streak',
    '연속 학습 달성!',
    `${streakDays}일 연속 학습을 달성했습니다! (+${points} 포인트)`,
    {
      points,
    }
  );
}
