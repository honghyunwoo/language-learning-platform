'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSaveLevelTest } from '@/hooks/useLevelTest';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';

// JSON 데이터 import
import grammarData from '@/data/levelTest/grammar.json';
import vocabularyData from '@/data/levelTest/vocabulary.json';
import listeningData from '@/data/levelTest/listening.json';

// Chart.js Dynamic Import
const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
});

// Chart.js 필수 등록
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// 타입 정의
interface TestResults {
  grammarScore: number;
  vocabularyScore: number;
  listeningScore: number;
  averageScore: number;
  level: string;
  recommendedWeek: string;
  grammarCorrect: number;
  vocabularyCorrect: number;
  listeningCorrect: number;
}

// 결과 계산 함수
function calculateResults(answers: Record<string, number>): TestResults {
  let grammarCorrect = 0;
  let vocabularyCorrect = 0;
  let listeningCorrect = 0;

  // 문법 채점
  grammarData.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      grammarCorrect++;
    }
  });

  // 어휘 채점
  vocabularyData.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      vocabularyCorrect++;
    }
  });

  // 듣기 채점
  listeningData.forEach((dialogue, dIndex: number) => {
    dialogue.questions.forEach((q, qIndex: number) => {
      if (answers[`listening-${dIndex}-q${qIndex}`] === q.correctAnswer) {
        listeningCorrect++;
      }
    });
  });

  const grammarScore = Math.round((grammarCorrect / grammarData.length) * 100);
  const vocabularyScore = Math.round((vocabularyCorrect / vocabularyData.length) * 100);
  const listeningScore = Math.round((listeningCorrect / (listeningData.length * 2)) * 100); // 평균 2문제씩

  const averageScore = Math.round((grammarScore + vocabularyScore + listeningScore) / 3);

  // CEFR 레벨 결정
  let level: string;
  let recommendedWeek: string;

  if (averageScore >= 80) {
    level = 'B2';
    recommendedWeek = 'week-7';
  } else if (averageScore >= 60) {
    level = 'B1';
    recommendedWeek = 'week-5';
  } else if (averageScore >= 40) {
    level = 'A2';
    recommendedWeek = 'week-3';
  } else {
    level = 'A1';
    recommendedWeek = 'week-1';
  }

  return {
    grammarScore,
    vocabularyScore,
    listeningScore,
    averageScore,
    level,
    recommendedWeek,
    grammarCorrect,
    vocabularyCorrect,
    listeningCorrect,
  };
}

