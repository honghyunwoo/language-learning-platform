'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useGrammarProgress } from '@/hooks/useGrammarProgress';
import { Button } from '@/components/ui';
import {
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface GrammarRule {
  id: string;
  rule: string;
  explanation: string;
  examples: Array<{
    sentence: string;
    translation: string;
  }>;
}

interface GrammarExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'sentence_ordering';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

interface GrammarActivityData {
  id: string;
  weekId: string;
  type: 'grammar';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;
  rules: GrammarRule[];
  exercises: GrammarExercise[];
}

interface GrammarActivityProps {
  data: GrammarActivityData;
}

export default function GrammarActivity({ data }: GrammarActivityProps) {
  const [currentView, setCurrentView] = useState<'rules' | 'exercises'>('rules');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const { speak, isSpeaking, isSupported } = useTTS({
    lang: 'en-US',
    rate: 0.7,
  });

  // Progress Hook 통합
  const {
    completeActivity,
    addWeakPoint,
    isCompleted,
    accuracy: savedAccuracy,
    weakPoints: savedWeakPoints,
  } = useGrammarProgress(data.id, data.weekId);

  const currentExercise = data.exercises[currentExerciseIndex];
  const answeredCount = Object.keys(showResults).filter((id) => showResults[id]).length;
  const progress = {
    exercises: (answeredCount / data.exercises.length) * 100,
  };

  // 예문 음성 재생
  const handleSpeakExample = (sentence: string) => {
    speak(sentence);
  };

  // 답안 제출
  const handleSubmitAnswer = (exerciseId: string, answer: string | string[]) => {
    setUserAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  // 정답 확인 + 취약점 추가
  const handleCheckAnswer = (exerciseId: string) => {
    setShowResults((prev) => ({ ...prev, [exerciseId]: true }));

    // 오답인 경우 취약 문법 포인트 추가
    const exercise = data.exercises.find((ex) => ex.id === exerciseId);
    if (exercise && !isCorrect(exercise)) {
      // 문제와 관련된 문법 규칙을 취약점으로 추가
      const relatedRule = data.rules[0]?.rule || exercise.question.substring(0, 30);
      addWeakPoint(relatedRule);
    }
  };

  // 정답 여부 확인
  const isCorrect = useCallback((exercise: GrammarExercise) => {
    const userAnswer = userAnswers[exercise.id];
    const correctAnswer = exercise.answer;

    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      return JSON.stringify(correctAnswer.sort()) === JSON.stringify(userAnswer.sort());
    }

    if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }

    return false;
  }, [userAnswers]);

  // 이전/다음 문제
  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < data.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  // 완료 조건 체크 및 Firestore 저장
  useEffect(() => {
    const allExercisesCompleted =
      Object.keys(showResults).length === data.exercises.length;

    if (allExercisesCompleted && !isCompleted) {
      // 정확도 계산
      let correctCount = 0;
      data.exercises.forEach((exercise) => {
        if (isCorrect(exercise)) {
          correctCount++;
        }
      });

      // 완료된 문제 수
      const completedExercises = data.exercises.length;

      // Firestore 저장
      completeActivity(
        completedExercises,
        data.exercises.length,
        correctCount,
        data.exercises.length,
        savedWeakPoints
      )
        .then(() => {
          setShowCompletionMessage(true);
          setTimeout(() => setShowCompletionMessage(false), 3000);
        })
        .catch((error) => {
          console.error('Progress save failed:', error);
        });
    }
  }, [showResults, data.exercises.length, isCompleted, completeActivity, data.exercises, isCorrect, savedWeakPoints]);

  return (
    <div className="space-y-6">
      {/* 완료 메시지 Toast */}
      {showCompletionMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Grammar Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  정확도: {savedAccuracy}%
                  {savedWeakPoints && savedWeakPoints.length > 0 &&
                    ` | 취약점: ${savedWeakPoints.length}개`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 및 진행률 */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('rules')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'rules'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            문법 설명
          </button>
          <button
            onClick={() => setCurrentView('exercises')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'exercises'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            연습 문제 ({answeredCount}/{data.exercises.length})
          </button>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">완료됨</span>
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            전체 진행률: {Math.round(progress.exercises)}%
          </div>
        </div>
      </div>

      {/* 문법 설명 뷰 */}
      {currentView === 'rules' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                학습 가이드
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                각 문법 규칙을 읽고 예문을 확인한 후, 연습 문제를 풀어보세요.
              </p>
            </div>
          </div>

          {data.rules.map((rule, index) => (
            <div
              key={rule.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {rule.rule}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-10">
                    {rule.explanation}
                  </p>
                </div>
              </div>

              <div className="ml-10 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  예문:
                </h4>
                {rule.examples.map((example, exIdx) => (
                  <div
                    key={exIdx}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-gray-900 dark:text-gray-100 flex-1">
                        {example.sentence}
                      </p>
                      <button
                        onClick={() => handleSpeakExample(example.sentence)}
                        disabled={!isSupported || isSpeaking}
                        className="ml-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
                      >
                        <SpeakerWaveIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {example.translation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <Button onClick={() => setCurrentView('exercises')}>
              연습 문제 풀기
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* 연습 문제 뷰 */}
      {currentView === 'exercises' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                문제 {currentExerciseIndex + 1} / {data.exercises.length}
              </span>
              <span className="ml-3 text-sm font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                {currentExercise.type === 'multiple_choice' && '객관식'}
                {currentExercise.type === 'fill_blank' && '빈칸 채우기'}
                {currentExercise.type === 'sentence_ordering' && '문장 배열'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {currentExercise.question}
            </h3>

            {/* 객관식 */}
            {currentExercise.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentExercise.options?.map((option, index) => {
                  const isSelected = userAnswers[currentExercise.id] === option;
                  const isAnswerShown = showResults[currentExercise.id];
                  const isCorrectOption = option === currentExercise.answer;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !isAnswerShown &&
                        handleSubmitAnswer(currentExercise.id, option)
                      }
                      disabled={isAnswerShown}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected && !isAnswerShown
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${
                        isAnswerShown && isCorrectOption
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                          : ''
                      } ${
                        isAnswerShown && isSelected && !isCorrectOption
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                          : ''
                      } ${!isAnswerShown ? 'hover:border-primary-400' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-gray-100">
                          {option}
                        </span>
                        {isAnswerShown && isCorrectOption && (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        )}
                        {isAnswerShown && isSelected && !isCorrectOption && (
                          <XCircleIcon className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 빈칸 채우기 */}
            {currentExercise.type === 'fill_blank' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={(userAnswers[currentExercise.id] as string) || ''}
                  onChange={(e) =>
                    !showResults[currentExercise.id] &&
                    handleSubmitAnswer(currentExercise.id, e.target.value)
                  }
                  disabled={showResults[currentExercise.id]}
                  placeholder="답을 입력하세요"
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-600 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>
            )}

            {/* 문장 배열 */}
            {currentExercise.type === 'sentence_ordering' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  올바른 순서로 단어를 배열하세요 (쉼표로 구분)
                </p>
                <input
                  type="text"
                  value={(userAnswers[currentExercise.id] as string) || ''}
                  onChange={(e) =>
                    !showResults[currentExercise.id] &&
                    handleSubmitAnswer(currentExercise.id, e.target.value.split(',').map(s => s.trim()))
                  }
                  disabled={showResults[currentExercise.id]}
                  placeholder="예: I, am, a, student"
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-600 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>
            )}

            {/* 정답 확인 버튼 */}
            {!showResults[currentExercise.id] &&
              userAnswers[currentExercise.id] && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleCheckAnswer(currentExercise.id)}
                    variant="primary"
                  >
                    정답 확인
                  </Button>
                </div>
              )}

            {/* 결과 및 해설 */}
            {showResults[currentExercise.id] && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isCorrect(currentExercise)
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect(currentExercise) ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCorrect(currentExercise)
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}
                    >
                      {isCorrect(currentExercise) ? '정답입니다!' : '오답입니다.'}
                    </p>
                    {!isCorrect(currentExercise) && (
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        정답:{' '}
                        {Array.isArray(currentExercise.answer)
                          ? currentExercise.answer.join(', ')
                          : currentExercise.answer}
                      </p>
                    )}
                  </div>
                </div>
                {currentExercise.explanation && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 ml-7">
                    {currentExercise.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 문제 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevExercise}
              disabled={currentExerciseIndex === 0}
              variant="secondary"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              이전 문제
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentExerciseIndex + 1} / {data.exercises.length}
            </div>

            <Button
              onClick={handleNextExercise}
              disabled={currentExerciseIndex === data.exercises.length - 1}
              variant="secondary"
            >
              다음 문제
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* 문제 목록 미니 그리드 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              모든 문제
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {data.exercises.map((ex, index) => {
                const isAnswered = showResults[ex.id];
                const isCurrent = index === currentExerciseIndex;
                const isCorrectAnswer = isAnswered && isCorrect(ex);

                return (
                  <button
                    key={ex.id}
                    onClick={() => setCurrentExerciseIndex(index)}
                    className={`p-2 rounded text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-primary-600 text-white'
                        : isAnswered
                        ? isCorrectAnswer
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 문법 설명으로 돌아가기 */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => setCurrentView('rules')} variant="secondary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              문법 설명 다시 보기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
