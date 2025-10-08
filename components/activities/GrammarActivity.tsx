'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGrammarProgress } from '@/hooks/useGrammarProgress';
import { Button } from '@/components/ui';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

interface GrammarRule {
  id: string;
  title: string;
  description: string;
  examples: {
    sentence: string;
    explanation: string;
  }[];
  commonMistakes?: {
    mistake: string;
    correction: string;
    explanation: string;
  }[];
}

interface GrammarExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'sentence_construction';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  hints?: string[];
}

interface GrammarActivityData {
  id: string;
  weekId: string;
  type: 'grammar';
  level: string;
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
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Progress Hook 통합
  const {
    completeActivity,
    isCompleted,
  } = useGrammarProgress(data.id, data.weekId);

  const currentRule = data.rules[currentRuleIndex];
  const currentExercise = data.exercises[currentExerciseIndex];

  // 연습 문제 답안 제출
  const handleSubmitAnswer = (exerciseId: string) => {
    setShowResults({ ...showResults, [exerciseId]: true });
  };

  // 힌트 토글
  const toggleHint = (exerciseId: string) => {
    setShowHints({ ...showHints, [exerciseId]: !showHints[exerciseId] });
  };

  // 진행률 계산
  const progress = {
    rules: ((currentRuleIndex + 1) / data.rules.length) * 100,
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
        const isCorrect = exercise.answer.toLowerCase() === userAnswer?.toLowerCase();
        if (isCorrect) correctAnswers++;
      }
    });

    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  }, [showResults, userAnswers, data.exercises]);

  // 완료 조건 체크 및 Firestore 저장
  useEffect(() => {
    const allRulesViewed = currentRuleIndex === data.rules.length - 1;
    const allExercisesCompleted =
      Object.keys(showResults).length === data.exercises.length;

    if (allRulesViewed && allExercisesCompleted && !isCompleted) {
      const quizScore = calculateQuizScore();
      const totalExercises = data.exercises.length;

      // Firestore에 진행률 저장
      completeActivity(
        totalExercises,  // exercisesCompleted
        totalExercises,  // totalExercises
        quizScore,       // correctAnswers
        totalExercises,  // totalAttempts
        []               // weakPoints (empty for now)
      )
        .then(() => {
          setShowCompletionMessage(true);
          setTimeout(() => setShowCompletionMessage(false), 3000);
        })
        .catch((error) => {
          console.error('Progress save failed:', error);
        });
    }
  }, [
    currentRuleIndex,
    showResults,
    data.rules.length,
    data.exercises.length,
    isCompleted,
    completeActivity,
    calculateQuizScore,
  ]);

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
                  진행률이 저장되었습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 헤더: 뷰 전환 및 진행률 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'rules' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('rules')}
          >
            문법 학습 ({currentRuleIndex + 1}/{data.rules.length})
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
            {Math.round((progress.rules + progress.exercises) / 2)}%
          </div>
        </div>
      </div>

      {/* 문법 학습 뷰 */}
      {currentView === 'rules' && (
        <div className="space-y-6">
          {/* 문법 규칙 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="space-y-6">
              {/* 문법 규칙 헤더 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      문법 포인트 {currentRuleIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {currentRule.title}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentRule.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 예시 문장들 */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  예시 문장
                </h4>
                {currentRule.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500"
                  >
                    <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">
                      {example.sentence}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* 흔한 실수들 */}
              {currentRule.commonMistakes && currentRule.commonMistakes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    흔한 실수
                  </h4>
                  {currentRule.commonMistakes.map((mistake, index) => (
                    <div
                      key={index}
                      className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                            ❌ {mistake.mistake}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                            ✅ {mistake.correction}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mistake.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentRuleIndex(Math.max(0, currentRuleIndex - 1))
              }
              disabled={currentRuleIndex === 0}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              이전 규칙
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentRuleIndex + 1} / {data.rules.length}
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setCurrentRuleIndex(
                  Math.min(data.rules.length - 1, currentRuleIndex + 1)
                )
              }
              disabled={currentRuleIndex === data.rules.length - 1}
            >
              다음 규칙
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* 규칙 목록 (미니) */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">모든 문법 포인트</h4>
            <div className="grid grid-cols-4 gap-2">
              {data.rules.map((rule, index) => (
                <button
                  key={rule.id}
                  onClick={() => setCurrentRuleIndex(index)}
                  className={`p-2 rounded text-sm transition-colors ${
                    index === currentRuleIndex
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {index + 1}. {rule.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 연습 문제 뷰 */}
      {currentView === 'exercises' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
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
                    {currentExercise.type === 'sentence_construction' && '문장 만들기'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentExercise.question}
                </h3>
              </div>

              {/* 힌트 */}
              {currentExercise.hints && currentExercise.hints.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                  <button
                    onClick={() => toggleHint(currentExercise.id)}
                    className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 font-medium"
                  >
                    <LightBulbIcon className="w-5 h-5" />
                    힌트 보기
                  </button>
                  {showHints[currentExercise.id] && (
                    <div className="mt-2 space-y-1">
                      {currentExercise.hints.map((hint, index) => (
                        <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                          • {hint}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                            {currentExercise.answer === option && (
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            )}
                            {userAnswers[currentExercise.id] === option &&
                              currentExercise.answer !== option && (
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

              {currentExercise.type === 'sentence_construction' && (
                <div>
                  <textarea
                    value={userAnswers[currentExercise.id] || ''}
                    onChange={(e) =>
                      setUserAnswers({
                        ...userAnswers,
                        [currentExercise.id]: e.target.value,
                      })
                    }
                    disabled={showResults[currentExercise.id]}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800 min-h-[100px]"
                    placeholder="문장을 작성하세요"
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
                    currentExercise.answer.toLowerCase() ===
                    userAnswers[currentExercise.id]?.toLowerCase()
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {currentExercise.answer.toLowerCase() ===
                    userAnswers[currentExercise.id]?.toLowerCase() ? (
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
          </div>

          {/* 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))
              }
              disabled={currentExerciseIndex === 0}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
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
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}