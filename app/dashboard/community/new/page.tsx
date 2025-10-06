'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityActions } from '@/hooks/useCommunity';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import type { PostType, PostCategory } from '@/types/community';

export default function NewPostPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createPost, isSubmitting } = useCommunityActions(
    currentUser?.uid,
    currentUser?.nickname,
    currentUser?.level
  );

  const [type, setType] = useState<PostType>('question');
  const [category, setCategory] = useState<PostCategory>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const postId = await createPost({
        type,
        category,
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      });

      router.push(`/dashboard/community/${postId}`);
    } catch (error) {
      console.error('게시물 작성 실패:', error);
      alert('게시물 작성에 실패했습니다.');
    }
  };

  const postTypes: { value: PostType; label: string; icon: string }[] = [
    { value: 'question', label: '질문', icon: '❓' },
    { value: 'tip', label: '학습 팁', icon: '💡' },
    { value: 'discussion', label: '토론', icon: '💬' },
  ];

  const categories: { value: PostCategory; label: string }[] = [
    { value: 'general', label: '일반' },
    { value: 'grammar', label: '문법' },
    { value: 'vocabulary', label: '어휘' },
    { value: 'listening', label: '듣기' },
    { value: 'speaking', label: '말하기' },
    { value: 'reading', label: '읽기' },
    { value: 'writing', label: '쓰기' },
    { value: 'study-tips', label: '학습 팁' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          새 게시물 작성
        </h1>
        <Button
          variant="secondary"
          onClick={() => router.back()}
        >
          취소
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 게시물 타입 선택 */}
        <Card padding="lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            게시물 타입
          </label>
          <div className="grid grid-cols-3 gap-3">
            {postTypes.map(pt => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setType(pt.value)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  type === pt.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{pt.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {pt.label}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* 카테고리 선택 */}
        <Card padding="lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            카테고리
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as PostCategory)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </Card>

        {/* 제목 */}
        <Card padding="lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </Card>

        {/* 내용 */}
        <Card padding="lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            내용
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력하세요 (Markdown 지원)"
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            required
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Markdown 문법을 사용할 수 있습니다 (예: **굵게**, *기울임*, `코드`)
          </p>
        </Card>

        {/* 태그 */}
        <Card padding="lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            태그 (선택사항)
          </label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 문법, 시제, 현재완료)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? '작성 중...' : '게시하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
