# 작동하지 않는 기능 목록 (Broken Features List)

**작성일**: 2025-10-05
**목적**: 실행 전 모든 작동하지 않는 기능을 하나씩 찾아 문서화

---

## 🔴 CRITICAL - 즉시 수정 필요

### 1. Firebase 설정 문제 (.env.local)
**파일**: `.env.local`
**문제**: 모든 Firebase 인증 정보가 더미 테스트 값으로 되어 있음

```env
NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key-for-build
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**영향받는 기능**:
- ❌ 이메일/비밀번호 로그인 (`hooks/useAuth.ts` - `signIn()`)
- ❌ Google 로그인 (`hooks/useAuth.ts` - `signInWithGoogle()`)
- ❌ 회원가입 (`hooks/useAuth.ts` - `signUp()`)
- ❌ 로그아웃 (`hooks/useAuth.ts` - `signOut()`)
- ❌ 사용자 프로필 생성 (`hooks/useUserProfile.ts` - `createUserProfile()`)
- ❌ 사용자 프로필 업데이트 (`hooks/useUserProfile.ts` - `updateUserProfile()`)
- ❌ 주차 진도 데이터 (`hooks/useWeekProgress.ts` - 모든 함수)
- ❌ 학습 일지 작성/조회 (`hooks/useJournal.ts` - 모든 함수)
- ❌ 학습 스트릭 계산 (`hooks/useUserProgress.ts` - `useStreak()`)
- ❌ 학습 시간 집계 (`hooks/useUserProgress.ts` - `useLearningTime()`)

**필요한 작업**:
1. 실제 Firebase 프로젝트 생성
2. 실제 API 키 및 인증 정보로 `.env.local` 업데이트
3. Firebase Authentication 활성화 (Email/Password, Google Provider)
4. Firestore Database 생성

---

## 🟡 HIGH PRIORITY - 빠른 시일 내 수정 필요

### 2. Firebase Security Rules 누락
**파일**: `firestore.rules` (존재하지 않음)
**문제**: Firestore 보안 규칙이 없어 프로덕션 배포 시 보안 위험

**영향**:
- 누구나 데이터베이스 읽기/쓰기 가능
- 사용자 데이터 보호 불가
- 프로덕션 환경에서 사용 불가

**필요한 작업**:
1. `firestore.rules` 파일 생성
2. 사용자별 데이터 접근 제어 규칙 작성
3. Firebase Console에 배포

### 3. Storage Security Rules 누락
**파일**: `storage.rules` (존재하지 않음)
**문제**: Firebase Storage 보안 규칙 없음

**영향**:
- 사용자 프로필 이미지 업로드 보안 취약
- 파일 크기/타입 제한 없음

**필요한 작업**:
1. `storage.rules` 파일 생성
2. 이미지 업로드 권한 및 파일 타입/크기 제한 규칙 작성

### 4. Environment Variable Validation 누락
**파일**: `lib/firebase.ts`
**문제**: 환경 변수가 없거나 잘못되어도 에러 없이 진행

**영향**:
- Firebase 초기화 실패 시 의미없는 에러 메시지
- 디버깅 어려움

**필요한 작업**:
```typescript
// lib/firebase.ts에 추가 필요
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  // ... 등
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### 5. Error Boundary 누락
**파일**: 없음 (생성 필요)
**문제**: 앱 충돌 시 사용자에게 빈 화면만 표시

**영향**:
- 에러 발생 시 전체 앱 중단
- 사용자 경험 저하

**필요한 작업**:
1. `components/ErrorBoundary.tsx` 생성
2. `app/layout.tsx`에서 전체 앱을 ErrorBoundary로 감싸기

### 6. Toast Notification System 누락
**문제**: 성공/에러 메시지를 사용자에게 알릴 방법 없음

**현재 상태**:
- `useAuth.ts`는 `error` state만 반환
- 성공 메시지나 일시적 알림 불가

**필요한 작업**:
1. Toast 라이브러리 설치 (`react-hot-toast` 추천)
2. `components/ui/Toast.tsx` 생성
3. `hooks/useToast.ts` 생성
4. 모든 mutation 함수에서 toast 사용

---

## 🟢 MEDIUM PRIORITY - 개선 필요

### 7. 실제 Activity 콘텐츠 누락
**파일**: `app/activities/page.tsx`
**문제**: Activity 목록만 있고 실제 학습 콘텐츠 없음

