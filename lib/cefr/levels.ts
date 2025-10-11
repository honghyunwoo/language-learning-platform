/**
 * CEFR 12-Level System
 * 영어의 정석 - Common European Framework of Reference for Languages
 * A1.1 ~ C2.2 (12개 세분화 레벨)
 */

import { CEFRLevel } from '@/lib/types/activity';

// ===== CEFR 레벨 정의 =====
export interface CEFRLevelDefinition {
  code: CEFRLevel;
  major: string; // A1, A2, B1, B2, C1, C2
  minor: string; // 1, 2
  name: string;
  koreanName: string;
  description: string;
  canDo: string[];
  grammarPoints: string[];
  vocabularySize: number; // 어휘량
  estimatedHours: number; // 학습 시간 (누적)
  color: string; // UI 색상
}

// ===== 12개 CEFR 레벨 =====
export const CEFR_LEVELS: CEFRLevelDefinition[] = [
  // A1 - Beginner
  {
    code: 'A1.1',
    major: 'A1',
    minor: '1',
    name: 'Beginner 1',
    koreanName: '초급 1',
    description: '가장 기본적인 일상 표현 사용',
    canDo: [
      '자신과 다른 사람을 소개할 수 있음',
      '매우 간단한 질문을 하고 답할 수 있음',
      '기본적인 인사말과 감사 표현 사용',
    ],
    grammarPoints: ['be동사', '현재시제', '인칭대명사', '단수/복수', '기본 의문문'],
    vocabularySize: 300,
    estimatedHours: 50,
    color: '#10b981',
  },
  {
    code: 'A1.2',
    major: 'A1',
    minor: '2',
    name: 'Beginner 2',
    koreanName: '초급 2',
    description: '익숙한 일상 표현과 아주 기본적인 문장 사용',
    canDo: [
      '자신의 가족과 친구에 대해 말할 수 있음',
      '간단한 지시 사항을 이해하고 따를 수 있음',
      '일상적인 쇼핑과 식사 주문 가능',
    ],
    grammarPoints: ['일반동사', '현재진행형', '과거시제', '빈도부사', '전치사'],
    vocabularySize: 600,
    estimatedHours: 100,
    color: '#10b981',
  },

  // A2 - Elementary
  {
    code: 'A2.1',
    major: 'A2',
    minor: '1',
    name: 'Elementary 1',
    koreanName: '기초 1',
    description: '일상적이고 친숙한 주제에 관해 의사소통',
    canDo: [
      '자신의 배경, 교육, 직업에 대해 설명 가능',
      '간단한 여행 계획과 예약 가능',
      '개인적 관심사에 대해 간단히 이야기 가능',
    ],
    grammarPoints: ['미래시제', '비교급/최상급', '조동사(can, should)', '접속사', '간접의문문'],
    vocabularySize: 1000,
    estimatedHours: 180,
    color: '#3b82f6',
  },
  {
    code: 'A2.2',
    major: 'A2',
    minor: '2',
    name: 'Elementary 2',
    koreanName: '기초 2',
    description: '친숙한 일상 활동에서 정보 교환',
    canDo: [
      '자신의 경험과 계획에 대해 이야기 가능',
      '의견을 간단히 표현하고 이유 설명 가능',
      '기본적인 이메일과 메시지 작성 가능',
    ],
    grammarPoints: ['현재완료', '수동태', '관계대명사', '가정법 현재', '부정사/동명사'],
    vocabularySize: 1500,
    estimatedHours: 250,
    color: '#3b82f6',
  },

  // B1 - Intermediate
  {
    code: 'B1.1',
    major: 'B1',
    minor: '1',
    name: 'Intermediate 1',
    koreanName: '중급 1',
    description: '친숙한 주제의 표준어를 이해하고 사용',
    canDo: [
      '업무, 학교, 여가 관련 대화 참여 가능',
      '여행 중 발생하는 대부분의 상황 대처 가능',
      '간단한 프레젠테이션과 발표 가능',
    ],
    grammarPoints: ['과거완료', '미래완료', '관계부사', '분사구문', '가정법 과거'],
    vocabularySize: 2500,
    estimatedHours: 400,
    color: '#f59e0b',
  },
  {
    code: 'B1.2',
    major: 'B1',
    minor: '2',
    name: 'Intermediate 2',
    koreanName: '중급 2',
    description: '친숙한 주제에서 논리적으로 의견 전개',
    canDo: [
      '개인적 관심사에 대해 상세히 설명 가능',
      '경험, 사건, 꿈, 희망, 야망 묘사 가능',
      '의견과 계획에 대한 간단한 이유와 설명 제공',
    ],
    grammarPoints: ['가정법 혼합', '도치', '강조구문', '명사절', '부사절'],
    vocabularySize: 3500,
    estimatedHours: 550,
    color: '#f59e0b',
  },

  // B2 - Upper Intermediate
  {
    code: 'B2.1',
    major: 'B2',
    minor: '1',
    name: 'Upper Intermediate 1',
    koreanName: '중상급 1',
    description: '복잡한 텍스트의 주요 내용 이해',
    canDo: [
      '추상적 주제를 포함한 복잡한 텍스트 이해',
      '자신의 전문 분야에서 기술적 토론 가능',
      '원어민과 자연스럽고 유창하게 소통 가능',
    ],
    grammarPoints: ['고급 수동태', '복잡한 조건문', '화법 전환', '강조 표현', '생략'],
    vocabularySize: 5000,
    estimatedHours: 750,
    color: '#ef4444',
  },
  {
    code: 'B2.2',
    major: 'B2',
    minor: '2',
    name: 'Upper Intermediate 2',
    koreanName: '중상급 2',
    description: '다양한 주제에서 명확하고 상세한 텍스트 작성',
    canDo: [
      '시사 문제에 대한 논쟁적 에세이 작성 가능',
      '다양한 관점의 장단점 비교 설명 가능',
      '명확하고 체계적인 보고서 작성 가능',
    ],
    grammarPoints: ['고급 가정법', '복합 관계사', '강조 구조', '문체별 어법', '학술적 표현'],
    vocabularySize: 6500,
    estimatedHours: 900,
    color: '#ef4444',
  },

  // C1 - Advanced
  {
    code: 'C1.1',
    major: 'C1',
    minor: '1',
    name: 'Advanced 1',
    koreanName: '고급 1',
    description: '광범위하고 까다로운 텍스트 이해',
    canDo: [
      '긴 복잡한 사실적, 문학적 텍스트 이해',
      '유창하고 자연스럽게 자신을 표현',
      '사회적, 학문적, 직업적 목적으로 언어 효과적 사용',
    ],
    grammarPoints: ['고급 문법 구조', '관용 표현', '학술적 글쓰기', '논리적 연결어', '수사적 장치'],
    vocabularySize: 8500,
    estimatedHours: 1100,
    color: '#8b5cf6',
  },
  {
    code: 'C1.2',
    major: 'C1',
    minor: '2',
    name: 'Advanced 2',
    koreanName: '고급 2',
    description: '복잡한 주제에서 명확하고 체계적인 텍스트 작성',
    canDo: [
      '복잡한 주제를 명확하고 논리적으로 설명',
      '적절한 구조와 응집 장치로 긴 텍스트 작성',
      '상황에 맞는 격식과 문체 선택 가능',
    ],
    grammarPoints: ['원어민 수준 문법', '미묘한 뉘앙스', '문학적 표현', '전문 용어', '방언 이해'],
    vocabularySize: 11000,
    estimatedHours: 1300,
    color: '#8b5cf6',
  },

  // C2 - Proficiency
  {
    code: 'C2.1',
    major: 'C2',
    minor: '1',
    name: 'Proficiency 1',
    koreanName: '최상급 1',
    description: '거의 모든 듣기와 읽기를 쉽게 이해',
    canDo: [
      '거의 모든 형태의 구어 및 문어 이해',
      '다양한 출처의 정보를 요약하고 재구성',
      '복잡한 상황에서도 정확하고 자연스럽게 표현',
    ],
    grammarPoints: ['원어민 수준', '모든 문법 구조 완벽 구사', '뉘앙스 완전 이해', '문학적 분석', '전문가 수준'],
    vocabularySize: 15000,
    estimatedHours: 1600,
    color: '#ec4899',
  },
  {
    code: 'C2.2',
    major: 'C2',
    minor: '2',
    name: 'Proficiency 2',
    koreanName: '최상급 2',
    description: '원어민에 가까운 완벽한 언어 구사',
    canDo: [
      '어떤 상황에서도 원어민처럼 소통 가능',
      '학술적, 전문적 텍스트를 원어민 수준으로 작성',
      '미묘한 의미 차이를 정확히 표현',
    ],
    grammarPoints: ['원어민 완벽 수준', '모든 장르 숙달', '문화적 맥락 완전 이해', '전문가 수준 완성', '교육 가능 수준'],
    vocabularySize: 20000,
    estimatedHours: 2000,
    color: '#ec4899',
  },
];

