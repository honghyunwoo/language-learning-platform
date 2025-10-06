'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, SignUpData } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { UserLevel, LearningGoal, DailyLearningTime } from '@/types/user';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { signUp, signInWithGoogle, loading, error } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    nickname: '',
    level: 'A1',
    learningGoal: 'hobby',
    dailyLearningTime: 30,
  });

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    nickname?: string;
  }>({});

  // 1단계 유효성 검사 (계정 정보)
  const validateStep1 = (): boolean => {
    const errors: { email?: string; password?: string; nickname?: string } = {};

    if (!formData.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.nickname) {
      errors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2) {
      errors.nickname = '닉네임은 최소 2자 이상이어야 합니다.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 다음 단계로
  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signUp(formData);
      router.push(redirect);
    } catch {
      // 에러는 useAuth에서 처리됨
    }
  };

  // Google 로그인
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push(redirect);
    } catch {
      // 에러는 useAuth에서 처리됨
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md" padding="lg">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            영어 학습 여정을 시작하세요
          </p>
        </div>

        {/* 단계 표시 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              1
            </div>
            <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 1단계: 계정 정보 */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="이메일"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={formErrors.email}
              fullWidth
              autoComplete="email"
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="••••••••"
              helperText="최소 6자 이상"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={formErrors.password}
              fullWidth
              autoComplete="new-password"
            />

            <Input
              label="닉네임"
              type="text"
              placeholder="학습자123"
              helperText="다른 사용자에게 표시될 이름입니다"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              error={formErrors.nickname}
              fullWidth
              autoComplete="username"
            />

            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleNext}
            >
              다음
            </Button>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  또는
                </span>
              </div>
            </div>

            {/* Google 회원가입 */}
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 회원가입
            </Button>
          </div>
        )}

        {/* 2단계: 학습 정보 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 현재 레벨 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                현재 영어 레벨
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['A1', 'A2', 'B1', 'B2'] as UserLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, level })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.level === level
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-lg">{level}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {level === 'A1' && '기초'}
                      {level === 'A2' && '초급'}
                      {level === 'B1' && '중급'}
                      {level === 'B2' && '중상급'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 학습 목표 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                학습 목표
              </label>
              <div className="space-y-2">
                {[
                  { value: 'travel' as LearningGoal, label: '여행' },
                  { value: 'business' as LearningGoal, label: '비즈니스' },
                  { value: 'exam' as LearningGoal, label: '시험' },
                  { value: 'hobby' as LearningGoal, label: '취미' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, learningGoal: goal.value })
                    }
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      formData.learningGoal === goal.value
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 하루 학습 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                하루 목표 학습 시간
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 30 as DailyLearningTime, label: '30분' },
                  { value: 60 as DailyLearningTime, label: '1시간' },
                  { value: 90 as DailyLearningTime, label: '1.5시간' },
                ].map((time) => (
                  <button
                    key={time.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, dailyLearningTime: time.value })
                    }
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.dailyLearningTime === time.value
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                이전
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                회원가입 완료
              </Button>
            </div>
          </form>
        )}

        {/* 로그인 링크 */}
        {step === 1 && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              로그인
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
