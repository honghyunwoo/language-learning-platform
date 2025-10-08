'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournal';
import { useOverallProgress } from '@/hooks/useOverallProgress';
import {
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  FireIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { overallCompletionPercentage, totalActivitiesCompleted } = useOverallProgress();

  // 전체 Journal 데이터
  const { data: allEntries } = useJournalEntries(
    currentUser?.uid,
    '2024-01-01',
    new Date().toISOString().split('T')[0]
  );

  const totalLearningTime = useMemo(() => {
    return allEntries?.reduce((sum, e) => sum + e.learningTime, 0) || 0;
  }, [allEntries]);

  const totalLearningDays = allEntries?.length || 0;

  // 현재 스트릭 계산
  const currentStreak = useMemo(() => {
    if (!allEntries || allEntries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedEntries = [...allEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    let checkDate = new Date(today);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        checkDate = new Date(entryDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [allEntries]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const getLevelColors = (level: string) => {
    switch (level) {
      case 'A1':
        return { from: 'from-green-500', to: 'to-emerald-500' };
      case 'A2':
        return { from: 'from-blue-500', to: 'to-cyan-500' };
      case 'B1':
        return { from: 'from-purple-500', to: 'to-pink-500' };
      case 'B2':
        return { from: 'from-orange-500', to: 'to-red-500' };
      default:
        return { from: 'from-gray-500', to: 'to-gray-600' };
    }
  };

  const levelColors = getLevelColors(currentUser?.level || 'A1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="gradient-text">👤 프로필</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                나의 학습 여정과 성과를 확인하세요
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              설정
            </button>
          </div>
        </div>

        {/* 프로필 카드 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="flex items-start gap-6 flex-wrap">
            {/* 프로필 이미지 */}
            <div className={`w-32 h-32 bg-gradient-to-r ${levelColors.from} ${levelColors.to} rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-xl`}>
              <span className="text-6xl text-white font-black">
                {currentUser?.nickname?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-[300px]">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {currentUser?.nickname || '사용자'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-5 py-2 bg-gradient-to-r ${levelColors.from} ${levelColors.to} text-white text-sm font-bold rounded-xl shadow-lg`}>
                  {currentUser?.level || 'A1'}
                </span>
                <span className="px-5 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-bold rounded-xl shadow-lg">
                  {currentUser?.currentWeek || 'A1-W1'}
                </span>
              </div>
            </div>

            {/* 통계 요약 */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                  <ChartBarIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {overallCompletionPercentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">전체 진행률</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                  <FireIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {currentStreak}일
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">현재 스트릭</div>
              </div>
            </div>
          </div>
        </div>

        {/* 학습 통계 */}
        <div className="grid gap-6 md:grid-cols-3 animate-fade-in-up delay-200">
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <ClockIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                {formatTime(totalLearningTime)}
              </p>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                총 학습 시간
              </p>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                {totalActivitiesCompleted}
              </p>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                완료한 활동
              </p>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CalendarIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                {totalLearningDays}일
              </p>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                학습한 날
              </p>
            </div>
          </div>
        </div>

        {/* 학습 목표 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-300">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>📌</span>
            <span>학습 목표</span>
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">일일 학습 목표</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  {currentUser?.dailyLearningTime || 30}분
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: '70%' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">주간 목표 진행률</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  {overallCompletionPercentage}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${overallCompletionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>📝</span>
              <span>최근 활동</span>
            </h3>
            <button
              onClick={() => router.push('/dashboard/journal')}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-xl font-bold shadow-xl transition-all flex items-center gap-2"
            >
              전체 보기
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {allEntries && allEntries.length > 0 ? (
            <div className="space-y-3">
              {allEntries.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl hover:scale-102 hover:shadow-xl transition-all"
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {entry.mood && (
                      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">
                          {entry.mood === 'great' && '😄'}
                          {entry.mood === 'good' && '🙂'}
                          {entry.mood === 'okay' && '😐'}
                          {entry.mood === 'bad' && '😞'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(entry.date).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.completedActivities.length}개 활동 • {formatTime(entry.learningTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-[2rem] flex items-center justify-center shadow-xl">
                <CalendarIcon className="w-12 h-12 text-white" />
              </div>
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                아직 활동 기록이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
