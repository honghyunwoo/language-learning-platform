# Phase 2 개발 계획: 대시보드

## 목표
인증된 사용자를 위한 학습 대시보드 구현

---

## 1. 아키텍처 설계

### 1.1 페이지 구조
```
/dashboard                  # 대시보드 홈 (학습 통계, 진행상황)
├── /profile               # 프로필 관리
├── /curriculum            # 커리큘럼 (주차별)
├── /journal               # 학습 일지
├── /community             # 커뮤니티 (게시글)
└── /resources             # 학습 리소스
```

### 1.2 레이아웃 계층
```
RootLayout (app/layout.tsx)
└── DashboardLayout (app/dashboard/layout.tsx)
    ├── Header (고정, 모든 페이지)
    ├── Sidebar (데스크톱, 모바일 토글)
    └── Main Content (각 페이지)
```

### 1.3 데이터 흐름
```
Firebase Auth → useAuth → Zustand Store → Dashboard Components
                    ↓
              Firestore → useUserProgress → Dashboard Stats
```

---

## 2. 상세 작업 분석

### Task 1: 인증 미들웨어 (선행 작업)
**목적**: 비인증 사용자의 대시보드 접근 차단

**구현 방법**:
1. Next.js Middleware 생성 (`middleware.ts`)
2. `/dashboard/*` 경로 보호
3. 미인증 시 `/login?redirect=/dashboard` 리다이렉트
4. 인증 후 원래 페이지로 복귀

**파일**: `middleware.ts`

**예상 시간**: 15분

---

### Task 2: 대시보드 레이아웃 설계
**목적**: 일관된 UI 구조 및 네비게이션

**설계 고려사항**:
- **반응형**: 데스크톱(Sidebar), 모바일(햄버거 메뉴)
- **접근성**: 키보드 네비게이션, ARIA 속성
- **성능**: 레이아웃 시프트 방지, 스켈레톤 로딩

**컴포넌트 구조**:
```
DashboardLayout
├── Header (Sticky, z-50)
│   ├── Logo
│   ├── Mobile Menu Button
│   ├── Search (향후)
│   └── User Menu (프로필, 설정, 로그아웃)
├── Sidebar (Desktop: Fixed, Mobile: Overlay)
│   ├── Navigation Items
│   │   ├── 대시보드 (/)
│   │   ├── 커리큘럼 (/curriculum)
│   │   ├── 학습 일지 (/journal)
│   │   ├── 커뮤니티 (/community)
│   │   └── 리소스 (/resources)
│   └── User Profile Card
└── Main (Content Area)
```

**파일**:
- `app/dashboard/layout.tsx`
- `components/layout/Header.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/UserMenu.tsx`

**예상 시간**: 60분

---

### Task 3: Header 컴포넌트
**목적**: 전역 네비게이션 및 사용자 액션

**기능**:
1. 로고 (클릭 시 /dashboard)
2. 모바일 메뉴 토글 버튼
3. 검색 바 (향후)
4. 알림 아이콘 (향후)
5. 사용자 드롭다운 메뉴

**드롭다운 메뉴 항목**:
- 프로필 보기
- 설정
- 도움말
- 로그아웃

**기술 스택**:
- Headless UI Menu (접근성)
- Zustand (사용자 정보)
- Next.js Link (네비게이션)

**상태 관리**:
- 모바일 메뉴 열림/닫힘
- 드롭다운 열림/닫힘

**예상 시간**: 30분

---

### Task 4: Sidebar 컴포넌트
**목적**: 주요 네비게이션 메뉴

**기능**:
1. 네비게이션 아이템 (활성 상태 표시)
2. 사용자 프로필 카드 (하단)
3. 모바일: 오버레이 + 애니메이션
4. 데스크톱: 고정 사이드바

**네비게이션 아이템**:
```typescript
const navItems = [
  { name: '대시보드', href: '/dashboard', icon: HomeIcon },
  { name: '커리큘럼', href: '/dashboard/curriculum', icon: BookIcon },
  { name: '학습 일지', href: '/dashboard/journal', icon: DocumentIcon },
  { name: '커뮤니티', href: '/dashboard/community', icon: UsersIcon },
  { name: '리소스', href: '/dashboard/resources', icon: CollectionIcon },
];
```

