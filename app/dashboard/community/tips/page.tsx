'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button } from '@/components/ui';
import {
  LightBulbIcon,
  ClockIcon,
  BookmarkIcon,
  FireIcon,
  FunnelIcon,
  SparklesIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const difficultyColors = {
  초급: 'from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  중급: 'from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  고급: 'from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
};

export default function TipsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'bookmarked'>('popular');

  // 팁만 필터링
  const { data: tips, isLoading } = usePosts({
    category: 'tip',
    sortBy: sortBy === 'bookmarked' ? 'trending' : sortBy,
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 난이도 필터링
  const filteredTips = tips?.filter((tip) => {
    if (!selectedDifficulty) return true;
    return tip.tags.includes(selectedDifficulty);
  });

  const totalTips = tips?.length || 0;
  const beginnerTips = tips?.filter((t) => t.tags.includes('초급')).length || 0;
  const intermediateTips = tips?.filter((t) => t.tags.includes('중급')).length || 0;
  const advancedTips = tips?.filter((t) => t.tags.includes('고급')).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-teal-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                💡 학습 팁 가이드
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                단계별 학습 팁으로 실력을 향상시켜보세요
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=tip')}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
            >
              <LightBulbIcon className="w-5 h-5 mr-2" />
              팁 공유하기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="lg" className="bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/20 border-2 border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-3">
              <LightBulbIcon className="w-12 h-12 text-teal-600 dark:text-teal-400" />
              <div>
                <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">전체 팁</div>
                <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{totalTips}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">초급</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{beginnerTips}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <FireIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">중급</div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{intermediateTips}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
              <div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">고급</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{advancedTips}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* 난이도 필터 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedDifficulty === null ? 'primary' : 'secondary'}
              onClick={() => setSelectedDifficulty(null)}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={selectedDifficulty === '초급' ? 'primary' : 'secondary'}
              onClick={() => setSelectedDifficulty('초급')}
              className={selectedDifficulty === '초급' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              초급
            </Button>
            <Button
              size="sm"
              variant={selectedDifficulty === '중급' ? 'primary' : 'secondary'}
              onClick={() => setSelectedDifficulty('중급')}
              className={selectedDifficulty === '중급' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              중급
            </Button>
            <Button
              size="sm"
              variant={selectedDifficulty === '고급' ? 'primary' : 'secondary'}
              onClick={() => setSelectedDifficulty('고급')}
              className={selectedDifficulty === '고급' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              고급
            </Button>
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'latest' | 'bookmarked')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="bookmarked">북마크 많은 순</option>
            </select>
          </div>
        </div>

        {/* 팁 리스트 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          </div>
        ) : filteredTips && filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => {
              const difficulty = tip.tags.find((tag) => ['초급', '중급', '고급'].includes(tag)) || '초급';
              const estimatedTime = Math.floor(Math.random() * 10) + 5; // 임시: 5-15분

              return (
                <Card
                  key={tip.id}
                  padding="lg"
                  className="cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur relative overflow-hidden group"
                  onClick={() => router.push(`/dashboard/community/${tip.id}`)}
                >
                  {/* 난이도 배지 */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                    difficulty === '초급' ? 'from-green-400 to-green-600' :
                    difficulty === '중급' ? 'from-yellow-400 to-yellow-600' :
                    'from-red-400 to-red-600'
                  }`}></div>

                  {/* 북마크 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: 북마크 토글
                    }}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    {tip.isBookmarked ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-teal-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="pt-4">
                    {/* 난이도 태그 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 bg-gradient-to-r ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
                        {difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="w-4 h-4" />
                        {estimatedTime}분
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {tip.title}
                    </h3>

                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {tip.content}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tip.tags.filter(tag => !['초급', '중급', '고급'].includes(tag)).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 하단 정보 */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {tip.authorNickname.charAt(0)}
                        </div>
                        <span className="font-medium">{tip.authorNickname}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookmarkSolidIcon className="w-4 h-4" />
                          {tip.likeCount}
                        </span>
                        <span>{tip.viewCount} views</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="lg" className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedDifficulty ? `${selectedDifficulty} 팁이 없습니다` : '아직 팁이 없습니다'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedDifficulty
                ? '다른 난이도를 선택해보세요'
                : '첫 번째 학습 팁을 공유해주세요!'}
            </p>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=tip')}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              <LightBulbIcon className="w-5 h-5 mr-2" />
              팁 공유하기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
