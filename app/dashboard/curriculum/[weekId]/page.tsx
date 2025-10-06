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
import { Card, ProgressBar, Badge, Button } from '@/components/ui';
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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!week) {
    return (
      <Card padding="lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            주차를 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            요청하신 주차가 존재하지 않습니다.
          </p>
          <Button onClick={() => router.push('/dashboard/curriculum')}>
            커리큘럼으로 돌아가기
          </Button>
        </div>
      </Card>
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
    <div className="space-y-6">
      {/* 뒤로 가기 */}
      <button
        onClick={() => router.push('/dashboard/curriculum')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>커리큘럼으로 돌아가기</span>
      </button>

      {/* 주차 헤더 */}
      <Card padding="lg">
        <div className="space-y-4">
          {/* 제목 및 배지 */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {week.id}
                </Badge>
                {progress?.status === 'completed' && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    완료
                  </Badge>
                )}
                {progress?.status === 'in_progress' && (
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    진행 중
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {week.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{week.description}</p>
            </div>
          </div>

          {/* 진행률 */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                전체 진행률
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {completedCount}/{totalActivities} 활동 완료
              </span>
            </div>
            <ProgressBar percentage={completionPercentage} />
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 활동</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalActivities}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">필수 활동</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedRequired}/{requiredActivities.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">예상 시간</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.floor(week.estimatedTime / 60)}h {week.estimatedTime % 60}m
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">소요 시간</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {progress?.timeSpent
                  ? `${Math.floor(progress.timeSpent / 60)}h ${progress.timeSpent % 60}m`
                  : '0h 0m'}
              </p>
            </div>
          </div>

          {/* 학습 목표 */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              학습 목표
            </h3>
            <ul className="space-y-2">
              {week.objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <CheckCircleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* 활동 목록 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          학습 활동
        </h2>
        <div className="space-y-3">
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
  );
}