**누락된 기능**:
- Reading 활동 실제 지문 및 문제
- Listening 활동 오디오 파일 및 스크립트
- Speaking 활동 녹음 기능
- Writing 활동 첨삭 시스템
- Vocabulary 활동 단어장 및 퀴즈
- Grammar 활동 문법 설명 및 연습 문제

**필요한 작업**: Phase 5 - Activity 콘텐츠 구현

### 8. 커뮤니티 기능 누락
**파일**: `app/community/page.tsx` (존재하지 않음)
**문제**: 랜딩 페이지와 대시보드에서 커뮤니티 링크가 있지만 실제 페이지 없음

**누락된 기능**:
- 게시판 (질문, 팁, 후기)
- 댓글 시스템
- 좋아요/북마크

**필요한 작업**: Phase 5 - 커뮤니티 페이지 구현

### 9. 이미지 최적화 경고
**파일**: `components/Header.tsx`, `components/Sidebar.tsx`
**문제**: `<img>` 태그 사용으로 성능 저하

**빌드 경고**:
```
⚠ Using `<img>` could result in slower LCP and higher bandwidth.
  Consider using `<Image />` from `next/image` to automatically optimize images.
```

**필요한 작업**:
```tsx
// Before
<img src="/logo.png" alt="Logo" />

// After
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={32} height={32} />
```

### 10. Form Validation 강화 필요
**파일**: `app/login/page.tsx`, `app/signup/page.tsx`
**문제**: 클라이언트 측 기본 validation만 있음

**개선 필요 사항**:
- 비밀번호 강도 체크 (최소 8자, 대소문자, 숫자, 특수문자)
- 이메일 도메인 검증
- 실시간 validation 피드백
- 중복 이메일 체크

### 11. Loading States 개선
**문제**: 데이터 로딩 중 UX 부족

**현재 상태**:
- React Query `isLoading`만 사용
- Skeleton UI 없음

**필요한 작업**:
1. `components/ui/Skeleton.tsx` 생성
2. 대시보드, 커리큘럼, 학습일지 등에서 skeleton loading 표시

### 12. Network Retry Logic 누락
**파일**: `lib/react-query.ts`
**문제**: 네트워크 실패 시 재시도 로직 없음

**현재 설정**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});
```

**개선 필요**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3, // 3번 재시도
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## 🔵 LOW PRIORITY - 향후 개선

### 13. 검색/필터 기능 없음
**위치**: 대시보드, 커리큘럼, 학습일지
**문제**: 데이터가 많아지면 찾기 어려움

### 14. 키보드 단축키 없음
**문제**: 마우스로만 조작 가능

### 15. 접근성 개선 필요
**문제**:
- ARIA labels 부족
- 키보드 네비게이션 불완전
- 스크린 리더 지원 부족

### 16. 다국어 지원 없음
**문제**: 한국어로만 하드코딩됨

---

## 📋 검증 체크리스트

다음 단계로 실제 기능 하나씩 테스트하며 검증:

- [ ] 로그인 페이지 접속 (`/login`)
- [ ] 회원가입 페이지 접속 (`/signup`)
- [ ] 이메일/비밀번호 회원가입 시도
- [ ] 이메일/비밀번호 로그인 시도
- [ ] Google 로그인 시도
- [ ] 대시보드 데이터 로딩 (`/dashboard`)
- [ ] 커리큘럼 페이지 (`/curriculum`)
- [ ] 주차별 콘텐츠 조회
- [ ] Activity 페이지 (`/activities`)
- [ ] 학습 일지 작성 (`/journal`)
- [ ] 학습 일지 조회
- [ ] 프로필 페이지 (`/profile`)
- [ ] 프로필 편집
- [ ] 로그아웃

---

## 우선순위 수정 계획

### 1단계: Firebase 설정 (CRITICAL)
1. 실제 Firebase 프로젝트 생성 가이드 작성
2. `.env.local.example` 파일 생성 (실제 값 입력 가이드)
3. Environment variable validation 추가

### 2단계: 보안 (HIGH)
1. `firestore.rules` 작성
2. `storage.rules` 작성
3. Error Boundary 추가
4. Toast notification 시스템 추가

### 3단계: UX 개선 (MEDIUM)
1. 이미지 최적화
2. Skeleton loading UI
3. Form validation 강화
4. Network retry logic

### 4단계: 기능 완성 (MEDIUM)
1. Activity 콘텐츠 구현
2. 커뮤니티 페이지 구현

### 5단계: 품질 개선 (LOW)
1. 검색/필터
2. 키보드 단축키
3. 접근성 개선
