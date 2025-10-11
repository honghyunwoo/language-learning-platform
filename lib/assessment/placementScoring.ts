/**
 * Placement Test 채점 및 레벨 추천 로직
 */

import {
  PlacementTest,
  PlacementTestResult,
  UserAnswer,
  CEFRLevel,
  MCQQuestion,
  PlacementSection,
} from '../types/placement-test';

/**
 * 채점 실행
 */
export function gradePlacementTest(
  test: PlacementTest,
  userAnswers: Record<string, string | number>
): PlacementTestResult {
  const answers: UserAnswer[] = [];
  let score = 0;
  let maxScore = 0;

  // 난이도별 통계
  const difficultyStats: Record<
    CEFRLevel,
    { total: number; correct: number }
  > = {
    A1: { total: 0, correct: 0 },
    A2: { total: 0, correct: 0 },
    B1: { total: 0, correct: 0 },
    B2: { total: 0, correct: 0 },
    C1: { total: 0, correct: 0 },
    C2: { total: 0, correct: 0 },
  };

  // 각 섹션 채점
  test.sections.forEach((section) => {
    const items = getItemsFromSection(section);

    items.forEach((item, idx) => {
      const questionId = `${section.name}_${idx}`;
      const userAnswer = userAnswers[questionId];

      if (item.type === 'self_rating') {
        // 자기평가는 보정치로만 사용
        const rating = Number(userAnswer) || 3;
        const adjustment = (rating - 3) * 0.5;
        score += adjustment;

        answers.push({
          questionId,
          sectionName: section.name,
          answer: rating,
        });
      } else {
        // 객관식 문항
        maxScore += 1;
        const isCorrect = userAnswer === item.a;

        if (isCorrect) {
          score += 1;
        }

        // 난이도별 통계 수집
        if (item.difficulty) {
          difficultyStats[item.difficulty].total += 1;
          if (isCorrect) {
            difficultyStats[item.difficulty].correct += 1;
          }
        }

        answers.push({
          questionId,
          sectionName: section.name,
          answer: String(userAnswer),
          correct: isCorrect,
          difficulty: item.difficulty,
        });
      }
    });
  });

  // 난이도 패턴 분석
  const difficultyPattern: PlacementTestResult['difficultyPattern'] = {};
  Object.entries(difficultyStats).forEach(([level, stats]) => {
    if (stats.total > 0) {
      difficultyPattern[level as CEFRLevel] = {
        total: stats.total,
        correct: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100),
      };
    }
  });

  // 레벨 결정
  const level = determineCEFRLevel(score, maxScore, difficultyPattern);

  // 추천 Week 결정
  const recommendedWeek = getRecommendedWeek(level);

  return {
    userId: '', // 나중에 채움
    testId: test.id,
    timestamp: new Date().toISOString(),
    answers,
    score,
    maxScore,
    level,
    recommendedWeek,
    difficultyPattern,
  };
}

/**
 * 섹션에서 문항 추출
 */
function getItemsFromSection(section: PlacementSection): any[] {
  if (section.name === 'Reading (Short Passage)') {
    const readingSection = section as any;
    return readingSection.passages?.flatMap((p: any) => p.items) || [];
  }
  return section.items || [];
}

/**
 * CEFR 레벨 결정
 * - 기본 점수대 확인
 * - 난이도별 정답 패턴 분석하여 상향/하향 조정
 */
function determineCEFRLevel(
  score: number,
  maxScore: number,
  difficultyPattern: PlacementTestResult['difficultyPattern']
): CEFRLevel {
  // 기본 점수대별 레벨
  const bands = [
    { min: 0, max: 15, level: 'A1' as CEFRLevel },
    { min: 16, max: 25, level: 'A2' as CEFRLevel },
    { min: 26, max: 35, level: 'B1' as CEFRLevel },
    { min: 36, max: 45, level: 'B2' as CEFRLevel },
    { min: 46, max: 100, level: 'C1' as CEFRLevel },
  ];

  let baseLevel =
    bands.find((band) => score >= band.min && score <= band.max)?.level || 'A1';

  // 상향 조정 로직
  // 예: B1 점수대이지만 C1 문항을 80% 이상 맞췄다면 → B2로 상향
  if (baseLevel === 'A1' && difficultyPattern['A2']?.percentage >= 80) {
    baseLevel = 'A2';
  } else if (baseLevel === 'A2' && difficultyPattern['B1']?.percentage >= 80) {
    baseLevel = 'B1';
  } else if (baseLevel === 'B1' && difficultyPattern['B2']?.percentage >= 80) {
    baseLevel = 'B2';
  } else if (baseLevel === 'B2' && difficultyPattern['C1']?.percentage >= 80) {
    baseLevel = 'C1';
  }

  // 하향 조정 로직
  // 예: B1 점수대인데 A2 문항도 50% 미만이면 → A2로 하향
  if (baseLevel === 'B1' && (difficultyPattern['A2']?.percentage || 0) < 50) {
    baseLevel = 'A2';
  } else if (
    baseLevel === 'B2' &&
    (difficultyPattern['B1']?.percentage || 0) < 50
  ) {
    baseLevel = 'B1';
  } else if (
    baseLevel === 'C1' &&
    (difficultyPattern['B2']?.percentage || 0) < 50
  ) {
    baseLevel = 'B2';
  }

  return baseLevel;
}

/**
 * 레벨별 추천 시작 Week
 */
export function getRecommendedWeek(level: CEFRLevel): number {
  switch (level) {
    case 'A1':
      return 1;
    case 'A2':
      return 3;
    case 'B1':
      return 5;
    case 'B2':
      return 9; // Elite Track
    case 'C1':
    case 'C2':
      return 13; // Elite Track Advanced
    default:
      return 1;
  }
}

/**
 * 레벨 설명
 */
export function getLevelDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    A1: '기초 표현 중심 - 간단한 일상 대화 가능',
    A2: '일상 주제 처리 가능 - 기본적인 의사소통',
    B1: '예측 가능한 업무/여행 상황 처리 - 독립적 사용자',
    B2: '추상적 주제 일부 처리/의견 전개 - 유창한 대화',
    C1: '복잡한 담화 구성·전문 주제 소화 - 숙련된 사용자',
    C2: '원어민 수준 - 모든 상황에서 정확하고 유창함',
  };

  return descriptions[level] || descriptions['A1'];
}
