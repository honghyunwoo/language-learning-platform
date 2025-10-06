# PRD 대비 미구현 기능 목록

**작성일**: 2025-10-05
**목적**: Phase 1-4 완료 후 아직 구현되지 않은 모든 기능 정리

---

## ✅ 완료된 Phase (1-4)

### Phase 1: 디자인 시스템 & 기초 설정
- ✅ Next.js 프로젝트 설정
- ✅ 디자인 시스템 (색상, 타이포그래피, 다크모드)
- ✅ UI 컴포넌트 (Button, Input, Card, Badge, Modal)
- ✅ Firebase 설정
- ✅ 인증 시스템 (이메일, Google)
- ✅ 랜딩 페이지

### Phase 2: 대시보드
- ✅ 대시보드 레이아웃 (Header, Sidebar)
- ✅ 대시보드 메인 페이지
- ✅ 학습 통계 카드
- ✅ 주간 학습 시간 차트
- ✅ 최근 활동 목록

### Phase 3: 커리큘럼 시스템
- ✅ 커리큘럼 데이터 구조
- ✅ 주차별 커리큘럼 목록
- ✅ 활동 타입별 아이콘/라벨
- ✅ 진도율 표시
- ✅ 활동 완료 처리

### Phase 4: 학습 일지
- ✅ 학습 일지 데이터 구조
- ✅ 일지 작성/조회/수정
- ✅ 월간 통계
- ✅ 활동 자동 기록
- ✅ 기분/난이도 기록

---

## ❌ 미구현 기능 (우선순위별)

### 🔴 CRITICAL - 현재 작동하지 않는 기능

#### 1. 실제 Activity 학습 콘텐츠 (가장 중요!)
**현재 상태**: Activity 페이지 구조만 있음, 실제 콘텐츠 없음
**위치**: `app/dashboard/curriculum/[weekId]/[activityId]/page.tsx` (216-229번 줄)

**미구현된 콘텐츠**:
```
❌ Reading (읽기)
   - 영어 지문 (단계별 난이도)
   - 독해 문제 (객관식, 주관식)
   - 단어 해석 툴팁
   - 정답/해설

❌ Listening (듣기)
   - 오디오 파일 재생
   - 스크립트 보기/숨기기
   - 듣기 문제
   - 재생 속도 조절

❌ Speaking (말하기)
   - 브라우저 녹음 기능
   - 음성 파일 저장
   - 발음 평가 (선택)
   - 재생 및 다시 녹음

❌ Writing (쓰기)
   - 텍스트 에디터
   - 작문 제출
   - AI 첨삭 (선택)
   - 예시 답안

❌ Vocabulary (어휘)
   - 단어 목록 및 뜻
   - 플래시카드
   - 예문
   - 퀴즈 (매칭, 빈칸)

❌ Grammar (문법)
   - 문법 설명
   - 예시 문장
   - 연습 문제
   - 오답 해설
```

#### 2. Firebase Security Rules 프로덕션 배포
**현재 상태**: 테스트 모드 (2025-11-04까지만 작동)
**문제**: 프로덕션 환경에서 사용 불가능

**필요한 작업**:
- Firestore Security Rules 작성 및 배포
- Storage Security Rules 작성 (현재 Storage는 결제 문제로 비활성화)

---

### 🟡 HIGH PRIORITY - 빠르게 추가 필요

#### 3. 커뮤니티 기능
**현재 상태**: 링크만 있고 페이지 없음
**위치**: 랜딩 페이지, 대시보드에 링크는 존재

**미구현된 기능**:
```
❌ 커뮤니티 메인 페이지 (/community)
   - 게시판 목록 (질문, 팁, 후기)
   - 최신/인기 게시글

❌ 게시글 작성/수정/삭제
   - 마크다운 에디터
   - 이미지 첨부
   - 태그 시스템

❌ 댓글 시스템
   - 댓글 작성/수정/삭제
   - 대댓글 (선택)

❌ 좋아요/북마크
   - 게시글 좋아요
   - 북마크 목록

❌ 검색/필터
   - 게시글 검색
   - 카테고리/태그 필터
```

#### 4. Error Handling & UX 개선
**현재 문제**:
- Error Boundary 없음 (앱 충돌 시 빈 화면)
- Toast Notification 없음 (성공/에러 알림 불가)
- Environment Variable Validation 없음

**필요한 작업**:
```typescript
// Error Boundary 추가
- components/ErrorBoundary.tsx 생성
- app/layout.tsx에 적용

// Toast Notification
- react-hot-toast 설치
- components/ui/Toast.tsx 생성
- 모든 mutation에 toast 추가

// Env Validation
- lib/firebase.ts에 환경변수 검증 로직 추가
```