function ResultContent() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<TestResults | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const saveLevelTestMutation = useSaveLevelTest();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const answersParam = searchParams.get('answers');
    if (answersParam) {
      try {
        const answers = JSON.parse(decodeURIComponent(answersParam));
        const calculatedResults = calculateResults(answers);
        setResults(calculatedResults);

        // Firestore에 결과 자동 저장 (한 번만)
        if (!isSaved && currentUser.uid) {
          const testResult = {
            userId: currentUser.uid,
            testDate: new Date().toISOString(),
            grammarScore: calculatedResults.grammarScore,
            vocabularyScore: calculatedResults.vocabularyScore,
            listeningScore: calculatedResults.listeningScore,
            averageScore: calculatedResults.averageScore,
            level: calculatedResults.level as 'A1' | 'A2' | 'B1' | 'B2',
            recommendedWeek: calculatedResults.recommendedWeek,
            grammarCorrect: calculatedResults.grammarCorrect,
            vocabularyCorrect: calculatedResults.vocabularyCorrect,
            listeningCorrect: calculatedResults.listeningCorrect,
            totalQuestions: grammarData.length + vocabularyData.length + listeningData.length * 2,
          };

          saveLevelTestMutation.mutate(testResult, {
            onSuccess: () => {
              setIsSaved(true);
              console.log('레벨 테스트 결과가 저장되었습니다.');
            },
            onError: (error) => {
              console.error('레벨 테스트 저장 실패:', error);
            },
          });
        }
      } catch (error) {
        console.error('결과 계산 오류:', error);
        router.push('/level-test');
      }
    } else {
      router.push('/level-test');
    }
  }, [currentUser, searchParams, router, isSaved, saveLevelTestMutation]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">결과를 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  // Chart.js 데이터
  const radarData = {
    labels: ['문법', '어휘', '듣기'],
    datasets: [
      {
        label: '당신의 점수',
        data: [results.grammarScore, results.vocabularyScore, results.listeningScore],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // 레벨별 색상
  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    A1: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' },
    A2: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500' },
    B1: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500' },
    B2: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-500' },
  };

  const levelColor = levelColors[results.level];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* 축하 메시지 */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">테스트 완료!</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {currentUser?.nickname}님의 영어 실력을 분석했습니다
          </p>
        </div>

        {/* 메인 결과 카드 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-10 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-8 animate-fade-in-up delay-200">
          {/* 평균 점수와 레벨 */}
          <div className="text-center mb-12">
            <div className={`inline-block px-8 py-4 ${levelColor.bg} ${levelColor.border} border-2 rounded-2xl mb-6`}>
              <span className="text-4xl font-black gradient-text">{results.level}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              종합 점수
            </h2>
            <p className="text-7xl font-black gradient-text mb-4">
              {results.averageScore}점
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {results.level === 'B2' && '중상급 - 복잡한 주제도 유창하게 대화할 수 있습니다'}
              {results.level === 'B1' && '중급 - 익숙한 주제에 대해 자신있게 대화할 수 있습니다'}
              {results.level === 'A2' && '초급 - 일상적인 상황에서 간단한 대화가 가능합니다'}
              {results.level === 'A1' && '기초 - 기본적인 인사와 표현을 사용할 수 있습니다'}
            </p>
          </div>

          {/* 영역별 점수 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 레이더 차트 */}
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl">
              <div className="w-full max-w-sm">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* 세부 점수 */}
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">문법</h3>
                  <span className="text-2xl font-black text-blue-600">{results.grammarScore}점</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {results.grammarCorrect} / {grammarData.length} 정답
                </p>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-3">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${results.grammarScore}%` }}
                  />
                </div>
              </div>

              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">어휘</h3>
                  <span className="text-2xl font-black text-purple-600">{results.vocabularyScore}점</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {results.vocabularyCorrect} / {vocabularyData.length} 정답
                </p>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-3">
                  <div
                    className="h-2 rounded-full bg-purple-600"
                    style={{ width: `${results.vocabularyScore}%` }}
                  />
                </div>
              </div>

              <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border-2 border-pink-200 dark:border-pink-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-pink-900 dark:text-pink-100">듣기</h3>
                  <span className="text-2xl font-black text-pink-600">{results.listeningScore}점</span>
                </div>
                <p className="text-sm text-pink-700 dark:text-pink-300">
                  {results.listeningCorrect} / {listeningData.length * 2} 정답
                </p>
                <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-2 mt-3">
                  <div
                    className="h-2 rounded-full bg-pink-600"
                    style={{ width: `${results.listeningScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 강점과 약점 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800/50">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                강점
              </h3>
              <ul className="space-y-2">
                {results.grammarScore >= 70 && (
                  <li className="text-sm text-green-700 dark:text-green-300">✓ 문법 이해도가 우수합니다</li>
                )}
                {results.vocabularyScore >= 70 && (
                  <li className="text-sm text-green-700 dark:text-green-300">✓ 풍부한 어휘력을 보유하고 있습니다</li>
                )}
                {results.listeningScore >= 70 && (
                  <li className="text-sm text-green-700 dark:text-green-300">✓ 듣기 이해력이 뛰어납니다</li>
                )}
              </ul>
            </div>

            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                개선 포인트
              </h3>
              <ul className="space-y-2">
                {results.grammarScore < 70 && (
                  <li className="text-sm text-amber-700 dark:text-amber-300">• 문법 학습에 더 집중해보세요</li>
                )}
                {results.vocabularyScore < 70 && (
                  <li className="text-sm text-amber-700 dark:text-amber-300">• 어휘력 향상이 필요합니다</li>
                )}
                {results.listeningScore < 70 && (
                  <li className="text-sm text-amber-700 dark:text-amber-300">• 듣기 연습을 더 해보세요</li>
                )}
              </ul>
            </div>
          </div>

          {/* 추천 주차 */}
          <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/50">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              추천 학습 주차
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              {results.recommendedWeek.replace('week-', 'Week ')}부터 시작하시는 것을 추천합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push(`/dashboard/curriculum/${results.recommendedWeek}`)}
                className="sm:flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl"
              >
                추천 주차로 이동 →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => router.push('/dashboard/curriculum')}
                className="sm:flex-1"
              >
                전체 커리큘럼 보기
              </Button>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="text-center animate-fade-in-up delay-400">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push('/dashboard')}
          >
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LevelTestResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">결과를 불러오는 중...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
