'use client';

import { Card } from '@/components/ui';
import { getTierColor, getTierBgColor } from '@/lib/achievements/badges';
import type { BadgeProgress } from '@/types/achievement';

interface BadgeCardProps {
  badgeProgress: BadgeProgress;
  onClick?: () => void;
}

export function BadgeCard({ badgeProgress, onClick }: BadgeCardProps) {
  const { badge, isUnlocked, currentValue, targetValue, percentage } = badgeProgress;

  return (
    <Card
      padding="lg"
      hover={!!onClick}
      onClick={onClick}
      className={`relative transition-all ${
        isUnlocked
          ? 'border-2 border-yellow-400 dark:border-yellow-500 shadow-lg'
          : 'opacity-60'
      }`}
    >
      {/* 잠금 상태 오버레이 */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* 배지 아이콘 */}
      <div className={`text-center mb-4 ${getTierBgColor(badge.tier)} rounded-full w-20 h-20 mx-auto flex items-center justify-center`}>
        <span className="text-4xl">{badge.icon}</span>
      </div>

      {/* 배지 이름 */}
      <h3 className={`text-lg font-bold text-center mb-1 ${getTierColor(badge.tier)}`}>
        {badge.name}
      </h3>

      {/* 티어 표시 */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 uppercase mb-2">
        {badge.tier}
      </p>

      {/* 배지 설명 */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        {badge.description}
      </p>

      {/* 진행 상태 */}
      {!isUnlocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>진행률</span>
            <span>{currentValue} / {targetValue}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`bg-${badge.color}-500 h-2 rounded-full transition-all`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 획득 완료 표시 */}
      {isUnlocked && (
        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            획득 완료
          </div>
        </div>
      )}
    </Card>
  );
}
