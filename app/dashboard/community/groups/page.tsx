'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudyGroups, useCommunityActions } from '@/hooks/useCommunity';
import {
  UserGroupIcon,
  PlusIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function StudyGroupsPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        </div>
        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-200 dark:border-purple-700 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        </div>
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

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                <span className="gradient-text">📚 스터디 그룹</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                함께 공부할 그룹을 찾아보세요
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              그룹 만들기
            </button>
          </div>
        </div>

        {/* 그룹 그리드 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up delay-100">
          {groups && groups.length > 0 ? (
            groups.map((group, index) => {
              const isMember = group.memberIds.includes(currentUser?.uid || '');
              const isFull = group.memberIds.length >= group.maxMembers;

              return (
                <div
                  key={group.id}
                  className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  {/* 그룹 이미지 */}
                  <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-blue-600 rounded-2xl mb-6 flex items-center justify-center shadow-xl">
                    <UserGroupIcon className="w-16 h-16 text-white" />
                  </div>

                  {/* 그룹 정보 */}
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-medium">
                    {group.description}
                  </p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-bold">
                      {group.level}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-xs font-bold">
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
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl">
                    <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span>{group.memberIds.length} / {group.maxMembers}명</span>
                    {isFull && (
                      <span className="text-red-600 dark:text-red-400 text-xs">(정원 마감)</span>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  {isMember ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl cursor-not-allowed opacity-75 flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      가입됨
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl font-bold shadow-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      정원 마감
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          가입 중...
                        </>
                      ) : (
                        <>
                          <UserGroupIcon className="w-5 h-5" />
                          가입하기
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="glass dark:glass-dark rounded-[2rem] p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 col-span-full animate-scale-in">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-[2rem] flex items-center justify-center shadow-xl">
                  <UserGroupIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                  아직 스터디 그룹이 없습니다
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  첫 번째 그룹을 만들어보세요!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 mx-auto"
                >
                  <PlusIcon className="w-5 h-5" />
                  그룹 만들기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 그룹 생성 모달 */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 max-w-md w-full animate-scale-in">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                새 스터디 그룹 만들기
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                그룹 생성 기능은 추후 구현 예정입니다.
              </p>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
