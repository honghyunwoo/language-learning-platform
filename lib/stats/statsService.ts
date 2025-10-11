/**
 * Statistics Service - 학습 통계 데이터 수집 및 분석
 * Firebase Firestore에서 사용자 학습 데이터를 가져와 통계 생성
 */

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import {
  WeeklyProgressData,
  StreakData,
  LevelProgressData,
  ActivityDistributionData,
  TimeSeriesData,
} from './chartConfig';
import { CEFRLevel } from '@/lib/types/activity';

// ===== 타입 정의 =====
interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  weekId: string;
  completedAt: Timestamp;
  score: number;
  timeSpent: number; // minutes
  level: CEFRLevel;
}

interface UserProgress {
  userId: string;
  level: CEFRLevel;
  weekId: string;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;
  grammarScore: number;
  vocabularyScore: number;
  updatedAt: Timestamp;
}

// ===== 1. 주간 학습 진도 데이터 =====
export async function getWeeklyProgressData(
  userId: string,
  weeks: number = 8
): Promise<WeeklyProgressData[]> {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      orderBy('weekId', 'desc'),
      limit(weeks)
    );

    const snapshot = await getDocs(q);
    const data: WeeklyProgressData[] = [];

    snapshot.forEach((doc) => {
      const progress = doc.data() as UserProgress;
      data.push({
        week: progress.weekId,
        listening: progress.listeningScore,
        speaking: progress.speakingScore,
        reading: progress.readingScore,
        writing: progress.writingScore,
        grammar: progress.grammarScore,
        vocabulary: progress.vocabularyScore,
      });
    });

    return data.reverse(); // 오래된 것부터 정렬
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    return getMockWeeklyProgressData();
  }
}

// ===== 2. 학습 스트릭 데이터 (30일) =====
export async function getStreakData(userId: string, days: number = 30): Promise<StreakData[]> {
  try {
    const activitiesRef = collection(db, 'userActivities');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      where('completedAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('completedAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const dailyCount = new Map<string, number>();

    snapshot.forEach((doc) => {
      const activity = doc.data() as UserActivity;
      const dateStr = activity.completedAt.toDate().toISOString().split('T')[0];
      dailyCount.set(dateStr, (dailyCount.get(dateStr) || 0) + 1);
    });

    const data: StreakData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dailyCount.get(dateStr) || 0;

      let level: StreakData['level'] = 'none';
      if (count >= 5) level = 'high';
      else if (count >= 3) level = 'medium';
      else if (count >= 1) level = 'low';

      data.push({
        date: dateStr,
        count,
        level,
      });
    }

    return data;
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return getMockStreakData();
  }
}

// ===== 3. CEFR 레벨 진행도 데이터 =====
export async function getLevelProgressData(userId: string): Promise<LevelProgressData[]> {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId), orderBy('weekId', 'desc'), limit(1));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return getMockLevelProgressData();
    }

    const latestProgress = snapshot.docs[0].data() as UserProgress;
    const levels: CEFRLevel[] = [
      'A1.1',
      'A1.2',
      'A2.1',
      'A2.2',
      'B1.1',
      'B1.2',
      'B2.1',
      'B2.2',
      'C1.1',
      'C1.2',
      'C2.1',
      'C2.2',
    ];

    const currentLevelIndex = levels.indexOf(latestProgress.level);
    const data: LevelProgressData[] = [];

    for (let i = 0; i < levels.length; i++) {
      if (i < currentLevelIndex) {
        // 완료한 레벨
        data.push({ level: levels[i], current: 100, target: 100 });
      } else if (i === currentLevelIndex) {
        // 현재 레벨
        const avgScore =
          (latestProgress.listeningScore +
            latestProgress.speakingScore +
            latestProgress.readingScore +
            latestProgress.writingScore +
            latestProgress.grammarScore +
            latestProgress.vocabularyScore) /
          6;
        data.push({ level: levels[i], current: Math.round(avgScore), target: 100 });
      } else {
        // 미래 레벨
        data.push({ level: levels[i], current: 0, target: 100 });
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching level progress:', error);
    return getMockLevelProgressData();
  }
}

