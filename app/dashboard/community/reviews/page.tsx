'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button } from '@/components/ui';
import {
  StarIcon,
  BookOpenIcon,
  FilmIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const resourceTypes = [
  { id: 'book', name: '책', icon: BookOpenIcon, color: 'from-amber-500 to-orange-500' },
  { id: 'video', name: '영상', icon: FilmIcon, color: 'from-purple-500 to-pink-500' },
  { id: 'podcast', name: '팟캐스트', icon: MusicalNoteIcon, color: 'from-green-500 to-teal-500' },
  { id: 'website', name: '웹사이트', icon: GlobeAltIcon, color: 'from-blue-500 to-indigo-500' },
];

export default function ReviewsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  const { data: reviews, isLoading } = usePosts({
    category: 'review',
    sortBy: 'latest',
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 필터링
  const filteredReviews = reviews?.filter((review) => {
    if (selectedType && !review.tags.includes(selectedType)) return false;
    // 임시: 랜덤 별점 (실제로는 review.rating 사용)
    const rating = Math.random() * 5;
    if (rating < minRating) return false;
    return true;
  });

  const totalReviews = reviews?.length || 0;
  const averageRating = 4.2; // 임시
  const bookReviews = reviews?.filter((r) => r.tags.includes('book')).length || 0;
  const videoReviews = reviews?.filter((r) => r.tags.includes('video')).length || 0;

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarSolidIcon
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-amber-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ⭐ 리소스 리뷰
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                학습에 도움된 리소스를 평가하고 공유하세요
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=review')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
            >
              <StarIcon className="w-5 h-5 mr-2" />
              리뷰 작성하기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="lg" className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <StarSolidIcon className="w-12 h-12 text-amber-500" />
              <div>
                <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">전체 리뷰</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{totalReviews}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">평균 평점</div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{averageRating.toFixed(1)}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="w-12 h-12 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">책 리뷰</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{bookReviews}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/20 border-2 border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3">
              <FilmIcon className="w-12 h-12 text-rose-600 dark:text-rose-400" />
              <div>
                <div className="text-sm text-rose-600 dark:text-rose-400 font-medium">영상 리뷰</div>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{videoReviews}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 필터 */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* 리소스 타입 필터 */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedType === null ? 'primary' : 'secondary'}
              onClick={() => setSelectedType(null)}
            >
              전체
            </Button>
            {resourceTypes.map((type) => (
              <Button
                key={type.id}
                size="sm"
                variant={selectedType === type.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedType(type.id)}
                className={selectedType === type.id ? `bg-gradient-to-r ${type.color}` : ''}
              >
                <type.icon className="w-4 h-4 mr-1" />
                {type.name}
              </Button>
            ))}
          </div>

          {/* 최소 별점 필터 */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value={0}>모든 평점</option>
              <option value={4}>⭐ 4점 이상</option>
              <option value={3}>⭐ 3점 이상</option>
              <option value={2}>⭐ 2점 이상</option>
            </select>
          </div>
        </div>

        {/* 리뷰 리스트 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : filteredReviews && filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const rating = Math.floor(Math.random() * 2) + 4; // 임시: 4-5점
              const resourceType = resourceTypes.find((t) => review.tags.includes(t.id));

              return (
                <Card
                  key={review.id}
                  padding="lg"
                  className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur"
                  onClick={() => router.push(`/dashboard/community/${review.id}`)}
                >
                  <div className="flex gap-6">
                    {/* 왼쪽: 썸네일 & 별점 */}
                    <div className="flex-shrink-0">
                      <div className={`w-32 h-48 rounded-lg bg-gradient-to-br ${resourceType?.color || 'from-gray-300 to-gray-400'} flex items-center justify-center shadow-lg`}>
                        {resourceType ? (
                          <resourceType.icon className="w-16 h-16 text-white" />
                        ) : (
                          <BookOpenIcon className="w-16 h-16 text-white" />
                        )}
                      </div>
                      <div className="flex justify-center gap-1 mt-3">
                        {renderStars(rating)}
                      </div>
                      <div className="text-center mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {rating}.0
                      </div>
                    </div>

                    {/* 오른쪽: 리뷰 내용 */}
                    <div className="flex-1 min-w-0">
                      {/* 리소스 타입 배지 */}
                      {resourceType && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${resourceType.color} mb-3`}>
                          <resourceType.icon className="w-4 h-4" />
                          {resourceType.name}
                        </span>
                      )}

                      {/* 제목 */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {review.title}
                      </h3>

                      {/* 내용 */}
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                        {review.content}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.filter(tag => !['book', 'video', 'podcast', 'website'].includes(tag)).slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {review.authorNickname.charAt(0)}
                          </div>
                          <span className="font-medium">{review.authorNickname}</span>
                          <span className="text-gray-400">•</span>
                          <span>{review.createdAt.toDate().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <StarSolidIcon className="w-4 h-4 text-amber-400" />
                            {review.likeCount}
                          </span>
                          <span>💬 {review.commentCount}</span>
                          <span>👁️ {review.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="lg" className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedType || minRating > 0 ? '필터 조건에 맞는 리뷰가 없습니다' : '아직 리뷰가 없습니다'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedType || minRating > 0
                ? '필터를 조정하거나 첫 번째 리뷰를 작성해보세요'
                : '학습에 도움된 리소스를 평가하고 공유해주세요!'}
            </p>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=review')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <StarIcon className="w-5 h-5 mr-2" />
              리뷰 작성하기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
