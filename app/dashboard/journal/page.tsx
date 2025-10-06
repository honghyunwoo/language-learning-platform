'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries, useMonthlyStats } from '@/hooks/useJournal';
import { Card, Button } from '@/components/ui';
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            학습 일지
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            학습 기록을 확인하고 메모를 작성하세요
          </p>
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-[120px] text-center">
            {year}년 {month}월
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            개요
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            캘린더
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            주간 리포트
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && (
        <>
          {/* 학습 스트릭 */}
          {entries && entries.length > 0 && (
            <LearningStreak entries={entries} />
          )}

          {/* 월간 통계 */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">총 학습 시간</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatTime(stats.totalLearningTime)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">학습 일수</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.learningDays}일
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FireIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">완료 활동</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.completedActivities}개
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">일평균 시간</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatTime(Math.round(stats.averageDailyTime))}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 일지 목록 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              최근 학습 기록
            </h2>

            {entries && entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    padding="lg"
                    hover
                    onClick={() => router.push(`/dashboard/journal/${entry.date}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(entry.date)}
                          </h3>
                          {entry.mood && (
                            <span className="text-2xl">
                              {entry.mood === 'great' && '😄'}
                              {entry.mood === 'good' && '🙂'}
                              {entry.mood === 'okay' && '😐'}
                              {entry.mood === 'bad' && '😞'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatTime(entry.learningTime)}</span>
                          </div>
                          <div>
                            <span>{entry.completedActivities.length}개 활동 완료</span>
                          </div>
                          {entry.difficulty && (
                            <div>난이도: {'⭐'.repeat(entry.difficulty)}</div>
                          )}
                        </div>

                        {entry.notes && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>

                      <Button variant="secondary" size="sm">
                        보기
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding="lg">
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <CalendarIcon className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    이번 달 학습 기록이 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    활동을 완료하면 자동으로 일지가 생성됩니다.
                  </p>
                  <Button onClick={() => router.push('/dashboard/curriculum')}>
                    학습 시작하기
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </>
      )}

      {activeTab === 'calendar' && (
        <Calendar year={year} month={month} entries={entries || []} />
      )}

      {activeTab === 'weekly' && (
        <WeeklyReport entries={entries || []} />
      )}
    </div>
  );
}
