'use client';

/**
 * Listening Activity 렌더링 컴포넌트
 */

import { useState, useRef } from 'react';
import { ListeningActivity } from '@/lib/types/uploaded-activity';

interface Props {
  activity: ListeningActivity;
  onComplete?: (score: number) => void;
}

export default function ListeningActivityView({ activity, onComplete }: Props) {
  const [currentSection, setCurrentSection] = useState<'listen' | 'transcript' | 'phonology' | 'exercises'>('listen');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { content, title, objectives, estimatedTime, audioFiles } = activity;
  const { scenario, fullTranscript, phonologicalAnalysis, listeningExercises } = content;

  const handleSubmit = () => {
    setShowResults(true);
    const exercises = listeningExercises || [];
    let correct = 0;
    exercises.forEach((ex: any, idx: number) => {
      if (userAnswers[idx] === ex.correct) {
        correct++;
      }
    });
    const score = exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0;
    onComplete?.(score);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{estimatedTime}분</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              {activity.level}
            </span>
            <span>Week {activity.week}</span>
          </div>

          {/* 학습 목표 */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-semibold text-green-900 mb-2">🎯 학습 목표</h3>
            <ul className="space-y-1">
              {objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setCurrentSection('listen')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'listen'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              듣기
            </button>
            <button
              onClick={() => setCurrentSection('transcript')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'transcript'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              스크립트
            </button>
            <button
              onClick={() => setCurrentSection('phonology')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'phonology'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              음운 분석
            </button>
            <button
              onClick={() => setCurrentSection('exercises')}
              className={`px-4 py-2 font-medium text-sm ${
                currentSection === 'exercises'
                  ? 'text-green-600 border-b-2 border-green-600'
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
        {currentSection === 'listen' && (
          <ListenSection
            scenario={scenario}
            audioFiles={audioFiles}
            audioRef={audioRef}
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
          />
        )}
        {currentSection === 'transcript' && <TranscriptSection transcript={fullTranscript} />}
        {currentSection === 'phonology' && <PhonologySection analysis={phonologicalAnalysis} />}
        {currentSection === 'exercises' && (
          <ExercisesSection
            exercises={listeningExercises || []}
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

function ListenSection({
  scenario,
  audioFiles,
  audioRef,
  playbackSpeed,
  onSpeedChange,
}: {
  scenario: any;
  audioFiles: any;
  audioRef: React.RefObject<HTMLAudioElement>;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 시나리오 정보 */}
      {scenario && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">시나리오</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">장소:</span>
              <span className="ml-2 text-gray-600">{scenario.setting}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">길이:</span>
              <span className="ml-2 text-gray-600">{scenario.length}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">속도:</span>
              <span className="ml-2 text-gray-600">{scenario.wpm} WPM</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">참여자:</span>
              <span className="ml-2 text-gray-600">
                {scenario.participants?.map((p: any) => `${p.name} (${p.role})`).join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 오디오 플레이어 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">오디오</h2>

        {/* 메인 오디오 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-700">정상 속도</span>
          </div>
          <audio
            ref={audioRef}
            controls
            className="w-full"
            src={audioFiles.main}
          >
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* 느린 속도 오디오 */}
        {audioFiles.slow && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">느린 속도</span>
            </div>
            <audio
              controls
              className="w-full"
              src={audioFiles.slow}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* 재생 속도 조절 */}
        <div className="mt-4">
          <span className="font-semibold text-gray-700 block mb-2">재생 속도</span>
          <div className="flex gap-2">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  playbackSpeed === speed
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* 세그먼트 오디오 */}
        {audioFiles.segments && audioFiles.segments.length > 0 && (
          <div className="mt-6">
            <span className="font-semibold text-gray-700 block mb-3">구간별 듣기</span>
            <div className="space-y-2">
              {audioFiles.segments.map((segment: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">구간 {idx + 1}</span>
                  <audio
                    controls
                    className="flex-1"
                    src={segment}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 듣기 팁 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 듣기 팁</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 먼저 전체를 들으며 전반적인 내용을 파악하세요</li>
          <li>• 두 번째는 세부 정보에 집중하세요</li>
          <li>• 어려운 부분은 느린 속도나 구간별로 반복해서 들으세요</li>
          <li>• 스크립트는 충분히 듣기 연습 후 확인하세요</li>
        </ul>
      </div>
    </div>
  );
}

function TranscriptSection({ transcript }: { transcript: any }) {
  if (!transcript || !transcript.paragraphs) {
    return <div className="text-gray-500">스크립트가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {transcript.paragraphs.map((para: any, idx: number) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-green-700">{para.speaker}</span>
            </div>
            <div className="flex-1">
              {/* 타임스탬프 */}
              <div className="text-xs text-gray-500 mb-2">{para.timestamp}</div>

              {/* 텍스트 */}
              <p className="text-gray-900 font-medium mb-3">{para.text}</p>

              {/* IPA 발음 */}
              {para.ipa && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <span className="text-xs font-semibold text-gray-600 block mb-1">IPA 발음</span>
                  <code className="text-sm text-gray-900 font-mono">{para.ipa}</code>
                </div>
              )}

              {/* 발음 노트 */}
              {para.phoneticNotes && para.phoneticNotes.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-600 block mb-1">발음 포인트</span>
                  <ul className="space-y-1">
                    {para.phoneticNotes.map((note: string, nidx: number) => (
                      <li key={nidx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500">▸</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 억양 패턴 */}
              {para.intonation && (
                <div className="p-3 bg-blue-50 rounded">
                  <span className="text-xs font-semibold text-blue-700 block mb-1">억양 패턴</span>
                  <code className="text-sm text-blue-900 font-mono">{para.intonation.pattern}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhonologySection({ analysis }: { analysis: any }) {
  if (!analysis) {
    return <div className="text-gray-500">음운 분석이 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* 미국 영어 특징 */}
      {analysis.americanFeatures && analysis.americanFeatures.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">미국 영어 음운 특징</h2>
          <div className="space-y-3">
            {analysis.americanFeatures.map((feature: any, idx: number) => (
              <div key={idx} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">{feature.feature}</h3>
                <code className="text-sm text-gray-600 font-mono">{feature.example}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 연음 현상 */}
      {analysis.connectedSpeech && analysis.connectedSpeech.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">연음 현상</h2>
          <div className="space-y-3">
            {analysis.connectedSpeech.map((speech: any, idx: number) => (
              <div key={idx} className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">{speech.phenomenon}</h3>
                <code className="text-sm text-green-800 font-mono">{speech.example}</code>
              </div>
            ))}
          </div>
        </div>
      )}
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
  exercises: any[];
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
            <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold">
              {idx + 1}
            </span>
            <div className="flex-1">
              {/* 문제 */}
              <p className="text-gray-900 font-medium mb-3">{ex.question}</p>

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
                            : 'border-green-500 bg-green-50'
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

              {/* 오디오 세그먼트 표시 */}
              {ex.audioSegment && (
                <div className="mt-3 text-xs text-gray-500">
                  🎧 {ex.audioSegment === 'main' ? '전체 오디오' : `구간 오디오 참고`}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {!showResults && (
        <button
          onClick={onSubmit}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          제출하기
        </button>
      )}

      {showResults && (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">완료!</h3>
          <p className="text-lg">
            {exercises.filter((ex, idx) => userAnswers[idx] === ex.correct).length} / {exercises.length} 정답
          </p>
        </div>
      )}
    </div>
  );
}
