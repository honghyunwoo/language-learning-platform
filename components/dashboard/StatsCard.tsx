import { ReactNode, memo } from 'react';
import { Card } from '@/components/ui';

type ColorType = 'primary' | 'success' | 'info' | 'warning';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: ColorType;
  badge?: string;
  progress?: number; // 0-100
}

const colorClasses: Record<ColorType, { bg: string; text: string }> = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    text: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
  },
};

// React.memo로 메모이제이션하여 불필요한 리렌더링 방지
const StatsCard = memo(function StatsCard({
  title,
  value,
  icon,
  color,
  badge,
  progress,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <Card padding="lg" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {badge && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {badge}
            </p>
          )}
        </div>

        {/* 아이콘 */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}
        >
          {icon}
        </div>
      </div>

      {/* 프로그레스 바 (선택사항) */}
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              진행률
            </span>
            <span className={`text-xs font-medium ${colors.text}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                color === 'primary'
                  ? 'bg-primary-600'
                  : color === 'success'
                  ? 'bg-green-600'
                  : color === 'info'
                  ? 'bg-blue-600'
                  : 'bg-orange-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
});

export default StatsCard;
