# Phase 4 계획 - 학습 일지 시스템

## 목표
사용자의 학습 활동을 기록하고, 메모를 작성하며, 학습 패턴을 분석할 수 있는 학습 일지 시스템 구현

## 데이터 구조

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  userId: string;
  date: string;                  // YYYY-MM-DD 형식
  learningTime: number;          // 분 단위
  completedActivities: {
    weekId: string;
    activityId: string;
    activityTitle: string;
    timeSpent: number;
  }[];
  notes: string;                 // 사용자 메모
  mood?: 'great' | 'good' | 'okay' | 'bad';
  difficulty?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### LearningStreak
```typescript
interface LearningStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLearningDate: string;
  streakHistory: {
    date: string;
    maintained: boolean;
  }[];
}
```

## 구현 작업

### 1. 데이터 훅

#### hooks/useJournal.ts
- `useJournalEntries(userId, startDate?, endDate?)` - 일지 목록 조회
- `useJournalEntry(userId, date)` - 특정 날짜 일지 조회
- `useCreateJournalEntry()` - 일지 생성
- `useUpdateJournalEntry()` - 일지 수정
- `useDeleteJournalEntry()` - 일지 삭제

#### hooks/useStreak.ts (실제 구현)
- `useUserStreak(userId)` - 스트릭 정보 조회
- `useUpdateStreak()` - 스트릭 업데이트

### 2. 학습 일지 페이지

#### /dashboard/journal (목록)
- 캘린더 뷰
  - 월간 달력
  - 학습한 날 표시 (점 또는 색상)
  - 스트릭 표시
- 리스트 뷰
  - 최근 일지 목록
  - 날짜별 학습 시간
  - 완료한 활동 수
- 통계 카드
  - 이번 달 총 학습 시간
  - 이번 달 학습 일수
  - 현재 스트릭
  - 최장 스트릭

#### /dashboard/journal/[date] (상세)
- 날짜 정보
- 학습 활동 목록
  - 완료한 활동
  - 각 활동 소요 시간
- 총 학습 시간
- 메모 에디터
  - Markdown 지원
  - 실시간 미리보기
- 기분/난이도 선택
- 태그 추가

### 3. 자동 일지 생성
- 활동 완료 시 자동으로 해당 날짜 일지에 기록
- 기존 일지가 있으면 업데이트, 없으면 생성
- 학습 시간 자동 집계

### 4. 스트릭 시스템
- 연속 학습일 계산
- 마지막 학습 날짜 추적
- 스트릭 깨짐 알림
- 스트릭 복구 기능 (선택)

## UI 컴포넌트

### components/journal/
- `Calendar.tsx` - 학습 캘린더
- `JournalCard.tsx` - 일지 카드
- `ActivityLog.tsx` - 활동 로그
- `MoodSelector.tsx` - 기분 선택기
- `NoteEditor.tsx` - 메모 에디터
- `StreakBadge.tsx` - 스트릭 배지
- `LearningStats.tsx` - 학습 통계

## 예상 시간
- 데이터 구조 및 타입: 20분
- 데이터 훅: 40분
- 캘린더 컴포넌트: 45분
- 일지 목록 페이지: 40분
- 일지 상세 페이지: 45분
- 스트릭 시스템: 30분
- 자동 일지 생성 연동: 20분
- 테스트: 20분
**총 예상: 약 4시간**

## 우선순위
1. 타입 및 데이터 구조
2. 기본 일지 CRUD 훅
3. 일지 목록 페이지 (리스트 뷰)
4. 일지 상세 페이지
5. 자동 일지 생성 연동
6. 캘린더 뷰
7. 스트릭 시스템

## 기술 스택
- React Query - 데이터 관리
- Firestore - 일지 저장
- React Markdown - 메모 렌더링
- date-fns (선택) - 날짜 처리

## 다음 단계
Phase 4 완료 후:
- Phase 5: 실제 활동 콘텐츠 (읽기, 듣기, 말하기, 쓰기)
- Phase 6: 커뮤니티 기능
