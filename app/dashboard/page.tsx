'use client';

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
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import { LearningStats, SkillProgress } from '@/components/dashboard';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import type { WeekProgress } from '@/types/progress';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { data: progress, isLoading, error } = useUserProgress(currentUser?.uid);
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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          안녕하세요, {currentUser?.nickname}님! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          오늘도 영어 학습을 시작해보세요.
          {learnedToday && (
            <span className="text-green-600 dark:text-green-400 font-medium ml-2">
              오늘 이미 학습하셨네요! 🎉
            </span>
          )}
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* 총 학습 시간 */}
        <StatsCard
          title="총 학습 시간"
          value={
            hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`
          }
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="primary"
          badge={`이번 주: ${Math.floor(totalWeeklyTime / 60)}시간 ${
            totalWeeklyTime % 60
          }분`}
        />

        {/* 연속 학습일 (스트릭) */}
        <StatsCard
          title="연속 학습일"
          value={`${currentStreak}일`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
          }
          color="success"
          badge={learnedToday ? '✨ 오늘도 학습 완료!' : '오늘 학습을 시작해보세요'}
        />

        {/* 현재 주차 */}
        <StatsCard
          title="현재 주차"
          value={currentUser?.currentWeek || 'A1-W1'}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          color="info"
          badge={`레벨: ${currentUser?.level || 'A1'}`}
        />

        {/* 이번 주 진행률 */}
        <StatsCard
          title="이번 주 진행률"
          value={`${completedActivities}/${totalActivities}`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
          color="warning"
          progress={percentage}
        />
      </div>

      {/* 주간 학습 시간 차트 */}
      <WeeklyChart
        data={weeklyData}
        dailyGoal={currentUser?.dailyLearningTime || 30}
      />

      {/* 전체 진행률 카드 */}
      {overallProgress && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              📊 전체 학습 진행률
            </h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {overallCompletionPercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalActivitiesCompleted} / {allActivities} 완료
              </p>
            </div>
          </div>

          {/* 주차별 진행률 그리드 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {weekProgress.map((week: WeekProgress) => {
              const isCurrentWeek = getCurrentWeek() === week.weekId;
              const isCompleted = week.progressPercentage === 100;

              return (
                <div
                  key={week.weekId}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isCurrentWeek
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : isCompleted
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {/* Week 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {week.weekId.replace('week-', 'Week ')}
                    </span>
                    {isCompleted && (
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    {isCurrentWeek && !isCompleted && (
                      <span className="text-xs px-2 py-1 bg-primary-600 text-white rounded-full">
                        진행 중
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted
                            ? 'bg-green-500'
                            : isCurrentWeek
                            ? 'bg-primary-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${week.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 완료 상태 */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {week.completedActivities} / {week.totalActivities} 완료
                  </p>
                </div>
              );
            })}
          </div>

          {/* 현재 주차 정보 */}
          {getCurrentWeek() && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 현재 진행 중인 주차:{' '}
                <span className="font-semibold">
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
          <LearningStats entries={journalEntries} />
          <SkillProgress entries={journalEntries} />
        </>
      )}

      {/* 빠른 시작 카드 (데이터가 없을 때) */}
      {!progress && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-800">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                영어 학습 여정을 시작하세요!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                커리큘럼에서 첫 주차 학습을 시작하고, 매일의 진행 상황을 기록해보세요.
              </p>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                커리큘럼 시작하기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