// ===== Helper 함수 =====
export function getCEFRLevel(code: CEFRLevel): CEFRLevelDefinition | undefined {
  return CEFR_LEVELS.find((level) => level.code === code);
}

export function getCEFRLevelsByMajor(major: string): CEFRLevelDefinition[] {
  return CEFR_LEVELS.filter((level) => level.major === major);
}

export function getNextLevel(currentLevel: CEFRLevel): CEFRLevel | null {
  const currentIndex = CEFR_LEVELS.findIndex((level) => level.code === currentLevel);
  if (currentIndex === -1 || currentIndex === CEFR_LEVELS.length - 1) {
    return null;
  }
  return CEFR_LEVELS[currentIndex + 1].code;
}

export function getPreviousLevel(currentLevel: CEFRLevel): CEFRLevel | null {
  const currentIndex = CEFR_LEVELS.findIndex((level) => level.code === currentLevel);
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }
  return CEFR_LEVELS[currentIndex - 1].code;
}

export function calculateProgress(currentLevel: CEFRLevel): {
  percentage: number;
  currentIndex: number;
  totalLevels: number;
} {
  const currentIndex = CEFR_LEVELS.findIndex((level) => level.code === currentLevel);
  return {
    percentage: ((currentIndex + 1) / CEFR_LEVELS.length) * 100,
    currentIndex: currentIndex + 1,
    totalLevels: CEFR_LEVELS.length,
  };
}

