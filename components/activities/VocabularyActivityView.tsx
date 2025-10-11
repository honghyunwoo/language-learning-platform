'use client';

/**
 * Vocabulary Activity 렌더링 컴포넌트
 */

import { useState } from 'react';
import { VocabularyActivity } from '@/lib/types/uploaded-activity';

interface Props {
  activity: VocabularyActivity;
  onComplete?: (score: number) => void;
}

export default function VocabularyActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'theory' | 'examples' | 'exercises'>('theory');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const { content, title, objectives, estimatedTime } = activity;
  const { theory, examples, exercises } = content;

  // 섹션별 완료 여부
  const theorySeen = currentSection !== 'theory';
  const examplesComplete = currentSection === 'exercises';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {estimatedTime}분
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {activity.level}
                </span>
                <span className="text-gray-500">Week {activity.week}</span>
              </div>
            </div>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">📚 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 섹션 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('theory')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                currentSection === 'theory'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              이론 {theorySeen && '✓'}
            </button>
            <button
              onClick={() => setCurrentSection('examples')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                currentSection === 'examples'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              예문 {examplesComplete && '✓'}
            </button>
            <button
              onClick={() => setCurrentSection('exercises')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                currentSection === 'exercises'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              연습문제
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'theory' && (
          <TheorySection theory={theory} />
        )}

        {currentSection === 'examples' && (
          <ExamplesSection examples={examples} />
        )}

        {currentSection === 'exercises' && exercises && (
          <ExercisesSection
            exercises={exercises}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}

// ===== 이론 섹션 =====
function TheorySection({ theory }: { theory: VocabularyActivity['content']['theory'] }) {
  if (!theory) return <div className="text-gray-500">이론 내용이 없습니다.</div>;

  return (
    <div className="space-y-6">
      {theory.introduction && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">개요</h2>
          <p className="text-gray-700 leading-relaxed">{theory.introduction}</p>
        </div>
      )}

      {theory.semanticFields && Array.isArray(theory.semanticFields) && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">의미 분류</h2>
          {theory.semanticFields.map((field: any, idx: number) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="text-md font-semibold text-gray-800 mb-3">{field.category}</h3>
              {field.words && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {field.words.map((word: string, widx: number) => (
                    <span
                      key={widx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
              {field.nuances && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  💡 {field.nuances}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== 예문 섹션 =====
function ExamplesSection({ examples }: { examples: VocabularyActivity['content']['examples'] }) {
  if (!examples || typeof examples !== 'object') {
    return <div className="text-gray-500">예문이 없습니다.</div>;
  }

  const wordList = Object.keys(examples);

  return (
    <div className="space-y-4">
      {wordList.map((word) => {
        const wordExamples = examples[word];
        if (!Array.isArray(wordExamples)) return null;

        return (
          <div key={word} className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{word}</h3>
            <div className="space-y-4">
              {wordExamples.map((ex: any, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {ex.level}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{ex.sentence}</p>
                  <p className="text-gray-600 text-sm mb-1">{ex.translation}</p>
                  {ex.notes && (
                    <p className="text-gray-500 text-sm italic">{ex.notes}</p>
                  )}
                  {ex.audioUrl && (
                    <div className="mt-2">
                      <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        듣기
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== 연습문제 섹션 =====
function ExercisesSection({
  exercises,
  userAnswers,
  setUserAnswers,
  onComplete,
}: {
  exercises: any[];
  userAnswers: Record<number, string>;
  setUserAnswers: (answers: Record<number, string>) => void;
  onComplete?: (score: number) => void;
}) {
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setShowResults(true);

    // 점수 계산
    let correct = 0;
    exercises.forEach((ex, idx) => {
      if (userAnswers[idx] === ex.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / exercises.length) * 100);
    onComplete?.(score);
  };

  return (
    <div className="space-y-6">
      {exercises.map((exercise, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {idx + 1}
            </span>
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-3">{exercise.question || exercise.sentence || exercise.korean || exercise.prompt}</p>

              {/* 선택지 */}
              {exercise.options && (
                <div className="space-y-2">
                  {exercise.options.map((option: string, oidx: number) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        userAnswers[idx] === option
                          ? showResults
                            ? option === exercise.correct
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`exercise-${idx}`}
                        value={option}
                        checked={userAnswers[idx] === option}
                        onChange={(e) => {
                          if (!showResults) {
                            setUserAnswers({ ...userAnswers, [idx]: e.target.value });
                          }
                        }}
                        disabled={showResults}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-900">{option}</span>
                      {showResults && option === exercise.correct && (
                        <span className="ml-auto text-green-600 font-semibold">✓ 정답</span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* 설명 (제출 후) */}
              {showResults && exercise.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">💡 설명:</span> {exercise.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* 제출 버튼 */}
      {!showResults && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          제출하기
        </button>
      )}

      {/* 결과 */}
      {showResults && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">완료!</h3>
          <p className="text-lg">
            {exercises.filter((ex, idx) => userAnswers[idx] === ex.correct).length} / {exercises.length} 정답
          </p>
          <p className="text-sm mt-1 opacity-90">
            정답률: {Math.round((exercises.filter((ex, idx) => userAnswers[idx] === ex.correct).length / exercises.length) * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
