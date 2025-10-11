'use client';

/**
 * Placement Test 결과 페이지
 */

import { PlacementTestResult, CEFRLevel } from '@/lib/types/placement-test';
import { getLevelDescription } from '@/lib/assessment/placementScoring';
import Link from 'next/link';

interface Props {
  result: PlacementTestResult;
}

export default function PlacementResult({ result }: Props) {
  const { level, score, maxScore, recommendedWeek, difficultyPattern } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 축하 메시지 */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">레벨 테스트 완료!</h1>
          <p className="text-gray-600">당신의 영어 실력을 분석했습니다.</p>
        </div>

        {/* 메인 결과 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-4xl font-bold mb-4">
              {level}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">당신의 현재 레벨</h2>
            <p className="text-gray-600">{getLevelDescription(level)}</p>
          </div>

          {/* 점수 표시 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">총점</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {Math.round((score / maxScore) * 100)}%
              </div>
              <div className="text-sm text-gray-600">정답률</div>
            </div>
          </div>

          {/* 추천 학습 경로 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              추천 학습 경로
            </h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    Week {recommendedWeek}부터 시작
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {recommendedWeek >= 9
                      ? '🏆 Elite Track - 고급 과정'
                      : '📘 Basic Track - 기초 과정'}
                  </div>
                </div>
                <Link
                  href={`/dashboard/learn/${recommendedWeek}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  학습 시작 →
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              💡 물론 Week 1부터 시작하셔도 좋습니다. 복습은 언제나 도움이 됩니다!
            </p>
          </div>
        </div>

        {/* 난이도별 분석 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">난이도별 성취도 분석</h3>
          <div className="space-y-4">
            {Object.entries(difficultyPattern)
              .sort((a, b) => {
                const order: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
                return order[a[0]] - order[b[0]];
              })
              .map(([levelKey, stats]) => {
                const percentage = stats.percentage;
                const barColor =
                  percentage >= 80
                    ? 'bg-green-500'
                    : percentage >= 60
                    ? 'bg-blue-500'
                    : percentage >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500';

                return (
                  <div key={levelKey} className="flex items-center gap-4">
                    <div className="w-16 font-semibold text-gray-700">{levelKey}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500 flex items-center justify-end pr-3`}
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-white text-sm font-semibold">{percentage}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-24 text-sm text-gray-600 text-right">
                      {stats.correct}/{stats.total} 정답
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 강점/약점 분석 */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span>💪</span> 강점
              </h4>
              <div className="text-sm text-green-800">
                {getStrengths(difficultyPattern).map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2 mb-1">
                    <span>•</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <span>📈</span> 개선 영역
              </h4>
              <div className="text-sm text-yellow-800">
                {getWeaknesses(difficultyPattern).map((weakness, idx) => (
                  <div key={idx} className="flex items-start gap-2 mb-1">
                    <span>•</span>
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">다음 단계</h3>
          <div className="space-y-4">
            <Link
              href={`/dashboard/learn/${recommendedWeek}`}
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-900">1. 추천 Week부터 학습 시작</div>
                  <div className="text-sm text-blue-700 mt-1">Week {recommendedWeek}으로 바로 이동</div>
                </div>
                <span className="text-blue-600">→</span>
              </div>
            </Link>

            <Link
              href="/dashboard/learn/1"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">2. Week 1부터 기초 다지기</div>
                  <div className="text-sm text-gray-700 mt-1">처음부터 탄탄하게 학습</div>
                </div>
                <span className="text-gray-600">→</span>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">3. Dashboard로 돌아가기</div>
                  <div className="text-sm text-gray-700 mt-1">전체 커리큘럼 확인</div>
                </div>
                <span className="text-gray-600">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* 재시험 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            📌 레벨 테스트는 30일에 1회만 응시 가능합니다.
            <br />
            학습 후 실력이 향상되었다면 다시 도전해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 강점 분석
 */
function getStrengths(
  difficultyPattern: PlacementTestResult['difficultyPattern']
): string[] {
  const strengths: string[] = [];

  Object.entries(difficultyPattern).forEach(([level, stats]) => {
    if (stats.percentage >= 80) {
      strengths.push(`${level} 레벨 문항 ${stats.percentage}% 정답 (우수)`);
    }
  });

  if (strengths.length === 0) {
    strengths.push('모든 레벨에서 고르게 실력을 발휘했습니다');
  }

  return strengths;
}

/**
 * 약점 분석
 */
function getWeaknesses(
  difficultyPattern: PlacementTestResult['difficultyPattern']
): string[] {
  const weaknesses: string[] = [];

  Object.entries(difficultyPattern).forEach(([level, stats]) => {
    if (stats.percentage < 50 && stats.total >= 2) {
      weaknesses.push(`${level} 레벨 집중 학습 필요 (${stats.percentage}%)`);
    }
  });

  if (weaknesses.length === 0) {
    weaknesses.push('특별한 약점이 발견되지 않았습니다');
  }

  return weaknesses;
}
