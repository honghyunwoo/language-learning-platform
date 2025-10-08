'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useCurriculumWeek,
  useWeekProgress,
  useCompleteActivity,
  useUncompleteActivity,
} from '@/hooks/useCurriculum';
import { Breadcrumb } from '@/components/ui';
import ActivityItem from '@/components/curriculum/ActivityItem';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ weekId: string }>;
}

export default function WeekDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();

  const { data: week, isLoading: weekLoading } = useCurriculumWeek(
    resolvedParams.weekId
  );
  const { data: progress, isLoading: progressLoading } = useWeekProgress(
    currentUser?.uid,
    resolvedParams.weekId
  );

  const completeActivityMutation = useCompleteActivity();
  const uncompleteActivityMutation = useUncompleteActivity();

  const isLoading = weekLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-200 dark:border-purple-700 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6 flex items-center justify-center">
        <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in text-center max-w-md">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            주차를 찾을 수 없습니다
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            요청하신 주차가 존재하지 않습니다.
          </p>
          <button
            onClick={() => router.push('/dashboard/curriculum')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            커리큘럼으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const totalActivities = week.activities.length;
  const completedActivities = progress?.completedActivities || [];
  const completedCount = completedActivities.length;
  const completionPercentage =
    totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0;

  const requiredActivities = week.activities.filter(
    (a) => a.requiredForCompletion
  );
  const completedRequired = requiredActivities.filter((a) =>
    completedActivities.includes(a.id)
  ).length;

  const handleToggleComplete = (activityId: string) => {
    if (!currentUser) return;

    const isCompleted = completedActivities.includes(activityId);

    if (isCompleted) {
      uncompleteActivityMutation.mutate({
        userId: currentUser.uid,
        weekId: week.id,
        activityId,
      });
    } else {
      // 완료 처리 (임시로 duration을 timeSpent로 사용)
      const activity = week.activities.find((a) => a.id === activityId);
      completeActivityMutation.mutate({
        userId: currentUser.uid,
        weekId: week.id,
        activityId,
        timeSpent: activity?.duration || 0,
      });
    }
  };

  const handleStartActivity = (activityId: string) => {
    router.push(`/dashboard/curriculum/${week.id}/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* 브레드크럼 */}
        <div className="animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: '홈', href: '/dashboard' },
              { label: '커리큘럼', href: '/dashboard/curriculum' },
              { label: week.title },
            ]}
          />
        </div>

        {/* 주차 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="space-y-6">
            {/* 제목 및 배지 */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl shadow-lg">
                    {week.id}
                  </span>
                  {progress?.status === 'completed' && (
                    <span className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4" />
                      완료
                    </span>
                  )}
                  {progress?.status === 'in_progress' && (
                    <span className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg">
                      진행 중
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
                  {week.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{week.description}</p>
              </div>
            </div>

            {/* 진행률 */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/50">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-bold text-gray-900 dark:text-white">
                  전체 진행률
                </span>
                <span className="font-black text-purple-600 dark:text-purple-400">
                  {completedCount}/{totalActivities} 활동 완료
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/50">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">총 활동</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {totalActivities}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800/50">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">필수 활동</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {completedRequired}/{requiredActivities.length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/50">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">예상 시간</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {Math.floor(week.estimatedTime / 60)}h {week.estimatedTime % 60}m
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800/50">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">소요 시간</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {progress?.timeSpent
                    ? `${Math.floor(progress.timeSpent / 60)}h ${progress.timeSpent % 60}m`
                    : '0h 0m'}
                </p>
              </div>
            </div>

            {/* 학습 목표 */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                학습 목표
              </h3>
              <ul className="space-y-3">
                {week.objectives.map((objective, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-800 dark:text-gray-200"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-medium">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 활동 목록 */}
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            학습 활동
          </h2>
          <div className="space-y-4">
            {week.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isCompleted={completedActivities.includes(activity.id)}
                onStart={() => handleStartActivity(activity.id)}
                onToggleComplete={() => handleToggleComplete(activity.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
