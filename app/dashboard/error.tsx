'use client';

/**
 * Dashboard Error Boundary
 *
 * Dashboard 섹션 전용 에러 핸들러
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto mt-20">
        <div className="glass dark:glass-dark rounded-3xl p-10 text-center shadow-2xl">
          {/* 에러 아이콘 */}
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* 메시지 */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            대시보드 로딩 중 오류 발생
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            학습 데이터를 불러오는 중 문제가 발생했습니다.
          </p>

          {/* 개발 모드 에러 상세 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-left border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                개발 모드 - 에러 상세:
              </p>
              <p className="text-xs font-mono text-red-700 dark:text-red-400 break-all">
                {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs text-red-600 dark:text-red-500 mt-2 overflow-auto max-h-40">
                  {error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>
          )}

          {/* 해결 방법 제안 */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-left">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
              다음을 시도해 보세요:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>페이지를 새로고침하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>인터넷 연결을 확인하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>브라우저 캐시를 삭제하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>잠시 후 다시 시도하세요</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              다시 시도
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-4 px-6 rounded-xl transition-all duration-200"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
