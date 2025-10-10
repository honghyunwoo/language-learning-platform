'use client';

import { useState } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
  TrophyIcon,
  FireIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { calculateRank, getRankColor } from '@/lib/gamification/points';

type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';
type LeaderboardCategory = 'points' | 'streak' | 'time' | 'activities';

interface LeaderboardUser {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  streak: number;
  totalTime: number;
  completedActivities: number;
  rank: number;
  rankChange: number;
}

const MOCK_USERS: LeaderboardUser[] = [
  { id: '1', nickname: '영어마스터', avatar: '👑', points: 5420, streak: 127, totalTime: 3840, completedActivities: 245, rank: 1, rankChange: 2 },
  { id: '2', nickname: '언어천재', avatar: '🌟', points: 4890, streak: 98, totalTime: 3120, completedActivities: 198, rank: 2, rankChange: -1 },
  { id: '3', nickname: '공부벌레', avatar: '📚', points: 4650, streak: 156, totalTime: 4560, completedActivities: 234, rank: 3, rankChange: 1 },
  { id: '4', nickname: '영어러버', avatar: '❤️', points: 3920, streak: 45, totalTime: 2340, completedActivities: 167, rank: 4, rankChange: 0 },
  { id: '5', nickname: '열정만수르', avatar: '🔥', points: 3540, streak: 78, totalTime: 2890, completedActivities: 145, rank: 5, rankChange: 3 },
  { id: '6', nickname: '노력파', avatar: '💪', points: 3210, streak: 34, totalTime: 1980, completedActivities: 123, rank: 6, rankChange: -2 },
  { id: '7', nickname: '꾸준이', avatar: '🎯', points: 2890, streak: 89, totalTime: 2560, completedActivities: 134, rank: 7, rankChange: 1 },
  { id: '8', nickname: '상위권', avatar: '⭐', points: 2540, streak: 23, totalTime: 1450, completedActivities: 98, rank: 8, rankChange: -3 },
  { id: '9', nickname: '도전자', avatar: '🚀', points: 2210, streak: 56, totalTime: 1890, completedActivities: 112, rank: 9, rankChange: 0 },
  { id: '10', nickname: '초보탈출', avatar: '🌱', points: 1980, streak: 12, totalTime: 1120, completedActivities: 87, rank: 10, rankChange: 4 },
];

