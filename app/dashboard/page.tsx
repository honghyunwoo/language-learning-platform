'use client';

import { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useUserProgress,
  useWeeklyStats,
  useStreak,
  useLearningTime,
  useWeekProgress,
} from '@/hooks/useUserProgress';
import { useOverallProgress } from '@/hooks/useOverallProgress';
import { useJournalEntries } from '@/hooks/useJournal';
import StatsCard from '@/components/dashboard/StatsCard';
import { LearningStats, SkillProgress } from '@/components/dashboard';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  SkeletonCard,
  SkeletonActivityCard,
  SkeletonChart,
  SkeletonProgressBar
} from '@/components/ui';

// Chart.js Dynamic Import (번들 크기 -130KB)
const WeeklyChart = dynamic(() => import('@/components/dashboard/WeeklyChart'), {
  loading: () => <SkeletonChart />,
  ssr: false
});

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useAuth();
  const { data: progress, isLoading } = useUserProgress(currentUser?.uid);

  // 🔒 로그인 체크 (클라이언트 사이드)
  useEffect(() => {
    if (!authLoading && !currentUser) {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      router.push('/login?redirect=/dashboard');
    }
  }, [authLoading, currentUser, router]);
  const { weeklyData, totalWeeklyTime } = useWeeklyStats(currentUser?.uid);
  const { data: streakData } = useStreak(currentUser?.uid);
  const { data: learningTimeData } = useLearningTime(currentUser?.uid);
  const { completedActivities, totalActivities, percentage } = useWeekProgress(
    currentUser?.uid
  );

  // Overall Progress Hook 통합
  const {
    overallProgress,
    getCurrentWeek,
    totalActivitiesCompleted,
    totalActivities: allActivities,
    overallCompletionPercentage,
    weekProgress,
  } = useOverallProgress();

  // Journal 데이터 가져오기 (최근 30일)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const { data: journalEntries } = useJournalEntries(
    currentUser?.uid,
    thirtyDaysAgo.toISOString().split('T')[0],
    today.toISOString().split('T')[0]
  );

  const currentStreak = streakData?.currentStreak || 0;
  const learnedToday = streakData?.learnedToday || false;
  const hours = learningTimeData?.hours || 0;
  const minutes = learningTimeData?.minutes || 0;

  // weekProgress 메모이제이션 - 매 렌더링마다 새 배열 생성 방지
  const memoizedWeekProgress = useMemo(() => {
    return weekProgress.map((week) => ({
      ...week,
      isCurrentWeek: getCurrentWeek() === week.weekId,
      isCompleted: week.progressPercentage === 100,
    }));
  }, [weekProgress, getCurrentWeek]);

  // 로딩 상태 (인증 로딩 포함)
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
        {/* 애니메이션 배경 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
          <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto space-y-8">
          {/* 환영 메시지 Skeleton */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
            </div>
          </div>

          {/* 통계 카드 Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* 차트 Skeleton */}
          <div className="grid gap-8 lg:grid-cols-2">
            <SkeletonChart />
            <SkeletonChart />
          </div>

          {/* 활동 진행률 Skeleton */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 animate-pulse"></div>
              <SkeletonProgressBar />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonActivityCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태는 제거 - 대신 각 컴포넌트에서 개별 처리

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* 환영 메시지 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">안녕하세요,</span>{' '}
            <span className="text-gray-900 dark:text-white">{currentUser?.nickname}님!</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            오늘도 영어 학습을 시작해보세요
            {learnedToday && (
              <span className="inline-flex items-center gap-2 ml-3 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-green-500/30 animate-scale-in">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                오늘 학습 완료!
              </span>
            )}
          </p>
        </div>

        {/* Placement Test 배너 */}
        <div
          onClick={() => router.push('/dashboard/placement-test')}
          className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-blue-200/50 dark:border-blue-700/30 animate-fade-in-up delay-100 cursor-pointer hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  레벨 테스트
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  나의 영어 실력을 진단하고 맞춤 학습 경로를 추천받으세요
                </p>
              </div>
            </div>
            <div className="text-blue-600 dark:text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in-up delay-100">
            <StatsCard
              title="총 학습 시간"
              value={hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="primary"
              badge={`이번 주: ${Math.floor(totalWeeklyTime / 60)}시간 ${totalWeeklyTime % 60}분`}
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <StatsCard
              title="연속 학습일"
              value={`${currentStreak}일`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              }
              color="success"
              badge={learnedToday ? '✨ 오늘도 학습 완료!' : '오늘 학습을 시작해보세요'}
            />
          </div>
          <div className="animate-fade-in-up delay-300">
            <StatsCard
              title="전체 완료"
              value={`${totalActivitiesCompleted}개`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="info"
              badge={`전체: ${allActivities}개`}
            />
          </div>
          <div className="animate-fade-in-up delay-400">
            <StatsCard
              title="이번 주 진행률"
              value={`${completedActivities}/${totalActivities}`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              color="warning"
              progress={percentage}
            />
          </div>
        </div>

        {/* 주간 학습 시간 차트 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-500">
          <WeeklyChart data={weeklyData} dailyGoal={currentUser?.dailyLearningTime || 30} />
        </div>

        {/* 전체 진행률 카드 */}
        {overallProgress && (
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-600">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                전체 학습 진행률
              </h3>
              <div className="text-right">
                <p className="text-5xl font-black gradient-text mb-2">{overallCompletionPercentage}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {totalActivitiesCompleted} / {allActivities} 활동 완료
                </p>
              </div>
            </div>

            {/* 주차별 진행률 그리드 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              {memoizedWeekProgress.map((week) => {
                return (
                  <button
                    key={week.weekId}
                    onClick={() => router.push(`/dashboard/curriculum/${week.weekId}`)}
                    className={`relative p-4 rounded-2xl border-2 transition-all card-hover w-full text-left ${
                      week.isCurrentWeek
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                        : week.isCompleted
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20 hover:shadow-green-500/30'
                        : 'border-gray-200 dark:border-gray-700 glass dark:glass-dark hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-black text-gray-900 dark:text-white text-sm">
                        {week.weekId.replace('week-', 'W')}
                      </span>
                      {week.isCompleted && <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {week.isCurrentWeek && !week.isCompleted && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            week.isCompleted ? 'bg-green-500' : week.isCurrentWeek ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${week.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium">
                      {week.completedActivities}/{week.totalActivities}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* 현재 주차 정보 */}
            {getCurrentWeek() && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/50 shadow-xl animate-scale-in">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  현재 진행 중인 주차:{' '}
                  <span className="font-black gradient-text text-base">
                    {getCurrentWeek().replace('week-', 'Week ')}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 학습 통계 및 영역별 진행률 */}
        {journalEntries && journalEntries.length > 0 && (
          <>
            <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-700">
              <LearningStats entries={journalEntries} />
            </div>
            <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-800">
              <SkillProgress entries={journalEntries} />
            </div>
          </>
        )}

        {/* 빠른 시작 카드 */}
        {!progress && (
          <div className="glass dark:glass-dark rounded-[2rem] p-10 border border-white/20 dark:border-gray-700/30 shadow-2xl animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black mb-3">
                  <span className="gradient-text">영어 학습 여정</span>
                  <span className="text-gray-900 dark:text-white">을 시작하세요!</span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  커리큘럼에서 첫 주차 학습을 시작하고, 매일의 진행 상황을 기록해보세요.
                </p>
                <button
                  onClick={() => router.push('/dashboard/curriculum')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                >
                  커리큘럼 시작하기 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
