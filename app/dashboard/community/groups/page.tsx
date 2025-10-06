'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useStudyGroups, useCommunityActions } from '@/hooks/useCommunity';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import type { DifficultyLevel, PostCategory } from '@/types/community';

export default function StudyGroupsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { data: groups, isLoading, refresh } = useStudyGroups(50);
  const { joinGroup, isSubmitting } = useCommunityActions(
    currentUser?.uid,
    currentUser?.nickname,
    currentUser?.level
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleJoinGroup = async (groupId: string) => {
    try {
      await joinGroup(groupId);
      await refresh();
      alert('그룹에 가입했습니다!');
    } catch (error: unknown) {
      console.error('그룹 가입 실패:', error);
      alert(error instanceof Error ? error.message : '그룹 가입에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
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
            📚 스터디 그룹
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            함께 공부할 그룹을 찾아보세요
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          그룹 만들기
        </Button>
      </div>

      {/* 그룹 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups && groups.length > 0 ? (
          groups.map(group => {
            const isMember = group.memberIds.includes(currentUser?.uid || '');
            const isFull = group.memberIds.length >= group.maxMembers;

            return (
              <Card key={group.id} padding="lg" hover>
                {/* 그룹 이미지 */}
                <div className="w-full h-32 bg-gradient-to-br from-primary-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>

                {/* 그룹 정보 */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {group.description}
                </p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                    {group.level}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                    {group.category === 'grammar' ? '문법' :
                     group.category === 'vocabulary' ? '어휘' :
                     group.category === 'listening' ? '듣기' :
                     group.category === 'speaking' ? '말하기' :
                     group.category === 'reading' ? '읽기' :
                     group.category === 'writing' ? '쓰기' :
                     group.category === 'study-tips' ? '학습 팁' : '일반'}
                  </span>
                </div>

                {/* 멤버 수 */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{group.memberIds.length} / {group.maxMembers}명</span>
                  {isFull && (
                    <span className="text-red-600 dark:text-red-400 text-xs">(정원 마감)</span>
                  )}
                </div>

                {/* 액션 버튼 */}
                {isMember ? (
                  <Button variant="secondary" className="w-full" disabled>
                    가입됨
                  </Button>
                ) : isFull ? (
                  <Button variant="secondary" className="w-full" disabled>
                    정원 마감
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={isSubmitting}
                  >
                    가입하기
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
          <Card padding="lg" className="col-span-full">
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                아직 스터디 그룹이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                첫 번째 그룹을 만들어보세요!
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                그룹 만들기
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 그룹 생성 모달 (간단 구현) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              새 스터디 그룹 만들기
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              그룹 생성 기능은 추후 구현 예정입니다.
            </p>
            <Button onClick={() => setShowCreateForm(false)}>
              닫기
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
