'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card, Button } from '@/components/ui';
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  FireIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

export default function QnAPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'unanswered'>('unanswered');

  // Q&A만 필터링
  const { data: questions, isLoading } = usePosts({
    category: 'question',
    sortBy: sortBy === 'unanswered' ? 'latest' : sortBy,
  });

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  // 필터링
  const filteredQuestions = questions?.filter((q) => {
    if (filterStatus === 'unsolved') return q.commentCount === 0 || !q.isBookmarked; // 임시: isBookmarked를 해결됨으로 사용
    if (filterStatus === 'solved') return q.isBookmarked; // 임시
    return true;
  });

  const unsolvedCount = questions?.filter((q) => !q.isBookmarked).length || 0;
  const solvedCount = questions?.filter((q) => q.isBookmarked).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ❓ 질문과 답변
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                궁금한 점을 질문하고 서로 도와주세요
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=question')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              질문하기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card padding="lg" className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <QuestionMarkCircleIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">전체 질문</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{questions?.length || 0}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
              <div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">미해결</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{unsolvedCount}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">해결됨</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{solvedCount}</div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <FireIcon className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">평균 답변</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {questions?.length ? Math.round(questions.reduce((sum, q) => sum + q.commentCount, 0) / questions.length * 10) / 10 : 0}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* 상태 필터 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterStatus === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('all')}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={filterStatus === 'unsolved' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('unsolved')}
              className={filterStatus === 'unsolved' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              미해결
            </Button>
            <Button
              size="sm"
              variant={filterStatus === 'solved' ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus('solved')}
              className={filterStatus === 'solved' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              해결됨
            </Button>
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'unanswered')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="unanswered">답변 필요한 순</option>
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>

        {/* 질문 리스트 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredQuestions && filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map((question) => {
              const isSolved = question.isBookmarked; // 임시
              const isUrgent = question.commentCount === 0 && !isSolved;

              return (
                <Card
                  key={question.id}
                  padding="lg"
                  className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur relative"
                  onClick={() => router.push(`/dashboard/community/${question.id}`)}
                >
                  {/* 상태 배지 */}
                  <div className="absolute top-4 right-4">
                    {isSolved ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                        <CheckCircleIcon className="w-4 h-4" />
                        해결됨
                      </div>
                    ) : isUrgent ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold animate-pulse">
                        <ClockIcon className="w-4 h-4" />
                        답변 대기
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-[80px_1fr] gap-6">
                    {/* 왼쪽: 통계 */}
                    <div className="flex flex-col items-center gap-3">
                      {/* 답변 수 */}
                      <div className={`
                        text-center p-3 rounded-lg border-2
                        ${isSolved
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : question.commentCount > 0
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                        }
                      `}>
                        <div className={`text-2xl font-bold ${isSolved ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {question.commentCount}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">답변</div>
                      </div>

                      {/* 조회 수 */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                          <EyeIcon className="w-4 h-4" />
                          {question.viewCount}
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 질문 내용 */}
                    <div>
                      {/* 제목 */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-24">
                        {question.title}
                      </h3>

                      {/* 내용 미리보기 */}
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {question.content}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 작성자 및 시간 */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {question.authorNickname.charAt(0)}
                          </div>
                          <span className="font-medium">{question.authorNickname}</span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                            {question.authorLevel}
                          </span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {question.createdAt.toDate().toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {filterStatus === 'unsolved' ? '미해결 질문이 없습니다!' : '질문이 없습니다'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus === 'unsolved'
                ? '모든 질문이 해결되었어요. 대단해요! 🎉'
                : '궁금한 점이 있다면 주저하지 말고 질문해보세요'}
            </p>
            <Button
              onClick={() => router.push('/dashboard/community/write?category=question')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              질문하기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
