'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui';
import { FireIcon } from '@heroicons/react/24/solid';
import { JournalEntry } from '@/types/journal';

interface LearningStreakProps {
  entries: JournalEntry[];
}

export function LearningStreak({ entries }: LearningStreakProps) {
  const streakData = useMemo(() => {
    if (!entries || entries.length === 0) {
      return { currentStreak: 0, longestStreak: 0, isOnStreak: false };
    }

    // 날짜별로 정렬 (최신순)
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let isOnStreak = false;

    // 현재 스트릭 계산
    let checkDate = new Date(today);
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        if (diffDays === 0) isOnStreak = true;
        checkDate = new Date(entryDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 최장 스트릭 계산
    let prevDate: Date | null = null;
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor(
          (prevDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = entryDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, isOnStreak };
  }, [entries]);

  return (
    <Card padding="lg" className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-full ${streakData.isOnStreak ? 'bg-orange-500' : 'bg-gray-400'}`}>
          <FireIcon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            학습 스트릭
          </h3>
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {streakData.currentStreak}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                일 연속
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              최장: {streakData.longestStreak}일
            </div>
          </div>
          {!streakData.isOnStreak && streakData.currentStreak > 0 && (
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              ⚠️ 오늘 학습하여 스트릭을 이어가세요!
            </p>
          )}
          {streakData.isOnStreak && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              🔥 계속해서 좋은 습관을 유지하고 있어요!
            </p>
          )}
        </div>
      </div>

      {/* 스트릭 히스토리 (최근 7일) */}
      <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">최근 7일</p>
        </div>
        <div className="flex gap-1">
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            date.setHours(0, 0, 0, 0);

            const dateStr = date.toISOString().split('T')[0];
            const hasEntry = entries.some(e => e.date === dateStr);

            return (
              <div
                key={index}
                className="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center"
                style={{
                  backgroundColor: hasEntry
                    ? 'rgb(249 115 22)' // orange-500
                    : 'rgb(229 231 235)', // gray-200
                }}
              >
                <span className="text-xs text-white font-medium">
                  {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