// ===== 4. 활동 타입 분포 데이터 =====
export async function getActivityDistributionData(
  userId: string
): Promise<ActivityDistributionData[]> {
  try {
    const activitiesRef = collection(db, 'userActivities');
    const q = query(activitiesRef, where('userId', '==', userId));

    const snapshot = await getDocs(q);
    const distribution = new Map<string, { count: number; hours: number }>();

    snapshot.forEach((doc) => {
      const activity = doc.data() as UserActivity;
      const type = activity.activityType;
      const existing = distribution.get(type) || { count: 0, hours: 0 };
      distribution.set(type, {
        count: existing.count + 1,
        hours: existing.hours + activity.timeSpent / 60,
      });
    });

    const data: ActivityDistributionData[] = [];
    distribution.forEach((value, key) => {
      data.push({
        type: key,
        count: value.count,
        hours: Math.round(value.hours * 10) / 10, // 소수점 1자리
      });
    });

    return data.length > 0 ? data : getMockActivityDistributionData();
  } catch (error) {
    console.error('Error fetching activity distribution:', error);
    return getMockActivityDistributionData();
  }
}

// ===== 5. 일일 학습 시간 추이 데이터 =====
export async function getTimeSeriesData(userId: string, days: number = 30): Promise<TimeSeriesData[]> {
  try {
    const activitiesRef = collection(db, 'userActivities');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      where('completedAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('completedAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const dailyMinutes = new Map<string, number>();

    snapshot.forEach((doc) => {
      const activity = doc.data() as UserActivity;
      const dateStr = activity.completedAt.toDate().toISOString().split('T')[0];
      dailyMinutes.set(dateStr, (dailyMinutes.get(dateStr) || 0) + activity.timeSpent);
    });

    const data: TimeSeriesData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const minutes = dailyMinutes.get(dateStr) || 0;

      data.push({
        date: dateStr,
        value: Math.round((minutes / 60) * 10) / 10, // 시간 단위, 소수점 1자리
      });
    }

    return data;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return getMockTimeSeriesData();
  }
}

// ===== 6. 강점/약점 분석 데이터 =====
export async function getStrengthWeaknessData(userId: string): Promise<{
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  grammar: number;
  vocabulary: number;
}> {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId), orderBy('weekId', 'desc'), limit(4));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return getMockStrengthWeaknessData();
    }

    // 최근 4주 평균 계산
    let listeningSum = 0,
      speakingSum = 0,
      readingSum = 0,
      writingSum = 0,
      grammarSum = 0,
      vocabularySum = 0;
    let count = 0;

    snapshot.forEach((doc) => {
      const progress = doc.data() as UserProgress;
      listeningSum += progress.listeningScore;
      speakingSum += progress.speakingScore;
      readingSum += progress.readingScore;
      writingSum += progress.writingScore;
      grammarSum += progress.grammarScore;
      vocabularySum += progress.vocabularyScore;
      count++;
    });

    return {
      listening: Math.round(listeningSum / count),
      speaking: Math.round(speakingSum / count),
      reading: Math.round(readingSum / count),
      writing: Math.round(writingSum / count),
      grammar: Math.round(grammarSum / count),
      vocabulary: Math.round(vocabularySum / count),
    };
  } catch (error) {
    console.error('Error fetching strength/weakness data:', error);
    return getMockStrengthWeaknessData();
  }
}

// ===== 7. 예측 진도 데이터 (AI 기반) =====
export async function getPredictedProgressData(
  userId: string
): Promise<{
  actual: { week: string; progress: number }[];
  predicted: { week: string; progress: number }[];
}> {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId), orderBy('weekId', 'asc'));

    const snapshot = await getDocs(q);
    const actual: { week: string; progress: number }[] = [];

    snapshot.forEach((doc) => {
      const progress = doc.data() as UserProgress;
      const avgScore =
        (progress.listeningScore +
          progress.speakingScore +
          progress.readingScore +
          progress.writingScore +
          progress.grammarScore +
          progress.vocabularyScore) /
        6;
      actual.push({
        week: progress.weekId,
        progress: Math.round(avgScore),
      });
    });

    if (actual.length === 0) {
      return getMockPredictedProgressData();
    }

    // 간단한 선형 회귀로 예측 (실제로는 더 복잡한 AI 모델 사용)
    const predicted: { week: string; progress: number }[] = [];
    const lastWeekNum = parseInt(actual[actual.length - 1].week.split('-')[1]);
    const lastProgress = actual[actual.length - 1].progress;

    // 최근 4주 성장률 계산
    const recentGrowth =
      actual.length >= 4
        ? (actual[actual.length - 1].progress - actual[actual.length - 4].progress) / 4
        : 5; // 기본 성장률 5%

    for (let i = 1; i <= 4; i++) {
      const nextWeekNum = lastWeekNum + i;
      const nextProgress = Math.min(100, lastProgress + recentGrowth * i);
      predicted.push({
        week: `week-${nextWeekNum}`,
        progress: Math.round(nextProgress),
      });
    }

    return { actual, predicted };
  } catch (error) {
    console.error('Error fetching predicted progress:', error);
    return getMockPredictedProgressData();
  }
}