**반응형 디자인**:
- Desktop: `w-64` 고정, `translate-x-0`
- Mobile: 전체 화면 오버레이, `translate-x-full` (닫힘)

**예상 시간**: 40분

---

### Task 5: 대시보드 홈 페이지 기본 구조
**목적**: 학습 현황 한눈에 파악

**섹션 구성**:
1. **환영 메시지**: "안녕하세요, {닉네임}님! 🎉"
2. **학습 통계 카드** (3-4개 그리드)
   - 총 학습 시간
   - 연속 학습일 (스트릭)
   - 현재 주차
   - 이번 주 진행률
3. **주간 진행상황 차트** (Chart.js)
4. **최근 활동** (향후)
5. **추천 활동** (향후)

**레이아웃**:
```
Grid Layout (responsive)
├── Header (환영 메시지)
├── Stats Grid (2x2 또는 4x1)
├── Chart Section (주간 학습 시간)
└── Recent Activity (타임라인)
```

**파일**: `app/dashboard/page.tsx`

**예상 시간**: 40분

---

### Task 6: 학습 통계 카드 컴포넌트
**목적**: 주요 지표 시각화

**카드 종류**:

1. **총 학습 시간 카드**
   - 아이콘: 시계
   - 값: `{totalLearningTime}분` → `{hours}시간 {minutes}분`
   - 색상: Primary

2. **스트릭 카드**
   - 아이콘: 불꽃
   - 값: `{streak}일 연속`
   - 색상: Success (Green)
   - 배지: 최고 기록 표시

3. **현재 주차 카드**
   - 아이콘: 책
   - 값: `{level} - Week {weekNumber}`
   - 색상: Info (Blue)
   - 뱃지: 레벨 표시

4. **이번 주 진행률 카드**
   - 아이콘: 체크리스트
   - 값: `{completedActivities}/{totalActivities}`
   - 프로그레스 바: `{percentage}%`
   - 색상: Warning (Orange)

**컴포넌트 구조**:
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType;
  color: 'primary' | 'success' | 'info' | 'warning';
  badge?: string;
  progress?: number; // 0-100
}
```

**파일**: `components/dashboard/StatsCard.tsx`

**예상 시간**: 30분

---

### Task 7: 주간 진행상황 차트
**목적**: 학습 패턴 시각화

**차트 타입**: Bar Chart (Chart.js + react-chartjs-2)

**데이터**:
- X축: 요일 (월~일)
- Y축: 학습 시간 (분)
- 데이터 소스: `UserProgress.learningTimeLog[]`

**기능**:
1. 최근 7일 데이터 표시
2. 오늘 날짜 강조
3. 목표 학습 시간 라인 (점선)
4. 호버 시 상세 정보 (시간, 활동)

**차트 설정**:
```typescript
{
  type: 'bar',
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y}분 학습`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (value) => `${value}분` }
    }
  }
}
```

**파일**: `components/dashboard/WeeklyChart.tsx`

**예상 시간**: 35분

---

### Task 8: 사용자 프로필 데이터 훅
**목적**: 학습 데이터 페칭 및 캐싱

**구현**:
```typescript
// hooks/useUserProgress.ts
import { useQuery } from '@tanstack/react-query';

export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['userProgress', userId],
    queryFn: async () => {
      const progressDoc = await getDoc(
        doc(db, 'userProgress', `${userId}_current`)
      );
      return progressDoc.data() as UserProgress;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
```

**추가 훅**:
- `useWeeklyStats()`: 주간 통계 계산
- `useStreak()`: 스트릭 계산
- `useLearningTime()`: 총 학습 시간 계산

**파일**:
- `hooks/useUserProgress.ts`
- `hooks/useWeeklyStats.ts`

**예상 시간**: 25분

---

### Task 9: 대시보드 테스트 및 검증
**목적**: 기능 및 UX 검증

**테스트 시나리오**:
1. **인증 플로우**
   - 비인증 상태에서 /dashboard 접근 → /login 리다이렉트
   - 로그인 → 대시보드로 자동 이동
   - 로그아웃 → /login으로 이동

2. **반응형 테스트**
   - 데스크톱: 사이드바 고정 표시
   - 태블릿: 사이드바 토글
   - 모바일: 햄버거 메뉴 + 오버레이

3. **데이터 로딩**
   - 로딩 상태 표시 (스켈레톤)
   - 에러 처리 (에러 메시지)
   - 빈 데이터 처리 (첫 사용자)

