'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';

// JSON 데이터 import
import grammarData from '@/data/levelTest/grammar.json';
import vocabularyData from '@/data/levelTest/vocabulary.json';
import listeningData from '@/data/levelTest/listening.json';

// 타입 정의
interface GrammarQuestion {
  id: string;
  level: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    korean: string;
    english: string;
    rule: string;
  };
  difficulty: number;
}

interface VocabularyQuestion {
  id: string;
  level: string;
  category: string;
  questionType: string;
  question: string;
  options: string[];
  correctAnswer: number;
  wordInfo: {
    word: string;
    pronunciation: string;
    koreanMeaning: string;
    exampleSentence?: string;
    exampleTranslation?: string;
  };
  difficulty: number;
}

interface ListeningDialogue {
  id: string;
  level: string;
  title: string;
  situation: string;
  duration: string;
  speakers: string[];
  dialogue: {
    speaker: string;
    text: string;
    translation: string;
    notes?: string;
  }[];
  vocabulary?: { word: string; meaning: string; }[];
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

type Question = GrammarQuestion | VocabularyQuestion | ListeningDialogue;

export default function LevelTestTestPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { speak, stop } = useTTS();

  // 테스트 상태
  const [currentSection, setCurrentSection] = useState<'grammar' | 'vocabulary' | 'listening'>('grammar');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  // 전체 문제 데이터
  const allQuestions = {
    grammar: grammarData as GrammarQuestion[],
    vocabulary: vocabularyData as VocabularyQuestion[],
    listening: listeningData as ListeningDialogue[],
  };

  // 현재 섹션 문제들
  const currentQuestions = allQuestions[currentSection];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // 전체 진행률 계산
  const totalQuestions = grammarData.length + vocabularyData.length + listeningData.length;
  const completedQuestions = Object.keys(answers).length;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  // 인증 체크
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // 답변 저장
  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));
  };

  // 다음 문제로 이동
  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // 다음 섹션으로 이동
      if (currentSection === 'grammar') {
        setCurrentSection('vocabulary');
        setCurrentQuestionIndex(0);
      } else if (currentSection === 'vocabulary') {
        setCurrentSection('listening');
        setCurrentQuestionIndex(0);
      } else {
        // 테스트 완료 - 결과 페이지로 이동
        router.push(`/level-test/result?answers=${encodeURIComponent(JSON.stringify(answers))}`);
      }
    }
  };

  // 이전 문제로 이동
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // 이전 섹션으로 이동
      if (currentSection === 'vocabulary') {
        setCurrentSection('grammar');
        setCurrentQuestionIndex(grammarData.length - 1);
      } else if (currentSection === 'listening') {
        setCurrentSection('vocabulary');
        setCurrentQuestionIndex(vocabularyData.length - 1);
      }
    }
  };

  // 듣기 문제 재생
  const handlePlayListening = (dialogue: ListeningDialogue) => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const fullText = dialogue.dialogue.map((d) => d.text).join('. ');
    speak(fullText);

    // 재생 완료 후 상태 업데이트
    setTimeout(() => {
      setIsPlaying(false);
    }, fullText.length * 100); // 대략적인 재생 시간
  };

  // 섹션 이름
  const sectionNames = {
    grammar: '문법',
    vocabulary: '어휘',
    listening: '듣기',
  };

  // 섹션 색상
  const sectionColors = {
    grammar: 'blue',
    vocabulary: 'purple',
    listening: 'pink',
  };

  const currentColor = sectionColors[currentSection];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 - 진행률 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {sectionNames[currentSection]} 테스트
            </h1>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              {completedQuestions} / {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 문제 카드 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/20 dark:border-gray-700/30">
          {/* 섹션 배지 */}
          <div className="mb-6">
            <span className={`px-4 py-2 bg-${currentColor}-100 dark:bg-${currentColor}-900/30 text-${currentColor}-700 dark:text-${currentColor}-300 rounded-full text-sm font-bold`}>
              {sectionNames[currentSection]} {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
          </div>

          {/* 문법/어휘 문제 */}
          {(currentSection === 'grammar' || currentSection === 'vocabulary') && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {(currentQuestion as GrammarQuestion | VocabularyQuestion).question}
              </h2>
              <div className="space-y-3">
                {(currentQuestion as GrammarQuestion | VocabularyQuestion).options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      answers[currentQuestion.id] === index
                        ? `border-${currentColor}-500 bg-${currentColor}-50 dark:bg-${currentColor}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 듣기 문제 */}
          {currentSection === 'listening' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {(currentQuestion as ListeningDialogue).title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {(currentQuestion as ListeningDialogue).situation}
                </p>
                <button
                  onClick={() => handlePlayListening(currentQuestion as ListeningDialogue)}
                  className={`px-6 py-3 bg-${currentColor}-600 hover:bg-${currentColor}-700 text-white rounded-xl font-bold transition-all flex items-center gap-2`}
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      정지
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      대화 듣기
                    </>
                  )}
                </button>
              </div>

              {(currentQuestion as ListeningDialogue).questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Question {qIndex + 1}: {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(optIndex)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          answers[`${currentQuestion.id}-q${qIndex}`] === optIndex
                            ? `border-${currentColor}-500 bg-${currentColor}-50 dark:bg-${currentColor}-900/20`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 'grammar' && currentQuestionIndex === 0}
            className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`flex-1 px-6 py-4 bg-gradient-to-r from-${currentColor}-600 to-${currentColor}-700 hover:from-${currentColor}-700 hover:to-${currentColor}-800 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
          >
            {currentSection === 'listening' && currentQuestionIndex === currentQuestions.length - 1
              ? '결과 보기'
              : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
