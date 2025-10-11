/**
 * AI Conversation Partner - AI 대화 파트너 시스템
 * 영어의 정석 - 30분 GPT 기반 대화 시나리오
 */

import { CEFRLevel } from '@/lib/types/activity';

// ===== 대화 시나리오 타입 =====
export type ScenarioCategory = 'daily' | 'business' | 'academic' | 'travel' | 'social';

export interface ConversationScenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  level: CEFRLevel;
  description: string;
  duration: number; // minutes
  objectives: string[];
  keyPhrases: string[];
  culturalNotes?: string[];
}

// ===== 대화 메시지 =====
export interface ConversationMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  feedback?: {
    grammar: string[];
    vocabulary: string[];
    pronunciation?: string[];
    suggestions: string[];
  };
}

// ===== AI 대화 설정 =====
export interface ConversationConfig {
  scenarioId: string;
  userLevel: CEFRLevel;
  focusAreas: ('grammar' | 'vocabulary' | 'pronunciation' | 'fluency')[];
  realTimeFeedback: boolean;
  adaptiveDifficulty: boolean;
}

// ===== 대화 세션 =====
export interface ConversationSession {
  id: string;
  userId: string;
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  messages: ConversationMessage[];
  totalTurns: number;
  feedback: {
    overallScore: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    strengths: string[];
    improvements: string[];
  };
}

// ===== 시나리오 생성기 (GPT-5 프롬프트 기반) =====
export function generateScenarioPrompt(scenario: ConversationScenario, userLevel: CEFRLevel): string {
  return `
You are an English conversation partner for a ${userLevel} level learner.

Scenario: ${scenario.title}
Category: ${scenario.category}
Objectives: ${scenario.objectives.join(', ')}

Instructions:
1. Engage in natural conversation appropriate for ${userLevel} level
2. Use key phrases: ${scenario.keyPhrases.join(', ')}
3. Provide gentle corrections when needed
4. Encourage the learner to use full sentences
5. Ask follow-up questions to extend the conversation
${scenario.culturalNotes ? `6. Cultural context: ${scenario.culturalNotes.join(', ')}` : ''}

Start the conversation naturally and guide the learner through the scenario.
  `.trim();
}

// ===== 피드백 생성 프롬프트 =====
export function generateFeedbackPrompt(message: string, level: CEFRLevel): string {
  return `
Analyze this English message from a ${level} level learner:
"${message}"

Provide constructive feedback in JSON format:
{
  "grammar": ["error 1 explanation", "error 2 explanation"],
  "vocabulary": ["suggestion 1", "suggestion 2"],
  "pronunciation": ["tip 1", "tip 2"],
  "suggestions": ["overall improvement 1", "overall improvement 2"]
}

Be encouraging and specific.
  `.trim();
}

// ===== 사전 정의된 시나리오 =====
export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  // Daily Life
  {
    id: 'daily_coffee_shop',
    title: 'Ordering at a Coffee Shop',
    category: 'daily',
    level: 'A2.1',
    description: '카페에서 음료 주문하기',
    duration: 15,
    objectives: ['주문 표현 익히기', '선호도 말하기', '질문에 답하기'],
    keyPhrases: [
      "I'd like to order...",
      'Can I have...',
      'What do you recommend?',
      'To go, please',
    ],
    culturalNotes: ['미국에서는 팁 문화가 있음', '크기는 tall, grande, venti로 표현'],
  },
  {
    id: 'daily_grocery_shopping',
    title: 'Grocery Shopping',
    category: 'daily',
    level: 'A2.2',
    description: '슈퍼마켓에서 장보기',
    duration: 20,
    objectives: ['식재료 이름 익히기', '위치 묻기', '가격 확인하기'],
    keyPhrases: [
      'Where can I find...?',
      'How much is this?',
      'Do you have...?',
      "I'm looking for...",
    ],
  },

  // Business
  {
    id: 'business_meeting',
    title: 'Team Meeting',
    category: 'business',
    level: 'B2.1',
    description: '팀 회의 참여하기',
    duration: 30,
    objectives: ['의견 제시하기', '동의/반대 표현하기', '제안하기'],
    keyPhrases: [
      'I think we should...',
      'What if we...',
      'I agree/disagree because...',
      'Could we consider...',
    ],
    culturalNotes: ['회의 시작 전 스몰톡', '직급보다는 이름으로 호칭'],
  },
  {
    id: 'business_email',
    title: 'Professional Email Writing',
    category: 'business',
    level: 'B1.2',
    description: '비즈니스 이메일 작성 연습',
    duration: 25,
    objectives: ['격식있는 표현 익히기', '요청 방법', '회신 작성'],
    keyPhrases: [
      'I hope this email finds you well',
      'I am writing to...',
      'Could you please...',
      'Thank you for your time',
    ],
  },

  // Travel
  {
    id: 'travel_hotel_checkin',
    title: 'Hotel Check-in',
    category: 'travel',
    level: 'A2.2',
    description: '호텔 체크인하기',
    duration: 15,
    objectives: ['예약 확인하기', '요청사항 말하기', '시설 안내 받기'],
    keyPhrases: [
      'I have a reservation under...',
      'Could I have a room with...?',
      "What time is breakfast?",
      'Where is the elevator?',
    ],
  },

  // Academic
  {
    id: 'academic_presentation',
    title: 'Academic Presentation',
    category: 'academic',
    level: 'C1.1',
    description: '학술 발표 연습',
    duration: 30,
    objectives: ['논리적 구조', '데이터 설명', '질문 답변'],
    keyPhrases: [
      'Today, I will discuss...',
      'As shown in this graph...',
      'This suggests that...',
      'To summarize...',
    ],
  },
];

// ===== 시나리오 필터링 =====
export function filterScenarios(
  category?: ScenarioCategory,
  level?: CEFRLevel,
  duration?: number
): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter((scenario) => {
    if (category && scenario.category !== category) return false;
    if (level && scenario.level !== level) return false;
    if (duration && scenario.duration > duration) return false;
    return true;
  });
}

// ===== 대화 세션 생성 =====
export function createConversationSession(
  userId: string,
  scenarioId: string
): ConversationSession {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    scenarioId,
    startTime: new Date(),
    messages: [],
    totalTurns: 0,
    feedback: {
      overallScore: 0,
      grammar: 0,
      vocabulary: 0,
      fluency: 0,
      strengths: [],
      improvements: [],
    },
  };
}

// ===== API 호출 함수 (예시) =====
export async function sendMessageToAI(
  message: string,
  sessionContext: ConversationSession,
  config: ConversationConfig
): Promise<{ response: string; feedback?: ConversationMessage['feedback'] }> {
  // 실제 구현에서는 OpenAI API 호출
  // 여기서는 타입과 구조만 정의

  const scenario = CONVERSATION_SCENARIOS.find((s) => s.id === config.scenarioId);

  if (!scenario) {
    throw new Error('Scenario not found');
  }

  // GPT API 호출 (예시)
  // const response = await fetch('/api/ai/conversation', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     message,
  //     scenarioPrompt: generateScenarioPrompt(scenario, config.userLevel),
  //     conversationHistory: sessionContext.messages,
  //     config,
  //   }),
  // });

  return {
    response: 'AI response placeholder',
    feedback: config.realTimeFeedback
      ? {
          grammar: [],
          vocabulary: [],
          pronunciation: [],
          suggestions: [],
        }
      : undefined,
  };
}