#### 5. 프로필 기능 강화
**현재 상태**: 기본 프로필만 있음

**미구현된 기능**:
```
❌ 프로필 이미지 업로드 (Storage 결제 문제로 보류)
❌ 비밀번호 변경
❌ 이메일 변경
❌ 계정 삭제
❌ 알림 설정
```

---

### 🟢 MEDIUM PRIORITY - 품질 개선

#### 6. 이미지 최적화
**현재 문제**: `<img>` 태그 사용으로 성능 저하
**위치**: `components/Header.tsx`, `components/Sidebar.tsx`

**필요한 작업**:
```tsx
// Before
<img src="/logo.png" alt="Logo" />

// After
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={32} height={32} />
```

#### 7. Form Validation 강화
**현재 상태**: 기본 HTML validation만 있음

**개선 필요**:
- 비밀번호 강도 체크 (최소 8자, 대소문자, 숫자, 특수문자)
- 이메일 도메인 검증
- 실시간 validation 피드백
- 중복 이메일 체크

#### 8. Loading States & Skeleton UI
**현재 상태**: React Query `isLoading`만 사용

**필요한 작업**:
- Skeleton UI 컴포넌트 생성
- 대시보드, 커리큘럼, 학습일지에 적용

#### 9. Network Retry Logic
**현재 상태**: 재시도 로직 없음

**필요한 작업**:
```typescript
// lib/providers.tsx에 추가
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

### 🔵 LOW PRIORITY - 향후 개선

#### 10. 검색/필터 기능
- 대시보드, 커리큘럼, 학습일지에서 데이터 검색
- 날짜, 타입, 난이도별 필터

#### 11. 키보드 단축키
- 네비게이션 단축키
- 활동 완료 단축키

#### 12. 접근성 개선
- ARIA labels 추가
- 키보드 네비게이션 완성
- 스크린 리더 지원

#### 13. 다국어 지원
- i18n 라이브러리 도입
- 영어/한국어 지원

#### 14. PWA 지원
- Service Worker
- 오프라인 지원
- 설치 가능한 앱

---

## 📊 구현 완료율 요약

### 전체 기능 기준
```
완료: Phase 1-4 (40%)
미완료: Phase 5 + 개선사항 (60%)
```

### 핵심 기능 기준
```
✅ 인증 시스템: 100%
✅ 대시보드: 90% (통계는 완료, 일부 개선 필요)
✅ 커리큘럼 구조: 100%
❌ 커리큘럼 콘텐츠: 0% (가장 중요!)
✅ 학습 일지: 95%
❌ 커뮤니티: 0%
🟡 프로필: 50%
```

---

## 🎯 다음 단계 제안

### Option 1: 실제 Activity 콘텐츠 먼저 구현 (추천)
**이유**: 커리큘럼 페이지가 있어도 실제로 학습할 콘텐츠가 없으면 의미 없음

**우선순위**:
1. Vocabulary (가장 간단) - 단어 목록 + 퀴즈
2. Reading - 지문 + 문제
3. Grammar - 설명 + 연습문제
4. Listening - 오디오 + 문제
5. Writing - 에디터 + 제출
6. Speaking - 녹음 기능

### Option 2: 커뮤니티 기능 먼저 구현
**이유**: 사용자 참여 유도, 학습 동기 부여

**우선순위**:
1. 게시판 기본 기능 (작성/조회)
2. 댓글 시스템
3. 좋아요/북마크
4. 검색/필터

### Option 3: UX/품질 개선 먼저
**이유**: 현재 기능의 안정성과 사용성 향상

**우선순위**:
1. Error Boundary + Toast
2. Security Rules 프로덕션 배포
3. Form Validation 강화
4. Loading UI 개선

---

## 💡 추천 진행 순서

**단계별 구현 계획**:

1. **긴급 수정** (1-2일)
   - Error Boundary 추가
   - Toast Notification 추가
   - Security Rules 배포

2. **Phase 5-A: 기본 Activity 콘텐츠** (3-5일)
   - Vocabulary 구현
   - Reading 구현
   - Grammar 구현

3. **Phase 5-B: 고급 Activity 콘텐츠** (3-5일)
   - Listening 구현 (오디오 파일 필요)
   - Writing 구현
   - Speaking 구현 (녹음 기능)

4. **Phase 6: 커뮤니티** (3-5일)
   - 게시판 기본 기능
   - 댓글 시스템
   - 좋아요/북마크

5. **Phase 7: 품질 개선** (2-3일)
   - 이미지 최적화
   - Form Validation
   - 검색/필터
   - 접근성

---

**어떤 순서로 진행할까요?**
