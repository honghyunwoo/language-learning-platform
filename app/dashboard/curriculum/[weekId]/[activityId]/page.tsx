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
import { Card, Button } from '@/components/ui';
import ActivityTypeIcon, {
  getActivityTypeLabel,
  getActivityTypeColor,
} from '@/components/curriculum/ActivityTypeIcon';
import ActivityContent from '@/components/activities/ActivityContent';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ weekId: string; activityId: string }>;
}

export default function ActivityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();

  const [timeElapsed, setTimeElapsed] = useState(0); // 초 단위
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
      <Card padding="lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            활동을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            요청하신 활동이 존재하지 않습니다.
          </p>
          <Button
            onClick={() =>
              router.push(`/dashboard/curriculum/${resolvedParams.weekId}`)
            }
          >
            주차로 돌아가기
          </Button>
        </div>
      </Card>
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

  const handleComplete = () => {
    if (!currentUser) return;

    const timeSpentMinutes = Math.ceil(timeElapsed / 60);

    completeActivityMutation.mutate(
      {
        userId: currentUser.uid,
        weekId: week.id,
        activityId: activity.id,
        timeSpent: timeSpentMinutes,
      },
      {
        onSuccess: () => {
          setIsTimerRunning(false);
          // 다음 활동으로 이동 또는 주차 페이지로
          if (nextActivity) {
            router.push(
              `/dashboard/curriculum/${week.id}/${nextActivity.id}`
            );
          } else {
            router.push(`/dashboard/curriculum/${week.id}`);
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/dashboard/curriculum/${week.id}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{week.title}</span>
        </button>

        {/* 타이머 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <ClockIcon className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {isTimerRunning ? '일시정지' : '재개'}
          </button>
        </div>
      </div>

      {/* 활동 정보 */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`flex-shrink-0 p-3 rounded-lg ${getActivityTypeColor(
              activity.type
            )}`}
          >
            <ActivityTypeIcon type={activity.type} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${getActivityTypeColor(
                  activity.type
                )}`}
              >
                {getActivityTypeLabel(activity.type)}
              </span>
              {activity.requiredForCompletion && (
                <span className="text-sm font-semibold px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  필수
                </span>
              )}
              {isCompleted && (
                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-4 h-4" />
                  완료됨
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {activity.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {activity.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>예상 시간: {activity.duration}분</span>
          </div>
          <div>
            난이도: {'⭐'.repeat(activity.difficulty)}
          </div>
        </div>

        {/* 활동 콘텐츠 영역 */}
        <div className="py-8">
          <div className="max-w-3xl mx-auto">
            <ActivityContent activity={activity} weekId={week.id} />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={() =>
              prevActivity
                ? router.push(`/dashboard/curriculum/${week.id}/${prevActivity.id}`)
                : router.push(`/dashboard/curriculum/${week.id}`)
            }
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {prevActivity ? '이전 활동' : '주차로 돌아가기'}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/dashboard/curriculum/${week.id}`)}
            >
              나중에 계속하기
            </Button>
            <Button
              variant="primary"
              onClick={handleComplete}
              loading={completeActivityMutation.isPending}
            >
              {isCompleted ? '다시 완료' : '완료'}
              {nextActivity && <ArrowRightIcon className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* 다음 활동 미리보기 */}
      {nextActivity && !isCompleted && (
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${getActivityTypeColor(nextActivity.type)}`}
              >
                <ActivityTypeIcon type={nextActivity.type} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">다음 활동</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {nextActivity.title}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/curriculum/${week.id}/${nextActivity.id}`)
              }
            >
              건너뛰기
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
