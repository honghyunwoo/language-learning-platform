'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePost, useReplies, useLike, useCommunityActions } from '@/hooks/useCommunity';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { timestampToDate } from '@/lib/utils';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { currentUser } = useAuth();
  const { data: post, isLoading: postLoading } = usePost(postId);
  const { data: replies, isLoading: repliesLoading, refresh: refreshReplies } = useReplies(postId);
  const { isLiked, toggleLike } = useLike(currentUser?.uid, postId, 'post');
  const { createReply, acceptReply, deleteReply, deletePost, isSubmitting } = useCommunityActions(
    currentUser?.uid,
    currentUser?.nickname,
    currentUser?.level
  );

  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await createReply({
        postId,
        content: replyContent.trim(),
      });
      setReplyContent('');
      setShowReplyForm(false);
      await refreshReplies();
    } catch (error) {
      console.error('답변 작성 실패:', error);
      alert('답변 작성에 실패했습니다.');
    }
  };

  const handleAcceptReply = async (replyId: string) => {
    if (!confirm('이 답변을 채택하시겠습니까?')) return;

    try {
      await acceptReply(postId, replyId);
      await refreshReplies();
    } catch (error) {
      console.error('답변 채택 실패:', error);
      alert('답변 채택에 실패했습니다.');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('답변을 삭제하시겠습니까?')) return;

    try {
      await deleteReply(postId, replyId);
      await refreshReplies();
    } catch (error) {
      console.error('답변 삭제 실패:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('게시물을 삭제하시겠습니까?')) return;

    try {
      await deletePost(postId);
      router.push('/dashboard/community');
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      alert('게시물 삭제에 실패했습니다.');
    }
  };

  const handleToggleLike = async () => {
    try {
      await toggleLike();
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  if (postLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <Card padding="lg">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">게시물을 찾을 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  const isAuthor = currentUser?.uid === post.authorId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 게시물 */}
      <Card padding="lg">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              post.type === 'question'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : post.type === 'tip'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
            }`}>
              {post.type === 'question' ? '질문' : post.type === 'tip' ? '팁' : '토론'}
            </div>
            {post.isResolved && (
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                해결됨
              </div>
            )}
          </div>
          {isAuthor && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeletePost}
              disabled={isSubmitting}
            >
              삭제
            </Button>
          )}
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {post.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium">{post.authorName}</span>
          {post.authorLevel && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              {post.authorLevel}
            </span>
          )}
          <span>•</span>
          <span>{timestampToDate(post.createdAt)?.toLocaleString('ko-KR')}</span>
          <span>•</span>
          <span>조회 {post.viewCount}</span>
        </div>

        {/* 내용 */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likes}</span>
          </button>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>답변하기</span>
          </button>
        </div>
      </Card>

      {/* 답변 작성 폼 */}
      {showReplyForm && (
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            답변 작성
          </h3>
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="답변을 입력하세요"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-4"
              required
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting || !replyContent.trim()}>
                {isSubmitting ? '작성 중...' : '답변 등록'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 답변 목록 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          답변 {post.replyCount}개
        </h3>

        {repliesLoading ? (
          <Card padding="lg">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </Card>
        ) : replies && replies.length > 0 ? (
          replies.map(reply => (
            <Card
              key={reply.id}
              padding="lg"
              className={reply.isAccepted ? 'border-2 border-green-500' : ''}
            >
              {reply.isAccepted && (
                <div className="mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">채택된 답변</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{reply.authorName}</span>
                  {reply.authorLevel && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                      {reply.authorLevel}
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {timestampToDate(reply.createdAt)?.toLocaleString('ko-KR')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAuthor && !reply.isAccepted && post.type === 'question' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAcceptReply(reply.id)}
                      disabled={isSubmitting}
                    >
                      채택
                    </Button>
                  )}
                  {currentUser?.uid === reply.authorId && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDeleteReply(reply.id)}
                      disabled={isSubmitting}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                {reply.content}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{reply.likes}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card padding="lg">
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
