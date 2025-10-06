'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/components/ui';

export default function APITestPage() {
  // Web Speech API (TTS) 상태
  const [ttsText, setTtsText] = useState(
    'Hello, how are you? This is a test of the Web Speech API.'
  );
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [ttsVoice, setTtsVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  // MediaRecorder API 상태
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSupported, setRecordingSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // 영어 음성 자동 선택 (미국 영어 우선)
        const enVoice =
          availableVoices.find((v) => v.lang === 'en-US') ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0];
        setTtsVoice(enVoice || null);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // MediaRecorder 지원 확인
    if (typeof window !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function') {
      setRecordingSupported(true);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // TTS 재생
  const handleSpeak = () => {
    if (!ttsSupported || !ttsText) return;

    // 기존 음성 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.rate = ttsSpeed;
    if (ttsVoice) {
      utterance.voice = ttsVoice;
    }

    utterance.onstart = () => setIsTtsSpeaking(true);
    utterance.onend = () => setIsTtsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      setIsTtsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // TTS 중지
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsTtsSpeaking(false);
  };

  // 녹음 시작
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Recording Error:', error);
      alert('마이크 권한을 허용해주세요.');
    }
  };

  // 녹음 중지
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // 녹음 재생
  const handlePlayRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">API 기술 검증 테스트</h1>

      {/* Web Speech API (TTS) 테스트 */}
      <Card padding="lg" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Web Speech API (Text-to-Speech)
        </h2>

        {!ttsSupported ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">
              ❌ 이 브라우저는 Web Speech API를 지원하지 않습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-400">
                ✅ Web Speech API 지원됨
              </p>
            </div>

            {/* 텍스트 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                읽을 텍스트
              </label>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                rows={3}
              />
            </div>

            {/* 속도 조절 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                속도: {ttsSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x (매우 느림 - A1)</span>
                <span>1.0x (보통 - B1)</span>
                <span>2.0x (매우 빠름)</span>
              </div>
            </div>

            {/* 음성 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                음성 선택 ({voices.length}개 사용 가능)
              </label>
              <select
                value={ttsVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find((v) => v.name === e.target.value);
                  setTtsVoice(voice || null);
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex gap-3">
              <Button
                onClick={handleSpeak}
                disabled={isTtsSpeaking || !ttsText}
                variant="primary"
              >
                {isTtsSpeaking ? '재생 중...' : '재생'}
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isTtsSpeaking}
                variant="secondary"
              >
                중지
              </Button>
            </div>

            {/* 테스트 결과 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <h3 className="font-semibold mb-2">테스트 결과:</h3>
              <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>✅ 사용 가능한 음성: {voices.length}개</li>
                <li>
                  ✅ 영어 음성:{' '}
                  {voices.filter((v) => v.lang.startsWith('en')).length}개
                </li>
                <li>✅ 속도 조절: 0.5x ~ 2.0x 가능</li>
                <li>
                  ✅ 현재 선택: {ttsVoice?.name} ({ttsVoice?.lang})
                </li>
              </ul>
            </div>
          </div>
        )}
      </Card>

      {/* MediaRecorder API 테스트 */}
      <Card padding="lg">
        <h2 className="text-2xl font-semibold mb-4">
          2. MediaRecorder API (음성 녹음)
        </h2>

        {!recordingSupported ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">
              ❌ 이 브라우저는 MediaRecorder API를 지원하지 않습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-400">
                ✅ MediaRecorder API 지원됨
              </p>
            </div>

            {/* 녹음 상태 */}
            {isRecording && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-red-700 dark:text-red-400">
                      녹음 중...
                    </span>
                  </div>
                  <span className="font-mono text-lg">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>
            )}

            {/* 컨트롤 버튼 */}
            <div className="flex gap-3">
              {!isRecording ? (
                <Button onClick={handleStartRecording} variant="primary">
                  녹음 시작
                </Button>
              ) : (
                <Button onClick={handleStopRecording} variant="secondary">
                  녹음 중지
                </Button>
              )}

              {audioBlob && (
                <Button onClick={handlePlayRecording} variant="secondary">
                  녹음 재생
                </Button>
              )}
            </div>

            {/* 녹음 결과 */}
            {audioBlob && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">녹음 완료:</h3>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>✅ 파일 크기: {(audioBlob.size / 1024).toFixed(2)} KB</li>
                  <li>✅ 타입: {audioBlob.type}</li>
                  <li>✅ 녹음 시간: {formatTime(recordingTime)}</li>
                </ul>

                {/* 오디오 플레이어 */}
                <audio controls src={audioUrl || ''} className="w-full mt-3" />
              </div>
            )}

            {/* 테스트 안내 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
              <h3 className="font-semibold mb-2">테스트 방법:</h3>
              <ol className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>
                  &ldquo;녹음 시작&rdquo; 버튼을 클릭하세요 (마이크 권한 필요)
                </li>
                <li>아무 말이나 5초 정도 녹음하세요</li>
                <li>&ldquo;녹음 중지&rdquo; 버튼을 클릭하세요</li>
                <li>&ldquo;녹음 재생&rdquo; 버튼으로 녹음된 음성을 들어보세요</li>
              </ol>
            </div>
          </div>
        )}
      </Card>

      {/* 종합 결과 */}
      <Card padding="lg" className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">종합 결과</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={ttsSupported ? 'text-green-600' : 'text-red-600'}>
              {ttsSupported ? '✅' : '❌'}
            </span>
            <span>
              Web Speech API (TTS):{' '}
              <strong>{ttsSupported ? '지원됨' : '지원 안 됨'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={recordingSupported ? 'text-green-600' : 'text-red-600'}
            >
              {recordingSupported ? '✅' : '❌'}
            </span>
            <span>
              MediaRecorder API (녹음):{' '}
              <strong>{recordingSupported ? '지원됨' : '지원 안 됨'}</strong>
            </span>
          </div>
        </div>

        {ttsSupported && recordingSupported && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-700 dark:text-green-400 font-semibold">
              ✅ 모든 API가 정상적으로 작동합니다!
              <br />
              Listening 및 Speaking Activity 구현 가능합니다.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
