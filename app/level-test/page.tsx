'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function LevelTestPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  // 인증 체크
  if (!currentUser) {
    router.push('/login');
    return null;
  }

  const handleStartTest = () => {
    setIsStarting(true);
    // 테스트 시작 페이지로 이동
    router.push('/level-test/test');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="gradient-text">영어 레벨 테스트</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            당신의 현재 영어 실력을 정확하게 평가합니다
          </p>
        </div>

        {/* 메인 카드 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-10 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-200">
          {/* 테스트 소개 */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  테스트 구성
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  총 60문제로 구성된 종합 영어 능력 평가
                </p>
              </div>
            </div>

            {/* 테스트 구성 카드 그리드 */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">문법</h3>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">20문제</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  기초 문법부터 고급 문법까지 평가
                </p>
              </div>

              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">어휘</h3>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">30문제</p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  일상 어휘부터 전문 용어까지 평가
                </p>
              </div>

              <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border-2 border-pink-200 dark:border-pink-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-pink-900 dark:text-pink-100">듣기</h3>
                </div>
                <p className="text-sm text-pink-800 dark:text-pink-200 mb-2">10문제</p>
                <p className="text-xs text-pink-700 dark:text-pink-300">
                  실생활 대화와 뉴스 이해도 평가
                </p>
              </div>
            </div>
          </div>

          {/* 예상 소요 시간 */}
          <div className="mb-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                예상 소요 시간
              </h3>
            </div>
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              약 25-30분 정도 소요됩니다
            </p>
          </div>

          {/* 테스트 안내사항 */}
          <div className="mb-10">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              테스트 안내사항
            </h3>
            <ul className="space-y-3">
              {[
                '조용하고 집중할 수 있는 환경에서 응시해주세요',
                '듣기 문제를 위해 오디오가 정상적으로 재생되는지 확인해주세요',
                '각 문제는 신중하게 읽고 답변해주세요',
                '테스트 중간에 나가면 진행 상황이 저장되지 않습니다',
                '모든 문제를 완료한 후 결과를 확인할 수 있습니다',
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CEFR 레벨 설명 */}
          <div className="mb-10 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/50">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
              📊 평가 기준 (CEFR)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-lg">A1</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">기초 단계</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-lg">A2</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">초급 단계</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-lg">B1</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">중급 단계</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-lg">B2</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">중상급 단계</span>
                </div>
              </div>
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => router.push('/dashboard')}
              className="sm:flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              나중에 하기
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartTest}
              loading={isStarting}
              className="sm:flex-[2] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              테스트 시작하기
            </Button>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center animate-fade-in-up delay-400">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 테스트 결과를 통해 맞춤형 학습 커리큘럼을 추천받을 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