export function estimateTimeToNextLevel(currentLevel: CEFRLevel): number {
  const current = getCEFRLevel(currentLevel);
  const next = getNextLevel(currentLevel);

  if (!current || !next) {
    return 0;
  }

  const nextDef = getCEFRLevel(next);
  if (!nextDef) {
    return 0;
  }

  return nextDef.estimatedHours - current.estimatedHours;
}

// ===== 레벨 테스트 결과로 CEFR 레벨 결정 =====
export function determineCEFRLevel(score: number): CEFRLevel {
  // 0-100 점수를 12개 레벨로 매핑
  if (score < 8.33) return 'A1.1';
  if (score < 16.67) return 'A1.2';
  if (score < 25) return 'A2.1';
  if (score < 33.33) return 'A2.2';
  if (score < 41.67) return 'B1.1';
  if (score < 50) return 'B1.2';
  if (score < 58.33) return 'B2.1';
  if (score < 66.67) return 'B2.2';
  if (score < 75) return 'C1.1';
  if (score < 83.33) return 'C1.2';
  if (score < 91.67) return 'C2.1';
  return 'C2.2';
}

// ===== 레벨별 추천 학습 시간 =====
export function getRecommendedStudyTime(level: CEFRLevel): {
  hoursPerWeek: number;
  weeksToNextLevel: number;
  totalHours: number;
} {
  const estimatedHours = estimateTimeToNextLevel(level);

  return {
    hoursPerWeek: 10, // 권장 주당 10시간
    weeksToNextLevel: Math.ceil(estimatedHours / 10),
    totalHours: estimatedHours,
  };
}
