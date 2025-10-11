'use client';

/**
 * Reading Activity 렌더링 컴포넌트
 */

import { useState } from 'react';
import { ReadingActivity } from '@/lib/types/uploaded-activity';

interface Props {
  activity: ReadingActivity;
  onComplete?: (score: number) => void;
}

export default function ReadingActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'text' | 'glossary' | 'questions'>('text');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const { content, title, objectives, estimatedTime } = activity;
  const { text, glossary, readingSkills, questions } = content;

  const handleSubmit = () => {
    setShowResults(true);
    const questionsArr = questions || [];
    let correct = 0;
    questionsArr.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.a) {
        correct++;
      }
    });
    const score = questionsArr.length > 0 ? Math.round((correct / questionsArr.length) * 100) : 0;
    onComplete?.(score);
  };

  // 용어집에서 단어 찾기
  const findGlossaryEntry = (word: string) => {
    return glossary?.find((entry: any) => entry.term.toLowerCase() === word.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{estimatedTime}분</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {activity.level}
            </span>
            <span>Week {activity.week}</span>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-indigo-800 flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 읽기 스킬 */}
          {readingSkills && readingSkills.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">연습 스킬:</span>
              <div className="flex flex-wrap gap-2">
                {readingSkills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('text')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'text'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600'
              }`}
            >
              본문
            </button>
            <button
              onClick={() => setCurrentSection('glossary')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'glossary'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600'
              }`}
            >
              용어집
            </button>
            <button
              onClick={() => setCurrentSection('questions')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'questions'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600'
              }`}
            >
              문제
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'text' && (
          <TextSection
            text={text}
            glossary={glossary}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            findGlossaryEntry={findGlossaryEntry}
          />
        )}
        {currentSection === 'glossary' && <GlossarySection glossary={glossary} />}
        {currentSection === 'questions' && (
          <QuestionsSection
            questions={questions || []}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            showResults={showResults}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

function TextSection({
  text,
  glossary,
  selectedWord,
  setSelectedWord,
  findGlossaryEntry,
}: {
  text: string;
  glossary: any[];
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
  findGlossaryEntry: (word: string) => any;
}) {
  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:]/, '');
    const entry = findGlossaryEntry(cleanWord);
    if (entry) {
      setSelectedWord(cleanWord);
    }
  };

  return (
    <div className="space-y-6">
      {/* 읽기 안내 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 읽기 팁</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 먼저 전체를 빠르게 읽으며 주제를 파악하세요 (Skimming)</li>
          <li>• 특정 정보를 찾을 때는 해당 부분만 집중하세요 (Scanning)</li>
          <li>• 모르는 단어를 클릭하면 뜻을 확인할 수 있습니다</li>
          <li>• 문맥을 통해 단어의 의미를 추론해보세요 (Inference)</li>
        </ul>
      </div>

      {/* 본문 */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-900 leading-relaxed text-lg">
            {text.split(' ').map((word, idx) => {
              const cleanWord = word.replace(/[.,!?;:]/, '');
              const entry = findGlossaryEntry(cleanWord);
              const isGlossaryWord = !!entry;

              return (
                <span key={idx}>
                  <span
                    className={`${
                      isGlossaryWord
                        ? 'cursor-pointer underline decoration-dotted decoration-indigo-400 hover:bg-indigo-100 hover:decoration-solid'
                        : ''
                    } ${selectedWord === cleanWord ? 'bg-indigo-200 font-semibold' : ''}`}
                    onClick={() => isGlossaryWord && handleWordClick(word)}
                  >
                    {word}
                  </span>{' '}
                </span>
              );
            })}
          </p>
        </div>

        {/* 선택된 단어 뜻 표시 */}
        {selectedWord && findGlossaryEntry(selectedWord) && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-indigo-900 text-lg">{selectedWord}</h4>
                <p className="text-indigo-700 mt-1">{findGlossaryEntry(selectedWord)?.meaning}</p>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">📖 Reading Strategy</h3>
        <p className="text-sm text-yellow-800">
          첫 번째 읽기: 전체 흐름 파악 → 두 번째 읽기: 세부 정보 확인 → 세 번째 읽기: 모르는 단어 추론
        </p>
      </div>
    </div>
  );
}

function GlossarySection({ glossary }: { glossary: any[] }) {
  if (!glossary || glossary.length === 0) {
    return <div className="text-gray-500">용어집이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📚 용어집 사용법</h3>
        <p className="text-sm text-blue-800">
          본문을 읽다가 모르는 단어가 나오면 여기서 찾아보세요. 문맥과 함께 이해하면 더 잘 기억됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {glossary.map((entry: any, idx: number) => (
          <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-indigo-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{entry.term}</h3>
            <p className="text-gray-700">{entry.meaning}</p>
            {entry.example && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 italic">&quot;{entry.example}&quot;</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsSection({
  questions,
  userAnswers,
  setUserAnswers,
  showResults,
  onSubmit,
}: {
  questions: any[];
  userAnswers: Record<number, string>;
  setUserAnswers: (answers: Record<number, string>) => void;
  showResults: boolean;
  onSubmit: () => void;
}) {
  if (questions.length === 0) {
    return <div className="text-gray-500">문제가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {questions.map((question, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
              {idx + 1}
            </span>
            <div className="flex-1">
              {/* 문제 타입 */}
              {question.type && (
                <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium mb-2">
                  {question.type}
                </span>
              )}

              {/* 질문 */}
              <p className="text-gray-900 font-medium mb-3">{question.q}</p>

              {/* 선택지 */}
              {question.options && (
                <div className="space-y-2">
                  {question.options.map((option: string, oidx: number) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        userAnswers[idx] === option
                          ? showResults
                            ? option === question.a
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={userAnswers[idx] === option}
                        onChange={(e) => !showResults && setUserAnswers({ ...userAnswers, [idx]: e.target.value })}
                        disabled={showResults}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                      {showResults && option === question.a && (
                        <span className="ml-auto text-green-600 font-semibold">✓ 정답</span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* 정답 표시 (주관식) */}
              {showResults && !question.options && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">✓ 정답:</span> {question.a}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {!showResults && (
        <button
          onClick={onSubmit}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          제출하기
        </button>
      )}

      {showResults && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">완료!</h3>
          <p className="text-lg">
            {questions.filter((q, idx) => userAnswers[idx] === q.a).length} / {questions.length} 정답
          </p>
        </div>
      )}
    </div>
  );
}
