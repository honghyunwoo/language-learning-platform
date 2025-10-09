'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 overflow-hidden">
      {/* Fixed Header with Glassmorphism */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? 'glass dark:glass-dark shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fade-in-down">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-glow-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text">
                English Journey
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 animate-fade-in-down delay-200">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                >
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="btn-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                >
                  시작하기 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Gradients - 부드러운 톤 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
          <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass dark:glass-dark mb-8 animate-fade-in-up shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              🎯 32주 완성 커리큘럼 • 195+ 학습 활동
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 animate-fade-in-up delay-200">
            <span className="block text-gray-900 dark:text-white mb-4">
              영어 학습,
            </span>
            <span className="block gradient-text animate-scale-in delay-400">
              이제는 체계적으로
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto animate-fade-in-up delay-600 leading-relaxed">
            A1부터 B2까지, 주차별 커리큘럼과 실전 활동으로
            <br className="hidden md:block" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-indigo-600">
              당신의 영어 실력을 한 단계 업그레이드
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fade-in-up delay-700">
            <Link href="/signup">
              <Button
                size="lg"
                className="group btn-glow bg-gradient-to-r from-slate-600 via-indigo-600 to-violet-600 hover:from-slate-700 hover:via-indigo-700 hover:to-violet-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  무료로 시작하기
                  <svg
                    className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                className="px-10 py-7 text-xl font-bold rounded-2xl glass dark:glass-dark border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:scale-105"
              >
                더 알아보기
              </Button>
            </Link>
          </div>

          {/* Level Badges - Animated - 부드러운 색감 */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-800">
            {[
              { level: 'A1', label: '기초', from: 'emerald-500', to: 'teal-600', delay: '0' },
              { level: 'A2', label: '초급', from: 'sky-500', to: 'blue-600', delay: '100' },
              { level: 'B1', label: '중급', from: 'indigo-500', to: 'violet-600', delay: '200' },
              { level: 'B2', label: '고급', from: 'purple-500', to: 'fuchsia-600', delay: '300' },
            ].map((item) => (
              <div
                key={item.level}
                className={`group relative animate-scale-in delay-${item.delay}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-${item.from} to-${item.to} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}
                ></div>
                <div
                  className={`relative px-8 py-4 bg-gradient-to-r from-${item.from} to-${item.to} rounded-2xl text-white font-black text-xl shadow-lg group-hover:scale-105 transition-all cursor-pointer`}
                >
                  {item.level} {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-scroll-bounce">
          <div className="w-8 h-12 border-3 border-gray-400 dark:border-gray-600 rounded-full flex justify-center p-2">
            <div className="w-2 h-3 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              왜{' '}
              <span className="gradient-text">
                English Journey
              </span>
              인가요?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              효과적인 영어 학습을 위한 모든 것이 준비되어 있습니다
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
                gradient: 'from-blue-500 to-cyan-500',
                title: '32주 체계적 커리큘럼',
                description: 'A1부터 B2까지, CEFR 레벨에 맞춘 주차별 학습 로드맵으로 체계적인 실력 향상을 경험하세요.',
                stats: '8주 × 4레벨',
                delay: '0',
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                ),
                gradient: 'from-purple-500 to-pink-500',
                title: '6가지 학습 활동',
                description: '듣기, 말하기, 읽기, 쓰기, 어휘, 문법을 통합적으로 학습하며 실전 영어 능력을 키워보세요.',
                stats: '195+ 활동',
                delay: '200',
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                gradient: 'from-orange-500 to-red-500',
                title: '학습 진도 추적',
                description: '실시간 학습 통계와 진도율로 목표를 달성하고, 꾸준한 학습 습관을 만들어가세요.',
                stats: '실시간 분석',
                delay: '400',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative card-hover animate-fade-in-up delay-${feature.delay}`}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}
                ></div>

                {/* Card */}
                <div className="relative h-full glass dark:glass-dark rounded-3xl p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full">
                    <span className={`text-base font-black bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - 부드러운 그라데이션 */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-indigo-700 to-violet-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { number: '32주', label: '완성 커리큘럼', desc: 'A1-B2 전체 레벨', delay: '0' },
              { number: '195+', label: '학습 활동', desc: '6가지 타입별 활동', delay: '200' },
              { number: '4단계', label: 'CEFR 레벨', desc: '체계적인 난이도 구성', delay: '400' },
            ].map((stat, index) => (
              <div key={index} className={`group animate-scale-in delay-${stat.delay}`}>
                <div className="text-7xl sm:text-8xl font-black text-white mb-6 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-3xl font-bold text-white/95 mb-3">{stat.label}</div>
                <div className="text-xl text-white/75">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

            <div className="relative glass dark:glass-dark rounded-[3rem] p-16 md:p-20 shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
                지금 바로{' '}
                <span className="gradient-text">
                  영어 학습
                </span>
                을<br />시작하세요
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                195개 이상의 학습 활동과 32주 완성 커리큘럼으로
                <br />
                체계적인 영어 학습의 첫 걸음을 내딛으세요
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="btn-glow bg-gradient-to-r from-slate-600 via-indigo-600 to-violet-600 hover:from-slate-700 hover:via-indigo-700 hover:to-violet-700 text-white px-16 py-8 text-2xl font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  무료로 시작하기 →
                </Button>
              </Link>
              <p className="mt-8 text-base text-gray-500 dark:text-gray-400">
                ✓ 신용카드 등록 불필요 • ✓ 언제든 무료 • ✓ 즉시 시작
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
                <span className="text-2xl font-bold gradient-text">
                  English Journey
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                체계적인 영어 학습 플랫폼으로 A1부터 B2까지 단계별 학습을 지원합니다.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">학습</h4>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Link href="/dashboard/curriculum">커리큘럼</Link>
                </li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Link href="/dashboard/journal">학습 일지</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">정보</h4>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Link href="/about">소개</Link>
                </li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Link href="/privacy">개인정보처리방침</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-800 pt-10 text-center text-gray-600 dark:text-gray-400">
            <p className="text-lg">© 2025 English Journey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
