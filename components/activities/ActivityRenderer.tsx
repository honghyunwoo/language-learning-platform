/**
 * Activity Renderer - 타입에 따라 적절한 컴포넌트 렌더링
 */

import { UploadedActivity } from '@/lib/types/uploaded-activity';
import VocabularyActivityView from './VocabularyActivityView';
import GrammarActivityView from './GrammarActivityView';
import ListeningActivityView from './ListeningActivityView';
import SpeakingActivityView from './SpeakingActivityView';
import ReadingActivityView from './ReadingActivityView';
import WritingActivityView from './WritingActivityView';

interface Props {
  activity: UploadedActivity;
  onComplete?: (score: number) => void;
}

export default function ActivityRenderer({ activity, onComplete }: Props) {
  switch (activity.type) {
    case 'vocabulary':
      return <VocabularyActivityView activity={activity} onComplete={onComplete} />;

    case 'grammar':
      return <GrammarActivityView activity={activity} onComplete={onComplete} />;

    case 'listening':
      return <ListeningActivityView activity={activity} onComplete={onComplete} />;

    case 'speaking':
      return <SpeakingActivityView activity={activity} onComplete={onComplete} />;

    case 'reading':
      return <ReadingActivityView activity={activity} onComplete={onComplete} />;

    case 'writing':
      return <WritingActivityView activity={activity} onComplete={onComplete} />;

    default:
      return <PlaceholderView activity={activity} message="Unknown Activity Type" />;
  }
}

// 임시 Placeholder 컴포넌트
function PlaceholderView({ activity, message }: { activity: UploadedActivity; message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="px-3 py-1 bg-gray-200 rounded-full">{activity.level}</span>
          <span>Week {activity.week}</span>
          <span>{activity.estimatedTime}분</span>
        </div>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm text-left">
          <h3 className="font-semibold text-gray-900 mb-3">학습 목표:</h3>
          <ul className="space-y-2">
            {activity.objectives.map((obj, idx) => (
              <li key={idx} className="text-gray-700 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
