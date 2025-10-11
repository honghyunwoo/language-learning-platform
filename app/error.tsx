'use client';

/**
 * Global Error Boundary
 *
 * Next.js 전역 에러 핸들러
 * 모든 페이지에서 발생하는 에러를 캐치하여 사용자 친화적인 UI 표시
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등 사용)
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900/20 flex items-center justify-center p-6">
      <div className="max-w-md w-full glass dark:glass-dark rounded-3xl p-8 text-center shadow-2xl">
        {/* 에러 아이콘 */}
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 에러 메시지 */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          앗! 문제가 발생했습니다
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>

        {/* 에러 상세 정보 (개발 모드에서만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                오류 ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            다시 시도
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            대시보드로 돌아가기
          </button>
        </div>

        {/* 도움말 링크 */}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          문제가 계속되면{' '}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            고객 지원팀
          </a>
          에 문의하세요
        </div>
      </div>
    </div>
  );
}
