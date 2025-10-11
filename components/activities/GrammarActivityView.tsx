'use client';

/**
 * Grammar Activity 렌더링 컴포넌트
 */

import { useState } from 'react';
import { GrammarActivity, Exercise } from '@/lib/types/uploaded-activity';

interface Props {
  activity: GrammarActivity;
  onComplete?: (score: number) => void;
}

// Helper type for Grammar rules
interface GrammarRule {
  rule: string;
  detail: string;
}

// Helper type for learner errors
interface LearnerError {
  wrong: string;
  fix: string;
  why: string;
}

// Helper type for example pairs
interface ExamplePair {
  correct: string;
  incorrect?: string;
}

export default function GrammarActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'theory' | 'examples' | 'exercises'>('theory');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const { content, title, objectives, estimatedTime } = activity;

  const handleSubmit = () => {
    setShowResults(true);
    const exercises = content.exercises || [];
    let correct = 0;
    exercises.forEach((ex, idx: number) => {
      const exCorrect = 'correct' in ex ? ex.correct : undefined;
      const exFix = 'fix' in ex ? ex.fix : undefined;
      if (userAnswers[idx] === exCorrect || userAnswers[idx] === exFix) {
        correct++;
      }
    });
    const score = exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0;
    onComplete?.(score);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{estimatedTime}분</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {activity.level}
            </span>
            <span>Week {activity.week}</span>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('theory')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'theory'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              문법 이론
            </button>
            <button
              onClick={() => setCurrentSection('examples')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'examples'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              예문
            </button>
            <button
              onClick={() => setCurrentSection('exercises')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'exercises'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              연습문제
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'theory' && <TheorySection content={content} />}
        {currentSection === 'examples' && <ExamplesSection content={content} />}
        {currentSection === 'exercises' && (
          <ExercisesSection
            exercises={content.exercises || []}
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

function TheorySection({ content }: { content: GrammarActivity['content'] }) {
  const { linguisticFoundation, coreTheory, koreanLearnerPitfalls } = content;

  return (
    <div className="space-y-6">
      {/* 언어학적 기초 */}
      {linguisticFoundation && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{linguisticFoundation.title || '언어학적 기초'}</h2>
          <p className="text-gray-700 leading-relaxed">{linguisticFoundation.summary}</p>
          {linguisticFoundation.visualAid && (
            <div className="mt-4 p-4 bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap">
              {typeof linguisticFoundation.visualAid === 'object' && linguisticFoundation.visualAid !== null && 'asciiArt' in linguisticFoundation.visualAid
                ? String((linguisticFoundation.visualAid as Record<string, unknown>).asciiArt)
                : ''}
            </div>
          )}
        </div>
      )}

      {/* 핵심 이론 */}
      {coreTheory && coreTheory.rules && Array.isArray(coreTheory.rules) && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">핵심 규칙</h2>
          <div className="space-y-3">
            {(coreTheory.rules as GrammarRule[]).map((rule, idx: number) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">{rule.rule}</h3>
                <p className="text-gray-600 text-sm mt-1">{rule.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 한국인 학습자 오류 */}
      {koreanLearnerPitfalls && koreanLearnerPitfalls.errors && Array.isArray(koreanLearnerPitfalls.errors) && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{koreanLearnerPitfalls.title || '한국인 학습자 주의사항'}</h2>
          <div className="space-y-4">
            {(koreanLearnerPitfalls.errors as LearnerError[]).map((error, idx: number) => (
              <div key={idx} className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <code className="flex-1 text-red-700 font-mono text-sm">{error.wrong}</code>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-green-600 font-bold text-xl">✓</span>
                  <code className="flex-1 text-green-700 font-mono text-sm">{error.fix}</code>
                </div>
                <p className="text-sm text-gray-700 mt-2 pl-6">{error.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExamplesSection({ content }: { content: GrammarActivity['content'] }) {
  const examples = content.examples?.pairs;
  if (!examples || !Array.isArray(examples)) {
    return <div className="text-gray-500">예문이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {(examples as ExamplePair[]).map((pair, idx: number) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-xl">✓</span>
              <p className="flex-1 text-gray-900 font-medium">{pair.correct}</p>
            </div>
            {pair.incorrect && (
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="flex-1 text-gray-600 line-through">{pair.incorrect}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExercisesSection({
  exercises,
  userAnswers,
  setUserAnswers,
  showResults,
  onSubmit,
}: {
  exercises: Exercise[];
  userAnswers: Record<number, string>;
  setUserAnswers: (answers: Record<number, string>) => void;
  showResults: boolean;
  onSubmit: () => void;
}) {
  if (exercises.length === 0) {
    return <div className="text-gray-500">연습문제가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {exercises.map((ex, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold">
              {idx + 1}
            </span>
            <div className="flex-1">
              {/* 문제 */}
              <p className="text-gray-900 font-medium mb-3">
                {ex.question || ex.sentence || ex.korean || ex.prompt}
              </p>

              {/* 선택지 */}
              {ex.options && (
                <div className="space-y-2">
                  {ex.options.map((option: string, oidx: number) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        userAnswers[idx] === option
                          ? showResults
                            ? option === ex.correct
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`ex-${idx}`}
                        value={option}
                        checked={userAnswers[idx] === option}
                        onChange={(e) => !showResults && setUserAnswers({ ...userAnswers, [idx]: e.target.value })}
                        disabled={showResults}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                      {showResults && option === ex.correct && (
                        <span className="ml-auto text-green-600 font-semibold">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* 설명 */}
              {showResults && (ex.explanation || ex.why) && (
                <div className="mt-3 p-3 bg-purple-50 rounded">
                  <p className="text-sm text-purple-900">
                    <span className="font-semibold">💡</span> {ex.explanation || ex.why}
                  </p>
                </div>
              )}

              {/* 에러 교정 타입 */}
              {ex.type === 'error_correction' && ex.fix && showResults && (
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">✓ 정답:</span> {ex.fix}
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
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
        >
          제출하기
        </button>
      )}

      {showResults && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">완료!</h3>
          <p className="text-lg">
            {exercises.filter((ex, idx) => userAnswers[idx] === ex.correct || userAnswers[idx] === ex.fix).length} / {exercises.length} 정답
          </p>
        </div>
      )}
    </div>
  );
}
