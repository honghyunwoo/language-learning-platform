'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';

type ResourceCategory = 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
  level: string;
  type: 'website' | 'video' | 'article' | 'tool';
}

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');

  const categories = [
    { value: 'all' as const, label: '전체', icon: '📚' },
    { value: 'listening' as const, label: '듣기', icon: '👂' },
    { value: 'speaking' as const, label: '말하기', icon: '🗣️' },
    { value: 'reading' as const, label: '읽기', icon: '📖' },
    { value: 'writing' as const, label: '쓰기', icon: '✍️' },
    { value: 'grammar' as const, label: '문법', icon: '📝' },
    { value: 'vocabulary' as const, label: '어휘', icon: '📕' },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'BBC Learning English',
      description: 'BBC에서 제공하는 무료 영어 학습 자료',
      url: 'https://www.bbc.co.uk/learningenglish',
      category: 'listening',
      level: 'A2-B2',
      type: 'website',
    },
    {
      id: '2',
      title: 'Grammarly Blog',
      description: '영어 문법과 글쓰기 팁',
      url: 'https://www.grammarly.com/blog/',
      category: 'grammar',
      level: 'B1-B2',
      type: 'article',
    },
    {
      id: '3',
      title: 'VOA Learning English',
      description: 'Voice of America 영어 학습 프로그램',
      url: 'https://learningenglish.voanews.com/',
      category: 'listening',
      level: 'A1-B1',
      type: 'website',
    },
    {
      id: '4',
      title: 'Cambridge Dictionary',
      description: '영영사전 및 문법 설명',
      url: 'https://dictionary.cambridge.org/',
      category: 'vocabulary',
      level: 'All',
      type: 'tool',
    },
    {
      id: '5',
      title: 'TED Talks',
      description: '영어 연설 및 프레젠테이션',
      url: 'https://www.ted.com/',
      category: 'listening',
      level: 'B2',
      type: 'video',
    },
    {
      id: '6',
      title: 'English Grammar in Use',
      description: '체계적인 문법 학습 자료',
      url: 'https://www.cambridge.org/elt/grammarinuse',
      category: 'grammar',
      level: 'A1-B2',
      type: 'website',
    },
  ];

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          📚 학습 리소스
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          영어 학습에 도움이 되는 추천 자료를 모아두었습니다
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedCategory === category.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* 리소스 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map(resource => (
          <Card key={resource.id} padding="lg" hover>
            {/* 타입 배지 */}
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                resource.type === 'website' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                resource.type === 'video' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                resource.type === 'article' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              }`}>
                {resource.type === 'website' && '🌐 웹사이트'}
                {resource.type === 'video' && '🎥 비디오'}
                {resource.type === 'article' && '📄 아티클'}
                {resource.type === 'tool' && '🔧 도구'}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                {resource.level}
              </span>
            </div>

            {/* 제목 및 설명 */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {resource.description}
            </p>

            {/* 링크 버튼 */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
            >
              <span>바로가기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </Card>
        ))}
      </div>

      {/* 안내 메시지 */}
      <Card padding="lg" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              학습 팁
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              다양한 리소스를 활용하여 영어 학습을 더욱 풍부하게 만들어보세요.
              매일 조금씩 다른 자료를 접하면 실력 향상에 큰 도움이 됩니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
