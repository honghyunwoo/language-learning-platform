'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, Badge } from '@/components/ui';
import {
  SkeletonCard
} from '@/components/ui';
import {
  MagnifyingGlassIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const resourceTypes = [
  { id: 'all', name: '모든 유형' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'podcast', name: '팟캐스트' },
  { id: 'website', name: '웹사이트' },
  { id: 'app', name: '앱' },
];

const categories = [
  { id: 'all', name: '모든 카테고리' },
  { id: 'listening', name: '듣기' },
  { id: 'speaking', name: '말하기' },
  { id: 'reading', name: '읽기' },
  { id: 'writing', name: '쓰기' },
  { id: 'grammar', name: '문법' },
  { id: 'vocabulary', name: '어휘' },
];

const levels = ['A1', 'A2', 'B1', 'B2'];
const durations = ['10분 이하', '10-30분', '30분 이상'];

// 임시 데이터 (실제로는 Firestore에서 가져올 데이터)
const mockResources = [
  {
    id: '1',
    type: 'youtube',
    title: 'English Addict with Mr Steve',
    description: '매일 10분씩 영어로 대화하는 채널. 자연스러운 일상 대화를 배울 수 있어요.',
    url: 'https://youtube.com/c/EnglishAddictwithMrSteve',
    thumbnailUrl: '/api/placeholder/300/200',
    levels: ['A2', 'B1', 'B2'],
    categories: ['listening', 'speaking'],
    duration: '10-30분',
    features: ['자막 제공', '느린 속도', '일상 대화'],
    rating: 4.8,
    reviewCount: 156,
    howToUse: '매일 10분씩 시청하며 쉐도잉 연습을 해보세요.',
    pros: ['자연스러운 발음', '실용적인 표현', '매일 업데이트'],
    cons: ['고급 수준은 부족'],
  },
  {
    id: '2',
    type: 'podcast',
    title: 'BBC Learning English',
    description: 'BBC에서 제작하는 공식 영어 학습 팟캐스트. 뉴스와 함께 영어를 배워보세요.',
    url: 'https://www.bbc.co.uk/learningenglish',
    thumbnailUrl: '/api/placeholder/300/200',
    levels: ['B1', 'B2'],
    categories: ['listening', 'reading'],
    duration: '10-30분',
    features: ['스크립트 제공', '다양한 주제', '정확한 발음'],
    rating: 4.9,
    reviewCount: 89,
    howToUse: '스크립트를 다운로드하여 듣기와 읽기를 동시에 연습하세요.',
    pros: ['전문적인 콘텐츠', '정확한 정보', '다양한 주제'],
    cons: ['속도가 빠름', '고급 수준'],
  },
];

export default function ResourcesPage() {
  useAuth(); // currentUser는 향후 사용 예정
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <PlayIcon className="w-5 h-5 text-red-500" />;
      case 'podcast':
        return <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>;
      case 'website':
        return <ArrowTopRightOnSquareIcon className="w-5 h-5 text-blue-500" />;
      case 'app':
        return <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>;
      default:
        return <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'podcast': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'website': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'app': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
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
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              <span className="gradient-text">학습 리소스</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              검증된 무료 영어 학습 자료를 레벨과 목적에 맞게 찾아보세요. 
              직접 사용해보고 추천하는 양질의 리소스만 엄선했습니다.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* 좌측 사이드바 - 필터 */}
          <div className="lg:col-span-1">
            <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 sticky top-6">
              {/* 검색바 */}
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="리소스 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 리소스 유형 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  리소스 유형
                </h3>
                <div className="space-y-2">
                  {resourceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedType === type.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 카테고리 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  학습 영역
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
                      {category.name}
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

              {/* 시간 길이 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  시간 길이
                </h3>
                <div className="space-y-2">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedDuration === duration
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 중앙 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 필터 결과 요약 */}
            <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    추천 리소스
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {mockResources.length}개의 리소스가 있습니다
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="level" level="A1">A1</Badge>
                  <Badge variant="level" level="A2">A2</Badge>
                  <Badge variant="level" level="B1">B1</Badge>
                  <Badge variant="level" level="B2">B2</Badge>
                </div>
              </div>
            </div>

            {/* 리소스 그리드 */}
            <div className="grid gap-6 md:grid-cols-2">
              {isLoading ? (
                // 로딩 상태
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : (
                mockResources.map((resource) => (
                  <Card key={resource.id} padding="lg" className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* 리소스 헤더 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(resource.type)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(resource.type)}`}>
                          {resourceTypes.find(t => t.id === resource.type)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {resource.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({resource.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* 썸네일 */}
                    <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        {getTypeIcon(resource.type)}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {resourceTypes.find(t => t.id === resource.type)?.name}
                        </p>
                      </div>
                    </div>

                    {/* 리소스 정보 */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {resource.description}
                      </p>
                    </div>

                    {/* 레벨 및 카테고리 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.levels.map((level) => (
                        <Badge key={level} variant="level" level={level as 'A1' | 'A2' | 'B1' | 'B2'} size="sm">
                          {level}
                        </Badge>
                      ))}
                      {resource.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {categories.find(c => c.id === category)?.name}
                        </span>
                      ))}
                    </div>

                    {/* 특징 및 시간 */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4" />
                        <span>{resource.features.length}개 특징</span>
                      </div>
                    </div>

                    {/* 사용법 가이드 */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        💡 사용법
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {resource.howToUse}
                      </p>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                        리소스로 이동
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {/* TODO: 상세 페이지로 이동 */}}
                      >
                        자세히 보기
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* 더 보기 버튼 */}
            {!isLoading && (
              <div className="text-center mt-8">
                <Button variant="secondary" size="lg">
                  더 많은 리소스 보기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}