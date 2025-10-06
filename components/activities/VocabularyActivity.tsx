'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card } from '@/components/ui';
import { useTTS } from '@/hooks/useTTS';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import {
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookmarkIcon as BookmarkIconOutline,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
}

interface VocabularyExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

interface VocabularyActivityData {
  id: string;
  weekId: string;
  type: string;
  level: string;
  title: string;
  description: string;
  words: VocabularyWord[];
  exercises: VocabularyExercise[];
}

interface VocabularyActivityProps {
  data: VocabularyActivityData;
}

export default function VocabularyActivity({ data }: VocabularyActivityProps) {
  const [currentView, setCurrentView] = useState<'words' | 'exercises'>('words');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const { speak, isSpeaking, isSupported } = useTTS({
    lang: 'en-US',
    rate: 0.6, // A1 레벨용 느린 속도
  });

  // Progress Hook 통합
  const {
    completeActivity,
    isCompleted,
  } = useVocabularyProgress(data.id, data.weekId);

  const currentWord = data.words[currentWordIndex];
  const currentExercise = data.exercises[currentExerciseIndex];

  // 단어 마스터 토글
  const toggleMastered = (wordId: string) => {
    const newMastered = new Set(masteredWords);
    if (newMastered.has(wordId)) {
      newMastered.delete(wordId);
    } else {
      newMastered.add(wordId);
    }
    setMasteredWords(newMastered);
  };

  // 단어 발음 듣기
  const handleSpeak = (text: string) => {
    speak(text);
  };

  // 연습 문제 답안 제출
  const handleSubmitAnswer = (exerciseId: string) => {
    setShowResults({ ...showResults, [exerciseId]: true });
  };

  // 진행률 계산
  const progress = {
    words: (masteredWords.size / data.words.length) * 100,
    exercises:
      (Object.keys(showResults).filter(
        (id) => showResults[id]
      ).length /
        data.exercises.length) *
      100,
  };

  // 퀴즈 점수 계산
  const calculateQuizScore = useCallback((): number => {
    let correctAnswers = 0;
    const totalQuestions = data.exercises.length;

    data.exercises.forEach((exercise) => {
      if (showResults[exercise.id]) {
        const userAnswer = userAnswers[exercise.id];
        const isCorrect = Array.isArray(exercise.answer)
          ? exercise.answer.some(
              (ans) => ans.toLowerCase() === userAnswer?.toLowerCase()
            )
          : exercise.answer.toLowerCase() === userAnswer?.toLowerCase();

        if (isCorrect) correctAnswers++;
      }
    });

    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  }, [data.exercises, showResults, userAnswers]);

  // 완료 조건 체크 및 Firestore 저장
  useEffect(() => {
    const allWordsMastered = masteredWords.size === data.words.length;
    const allExercisesCompleted =
      Object.keys(showResults).length === data.exercises.length;

    if (allWordsMastered && allExercisesCompleted && !isCompleted) {
      const quizScore = calculateQuizScore();

      // Firestore에 진행률 저장
      completeActivity(
        masteredWords.size,
        data.words.length,
        quizScore
      )
        .then(() => {
          setShowCompletionMessage(true);
          // 3초 후 완료 메시지 숨김
          setTimeout(() => setShowCompletionMessage(false), 3000);
        })
        .catch((error) => {
          console.error('Progress save failed:', error);
        });
    }
  }, [
    masteredWords,
    showResults,
    data.words.length,
    data.exercises.length,
    isCompleted,
    completeActivity,
    calculateQuizScore,
  ]);

  return (
    <div className="space-y-6">
      {/* 완료 메시지 (Toast) */}
      {showCompletionMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Card padding="md" className="bg-green-50 dark:bg-green-900/30 border-2 border-green-500">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Vocabulary Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  진행률이 저장되었습니다.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 헤더: 뷰 전환 및 진행률 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'words' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('words')}
          >
            단어 학습 ({masteredWords.size}/{data.words.length})
          </Button>
          <Button
            variant={currentView === 'exercises' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('exercises')}
          >
            연습 문제 ({Object.keys(showResults).length}/{data.exercises.length})
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">완료됨</span>
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            전체 진행률:{' '}
            {Math.round((progress.words + progress.exercises) / 2)}%
          </div>
        </div>
      </div>

      {/* 단어 학습 뷰 */}
      {currentView === 'words' && (
        <div className="space-y-6">
          {/* 단어 카드 */}
          <Card padding="lg">
            <div className="space-y-6">
              {/* 단어 헤더 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {currentWord.word}
                    </h3>
                    <button
                      onClick={() => handleSpeak(currentWord.word)}
                      disabled={!isSupported || isSpeaking}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                      title="발음 듣기"
                    >
                      <SpeakerWaveIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
                    {currentWord.pronunciation}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {currentWord.partOfSpeech}
                  </p>
                </div>

                {/* 북마크 버튼 */}
                <button
                  onClick={() => toggleMastered(currentWord.id)}
                  className="p-2"
                  title={masteredWords.has(currentWord.id) ? '마스터 취소' : '마스터 표시'}
                >
                  {masteredWords.has(currentWord.id) ? (
                    <BookmarkIconSolid className="w-6 h-6 text-primary-600" />
                  ) : (
                    <BookmarkIconOutline className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* 뜻 */}
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentWord.meaning}
                </p>
              </div>

              {/* 예문 */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-gray-900 dark:text-gray-100">
                    {currentWord.example}
                  </p>
                  <button
                    onClick={() => handleSpeak(currentWord.example)}
                    disabled={!isSupported || isSpeaking}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentWord.exampleMeaning}
                </p>
              </div>
            </div>
          </Card>

          {/* 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentWordIndex(Math.max(0, currentWordIndex - 1))
              }
              disabled={currentWordIndex === 0}
            >
              이전 단어
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentWordIndex + 1} / {data.words.length}
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setCurrentWordIndex(
                  Math.min(data.words.length - 1, currentWordIndex + 1)
                )
              }
              disabled={currentWordIndex === data.words.length - 1}
            >
              다음 단어
            </Button>
          </div>

          {/* 단어 목록 (미니) */}
          <Card padding="md">
            <h4 className="text-sm font-semibold mb-3">모든 단어</h4>
            <div className="grid grid-cols-4 gap-2">
              {data.words.map((word, index) => (
                <button
                  key={word.id}
                  onClick={() => setCurrentWordIndex(index)}
                  className={`p-2 rounded text-sm transition-colors ${
                    index === currentWordIndex
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{word.word}</span>
                    {masteredWords.has(word.id) && (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 연습 문제 뷰 */}
      {currentView === 'exercises' && (
        <div className="space-y-6">
          <Card padding="lg">
            <div className="space-y-6">
              {/* 문제 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                    문제 {currentExerciseIndex + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentExercise.type === 'multiple_choice' && '객관식'}
                    {currentExercise.type === 'fill_blank' && '빈칸 채우기'}
                    {currentExercise.type === 'matching' && '짝짓기'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentExercise.question}
                </h3>
              </div>

              {/* 답안 입력 */}
              {currentExercise.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {currentExercise.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setUserAnswers({
                          ...userAnswers,
                          [currentExercise.id]: option,
                        })
                      }
                      disabled={showResults[currentExercise.id]}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        userAnswers[currentExercise.id] === option
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${
                        showResults[currentExercise.id] ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResults[currentExercise.id] && (
                          <>
                            {(Array.isArray(currentExercise.answer)
                              ? currentExercise.answer.includes(option)
                              : currentExercise.answer === option) && (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            )}
                            {userAnswers[currentExercise.id] === option &&
                              !(Array.isArray(currentExercise.answer)
                                ? currentExercise.answer.includes(option)
                                : currentExercise.answer === option) && (
                                <XCircleIcon className="w-5 h-5 text-red-600" />
                              )}
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentExercise.type === 'fill_blank' && (
                <div>
                  <input
                    type="text"
                    value={userAnswers[currentExercise.id] || ''}
                    onChange={(e) =>
                      setUserAnswers({
                        ...userAnswers,
                        [currentExercise.id]: e.target.value,
                      })
                    }
                    disabled={showResults[currentExercise.id]}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800"
                    placeholder="답을 입력하세요"
                  />
                </div>
              )}

              {/* 제출 버튼 */}
              {!showResults[currentExercise.id] && (
                <Button
                  onClick={() => handleSubmitAnswer(currentExercise.id)}
                  disabled={!userAnswers[currentExercise.id]}
                  variant="primary"
                  className="w-full"
                >
                  정답 확인
                </Button>
              )}

              {/* 결과 및 해설 */}
              {showResults[currentExercise.id] && (
                <div
                  className={`p-4 rounded-lg ${
                    (Array.isArray(currentExercise.answer)
                      ? currentExercise.answer.some(
                          (ans) =>
                            ans.toLowerCase() ===
                            userAnswers[currentExercise.id]?.toLowerCase()
                        )
                      : currentExercise.answer.toLowerCase() ===
                        userAnswers[currentExercise.id]?.toLowerCase())
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {(Array.isArray(currentExercise.answer)
                      ? currentExercise.answer.some(
                          (ans) =>
                            ans.toLowerCase() ===
                            userAnswers[currentExercise.id]?.toLowerCase()
                        )
                      : currentExercise.answer.toLowerCase() ===
                        userAnswers[currentExercise.id]?.toLowerCase()) ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          정답입니다!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-700 dark:text-red-400">
                          틀렸습니다.
                        </span>
                      </>
                    )}
                  </div>
                  {currentExercise.explanation && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {currentExercise.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))
              }
              disabled={currentExerciseIndex === 0}
            >
              이전 문제
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentExerciseIndex + 1} / {data.exercises.length}
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setCurrentExerciseIndex(
                  Math.min(data.exercises.length - 1, currentExerciseIndex + 1)
                )
              }
              disabled={currentExerciseIndex === data.exercises.length - 1}
            >
              다음 문제
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
