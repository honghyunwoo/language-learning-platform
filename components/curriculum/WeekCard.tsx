import Link from 'next/link';
import { CurriculumWeek } from '@/types/curriculum';
import { Card, ProgressBar, Badge } from '@/components/ui';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface WeekCardProps {
  week: CurriculumWeek;
  progress?: {
    completedActivities: string[];
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    timeSpent: number;
  };
}

export default function WeekCard({ week, progress }: WeekCardProps) {
  const totalActivities = week.activities.length;
  const completedCount = progress?.completedActivities?.length || 0;
  const completionPercentage =
    totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0;

  const status = progress?.status || 'available';

  const statusConfig = {
    locked: {
      badge: '잠김',
      badgeColor: 'bg-gray-500',
      opacity: 'opacity-60',
      cursor: 'cursor-not-allowed',
    },
    available: {
      badge: '시작 가능',
      badgeColor: 'bg-blue-500',
      opacity: 'opacity-100',
      cursor: 'cursor-pointer',
    },
    in_progress: {
      badge: '진행 중',
      badgeColor: 'bg-yellow-500',
      opacity: 'opacity-100',
      cursor: 'cursor-pointer',
    },
    completed: {
      badge: '완료',
      badgeColor: 'bg-green-500',
      opacity: 'opacity-100',
      cursor: 'cursor-pointer',
    },
  };

  const config = statusConfig[status];

  const CardContent = (
    <Card
      padding="lg"
      hover={status !== 'locked'}
      className={`h-full ${config.opacity} ${config.cursor}`}
    >
      <div className="flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {week.id}
            </span>
            <Badge className={config.badgeColor}>{config.badge}</Badge>
          </div>
          {status === 'completed' && (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {week.title}
        </h3>

        {/* 설명 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-2">
          {week.description}
        </p>

        {/* 통계 */}
        <div className="space-y-3">
          {/* 진행률 */}
          {status !== 'locked' && status !== 'available' && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">진행률</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {completedCount}/{totalActivities}
                </span>
              </div>
              <ProgressBar percentage={completionPercentage} />
            </div>
          )}

          {/* 활동 수 & 예상 시간 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
              <span>{totalActivities}개 활동</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>
                {Math.floor(week.estimatedTime / 60)}시간{' '}
                {week.estimatedTime % 60}분
              </span>
            </div>
          </div>

          {/* 소요 시간 (진행 중/완료인 경우) */}
          {progress?.timeSpent && progress.timeSpent > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              실제 소요: {Math.floor(progress.timeSpent / 60)}시간{' '}
              {progress.timeSpent % 60}분
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  // 잠긴 상태면 링크 없이 카드만 표시
  if (status === 'locked') {
    return CardContent;
  }

  return (
    <Link href={`/dashboard/curriculum/${week.id}`} className="block">
      {CardContent}
    </Link>
  );
}
