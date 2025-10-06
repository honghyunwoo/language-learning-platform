import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  ActivityProgress,
  VocabularyProgress,
  ReadingProgress,
  GrammarProgress,
  ListeningProgress,
  WritingProgress,
  SpeakingProgress,
  ActivityProgressInput,
  WeekProgress,
  OverallProgress,
} from '@/types/progress';

/**
 * Progress Collection 이름
 */
const PROGRESS_COLLECTION = 'activity_progress';

/**
 * Document ID 생성 (userId_activityId)
 */
function getProgressDocId(userId: string, activityId: string): string {
  return `${userId}_${activityId}`;
}

/**
 * Activity 진행률 저장/업데이트
 */
export async function saveActivityProgress(
  progressData: ActivityProgressInput
): Promise<void> {
  const { userId, activityId } = progressData;
  const docId = getProgressDocId(userId, activityId);
  const docRef = doc(db!, PROGRESS_COLLECTION, docId);

  const dataToSave = {
    ...progressData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving activity progress:', error);
    throw error;
  }
}

/**
 * Activity 진행률 업데이트 (부분 업데이트)
 */
export async function updateActivityProgress(
  userId: string,
  activityId: string,
  updates: Partial<ActivityProgressInput>
): Promise<void> {
  const docId = getProgressDocId(userId, activityId);
  const docRef = doc(db!, PROGRESS_COLLECTION, docId);

  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating activity progress:', error);
    throw error;
  }
}

/**
 * Activity 진행률 조회
 */
export async function getActivityProgress<T extends ActivityProgress>(
  userId: string,
  activityId: string
): Promise<T | null> {
  const docId = getProgressDocId(userId, activityId);
  const docRef = doc(db!, PROGRESS_COLLECTION, docId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error('Error getting activity progress:', error);
    throw error;
  }
}

/**
 * 특정 주차의 모든 Activity 진행률 조회
 */
export async function getWeekProgress(
  userId: string,
  weekId: string
): Promise<WeekProgress | null> {
  const progressRef = collection(db!, PROGRESS_COLLECTION);
  const q = query(
    progressRef,
    where('userId', '==', userId),
    where('weekId', '==', weekId)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const activities: WeekProgress['activities'] = {};
    let completedActivities = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data() as ActivityProgress;

      // Type-safe assignment
      if (data.type === 'vocabulary') activities.vocabulary = data;
      else if (data.type === 'reading') activities.reading = data;
      else if (data.type === 'grammar') activities.grammar = data;
      else if (data.type === 'listening') activities.listening = data;
      else if (data.type === 'writing') activities.writing = data;
      else if (data.type === 'speaking') activities.speaking = data;

      if (data.completed) {
        completedActivities++;
      }
    });

    const totalActivities = 6; // vocabulary, reading, grammar, listening, writing, speaking
    const progressPercentage = Math.round(
      (completedActivities / totalActivities) * 100
    );

    return {
      weekId,
      userId,
      totalActivities,
      completedActivities,
      progressPercentage,
      activities,
      updatedAt: Timestamp.now(),
    };
  } catch (error) {
    console.error('Error getting week progress:', error);
    throw error;
  }
}

/**
 * 사용자 전체 진행률 조회
 */
