'use client';

/**
 * Placement Test 렌더링 컴포넌트
 */

import { useState, useEffect } from 'react';
import {
  PlacementTest,
  PlacementSection,
  MCQQuestion,
  SelfRatingQuestion,
  ListeningItem,
} from '@/lib/types/placement-test';

interface Props {
  test: PlacementTest;
  onComplete: (answers: Record<string, string | number>) => void;
}

export default function PlacementTestView({ test, onComplete }: Props) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSection = test.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === test.sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      setIsSubmitted(true);
      onComplete(answers);
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  // 현재 섹션의 모든 문항이 답변되었는지 확인
  const isCurrentSectionComplete = () => {
    const items = getItemsFromSection(currentSection);
    return items.every((_, idx) => {
      const questionId = `${currentSection.name}_${idx}`;
      return answers[questionId] !== undefined;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>⏱ 예상 시간: {test.estimatedTime}분</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                섹션 {currentSectionIndex + 1} / {test.sections.length}
              </span>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2">
              {test.sections.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-2 rounded-full ${
                    idx < currentSectionIndex
                      ? 'bg-green-500'
                      : idx === currentSectionIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <SectionRenderer
          section={currentSection}
          sectionIndex={currentSectionIndex}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className={`px-6 py-3 rounded-lg font-semibold ${
              currentSectionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← 이전
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentSectionComplete()}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isCurrentSectionComplete()
                ? isLastSection
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastSection ? '제출하기 ✓' : '다음 →'}
          </button>
        </div>

        {/* 진행 안내 */}
        {!isCurrentSectionComplete() && (
          <div className="mt-4 text-center text-sm text-gray-500">
            모든 문항에 답변해주세요
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 섹션 렌더러
 */
function SectionRenderer({
  section,
  sectionIndex,
  answers,
  onAnswerChange,
}: {
  section: PlacementSection;
  sectionIndex: number;
  answers: Record<string, string | number>;
  onAnswerChange: (questionId: string, answer: string | number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 섹션 제목 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h2>
        <p className="text-sm text-gray-600">
          {getSectionDescription(section.name)}
        </p>
      </div>

      {/* 문항 렌더링 */}
      {section.name === 'Vocabulary & Collocation' ||
      section.name === 'Grammar & Usage' ? (
        <VocabularyGrammarSection
          section={section as any}
          sectionIndex={sectionIndex}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ) : section.name === 'Reading (Short Passage)' ? (
        <ReadingSection
          section={section as any}
          sectionIndex={sectionIndex}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ) : section.name === 'Listening (Script-based)' ? (
        <ListeningSection
          section={section as any}
          sectionIndex={sectionIndex}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ) : section.name === 'Speaking (Self-assessment)' ? (
        <SpeakingSection
          section={section as any}
          sectionIndex={sectionIndex}
          answers={answers}
          onAnswerChange={onAnswerChange}
        />
      ) : null}
    </div>
  );
}

/**
 * Vocabulary & Grammar 섹션
 */
function VocabularyGrammarSection({
  section,
  sectionIndex,
  answers,
  onAnswerChange,
}: any) {
  return (
    <div className="space-y-4">
      {section.items.map((item: MCQQuestion, idx: number) => {
        const questionId = `${section.name}_${idx}`;
        return (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-4">{item.q}</p>
                <div className="space-y-2">
                  {item.options.map((option, oidx) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[questionId] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={questionId}
                        value={option}
                        checked={answers[questionId] === option}
                        onChange={() => onAnswerChange(questionId, option)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Reading 섹션
 */
function ReadingSection({ section, sectionIndex, answers, onAnswerChange }: any) {
  let questionIndex = 0;

  return (
    <div className="space-y-6">
      {section.passages.map((passage: any, pidx: number) => (
        <div key={pidx} className="bg-white rounded-lg p-6 shadow-sm">
          {/* 지문 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-900 leading-relaxed">{passage.text}</p>
          </div>

          {/* 문항 */}
          {passage.items.map((item: MCQQuestion, iidx: number) => {
            const currentQuestionIndex = questionIndex++;
            const questionId = `${section.name}_${currentQuestionIndex}`;

            return (
              <div key={iidx} className="mt-4">
                <p className="text-gray-900 font-medium mb-3">{item.q}</p>
                <div className="space-y-2">
                  {item.options.map((option, oidx) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[questionId] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={questionId}
                        value={option}
                        checked={answers[questionId] === option}
                        onChange={() => onAnswerChange(questionId, option)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Listening 섹션
 */
function ListeningSection({ section, sectionIndex, answers, onAnswerChange }: any) {
  return (
    <div className="space-y-6">
      {section.items.map((item: ListeningItem, idx: number) => {
        const questionId = `${section.name}_${idx}`;

        return (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
            {/* 오디오 플레이어 */}
            <div className="mb-6">
              <audio controls className="w-full" src={item.audio}>
                Your browser does not support the audio element.
              </audio>
              {/* 스크립트 (선택적 표시) */}
              <details className="mt-3">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  📄 스크립트 보기
                </summary>
                <p className="mt-2 text-sm text-gray-700 italic">&quot;{item.script}&quot;</p>
              </details>
            </div>

            {/* 질문 */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-4">{item.q}</p>
                <div className="space-y-2">
                  {item.options.map((option, oidx) => (
                    <label
                      key={oidx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[questionId] === option
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={questionId}
                        value={option}
                        checked={answers[questionId] === option}
                        onChange={() => onAnswerChange(questionId, option)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Speaking 섹션 (자기평가)
 */
function SpeakingSection({ section, sectionIndex, answers, onAnswerChange }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 자기평가 안내</h3>
        <p className="text-sm text-blue-800">
          각 항목에 대해 자신의 능력을 솔직하게 평가해주세요.
          <br />1 (전혀 못함) ~ 5 (매우 잘함)
        </p>
      </div>

      {section.items.map((item: SelfRatingQuestion, idx: number) => {
        const questionId = `${section.name}_${idx}`;

        return (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-4">{item.q}</p>
                <div className="flex gap-3">
                  {item.scale.map((rating) => (
                    <label
                      key={rating}
                      className={`flex-1 text-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[questionId] === rating
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={questionId}
                        value={rating}
                        checked={answers[questionId] === rating}
                        onChange={() => onAnswerChange(questionId, rating)}
                        className="sr-only"
                      />
                      <div className="font-bold text-lg">{rating}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {rating === 1
                          ? '전혀'
                          : rating === 2
                          ? '조금'
                          : rating === 3
                          ? '보통'
                          : rating === 4
                          ? '잘함'
                          : '매우'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 섹션 설명
 */
function getSectionDescription(sectionName: string): string {
  const descriptions: Record<string, string> = {
    'Vocabulary & Collocation': '단어와 연어(collocation) 이해도를 평가합니다.',
    'Grammar & Usage': '문법 지식과 활용 능력을 평가합니다.',
    'Reading (Short Passage)': '독해 능력과 추론 능력을 평가합니다.',
    'Listening (Script-based)': '듣기 이해 능력을 평가합니다. 오디오를 듣고 답변하세요.',
    'Speaking (Self-assessment)': '말하기 능력을 자가 평가합니다.',
  };

  return descriptions[sectionName] || '';
}

/**
 * 섹션에서 문항 추출
 */
function getItemsFromSection(section: PlacementSection): any[] {
  if (section.name === 'Reading (Short Passage)') {
    const readingSection = section as any;
    return readingSection.passages?.flatMap((p: any) => p.items) || [];
  }
  return section.items || [];
}
