import { Activity } from '@/types/curriculum';
import { Card, Badge, Button } from '@/components/ui';
import ActivityTypeIcon, {
  getActivityTypeLabel,
  getActivityTypeColor,
} from './ActivityTypeIcon';
import {
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface ActivityItemProps {
  activity: Activity;
  isCompleted: boolean;
  onStart?: () => void;
  onToggleComplete?: () => void;
}

export default function ActivityItem({
  activity,
  isCompleted,
  onStart,
  onToggleComplete,
}: ActivityItemProps) {
  const difficultyStars = Array.from({ length: 3 }, (_, i) => i < activity.difficulty);

  return (
    <Card padding="md" hover>
      <div className="flex items-start gap-4">
        {/* 체크박스 */}
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          {isCompleted ? (
            <CheckCircleIconSolid className="w-6 h-6 text-green-500" />
          ) : (
            <CheckCircleIcon className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-gray-400" />
          )}
        </button>

        {/* 아이콘 */}
        <div
          className={`flex-shrink-0 p-2 rounded-lg ${getActivityTypeColor(
            activity.type
          )}`}
        >
          <ActivityTypeIcon type={activity.type} />
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 제목 및 배지 */}
          <div className="flex items-start gap-2 mb-2">
            <h4
              className={`text-base font-semibold ${
                isCompleted
                  ? 'text-gray-500 dark:text-gray-400 line-through'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {activity.title}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge className={getActivityTypeColor(activity.type)}>
                {getActivityTypeLabel(activity.type)}
              </Badge>
              {activity.requiredForCompletion && (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  필수
                </Badge>
              )}
            </div>
          </div>

          {/* 설명 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {activity.description}
          </p>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {/* 소요 시간 */}
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{activity.duration}분</span>
            </div>

            {/* 난이도 */}
            <div className="flex items-center gap-1">
              <span>난이도:</span>
              <div className="flex gap-0.5">
                {difficultyStars.map((filled, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      filled
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 태그 */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span>태그:</span>
                <span className="text-gray-400">
                  {activity.tags.slice(0, 2).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 시작 버튼 */}
        <div className="flex-shrink-0">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={onStart}
            className="flex items-center gap-2"
          >
            <PlayIcon className="w-4 h-4" />
            {isCompleted ? '다시 학습' : '시작'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
