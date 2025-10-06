'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui';
import type { JournalEntry } from '@/types/journal';

interface SkillProgressProps {
  entries: JournalEntry[];
}

type SkillType = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary' | 'grammar';

const skillNames: Record<SkillType, string> = {
  listening: '듣기',
  speaking: '말하기',
  reading: '읽기',
  writing: '쓰기',
  vocabulary: '어휘',
  grammar: '문법',
};

const skillColors: Record<SkillType, { bg: string; text: string; bar: string }> = {
  listening: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500 dark:bg-blue-600',
  },
  speaking: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    bar: 'bg-green-500 dark:bg-green-600',
  },
  reading: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    bar: 'bg-purple-500 dark:bg-purple-600',
  },
  writing: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500 dark:bg-orange-600',
  },
  vocabulary: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400',
    bar: 'bg-pink-500 dark:bg-pink-600',
  },
  grammar: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500 dark:bg-indigo-600',
  },
};

export function SkillProgress({ entries }: SkillProgressProps) {
  const skillStats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return [];
    }

    const stats: Record<SkillType, { count: number; totalTime: number }> = {
      listening: { count: 0, totalTime: 0 },
      speaking: { count: 0, totalTime: 0 },
      reading: { count: 0, totalTime: 0 },
      writing: { count: 0, totalTime: 0 },
      vocabulary: { count: 0, totalTime: 0 },
      grammar: { count: 0, totalTime: 0 },
    };

    entries.forEach(entry => {
      entry.completedActivities.forEach(activity => {
        const skillType = activity.activityType as SkillType;
        if (stats[skillType]) {
          stats[skillType].count++;
          // 활동당 평균 10분 가정
          stats[skillType].totalTime += 10;
        }
      });
    });

    const maxCount = Math.max(...Object.values(stats).map(s => s.count), 1);

    return (Object.keys(stats) as SkillType[]).map(skill => ({
      skill,
      name: skillNames[skill],
      count: stats[skill].count,
      totalTime: stats[skill].totalTime,
      percentage: (stats[skill].count / maxCount) * 100,
      colors: skillColors[skill],
    }));
  }, [entries]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        영역별 학습 현황
      </h3>
      <div className="space-y-6">
        {skillStats.map(({ skill, name, count, totalTime, percentage, colors }) => (
          <div key={skill}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors.bar}`} />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {count}개 활동
                </span>
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {formatTime(totalTime)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${colors.bar} h-2 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 요약 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">가장 많이 학습한 영역</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {skillStats.reduce((max, curr) => curr.count > max.count ? curr : max, skillStats[0])?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">더 학습이 필요한 영역</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {skillStats.filter(s => s.count > 0).reduce((min, curr) => curr.count < min.count ? curr : min, skillStats.find(s => s.count > 0) || skillStats[0])?.name || '-'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
