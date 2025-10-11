/**
 * Placement Test 타입 정의
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionType = 'mcq' | 'inference' | 'detail' | 'self_rating';

export interface BaseQuestion {
  type: QuestionType;
  q: string;
  difficulty?: CEFRLevel;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq' | 'inference' | 'detail';
  options: string[];
  a: string;
}

export interface SelfRatingQuestion extends BaseQuestion {
  type: 'self_rating';
  scale: number[];
}

export type PlacementQuestion = MCQQuestion | SelfRatingQuestion;

// Vocabulary & Grammar
export interface VocabularySection {
  name: 'Vocabulary & Collocation' | 'Grammar & Usage';
  items: MCQQuestion[];
}

// Reading
export interface ReadingPassage {
  text: string;
  items: MCQQuestion[];
}

export interface ReadingSection {
  name: 'Reading (Short Passage)';
  passages: ReadingPassage[];
}

// Listening
export interface ListeningItem extends MCQQuestion {
  audio: string;
  script: string;
}

export interface ListeningSection {
  name: 'Listening (Script-based)';
  items: ListeningItem[];
}

// Speaking
export interface SpeakingSection {
  name: 'Speaking (Self-assessment)';
  items: SelfRatingQuestion[];
}

export type PlacementSection =
  | VocabularySection
  | ReadingSection
  | ListeningSection
  | SpeakingSection;

// Scoring
export interface ScoringBand {
  range: string;
  min?: number;
  max?: number;
  level: CEFRLevel;
  description: string;
}

export interface ScoringConfig {
  method: string;
  bands: ScoringBand[];
  placementRule: string;
}

// Main Test
export interface PlacementTest {
  id: string;
  type: 'placement_test';
  title: string;
  estimatedTime: number;
  sections: PlacementSection[];
  scoring: ScoringConfig;
  metadata: {
    createdBy: string;
    createdAt: string;
  };
}

// User Answer
export interface UserAnswer {
  questionId: string;
  sectionName: string;
  answer: string | number;
  correct?: boolean;
  difficulty?: CEFRLevel;
}

// Test Result
export interface PlacementTestResult {
  userId: string;
  testId: string;
  timestamp: string;
  answers: UserAnswer[];
  score: number;
  maxScore: number;
  level: CEFRLevel;
  recommendedWeek: number;
  difficultyPattern: {
    [key in CEFRLevel]?: {
      total: number;
      correct: number;
      percentage: number;
    };
  };
}
