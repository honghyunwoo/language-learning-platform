'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityActions } from '@/hooks/useCommunity';
import type { PostType, PostCategory } from '@/types/community';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

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

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'question':
        return QuestionMarkCircleIcon;
      case 'tip':
        return LightBulbIcon;
      case 'discussion':
        return ChatBubbleLeftRightIcon;
      default:
        return ChatBubbleLeftRightIcon;
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

      <div className="relative max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="gradient-text">✍️ 새 게시물 작성</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                학습 경험을 공유하고 다른 학습자들과 소통하세요
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              취소
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 게시물 타입 선택 */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
            <label className="block text-xl font-black text-gray-900 dark:text-white mb-6">
              게시물 타입
            </label>
            <div className="grid grid-cols-3 gap-4">
              {postTypes.map(pt => {
                const Icon = getTypeIcon(pt.value);
                const isActive = type === pt.value;
                return (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setType(pt.value)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      isActive
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-xl scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {pt.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-200">
            <label className="block text-xl font-black text-gray-900 dark:text-white mb-6">
              카테고리
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as PostCategory)}
              className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-lg font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-300">
            <label className="block text-xl font-black text-gray-900 dark:text-white mb-6">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-lg font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* 내용 */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-400">
            <label className="block text-xl font-black text-gray-900 dark:text-white mb-6">
              내용
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (Markdown 지원)"
              rows={12}
              className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
              required
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
              💡 Markdown 문법을 사용할 수 있습니다 (예: **굵게**, *기울임*, `코드`)
            </p>
          </div>

          {/* 태그 */}
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-500">
            <label className="block text-xl font-black text-gray-900 dark:text-white mb-6">
              태그 (선택사항)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 문법, 시제, 현재완료)"
              className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-lg font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4 animate-fade-in-up delay-600">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className={`px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 ${
                isSubmitting || !title.trim() || !content.trim()
                  ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  작성 중...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  게시하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
