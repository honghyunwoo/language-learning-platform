'use client';

import { useState, useRef, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useSpeakingProgress } from '@/hooks/useSpeakingProgress';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Sentence {
  id: string;
  text: string;
  translation: string;
  tips?: string;
}

interface SpeakingActivityData {
  id: string;
  weekId: string;
  type: 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;
  sentences: Sentence[];
  evaluationChecklist: {
    category: string;
    items: string[];
  }[];
}

interface SpeakingActivityProps {
  data: SpeakingActivityData;
}

export default function SpeakingActivity({ data }: SpeakingActivityProps) {
  const { speak, pause, isSpeaking } = useTTS();
  const [currentView, setCurrentView] = useState<'learn' | 'practice' | 'evaluate'>('learn');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<{ [key: string]: string }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Progress Hook 통합
  const {
    completeActivity,
    incrementRecordingsCompleted,
    incrementAttempts,
    isCompleted,
  } = useSpeakingProgress(data.id, data.weekId);

  const currentSentence = data.sentences[currentSentenceIndex];

  // 문장 듣기
  const handlePlaySentence = (text: string) => {
    if (isSpeaking) {
      pause();
    } else {
      speak(text);
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordings({
          ...recordings,
          [currentSentence.id]: url,
        });

        // 녹음 완료 횟수 증가
        incrementRecordingsCompleted();
        incrementAttempts();

        // 스트림 종료
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 녹음 재생
  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // 녹음 삭제
  const deleteRecording = (sentenceId: string) => {
    const newRecordings = { ...recordings };
    delete newRecordings[sentenceId];
    setRecordings(newRecordings);
    if (currentSentence.id === sentenceId) {
      setAudioURL(null);
    }
  };

  // 다음 문장
  const handleNext = () => {
    if (currentSentenceIndex < data.sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setAudioURL(recordings[data.sentences[currentSentenceIndex + 1].id] || null);
    }
  };

  // 이전 문장
  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setAudioURL(recordings[data.sentences[currentSentenceIndex - 1].id] || null);
    }
  };

  // 체크리스트 항목 토글
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

    // 완료 조건: 모든 문장 1회 이상 녹음 + 모든 체크리스트 확인
    const allSentencesRecorded = Object.keys(recordings).length === data.sentences.length;
    const allItemsChecked = checkedCount === totalItems && totalItems > 0;

    if (allSentencesRecorded && allItemsChecked && !isCompleted) {
      // Self-evaluation 결과 저장
      const selfEvaluationResult = {
        checkedItems: checkedCount,
        totalItems,
      };

      // Activity 완료 저장
      completeActivity(
        Object.keys(recordings).length,
        data.sentences.length,
        0, // recordingDuration - 실제 시간 측정 미구현
        Object.keys(recordings).length, // attempts
        selfEvaluationResult
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
    recordings,
    checkedItems,
    data.sentences.length,
    data.evaluationChecklist,
    isCompleted,
    completeActivity,
  ]);

  // 체크리스트 완료 비율
  const getCheckedPercentage = () => {
    const totalItems = data.evaluationChecklist.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
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
                  🎉 Speaking Activity 완료!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  녹음 완료: {Object.keys(recordings).length}/{data.sentences.length}개 | 자가평가 완료
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
          <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full text-sm font-medium">
            {data.level}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentView('learn')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'learn'
              ? 'border-b-2 border-pink-600 text-pink-600 dark:text-pink-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          📚 학습하기
        </button>
        <button
          onClick={() => setCurrentView('practice')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'practice'
              ? 'border-b-2 border-pink-600 text-pink-600 dark:text-pink-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          🎙️ 연습하기
        </button>
        <button
          onClick={() => setCurrentView('evaluate')}
          className={`px-6 py-3 font-medium transition-colors ${
            currentView === 'evaluate'
              ? 'border-b-2 border-pink-600 text-pink-600 dark:text-pink-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          ✅ 자가 평가
        </button>
      </div>

      {/* Learn View */}
      {currentView === 'learn' && (
        <div className="space-y-6">
          {data.sentences.map((sentence, index) => (
            <div
              key={sentence.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {sentence.text}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-11 mb-2">
                    {sentence.translation}
                  </p>
                  {sentence.tips && (
                    <div className="ml-11 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        💡 <strong>발음 팁:</strong> {sentence.tips}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handlePlaySentence(sentence.text)}
                  className="p-3 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  aria-label="문장 듣기"
                >
                  {isSpeaking ? '⏸️' : '🔊'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Practice View */}
      {currentView === 'practice' && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                진행률
              </span>
              <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                {currentSentenceIndex + 1} / {data.sentences.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentSentenceIndex + 1) / data.sentences.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Sentence */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentSentence.text}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {currentSentence.translation}
              </p>

              <button
                onClick={() => handlePlaySentence(currentSentence.text)}
                className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-6 py-3 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
              >
                {isSpeaking ? '⏸️ 일시정지' : '🔊 듣기'}
              </button>

              {currentSentence.tips && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    💡 <strong>발음 팁:</strong> {currentSentence.tips}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              🎙️ 녹음하기
            </h4>

            <div className="flex flex-col items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  ⏺️ 녹음 시작
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors animate-pulse"
                >
                  ⏹️ 녹음 중지
                </button>
              )}

              {audioURL && (
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playRecording(audioURL)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      ▶️ 재생
                    </button>
                    <button
                      onClick={() => deleteRecording(currentSentence.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 text-center">
                    ✅ 녹음이 저장되었습니다!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentSentenceIndex === 0}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={handleNext}
              disabled={currentSentenceIndex === data.sentences.length - 1}
              className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              다음 →
            </button>
          </div>
        </div>
      )}

      {/* Evaluate View */}
      {currentView === 'evaluate' && (
        <div className="space-y-6">
          {/* Recordings Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📼 녹음 목록
            </h3>
            <div className="space-y-3">
              {data.sentences.map((sentence) => (
                <div
                  key={sentence.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sentence.text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sentence.translation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {recordings[sentence.id] ? (
                      <>
                        <button
                          onClick={() => playRecording(recordings[sentence.id])}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        >
                          ▶️
                        </button>
                        <span className="text-green-600 dark:text-green-400">✅</span>
                      </>
                    ) : (
                      <span className="text-gray-400">⚪</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ✅ 자가 평가 체크리스트
              </h3>
              <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
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
                            className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
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
        </div>
      )}
    </div>
  );
}
