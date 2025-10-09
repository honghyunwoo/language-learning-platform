'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToggleLike } from '@/hooks/useCommunity';
import { usePosts } from '@/hooks/useCommunity';
import { Button, Card } from '@/components/ui';
import {
  SkeletonCard
} from '@/components/ui';
import {
  PencilIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'all', name: '모든 글', count: 156 },
  { id: 'journal', name: '학습 일지', count: 45 },
  { id: 'tip', name: '학습 팁', count: 32 },
  { id: 'review', name: '리소스 리뷰', count: 28 },
  { id: 'question', name: '질문', count: 35 },
  { id: 'success', name: '성공 사례', count: 16 },
];

const levels = ['A1', 'A2', 'B1', 'B2'];

const popularTags = [
  '발음', '문법', '듣기', '읽기', '말하기', '쓰기', 
  '동기부여', '초급', '중급', '토익', '회화', '단어'
];

// 임시 데이터 (실제로는 Firestore에서 가져올 데이터)
const mockPosts = [
  {
    id: '1',
    title: '3개월 만에 A2에서 B1로 올라간 후기',
    content: '정말 힘들었지만 체계적인 학습 덕분에 가능했어요. 특히 매일 듣기 연습이 도움이 되었습니다...',
    author: {
      nickname: '영희',
      level: 'B1',
      profilePic: null,
    },
    category: 'success',
    tags: ['동기부여', '듣기', '성공사례'],
    createdAt: '2024-01-15T10:30:00Z',
    likeCount: 42,
    commentCount: 15,
    viewCount: 234,
    isBookmarked: false,
  },
  {
    id: '2',
    title: '영어 발음 개선하는 팁 5가지',
    content: '많은 분들이 발음에 어려움을 느끼시는데, 제가 실제로 효과를 봤던 방법들을 공유해드려요...',
    author: {
      nickname: '철수',
      level: 'B2',
      profilePic: null,
    },
    category: 'tip',
    tags: ['발음', '팁', '초급'],
    createdAt: '2024-01-14T14:20:00Z',
    likeCount: 28,
    commentCount: 8,
    viewCount: 189,
    isBookmarked: true,
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  // 실제 데이터 조회
  const { data: posts, isLoading, error } = usePosts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    level: selectedLevels.length > 0 ? selectedLevels : undefined,
    search: searchQuery || undefined,
    sortBy,
  });

  const toggleLike = useToggleLike();

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* 좌측 사이드바 - 필터 */}
          <div className="lg:col-span-1">
            <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 sticky top-6">
              {/* 글 쓰기 버튼 */}
              <Button
                variant="primary"
                className="w-full mb-6"
                onClick={() => router.push('/dashboard/community/write')}
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                새 글 작성하기
              </Button>

              {/* 카테고리 필터 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  카테고리
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* 레벨 필터 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  레벨
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelToggle(level)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevels.includes(level)
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 인기 태그 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  인기 태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 중앙 메인 피드 */}
          <div className="lg:col-span-2">
            {/* 검색 및 정렬 */}
            <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 검색바 */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="글 제목, 내용, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* 정렬 옵션 */}
                <div className="flex gap-2">
                  {[
                    { key: 'latest', label: '최신순' },
                    { key: 'popular', label: '인기순' },
                    { key: 'trending', label: '트렌딩' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSortBy(option.key as 'latest' | 'popular' | 'trending')}
                      className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                        sortBy === option.key
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 글 목록 */}
            <div className="space-y-4">
              {isLoading ? (
                // 로딩 상태
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : error ? (
                <Card padding="lg" className="text-center">
                  <p className="text-red-600 dark:text-red-400">
                    게시글을 불러오는데 실패했습니다. 다시 시도해주세요.
                  </p>
                </Card>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id} padding="lg" className="hover:shadow-xl transition-shadow cursor-pointer">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        {post.authorProfilePic ? (
                          <img
                            src={post.authorProfilePic}
                            alt={post.authorNickname}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {post.authorNickname.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {post.authorNickname}
                          </span>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                            {post.authorLevel}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(post.createdAt.toDate().toISOString())}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 글 내용 */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 상호작용 버튼들 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => {
                            if (!currentUser) return;
                            toggleLike.mutate({ postId: post.id, userId: currentUser.uid });
                          }}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <HeartIcon className="w-5 h-5" />
                          <span>{post.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span>{post.commentCount}</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <EyeIcon className="w-5 h-5" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          post.isBookmarked
                            ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        }`}
                      >
                        <BookmarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card padding="lg" className="text-center">
                  <div className="py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <PencilIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      아직 게시글이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      첫 번째 게시글을 작성해보세요!
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push('/dashboard/community/write')}
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      글 작성하기
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* 더 보기 버튼 */}
            {!isLoading && (
              <div className="text-center mt-8">
                <Button variant="secondary" size="lg">
                  더 많은 글 보기
                </Button>
              </div>
            )}
          </div>

          {/* 우측 사이드바 - 위젯 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 이번 주 인기 글 */}
              <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  이번 주 인기 글
                </h3>
                <div className="space-y-3">
                  {mockPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{post.author.nickname}</span>
                          <span>•</span>
                          <span>{post.likeCount} 좋아요</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 팔로우 추천 */}
              <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  팔로우 추천
                </h3>
                <div className="space-y-4">
                  {[
                    { nickname: '영희', level: 'B1', bio: '38세 직장인, 6개월째 학습 중' },
                    { nickname: '철수', level: 'B2', bio: '영어 강사, 학습 팁 전문' },
                  ].map((user) => (
                    <div key={user.nickname} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          {user.nickname.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.nickname}
                          </span>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                            {user.level}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.bio}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        팔로우
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}