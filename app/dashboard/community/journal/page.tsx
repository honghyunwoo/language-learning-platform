'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button } from '@/components/ui';
import { CalendarIcon, FireIcon, PencilIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function JournalPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 학습 일지만 필터링
  const { data: journals, isLoading } = usePosts({
    category: 'journal',
    sortBy: 'latest',
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 스트릭 계산 (임시 - 실제로는 Firestore에서)
  const currentStreak = 7;
  const longestStreak = 15;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                📔 학습 일지
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                나만의 영어 학습 여정을 기록하세요
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=journal')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              일지 작성
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 스트릭 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card padding="lg" className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <FireIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">현재 스트릭</div>
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{currentStreak}일</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-800/20 border-2 border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-pink-600 dark:text-pink-400 font-medium">최장 스트릭</div>
                <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">{longestStreak}일</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                <PencilIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">총 일지</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{journals?.length || 0}개</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 캘린더 뷰 (간단한 버전) */}
        <Card padding="lg" className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-orange-500" />
              학습 캘린더
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
              >
                ←
              </Button>
              <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg font-semibold text-orange-700 dark:text-orange-300">
                {selectedYear}년 {selectedMonth + 1}월
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
              >
                →
              </Button>
            </div>
          </div>

          {/* 간단한 캘린더 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const hasEntry = i % 3 === 0; // 임시 - 실제로는 Firestore 데이터 확인
              return (
                <div
                  key={i}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                    ${hasEntry
                      ? 'bg-orange-500 text-white cursor-pointer hover:bg-orange-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 타임라인 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">📖</span>
            최근 학습 일지
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : journals && journals.length > 0 ? (
            <div className="relative">
              {/* 타임라인 선 */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-300 via-pink-300 to-purple-300 rounded-full"></div>

              {journals.map((journal, index) => (
                <div key={journal.id} className="relative pl-20 pb-12 last:pb-0">
                  {/* 타임라인 점 */}
                  <div className="absolute left-4 w-9 h-9 bg-white dark:bg-gray-800 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg">
                      {index === 0 ? '🔥' : index === 1 ? '✨' : index === 2 ? '💪' : '📝'}
                    </span>
                  </div>

                  {/* 일지 카드 */}
                  <Card
                    padding="lg"
                    className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur"
                    style={{
                      transform: `rotate(${Math.random() * 2 - 1}deg)`,
                      borderRadius: '20px 10px 20px 10px',
                    }}
                    onClick={() => router.push(`/dashboard/community/${journal.id}`)}
                  >
                    {/* 날짜 스티커 */}
                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-6 font-bold">
                      {journal.createdAt.toDate().toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>

                    {/* 프로필 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {journal.authorNickname.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {journal.authorNickname}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                            {journal.authorLevel}
                          </span>
                          <span>•</span>
                          <span>{journal.createdAt.toDate().toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {journal.title}
                    </h3>

                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {journal.content}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 인터랙션 */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <HeartIcon className="w-5 h-5" />
                        {journal.likeCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        {journal.commentCount}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                첫 학습 일지를 작성해보세요!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                오늘 배운 내용, 느낀 점을 기록하면 학습 동기가 높아집니다
              </p>
              <Button
                onClick={() => router.push('/dashboard/community/write?category=journal')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                일지 작성하기
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
