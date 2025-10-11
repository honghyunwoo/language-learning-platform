'use client';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="max-w-md text-center">
        {/* 오프라인 아이콘 */}
        <div className="mb-8 flex justify-center">
          <svg
            className="h-24 w-24 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* 메시지 */}
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          오프라인 모드
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          인터넷 연결이 끊어졌습니다.
          <br />
          네트워크를 확인하고 다시 시도해주세요.
        </p>

        {/* 캐시된 컨텐츠 안내 */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-3 font-semibold text-gray-900">
            💡 오프라인에서도 가능한 기능
          </h2>
          <ul className="space-y-2 text-left text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>이전에 학습했던 Activity 복습</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>저장된 학습 진행 상황 확인</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>캐시된 오디오 파일 재생</span>
            </li>
          </ul>
        </div>

        {/* 다시 시도 버튼 */}
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          다시 시도
        </button>

        {/* 추가 안내 */}
        <p className="mt-8 text-xs text-gray-500">
          연결이 복구되면 자동으로 동기화됩니다
        </p>
      </div>
    </div>
  );
}
