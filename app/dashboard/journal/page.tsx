'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries, useMonthlyStats } from '@/hooks/useJournal';
import { Calendar, LearningStreak, WeeklyReport } from '@/components/journal';
import { ClockIcon, FireIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function JournalPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'weekly'>('overview');

  const startDate = `${currentMonth}-01`;
  const endDate = `${currentMonth}-31`;

  const { data: entries, isLoading } = useJournalEntries(
    currentUser?.uid,
    startDate,
    endDate
  );
  const { data: stats } = useMonthlyStats(currentUser?.uid, currentMonth);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    setCurrentMonth(
      `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    setCurrentMonth(
      `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
    );
  };

  const [year, month] = currentMonth.split('-').map(Number);

  // 성능 최적화: 날짜/시간 포맷터를 useMemo로 캐싱
  const formatDate = useMemo(() => {
    return (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      });
    };
  }, []);

  const formatTime = useMemo(() => {
    return (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `${hours}시간 ${mins}분`;
      }
      return `${mins}분`;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in max-w-md mx-auto mt-20">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-400">
              학습 일지 불러오는 중...
            </p>
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

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="gradient-text">학습 일지</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                학습 기록을 확인하고 메모를 작성하세요
              </p>
            </div>

            {/* 월 네비게이션 */}
            <div className="flex items-center gap-3 glass dark:glass-dark px-6 py-3 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
              <span className="text-xl font-black text-gray-900 dark:text-white min-w-[140px] text-center">
                {year}년 {month}월
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-2 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-black rounded-2xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/20 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-4 text-sm font-black rounded-2xl transition-all duration-300 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/20 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              캘린더
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-4 text-sm font-black rounded-2xl transition-all duration-300 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/20 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              주간 리포트
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 학습 스트릭 */}
            {entries && entries.length > 0 && (
              <div className="animate-fade-in-up delay-200">
                <LearningStreak entries={entries} />
              </div>
            )}

            {/* 월간 통계 */}
            {stats && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 총 학습 시간 */}
                <div className="group relative card-hover animate-fade-in-up delay-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative glass dark:glass-dark rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <ClockIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">총 학습 시간</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {formatTime(stats.totalLearningTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 학습 일수 */}
                <div className="group relative card-hover animate-fade-in-up delay-400">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative glass dark:glass-dark rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <CalendarIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">학습 일수</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {stats.learningDays}일
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 완료 활동 */}
                <div className="group relative card-hover animate-fade-in-up delay-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative glass dark:glass-dark rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <FireIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">완료 활동</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {stats.completedActivities}개
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 일평균 시간 */}
                <div className="group relative card-hover animate-fade-in-up delay-600">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative glass dark:glass-dark rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <ClockIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">일평균 시간</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {formatTime(Math.round(stats.averageDailyTime))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 일지 목록 */}
            <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-700">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                최근 학습 기록
              </h2>

              {entries && entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="group relative card-hover cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${800 + index * 50}ms` }}
                      onClick={() => router.push(`/dashboard/journal/${entry.date}`)}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div className="relative glass dark:glass-dark rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg group-hover:shadow-2xl transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {formatDate(entry.date)}
                              </h3>
                              {entry.mood && (
                                <span className="text-3xl">
                                  {entry.mood === 'great' && '😄'}
                                  {entry.mood === 'good' && '🙂'}
                                  {entry.mood === 'okay' && '😐'}
                                  {entry.mood === 'bad' && '😞'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                  <ClockIcon className="w-3 h-3 text-white" />
                                </div>
                                <span>{formatTime(entry.learningTime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{entry.completedActivities.length}</span>
                                </div>
                                <span>개 활동</span>
                              </div>
                              {entry.difficulty && (
                                <div className="flex items-center gap-1">
                                  <span>난이도:</span>
                                  <span className="text-yellow-500">{'⭐'.repeat(entry.difficulty)}</span>
                                </div>
                              )}
                            </div>

                            {entry.notes && (
                              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                {entry.notes}
                              </p>
                            )}
                          </div>

                          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 animate-scale-in">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-[2rem] flex items-center justify-center shadow-xl">
                    <CalendarIcon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                    이번 달 학습 기록이 없습니다
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    활동을 완료하면 자동으로 일지가 생성됩니다.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/curriculum')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                  >
                    학습 시작하기 →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-fade-in-up delay-200">
            <Calendar year={year} month={month} entries={entries || []} />
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="animate-fade-in-up delay-200">
            <WeeklyReport entries={entries || []} />
          </div>
        )}
      </div>
    </div>
  );
}