export async function getOverallProgress(
  userId: string
): Promise<OverallProgress> {
  const progressRef = collection(db!, PROGRESS_COLLECTION);
  const q = query(progressRef, where('userId', '==', userId));

  try {
    const querySnapshot = await getDocs(q);

    const weekProgressMap: { [weekId: string]: ActivityProgress[] } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data() as ActivityProgress;
      if (!weekProgressMap[data.weekId]) {
        weekProgressMap[data.weekId] = [];
      }
      weekProgressMap[data.weekId].push(data);
    });

    // Week별 진행률 계산
    const weeks: WeekProgress[] = [];
    let completedWeeks = 0;
    let totalActivitiesCompleted = 0;

    Object.keys(weekProgressMap)
      .sort()
      .forEach((weekId) => {
        const weekActivities = weekProgressMap[weekId];
        const activities: WeekProgress['activities'] = {};
        let completedInWeek = 0;

        weekActivities.forEach((activity) => {
          // Type-safe assignment
          if (activity.type === 'vocabulary') activities.vocabulary = activity;
          else if (activity.type === 'reading') activities.reading = activity;
          else if (activity.type === 'grammar') activities.grammar = activity;
          else if (activity.type === 'listening') activities.listening = activity;
          else if (activity.type === 'writing') activities.writing = activity;
          else if (activity.type === 'speaking') activities.speaking = activity;

          if (activity.completed) {
            completedInWeek++;
            totalActivitiesCompleted++;
          }
        });

        const totalActivities = 6;
        const progressPercentage = Math.round(
          (completedInWeek / totalActivities) * 100
        );

        if (progressPercentage === 100) {
          completedWeeks++;
        }

        weeks.push({
          weekId,
          userId,
          totalActivities,
          completedActivities: completedInWeek,
          progressPercentage,
          activities,
          updatedAt: Timestamp.now(),
        });
      });

    // 현재 학습 중인 주차 찾기 (완료되지 않은 가장 낮은 주차)
    const currentWeek =
      weeks.find((w) => w.progressPercentage < 100)?.weekId || 'week-1';

    const totalWeeks = 8; // A1(2주) + A2(2주) + B1(2주) + B2(2주)
    const totalActivities = totalWeeks * 6; // 48개
    const overallProgressPercentage = Math.round(
      (totalActivitiesCompleted / totalActivities) * 100
    );

    return {
      userId,
      totalWeeks,
      completedWeeks,
      currentWeek,
      totalActivitiesCompleted,
      totalActivities,
      progressPercentage: overallProgressPercentage,
      weeks,
      updatedAt: Timestamp.now(),
    };
  } catch (error) {
    console.error('Error getting overall progress:', error);
    throw error;
  }
}

/**
 * Vocabulary Activity 완료 처리
 */
export async function completeVocabularyActivity(
  userId: string,
  activityId: string,
  weekId: string,
  wordsMastered: number,
  totalWords: number,
  quizScore: number
): Promise<void> {
  const progressData: VocabularyProgress = {
    type: 'vocabulary',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    wordsMastered,
    totalWords,
    quizScore,
    quizAttempts: 1,
    lastPracticedWords: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}

/**
 * Reading Activity 완료 처리
 */
export async function completeReadingActivity(
  userId: string,
  activityId: string,
  weekId: string,
  readingTime: number,
  wpm: number,
  comprehensionScore: number,
  questionsAnswered: number,
  totalQuestions: number
): Promise<void> {
  const progressData: ReadingProgress = {
    type: 'reading',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    readingTime,
    wpm,
    comprehensionScore,
    questionsAnswered,
    totalQuestions,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}

/**
 * Grammar Activity 완료 처리
 */
export async function completeGrammarActivity(
  userId: string,
  activityId: string,
  weekId: string,
  exercisesCompleted: number,
  totalExercises: number,
  correctAnswers: number,
  totalAttempts: number,
  weakPoints: string[] = []
): Promise<void> {
  const accuracy = Math.round((correctAnswers / totalAttempts) * 100);

  const progressData: GrammarProgress = {
    type: 'grammar',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    exercisesCompleted,
    totalExercises,
    accuracy,
    weakPoints,
    correctAnswers,
    totalAttempts,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}

/**
 * Listening Activity 완료 처리
 */
export async function completeListeningActivity(
  userId: string,
  activityId: string,
  weekId: string,
  listenCount: number,
  transcriptViewed: boolean,
  dictationScore: number,
  comprehensionScore: number,
  averageSpeed: number
): Promise<void> {
  const progressData: ListeningProgress = {
    type: 'listening',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    listenCount,
    transcriptViewed,
    dictationScore,
    comprehensionScore,
    averageSpeed,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}

/**
 * Writing Activity 완료 처리
 */
export async function completeWritingActivity(
  userId: string,
  activityId: string,
  weekId: string,
  submittedText: string,
  wordCount: number,
  writingTime: number,
  selfEvaluation?: { checkedItems: number; totalItems: number }
): Promise<void> {
  const progressData: WritingProgress = {
    type: 'writing',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    draft: '',
    submitted: true,
    submittedText,
    wordCount,
    writingTime,
    selfEvaluation,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}

/**
 * Speaking Activity 완료 처리
 */
export async function completeSpeakingActivity(
  userId: string,
  activityId: string,
  weekId: string,
  recordingsCompleted: number,
  totalSentences: number,
  recordingDuration: number,
  attempts: number,
  selfEvaluation?: { checkedItems: number; totalItems: number }
): Promise<void> {
  const progressData: SpeakingProgress = {
    type: 'speaking',
    userId,
    activityId,
    weekId,
    completed: true,
    completedAt: Timestamp.now(),
    recordingsCompleted,
    totalSentences,
    recordingDuration,
    attempts,
    selfEvaluation,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await saveActivityProgress(progressData);
}
