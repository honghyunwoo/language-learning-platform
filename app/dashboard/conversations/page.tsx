'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConversations, useConversationResults } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge, { LevelType } from '@/components/ui/Badge';
import type { Conversation } from '@/types/conversation';

export default function ConversationsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { data: conversations, isLoading } = useConversations();
  const { data: results } = useConversationResults();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  const levels = ['A1', 'A2', 'B1', 'B2'];

  // 완료한 대화 ID 집합
  const completedConversationIds = new Set(
    results?.map((r) => r.conversationId) || []
  );

  // 필터링된 대화
  const filteredConversations = selectedLevel
    ? conversations?.filter((c) => c.level === selectedLevel)
    : conversations;

  // 통계
  const completedCount = completedConversationIds.size;
  const practiceCount = results?.length || 0;
  const averageScore =
    results && results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        )
      : 0;

  // 대화 카드 컴포넌트
  const ConversationCard = ({ conversation }: { conversation: Conversation }) => {
    const isCompleted = completedConversationIds.has(conversation.id);
    const completionCount =
      results?.filter((r) => r.conversationId === conversation.id).length || 0;

    return (
      <Card
        padding="lg"
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => router.push(`/dashboard/conversations/${conversation.id}`)}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {conversation.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {conversation.description}
            </p>
          </div>
          {isCompleted && (
            <Badge variant="success" size="sm">
              ✓ 완료
            </Badge>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Badge variant="level" level={conversation.level as LevelType}>
            {conversation.level}
          </Badge>
          <span>⏱️ {conversation.estimatedTime}분</span>
          {completionCount > 0 && <span>🔄 {completionCount}회 연습</span>}
        </div>

        {/* 시나리오 정보 */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <div>
            <strong>상황:</strong> {conversation.scenario.situation}
          </div>
          <div>
            <strong>목표:</strong> {conversation.scenario.goal}
          </div>
        </div>

        {/* 학습 내용 */}
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <span>📝 어휘 {conversation.vocabulary.length}개</span>
          <span>💬 핵심 표현 {conversation.keyPhrases.length}개</span>
        </div>

        {/* 버튼 */}
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/conversations/${conversation.id}`);
          }}
        >
          {isCompleted ? '다시 연습하기' : '시작하기'}
        </Button>
      </Card>
    );
  };

  return (
    <>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          실전 회화 연습
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          실제 상황에서 사용하는 영어 대화를 연습하세요. 선택에 따라 대화가 달라지며, 즉각적인 피드백을 받을 수 있습니다.
        </p>
      </div>

      {/* 통계 */}
      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              완료한 대화
            </div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {completedCount}
            </div>
          </Card>
          <Card padding="md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              총 연습 횟수
            </div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {practiceCount}
            </div>
          </Card>
          <Card padding="md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              평균 점수
            </div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {averageScore}%
            </div>
          </Card>
        </div>
      )}

      {/* 레벨 필터 */}
      <div className="flex gap-2 mb-6">
        <Button
          size="sm"
          variant={selectedLevel === null ? 'primary' : 'ghost'}
          onClick={() => setSelectedLevel(null)}
        >
          전체
        </Button>
        {levels.map((level) => (
          <Button
            key={level}
            size="sm"
            variant={selectedLevel === level ? 'primary' : 'ghost'}
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </Button>
        ))}
      </div>

      {/* 대화 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredConversations && filteredConversations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredConversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              선택한 레벨의 대화가 없습니다.
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
