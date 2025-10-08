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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        </div>
        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-200 dark:border-purple-700 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">🏆 성취 배지</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            학습 목표를 달성하고 다양한 배지를 획득하세요!
          </p>
        </div>

        {/* 배지 갤러리 */}
        <div className="animate-fade-in-up delay-100">
          <BadgeGallery entries={allEntries || []} completedWeeks={completedWeeks} />
        </div>
      </div>
    </div>
  );
}
