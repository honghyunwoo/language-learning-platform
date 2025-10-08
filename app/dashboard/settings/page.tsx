'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  UserCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ClockIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  useRouter(); // router는 향후 사용 예정
  const { currentUser, logout } = useAuth();

  const [dailyGoal, setDailyGoal] = useState<number>(currentUser?.dailyLearningTime || 30);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    community: false,
  });
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const handleSaveGoal = async () => {
    setIsSavingGoal(true);
    try {
      // Firebase에 저장 로직 (추후 구현)
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('일일 학습 목표가 저장되었습니다!');
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    try {
      // Firebase에 저장 로직 (추후 구현)
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('알림 설정이 저장되었습니다!');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('로그아웃하시겠습니까?')) {
      try {
        await logout();
      } catch (error) {
        console.error('로그아웃 실패:', error);
        alert('로그아웃에 실패했습니다.');
      }
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
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="gradient-text">⚙️ 설정</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            학습 환경을 맞춤 설정하세요
          </p>
        </div>

        {/* 계정 정보 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <UserCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            계정 정보
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                닉네임
              </label>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <UserCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  value={currentUser?.nickname || ''}
                  disabled
                  className="flex-1 bg-transparent text-lg font-medium text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                이메일
              </label>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="flex-1 bg-transparent text-lg font-medium text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                현재 레벨
              </label>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/50">
                <AcademicCapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <input
                  type="text"
                  value={currentUser?.level || 'A1'}
                  disabled
                  className="flex-1 bg-transparent text-lg font-bold text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 학습 목표 설정 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-200">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            학습 목표
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                일일 학습 시간 목표 (분)
              </label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${((dailyGoal - 10) / 110) * 100}%, rgb(229 231 235) ${((dailyGoal - 10) / 110) * 100}%, rgb(229 231 235) 100%)`
                  }}
                />
                <div className="w-24 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-black rounded-2xl text-center shadow-xl">
                  {dailyGoal}분
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                💡 매일 달성하고 싶은 학습 시간을 설정하세요
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGoal}
                disabled={isSavingGoal}
                className={`px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 ${
                  isSavingGoal
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-105 text-white'
                }`}
              >
                {isSavingGoal ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-300">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BellIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            알림 설정
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">일일 학습 리마인더</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  매일 정해진 시간에 학습 알림을 받습니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.dailyReminder}
                  onChange={(e) => setNotifications({ ...notifications, dailyReminder: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-xl"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">주간 학습 리포트</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  매주 학습 통계 요약을 받습니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReport}
                  onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-xl"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">성취 배지 알림</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  새로운 배지를 획득하면 알림을 받습니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.achievements}
                  onChange={(e) => setNotifications({ ...notifications, achievements: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-xl"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">커뮤니티 알림</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  게시물에 답변이 달리면 알림을 받습니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.community}
                  onChange={(e) => setNotifications({ ...notifications, community: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-xl"></div>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotifications}
                disabled={isSavingNotifications}
                className={`px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 ${
                  isSavingNotifications
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:scale-105 text-white'
                }`}
              >
                {isSavingNotifications ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-400">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            계정 관리
          </h3>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              로그아웃
            </button>

            <button
              onClick={() => alert('비밀번호 변경 기능은 추후 구현 예정입니다.')}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <KeyIcon className="w-5 h-5" />
              비밀번호 변경
            </button>

            <button
              onClick={() => {
                if (confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                  alert('계정 삭제 기능은 추후 구현 예정입니다.');
                }
              }}
              className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 text-white rounded-2xl font-bold shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
