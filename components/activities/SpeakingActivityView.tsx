'use client';

/**
 * Speaking Activity 렌더링 컴포넌트
 */

import { useState } from 'react';
import { SpeakingActivity } from '@/lib/types/uploaded-activity';

interface Props {
  activity: SpeakingActivity;
  onComplete?: (score: number) => void;
}

export default function SpeakingActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'drills' | 'roleplays' | 'assessment'>('drills');
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');

  const { content, title, objectives, estimatedTime } = activity;
  const { drills, roleplays, feedbackRubric } = content;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{estimatedTime}분</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
              {activity.level}
            </span>
            <span>Week {activity.week}</span>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('drills')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'drills'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600'
              }`}
            >
              연습 패턴
            </button>
            <button
              onClick={() => setCurrentSection('roleplays')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'roleplays'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600'
              }`}
            >
              롤플레이
            </button>
            <button
              onClick={() => setCurrentSection('assessment')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'assessment'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600'
              }`}
            >
              평가
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'drills' && (
          <DrillsSection drills={drills} recordingState={recordingState} setRecordingState={setRecordingState} />
        )}
        {currentSection === 'roleplays' && <RoleplaysSection roleplays={roleplays} />}
        {currentSection === 'assessment' && (
          <AssessmentSection
            assessment={activity.assessment}
            feedbackRubric={feedbackRubric}
            recordingState={recordingState}
            setRecordingState={setRecordingState}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}

function DrillsSection({
  drills,
  recordingState,
  setRecordingState,
}: {
  drills: any[];
  recordingState: 'idle' | 'recording' | 'recorded';
  setRecordingState: (state: 'idle' | 'recording' | 'recorded') => void;
}) {
  if (!drills || drills.length === 0) {
    return <div className="text-gray-500">연습 패턴이 없습니다.</div>;
  }

  const handleRecord = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      // TODO: 실제 녹음 시작 로직
      setTimeout(() => setRecordingState('recorded'), 3000); // 시뮬레이션
    } else if (recordingState === 'recording') {
      setRecordingState('recorded');
      // TODO: 녹음 중지 로직
    } else {
      setRecordingState('idle');
      // TODO: 녹음 초기화
    }
  };

  return (
    <div className="space-y-6">
      {/* 안내 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 연습 방법</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 모델 오디오를 먼저 들으세요</li>
          <li>• 패턴을 따라 말하며 연습하세요</li>
          <li>• 빈칸에 다양한 단어를 넣어 반복하세요</li>
          <li>• 녹음하여 자신의 발음을 확인하세요</li>
        </ul>
      </div>

      {/* 드릴 카드 */}
      {drills.map((drill, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-orange-700">{idx + 1}</span>
            </div>
            <div className="flex-1">
              {/* 패턴 */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">연습 패턴</h3>
                <p className="text-2xl font-bold text-gray-900 font-mono">{drill.pattern}</p>
              </div>

              {/* 노트 */}
              {drill.notes && (
                <div className="mb-4 p-3 bg-orange-50 rounded">
                  <p className="text-sm text-orange-900">💡 {drill.notes}</p>
                </div>
              )}

              {/* 모델 오디오 */}
              {drill.audio && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">모델 발음</h3>
                  <audio controls className="w-full" src={drill.audio}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* 녹음 버튼 */}
              <div className="mt-4">
                <button
                  onClick={handleRecord}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    recordingState === 'idle'
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : recordingState === 'recording'
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {recordingState === 'idle' && '🎤 녹음 시작'}
                  {recordingState === 'recording' && '⏹ 녹음 중지'}
                  {recordingState === 'recorded' && '🔄 다시 녹음'}
                </button>
                {recordingState === 'recorded' && (
                  <p className="mt-2 text-sm text-green-600">✓ 녹음 완료! 다시 녹음하거나 다음 패턴으로 이동하세요.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoleplaysSection({ roleplays }: { roleplays: any[] }) {
  if (!roleplays || roleplays.length === 0) {
    return <div className="text-gray-500">롤플레이가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* 안내 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 롤플레이 팁</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 시나리오를 먼저 읽고 상황을 이해하세요</li>
          <li>• 목표 어휘를 사용하여 대화하세요</li>
          <li>• 파트너와 역할을 바꿔가며 연습하세요</li>
          <li>• 자연스러운 억양과 속도로 말하세요</li>
        </ul>
      </div>

      {roleplays.map((roleplay, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{roleplay.title}</h2>

          {/* 상황 설정 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">📋 상황</h3>
            <p className="text-gray-900">{roleplay.setup}</p>
          </div>

          {/* 대화 순서 */}
          {roleplay.prompts && roleplay.prompts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">🔄 대화 순서</h3>
              <div className="flex flex-wrap gap-2">
                {roleplay.prompts.map((prompt: string, pidx: number) => (
                  <div
                    key={pidx}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {pidx + 1}. {prompt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 목표 어휘 */}
          {roleplay.targetVocabulary && roleplay.targetVocabulary.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">📚 사용할 어휘</h3>
              <div className="flex flex-wrap gap-2">
                {roleplay.targetVocabulary.map((vocab: string, vidx: number) => (
                  <span
                    key={vidx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
                  >
                    {vocab}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AssessmentSection({
  assessment,
  feedbackRubric,
  recordingState,
  setRecordingState,
  onComplete,
}: {
  assessment: any;
  feedbackRubric: any;
  recordingState: 'idle' | 'recording' | 'recorded';
  setRecordingState: (state: 'idle' | 'recording' | 'recorded') => void;
  onComplete?: (score: number) => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRecord = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      setTimeout(() => setRecordingState('recorded'), 3000);
    } else if (recordingState === 'recording') {
      setRecordingState('recorded');
    } else {
      setRecordingState('idle');
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    // 말하기 평가는 자동 채점이 어려우므로 임시로 80점 부여
    onComplete?.(80);
  };

  return (
    <div className="space-y-6">
      {/* 평가 기준 */}
      {feedbackRubric && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">평가 기준</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(feedbackRubric).map(([key, value]) => (
              <div key={key} className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-1 capitalize">{key}</h3>
                <p className="text-sm text-orange-700">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 평가 과제 */}
      {assessment && assessment.tasks && assessment.tasks.length > 0 && (
        <div className="space-y-4">
          {assessment.tasks.map((task: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">과제 {idx + 1}</h2>

              {/* 프롬프트 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium">{task.prompt}</p>
              </div>

              {/* 평가 기준 */}
              {task.criteria && task.criteria.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">평가 항목</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.criteria.map((criterion: string, cidx: number) => (
                      <span
                        key={cidx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium"
                      >
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 녹음 영역 */}
              <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="text-center">
                  <button
                    onClick={handleRecord}
                    disabled={isCompleted}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                      isCompleted
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : recordingState === 'idle'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : recordingState === 'recording'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {recordingState === 'idle' && '🎤 녹음 시작'}
                    {recordingState === 'recording' && '⏹ 녹음 중지'}
                    {recordingState === 'recorded' && '🔄 다시 녹음'}
                  </button>

                  {recordingState === 'recorded' && !isCompleted && (
                    <div className="mt-4">
                      <p className="text-green-600 mb-4">✓ 녹음 완료!</p>
                      <button
                        onClick={handleComplete}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        과제 제출
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="mt-4">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-2">완료!</h3>
                        <p className="text-lg">과제가 제출되었습니다.</p>
                        <p className="text-sm mt-1 opacity-90">교사의 피드백을 기다려주세요.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">📝 참고</h3>
        <p className="text-sm text-yellow-800">
          현재는 녹음 시뮬레이션만 제공됩니다. 실제 녹음 기능은 Web Speech API 또는 MediaRecorder API를 통해 구현 예정입니다.
        </p>
      </div>
    </div>
  );
}
