'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button, EmptyState } from '@/components/ui';
import {
  SparklesIcon,
  FireIcon,
  ClockIcon,
  BookmarkIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'all', name: '전체', icon: '🌟', color: 'from-purple-500 to-pink-500' },
  { id: 'journal', name: '학습 일지', icon: '📔', color: 'from-orange-500 to-pink-500' },
  { id: 'question', name: 'Q&A', icon: '❓', color: 'from-blue-500 to-purple-500' },
  { id: 'tip', name: '학습 팁', icon: '💡', color: 'from-teal-500 to-cyan-500' },
  { id: 'review', name: '리뷰', icon: '⭐', color: 'from-amber-500 to-orange-500' },
  { id: 'success', name: '성공 사례', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
];

export default function FeedPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedType, setFeedType] = useState<'personalized' | 'trending' | 'latest'>('personalized');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 카테고리별로 데이터 가져오기
  const { data: allPosts, isLoading } = usePosts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    sortBy: feedType === 'trending' ? 'popular' : 'latest',
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 개인화 피드는 사용자의 활동 기록 기반으로 필터링
  const filteredPosts = (allPosts || []).filter((post) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.authorNickname.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const posts = filteredPosts;

  // 카테고리 아이콘 가져오기
  const getCategoryInfo = (category: string) => {
    return categories.find((c) => c.id === category) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✨ 통합 피드
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                당신을 위한 맞춤형 커뮤니티 콘텐츠
              </p>
            </div>

            {/* 검색창 */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="게시글, 작성자, 태그로 검색..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽: 필터 사이드바 */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">필터</h2>
              </div>

              {/* 피드 타입 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">피드 타입</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFeedType('personalized')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      feedType === 'personalized'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SparklesIcon className="w-4 h-4 inline mr-2" />
                    맞춤 추천
                  </button>
                  <button
                    onClick={() => setFeedType('trending')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      feedType === 'trending'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FireIcon className="w-4 h-4 inline mr-2" />
                    인기 트렌드
                  </button>
                  <button
                    onClick={() => setFeedType('latest')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      feedType === 'latest'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ClockIcon className="w-4 h-4 inline mr-2" />
                    최신순
                  </button>
                </div>
              </div>

              {/* 카테고리 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">카테고리</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const count = category.id === 'all' ? posts.length : posts.filter(p => p.category === category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.color} text-white`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span>
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </span>
                        <span className="text-xs font-bold">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* 오른쪽: 피드 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 피드 타입 설명 */}
            <Card padding="lg" className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                {feedType === 'personalized' && (
                  <>
                    <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h3 className="font-bold text-purple-900 dark:text-purple-100">맞춤 추천 피드</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        당신의 학습 레벨과 관심사에 맞춘 콘텐츠입니다
                      </p>
                    </div>
                  </>
                )}
                {feedType === 'trending' && (
                  <>
                    <FireIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h3 className="font-bold text-orange-900 dark:text-orange-100">인기 트렌드</h3>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        지금 커뮤니티에서 가장 핫한 콘텐츠입니다
                      </p>
                    </div>
                  </>
                )}
                {feedType === 'latest' && (
                  <>
                    <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">최신 콘텐츠</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        방금 올라온 따끈따끈한 게시글입니다
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* 포스트 리스트 */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => {
                  const categoryInfo = getCategoryInfo(post.category);

                  return (
                    <Card
                      key={post.id}
                      padding="lg"
                      className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur"
                      onClick={() => router.push(`/dashboard/community/${post.id}`)}
                    >
                      {/* 카테고리 배지 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryInfo.color}`}>
                          <span>{categoryInfo.icon}</span>
                          {categoryInfo.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 북마크 토글
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <BookmarkIcon className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>

                      {/* 내용 */}
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {post.content}
                      </p>

                      {/* 태그 */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {post.authorNickname.charAt(0)}
                          </div>
                          <span className="font-medium">{post.authorNickname}</span>
                          <span className="text-gray-400">•</span>
                          <span>{post.createdAt.toDate().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>❤️ {post.likeCount}</span>
                          <span>💬 {post.commentCount}</span>
                          <span>👁️ {post.viewCount}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card padding="lg" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur relative overflow-hidden">
                <EmptyState
                  icon={<PencilSquareIcon className="w-12 h-12 text-purple-500" />}
                  title={searchQuery ? '검색 결과가 없습니다' : selectedCategory === 'all' ? '아직 게시글이 없습니다' : `${getCategoryInfo(selectedCategory).name} 게시글이 없습니다`}
                  description={searchQuery ? '다른 검색어로 시도해보세요' : selectedCategory === 'all' ? '첫 번째 게시글을 작성해보세요!' : '다른 카테고리를 선택하거나 게시글을 작성해보세요'}
                  action={{
                    label: '✏️ 글쓰기',
                    onClick: () => router.push('/dashboard/community/write'),
                  }}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
