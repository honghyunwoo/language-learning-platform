'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui';
import type { JournalEntry } from '@/types/journal';

interface LearningStatsProps {
  entries: JournalEntry[];
}

export function LearningStats({ entries }: LearningStatsProps) {
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalTime: 0,
        totalActivities: 0,
        averageTime: 0,
        mostProductiveDay: null as string | null,
        learningDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyData: [] as { day: string; time: number }[],
        moodDistribution: { great: 0, good: 0, okay: 0, bad: 0 },
      };
    }

    // 총 학습 시간 및 활동 수
    const totalTime = entries.reduce((sum, e) => sum + e.learningTime, 0);
    const totalActivities = entries.reduce((sum, e) => sum + e.completedActivities.length, 0);
    const averageTime = Math.round(totalTime / entries.length);

    // 가장 생산적인 요일 찾기
    const dayStats: { [key: string]: number } = {};
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
      dayStats[dayName] = (dayStats[dayName] || 0) + entry.learningTime;
    });
    const mostProductiveDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // 학습 일수
    const learningDays = entries.length;

    // 현재 스트릭 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let checkDate = new Date(today);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        checkDate = new Date(entryDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 최장 스트릭 계산
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedEntries.reverse().forEach(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor((entryDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      prevDate = entryDate;
    });
    longestStreak = Math.max(longestStreak, tempStreak);

    // 주간 데이터 (최근 7일)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString('ko-KR', { weekday: 'short' });
      const dayEntries = entries.filter(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0, 0, 0, 0);
        return eDate.getTime() === day.getTime();
      });
      const dayTime = dayEntries.reduce((sum, e) => sum + e.learningTime, 0);
      weeklyData.push({ day: dayStr, time: dayTime });
    }

    // 기분 분포
    const moodDistribution = { great: 0, good: 0, okay: 0, bad: 0 };
    entries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood]++;
      }
    });

    return {
      totalTime,
      totalActivities,
      averageTime,
      mostProductiveDay,
      learningDays,
      currentStreak,
      longestStreak,
      weeklyData,
      moodDistribution,
    };
  }, [entries]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const maxWeeklyTime = Math.max(...stats.weeklyData.map(d => d.time), 1);

  return (
    <div className="space-y-6">
      {/* 주요 통계 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card padding="lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 학습 시간</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(stats.totalTime)}
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">완료한 활동</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalActivities}개
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">현재 연속 학습</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.currentStreak}일
            </p>
          </div>
        </Card>

        <Card padding="lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">최장 연속 학습</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.longestStreak}일
            </p>
          </div>
        </Card>
      </div>

      {/* 주간 학습 시간 차트 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          주간 학습 시간
        </h3>
        <div className="space-y-3">
          {stats.weeklyData.map((data, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                {data.day}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative">
                <div
                  className="bg-blue-500 dark:bg-blue-600 h-8 rounded-full transition-all flex items-center justify-end pr-3"
                  style={{ width: `${(data.time / maxWeeklyTime) * 100}%` }}
                >
                  {data.time > 0 && (
                    <span className="text-xs text-white font-medium">
                      {formatTime(data.time)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 학습 인사이트 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            학습 패턴
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">일평균 학습 시간</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(stats.averageTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">학습한 날짜</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.learningDays}일
              </span>
            </div>
            {stats.mostProductiveDay && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">가장 생산적인 요일</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.mostProductiveDay}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            기분 분포
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">😄</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">최고</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.moodDistribution.great}회
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🙂</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">좋음</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.moodDistribution.good}회
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">😐</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">보통</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.moodDistribution.okay}회
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">😞</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">힘듦</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {stats.moodDistribution.bad}회
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
