'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import { BadgeCard } from './BadgeCard';
import { badgeCategories, allBadges } from '@/lib/achievements/badges';
import type { JournalEntry } from '@/types/journal';
import type { BadgeProgress, BadgeType } from '@/types/achievement';

interface BadgeGalleryProps {
  entries: JournalEntry[];
  completedWeeks: number;
}

export function BadgeGallery({ entries, completedWeeks }: BadgeGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<BadgeType | 'all'>('all');

  // 배지 진행 상태 계산
  const badgeProgress = useMemo((): BadgeProgress[] => {
    if (!entries || entries.length === 0) {
      return allBadges.map(badge => ({
        badge,
        isUnlocked: false,
        currentValue: 0,
        targetValue: badge.requirement,
        percentage: 0,
      }));
    }

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

    // 총 학습 시간 (분)
    const totalTime = entries.reduce((sum, e) => sum + e.learningTime, 0);

    // 총 활동 수
    const totalActivities = entries.reduce((sum, e) => sum + e.completedActivities.length, 0);

    // 영역별 활동 수
    const skillCounts: Record<string, number> = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
      vocabulary: 0,
      grammar: 0,
    };

    entries.forEach(entry => {
      entry.completedActivities.forEach(activity => {
        if (skillCounts[activity.activityType] !== undefined) {
          skillCounts[activity.activityType]++;
        }
      });
    });

    // 각 배지별 진행 상태 계산
    return allBadges.map(badge => {
      let currentValue = 0;
      let isUnlocked = false;

      switch (badge.type) {
        case 'streak':
          currentValue = currentStreak;
          break;
        case 'time':
          currentValue = totalTime;
          break;
        case 'activity':
          currentValue = totalActivities;
          break;
        case 'skill':
          // 배지 ID에서 영역 추출 (예: skill_listening -> listening)
          const skillType = badge.id.replace('skill_', '');
          currentValue = skillCounts[skillType] || 0;
          break;
        case 'week':
          currentValue = completedWeeks;
          break;
        case 'special':
          // 특수 배지는 별도 로직 필요 (추후 구현)
          currentValue = 0;
          break;
      }

      isUnlocked = currentValue >= badge.requirement;
      const percentage = (currentValue / badge.requirement) * 100;

      return {
        badge,
        isUnlocked,
        currentValue,
        targetValue: badge.requirement,
        percentage,
      };
    });
  }, [entries, completedWeeks]);

  // 필터링된 배지
  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') {
      return badgeProgress;
    }
    return badgeProgress.filter(bp => bp.badge.type === selectedCategory);
  }, [badgeProgress, selectedCategory]);

  // 통계
  const stats = useMemo(() => {
    const unlocked = badgeProgress.filter(bp => bp.isUnlocked).length;
    const total = badgeProgress.length;
    const percentage = Math.round((unlocked / total) * 100);

    return { unlocked, total, percentage };
  }, [badgeProgress]);

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              획득한 배지
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stats.unlocked} / {stats.total} 개 달성
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {stats.percentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">완료율</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </Card>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          전체
        </button>
        {badgeCategories.map(category => (
          <button
            key={category.type}
            onClick={() => setSelectedCategory(category.type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 배지 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBadges.map(bp => (
          <BadgeCard key={bp.badge.id} badgeProgress={bp} />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredBadges.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              이 카테고리에는 배지가 없습니다.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
