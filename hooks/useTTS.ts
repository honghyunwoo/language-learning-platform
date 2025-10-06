import { useState, useEffect, useCallback } from 'react';

interface UseTTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useTTS(options: UseTTSOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    lang = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
  } = options;

  // 브라우저 지원 및 음성 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // 선택된 언어에 맞는 음성 자동 선택
        const langVoice =
          availableVoices.find((v) => v.lang === lang) ||
          availableVoices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
          availableVoices[0];

        setSelectedVoice(langVoice || null);
      };

      loadVoices();

      // 음성 목록 변경 시 재로드
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setIsSupported(false);
      setError('이 브라우저는 음성 합성(TTS)을 지원하지 않습니다.');
    }

    return () => {
      // cleanup: 남아있는 음성 중지
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lang]);

  // 텍스트 읽기
  const speak = useCallback(
    (text: string, customOptions?: Partial<UseTTSOptions>) => {
      if (!isSupported || !text) {
        setError('음성 합성을 사용할 수 없습니다.');
        return;
      }

      // 기존 음성 중지
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // 옵션 적용 (커스텀 옵션 우선)
      utterance.lang = customOptions?.lang || lang;
      utterance.rate = customOptions?.rate || rate;
      utterance.pitch = customOptions?.pitch || pitch;
      utterance.volume = customOptions?.volume || volume;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // 이벤트 핸들러
      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('TTS Error:', event);
        setIsSpeaking(false);
        setError(`음성 합성 오류: ${event.error}`);
      };

      // 음성 재생
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice, lang, rate, pitch, volume]
  );

  // 음성 중지
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // 일시정지
  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSpeaking]);

  // 재개
  const resume = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.resume();
    }
  }, [isSpeaking]);

  // 음성 변경
  const changeVoice = useCallback((voiceName: string) => {
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  }, [voices]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    error,
    speak,
    stop,
    pause,
    resume,
    changeVoice,
  };
}
