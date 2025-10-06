'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { JournalEntry } from '@/types/journal';

interface CalendarProps {
  year: number;
  month: number; // 1-12
  entries: JournalEntry[];
}

export function Calendar({ year, month, entries }: CalendarProps) {
  const router = useRouter();

  // 해당 월의 달력 데이터 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = 일요일

    const days: (number | null)[] = [];

    // 앞 공백 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [year, month]);

  // 날짜별 일지 매핑
  const entryByDate = useMemo(() => {
    const map = new Map<string, JournalEntry>();
    entries.forEach((entry) => {
      map.set(entry.date, entry);
    });
    return map;
  }, [entries]);

  const getDayEntry = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entryByDate.get(dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    router.push(`/dashboard/journal/${dateStr}`);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day
    );
  };

  return (
    <Card padding="lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {year}년 {month}월
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* 요일 헤더 */}
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0
                ? 'text-red-600 dark:text-red-400'
                : index === 6
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀 */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const entry = getDayEntry(day);
          const today = isToday(day);
          const hasEntry = !!entry;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square p-1 rounded-lg border-2 transition-all
                ${today ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent'}
                ${hasEntry ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                ${index % 7 === 0 ? 'text-red-600 dark:text-red-400' : ''}
                ${index % 7 === 6 ? 'text-blue-600 dark:text-blue-400' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-sm font-medium ${today ? 'font-bold' : ''}`}>
                  {day}
                </span>
                {hasEntry && (
                  <div className="mt-1 flex gap-0.5">
                    {entry.mood && (
                      <span className="text-xs">
                        {entry.mood === 'great' && '😄'}
                        {entry.mood === 'good' && '🙂'}
                        {entry.mood === 'okay' && '😐'}
                        {entry.mood === 'bad' && '😞'}
                      </span>
                    )}
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-50 dark:bg-green-900/20 border-2 border-transparent rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">학습 완료</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">오늘</span>
        </div>
      </div>
    </Card>
  );
}
