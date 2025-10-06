'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useJournalEntry,
  useUpdateJournalEntry,
  useCreateJournalEntry,
} from '@/hooks/useJournal';
import { Card, Button } from '@/components/ui';
import {
  ArrowLeftIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Mood, DifficultyRating } from '@/types/journal';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function JournalDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();

  const { data: entry, isLoading } = useJournalEntry(
    currentUser?.uid,
    resolvedParams.date
  );
  const updateMutation = useUpdateJournalEntry();
  const createMutation = useCreateJournalEntry();

  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(entry?.notes || '');
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood);
  const [difficulty, setDifficulty] = useState<DifficultyRating | undefined>(
    entry?.difficulty
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const handleSave = async () => {
    if (!currentUser) return;

    if (entry) {
      // 기존 일지 업데이트
      await updateMutation.mutateAsync({
        userId: currentUser.uid,
        date: resolvedParams.date,
        data: { notes, mood, difficulty },
      });
    } else {
      // 새 일지 생성
      await createMutation.mutateAsync({
        userId: currentUser.uid,
        data: {
          date: resolvedParams.date,
          notes,
          mood,
          difficulty,
        },
      });
    }

    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const totalActivities = entry?.completedActivities?.length || 0;
  const totalTime = entry?.learningTime || 0;

  return (
    <div className="space-y-6">
      {/* 뒤로 가기 */}
      <button
        onClick={() => router.push('/dashboard/journal')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>일지 목록으로</span>
      </button>

      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {formatDate(resolvedParams.date)}
        </h1>
        <Button
          variant={isEditing ? 'primary' : 'secondary'}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          loading={updateMutation.isPending || createMutation.isPending}
        >
          {isEditing ? '저장' : <><PencilIcon className="w-4 h-4 mr-2" />편집</>}
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">학습 시간</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(totalTime)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">완료 활동</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalActivities}개
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-2xl">
                {mood === 'great' && '😄'}
                {mood === 'good' && '🙂'}
                {mood === 'okay' && '😐'}
                {mood === 'bad' && '😞'}
                {!mood && '❓'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">기분</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {mood === 'great' && '매우 좋음'}
                {mood === 'good' && '좋음'}
                {mood === 'okay' && '보통'}
                {mood === 'bad' && '나쁨'}
                {!mood && '미기록'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 완료한 활동 목록 */}
      {entry && entry.completedActivities.length > 0 && (
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            완료한 활동
          </h2>
          <div className="space-y-3">
            {entry.completedActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {activity.activityTitle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.weekId}
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(activity.timeSpent)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 메모 */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          학습 메모
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="오늘 학습한 내용을 기록하세요..."
              className="w-full min-h-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  기분
                </label>
                <div className="flex gap-2">
                  {(['great', 'good', 'okay', 'bad'] as Mood[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`p-3 rounded-lg border-2 ${
                        mood === m
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">
                        {m === 'great' && '😄'}
                        {m === 'good' && '🙂'}
                        {m === 'okay' && '😐'}
                        {m === 'bad' && '😞'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  난이도
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d as DifficultyRating)}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        difficulty === d
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span className="font-semibold">{d}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {notes ? (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notes}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                메모가 없습니다. 편집 버튼을 눌러 메모를 추가하세요.
              </p>
            )}

            {difficulty && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  난이도: {'⭐'.repeat(difficulty)}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
