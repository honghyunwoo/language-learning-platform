'use client';

import VocabularyActivity from './VocabularyActivity';
import ReadingActivity from './ReadingActivity';
import GrammarActivity from './GrammarActivity';
import ListeningActivity from './ListeningActivity';
import WritingActivity from './WritingActivity';
import SpeakingActivity from './SpeakingActivity';
import { useActivityData } from '@/hooks/useActivityData';

interface Activity {
  id: string;
  type: 'vocabulary' | 'reading' | 'grammar' | 'listening' | 'writing' | 'speaking';
  title: string;
  description: string;
  duration: number;
  difficulty: number;
  requiredForCompletion: boolean;
}

interface ActivityContentProps {
  activity: Activity;
  weekId: string;
}

export default function ActivityContent({
  activity,
  weekId,
}: ActivityContentProps) {
  const { data, isLoading, error } = useActivityData(activity.type, weekId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            학습 자료를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          학습 자료를 불러올 수 없습니다
        </h3>
        <p className="text-red-600 dark:text-red-500 text-sm">
          {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
        </p>
        <p className="text-red-500 dark:text-red-600 text-xs mt-2">
          이 활동의 데이터 파일이 아직 준비되지 않았을 수 있습니다.
        </p>
      </div>
    );
  }

  // Activity 타입별 라우팅
  switch (activity.type) {
    case 'vocabulary':
      return <VocabularyActivity data={data} />;

    case 'reading':
      return <ReadingActivity data={data} />;

    case 'grammar':
      return <GrammarActivity data={data} />;

    case 'listening':
      return <ListeningActivity data={data} />;

    case 'writing':
      return <WritingActivity data={data} />;

    case 'speaking':
      return <SpeakingActivity data={data} />;

    default:
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
            지원하지 않는 활동 타입
          </h3>
          <p className="text-gray-600 dark:text-gray-500">
            {activity.type} 활동은 아직 지원되지 않습니다.
          </p>
        </div>
      );
  }
}
