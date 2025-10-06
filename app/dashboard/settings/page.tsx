'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const [dailyGoal, setDailyGoal] = useState<number>(currentUser?.dailyLearningTime || 30);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    community: false,
  });

  const handleSaveGoal = () => {
    // Firebase에 저장 로직 (추후 구현)
    alert('일일 학습 목표가 저장되었습니다!');
  };

  const handleSaveNotifications = () => {
    // Firebase에 저장 로직 (추후 구현)
    alert('알림 설정이 저장되었습니다!');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ⚙️ 설정
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          학습 환경을 맞춤 설정하세요
        </p>
      </div>

      {/* 계정 정보 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          계정 정보
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={currentUser?.nickname || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              현재 레벨
            </label>
            <input
              type="text"
              value={currentUser?.level || 'A1'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Card>

      {/* 학습 목표 설정 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          학습 목표
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              일일 학습 시간 목표 (분)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-20 text-right">
                {dailyGoal}분
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              매일 달성하고 싶은 학습 시간을 설정하세요
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveGoal}>
              저장
            </Button>
          </div>
        </div>
      </Card>

      {/* 알림 설정 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          알림 설정
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">일일 학습 리마인더</p>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">주간 학습 리포트</p>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">성취 배지 알림</p>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">커뮤니티 알림</p>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              저장
            </Button>
          </div>
        </div>
      </Card>

      {/* 계정 관리 */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          계정 관리
        </h3>
        <div className="space-y-4">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full"
          >
            로그아웃
          </Button>

          <Button
            variant="secondary"
            onClick={() => alert('비밀번호 변경 기능은 추후 구현 예정입니다.')}
            className="w-full"
          >
            비밀번호 변경
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              if (confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                alert('계정 삭제 기능은 추후 구현 예정입니다.');
              }
            }}
            className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            계정 삭제
          </Button>
        </div>
      </Card>
    </div>
  );
}
