// types/conversation.ts

export interface ConversationCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface ConversationOption {
  id: string;
  text: string;
  translation: string;
  feedback: {
    type: 'excellent' | 'good' | 'needs-improvement';
    message: string;
    points: number;
    suggestion?: string;
    culturalNote?: string;
  };
  nextNodeId: string;
}

export interface DialogueNode {
  id: string;
  speaker: string; // character id
  text?: string;
  translation?: string;
  notes?: string;
  isChoice: boolean;
  options?: ConversationOption[];
  nextNodeId?: string;
  isEnd?: boolean;
  completionMessage?: string;
}

export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  example?: string;
}

export interface KeyPhrase {
  phrase: string;
  meaning: string;
  usage: string;
}

export interface ConversationScenario {
  location: string;
  situation: string;
  goal: string;
  culturalNotes: string[];
}

export interface ConversationScoring {
  maxPoints: number;
  excellentThreshold: number;
  goodThreshold: number;
  passingThreshold: number;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  estimatedTime: number; // minutes
  scenario: ConversationScenario;
  characters: ConversationCharacter[];
  dialogue: DialogueNode[];
  vocabulary: VocabularyItem[];
  keyPhrases: KeyPhrase[];
  scoring: ConversationScoring;
}

// 사용자의 대화 진행 상황
export interface ConversationProgress {
  userId: string;
  conversationId: string;
  currentNodeId: string;
  score: number;
  maxScore: number;
  choices: Record<string, string>; // nodeId -> optionId
  startedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

// 대화 결과
export interface ConversationResult {
  conversationId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  performanceLevel: 'excellent' | 'good' | 'needs-improvement' | 'failing';
  completedAt: Date;
  timeSpent: number; // seconds
  choices: Record<string, string>;
}
