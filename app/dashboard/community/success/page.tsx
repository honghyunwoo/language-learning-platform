'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button } from '@/components/ui';
import {
  TrophyIcon,
  HeartIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ClockIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const milestoneTypes = [
  { id: 'first-conversation', name: '첫 대화 성공', icon: '💬', color: 'from-blue-500 to-cyan-500' },
  { id: 'test-pass', name: '시험 합격', icon: '📝', color: 'from-green-500 to-emerald-500' },
  { id: 'fluency', name: '유창성 달성', icon: '🎯', color: 'from-purple-500 to-pink-500' },
  { id: 'culture', name: '문화 경험', icon: '🌍', color: 'from-orange-500 to-red-500' },
  { id: 'career', name: '취업/승진', icon: '💼', color: 'from-indigo-500 to-blue-500' },
];

export default function SuccessStoriesPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'inspiring'>('inspiring');

  const { data: stories, isLoading } = usePosts({
    category: 'success',
    sortBy: sortBy === 'inspiring' ? 'trending' : sortBy,
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 필터링
  const filteredStories = stories?.filter((story) => {
    if (!selectedMilestone) return true;
    return story.tags.includes(selectedMilestone);
  });

  const totalStories = stories?.length || 0;
  const averageDuration = 8; // 임시: 평균 8개월
  const totalInspired = stories?.reduce((sum, s) => sum + s.likeCount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-yellow-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                🏆 성공 사례
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                언어 학습으로 인생이 바뀐 이야기들
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=success')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
            >
              <TrophyIcon className="w-5 h-5 mr-2" />
              성공 스토리 공유
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card padding="lg" className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">성공 스토리</div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{totalStories}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-12 h-12 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">평균 학습 기간</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{averageDuration}개월</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <HeartSolidIcon className="w-12 h-12 text-red-500" />
              <div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">총 영감 받은 수</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{totalInspired}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* 마일스톤 필터 */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedMilestone === null ? 'primary' : 'secondary'}
              onClick={() => setSelectedMilestone(null)}
            >
              전체
            </Button>
            {milestoneTypes.map((type) => (
              <Button
                key={type.id}
                size="sm"
                variant={selectedMilestone === type.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedMilestone(type.id)}
                className={selectedMilestone === type.id ? `bg-gradient-to-r ${type.color}` : ''}
              >
                <span className="mr-1">{type.icon}</span>
                {type.name}
              </Button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'inspiring')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
            >
              <option value="inspiring">가장 영감을 주는</option>
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>

        {/* 성공 스토리 리스트 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          </div>
        ) : filteredStories && filteredStories.length > 0 ? (
          <div className="space-y-8">
            {filteredStories.map((story, index) => {
              const milestone = milestoneTypes.find((m) => story.tags.includes(m.id));
              const studyDuration = Math.floor(Math.random() * 12) + 3; // 임시: 3-15개월

              return (
                <Card
                  key={story.id}
                  padding="lg"
                  className="cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group"
                  onClick={() => router.push(`/dashboard/community/${story.id}`)}
                >
                  {/* 배경 그라데이션 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${milestone?.color || 'from-gray-200 to-gray-300'} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                  {/* 순위 배지 (상위 3개) */}
                  {index < 3 && (
                    <div className="absolute top-4 left-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        'bg-gradient-to-br from-orange-400 to-orange-600'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {story.authorNickname.charAt(0)}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{story.authorNickname}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {studyDuration}개월간의 여정 • {story.createdAt.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* 마일스톤 배지 */}
                      {milestone && (
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${milestone.color} shadow-lg`}>
                          <span className="text-xl">{milestone.icon}</span>
                          {milestone.name}
                        </span>
                      )}
                    </div>

                    {/* 제목 */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors leading-tight">
                      {story.title}
                    </h2>

                    {/* 내용 */}
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-4">
                      {story.content}
                    </p>

                    {/* 키워드 태그 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.tags.filter(tag => !milestoneTypes.some(m => m.id === tag)).slice(0, 6).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 하단 정보 */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <HeartSolidIcon className="w-6 h-6 text-red-500" />
                          <span className="font-bold text-lg">{story.likeCount}</span>
                          <span>명이 영감받음</span>
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {story.commentCount} 댓글
                        </span>
                        <span className="flex items-center gap-1">
                          👁️ {story.viewCount} 읽음
                        </span>
                      </div>

                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/community/${story.id}`);
                        }}
                      >
                        <RocketLaunchIcon className="w-4 h-4 mr-1" />
                        전체 스토리 읽기
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="lg" className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedMilestone ? '해당 카테고리의 성공 스토리가 없습니다' : '아직 성공 스토리가 없습니다'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedMilestone
                ? '다른 카테고리를 선택하거나 첫 번째 스토리를 공유해보세요'
                : '당신의 성공 스토리로 다른 학습자들에게 영감을 주세요!'}
            </p>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=success')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <TrophyIcon className="w-5 h-5 mr-2" />
              성공 스토리 공유
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
