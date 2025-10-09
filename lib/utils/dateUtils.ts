import { Timestamp } from 'firebase/firestore';

/**
 * Firestore Timestamp를 JavaScript Date 객체로 변환
 */
export function timestampToDate(timestamp: Timestamp | Date | undefined | null): Date | null {
  if (!timestamp) {
    return null;
  }

  // 이미 Date 객체인 경우
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Firestore Timestamp인 경우
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  // Timestamp-like 객체인 경우 (seconds, nanoseconds 속성)
  if (
    typeof timestamp === 'object' &&
    'seconds' in timestamp &&
    'nanoseconds' in timestamp &&
    typeof (timestamp as { seconds: unknown }).seconds === 'number' &&
    typeof (timestamp as { nanoseconds: unknown }).nanoseconds === 'number'
  ) {
    return new Timestamp(
      (timestamp as { seconds: number }).seconds,
      (timestamp as { nanoseconds: number }).nanoseconds
    ).toDate();
  }

  return null;
}

/**
 * Firestore Timestamp를 상대 시간 문자열로 변환 (예: "3분 전", "2시간 전")
 */
export function timestampToRelative(timestamp: Timestamp | Date | undefined | null): string {
  const date = timestampToDate(timestamp);
  if (!date) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
}

/**
 * Firestore Timestamp를 한국어 날짜 형식으로 변환 (예: "2025년 10월 8일")
 */
export function timestampToKoreanDate(timestamp: Timestamp | Date | undefined | null): string {
  const date = timestampToDate(timestamp);
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Firestore Timestamp를 한국어 날짜/시간 형식으로 변환 (예: "2025년 10월 8일 14:30")
 */
export function timestampToKoreanDateTime(timestamp: Timestamp | Date | undefined | null): string {
  const date = timestampToDate(timestamp);
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}년 ${month}월 ${day}일 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Firestore Timestamp를 ISO 8601 형식으로 변환 (예: "2025-10-08T14:30:00")
 */
export function timestampToISO(timestamp: Timestamp | Date | undefined | null): string {
  const date = timestampToDate(timestamp);
  if (!date) {
    return '';
  }

  return date.toISOString();
}

/**
 * 두 Timestamp 간의 차이를 일 단위로 계산
 */
export function daysBetween(
  start: Timestamp | Date | undefined | null,
  end: Timestamp | Date | undefined | null
): number {
  const startDate = timestampToDate(start);
  const endDate = timestampToDate(end);

  if (!startDate || !endDate) {
    return 0;
  }

  const diffInMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Timestamp가 오늘인지 확인
 */
export function isToday(timestamp: Timestamp | Date | undefined | null): boolean {
  const date = timestampToDate(timestamp);
  if (!date) {
    return false;
  }

  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Timestamp가 이번 주인지 확인
 */
export function isThisWeek(timestamp: Timestamp | Date | undefined | null): boolean {
  const date = timestampToDate(timestamp);
  if (!date) {
    return false;
  }

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // 일요일 기준
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}
