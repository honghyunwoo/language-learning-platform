'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useListeningProgress } from '@/hooks/useListeningProgress';
import { Button } from '@/components/ui';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

interface ListeningActivityData {
  id: string;
  weekId: string;
  type: 'listening';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  audio: {
    text: string;
    speed: number;
    pausePoints?: number[];
  };

  dictation?: {
    targetSentences: string[];
  };

  questions: Array<{
    id: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    question: string;
    options?: string[];
    answer: string;
    explanation?: string;
  }>;
}

interface ListeningActivityProps {
  data: ListeningActivityData;
}

export default function ListeningActivity({ data }: ListeningActivityProps) {
  const [currentView, setCurrentView] = useState<'audio' | 'dictation' | 'questions'>('audio');
  const [playbackSpeed, setPlaybackSpeed] = useState(data.audio.speed);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [dictationText, setDictationText] = useState('');
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const { speak, isSpeaking, isSupported, pause } = useTTS({
    lang: 'en-US',
    rate: playbackSpeed,
  });

  // Progress Hook 통합
  const {
    completeActivity,
    incrementListenCount,
    isCompleted,
    listenCount: savedListenCount,
    comprehensionScore: savedScore,
  } = useListeningProgress(data.id, data.weekId);

  const currentQuestion = data.questions[currentQuestionIndex];
  const answeredCount = Object.keys(showResults).filter((id) => showResults[id]).length;
  const progress = {
    questions: (answeredCount / data.questions.length) * 100,
  };

  // 오디오 재생 + 듣기 횟수 증가
  const handlePlayAudio = () => {
    const textToSpeak = data.audio.text.replace(/\[PAUSE\]/g, '. . .');
    speak(textToSpeak);
    incrementListenCount(); // 듣기 횟수 증가
  };


  // 속도 변경
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    pause();
  };

  // 답안 제출
  const handleSubmitAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // 정답 확인
  const handleCheckAnswer = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  // 정답 여부
  const isCorrect = useCallback((question: typeof currentQuestion) => {
    const userAnswer = userAnswers[question.id];
    return userAnswer?.toLowerCase().trim() === question.answer.toLowerCase().trim();
  }, [userAnswers]);

  // 완료 조건 체크 및 Firestore 저장
  useEffect(() => {
    const allQuestionsAnswered =
      Object.keys(showResults).length === data.questions.length;

    // 완료 조건: 모든 문제 완료 + 최소 2회 이상 듣기
    if (allQuestionsAnswered && savedListenCount >= 2 && !isCompleted) {
      // 이해도 점수 계산
      let correctCount = 0;
      data.questions.forEach((q) => {
        if (isCorrect(q)) {
          correctCount++;
        }
      });
      const comprehensionScore = Math.round(
        (correctCount / data.questions.length) * 100
      );

      // Firestore 저장
      completeActivity(
        savedListenCount,
        false, // transcriptViewed - 미구현
        80, // dictationScore - 기본값 (dictation 기능 미구현)
        comprehensionScore,
        playbackSpeed
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
    savedListenCount,
    isCompleted,
    playbackSpeed,
    completeActivity,
    data.questions,
    isCorrect,
  ]);

  // 받아쓰기 확인
  const checkDictation = () => {
    if (!data.dictation) return [];

    const userWords = dictationText.toLowerCase().split(/\s+/).filter(w => w);
    const targetWords = data.dictation.targetSentences.join(' ').toLowerCase().split(/\s+/);

    return targetWords.map((word, i) => ({
      word,
      isCorrect: userWords[i]?.toLowerCase() === word.toLowerCase(),
      userWord: userWords[i] || '',
    }));
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
                  🎉 Listening Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  듣기 횟수: {savedListenCount}회 | 이해도: {savedScore}%
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
            onClick={() => setCurrentView('audio')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'audio'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            듣기
          </button>
          {data.dictation && (
            <button
              onClick={() => setCurrentView('dictation')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                currentView === 'dictation'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              받아쓰기
            </button>
          )}
          <button
            onClick={() => setCurrentView('questions')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              currentView === 'questions'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            이해도 문제 ({answeredCount}/{data.questions.length})
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

      {/* 듣기 뷰 */}
      {currentView === 'audio' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8">
            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={isSpeaking ? pause : handlePlayAudio}
                disabled={!isSupported}
                className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 transition-colors flex items-center justify-center shadow-lg"
              >
                {isSpeaking ? (
                  <PauseIcon className="w-10 h-10 text-white" />
                ) : (
                  <PlayIcon className="w-10 h-10 text-white ml-1" />
                )}
              </button>

              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {isSpeaking ? '재생 중...' : '듣기 시작'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  재생 버튼을 눌러 음성을 들어보세요
                </p>
              </div>

              {/* 속도 조절 */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">재생 속도:</span>
                {[0.5, 0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              듣기 팁
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 처음에는 느린 속도(0.5x)로 듣고, 점차 빠르게 들어보세요</li>
              <li>• 여러 번 반복해서 들으며 내용을 파악하세요</li>
              <li>• 받아쓰기와 이해도 문제를 풀어보세요</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={() => setCurrentView(data.dictation ? 'dictation' : 'questions')}>
              다음으로
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* 받아쓰기 뷰 */}
      {currentView === 'dictation' && data.dictation && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              들은 내용을 받아쓰세요
            </h3>

            <textarea
              value={dictationText}
              onChange={(e) => setDictationText(e.target.value)}
              placeholder="음성을 듣고 내용을 입력하세요..."
              rows={5}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-600 focus:outline-none resize-none"
            />

            {dictationText && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  확인 결과:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {checkDictation().map((item, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-sm ${
                        item.isCorrect
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {item.userWord || '_'}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                  정답: {data.dictation.targetSentences.join(' ')}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button onClick={() => setCurrentView('audio')} variant="secondary">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              듣기로 돌아가기
            </Button>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                문제 {currentQuestionIndex + 1} / {data.questions.length}
              </span>
              <span className="ml-3 text-sm font-semibold px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {currentQuestion.type === 'multiple_choice' && '객관식'}
                {currentQuestion.type === 'true_false' && '참/거짓'}
                {currentQuestion.type === 'short_answer' && '단답형'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {currentQuestion.question}
            </h3>

            {/* 객관식 & 참/거짓 */}
            {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const isAnswerShown = showResults[currentQuestion.id];
                  const isCorrectOption = option === currentQuestion.answer;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !isAnswerShown && handleSubmitAnswer(currentQuestion.id, option)
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
                        <span className="text-gray-900 dark:text-gray-100">{option}</span>
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
                    handleSubmitAnswer(currentQuestion.id, e.target.value)
                  }
                  disabled={showResults[currentQuestion.id]}
                  placeholder="답을 입력하세요"
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-600 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
                />
              </div>
            )}

            {/* 정답 확인 버튼 */}
            {!showResults[currentQuestion.id] && userAnswers[currentQuestion.id] && (
              <div className="mt-4">
                <Button onClick={() => handleCheckAnswer(currentQuestion.id)} variant="primary">
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
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 ml-7">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 문제 네비게이션 */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
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
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === data.questions.length - 1}
              variant="secondary"
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