const CURRENT_USER: LeaderboardUser = {
  id: 'current', nickname: '나', avatar: '😊', points: 2540, streak: 23, totalTime: 1450, completedActivities: 98, rank: 8, rankChange: -3
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all-time');
  const [category, setCategory] = useState<LeaderboardCategory>('points');

  const getCategoryValue = (user: LeaderboardUser): number => {
    switch (category) {
      case 'points': return user.points;
      case 'streak': return user.streak;
      case 'time': return user.totalTime;
      case 'activities': return user.completedActivities;
    }
  };

  const getCategoryLabel = (category: LeaderboardCategory): string => {
    switch (category) {
      case 'points': return '포인트';
      case 'streak': return '연속 일수';
      case 'time': return '학습 시간';
      case 'activities': return '완료 활동';
    }
  };

  const getCategoryIcon = (category: LeaderboardCategory) => {
    switch (category) {
      case 'points': return <TrophyIcon className="w-5 h-5" />;
      case 'streak': return <FireIcon className="w-5 h-5" />;
      case 'time': return <ClockIcon className="w-5 h-5" />;
      case 'activities': return <AcademicCapIcon className="w-5 h-5" />;
    }
  };

  const formatValue = (value: number, category: LeaderboardCategory): string => {
    if (category === 'time') {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}시간 ${minutes}분`;
    }
    return value.toLocaleString();
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUpIcon className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ChevronDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 text-gray-400">-</div>;
  };

  const getPodiumPosition = (rank: number): string => {
    switch (rank) {
      case 1: return 'h-32 order-2';
      case 2: return 'h-24 order-1';
      case 3: return 'h-20 order-3';
      default: return '';
    }
  };

  const getPodiumGradient = (rank: number): string => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return '';
    }
  };

  const topThree = MOCK_USERS.slice(0, 3);
  const restOfUsers = MOCK_USERS.slice(3);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrophyIcon className="w-12 h-12 text-yellow-500 animate-bounce-in" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              리더보드
            </h1>
            <TrophyIcon className="w-12 h-12 text-yellow-500 animate-bounce-in" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">최고의 학습자들과 경쟁하고 순위를 올려보세요!</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              {(['weekly', 'monthly', 'all-time'] as LeaderboardPeriod[]).map((p) => (
                <Button key={p} variant={period === p ? 'primary' : 'secondary'} size="sm" onClick={() => setPeriod(p)}>
                  {p === 'weekly' ? '주간' : p === 'monthly' ? '월간' : '전체'}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['points', 'streak', 'time', 'activities'] as LeaderboardCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    category === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span className="hidden sm:inline">{getCategoryLabel(cat)}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-2xl font-black text-center mb-6 text-gray-800 dark:text-white">🏆 TOP 3 🏆</h2>
          <div className="flex justify-center items-end gap-4 mb-6">
            {topThree.map((user) => (
              <div key={user.id} className={`flex flex-col items-center ${getPodiumPosition(user.rank)}`}>
                <div className="relative mb-3">
                  <div className="text-5xl mb-2 animate-bounce-in">{user.avatar}</div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${getPodiumGradient(user.rank)} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                    {user.rank}
                  </div>
                </div>
                <div className="text-center mb-2">
                  <div className="font-bold text-gray-800 dark:text-white">{user.nickname}</div>
                  <Badge variant="default" size="sm" className={`bg-gradient-to-r ${getRankColor(calculateRank(user.points))} text-white`}>
                    {calculateRank(user.points)}
                  </Badge>
                </div>
                <div className={`w-full bg-gradient-to-t ${getPodiumGradient(user.rank)} rounded-t-2xl flex items-center justify-center text-white font-black text-xl transition-all duration-300 hover:scale-105 shadow-lg`}>
                  {formatValue(getCategoryValue(user), category)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            {restOfUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-[1.02] hover-lift">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-2xl font-black text-gray-700 dark:text-gray-300">{user.rank}</span>
                  {getRankChangeIcon(user.rankChange)}
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white">{user.nickname}</div>
                    <Badge variant="default" size="sm" className={`bg-gradient-to-r ${getRankColor(calculateRank(user.points))} text-white`}>
                      {calculateRank(user.points)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatValue(getCategoryValue(user), category)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{getCategoryLabel(category)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-16">
              <span className="text-2xl font-black">{CURRENT_USER.rank}</span>
              {getRankChangeIcon(CURRENT_USER.rankChange)}
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="text-3xl">{CURRENT_USER.avatar}</div>
              <div>
                <div className="font-bold text-lg">{CURRENT_USER.nickname} (나의 순위)</div>
                <Badge variant="default" size="sm" className="bg-white/20 text-white">
                  {calculateRank(CURRENT_USER.points)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">{formatValue(getCategoryValue(CURRENT_USER), category)}</div>
              <div className="text-sm opacity-90">{getCategoryLabel(category)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-gray-800 dark:text-white">💡 리더보드 안내</h3>
            <p className="text-gray-700 dark:text-gray-300">학습 활동을 완료하고 포인트를 획득하여 순위를 올려보세요!</p>
            <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
              <div className="flex items-center gap-1">
                <ChevronUpIcon className="w-4 h-4 text-green-500" />
                <span>순위 상승</span>
              </div>
              <div className="flex items-center gap-1">
                <ChevronDownIcon className="w-4 h-4 text-red-500" />
                <span>순위 하락</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-gray-400">-</div>
                <span>변동 없음</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
