'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui';
import { ChartBarIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { JournalEntry } from '@/types/journal';

interface WeeklyReportProps {
  entries: JournalEntry[];
}

export function WeeklyReport({ entries }: WeeklyReportProps) {
  const weeklyData = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalTime: 0,
        totalActivities: 0,
        avgTime: 0,
        days: [],
        mostProductiveDay: null,
        moodDistribution: { great: 0, good: 0, okay: 0, bad: 0 },
      };
    }

    // 최근 7일 데이터
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= sevenDaysAgo && entryDate <= today;
    });

    const totalTime = weekEntries.reduce((sum, e) => sum + e.learningTime, 0);
    const totalActivities = weekEntries.reduce((sum, e) => sum + e.completedActivities.length, 0);
    const avgTime = weekEntries.length > 0 ? Math.round(totalTime / weekEntries.length) : 0;

    // 요일별 데이터
    const dayData = [...Array(7)].map((_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      const entry = weekEntries.find(e => e.date === dateStr);

      return {
        date: dateStr,
        dayName: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
        time: entry?.learningTime || 0,
        activities: entry?.completedActivities.length || 0,
      };
    });

    // 가장 생산적인 날
    const mostProductiveDay = dayData.reduce((max, day) =>
      day.time > max.time ? day : max
    , dayData[0]);

    // 기분 분포
    const moodDistribution = weekEntries.reduce(
      (acc, entry) => {
        if (entry.mood) {
          acc[entry.mood]++;
        }
        return acc;
      },
      { great: 0, good: 0, okay: 0, bad: 0 } as Record<string, number>
    );

    return {
      totalTime,
      totalActivities,
      avgTime,
      days: dayData,
      mostProductiveDay,
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

  const maxTime = Math.max(...weeklyData.days.map(d => d.time), 1);

  return (
    <div className="space-y-4">
      {/* 주간 통계 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">주간 총 시간</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(weeklyData.totalTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">완료 활동</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {weeklyData.totalActivities}개
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FireIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">일평균 시간</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(weeklyData.avgTime)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 요일별 학습 시간 차트 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          요일별 학습 시간
        </h3>
        <div className="space-y-3">
          {weeklyData.days.map((day) => (
            <div key={day.date} className="flex items-center gap-3">
              <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                {day.dayName}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center justify-end px-3 transition-all"
                  style={{
                    width: `${(day.time / maxTime) * 100}%`,
                    minWidth: day.time > 0 ? '10%' : '0%',
                  }}
                >
                  {day.time > 0 && (
                    <span className="text-xs font-medium text-white">
                      {formatTime(day.time)}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                {day.activities}개
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 인사이트 */}
      <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          📊 주간 인사이트
        </h3>
        <div className="space-y-2 text-sm">
          {weeklyData.mostProductiveDay && weeklyData.mostProductiveDay.time > 0 && (
            <p className="text-gray-700 dark:text-gray-300">
              🏆 가장 생산적인 날은 <strong>{weeklyData.mostProductiveDay.dayName}요일</strong>이었어요!{' '}
              ({formatTime(weeklyData.mostProductiveDay.time)})
            </p>
          )}

          {weeklyData.avgTime > 0 && (
            <p className="text-gray-700 dark:text-gray-300">
              ⏰ 하루 평균 <strong>{formatTime(weeklyData.avgTime)}</strong> 학습했어요.
            </p>
          )}

          {weeklyData.moodDistribution.great > 0 && (
            <p className="text-gray-700 dark:text-gray-300">
              😄 {weeklyData.moodDistribution.great}일 동안 매우 좋은 기분으로 학습했어요!
            </p>
          )}

          {weeklyData.totalActivities === 0 && (
            <p className="text-orange-600 dark:text-orange-400">
              💪 이번 주에는 학습이 없었어요. 새로운 시작을 해보세요!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
