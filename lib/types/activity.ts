/**
 * Activity Types for Language Learning Platform
 * 영어의 정석 - 모든 Activity 타입 정의
 */

// ===== 기본 타입 =====
export type ActivityType = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';

export type CEFRLevel =
  | 'A1.1' | 'A1.2' // Beginner
  | 'A2.1' | 'A2.2' // Elementary
  | 'B1.1' | 'B1.2' // Intermediate
  | 'B2.1' | 'B2.2' // Upper Intermediate
  | 'C1.1' | 'C1.2' // Advanced
  | 'C2.1' | 'C2.2'; // Proficiency

export type Difficulty = 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficiency';

// ===== Word/Vocabulary 타입 =====
export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection' | 'phrase';
  meaning: string;
  example: string;
  exampleMeaning: string;
  etymology?: {
    origin: string;
    evolution: string;
    culturalContext?: string;
  };
  relatedWords?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

// ===== Exercise 타입 =====
export interface BaseExercise {
  id: string;
  type: string;
  instruction: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation?: string;
}

export interface FillInBlankExercise extends BaseExercise {
  type: 'fill-in-blank';
  sentence: string;
  blank: number; // blank position
  correctAnswer: string;
  alternatives?: string[];
  explanation?: string;
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}

export interface SpeakingExercise extends BaseExercise {
  type: 'speaking';
  prompt: string;
  sampleAnswer?: string;
  audioUrl?: string;
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioUrl: string;
  transcript?: string;
  questions: Array<{
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string | number;
  }>;
}

export interface WritingExercise extends BaseExercise {
  type: 'writing';
  prompt: string;
  minWords?: number;
  maxWords?: number;
  rubric?: {
    criteria: string;
    points: number;
  }[];
}

export type Exercise =
  | MultipleChoiceExercise
  | FillInBlankExercise
  | MatchingExercise
  | SpeakingExercise
  | ListeningExercise
  | WritingExercise;

// ===== Grammar Rule 타입 =====
export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: Array<{
    sentence: string;
    translation: string;
    analysis?: string;
  }>;
  commonMistakes?: Array<{
    incorrect: string;
    correct: string;
    reason: string;
  }>;
}

// ===== Reading Passage 타입 =====
export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  translation?: string;
  vocabulary?: Word[];
  comprehensionQuestions: Array<{
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  }>;
}

// ===== Activity Base =====
export interface BaseActivity {
  id: string;
  weekId: string;
  type: ActivityType;
  level: CEFRLevel | string; // legacy support for 'A1', 'A2', etc.
  title: string;
  description: string;
  estimatedTime?: number; // minutes
  objectives?: string[];
  tags?: string[];
  difficulty?: Difficulty;
}

// ===== Specific Activity Types =====
export interface VocabularyActivity extends BaseActivity {
  type: 'vocabulary';
  words: Word[];
  exercises?: Exercise[];
  thematicGroup?: string;
}

export interface GrammarActivity extends BaseActivity {
  type: 'grammar';
  rules: GrammarRule[];
  exercises: Exercise[];
  relatedGrammar?: string[];
}

export interface ListeningActivity extends BaseActivity {
  type: 'listening';
  audioUrl: string;
  transcript?: string;
  exercises: ListeningExercise[];
  audioLength?: number; // seconds
}

export interface SpeakingActivity extends BaseActivity {
  type: 'speaking';
  scenarios: Array<{
    id: string;
    situation: string;
    prompt: string;
    sampleDialogue?: Array<{
      speaker: string;
      text: string;
    }>;
    exercises: SpeakingExercise[];
  }>;
}

export interface ReadingActivity extends BaseActivity {
  type: 'reading';
  passages: ReadingPassage[];
  exercises?: Exercise[];
}

export interface WritingActivity extends BaseActivity {
  type: 'writing';
  prompts: Array<{
    id: string;
    title: string;
    prompt: string;
    genre?: 'email' | 'essay' | 'letter' | 'blog' | 'report';
  }>;
  exercises: WritingExercise[];
  writingTips?: string[];
}

// ===== Union Type for all Activities =====
export type Activity =
  | VocabularyActivity
  | GrammarActivity
  | ListeningActivity
  | SpeakingActivity
  | ReadingActivity
  | WritingActivity;

// ===== Activity Metadata =====
export interface ActivityMetadata {
  id: string;
  type: ActivityType;
  weekId: string;
  level: CEFRLevel | string;
  title: string;
  description: string;
  estimatedTime?: number;
  difficulty?: Difficulty;
  completionRate?: number; // 0-100
  averageScore?: number; // 0-100
}

// ===== User Progress =====
export interface ActivityProgress {
  activityId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  timeSpent?: number; // minutes
  exercises: Array<{
    exerciseId: string;
    completed: boolean;
    correct?: boolean;
    answer?: string | number;
    score?: number;
  }>;
}

// ===== Activity Validation =====
export interface ActivityValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== Helper Functions =====
export function isVocabularyActivity(activity: Activity): activity is VocabularyActivity {
  return activity.type === 'vocabulary';
}

export function isGrammarActivity(activity: Activity): activity is GrammarActivity {
  return activity.type === 'grammar';
}

export function isListeningActivity(activity: Activity): activity is ListeningActivity {
  return activity.type === 'listening';
}

export function isSpeakingActivity(activity: Activity): activity is SpeakingActivity {
  return activity.type === 'speaking';
}

export function isReadingActivity(activity: Activity): activity is ReadingActivity {
  return activity.type === 'reading';
}

export function isWritingActivity(activity: Activity): activity is WritingActivity {
  return activity.type === 'writing';
}

export function getActivityTypeLabel(type: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    vocabulary: '어휘',
    grammar: '문법',
    listening: '듣기',
    speaking: '말하기',
    reading: '읽기',
    writing: '쓰기',
  };
  return labels[type];
}

export function getLevelLabel(level: CEFRLevel | string): string {
  const labels: Partial<Record<CEFRLevel, string>> = {
    'A1.1': 'Beginner 1',
    'A1.2': 'Beginner 2',
    'A2.1': 'Elementary 1',
    'A2.2': 'Elementary 2',
    'B1.1': 'Intermediate 1',
    'B1.2': 'Intermediate 2',
    'B2.1': 'Upper Intermediate 1',
    'B2.2': 'Upper Intermediate 2',
    'C1.1': 'Advanced 1',
    'C1.2': 'Advanced 2',
    'C2.1': 'Proficiency 1',
    'C2.2': 'Proficiency 2',
  };

  // Legacy support
  if (level === 'A1' || level === 'A2' || level === 'B1' || level === 'B2' || level === 'C1' || level === 'C2') {
    return level;
  }

  return labels[level as CEFRLevel] || level;
}

export function parseLevel(level: string): { major: string; minor?: string } {
  const match = level.match(/^([ABC][12])(?:\.([12]))?$/);
  if (match) {
    return {
      major: match[1],
      minor: match[2],
    };
  }
  return { major: level };
}
