/**
 * ContinueLearningButton Component
 *
 * 사용자의 학습 진행 상황에 따라 다음 학습 Activity로 자동 안내
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProgress } from '@/lib/hooks/useProgress';

export default function ContinueLearningButton() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserProgressSummary, loading } = useProgress();
  const [recommendedPath, setRecommendedPath] = useState<{
    weekId: string;
    weekNumber: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadRecommendedPath() {
      const summary = await getUserProgressSummary();

      if (!summary) {
        // 진행 상황 없음 → Placement Test 추천
        setRecommendedPath({
          weekId: 'placement',
          weekNumber: 0,
          message: '레벨 테스트부터 시작하세요',
        });
        return;
      }

      const currentWeek = summary.currentWeek;

      // 현재 Week의 완료되지 않은 첫 Activity로 이동
      setRecommendedPath({
        weekId: currentWeek.toString(),
        weekNumber: currentWeek,
        message: `Week ${currentWeek} 학습 계속하기`,
      });
    }

    loadRecommendedPath();
  }, [user]);

  const handleClick = () => {
    if (!recommendedPath) return;

    if (recommendedPath.weekNumber === 0) {
      // Placement Test로 이동
      router.push('/dashboard/placement-test');
    } else {
      // Week 페이지로 이동
      router.push(`/dashboard/learn/${recommendedPath.weekNumber}`);
    }
  };

  if (loading || !recommendedPath) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full glass dark:glass-dark rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-green-500/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              지금 학습하기
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recommendedPath.message}
            </p>
          </div>
        </div>
        <div className="text-green-600 dark:text-green-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
