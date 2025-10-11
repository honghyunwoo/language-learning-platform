/**
 * WeekProgressCard Component
 *
 * Week별 학습 진행 상황을 카드 형태로 표시
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { WeekProgress } from '@/lib/firestore/progress-schema';
import ProgressBar from './ProgressBar';

interface WeekProgressCardProps {
  weekProgress: WeekProgress;
}

export default function WeekProgressCard({ weekProgress }: WeekProgressCardProps) {
  const {
    weekNumber,
    progressPercentage,
    completedActivities,
    totalActivities,
    averageAccuracy,
    isCompleted,
  } = weekProgress;

  return (
    <Link
      href={`/dashboard/learn/${weekNumber}`}
      className="block group"
    >
      <div className="glass dark:glass-dark rounded-2xl p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
              isCompleted
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            }`}>
              {weekNumber}
            </div>
            <div>
              <h3 className="font-bold text-lg">Week {weekNumber}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isCompleted ? '완료' : '진행 중'}
              </p>
            </div>
          </div>

          {isCompleted && (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar
          progress={progressPercentage}
          showPercentage
          className="mb-4"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completedActivities}/{totalActivities}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              완료한 Activity
            </div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {averageAccuracy}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              평균 정답률
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 text-center">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
            {isCompleted ? '복습하기' : '학습 계속하기'} →
          </span>
        </div>
      </div>
    </Link>
  );
}
