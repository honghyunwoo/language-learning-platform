import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Follow {
  id: string;
  followerId: string; // 팔로우하는 사람
  followingId: string; // 팔로우받는 사람
  createdAt: string;
}

export interface UserStats {
  userId: string;
  followersCount: number;
  followingCount: number;
  updatedAt: string;
}

/**
 * 사용자 팔로우
 */
export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  if (followerId === followingId) throw new Error('Cannot follow yourself');

  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, 'follows', followId);

  // 이미 팔로우 중인지 확인
  const existingFollow = await getDoc(followRef);
  if (existingFollow.exists()) {
    throw new Error('Already following this user');
  }

  const follow: Follow = {
    id: followId,
    followerId,
    followingId,
    createdAt: new Date().toISOString(),
  };

  // Follow 문서 생성
  await setDoc(followRef, follow);

  // 통계 업데이트
  await updateUserStats(followerId, 'following', 1);
  await updateUserStats(followingId, 'followers', 1);
}

/**
 * 사용자 언팔로우
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, 'follows', followId);

  // 팔로우 중인지 확인
  const existingFollow = await getDoc(followRef);
  if (!existingFollow.exists()) {
    throw new Error('Not following this user');
  }

  // Follow 문서 삭제
  await deleteDoc(followRef);

  // 통계 업데이트
  await updateUserStats(followerId, 'following', -1);
  await updateUserStats(followingId, 'followers', -1);
}

/**
 * 팔로우 여부 확인
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  if (!db) return false;

  const followId = `${followerId}_${followingId}`;
  const followRef = doc(db, 'follows', followId);
  const followDoc = await getDoc(followRef);

  return followDoc.exists();
}

/**
 * 팔로워 목록 조회
 */
export async function getFollowers(userId: string): Promise<Follow[]> {
  if (!db) return [];

  const q = query(collection(db, 'follows'), where('followingId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as Follow);
}

/**
 * 팔로잉 목록 조회
 */
export async function getFollowing(userId: string): Promise<Follow[]> {
  if (!db) return [];

  const q = query(collection(db, 'follows'), where('followerId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as Follow);
}

/**
 * 사용자 통계 조회
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  if (!db) {
    return {
      userId,
      followersCount: 0,
      followingCount: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  const statsRef = doc(db, 'userStats', userId);
  const statsDoc = await getDoc(statsRef);

  if (!statsDoc.exists()) {
    return {
      userId,
      followersCount: 0,
      followingCount: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  return statsDoc.data() as UserStats;
}

/**
 * 사용자 통계 업데이트 (내부 함수)
 */
async function updateUserStats(
  userId: string,
  field: 'followers' | 'following',
  delta: number
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const statsRef = doc(db, 'userStats', userId);
  const statsDoc = await getDoc(statsRef);

  const fieldName = field === 'followers' ? 'followersCount' : 'followingCount';

  if (!statsDoc.exists()) {
    // 첫 통계 생성
    const newStats: UserStats = {
      userId,
      followersCount: field === 'followers' ? Math.max(0, delta) : 0,
      followingCount: field === 'following' ? Math.max(0, delta) : 0,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(statsRef, newStats);
  } else {
    // 기존 통계 업데이트
    await updateDoc(statsRef, {
      [fieldName]: increment(delta),
      updatedAt: new Date().toISOString(),
    });
  }
}
