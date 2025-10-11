'use client';

/**
 * Writing Activity 렌더링 컴포넌트
 */

import { useState } from 'react';
import { WritingActivity } from '@/lib/types/uploaded-activity';

interface Props {
  activity: WritingActivity;
  onComplete?: (score: number) => void;
}

export default function WritingActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'models' | 'write' | 'review'>('models');
  const [userText, setUserText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { content, title, objectives, estimatedTime, assessment } = activity;
  const { models, planning, checklist } = content;

  const handleSubmit = () => {
    setIsSubmitted(true);
    setCurrentSection('review');
    // 쓰기 평가는 자동 채점이 어려우므로 임시로 85점 부여
    onComplete?.(85);
  };

  const wordCount = userText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentenceCount = userText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{estimatedTime}분</span>
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium">
              {activity.level}
            </span>
            <span>Week {activity.week}</span>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-pink-50 rounded-lg">
            <h3 className="text-sm font-semibold text-pink-900 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-pink-800 flex items-start gap-2">
                  <span className="text-pink-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('models')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'models'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600'
              }`}
            >
              모델 예시
            </button>
            <button
              onClick={() => setCurrentSection('write')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'write'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600'
              }`}
            >
              작성하기
            </button>
            <button
              onClick={() => setCurrentSection('review')}
              disabled={!isSubmitted}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'review'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : isSubmitted
                  ? 'text-gray-600'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              검토
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'models' && <ModelsSection models={models} planning={planning} />}
        {currentSection === 'write' && (
          <WriteSection
            userText={userText}
            setUserText={setUserText}
            checklist={checklist}
            assessment={assessment}
            wordCount={wordCount}
            sentenceCount={sentenceCount}
            isSubmitted={isSubmitted}
            onSubmit={handleSubmit}
          />
        )}
        {currentSection === 'review' && (
          <ReviewSection
            userText={userText}
            checklist={checklist}
            assessment={assessment}
            wordCount={wordCount}
            sentenceCount={sentenceCount}
          />
        )}
      </div>
    </div>
  );
}

function ModelsSection({ models, planning }: { models: any[]; planning: any[] }) {
  return (
    <div className="space-y-6">
      {/* 쓰기 안내 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 쓰기 과정</h3>
        {planning && planning.length > 0 ? (
          <ol className="space-y-1 text-sm text-blue-800">
            {planning.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-semibold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• 모델 예시를 먼저 읽고 구조를 파악하세요</li>
            <li>• 빈칸에 들어갈 내용을 미리 생각하세요</li>
            <li>• 체크리스트를 보며 작성하세요</li>
            <li>• 완성 후 다시 읽으며 교정하세요</li>
          </ul>
        )}
      </div>

      {/* 모델 예시 */}
      {models && models.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">모델 예시</h2>
          {models.map((model: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-pink-500">
              <h3 className="font-semibold text-gray-900 mb-3">{model.title}</h3>
              <div className="p-4 bg-gray-50 rounded font-mono text-gray-900 whitespace-pre-wrap">
                {model.text}
              </div>
              {model.notes && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold">💡 참고:</span> {model.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">모델 예시가 없습니다.</div>
      )}

      {/* 다음 단계 안내 */}
      <div className="bg-pink-50 rounded-lg p-4">
        <h3 className="font-semibold text-pink-900 mb-2">📝 다음 단계</h3>
        <p className="text-sm text-pink-800">
          모델 예시를 참고하여 &quot;작성하기&quot; 탭으로 이동해 자신만의 글을 작성하세요.
        </p>
      </div>
    </div>
  );
}

function WriteSection({
  userText,
  setUserText,
  checklist,
  assessment,
  wordCount,
  sentenceCount,
  isSubmitted,
  onSubmit,
}: {
  userText: string;
  setUserText: (text: string) => void;
  checklist: any[];
  assessment: any;
  wordCount: number;
  sentenceCount: number;
  isSubmitted: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* 과제 안내 */}
      {assessment && assessment.task && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">과제</h2>
          <p className="text-gray-900 font-medium">{assessment.task}</p>

          {/* 평가 기준 */}
          {assessment.rubric && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">평가 기준</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {Object.entries(assessment.rubric).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="font-semibold text-gray-900 capitalize">{key}</div>
                    <div className="text-gray-600">{value}점</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 체크리스트 */}
      {checklist && checklist.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">교정 체크리스트</h2>
          <div className="space-y-2">
            {checklist.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`check-${idx}`}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <label htmlFor={`check-${idx}`} className="text-gray-700">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 작성 영역 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">작성하기</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>단어: {wordCount}</span>
            <span>문장: {sentenceCount}</span>
          </div>
        </div>

        <textarea
          value={userText}
          onChange={(e) => !isSubmitted && setUserText(e.target.value)}
          disabled={isSubmitted}
          placeholder="여기에 작성하세요..."
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none resize-none font-mono text-gray-900"
        />

        {!isSubmitted && (
          <button
            onClick={onSubmit}
            disabled={userText.trim().length === 0}
            className={`mt-4 w-full py-3 rounded-lg font-semibold ${
              userText.trim().length === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            제출하기
          </button>
        )}

        {isSubmitted && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-900 font-semibold">✓ 제출 완료!</p>
            <p className="text-sm text-green-700 mt-1">&quot;검토&quot; 탭에서 결과를 확인하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewSection({
  userText,
  checklist,
  assessment,
  wordCount,
  sentenceCount,
}: {
  userText: string;
  checklist: any[];
  assessment: any;
  wordCount: number;
  sentenceCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* 제출된 글 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">제출한 글</h2>
        <div className="p-4 bg-gray-50 rounded-lg font-mono text-gray-900 whitespace-pre-wrap min-h-[200px]">
          {userText || '(작성된 내용이 없습니다)'}
        </div>
        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          <span>단어 수: {wordCount}</span>
          <span>문장 수: {sentenceCount}</span>
        </div>
      </div>

      {/* 자가 체크리스트 */}
      {checklist && checklist.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">자가 검토</h2>
          <p className="text-sm text-gray-600 mb-4">
            아래 항목들을 확인하며 자신의 글을 다시 한 번 검토하세요:
          </p>
          <div className="space-y-3">
            {checklist.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                <span className="text-blue-600">•</span>
                <span className="text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 평가 결과 */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-2">제출 완료!</h3>
        <p className="text-lg mb-3">훌륭한 작성입니다!</p>
        {assessment && assessment.rubric && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm">
              이 글은 다음 기준으로 평가됩니다:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(assessment.rubric).map(([key]) => (
                <span key={key} className="px-3 py-1 bg-white bg-opacity-30 rounded text-sm capitalize">
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 피드백 안내 */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">📝 다음 단계</h3>
        <p className="text-sm text-yellow-800">
          선생님이나 동료에게 피드백을 받아보세요. 자동 문법 체크 기능은 향후 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}
