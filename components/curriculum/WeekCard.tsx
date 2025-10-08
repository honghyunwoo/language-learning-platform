import Link from 'next/link';
import { CurriculumWeek } from '@/types/curriculum';
import { ClockIcon, CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
      gradient: 'from-gray-400 to-gray-500',
      bgGradient: 'bg-gray-50 dark:bg-gray-800/50',
      borderColor: 'border-gray-300 dark:border-gray-600',
      textColor: 'text-gray-500 dark:text-gray-400',
      icon: LockClosedIcon,
      glow: 'bg-gray-400',
    },
    available: {
      badge: '시작 가능',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: null,
      glow: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    in_progress: {
      badge: '진행 중',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      icon: null,
      glow: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    },
    completed: {
      badge: '완료',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400',
      icon: CheckCircleIcon,
      glow: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const CardContent = (
    <div className="group relative h-full">
      {/* Glow Effect */}
      {status !== 'locked' && (
        <div className={`absolute -inset-1 ${config.glow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
      )}

      <div className={`relative h-full glass dark:glass-dark rounded-3xl p-6 border-2 ${config.borderColor} shadow-xl transition-all ${
        status !== 'locked' ? 'group-hover:-translate-y-2 group-hover:shadow-2xl' : 'opacity-60'
      }`}>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 dark:text-white px-3 py-1 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              {week.id}
            </span>
            <span className={`px-3 py-1 bg-gradient-to-r ${config.gradient} text-white text-xs font-bold rounded-xl shadow-lg`}>
              {config.badge}
            </span>
          </div>
          {Icon && (
            <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-1">
          {week.title}
        </h3>

        {/* 설명 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10">
          {week.description}
        </p>

        {/* 진행률 */}
        {status !== 'locked' && status !== 'available' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">진행률</span>
              <span className="font-black text-gray-900 dark:text-white">
                {completedCount}/{totalActivities}
              </span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500 shadow-lg`}
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-right mt-1">
              <span className={`text-xs font-bold ${config.textColor}`}>
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{totalActivities}개 활동</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">
                {Math.floor(week.estimatedTime / 60)}h {week.estimatedTime % 60}m
              </span>
            </div>
          </div>

          {/* 실제 소요 시간 */}
          {progress?.timeSpent && progress.timeSpent > 0 && (
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-gray-500 dark:text-gray-400">실제 소요</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {Math.floor(progress.timeSpent / 60)}h {progress.timeSpent % 60}m
              </span>
            </div>
          )}
        </div>

        {/* Hover Arrow */}
        {status !== 'locked' && (
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-8 h-8 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-lg`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (status === 'locked') {
    return CardContent;
  }

  return (
    <Link href={`/dashboard/curriculum/${week.id}`} className="block">
      {CardContent}
    </Link>
  );
}
