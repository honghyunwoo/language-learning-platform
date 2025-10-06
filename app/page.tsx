import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 헤더 */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                English Journey
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            체계적인 영어 학습,
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              함께 성장하는 커뮤니티
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            주차별 커리큘럼과 학습 일지, 그리고 동료 학습자들과의 소통을 통해
            <br />
            영어 실력을 꾸준히 향상시키세요
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                더 알아보기
              </Button>
            </Link>
          </div>

          {/* 레벨 뱃지 */}
          <div className="flex justify-center gap-3 mt-12">
            <Badge variant="level" level="A1" size="lg">
              A1 기초
            </Badge>
            <Badge variant="level" level="A2" size="lg">
              A2 초급
            </Badge>
            <Badge variant="level" level="B1" size="lg">
              B1 중급
            </Badge>
            <Badge variant="level" level="B2" size="lg">
              B2 중상급
            </Badge>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            왜 English Journey인가요?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            효과적인 영어 학습을 위한 모든 것
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card hover padding="lg">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">주차별 커리큘럼</h3>
            <p className="text-gray-600 dark:text-gray-400">
              레벨별로 구성된 12주 커리큘럼으로 체계적인 학습이 가능합니다.
              듣기, 말하기, 읽기, 쓰기를 균형있게 학습하세요.
            </p>
          </Card>

          <Card hover padding="lg">
            <div className="w-12 h-12 bg-success-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-success-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">학습 일지 & 진도 추적</h3>
            <p className="text-gray-600 dark:text-gray-400">
              매일의 학습 시간을 기록하고 진도를 시각화하세요.
              학습 스트릭과 목표 달성으로 동기부여를 얻으세요.
            </p>
          </Card>

          <Card hover padding="lg">
            <div className="w-12 h-12 bg-info-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-info-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">커뮤니티 & 학습 팁</h3>
            <p className="text-gray-600 dark:text-gray-400">
              동료 학습자들의 경험담을 읽고, 유용한 학습 리소스를 공유하세요.
              함께 성장하는 학습 커뮤니티에 참여하세요.
            </p>
          </Card>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-primary-600 dark:bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">12주</div>
              <div className="text-primary-100">레벨별 커리큘럼</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4개</div>
              <div className="text-primary-100">CEFR 레벨 지원</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-primary-100">추천 학습 리소스</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card padding="lg" className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            지금 바로 영어 학습을 시작하세요
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            무료로 가입하고 체계적인 영어 학습의 첫 걸음을 내딛으세요
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg">
              무료로 시작하기
            </Button>
          </Link>
        </Card>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-lg font-bold">English Journey</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                체계적인 영어 학습 플랫폼
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">학습</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/curriculum">커리큘럼</Link>
                </li>
                <li>
                  <Link href="/resources">학습 리소스</Link>
                </li>
                <li>
                  <Link href="/level-test">레벨 테스트</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">커뮤니티</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/community">게시판</Link>
                </li>
                <li>
                  <Link href="/community?category=tip">학습 팁</Link>
                </li>
                <li>
                  <Link href="/community?category=review">후기</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/about">소개</Link>
                </li>
                <li>
                  <Link href="/privacy">개인정보처리방침</Link>
                </li>
                <li>
                  <Link href="/terms">이용약관</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 English Journey. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
