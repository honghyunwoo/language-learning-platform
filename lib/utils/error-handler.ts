/**
 * Error Handler Utilities
 *
 * Firestore 및 네트워크 에러 처리를 위한 유틸리티 함수
 */

import { FirebaseError } from 'firebase/app';

/**
 * Firebase 에러 코드별 사용자 친화적 메시지
 */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Auth 에러
  'auth/user-not-found': '사용자를 찾을 수 없습니다.',
  'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
  'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
  'auth/weak-password': '비밀번호가 너무 약합니다. 6자 이상 입력하세요.',
  'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
  'auth/operation-not-allowed': '이 작업은 허용되지 않습니다.',
  'auth/account-exists-with-different-credential': '다른 인증 방법으로 이미 가입된 계정입니다.',
  'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
  'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도하세요.',

  // Firestore 에러
  'permission-denied': '접근 권한이 없습니다.',
  'not-found': '요청한 데이터를 찾을 수 없습니다.',
  'already-exists': '이미 존재하는 데이터입니다.',
  'resource-exhausted': '할당량을 초과했습니다. 잠시 후 다시 시도하세요.',
  'failed-precondition': '작업 조건이 충족되지 않았습니다.',
  'aborted': '작업이 중단되었습니다. 다시 시도하세요.',
  'out-of-range': '유효한 범위를 벗어났습니다.',
  'unimplemented': '아직 구현되지 않은 기능입니다.',
  'internal': '내부 서버 오류가 발생했습니다.',
  'unavailable': '서비스를 일시적으로 사용할 수 없습니다.',
  'data-loss': '데이터 손실이 발생했습니다.',
  'unauthenticated': '로그인이 필요합니다.',

  // 일반 네트워크 에러
  'network-error': '네트워크 연결을 확인해주세요.',
  'timeout': '요청 시간이 초과되었습니다.',
};

/**
 * Firebase 에러를 사용자 친화적 메시지로 변환
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return FIREBASE_ERROR_MESSAGES[error.code] || `오류가 발생했습니다: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 에러 타입 판별
 */
export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.code.startsWith('auth/');
  }
  return false;
}

export function isPermissionError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.code === 'permission-denied';
  }
  return false;
}

/**
 * 재시도 가능한 에러인지 확인
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    const retryableCodes = [
      'unavailable',
      'deadline-exceeded',
      'resource-exhausted',
      'aborted',
      'auth/network-request-failed',
    ];
    return retryableCodes.includes(error.code);
  }

  if (isNetworkError(error)) {
    return true;
  }

  return false;
}

/**
 * 지수 백오프로 재시도 함수
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 재시도 불가능한 에러는 즉시 throw
      if (!isRetryableError(error)) {
        throw error;
      }

      // 마지막 시도였으면 throw
      if (attempt === maxRetries) {
        throw error;
      }

      // 백오프 대기
      console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);
      await sleep(delay);

      // 다음 딜레이 계산 (지수 백오프)
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
}

/**
 * 딜레이 유틸리티
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 에러 로깅 (프로덕션에서는 Sentry 등 사용)
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);

    if (error instanceof FirebaseError) {
      console.error('Firebase Error Details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
    }
  } else {
    // 프로덕션에서는 에러 추적 서비스로 전송
    // TODO: Sentry.captureException(error);
  }
}

/**
 * Try-Catch 래퍼 (에러 핸들링 간소화)
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    logError(error, errorMessage);
    return [null, error instanceof Error ? error : new Error('Unknown error')];
  }
}

/**
 * Firestore 작업 래퍼 (재시도 + 에러 처리)
 */
export async function firestoreOperation<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await retryWithBackoff(operation, {
      maxRetries: 2,
      initialDelay: 500,
    });
  } catch (error) {
    logError(error, context);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * 에러 상태 객체
 */
export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  isRetryable: boolean;
}

/**
 * 에러를 ErrorState로 변환
 */
export function createErrorState(error: unknown): ErrorState {
  const message = getFirebaseErrorMessage(error);
  const code = error instanceof FirebaseError ? error.code : undefined;
  const retryable = isRetryableError(error);

  return {
    hasError: true,
    message,
    code,
    isRetryable: retryable,
  };
}

/**
 * 초기 에러 상태
 */
export const INITIAL_ERROR_STATE: ErrorState = {
  hasError: false,
  message: '',
  isRetryable: false,
};
