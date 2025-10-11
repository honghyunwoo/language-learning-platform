/**
 * Uploaded Activity 타입 정의
 * 48개 JSON 파일의 실제 구조 반영
 */

export type ActivityType = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';
export type CEFRLevel = 'A1.1' | 'A1.2' | 'A2.1' | 'A2.2' | 'B1.1' | 'B1.2' | 'B2.1' | 'B2.2';

// ===== 기본 Activity 구조 =====
export interface BaseUploadedActivity {
  id: string;
  type: ActivityType;
  level: CEFRLevel;
  week: number;
  title: string;
  estimatedTime: number;
  objectives: string[];
  content: {
    theory?: unknown;
    examples?: unknown;
    exercises?: Exercise[];
    [key: string]: unknown;
  };
  assessment?: {
    preTest?: unknown[];
    postTest?: unknown[];
    [key: string]: unknown;
  };
  resources?: {
    videos?: unknown[];
    articles?: unknown[];
    [key: string]: unknown;
  };
  metadata?: {
    createdBy?: string;
    createdAt?: string;
    [key: string]: unknown;
  };
}

// ===== Exercise 타입 =====
export type ExerciseType =
  | 'fill_in_the_blank'
  | 'multiple_choice'
  | 'error_correction'
  | 'translation_ko_en'
  | 'translation_en_ko'
  | 'choose'
  | 'production'
  | 'collocation'
  | 'synonym_matching'
  | 'contextual_usage'
  | 'ordering'
  | 'cloze'
  | 'pair_match'
  | 'rewrite'
  | 'choose_best_reason'
  | 'dialogue_completion'
  | 'error_spotting'
  | 'minimal_pairs'
  | 'register_choice'
  | 'phrasal_verb'
  | 'context_match'
  | 'choose_correct_tense'
  | 'gap_sentence';

export interface BaseExercise {
  type: ExerciseType;
  [key: string]: unknown;
}

export interface FillInTheBlankExercise extends BaseExercise {
  type: 'fill_in_the_blank';
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export interface ErrorCorrectionExercise extends BaseExercise {
  type: 'error_correction';
  sentence: string;
  error?: string;
  fix?: string;
  explanation?: string;
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation_ko_en' | 'translation_en_ko';
  korean?: string;
  english?: string;
  correct: string;
  commonMistake?: string;
  why?: string;
}

export interface ProductionExercise extends BaseExercise {
  type: 'production';
  prompt: string;
  rubric?: string;
}

export type Exercise =
  | FillInTheBlankExercise
  | MultipleChoiceExercise
  | ErrorCorrectionExercise
  | TranslationExercise
  | ProductionExercise
  | BaseExercise;

// ===== Vocabulary Activity =====
export interface VocabularyActivity extends BaseUploadedActivity {
  type: 'vocabulary';
  content: {
    theory?: {
      introduction?: string;
      etymology?: unknown;
      semanticFields?: unknown[];
    };
    examples?: Record<string, unknown[]>;
    exercises?: Exercise[];
    deepDive?: unknown;
    application?: unknown;
  };
}

// ===== Grammar Activity =====
export interface GrammarActivity extends BaseUploadedActivity {
  type: 'grammar';
  content: {
    linguisticFoundation?: {
      title?: string;
      summary?: string;
      visualAid?: unknown;
    };
    coreTheory?: {
      rules?: unknown[];
    };
    comparison?: unknown;
    koreanLearnerPitfalls?: {
      title?: string;
      errors?: unknown[];
    };
    examples?: {
      pairs?: unknown[];
    };
    exercises?: Exercise[];
    deepDive?: unknown;
    realWorldApplication?: unknown;
  };
}

// ===== Listening Activity =====
export interface ListeningActivity extends BaseUploadedActivity {
  type: 'listening';
  audioFiles?: {
    main?: string;
    slow?: string;
    segments?: string[];
  };
  content: {
    scenario?: {
      title?: string;
      participants?: unknown[];
      setting?: string;
      length?: string;
      wpm?: number;
    };
    fullTranscript?: {
      paragraphs?: unknown[];
    };
    phonologicalAnalysis?: unknown;
    listeningExercises?: Exercise[];
    deepDive?: unknown;
  };
}

// ===== Speaking Activity =====
export interface SpeakingActivity extends BaseUploadedActivity {
  type: 'speaking';
  content: {
    theory?: unknown;
    scenarios?: unknown[];
    exercises?: Exercise[];
    pronunciation?: unknown;
    fluency?: unknown;
  };
}

// ===== Reading Activity =====
export interface ReadingActivity extends BaseUploadedActivity {
  type: 'reading';
  content: {
    passage?: {
      title?: string;
      text?: string;
      level?: string;
      wordCount?: number;
      readingTime?: number;
    };
    vocabulary?: unknown[];
    comprehensionQuestions?: Exercise[];
    exercises?: Exercise[];
    analysis?: unknown;
  };
}

// ===== Writing Activity =====
export interface WritingActivity extends BaseUploadedActivity {
  type: 'writing';
  content: {
    theory?: unknown;
    examples?: unknown[];
    exercises?: Exercise[];
    writingTasks?: unknown[];
    rubric?: unknown;
  };
}

// Union type
export type UploadedActivity =
  | VocabularyActivity
  | GrammarActivity
  | ListeningActivity
  | SpeakingActivity
  | ReadingActivity
  | WritingActivity;
