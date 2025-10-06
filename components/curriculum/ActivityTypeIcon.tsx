import {
  BookOpenIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  PencilIcon,
  LanguageIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { ActivityType } from '@/types/curriculum';

interface ActivityTypeIconProps {
  type: ActivityType;
  className?: string;
}

export default function ActivityTypeIcon({
  type,
  className = 'w-5 h-5',
}: ActivityTypeIconProps) {
  const icons = {
    reading: BookOpenIcon,
    listening: SpeakerWaveIcon,
    speaking: MicrophoneIcon,
    writing: PencilIcon,
    vocabulary: LanguageIcon,
    grammar: AcademicCapIcon,
  };

  const Icon = icons[type];

  return <Icon className={className} />;
}

export function getActivityTypeLabel(type: ActivityType): string {
  const labels = {
    reading: '읽기',
    listening: '듣기',
    speaking: '말하기',
    writing: '쓰기',
    vocabulary: '어휘',
    grammar: '문법',
  };

  return labels[type];
}

export function getActivityTypeColor(type: ActivityType): string {
  const colors = {
    reading: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    listening:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    speaking:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    writing:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    vocabulary: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    grammar: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  return colors[type];
}
