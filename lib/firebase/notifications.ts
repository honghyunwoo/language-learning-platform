import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Notification, CreateNotificationData, NotificationSettings } from '@/types/notification';

const getNotificationsCollection = () => collection(db!, 'notifications');
const getSettingsCollection = () => collection(db!, 'notificationSettings');

// 알림 생성
export async function createNotification(
  userId: string,
  data: CreateNotificationData
): Promise<string> {
  const notification = {
    userId,
    ...data,
    isRead: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(getNotificationsCollection(), notification);
  return docRef.id;
}

// 사용자 알림 목록 조회
export async function getUserNotifications(
  userId: string,
  limitCount: number = 20
): Promise<Notification[]> {
  const q = query(
    getNotificationsCollection(),
    where('userId', '==', userId),
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
    } as Notification;
  });
}

// 읽지 않은 알림 개수
export async function getUnreadCount(userId: string): Promise<number> {
  const q = query(
    getNotificationsCollection(),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// 알림 읽음 처리
export async function markAsRead(notificationId: string): Promise<void> {
  const docRef = doc(getNotificationsCollection(), notificationId);
  await updateDoc(docRef, {
    isRead: true,
  });
}

// 모든 알림 읽음 처리
export async function markAllAsRead(userId: string): Promise<void> {
  const q = query(
    getNotificationsCollection(),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  const promises = snapshot.docs.map(doc =>
    updateDoc(doc.ref, { isRead: true })
  );

  await Promise.all(promises);
}

// 알림 설정 조회
export async function getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
  const docRef = doc(getSettingsCollection(), userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    userId,
    ...data,
    updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
  } as NotificationSettings;
}

// 알림 설정 저장
export async function saveNotificationSettings(
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<void> {
  const docRef = doc(getSettingsCollection(), userId);
  await updateDoc(docRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  });
}

// 알림 설정 초기화
export async function initNotificationSettings(userId: string): Promise<void> {
  const docRef = doc(getSettingsCollection(), userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    await updateDoc(docRef, {
      userId,
      dailyReminder: true,
      dailyReminderTime: '20:00',
      streakWarning: true,
      weeklyReport: true,
      weeklyReportDay: 0, // 일요일
      achievements: true,
      community: false,
      updatedAt: serverTimestamp(),
    });
  }
}
