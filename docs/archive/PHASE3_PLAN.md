# Phase 3 계획 - 커리큘럼 시스템

## 목표
사용자가 주차별 학습 커리큘럼을 탐색하고, 활동을 완료하며, 진행률을 추적할 수 있는 시스템 구현

## 데이터 구조

### CurriculumWeek
```typescript
interface CurriculumWeek {
  id: string;                    // 예: "A1-W1"
  level: UserLevel;              // "A1" | "A2" | "B1" | "B2"
  weekNumber: number;            // 1-12
  title: string;                 // "기초 인사와 자기소개"
  description: string;
  objectives: string[];          // 학습 목표
  activities: Activity[];
  estimatedTime: number;         // 총 예상 소요 시간 (분)
}

interface Activity {
  id: string;
  type: 'reading' | 'listening' | 'speaking' | 'writing' | 'vocabulary' | 'grammar';
  title: string;
  description: string;
  duration: number;              // 예상 소요 시간 (분)
  difficulty: 1 | 2 | 3;         // 난이도
  order: number;                 // 순서
  requiredForCompletion: boolean;
  resources?: {
    contentUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
  };
}
```

### UserWeekProgress
```typescript
interface UserWeekProgress {
  userId: string;
  weekId: string;
  startedAt: string;             // ISO date
  completedAt?: string;
  completedActivities: string[]; // Activity IDs
  timeSpent: number;             // 총 소요 시간 (분)
  lastAccessedAt: string;
}
```

## 구현 작업

### 1. Firestore 데이터 초기화
- `lib/curriculum/curriculumData.ts` - 샘플 커리큘럼 데이터
- `scripts/seedCurriculum.ts` - Firestore에 데이터 업로드 스크립트
- A1 레벨 Week 1-4 샘플 데이터 작성

### 2. 커리큘럼 데이터 훅
- `hooks/useCurriculum.ts`
  - `useCurriculumWeeks(level)` - 레벨별 주차 목록
  - `useCurriculumWeek(weekId)` - 특정 주차 상세
  - `useWeekProgress(weekId)` - 주차 진행률
  - `useActivityCompletion()` - 활동 완료 처리

### 3. 커리큘럼 페이지 컴포넌트

#### `/dashboard/curriculum` (목록)
- 현재 레벨 주차 그리드
- 각 주차 카드:
  - 제목, 설명
  - 진행률 바
  - 예상 시간
  - 상태 (시작 전, 진행 중, 완료)
- 레벨 선택 탭 (A1, A2, B1, B2)

#### `/dashboard/curriculum/[weekId]` (상세)
- 주차 헤더
  - 제목, 설명
  - 학습 목표 리스트
  - 전체 진행률
- 활동 리스트
  - 활동 타입 아이콘
  - 제목, 설명
  - 예상 시간
  - 난이도 표시
  - 완료 체크박스
  - 시작 버튼

#### `/dashboard/curriculum/[weekId]/[activityId]` (활동)
- 활동 콘텐츠 영역
- 타이머 (자동 시작)
- 완료 버튼
- 이전/다음 활동 네비게이션

### 4. 컴포넌트 구조
```
components/curriculum/
  WeekCard.tsx          - 주차 카드
  WeekHeader.tsx        - 주차 상세 헤더
  ActivityItem.tsx      - 활동 아이템
  ActivityContent.tsx   - 활동 콘텐츠 래퍼
  ProgressCircle.tsx    - 원형 진행률
  ActivityTypeIcon.tsx  - 활동 타입별 아이콘
  LevelTabs.tsx         - 레벨 선택 탭
```

## 예상 시간
- 데이터 구조 및 샘플 데이터: 30분
- 데이터 훅 구현: 45분
- 커리큘럼 목록 페이지: 45분
- 주차 상세 페이지: 45분
- 활동 페이지 기본 구조: 30분
- 테스트 및 버그 수정: 30분
**총 예상: 약 3.5시간**

## 우선순위
1. 데이터 구조 및 타입 정의
2. 샘플 데이터 작성 (A1-W1 최소)
3. 커리큘럼 목록 페이지
4. 주차 상세 페이지
5. 활동 완료 처리 로직
6. 진행률 추적

## 기술 스택
- React Query - 데이터 페칭
- Firestore - 커리큘럼 및 진행률 저장
- Zustand - 타이머 상태 관리 (선택)
- Chart.js - 진행률 시각화 (재사용)

## 다음 단계
Phase 3 완료 후:
- Phase 4: 학습 일지 (시간 추적, 메모)
- Phase 5: 실제 활동 콘텐츠 (읽기, 듣기, 말하기, 쓰기)
