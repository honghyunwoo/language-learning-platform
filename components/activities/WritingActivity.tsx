'use client';

import { useState, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useWritingProgress } from '@/hooks/useWritingProgress';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface WritingPrompt {
  topic: string;
  description: string;
  requirements: string[];
  wordCount: { min: number; max: number };
  timeLimit?: number; // 분 단위
}

interface ExampleSentence {
  id: string;
  sentence: string;
  translation: string;
  useCase: string; // 언제 사용하면 좋은지
}

interface VocabularyHelp {
  word: string;
  translation: string;
  example: string;
}

interface WritingActivityData {
  id: string;
  weekId: string;
  type: 'writing';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;
  prompt: WritingPrompt;
  exampleSentences: ExampleSentence[];
  vocabularyHelp: VocabularyHelp[];
  evaluationChecklist: {
    category: string;
    items: string[];
  }[];
}

interface WritingActivityProps {
  data: WritingActivityData;
}

export default function WritingActivity({ data }: WritingActivityProps) {
  const { speak, pause, isSpeaking } = useTTS();
  const [currentView, setCurrentView] = useState<'prompt' | 'write' | 'evaluate'>('prompt');
  const [writingText, setWritingText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Progress Hook 통합
  const {
    completeActivity,
    saveDraft,
    saveSelfEvaluation,
    isCompleted,
  } = useWritingProgress(data.id, data.weekId);

  // 단어 수 계산
  useEffect(() => {
    const words = writingText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [writingText]);

  // 초안 자동 저장 (5초 debounce)
  useEffect(() => {
    if (writingText.length > 0) {
      const timer = setTimeout(() => {
        saveDraft(writingText, wordCount);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [writingText, wordCount, saveDraft]);

  // 타이머 기능
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWriting = () => {
    setCurrentView('write');
    setIsTimerRunning(true);
  };

  const handleFinishWriting = () => {
    setIsTimerRunning(false);
    setCurrentView('evaluate');
  };

  const handleCheckItem = (category: string, itemIndex: number) => {
    const key = `${category}-${itemIndex}`;
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
  };

  // 완료 조건 체크 및 Firestore 저장
  useEffect(() => {
    // 전체 체크리스트 항목 수 계산
    const totalItems = data.evaluationChecklist.reduce(
      (sum, category) => sum + category.items.length,
      0
    );
    const checkedCount = Object.values(checkedItems).filter((checked) => checked).length;

    // 완료 조건: 작성 완료 + 모든 체크리스트 확인 + 단어 수 조건 충족
    const meetsWordCount =
      wordCount >= data.prompt.wordCount.min &&
      wordCount <= data.prompt.wordCount.max;
    const allItemsChecked = checkedCount === totalItems && totalItems > 0;
    const hasWritten = writingText.trim().length > 0;

    if (hasWritten && meetsWordCount && allItemsChecked && !isCompleted) {
      // Self-evaluation 저장
      saveSelfEvaluation(checkedCount, totalItems);

      // Activity 완료 저장
      completeActivity(
        writingText,
        wordCount,
        timeElapsed,
        { checkedItems: checkedCount, totalItems }
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
    checkedItems,
    writingText,
    wordCount,
    data.evaluationChecklist,
    data.prompt.wordCount,
    isCompleted,
    saveSelfEvaluation,
    completeActivity,
    timeElapsed,
  ]);

  const getCheckedPercentage = () => {
    const totalItems = data.evaluationChecklist.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const handleSpeakSentence = (text: string) => {
    if (isSpeaking) {
      pause();
    } else {
      speak(text);
    }
  };

  const handleReset = () => {
    if (window.confirm('작성한 내용을 모두 지우고 다시 시작하시겠습니까?')) {
      setWritingText('');
      setWordCount(0);
      setTimeElapsed(0);
      setIsTimerRunning(false);
      setCheckedItems({});
      setCurrentView('prompt');
    }
  };

  const isWordCountValid =
    wordCount >= data.prompt.wordCount.min &&
    wordCount <= data.prompt.wordCount.max;

  const isTimeExceeded =
    data.prompt.timeLimit && timeElapsed > data.prompt.timeLimit * 60;

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
                  🎉 Writing Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  단어 수: {wordCount}개 | 자가평가 완료
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.title}
              </h2>
              {isCompleted && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">완료됨</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{data.description}</p>
          </div>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
            {data.level}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentView('prompt')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'prompt'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          📝 주제 확인
        </button>
        <button
          onClick={() => setCurrentView('write')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'write'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          ✍️ 작성하기
        </button>
        <button
          onClick={() => setCurrentView('evaluate')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'evaluate'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          ✅ 자가 평가
        </button>
      </div>

      {/* Prompt View */}
      {currentView === 'prompt' && (
        <div className="space-y-6">
          {/* Writing Prompt */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📋 작성 주제
            </h3>
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  {data.prompt.topic}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {data.prompt.description}
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                  ✅ 반드시 포함해야 할 내용:
                </h5>
                <ul className="space-y-2">
                  {data.prompt.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-purple-600 dark:text-purple-400 mt-1">
                        •
                      </span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📏 단어 수:</span>
                  <span>
                    {data.prompt.wordCount.min} ~ {data.prompt.wordCount.max} 단어
                  </span>
                </div>
                {data.prompt.timeLimit && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">⏰ 제한 시간:</span>
                    <span>{data.prompt.timeLimit}분</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleStartWriting}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              작성 시작하기 →
            </button>
          </div>

          {/* Example Sentences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              💡 예시 문장
            </h3>
            <div className="space-y-4">
              {data.exampleSentences.map((example) => (
                <div
                  key={example.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {example.sentence}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        {example.translation}
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 text-sm">
                        💬 {example.useCase}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSpeakSentence(example.sentence)}
                      className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      aria-label="문장 듣기"
                    >
                      {isSpeaking ? '⏸️' : '🔊'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vocabulary Help */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📚 유용한 단어/표현
            </h3>
            <div className="grid gap-3">
              {data.vocabularyHelp.map((vocab, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {vocab.word}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {vocab.translation}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    예: {vocab.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write View */}
      {currentView === 'write' && (
        <div className="space-y-6">
          {/* Writing Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">📏 단어 수:</span>
                  <span
                    className={`font-bold ${
                      isWordCountValid
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {wordCount} / {data.prompt.wordCount.min}-
                    {data.prompt.wordCount.max}
                  </span>
                </div>
                {data.prompt.timeLimit && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">⏰ 경과 시간:</span>
                    <span
                      className={`font-bold ${
                        isTimeExceeded
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {formatTime(timeElapsed)}
                      {data.prompt.timeLimit && ` / ${data.prompt.timeLimit}:00`}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                🔄 초기화
              </button>
            </div>
          </div>

          {/* Writing Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ✍️ 작성 영역
            </h3>
            <textarea
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              placeholder="여기에 글을 작성하세요..."
              className="w-full h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
                       resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {!isWordCountValid && wordCount > 0 && (
                  <p className="text-orange-600 dark:text-orange-400">
                    {wordCount < data.prompt.wordCount.min
                      ? `최소 ${data.prompt.wordCount.min - wordCount}단어 더 필요합니다.`
                      : `최대 단어 수를 ${wordCount - data.prompt.wordCount.max}단어 초과했습니다.`}
                  </p>
                )}
                {isTimeExceeded && (
                  <p className="text-red-600 dark:text-red-400">
                    ⚠️ 제한 시간을 초과했습니다.
                  </p>
                )}
              </div>

              <button
                onClick={handleFinishWriting}
                disabled={wordCount === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                작성 완료 →
              </button>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              📌 빠른 참고
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• {data.prompt.topic}</p>
              {data.prompt.requirements.slice(0, 2).map((req, i) => (
                <p key={i}>• {req}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Evaluate View */}
      {currentView === 'evaluate' && (
        <div className="space-y-6">
          {/* Your Writing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📄 내가 작성한 글
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {writingText || '작성한 글이 없습니다.'}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>📏 단어 수: {wordCount}</span>
              <span>⏰ 소요 시간: {formatTime(timeElapsed)}</span>
            </div>
          </div>

          {/* Evaluation Checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ✅ 자가 평가 체크리스트
              </h3>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {getCheckedPercentage()}% 완료
              </span>
            </div>

            <div className="space-y-6">
              {data.evaluationChecklist.map((category, catIndex) => (
                <div key={catIndex}>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => {
                      const key = `${category.category}-${itemIndex}`;
                      const isChecked = checkedItems[key] || false;

                      return (
                        <label
                          key={itemIndex}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleCheckItem(category.category, itemIndex)
                            }
                            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="flex-1 text-gray-700 dark:text-gray-300">
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {getCheckedPercentage() === 100 && (
              <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  🎉 모든 항목을 확인했습니다! 잘하셨어요!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('write')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← 수정하기
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              새로 작성하기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
