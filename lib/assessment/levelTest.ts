/**
 * Advanced Level Test - 12레벨 CEFR 정밀 레벨 테스트
 * 영어의 정석 - 적응형 레벨 테스트 시스템
 */

import { CEFRLevel } from '@/lib/types/activity';
import { determineCEFRLevel, getCEFRLevel } from '@/lib/cefr/levels';

// ===== 질문 타입 =====
export interface LevelTestQuestion {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  difficulty: CEFRLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit?: number; // seconds
}

// ===== 적응형 테스트 엔진 =====
export class AdaptiveLevelTest {
  private questions: LevelTestQuestion[] = [];
  private currentLevel: CEFRLevel = 'A2.1'; // 시작 레벨
  private score = 0;
  private totalQuestions = 0;
  private consecutiveCorrect = 0;
  private consecutiveWrong = 0;

  constructor(initialLevel: CEFRLevel = 'A2.1') {
    this.currentLevel = initialLevel;
  }

  // ===== 다음 질문 난이도 결정 (적응형) =====
  getNextDifficulty(): CEFRLevel {
    // 3개 연속 정답 → 레벨 상승
    if (this.consecutiveCorrect >= 3) {
      this.consecutiveCorrect = 0;
      return this.increaseDifficulty(this.currentLevel);
    }

    // 3개 연속 오답 → 레벨 하강
    if (this.consecutiveWrong >= 3) {
      this.consecutiveWrong = 0;
      return this.decreaseDifficulty(this.currentLevel);
    }

    return this.currentLevel;
  }

  // ===== 난이도 증가 =====
  private increaseDifficulty(level: CEFRLevel): CEFRLevel {
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
    const index = levels.indexOf(level);
    if (index >= 0 && index < levels.length - 1) {
      return levels[index + 1];
    }
    return level;
  }

  // ===== 난이도 감소 =====
  private decreaseDifficulty(level: CEFRLevel): CEFRLevel {
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
    const index = levels.indexOf(level);
    if (index > 0) {
      return levels[index - 1];
    }
    return level;
  }

  // ===== 답변 처리 =====
  submitAnswer(questionId: string, answer: number): {
    correct: boolean;
    points: number;
    feedback: string;
  } {
    const question = this.questions.find((q) => q.id === questionId);
    if (!question) {
      return { correct: false, points: 0, feedback: '질문을 찾을 수 없습니다' };
    }

    const correct = answer === question.correctAnswer;
    const points = correct ? question.points : 0;

    // 통계 업데이트
    this.totalQuestions++;
    if (correct) {
      this.score += points;
      this.consecutiveCorrect++;
      this.consecutiveWrong = 0;
    } else {
      this.consecutiveCorrect = 0;
      this.consecutiveWrong++;
    }

    // 다음 난이도 결정
    this.currentLevel = this.getNextDifficulty();

    return {
      correct,
      points,
      feedback: correct ? '정답입니다!' : `오답입니다. 정답은 ${question.options[question.correctAnswer]}입니다.`,
    };
  }

  // ===== 최종 레벨 계산 =====
  calculateFinalLevel(): {
    level: CEFRLevel;
    score: number;
    accuracy: number;
    confidence: number;
  } {
    const accuracy = this.totalQuestions > 0 ? (this.score / (this.totalQuestions * 10)) * 100 : 0;

    // 정확도 기반 레벨 조정
    let finalLevel = this.currentLevel;

    if (accuracy >= 90) {
      finalLevel = this.increaseDifficulty(this.currentLevel);
    } else if (accuracy < 60) {
      finalLevel = this.decreaseDifficulty(this.currentLevel);
    }

    // 신뢰도 계산 (질문 수가 많을수록 높음)
    const confidence = Math.min(100, (this.totalQuestions / 30) * 100);

    return {
      level: finalLevel,
      score: this.score,
      accuracy,
      confidence,
    };
  }

  // ===== 테스트 진행률 =====
  getProgress(): {
    completed: number;
    total: number;
    percentage: number;
  } {
    const total = 30; // 최대 30문제
    return {
      completed: this.totalQuestions,
      total,
      percentage: (this.totalQuestions / total) * 100,
    };
  }
}

// ===== 질문 생성기 (예시) =====
export function generateLevelTestQuestions(level: CEFRLevel, count: number = 10): LevelTestQuestion[] {
  // 실제로는 데이터베이스나 JSON에서 로드
  // 여기서는 예시로 간단하게 생성
  return Array.from({ length: count }, (_, i) => ({
    id: `q_${level}_${i}`,
    type: ['vocabulary', 'grammar', 'reading', 'listening'][i % 4] as LevelTestQuestion['type'],
    difficulty: level,
    question: `Sample question for ${level} (${i + 1})`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: i % 4,
    points: 10,
    timeLimit: 60,
  }));
}

// ===== 섹션별 테스트 결과 =====
export interface SectionResult {
  section: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  score: number;
  maxScore: number;
  accuracy: number;
  recommendedLevel: CEFRLevel;
}

// ===== 상세 테스트 결과 =====
export interface DetailedTestResult {
  overallLevel: CEFRLevel;
  overallScore: number;
  overallAccuracy: number;
  confidence: number;
  sectionResults: SectionResult[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  estimatedStudyHours: number;
  certificateEligible: boolean;
}

// ===== 상세 결과 분석 =====
export function analyzeTestResult(
  answers: Array<{ questionId: string; answer: number; correct: boolean; section: string }>
): DetailedTestResult {
  // 섹션별 분석
  const sections: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer) => {
    if (!sections[answer.section]) {
      sections[answer.section] = { correct: 0, total: 0 };
    }
    sections[answer.section].total++;
    if (answer.correct) {
      sections[answer.section].correct++;
    }
  });

  const sectionResults: SectionResult[] = Object.entries(sections).map(([section, data]) => {
    const accuracy = (data.correct / data.total) * 100;
    return {
      section: section as SectionResult['section'],
      score: data.correct * 10,
      maxScore: data.total * 10,
      accuracy,
      recommendedLevel: determineCEFRLevel(accuracy),
    };
  });

  // 전체 정확도
  const totalCorrect = Object.values(sections).reduce((sum, s) => sum + s.correct, 0);
  const totalQuestions = Object.values(sections).reduce((sum, s) => sum + s.total, 0);
  const overallAccuracy = (totalCorrect / totalQuestions) * 100;

  // 레벨 결정
  const overallLevel = determineCEFRLevel(overallAccuracy);
  const levelDef = getCEFRLevel(overallLevel);

  // 강점/약점 분석
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  sectionResults.forEach((result) => {
    if (result.accuracy >= 80) {
      strengths.push(result.section);
    } else if (result.accuracy < 60) {
      weaknesses.push(result.section);
    }
  });

  return {
    overallLevel,
    overallScore: totalCorrect * 10,
    overallAccuracy,
    confidence: Math.min(100, (totalQuestions / 30) * 100),
    sectionResults,
    strengths,
    weaknesses,
    recommendations: [
      weaknesses.length > 0 ? `${weaknesses.join(', ')} 영역 집중 학습 필요` : '전반적으로 균형잡힌 실력',
      `예상 학습 시간: ${levelDef?.estimatedHours || 100}시간`,
    ],
    estimatedStudyHours: levelDef?.estimatedHours || 100,
    certificateEligible: overallAccuracy >= 75,
  };
}
