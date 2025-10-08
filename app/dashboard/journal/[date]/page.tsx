'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useJournalEntry,
  useUpdateJournalEntry,
  useCreateJournalEntry,
} from '@/hooks/useJournal';
import {
  ArrowLeftIcon,
  ClockIcon,
  PencilIcon,
  CheckCircleIcon,
  BookmarkIcon,
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

  // entry가 로드되면 상태 업데이트
  useEffect(() => {
    if (entry) {
      setNotes(entry.notes || '');
      setMood(entry.mood);
      setDifficulty(entry.difficulty);
    }
  }, [entry]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
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

  const totalActivities = entry?.completedActivities?.length || 0;
  const totalTime = entry?.learningTime || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-400/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* 뒤로 가기 */}
        <button
          onClick={() => router.push('/dashboard/journal')}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-colors animate-fade-in-up"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>일지 목록으로</span>
        </button>

        {/* 날짜 헤더 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              <span className="gradient-text">📝 {formatDate(resolvedParams.date)}</span>
            </h1>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={updateMutation.isPending || createMutation.isPending}
              className={`px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 ${
                isEditing
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 text-white'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 text-white'
              } ${(updateMutation.isPending || createMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {updateMutation.isPending || createMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  저장 중...
                </>
              ) : isEditing ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  저장
                </>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5" />
                  편집
                </>
              )}
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-3 animate-fade-in-up delay-200">
          <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">학습 시간</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {formatTime(totalTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">완료 활동</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {totalActivities}개
                </p>
              </div>
            </div>
          </div>

          <div className="glass dark:glass-dark rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 hover:-translate-y-2 hover:shadow-3xl transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">
                  {mood === 'great' && '😄'}
                  {mood === 'good' && '🙂'}
                  {mood === 'okay' && '😐'}
                  {mood === 'bad' && '😞'}
                  {!mood && '❓'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">기분</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {mood === 'great' && '매우 좋음'}
                  {mood === 'good' && '좋음'}
                  {mood === 'okay' && '보통'}
                  {mood === 'bad' && '나쁨'}
                  {!mood && '미기록'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 완료한 활동 목록 */}
        {entry && entry.completedActivities.length > 0 && (
          <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-300">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookmarkIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              완료한 활동
            </h2>
            <div className="space-y-3">
              {entry.completedActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl hover:scale-102 hover:shadow-xl transition-all"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {activity.activityTitle}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {activity.weekId}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg">
                    {formatTime(activity.timeSpent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 메모 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 animate-fade-in-up delay-400">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            📝 학습 메모
          </h2>

          {isEditing ? (
            <div className="space-y-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="오늘 학습한 내용을 기록하세요..."
                className="w-full min-h-[200px] p-6 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                    기분
                  </label>
                  <div className="flex gap-3">
                    {(['great', 'good', 'okay', 'bad'] as Mood[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          mood === m
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 scale-110 shadow-xl'
                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                        }`}
                      >
                        <span className="text-3xl">
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
                  <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                    난이도
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d as DifficultyRating)}
                        className={`px-5 py-3 rounded-xl border-2 transition-all ${
                          difficulty === d
                            ? 'border-purple-500 bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-xl'
                            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:scale-105'
                        }`}
                      >
                        <span className="font-black text-lg">{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {notes ? (
                <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {notes}
                </p>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    메모가 없습니다. 편집 버튼을 눌러 메모를 추가하세요.
                  </p>
                </div>
              )}

              {difficulty && (
                <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>난이도:</span>
                    <span className="text-2xl">{'⭐'.repeat(difficulty)}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
