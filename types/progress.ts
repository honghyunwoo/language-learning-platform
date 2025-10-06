import { Timestamp } from 'firebase/firestore';

/**
 * 공통 진행률 인터페이스
 */
export interface BaseProgress {
  userId: string;
  activityId: string; // 예: "week-1-vocabulary"
  weekId: string; // 예: "week-1"
  completed: boolean;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Vocabulary Activity 진행률
 */
export interface VocabularyProgress extends BaseProgress {
  type: 'vocabulary';
  wordsMastered: number; // 암기한 단어 수
  totalWords: number; // 전체 단어 수
  quizScore: number; // 0-100
  quizAttempts: number; // 퀴즈 시도 횟수
  lastPracticedWords: string[]; // 마지막 연습한 단어 ID들
}

/**
 * Reading Activity 진행률
 */
export interface ReadingProgress extends BaseProgress {
  type: 'reading';
  readingTime: number; // 초 단위
  wpm: number; // Words Per Minute
  comprehensionScore: number; // 이해도 점수 0-100
  questionsAnswered: number;
  totalQuestions: number;
}

/**
 * Grammar Activity 진행률
 */
export interface GrammarProgress extends BaseProgress {
  type: 'grammar';
  exercisesCompleted: number;
  totalExercises: number;
  accuracy: number; // 정답률 % (0-100)
  weakPoints: string[]; // 자주 틀린 문법 포인트
  correctAnswers: number;
  totalAttempts: number;
}

/**
 * Listening Activity 진행률
 */
export interface ListeningProgress extends BaseProgress {
  type: 'listening';
  listenCount: number; // 몇 번 들었는지
  transcriptViewed: boolean; // 스크립트를 봤는지
  dictationScore: number; // 받아쓰기 점수 0-100
  comprehensionScore: number; // 이해도 점수 0-100
  averageSpeed: number; // 평균 청취 속도 (0.5 ~ 1.5)
}

/**
 * Writing Activity 진행률
 */
export interface WritingProgress extends BaseProgress {
  type: 'writing';
  draft: string; // 작성 중인 글
  submitted: boolean;
  submittedText?: string;
  wordCount: number;
  writingTime: number; // 초 단위
  selfEvaluation?: {
    checkedItems: number;
    totalItems: number;
  };
}

/**
 * Speaking Activity 진행률
 */
export interface SpeakingProgress extends BaseProgress {
  type: 'speaking';
  recordingsCompleted: number; // 녹음 완료한 문장 수
  totalSentences: number;
  recordingDuration: number; // 총 녹음 시간 (초)
  attempts: number; // 녹음 시도 횟수
  selfEvaluation?: {
    checkedItems: number;
    totalItems: number;
  };
}

/**
 * 모든 Activity 진행률 타입
 */
export type ActivityProgress =
  | VocabularyProgress
  | ReadingProgress
  | GrammarProgress
  | ListeningProgress
  | WritingProgress
  | SpeakingProgress;

/**
 * 전체 주차 진행률 요약
 */
export interface WeekProgress {
  weekId: string;
  userId: string;
  totalActivities: number; // 전체 활동 수 (6개)
  completedActivities: number; // 완료한 활동 수
  progressPercentage: number; // 완료율 % (0-100)
  activities: {
    vocabulary?: VocabularyProgress;
    reading?: ReadingProgress;
    grammar?: GrammarProgress;
    listening?: ListeningProgress;
    writing?: WritingProgress;
    speaking?: SpeakingProgress;
  };
  updatedAt: Timestamp;
}

/**
 * 사용자 전체 진행률
 */
export interface OverallProgress {
  userId: string;
  totalWeeks: number; // 전체 주차 수 (8주)
  completedWeeks: number; // 완료한 주차 수
  currentWeek: string; // 현재 학습 중인 주차
  totalActivitiesCompleted: number; // 전체 완료한 활동 수
  totalActivities: number; // 전체 활동 수 (48개 = 8주 × 6활동)
  progressPercentage: number; // 전체 진행률 % (0-100)
  weeks: WeekProgress[];
  updatedAt: Timestamp;
}

/**
 * Progress 업데이트를 위한 입력 타입
 */
export type VocabularyProgressInput = Omit<
  VocabularyProgress,
  'createdAt' | 'updatedAt'
>;
export type ReadingProgressInput = Omit<
  ReadingProgress,
  'createdAt' | 'updatedAt'
>;
export type GrammarProgressInput = Omit<
  GrammarProgress,
  'createdAt' | 'updatedAt'
>;
export type ListeningProgressInput = Omit<
  ListeningProgress,
  'createdAt' | 'updatedAt'
>;
export type WritingProgressInput = Omit<
  WritingProgress,
  'createdAt' | 'updatedAt'
>;
export type SpeakingProgressInput = Omit<
  SpeakingProgress,
  'createdAt' | 'updatedAt'
>;

export type ActivityProgressInput =
  | VocabularyProgressInput
  | ReadingProgressInput
  | GrammarProgressInput
  | ListeningProgressInput
  | WritingProgressInput
  | SpeakingProgressInput;
