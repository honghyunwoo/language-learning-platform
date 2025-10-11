import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '소개 - 영어의 정석',
  description: '체계적인 커리큘럼으로 영어 실력을 향상시키는 언어 학습 플랫폼',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* 제목 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            영어의 정석
          </h1>
          <p className="text-xl text-gray-600">
            수학의 정석처럼 체계적인 영어 학습 플랫폼
          </p>
        </div>

        {/* 섹션: 우리의 철학 */}
        <section className="mb-12 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            우리의 철학
          </h2>
          <p className="mb-4 text-gray-700">
            영어의 정석은 단순히 영어를 가르치는 플랫폼이 아닙니다.
            수학의 정석이 체계적인 학습으로 수학 실력을 향상시키듯,
            우리는 논문급 깊이의 커리큘럼으로 진정한 영어 실력을
            키워드립니다.
          </p>
          <p className="text-gray-700">
            각 학습 단계는 CEFR 레벨(A1~C2)에 맞춰 설계되었으며,
            어휘, 문법, 듣기, 말하기, 읽기, 쓰기의 6가지 핵심 영역을
            균형있게 발전시킵니다.
          </p>
        </section>

        {/* 섹션: 주요 기능 */}
        <section className="mb-12 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            주요 기능
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                📚 체계적인 커리큘럼
              </h3>
              <p className="text-sm text-gray-700">
                8주 코어 트랙 + 8주 엘리트 트랙으로 구성된
                총 48개의 Activity
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                🎯 6가지 학습 영역
              </h3>
              <p className="text-sm text-gray-700">
                어휘, 문법, 듣기, 말하기, 읽기, 쓰기를
                균형있게 학습
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                📊 진행 상황 추적
              </h3>
              <p className="text-sm text-gray-700">
                학습 진도, 점수, 소요 시간을 시각화하여
                성장을 확인
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                👥 커뮤니티 기능
              </h3>
              <p className="text-sm text-gray-700">
                스터디 그룹 형성, 게시판 토론으로
                함께 성장
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                📱 PWA 지원
              </h3>
              <p className="text-sm text-gray-700">
                앱처럼 설치하고 오프라인에서도
                학습 가능
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-indigo-600">
                🔒 안전한 인증
              </h3>
              <p className="text-sm text-gray-700">
                Firebase Authentication으로
                보안 강화
              </p>
            </div>
          </div>
        </section>

        {/* 섹션: 기술 스택 */}
        <section className="mb-12 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            기술 스택
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              Next.js 15.5.4
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              React 19
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              TypeScript
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              Tailwind CSS
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              Firebase
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              React Query
            </span>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">
              Workbox PWA
            </span>
          </div>
        </section>

        {/* 섹션: 연락처 */}
        <section className="rounded-lg bg-white p-8 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            함께 성장해요
          </h2>
          <p className="mb-6 text-gray-700">
            영어의 정석과 함께 체계적으로 영어 실력을 키워보세요.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700"
          >
            시작하기
          </Link>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-600">
          <p>© 2025 영어의 정석. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
