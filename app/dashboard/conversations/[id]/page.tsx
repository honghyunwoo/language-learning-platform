'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useConversationSession } from '@/hooks/useConversations';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConversationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();
  const {
    conversation,
    currentNode,
    score,
    maxScore,
    makeChoice,
    completeConversation,
    restartConversation,
    isCompleted,
    isSaving,
  } = useConversationSession(id);

  const [showFeedback, setShowFeedback] = useState<{
    type: 'excellent' | 'good' | 'needs-improvement';
    message: string;
    suggestion?: string;
    culturalNote?: string;
  } | null>(null);

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  if (!conversation || !currentNode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">대화를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 선택 처리
  const handleChoice = (optionId: string) => {
    const option = currentNode.options?.find(opt => opt.id === optionId);
    if (!option) return;

    // 피드백 표시
    setShowFeedback({
      type: option.feedback.type,
      message: option.feedback.message,
      suggestion: option.feedback.suggestion,
      culturalNote: option.feedback.culturalNote,
    });

    // 1.5초 후 다음으로 이동
    setTimeout(() => {
      setShowFeedback(null);
      makeChoice(optionId);
    }, 1500);
  };

  // 완료 처리
  const handleComplete = () => {
    completeConversation();
    // 결과 페이지로 이동 (또는 완료 모달 표시)
    setTimeout(() => {
      router.push('/dashboard/conversations');
    }, 2000);
  };

  // 캐릭터 찾기
  const getCharacter = (characterId: string) => {
    return conversation.characters.find(c => c.id === characterId);
  };

  // 진행률 계산
  const progress = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  // 피드백 색상
  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'excellent': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'good': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'needs-improvement': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/dashboard/conversations')}
          >
            ← 목록으로
          </Button>
          <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
            {conversation.level}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {conversation.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {conversation.scenario.location} • {conversation.scenario.situation}
        </p>
      </div>

      {/* 점수 및 진행률 */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">점수</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {score} / {maxScore > 0 ? maxScore : '?'}
            </div>
          </div>
          <div className="flex-1 mx-8">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">진행률</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={restartConversation}
            disabled={isSaving}
          >
            다시 시작
          </Button>
        </div>
      </Card>

      {/* 대화 영역 */}
      <div className="space-y-4">
        {/* 현재 대화 */}
        {!currentNode.isChoice && currentNode.text && (
          <Card padding="lg">
            <div className="flex items-start gap-4">
              {/* 캐릭터 아바타 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                  {getCharacter(currentNode.speaker)?.name.charAt(0) || '?'}
                </div>
              </div>

              {/* 대화 내용 */}
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {getCharacter(currentNode.speaker)?.name || 'Speaker'}
                </div>
                <div className="text-lg text-gray-800 dark:text-gray-200 mb-2">
                  {currentNode.text}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {currentNode.translation}
                </div>
                {currentNode.notes && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    💡 {currentNode.notes}
                  </div>
                )}
              </div>
            </div>

            {/* 계속 버튼 */}
            {!currentNode.isChoice && currentNode.nextNodeId && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => makeChoice('')}>
                  계속 →
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 선택지 */}
        {currentNode.isChoice && currentNode.options && (
          <Card padding="lg">
            <div className="mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                어떻게 대답하시겠어요?
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                선택에 따라 피드백과 점수가 달라집니다.
              </div>
            </div>

            <div className="space-y-3">
              {currentNode.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback !== null || isSaving}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {option.text}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.translation}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* 피드백 표시 */}
        {showFeedback && (
          <Card padding="lg" className={`border-2 ${getFeedbackColor(showFeedback.type)}`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {showFeedback.type === 'excellent' && '🎉'}
                {showFeedback.type === 'good' && '👍'}
                {showFeedback.type === 'needs-improvement' && '💡'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {showFeedback.type === 'excellent' && '훌륭합니다!'}
                  {showFeedback.type === 'good' && '좋아요!'}
                  {showFeedback.type === 'needs-improvement' && '개선이 필요해요'}
                </div>
                <div className="text-gray-700 dark:text-gray-300 mb-2">
                  {showFeedback.message}
                </div>
                {showFeedback.suggestion && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded mb-2">
                    <strong>더 나은 표현:</strong> {showFeedback.suggestion}
                  </div>
                )}
                {showFeedback.culturalNote && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded">
                    <strong>문화적 노트:</strong> {showFeedback.culturalNote}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* 완료 */}
        {isCompleted && currentNode.completionMessage && (
          <Card padding="lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🎊</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                대화 완료!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {currentNode.completionMessage}
              </p>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {score} / {maxScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  최종 점수: {progress}%
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/dashboard/conversations')}
                >
                  목록으로
                </Button>
                <Button onClick={handleComplete}>
                  결과 저장
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 학습 자료 (하단) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 어휘 */}
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📝 주요 어휘
          </h3>
          <div className="space-y-3">
            {conversation.vocabulary.slice(0, 5).map((vocab, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {vocab.word} <span className="text-sm text-gray-500">{vocab.pronunciation}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {vocab.meaning}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 핵심 표현 */}
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            💬 핵심 표현
          </h3>
          <div className="space-y-3">
            {conversation.keyPhrases.slice(0, 5).map((phrase, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {phrase.phrase}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {phrase.meaning}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
