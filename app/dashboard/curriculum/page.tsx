'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurriculumWeeks, useAllWeekProgress } from '@/hooks/useCurriculum';
import { UserLevel } from '@/types/user';
import WeekCard from '@/components/curriculum/WeekCard';
import { Card } from '@/components/ui';

const LEVELS: UserLevel[] = ['A1', 'A2', 'B1', 'B2'];

export default function CurriculumPage() {
  const { currentUser } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(
    currentUser?.level || 'A1'
  );

  const { data: weeks, isLoading: weeksLoading } = useCurriculumWeeks(selectedLevel);
  const { data: allProgress, isLoading: progressLoading } = useAllWeekProgress(
    currentUser?.uid
  );

  const isLoading = weeksLoading || progressLoading;

  // 주차별 진행률 매핑
  const getWeekProgress = (weekId: string) => {
    return allProgress?.find((p) => p.weekId === weekId);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          학습 커리큘럼
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          체계적인 커리큘럼으로 단계별 학습을 진행하세요
        </p>
      </div>

      {/* 레벨 탭 */}
      <Card padding="none">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {LEVELS.map((level) => {
            const isActive = level === selectedLevel;
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {level} 레벨
              </button>
            );
          })}
        </div>
      </Card>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      )}

      {/* 주차 그리드 */}
      {!isLoading && weeks && weeks.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {weeks.map((week) => {
            const progress = getWeekProgress(week.id);
            return (
              <WeekCard
                key={week.id}
                week={week}
                progress={
                  progress
                    ? {
                        completedActivities: progress.completedActivities,
                        status: progress.status,
                        timeSpent: progress.timeSpent,
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!weeks || weeks.length === 0) && (
        <Card padding="lg">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              커리큘럼이 아직 준비되지 않았습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedLevel} 레벨 커리큘럼은 곧 제공될 예정입니다.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
