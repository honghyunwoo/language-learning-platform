'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurriculumWeeks, useAllWeekProgress } from '@/hooks/useCurriculum';
import { UserLevel } from '@/types/user';
import WeekCard from '@/components/curriculum/WeekCard';

const LEVELS: UserLevel[] = ['A1', 'A2', 'B1', 'B2'];

const LEVEL_COLORS = {
  A1: { from: 'from-green-500', to: 'to-emerald-500', text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500', shadow: 'shadow-green-500/20' },
  A2: { from: 'from-blue-500', to: 'to-cyan-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500', shadow: 'shadow-blue-500/20' },
  B1: { from: 'from-purple-500', to: 'to-pink-500', text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500', shadow: 'shadow-purple-500/20' },
  B2: { from: 'from-orange-500', to: 'to-red-500', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500', shadow: 'shadow-orange-500/20' },
};

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

  // 성능 최적화: 주차별 진행률 매핑을 useMemo로 캐싱
  const progressMap = useMemo(() => {
    if (!allProgress) return new Map();
    return new Map(allProgress.map(p => [p.weekId, p]));
  }, [allProgress]);

  const getWeekProgress = (weekId: string) => {
    return progressMap.get(weekId);
  };

  // 성능 최적화: 레벨별 통계 계산을 useMemo로 캐싱
  const levelStats = useMemo(() => {
    if (!weeks) return { total: 0, completed: 0, inProgress: 0 };

    let completed = 0;
    let inProgress = 0;

    weeks.forEach(week => {
      const progress = progressMap.get(week.id);
      if (progress?.status === 'completed') completed++;
      else if (progress?.status === 'in_progress') inProgress++;
    });

    return { total: weeks.length, completed, inProgress };
  }, [weeks, progressMap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="gradient-text">학습 커리큘럼</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                체계적인 커리큘럼으로 단계별 학습을 진행하세요
              </p>
            </div>

            {/* 레벨 통계 */}
            {weeks && weeks.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="glass dark:glass-dark px-6 py-3 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    완료
                  </div>
                  <div className="text-2xl font-black text-green-600 dark:text-green-400">
                    {levelStats.completed}/{levelStats.total}
                  </div>
                </div>
                <div className="glass dark:glass-dark px-6 py-3 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    진행중
                  </div>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {levelStats.inProgress}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 레벨 탭 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-2 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((level, index) => {
              const isActive = level === selectedLevel;
              const colors = LEVEL_COLORS[level];
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`relative px-6 py-4 text-sm font-black rounded-2xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${colors.from} ${colors.to} text-white shadow-xl ${colors.shadow} scale-105`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{level}</span>
                    <span className="text-xs opacity-80">
                      {level === 'A1' && '입문'}
                      {level === 'A2' && '초급'}
                      {level === 'B1' && '중급'}
                      {level === 'B2' && '중고급'}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">
                커리큘럼 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {/* 주차 그리드 */}
        {!isLoading && weeks && weeks.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weeks.map((week, index) => {
              const progress = getWeekProgress(week.id);
              return (
                <div
                  key={week.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  <WeekCard
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
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!weeks || weeks.length === 0) && (
          <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-[2rem] flex items-center justify-center shadow-xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                커리큘럼이 아직 준비되지 않았습니다
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                <span className="font-bold">{selectedLevel}</span> 레벨 커리큘럼은 곧 제공될 예정입니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
