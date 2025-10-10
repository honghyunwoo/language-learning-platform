'use client';

import { useEffect, useState } from 'react';
import { Achievement } from '@/lib/gamification/achievements';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션 시작
    setTimeout(() => setIsVisible(true), 100);

    // 5초 후 자동 닫기
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // 애니메이션 완료 후 제거
  };

  const getTierGradient = () => {
    switch (achievement.tier) {
      case 'bronze':
        return 'from-orange-500 to-yellow-600';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-cyan-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTierName = () => {
    switch (achievement.tier) {
      case 'bronze':
        return '브론즈';
      case 'silver':
        return '실버';
      case 'gold':
        return '골드';
      case 'platinum':
        return '플래티넘';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-yellow-400 relative overflow-hidden">
        {/* Background glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getTierGradient()} opacity-10 animate-pulse`}></div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
              🎉 업적 달성!
            </div>
            <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${getTierGradient()} text-white text-xs font-bold mb-2`}>
              {getTierName()} 등급
            </div>
          </div>

          {/* Achievement Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getTierGradient()} flex items-center justify-center shadow-xl animate-bounce-in`}>
              <span className="text-5xl">{achievement.icon}</span>
            </div>
          </div>

          {/* Achievement Info */}
          <div className="text-center">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {achievement.description}
            </p>

            {/* Points */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <span className="text-2xl">🏆</span>
              <span className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                +{achievement.points} 포인트
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
