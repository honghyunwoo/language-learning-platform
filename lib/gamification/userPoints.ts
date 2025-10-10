import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { POINT_REWARDS, calculateRank } from './points';
import { ActivityType } from '@/types/curriculum';

export interface UserPointsData {
  userId: string;
  totalPoints: number;
  rank: string;
  pointsHistory: PointTransaction[];
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  type: keyof typeof POINT_REWARDS;
  points: number;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Activity type을 포인트 보상 키로 매핑
const ACTIVITY_TYPE_TO_REWARD: Record<ActivityType, keyof typeof POINT_REWARDS> = {
  listening: 'COMPLETE_LISTENING',
  speaking: 'COMPLETE_SPEAKING',
  reading: 'COMPLETE_READING',
  writing: 'COMPLETE_WRITING',
  grammar: 'COMPLETE_GRAMMAR',
  vocabulary: 'COMPLETE_VOCABULARY',
};

/**
 * 활동 완료 시 포인트 부여
 */
export async function awardActivityPoints(
  userId: string,
  activityType: ActivityType,
  activityTitle: string
): Promise<number> {
  if (!db) throw new Error('Firestore not initialized');

  const rewardKey = ACTIVITY_TYPE_TO_REWARD[activityType];
  const points = POINT_REWARDS[rewardKey];

  const transaction: PointTransaction = {
    id: `${userId}_${Date.now()}`,
    type: rewardKey,
    points,
    description: `"${activityTitle}" 완료`,
    timestamp: new Date().toISOString(),
    metadata: { activityType, activityTitle },
  };

  await addPointsToUser(userId, points, transaction);
  return points;
}

/**
 * 사용자 포인트 추가 (내부 함수)
 */
async function addPointsToUser(
  userId: string,
  points: number,
  transaction: PointTransaction
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  const userPointsRef = doc(db, 'userPoints', userId);
  const userPointsDoc = await getDoc(userPointsRef);

  if (!userPointsDoc.exists()) {
    // 첫 포인트 획득
    const newUserPoints: UserPointsData = {
      userId,
      totalPoints: points,
      rank: calculateRank(points),
      pointsHistory: [transaction],
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userPointsRef, newUserPoints);
  } else {
    // 기존 포인트 업데이트
    const currentData = userPointsDoc.data() as UserPointsData;
    const newTotalPoints = currentData.totalPoints + points;
    const newRank = calculateRank(newTotalPoints);

    await updateDoc(userPointsRef, {
      totalPoints: increment(points),
      rank: newRank,
      pointsHistory: [...currentData.pointsHistory, transaction],
      updatedAt: new Date().toISOString(),
    });
  }
}

/**
 * 사용자 포인트 조회
 */
export async function getUserPoints(userId: string): Promise<UserPointsData | null> {
  if (!db) return null;

  const userPointsRef = doc(db, 'userPoints', userId);
  const userPointsDoc = await getDoc(userPointsRef);

  if (!userPointsDoc.exists()) {
    return {
      userId,
      totalPoints: 0,
      rank: calculateRank(0),
      pointsHistory: [],
      updatedAt: new Date().toISOString(),
    };
  }

  return userPointsDoc.data() as UserPointsData;
}

/**
 * 커뮤니티 활동 포인트 부여
 */
export async function awardCommunityPoints(
  userId: string,
  action: 'CREATE_POST' | 'CREATE_COMMENT' | 'RECEIVE_LIKE' | 'POST_POPULAR' | 'ANSWER_ACCEPTED',
  description: string
): Promise<number> {
  if (!db) throw new Error('Firestore not initialized');

  const points = POINT_REWARDS[action];

  const transaction: PointTransaction = {
    id: `${userId}_${Date.now()}`,
    type: action,
    points,
    description,
    timestamp: new Date().toISOString(),
  };

  await addPointsToUser(userId, points, transaction);
  return points;
}

/**
 * 스트릭 보너스 포인트 부여
 */
export async function awardStreakBonus(
  userId: string,
  streakDays: number
): Promise<number> {
  if (!db) throw new Error('Firestore not initialized');

  let rewardKey: keyof typeof POINT_REWARDS;
  let description: string;

  if (streakDays === 7) {
    rewardKey = 'STREAK_7_DAYS';
    description = '7일 연속 학습 달성!';
  } else if (streakDays === 30) {
    rewardKey = 'STREAK_30_DAYS';
    description = '30일 연속 학습 달성!';
  } else if (streakDays === 100) {
    rewardKey = 'STREAK_100_DAYS';
    description = '100일 연속 학습 달성!';
  } else {
    return 0; // 보상 없음
  }

  const points = POINT_REWARDS[rewardKey];

  const transaction: PointTransaction = {
    id: `${userId}_${Date.now()}`,
    type: rewardKey,
    points,
    description,
    timestamp: new Date().toISOString(),
    metadata: { streakDays },
  };

  await addPointsToUser(userId, points, transaction);
  return points;
}
