'use client';

import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournal';
import { useOverallProgress } from '@/hooks/useOverallProgress';
import { BadgeGallery } from '@/components/achievements';

export default function AchievementsPage() {
  const { currentUser } = useAuth();
  const { weekProgress } = useOverallProgress();

  // 전체 Journal 데이터 가져오기
  const { data: allEntries, isLoading } = useJournalEntries(
    currentUser?.uid,
    '2024-01-01', // 시작 날짜
    new Date().toISOString().split('T')[0] // 오늘
  );

  // 완료한 주차 수 계산
  const completedWeeks = weekProgress?.filter(w => w.progressPercentage === 100).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🏆 성취 배지
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          학습 목표를 달성하고 다양한 배지를 획득하세요!
        </p>
      </div>

      {/* 배지 갤러리 */}
      <BadgeGallery entries={allEntries || []} completedWeeks={completedWeeks} />
    </div>
  );
}
