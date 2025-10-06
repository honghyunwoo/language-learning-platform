'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJournalEntries } from '@/hooks/useJournal';
import { useOverallProgress } from '@/hooks/useOverallProgress';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { overallCompletionPercentage, totalActivitiesCompleted, totalActivities } = useOverallProgress();

  // 전체 Journal 데이터
  const { data: allEntries } = useJournalEntries(
    currentUser?.uid,
    '2024-01-01',
    new Date().toISOString().split('T')[0]
  );

  const totalLearningTime = allEntries?.reduce((sum, e) => sum + e.learningTime, 0) || 0;
  const totalLearningDays = allEntries?.length || 0;

  // 현재 스트릭 계산
  const currentStreak = (() => {
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
  })();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          👤 프로필
        </h1>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/settings')}
        >
          설정
        </Button>
      </div>

      {/* 프로필 카드 */}
      <Card padding="lg">
        <div className="flex items-start gap-6">
          {/* 프로필 이미지 */}
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-4xl text-primary-600 dark:text-primary-400 font-bold">
              {currentUser?.nickname?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {/* 정보 */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentUser?.nickname || '사용자'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentUser?.email}
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="level" level={currentUser?.level || 'A1'}>
                {currentUser?.level || 'A1'}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser?.currentWeek || 'A1-W1'}
              </span>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="hidden md:flex flex-col gap-4 text-right">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {overallCompletionPercentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">전체 진행률</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {currentStreak}일
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">현재 스트릭</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 학습 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="lg">
          <div className="text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-flex mb-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(totalLearningTime)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              총 학습 시간
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {totalActivitiesCompleted}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              완료한 활동
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg inline-flex mb-3">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {totalLearningDays}일
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              학습한 날
            </p>
          </div>
        </Card>
      </div>

      {/* 학습 목표 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          📌 학습 목표
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">일일 학습 목표</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentUser?.dailyLearningTime || 30}분
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: '70%' }} // 실제로는 오늘의 진행률 계산 필요
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">주간 목표 진행률</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {overallCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${overallCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 최근 활동 */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            📝 최근 활동
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/dashboard/journal')}
          >
            전체 보기
          </Button>
        </div>

        {allEntries && allEntries.length > 0 ? (
          <div className="space-y-3">
            {allEntries.slice(0, 5).map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {entry.mood && (
                    <span className="text-2xl">
                      {entry.mood === 'great' && '😄'}
                      {entry.mood === 'good' && '🙂'}
                      {entry.mood === 'okay' && '😐'}
                      {entry.mood === 'bad' && '😞'}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(entry.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {entry.completedActivities.length}개 활동 • {formatTime(entry.learningTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            아직 활동 기록이 없습니다
          </p>
        )}
      </Card>
    </div>
  );
}
