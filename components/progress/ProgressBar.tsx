/**
 * ProgressBar Component
 *
 * 학습 진행률을 시각적으로 표시하는 진행률 바
 */

'use client';

import React from 'react';

interface ProgressBarProps {
  /** 진행률 (0-100) */
  progress: number;
  /** 높이 (px) */
  height?: number;
  /** 색상 테마 */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** 퍼센트 텍스트 표시 여부 */
  showPercentage?: boolean;
  /** 커스텀 클래스 */
  className?: string;
}

const variantColors = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export default function ProgressBar({
  progress,
  height = 8,
  variant = 'default',
  showPercentage = false,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const barColor = variantColors[variant];

  // 진행률에 따라 자동 색상 변경
  const autoVariant =
    variant === 'default'
      ? clampedProgress >= 80
        ? 'success'
        : clampedProgress >= 50
        ? 'warning'
        : 'danger'
      : variant;

  const finalColor = variantColors[autoVariant];

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            진행률
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {clampedProgress}%
          </span>
        </div>
      )}

      <div
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full ${finalColor} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Animated shine effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