4. **네비게이션**
   - 활성 페이지 하이라이트
   - 키보드 네비게이션
   - 포커스 관리

**도구**:
- Chrome DevTools (반응형 테스트)
- React Query DevTools (데이터 확인)
- 수동 테스트 (UX 검증)

**예상 시간**: 20분

---

## 3. 기술적 고려사항

### 3.1 상태 관리 전략
```
전역 상태 (Zustand):
- currentUser: User | null
- sidebarOpen: boolean (모바일)

서버 상태 (React Query):
- userProgress: UserProgress
- weeklyStats: WeeklyStats
- learningTime: number

로컬 상태 (useState):
- 드롭다운 열림/닫힘
- 모달 상태
```

### 3.2 성능 최적화
- **코드 스플리팅**: 차트 라이브러리 lazy load
- **데이터 캐싱**: React Query 5분 stale time
- **메모이제이션**: 통계 계산 useMemo
- **이미지 최적화**: Next.js Image 컴포넌트

### 3.3 접근성
- **ARIA**: role, aria-label, aria-expanded
- **키보드**: Tab, Escape, Enter 지원
- **포커스 관리**: 모달 열릴 때 포커스 트랩
- **스크린 리더**: 의미있는 텍스트

### 3.4 에러 처리
```typescript
// 에러 바운더리
<ErrorBoundary fallback={<ErrorFallback />}>
  <Dashboard />
</ErrorBoundary>

// React Query 에러 처리
{error && <ErrorMessage message={error.message} />}
{isLoading && <Skeleton />}
{data && <DashboardContent data={data} />}
```

---

## 4. 개발 순서

### 단계 1: 기반 구축 (60분)
1. ✅ 인증 미들웨어 생성
2. ✅ 대시보드 레이아웃 구조
3. ✅ Header 컴포넌트
4. ✅ Sidebar 컴포넌트

### 단계 2: 데이터 레이어 (25분)
5. ✅ useUserProgress 훅
6. ✅ useWeeklyStats 훅

### 단계 3: UI 구현 (105분)
7. ✅ 대시보드 홈 페이지 구조
8. ✅ StatsCard 컴포넌트
9. ✅ WeeklyChart 컴포넌트

### 단계 4: 테스트 및 개선 (20분)
10. ✅ 통합 테스트
11. ✅ UX 검증 및 개선

**총 예상 시간**: 약 3.5시간

---

## 5. 완료 기준

### 기능적 요구사항
- [x] 비인증 사용자 접근 차단
- [x] 로그인 후 대시보드 자동 이동
- [x] 반응형 레이아웃 (모바일, 태블릿, 데스크톱)
- [x] 학습 통계 4가지 표시
- [x] 주간 학습 시간 차트
- [x] 사용자 메뉴 (프로필, 로그아웃)
- [x] 네비게이션 (5개 메뉴)

### 비기능적 요구사항
- [x] 로딩 시간 < 2초
- [x] 접근성 (키보드, 스크린 리더)
- [x] 에러 처리 (네트워크, 데이터 없음)
- [x] 빌드 성공
- [x] TypeScript 에러 없음

### UX 요구사항
- [x] 로딩 상태 표시 (스켈레톤)
- [x] 부드러운 애니메이션 (사이드바, 드롭다운)
- [x] 명확한 활성 상태 표시
- [x] 직관적인 네비게이션

---

## 6. 리스크 및 대응

| 리스크 | 영향 | 확률 | 대응 방안 |
|--------|------|------|-----------|
| Firestore 데이터 없음 | 높음 | 높음 | 기본값 설정, 빈 상태 UI |
| Chart.js 번들 크기 | 중간 | 중간 | Lazy load, Tree shaking |
| 반응형 버그 | 중간 | 낮음 | 철저한 테스트, Tailwind 활용 |
| 인증 상태 동기화 | 높음 | 낮음 | React Query refetch |

---

## 7. 다음 단계 (Phase 3)

Phase 2 완료 후:
- **커리큘럼 시스템**: 주차별 학습 콘텐츠
- **학습 일지**: 일지 작성 및 관리
- **프로필 페이지**: 프로필 수정, 이미지 업로드

---

*Generated: 2025년 10월 4일*
*Estimated Duration: 3.5 hours*
*Priority: High*
