'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useCurriculumWeek,
  useWeekProgress,
  useCompleteActivity,
  useStartActivity,
} from '@/hooks/useCurriculum';
import ActivityTypeIcon, {
  getActivityTypeLabel,
} from '@/components/curriculum/ActivityTypeIcon';
import ActivityContent from '@/components/activities/ActivityContent';
import { Breadcrumb } from '@/components/ui';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ weekId: string; activityId: string }>;
}

export default function ActivityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const { data: week } = useCurriculumWeek(resolvedParams.weekId);
  const { data: progress } = useWeekProgress(
    currentUser?.uid,
    resolvedParams.weekId
  );

  const startActivityMutation = useStartActivity();
  const completeActivityMutation = useCompleteActivity();

  const activity = week?.activities.find((a) => a.id === resolvedParams.activityId);
  const isCompleted = progress?.completedActivities.includes(
    resolvedParams.activityId
  ) || false;

  // 타이머
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // 활동 시작 기록
  useEffect(() => {
    if (currentUser && week && activity) {
      startActivityMutation.mutate({
        userId: currentUser.uid,
        weekId: week.id,
        activityId: activity.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, week, activity]);

  if (!week || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6 flex items-center justify-center">
        <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              활동을 찾을 수 없습니다
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              요청하신 활동이 존재하지 않습니다.
            </p>
            <button
              onClick={() => router.push(`/dashboard/curriculum/${resolvedParams.weekId}`)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              주차로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = week.activities.findIndex((a) => a.id === activity.id);
  const nextActivity =
    currentIndex < week.activities.length - 1
      ? week.activities[currentIndex + 1]
      : null;
  const prevActivity = currentIndex > 0 ? week.activities[currentIndex - 1] : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!currentUser) return;

    const timeSpentMinutes = Math.ceil(timeElapsed / 60);

    try {
      await completeActivityMutation.mutateAsync({
        userId: currentUser.uid,
        weekId: week.id,
        activityId: activity.id,
        timeSpent: timeSpentMinutes,
      });

      setIsTimerRunning(false);

      // 다음 활동으로 이동 또는 주차 페이지로
      if (nextActivity) {
        router.push(`/dashboard/curriculum/${week.id}/${nextActivity.id}`);
      } else {
        router.push(`/dashboard/curriculum/${week.id}`);
      }
    } catch (error) {
      console.error('Activity completion error:', error);
      alert('활동 완료 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const typeColors = {
    vocabulary: { from: 'from-blue-500', to: 'to-cyan-500' },
    grammar: { from: 'from-green-500', to: 'to-emerald-500' },
    reading: { from: 'from-purple-500', to: 'to-pink-500' },
    listening: { from: 'from-orange-500', to: 'to-red-500' },
    speaking: { from: 'from-yellow-500', to: 'to-amber-500' },
    writing: { from: 'from-indigo-500', to: 'to-blue-500' },
  };

  const colors = typeColors[activity.type] || { from: 'from-gray-500', to: 'to-gray-600' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-5xl mx-auto space-y-6">
        {/* 브레드크럼 */}
        <div className="animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: '홈', href: '/dashboard' },
              { label: '커리큘럼', href: '/dashboard/curriculum' },
              { label: week.title, href: `/dashboard/curriculum/${week.id}` },
              { label: activity.title },
            ]}
          />
        </div>

        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => router.push(`/dashboard/curriculum/${week.id}`)}
              className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">돌아가기</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{week.title}</div>
              </div>
            </button>

            {/* 타이머 */}
            <div className="flex items-center gap-3">
              <div className="glass dark:glass-dark px-6 py-3 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.from} ${colors.to} rounded-xl flex items-center justify-center shadow-lg`}>
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">경과 시간</div>
                  <div className="font-mono text-xl font-black text-gray-900 dark:text-white">
                    {formatTime(timeElapsed)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                  isTimerRunning
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-110'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-110'
                }`}
              >
                {isTimerRunning ? (
                  <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 활동 정보 카드 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="flex items-start gap-6 mb-6">
            <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${colors.from} ${colors.to} rounded-2xl flex items-center justify-center shadow-xl`}>
              <ActivityTypeIcon type={activity.type} className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`px-4 py-2 bg-gradient-to-r ${colors.from} ${colors.to} text-white text-sm font-bold rounded-xl shadow-lg`}>
                  {getActivityTypeLabel(activity.type)}
                </span>
                {activity.requiredForCompletion && (
                  <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg">
                    필수
                  </span>
                )}
                {isCompleted && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg">
                    <CheckCircleIcon className="w-4 h-4" />
                    완료됨
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                {activity.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-white" />
              </div>
              <span>예상 시간: <span className="font-black text-gray-900 dark:text-white">{activity.duration}분</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span>난이도:</span>
              <span className="text-yellow-500 text-lg">{'⭐'.repeat(activity.difficulty)}</span>
            </div>
          </div>

          {/* 활동 콘텐츠 */}
          <div className="py-8">
            <ActivityContent activity={activity} weekId={week.id} />
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 gap-4 flex-wrap">
            <button
              onClick={() =>
                prevActivity
                  ? router.push(`/dashboard/curriculum/${week.id}/${prevActivity.id}`)
                  : router.push(`/dashboard/curriculum/${week.id}`)
              }
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-all flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {prevActivity ? '이전 활동' : '주차로 돌아가기'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/curriculum/${week.id}`)}
                className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white rounded-2xl font-bold transition-all"
              >
                나중에 계속하기
              </button>
              <button
                onClick={handleComplete}
                disabled={completeActivityMutation.isPending}
                className={`px-8 py-3 bg-gradient-to-r ${colors.from} ${colors.to} hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {completeActivityMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    {isCompleted ? '다시 완료' : '완료'}
                    {nextActivity && <ArrowRightIcon className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 다음 활동 미리보기 */}
        {nextActivity && (
          <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${typeColors[nextActivity.type]?.from || 'from-gray-500'} ${typeColors[nextActivity.type]?.to || 'to-gray-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <ActivityTypeIcon type={nextActivity.type} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">다음 활동</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    {nextActivity.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(`/dashboard/curriculum/${week.id}/${nextActivity.id}`)
                }
                className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white rounded-2xl font-bold transition-all"
              >
                건너뛰기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