// ===== Mock 데이터 (개발/오프라인용) =====
function getMockWeeklyProgressData(): WeeklyProgressData[] {
  return [
    { week: 'Week 1', listening: 45, speaking: 30, reading: 50, writing: 35, grammar: 60, vocabulary: 55 },
    { week: 'Week 2', listening: 55, speaking: 40, reading: 60, writing: 45, grammar: 65, vocabulary: 60 },
    { week: 'Week 3', listening: 60, speaking: 50, reading: 65, writing: 50, grammar: 70, vocabulary: 65 },
    { week: 'Week 4', listening: 70, speaking: 60, reading: 75, writing: 60, grammar: 75, vocabulary: 70 },
    { week: 'Week 5', listening: 75, speaking: 65, reading: 80, writing: 65, grammar: 80, vocabulary: 75 },
    { week: 'Week 6', listening: 80, speaking: 70, reading: 85, writing: 70, grammar: 85, vocabulary: 80 },
    { week: 'Week 7', listening: 85, speaking: 75, reading: 88, writing: 75, grammar: 88, vocabulary: 85 },
    { week: 'Week 8', listening: 88, speaking: 80, reading: 90, writing: 80, grammar: 90, vocabulary: 88 },
  ];
}

function getMockStreakData(): StreakData[] {
  const data: StreakData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 8) : 0;

    let level: StreakData['level'] = 'none';
    if (count >= 5) level = 'high';
    else if (count >= 3) level = 'medium';
    else if (count >= 1) level = 'low';

    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return data;
}

function getMockLevelProgressData(): LevelProgressData[] {
  return [
    { level: 'A1.1', current: 100, target: 100 },
    { level: 'A1.2', current: 100, target: 100 },
    { level: 'A2.1', current: 85, target: 100 },
    { level: 'A2.2', current: 0, target: 100 },
    { level: 'B1.1', current: 0, target: 100 },
    { level: 'B1.2', current: 0, target: 100 },
    { level: 'B2.1', current: 0, target: 100 },
    { level: 'B2.2', current: 0, target: 100 },
    { level: 'C1.1', current: 0, target: 100 },
    { level: 'C1.2', current: 0, target: 100 },
    { level: 'C2.1', current: 0, target: 100 },
    { level: 'C2.2', current: 0, target: 100 },
  ];
}

function getMockActivityDistributionData(): ActivityDistributionData[] {
  return [
    { type: 'Listening', count: 24, hours: 12.5 },
    { type: 'Speaking', count: 18, hours: 9.0 },
    { type: 'Reading', count: 20, hours: 10.2 },
    { type: 'Writing', count: 16, hours: 8.5 },
    { type: 'Grammar', count: 22, hours: 11.0 },
    { type: 'Vocabulary', count: 25, hours: 13.8 },
  ];
}

function getMockTimeSeriesData(): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const value = Math.random() > 0.2 ? Math.random() * 3 + 0.5 : 0;

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10,
    });
  }

  return data;
}

function getMockStrengthWeaknessData() {
  return {
    listening: 85,
    speaking: 70,
    reading: 88,
    writing: 75,
    grammar: 90,
    vocabulary: 82,
  };
}

function getMockPredictedProgressData() {
  return {
    actual: [
      { week: 'Week 1', progress: 45 },
      { week: 'Week 2', progress: 55 },
      { week: 'Week 3', progress: 62 },
      { week: 'Week 4', progress: 70 },
      { week: 'Week 5', progress: 75 },
      { week: 'Week 6', progress: 80 },
      { week: 'Week 7', progress: 85 },
      { week: 'Week 8', progress: 88 },
    ],
    predicted: [
      { week: 'Week 9', progress: 91 },
      { week: 'Week 10', progress: 93 },
      { week: 'Week 11', progress: 95 },
      { week: 'Week 12', progress: 97 },
    ],
  };
}
