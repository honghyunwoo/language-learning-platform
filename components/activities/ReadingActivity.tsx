'use client';

import { useState, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { Button } from '@/components/ui';
import {
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface ReadingPassage {
  text: string;
  wordCount: number;
  estimatedReadingTime: number;
  audioText?: string;
}

interface ReadingVocabulary {
  word: string;
  meaning: string;
  lineNumber?: number;
}

interface ReadingQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

interface ReadingActivityData {
  id: string;
  weekId: string;
  type: 'reading';
  level: string;
  title: string;
  description: string;
  passage: ReadingPassage;
  vocabulary: ReadingVocabulary[];
  questions: ReadingQuestion[];
}

interface ReadingActivityProps {
  data: ReadingActivityData;
}

export default function ReadingActivity({ data }: ReadingActivityProps) {
  const [currentView, setCurrentView] = useState<'passage' | 'questions'>('passage');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showVocabulary, setShowVocabulary] = useState(true);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [readingEndTime, setReadingEndTime] = useState<number | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const { speak, isSpeaking, isSupported } = useTTS({
    lang: 'en-US',
    rate: 0.7, // A1 레벨용 느린 속도
  });

  // Progress Hook 통합
  const {
    completeActivity,
    isCompleted,
    wpm: savedWpm,
    comprehensionScore: savedScore,
  } = useReadingProgress(data.id, data.weekId);

  // 지문 읽기 시작 시간 기록
  useEffect(() => {
    if (currentView === 'passage' && !readingStartTime) {
      setReadingStartTime(Date.now());
    }
  }, [currentView, readingStartTime]);

  const currentQuestion = data.questions[currentQuestionIndex];
  const answeredQuestionsCount = Object.keys(showResults).filter(
    (id) => showResults[id]
  ).length;

  const progress = {
    questions: (answeredQuestionsCount / data.questions.length) * 100,
  };

  // 문제 뷰로 전환 시 읽기 종료 시간 기록
  useEffect(() => {
    if (currentView === 'questions' && readingStartTime && !readingEndTime) {
      setReadingEndTime(Date.now());
    }
  }, [currentView, readingStartTime, readingEndTime]);

  // WPM 및 이해도 점수 계산 후 완료 처리
  useEffect(() => {
    const allQuestionsAnswered =
      Object.keys(showResults).length === data.questions.length;

    if (
      allQuestionsAnswered &&
      readingStartTime &&
      readingEndTime &&
      !isCompleted
    ) {
      // 읽기 시간 계산 (분 단위)
      const readingTimeInMinutes = (readingEndTime - readingStartTime) / 60000;

      // WPM 계산
      const calculatedWpm = Math.round(
        data.passage.wordCount / readingTimeInMinutes
      );

      // 이해도 점수 계산
      let correctAnswers = 0;
      data.questions.forEach((q) => {
        if (userAnswers[q.id] === q.answer) {
          correctAnswers++;
        }
      });
      const comprehensionScore = Math.round(
        (correctAnswers / data.questions.length) * 100
      );

      // Firestore에 저장
      completeActivity(
        Math.round(readingTimeInMinutes),
        calculatedWpm,
        comprehensionScore,
        data.questions.length,
        data.questions.length
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
    showResults,
    data.questions.length,
    data.passage.wordCount,
    readingStartTime,
    readingEndTime,
    isCompleted,
    userAnswers,
    completeActivity,
    data.questions,
  ]);

  // 지문 읽기
  const handleReadPassage = () => {
    if (data.passage.audioText) {
      const textToSpeak = data.passage.audioText.replace(/\[PAUSE\]/g, '. . .');
      speak(textToSpeak);
    } else {
      speak(data.passage.text);
    }
  };

  // 문제 답안 제출
  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // 정답 확인
  const handleCheckAnswer = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  // 이전/다음 문제
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isCorrect = (question: ReadingQuestion) => {
    const userAnswer = userAnswers[question.id];
    return userAnswer === question.answer;
  };

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
                  🎉 Reading Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  읽기 속도: {savedWpm} WPM | 이해도: {savedScore}%
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
            onClick={() => setCurrentView('passage')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'passage'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            지문 읽기
          </button>
          <button
            onClick={() => setCurrentView('questions')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'questions'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            이해도 문제 ({answeredQuestionsCount}/{data.questions.length})
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
            전체 진행률: {Math.round(progress.questions)}%
          </div>
        </div>
      </div>

      {/* 지문 읽기 뷰 */}
      {currentView === 'passage' && (
        <div className="space-y-6">
          {/* 지문 정보 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                단어 수: {data.passage.wordCount}개
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                예상 읽기 시간: 약 {data.passage.estimatedReadingTime}분
              </p>
            </div>
            <Button
              onClick={handleReadPassage}
              disabled={!isSupported || isSpeaking}
              variant="secondary"
              size="sm"
            >
              <SpeakerWaveIcon className="w-4 h-4 mr-2" />
              {isSpeaking ? '재생 중...' : '지문 듣기'}
            </Button>
          </div>

          {/* 지문 본문 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="prose dark:prose-invert max-w-none">
              {data.passage.text.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 어휘 도움말 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                주요 어휘
              </h3>
              <button
                onClick={() => setShowVocabulary(!showVocabulary)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showVocabulary ? '숨기기' : '보기'}
              </button>
            </div>
            {showVocabulary && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.vocabulary.map((vocab, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {vocab.word}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {vocab.meaning}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 다음 단계 버튼 */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => setCurrentView('questions')}>
              이해도 문제 풀기
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* 이해도 문제 뷰 */}
      {currentView === 'questions' && (
        <div className="space-y-6">
          {/* 문제 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                문제 {currentQuestionIndex + 1} / {data.questions.length}
              </span>
              <span className="ml-3 text-sm font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {currentQuestion.type === 'multiple_choice' && '객관식'}
                {currentQuestion.type === 'true_false' && '참/거짓'}
                {currentQuestion.type === 'short_answer' && '단답형'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {currentQuestion.question}
            </h3>

            {/* 객관식 & 참/거짓 */}
            {(currentQuestion.type === 'multiple_choice' ||
              currentQuestion.type === 'true_false') && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const isAnswerShown = showResults[currentQuestion.id];
                  const isCorrectOption = option === currentQuestion.answer;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !isAnswerShown &&
                        handleAnswerSubmit(currentQuestion.id, option)
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

            {/* 단답형 */}
            {currentQuestion.type === 'short_answer' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={(e) =>
                    !showResults[currentQuestion.id] &&
                    handleAnswerSubmit(currentQuestion.id, e.target.value)
                  }
                  disabled={showResults[currentQuestion.id]}
                  placeholder="답을 입력하세요"
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-600 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>
            )}

            {/* 정답 확인 버튼 */}
            {!showResults[currentQuestion.id] &&
              userAnswers[currentQuestion.id] && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleCheckAnswer(currentQuestion.id)}
                    variant="primary"
                  >
                    정답 확인
                  </Button>
                </div>
              )}

            {/* 결과 및 해설 */}
            {showResults[currentQuestion.id] && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isCorrect(currentQuestion)
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect(currentQuestion) ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCorrect(currentQuestion)
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}
                    >
                      {isCorrect(currentQuestion) ? '정답입니다!' : '오답입니다.'}
                    </p>
                    {!isCorrect(currentQuestion) && (
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        정답: {currentQuestion.answer}
                      </p>
                    )}
                  </div>
                </div>
                {currentQuestion.explanation && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 문제 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              variant="secondary"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              이전 문제
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentQuestionIndex + 1} / {data.questions.length}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === data.questions.length - 1}
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
              {data.questions.map((q, index) => {
                const isAnswered = showResults[q.id];
                const isCurrent = index === currentQuestionIndex;
                const isCorrectAnswer =
                  isAnswered && userAnswers[q.id] === q.answer;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
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

          {/* 지문으로 돌아가기 버튼 */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => setCurrentView('passage')} variant="secondary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              지문 다시 읽기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
