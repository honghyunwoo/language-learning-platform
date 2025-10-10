'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/useCommunity';
import { Button, Card } from '@/components/ui';
import { Breadcrumb } from '@/components/ui';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { PostCategory } from '@/types/community';

const categories: Array<{ id: PostCategory; name: string; description: string }> = [
  { id: 'journal', name: '학습 일지', description: '나의 학습 경험과 성장을 공유해보세요' },
  { id: 'tip', name: '학습 팁', description: '효과적인 학습 방법을 알려주세요' },
  { id: 'review', name: '리소스 리뷰', description: '유용한 학습 자료를 추천해주세요' },
  { id: 'question', name: '질문', description: '궁금한 것을 물어보세요' },
  { id: 'success', name: '성공 사례', description: '성취한 경험을 나눠주세요' },
];

const levels = ['A1', 'A2', 'B1', 'B2'];

const popularTags = [
  '발음', '문법', '듣기', '읽기', '말하기', '쓰기', 
  '동기부여', '초급', '중급', '토익', '회화', '단어', '영어', '영어학습'
];

export default function WritePostPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const createPostMutation = useCreatePost();

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: PostCategory;
    tags: string[];
    level: string;
    isPublished: boolean;
  }>({
    title: '',
    content: '',
    category: 'journal',
    tags: [],
    level: '',
    isPublished: true,
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        authorId: currentUser.uid,
        authorNickname: currentUser.nickname || '익명',
        authorLevel: currentUser.level || 'A1',
        authorProfilePic: currentUser.profilePictureUrl || undefined,
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags,
        level: formData.level || undefined,
        isPublished: formData.isPublished,
      });

      router.push('/dashboard/community');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const handleCustomTagAdd = () => {
    if (newTag.trim()) {
      handleTagAdd(newTag.trim());
      setNewTag('');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card padding="lg" className="max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            게시글을 작성하려면 로그인해주세요.
          </p>
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => router.push('/login')}
          >
            로그인하기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* 브레드크럼 */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: '홈', href: '/dashboard' },
              { label: '커뮤니티', href: '/dashboard/community' },
              { label: '글 작성' },
            ]}
          />
        </div>

        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>돌아가기</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              새 글 작성하기
            </h1>
            <div></div>
          </div>
        </div>

        {/* 글 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <Card padding="lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              카테고리 선택
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.category === category.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* 제목 */}
          <Card padding="lg">
            <label className="block mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                제목 *
              </span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력하세요..."
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800"
              maxLength={100}
              required
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.title.length}/100
            </div>
          </Card>

          {/* 내용 */}
          <Card padding="lg">
            <label className="block mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                내용 *
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="내용을 입력하세요... (마크다운 문법 지원)"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800 min-h-[300px] resize-y"
              required
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.content.length}자
            </div>
          </Card>

          {/* 태그 */}
          <Card padding="lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              태그 (선택사항)
            </h3>
            
            {/* 선택된 태그 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 인기 태그 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                인기 태그 (클릭하여 추가):
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags
                  .filter(tag => !formData.tags.includes(tag))
                  .slice(0, 10)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagAdd(tag)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* 커스텀 태그 추가 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="새 태그 입력..."
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800"
                maxLength={20}
                disabled={formData.tags.length >= 5}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleCustomTagAdd}
                disabled={!newTag.trim() || formData.tags.length >= 5}
              >
                추가
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              최대 5개까지 추가 가능
            </div>
          </Card>

          {/* 레벨 선택 */}
          <Card padding="lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              관련 레벨 (선택사항)
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, level: '' }))}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  formData.level === ''
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                전체
              </button>
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, level }))}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.level === level
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </Card>

          {/* 발행 옵션 */}
          <Card padding="lg">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isPublished" className="text-gray-900 dark:text-white">
                즉시 발행 (체크 해제 시 임시 저장)
              </label>
            </div>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createPostMutation.isPending}
              className="min-w-[120px]"
            >
              {createPostMutation.isPending ? '작성 중...' : '게시하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
