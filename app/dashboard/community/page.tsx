'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/useCommunity';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import type { PostType, PostCategory } from '@/types/community';

export default function CommunityPage() {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState<PostType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');

  const { data: posts, isLoading, refresh } = usePosts(
    selectedTab === 'all' ? undefined : selectedTab,
    selectedCategory === 'all' ? undefined : selectedCategory,
    30
  );

  const tabs: { value: PostType | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'question', label: '질문' },
    { value: 'tip', label: '학습 팁' },
    { value: 'discussion', label: '토론' },
  ];

  const categories: { value: PostCategory | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'grammar', label: '문법' },
    { value: 'vocabulary', label: '어휘' },
    { value: 'listening', label: '듣기' },
    { value: 'speaking', label: '말하기' },
    { value: 'reading', label: '읽기' },
    { value: 'writing', label: '쓰기' },
    { value: 'study-tips', label: '학습 팁' },
    { value: 'general', label: '일반' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            💬 커뮤니티
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            학습자들과 소통하고 지식을 공유하세요
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/community/new'}>
          글쓰기
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTab === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* 게시물 목록 */}
      <div className="space-y-3">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <Card
              key={post.id}
              padding="lg"
              hover
              onClick={() => window.location.href = `/dashboard/community/${post.id}`}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* 타입 아이콘 */}
                <div className={`p-3 rounded-lg flex-shrink-0 ${
                  post.type === 'question'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : post.type === 'tip'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {post.type === 'question' && (
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {post.type === 'tip' && (
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {post.type === 'discussion' && (
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* 제목 */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {post.title}
                    </h3>
                    {post.isResolved && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                        해결됨
                      </span>
                    )}
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{post.authorName}</span>
                    {post.authorLevel && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {post.authorLevel}
                      </span>
                    )}
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>

                  {/* 통계 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{post.viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.replyCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card padding="lg">
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                아직 게시물이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                첫 번째 게시물을 작성해보세요!
              </p>
              <Button onClick={() => window.location.href = '/dashboard/community/new'}>
                글쓰기
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
