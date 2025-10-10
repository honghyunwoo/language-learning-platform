# 언어 학습 플랫폼 6개월 상용화 마스터 플랜

> **작성일**: 2025-10-09
> **대상**: 솔로 개발자 (주 20시간)
> **목표**: 상용화 준비 완료 (100명 활성 사용자, 5% 전환율)
> **예산**: 최소 (Firebase Spark → Blaze, Vercel Free → Pro)

---

## 📊 Executive Summary

### 현재 상태 (Baseline)

**기술 현황**:
- ✅ 최신 스택: Next.js 15.5.4 + React 19 + TypeScript
- ✅ 기능 완성도: 6가지 학습 활동, 커뮤니티, 학습 일지
- ✅ 수동 테스트: 개발자가 전체 기능 검증 완료
- ❌ 자동화 테스트: 0% (0개 파일)
- ⚠️ 보안: 치명적 취약점 3개 (XSS, 프로필 노출, 인증 미검증)
- ⚠️ 성능: 380KB 번들, Lighthouse 65점
- ❌ 비즈니스: 타겟 불명확 (A1-B2 "모두" = "아무도 아님")

**분석 점수**:
- Architecture: 7.5/10
- Security: B+ (치명적 3개 해결 필요)
- Performance: C+ (45% 개선 가능)
- Business: D+ (피봇 필수)

### 6개월 여정 개요

```
Week 1-8    → Phase 1: Foundation & Security
              목표: 보안 패치 + 비즈니스 검증 시작

Week 9-16   → Phase 2: Business Validation & MVP Pivot
              목표: 50명 베타 테스터 + 니치 확정

Week 17-24  → Phase 3: Performance & Testing
              목표: 40% 커버리지 + 100명 활성 사용자
```

### 주요 마일스톤

| Week | 마일스톤 | 성공 기준 | Go/No-Go |
|------|----------|-----------|----------|
| **4** | 🛡️ **보안 패치 완료** | XSS/프로필/인증 수정 + 재테스트 통과 | ✅ 필수 |
| **8** | 💼 **비즈니스 피봇 결정** | 10명 인터뷰 완료 + 니치 확정 (B1 면접 영어) | ⚠️ 중요 |
| **16** | 🎯 **MVP 검증** | 50명 베타 테스터 + 5% 전환율 달성 | ⚠️ 중요 |
| **24** | 🚀 **상용화 준비** | 100명 활성 + 40% 테스트 커버리지 + Lighthouse 90 | ✅ 필수 |

### 예상 결과

**기술적 성과**:
- 보안: B+ → A (모든 치명적 취약점 해결)
- 성능: 380KB → 190KB (50% 감소), Lighthouse 65 → 90
- 테스트: 0% → 40% (Critical Path 우선)
- 아키텍처: Data Access Layer 도입, Monitoring 구축

**비즈니스 성과**:
- 타겟: A1-B2 "모두" → B1 면접 영어 (니치 집중)
- 사용자: 0명 → 100명 활성 사용자
- 전환율: 0% → 5% (Freemium 모델)
- MRR: $0 → $150 (30명 × $5/month)

### 핵심 리스크 (Top 3)

1. **🔴 HIGH**: 비즈니스 피봇 실패 (Week 8)
   - 확률: 40% | 영향: 프로젝트 중단
   - 완화: 10명 심층 인터뷰, 경쟁사 분석, 대안 니치 2개 준비

2. **🟡 MEDIUM**: 솔로 개발자 번아웃 (Week 12-16)
   - 확률: 30% | 영향: 일정 지연 4주
   - 완화: 주 20시간 엄수, MVP 범위 축소, 외부 지원 (디자인 외주)

3. **🟡 MEDIUM**: Firebase/Vercel 비용 초과 (Week 20+)
   - 확률: 25% | 영향: 월 $50 → $200
   - 완화: 사전 비용 모니터링, 쿼리 최적화, 캐싱 전략

---

## 🎯 Phase 1: Foundation & Security (Week 1-8)

### 목표

**측정 가능한 성과 지표**:
- ✅ 치명적 보안 취약점 3개 → 0개
- ✅ 보안 등급: B+ → A
- ✅ 고객 인터뷰: 10명 완료
- ✅ 니치 결정: B1 면접 영어 확정
- ✅ ADR 작성: 5개 (기술 의사결정 문서화)
- ✅ 테스트 시작: 0% → 10% (보안 Critical Path)

**시간 배분** (주 20시간 × 8주 = 160시간):
- 보안 패치: 40h (25%)
- 비즈니스 검증: 60h (37.5%)
- 테스트 인프라: 40h (25%)
- 문서화/ADR: 20h (12.5%)

---

### Week 1-2: 치명적 보안 패치 (긴급)

#### 🚨 Critical Issue #1: XSS 취약점

**📍 위치**: `app/dashboard/community/[id]/page.tsx:171`

**❌ 현재 문제**:
```typescript
// 사용자 입력을 sanitize 없이 직접 렌더링
<p className="whitespace-pre-wrap">{post.content}</p>
```

**✅ 해결 방안** (DOMPurify 이미 설치됨):
```typescript
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href'],
      ALLOW_DATA_ATTR: false
    })
  }}
  className="prose max-w-none"
/>
```

**작업 항목**:
- [ ] **Task 1.1.1**: DOMPurify 설정 유틸 작성 (`lib/security/sanitize.ts`)
  - 예상 시간: 2h
  - 의존성: 없음
  - 검증: Unit 테스트 작성 (XSS 페이로드 5개 테스트)

- [ ] **Task 1.1.2**: 커뮤니티 게시글 sanitize 적용
  - 예상 시간: 3h
  - 의존성: Task 1.1.1
  - 영향 범위:
    - `app/dashboard/community/[id]/page.tsx` (게시글 본문)
    - `components/community/PostCard.tsx` (게시글 미리보기)
    - `components/community/CommentItem.tsx` (댓글)
  - 검증: 수동 XSS 테스트 (`<script>alert('XSS')</script>`, `<img onerror>`)

- [ ] **Task 1.1.3**: 스터디 그룹 설명 sanitize 적용
  - 예상 시간: 2h
  - 의존성: Task 1.1.1
  - 영향 범위:
    - `app/dashboard/community/groups/[id]/page.tsx`
    - `components/community/StudyGroupCard.tsx`
  - 검증: 수동 테스트

**예상 시간**: 7h

---

#### 🚨 Critical Issue #2: 사용자 프로필 공개 노출

**📍 위치**: `firestore.rules:18`

**❌ 현재 문제**:
```javascript
match /users/{userId} {
  allow read: if true; // 누구나 모든 사용자 정보 조회 가능!
}
```

**위험성**:
- 이메일 주소 노출
- 학습 진행 상황 노출
- 개인 설정 노출 (알림, 테마 등)

**✅ 해결 방안**:
```javascript
match /users/{userId} {
  // 본인 전체 프로필 조회
  allow get: if isOwner(userId);

  // 공개 프로필만 조회 (커뮤니티용)
  allow read: if resource.data.settings.profilePublic == true;

  // 본인만 수정
  allow update: if isOwner(userId) && isValidUserUpdate();
  allow create: if isOwner(userId);
  allow delete: if false; // 삭제는 관리자만 (Firebase Admin SDK)
}

// 공개 프로필 필드 제한
match /users/{userId}/publicProfile/{document=**} {
  allow read: if true; // displayName, avatar만 포함
}
```

**작업 항목**:
- [ ] **Task 1.2.1**: Firestore Rules 수정
  - 예상 시간: 3h
  - 의존성: 없음
  - 변경 사항:
    - `/users/{userId}` 규칙 수정
    - `/users/{userId}/publicProfile` 서브컬렉션 생성
    - `isValidUserUpdate()` 함수 추가 (필드 화이트리스트)
  - 검증: Firebase Emulator로 Rules 테스트

- [ ] **Task 1.2.2**: 데이터 마이그레이션 스크립트
  - 예상 시간: 4h
  - 의존성: Task 1.2.1
  - 작업:
    - `scripts/migrate-user-profiles.ts` 작성
    - 기존 사용자 데이터 → publicProfile 분리
    - 백업 생성 (Firestore Export)
  - 검증: 테스트 데이터 10개로 실행 → 검증 → 전체 실행

- [ ] **Task 1.2.3**: 클라이언트 코드 수정
  - 예상 시간: 5h
  - 의존성: Task 1.2.2
  - 영향 범위:
    - `hooks/useCommunity.ts` (공개 프로필 조회)
    - `components/community/UserBadge.tsx`
    - `app/dashboard/community/users/[id]/page.tsx` (타인 프로필)
  - 검증: 수동 테스트 (본인/타인 프로필 조회)

**예상 시간**: 12h

---

#### 🚨 Critical Issue #3: 서버사이드 인증 미검증

**📍 위치**: `middleware.ts`

**❌ 현재 문제**:
```typescript
// 클라이언트 인증만 체크, 서버사이드 검증 없음
export async function middleware(request: NextRequest) {
  // Firebase Client SDK만 사용
}
```

**위험성**:
- 토큰 위조 가능 (클라이언트만 검증)
- API Route 무단 접근 가능
- CSRF 공격 취약

**✅ 해결 방안**:
```typescript
// middleware.ts
import { verifyIdToken } from '@/lib/firebase/admin';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Firebase Admin SDK로 서버사이드 검증
    const decodedToken = await verifyIdToken(token);

    // 헤더에 사용자 정보 추가
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedToken.uid);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**작업 항목**:
- [ ] **Task 1.3.1**: Firebase Admin SDK 설정
  - 예상 시간: 2h
  - 의존성: 없음
  - 작업:
    - `lib/firebase/admin.ts` 생성
    - 서비스 계정 키 생성 (Firebase Console)
    - 환경 변수 설정 (`.env.local`)
  - 검증: Admin SDK 초기화 테스트

- [ ] **Task 1.3.2**: Middleware 서버사이드 검증 추가
  - 예상 시간: 3h
  - 의존성: Task 1.3.1
  - 작업:
    - `middleware.ts` 수정
    - `verifyIdToken()` 함수 작성
    - 쿠키 처리 로직 추가
  - 검증: 유효/무효 토큰 테스트

- [ ] **Task 1.3.3**: API Routes 보호
  - 예상 시간: 4h
  - 의존성: Task 1.3.2
  - 영향 범위:
    - `app/api/journal/**` (학습 일지 API)
    - `app/api/community/**` (커뮤니티 API)
    - `app/api/resources/**` (리소스 API)
  - 작업: `x-user-id` 헤더 검증 추가
  - 검증: Unauthorized 요청 거부 확인

- [ ] **Task 1.3.4**: CSRF 보호 추가
  - 예상 시간: 3h
  - 의존성: Task 1.3.2
  - 작업:
    - `lib/security/csrf.ts` 작성
    - POST/PUT/DELETE 요청에 CSRF 토큰 추가
    - Middleware에 CSRF 검증 추가
  - 검증: CSRF 공격 시뮬레이션

**예상 시간**: 12h

---

#### 📝 Week 1-2 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 1.1.1 DOMPurify 유틸 | 2h | 🔴 Critical | ⏳ |
| 1.1.2 커뮤니티 sanitize | 3h | 🔴 Critical | ⏳ |
| 1.1.3 스터디 그룹 sanitize | 2h | 🔴 Critical | ⏳ |
| 1.2.1 Firestore Rules 수정 | 3h | 🔴 Critical | ⏳ |
| 1.2.2 데이터 마이그레이션 | 4h | 🔴 Critical | ⏳ |
| 1.2.3 클라이언트 코드 수정 | 5h | 🔴 Critical | ⏳ |
| 1.3.1 Admin SDK 설정 | 2h | 🔴 Critical | ⏳ |
| 1.3.2 Middleware 검증 | 3h | 🔴 Critical | ⏳ |
| 1.3.3 API Routes 보호 | 4h | 🔴 Critical | ⏳ |
| 1.3.4 CSRF 보호 | 3h | 🔴 Critical | ⏳ |

**총 예상 시간**: 31h
**실제 배정**: 40h (여유분 9h - 테스트 및 디버깅)

**Go/No-Go 기준**:
- ✅ 3개 치명적 취약점 모두 수정 완료
- ✅ 수동 보안 테스트 통과
- ✅ Firebase Emulator Rules 테스트 통과
- ✅ Vercel 재배포 후 프로덕션 테스트 통과

---

### Week 3-4: 고우선순위 보안 이슈 + 테스트 인프라

#### 🟡 High Priority Issue #1: NoSQL Injection

**📍 위치**: 전체 Firestore 쿼리

**❌ 현재 문제**:
```typescript
// 사용자 입력을 직접 쿼리에 사용
const q = query(
  collection(db, 'posts'),
  where('title', '==', userInput) // NoSQL Injection 가능
);
```

**✅ 해결 방안**:
```typescript
// lib/security/input-validation.ts
import { z } from 'zod';

export const postQuerySchema = z.object({
  title: z.string().max(100).trim(),
  category: z.enum(['general', 'question', 'study']),
  level: z.enum(['A1', 'A2', 'B1', 'B2'])
});

// hooks/useCommunity.ts
const validatedInput = postQuerySchema.parse(userInput);
const q = query(
  collection(db, 'posts'),
  where('title', '==', validatedInput.title)
);
```

**작업 항목**:
- [ ] **Task 1.4.1**: Zod 스키마 정의 (전체 쿼리)
  - 예상 시간: 4h
  - 의존성: 없음
  - 작업:
    - `lib/security/schemas.ts` 생성
    - 10개 주요 쿼리 스키마 정의 (Post, Comment, StudyGroup 등)
  - 검증: 유효/무효 입력 테스트

- [ ] **Task 1.4.2**: 전체 Hook에 입력 검증 추가
  - 예상 시간: 6h
  - 의존성: Task 1.4.1
  - 영향 범위:
    - `hooks/useCommunity.ts` (7개 함수)
    - `hooks/useResources.ts` (4개 함수)
    - `hooks/useJournal.ts` (5개 함수)
  - 검증: 각 Hook 단위 테스트

**예상 시간**: 10h

---

#### 🟡 High Priority Issue #2: 약한 비밀번호 정책

**📍 위치**: `components/auth/RegisterForm.tsx`

**❌ 현재 문제**:
```typescript
// Firebase 기본 정책만 사용 (6자 이상)
await createUserWithEmailAndPassword(auth, email, password);
```

**✅ 해결 방안**:
```typescript
// lib/security/password.ts
export const passwordSchema = z.string()
  .min(10, '비밀번호는 최소 10자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자 1개 이상 포함')
  .regex(/[a-z]/, '소문자 1개 이상 포함')
  .regex(/[0-9]/, '숫자 1개 이상 포함')
  .regex(/[^A-Za-z0-9]/, '특수문자 1개 이상 포함');

// 취약 비밀번호 블랙리스트 체크
const commonPasswords = ['password123', 'qwerty123', ...];
if (commonPasswords.includes(password.toLowerCase())) {
  throw new Error('너무 흔한 비밀번호입니다');
}
```

**작업 항목**:
- [ ] **Task 1.5.1**: 강력한 비밀번호 정책 구현
  - 예상 시간: 3h
  - 의존성: 없음
  - 작업:
    - `lib/security/password.ts` 작성
    - 비밀번호 강도 체커 (`checkPasswordStrength()`)
    - 블랙리스트 1000개 (Have I Been Pwned API)
  - 검증: 단위 테스트

- [ ] **Task 1.5.2**: 회원가입 폼 업데이트
  - 예상 시간: 2h
  - 의존성: Task 1.5.1
  - 작업:
    - `components/auth/RegisterForm.tsx` 수정
    - 실시간 비밀번호 강도 표시 (Weak/Medium/Strong)
    - 에러 메시지 개선
  - 검증: 수동 테스트

**예상 시간**: 5h

---

#### 🧪 테스트 인프라 구축 (0% → 10%)

**목표**: 보안 Critical Path 테스트 자동화

**작업 항목**:
- [ ] **Task 1.6.1**: Jest + Testing Library 설정
  - 예상 시간: 3h
  - 의존성: 없음
  - 작업:
    - `jest.config.js`, `jest.setup.js` 생성
    - `@testing-library/react`, `@testing-library/jest-dom` 설치
    - `package.json` scripts 추가 (`test`, `test:watch`, `test:coverage`)
  - 검증: 샘플 테스트 실행 성공

- [ ] **Task 1.6.2**: Firebase Emulator 테스트 환경
  - 예상 시간: 4h
  - 의존성: Task 1.6.1
  - 작업:
    - `firebase.json` emulator 설정
    - `lib/firebase/testing.ts` (테스트용 Firebase 초기화)
    - `scripts/setup-test-data.ts` (테스트 데이터 시드)
  - 검증: Emulator에서 쿼리 테스트

- [ ] **Task 1.6.3**: 보안 유틸 단위 테스트 (Critical Path)
  - 예상 시간: 6h
  - 의존성: Task 1.6.1
  - 대상:
    - `lib/security/sanitize.test.ts` (XSS 방어 5개 케이스)
    - `lib/security/input-validation.test.ts` (NoSQL Injection 5개 케이스)
    - `lib/security/password.test.ts` (비밀번호 정책 10개 케이스)
  - 목표: 20개 테스트 작성 → 커버리지 ~5%

- [ ] **Task 1.6.4**: 인증 Hook 통합 테스트
  - 예상 시간: 5h
  - 의존성: Task 1.6.2, 1.6.3
  - 대상:
    - `hooks/useAuth.test.ts` (로그인/로그아웃/회원가입)
  - 목표: 10개 테스트 추가 → 커버리지 ~10%

**예상 시간**: 18h

**커버리지 목표**:
- Week 4 종료 시: **10%** (보안 Critical Path만)
- 향후 목표: Week 12 (25%), Week 24 (40%)

---

#### 📝 Week 3-4 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 1.4.1 Zod 스키마 정의 | 4h | 🟡 High | ⏳ |
| 1.4.2 입력 검증 적용 | 6h | 🟡 High | ⏳ |
| 1.5.1 비밀번호 정책 | 3h | 🟡 High | ⏳ |
| 1.5.2 회원가입 폼 업데이트 | 2h | 🟡 High | ⏳ |
| 1.6.1 Jest 설정 | 3h | 🟡 High | ⏳ |
| 1.6.2 Emulator 환경 | 4h | 🟡 High | ⏳ |
| 1.6.3 보안 유틸 테스트 | 6h | 🟡 High | ⏳ |
| 1.6.4 인증 Hook 테스트 | 5h | 🟡 High | ⏳ |

**총 예상 시간**: 33h
**실제 배정**: 40h (여유분 7h)

**Go/No-Go 기준**:
- ✅ NoSQL Injection 방어 구현 완료
- ✅ 비밀번호 정책 강화 완료
- ✅ 테스트 인프라 구축 완료 (Jest + Emulator)
- ✅ 보안 테스트 30개 이상 작성
- ✅ 커버리지 10% 달성

---

### Week 5-6: 비즈니스 검증 시작 (고객 인터뷰)

#### 🎯 목표: 타겟 고객 니치 확정

**현재 문제**:
- 타겟: "A1-B2 모든 학습자" → 너무 광범위
- 경쟁사와 차별화 없음 (CEFR는 Busuu, Cambridge도 사용)
- 수익 모델 부재

**가설**:
- **니치**: B1 면접 영어 (취업 준비생 20-30대)
- **차별점**: 실전 면접 시뮬레이션 + AI 피드백
- **수익 모델**: Freemium (무료 3회/월, 프리미엄 무제한 $5/월)

**검증 방법**: 10명 심층 인터뷰 (1인당 30-45분)

---

#### 📋 Task 1.7: 고객 인터뷰 계획 및 실행

- [ ] **Task 1.7.1**: 인터뷰 대상자 모집
  - 예상 시간: 4h
  - 의존성: 없음
  - 채널:
    - LinkedIn (한국 취업 준비생 그룹)
    - Reddit (r/Korean, r/EnglishLearning)
    - Facebook (영어 학습 커뮤니티)
  - 목표: 20명 지원 → 10명 선발
  - 인센티브: 스타벅스 기프티콘 $5 (총 $50)

- [ ] **Task 1.7.2**: 인터뷰 질문 설계
  - 예상 시간: 3h
  - 의존성: 없음
  - 질문 카테고리 (Christensen JTBD 프레임워크):
    - **Functional Job**: "영어 면접 준비 시 가장 어려운 점은?"
    - **Emotional Job**: "면접 영어 때문에 느끼는 감정은?"
    - **Social Job**: "주변에 이런 도구를 추천하고 싶은가?"
    - **현재 해결책**: "지금 어떤 방법으로 준비하는가?" (경쟁 분석)
    - **지불 의향**: "$5/월이면 사용하겠는가?" (가격 검증)
  - 참고: `docs/business/interview-guide.md` 작성

- [ ] **Task 1.7.3**: 인터뷰 실행 (10명)
  - 예상 시간: 15h (1인당 1.5h)
  - 의존성: Task 1.7.1, 1.7.2
  - 일정: 주 5명씩 (Week 5-6)
  - 도구: Zoom + 녹화 (동의 필수)
  - 기록: `docs/business/interviews/` (익명화)

- [ ] **Task 1.7.4**: 인터뷰 인사이트 분석
  - 예상 시간: 6h
  - 의존성: Task 1.7.3
  - 분석 방법:
    - 공통 Pain Point 추출 (빈도 기준)
    - Jobs-to-be-Done 맵핑
    - 지불 의향 집계
    - 경쟁사 비교 분석
  - 산출물: `docs/business/INTERVIEW_INSIGHTS.md`

**예상 시간**: 28h

---

#### 📋 Task 1.8: 경쟁사 분석 (Porter 5 Forces)

- [ ] **Task 1.8.1**: 직접 경쟁사 분석 (3개)
  - 예상 시간: 6h
  - 의존성: 없음
  - 대상:
    - **Busuu**: CEFR 기반, 커뮤니티 강함
    - **Cambly**: 원어민 1:1, 비싸다 ($99/월)
    - **ELSA Speak**: AI 발음 교정, 면접 기능 약함
  - 분석 항목:
    - 가격 ($0-$99/월)
    - 주요 기능 (면접 시뮬레이션 유무)
    - 사용자 리뷰 (App Store/Google Play)
    - 차별화 포인트
  - 산출물: `docs/business/COMPETITOR_ANALYSIS.md`

- [ ] **Task 1.8.2**: 대체재 위협 분석
  - 예상 시간: 3h
  - 의존성: Task 1.8.1
  - 대체재:
    - YouTube 무료 영상
    - ChatGPT 무료 면접 연습
    - 학원 ($200-500/월)
  - 분석: 왜 사용자가 우리를 선택하는가?

**예상 시간**: 9h

---

#### 📝 Week 5-6 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 1.7.1 인터뷰 대상 모집 | 4h | 🟡 High | ⏳ |
| 1.7.2 질문 설계 | 3h | 🟡 High | ⏳ |
| 1.7.3 인터뷰 실행 (10명) | 15h | 🔴 Critical | ⏳ |
| 1.7.4 인사이트 분석 | 6h | 🔴 Critical | ⏳ |
| 1.8.1 경쟁사 분석 (3개) | 6h | 🟡 High | ⏳ |
| 1.8.2 대체재 분석 | 3h | 🟡 High | ⏳ |

**총 예상 시간**: 37h
**실제 배정**: 40h (여유분 3h)

**Go/No-Go 기준**:
- ✅ 10명 인터뷰 완료
- ✅ 공통 Pain Point 3개 이상 발견
- ✅ 지불 의향 50% 이상 ($5/월 기준)
- ⚠️ **중요**: 만약 지불 의향 <30% → 니치 재선정 필요 (Week 7-8 사용)

---

### Week 7-8: 비즈니스 피봇 결정 + ADR 문서화

#### 🎯 목표: B1 면접 영어 니치 확정 (Go/No-Go)

**의사결정 트리**:

```
인터뷰 결과 분석
├─ 지불 의향 ≥50% (5명 이상) → ✅ GO (B1 면접 영어 확정)
│  └─ Week 9-16: MVP 개발 시작
│
├─ 지불 의향 30-49% (3-4명) → ⚠️ PIVOT (니치 조정)
│  └─ 대안 1: B2 비즈니스 영어 (이메일/프레젠테이션)
│  └─ 대안 2: A2 여행 영어 (공항/호텔/식당)
│  └─ Week 8: 추가 인터뷰 5명 (대안 검증)
│
└─ 지불 의향 <30% (0-2명) → 🚨 NO-GO (프로젝트 재검토)
   └─ Option A: 완전히 다른 니치 (예: 어린이 영어)
   └─ Option B: 무료 모델 전환 (광고/제휴)
   └─ Option C: 프로젝트 중단 (sunk cost 인정)
```

---

#### 📋 Task 1.9: 비즈니스 피봇 결정

- [ ] **Task 1.9.1**: 인터뷰 데이터 정량화
  - 예상 시간: 4h
  - 의존성: Task 1.7.4
  - 분석:
    - 지불 의향: X명 / 10명 = Y%
    - 평균 Pain Point 강도: 1-10점 척도
    - NPS (Net Promoter Score): "친구에게 추천?" 1-10점
    - 경쟁사 대비 우위: 5개 항목 비교
  - 산출물: `docs/business/PIVOT_DECISION.md` (정량 데이터)

- [ ] **Task 1.9.2**: Go/No-Go 의사결정
  - 예상 시간: 3h
  - 의존성: Task 1.9.1
  - 참여: 개발자 단독 결정 (필요시 멘토/조언자 상담)
  - 결정 문서: `docs/business/DECISION_WEEK8.md`
  - 포함 내용:
    - 결정: GO / PIVOT / NO-GO
    - 근거: 정량 데이터 + 직관
    - 리스크: 예상 문제점
    - 다음 단계: Phase 2 계획 조정

**예상 시간**: 7h

---

#### 📋 Task 1.10: 기술 의사결정 문서화 (ADR)

**목표**: 5개 주요 결정을 ADR 형식으로 문서화

**ADR (Architecture Decision Record) 형식**:
```markdown
# ADR-001: DOMPurify를 사용한 XSS 방어

## Status
Accepted (2025-10-15)

## Context
커뮤니티 게시글에서 사용자 HTML 입력을 허용해야 함.
XSS 공격 위험이 존재.

## Decision
DOMPurify 라이브러리를 사용하여 HTML sanitize.
허용 태그: p, br, strong, em, a, ul, ol, li만.

## Consequences
- 긍정: 검증된 라이브러리, 유지보수 부담 적음
- 부정: 번들 크기 +15KB
- 위험: 복잡한 Markdown 지원 불가 (향후 대안 필요)

## Alternatives Considered
- js-xss: 한국어 문서 부족
- 직접 구현: 보안 리스크 높음
- Markdown 전환: 기존 데이터 마이그레이션 필요
```

**작업 항목**:
- [ ] **Task 1.10.1**: ADR-001 (XSS 방어 - DOMPurify)
  - 예상 시간: 1.5h

- [ ] **Task 1.10.2**: ADR-002 (입력 검증 - Zod)
  - 예상 시간: 1.5h

- [ ] **Task 1.10.3**: ADR-003 (서버사이드 인증 - Firebase Admin SDK)
  - 예상 시간: 1.5h

- [ ] **Task 1.10.4**: ADR-004 (테스트 프레임워크 - Jest + Testing Library)
  - 예상 시간: 1.5h

- [ ] **Task 1.10.5**: ADR-005 (비즈니스 니치 - B1 면접 영어)
  - 예상 시간: 2h
  - 의존성: Task 1.9.2

**예상 시간**: 8h

---

#### 📋 Task 1.11: Phase 1 회고 및 Phase 2 준비

- [ ] **Task 1.11.1**: Phase 1 회고 (Retrospective)
  - 예상 시간: 2h
  - 의존성: 모든 Task 완료
  - 질문:
    - 무엇이 잘 되었나? (보안 패치, 인터뷰)
    - 무엇이 어려웠나? (시간 부족, 테스트 작성)
    - 무엇을 개선할 수 있나? (Phase 2 적용)
  - 산출물: `docs/retrospective/PHASE_1.md`

- [ ] **Task 1.11.2**: Phase 2 계획 조정
  - 예상 시간: 3h
  - 의존성: Task 1.9.2 (피봇 결정)
  - 작업:
    - Phase 2 범위 재정의 (B1 면접 영어 기준)
    - MVP 기능 우선순위 (MoSCoW)
    - 일정 조정 (Week 9-16)
  - 산출물: `docs/MASTER_PLAN_PHASE2_ADJUSTED.md`

**예상 시간**: 5h

---

#### 📝 Week 7-8 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 1.9.1 인터뷰 데이터 정량화 | 4h | 🔴 Critical | ⏳ |
| 1.9.2 Go/No-Go 의사결정 | 3h | 🔴 Critical | ⏳ |
| 1.10.1 ADR-001 (XSS) | 1.5h | 🟢 Low | ⏳ |
| 1.10.2 ADR-002 (Zod) | 1.5h | 🟢 Low | ⏳ |
| 1.10.3 ADR-003 (Admin SDK) | 1.5h | 🟢 Low | ⏳ |
| 1.10.4 ADR-004 (Jest) | 1.5h | 🟢 Low | ⏳ |
| 1.10.5 ADR-005 (Niche) | 2h | 🟡 High | ⏳ |
| 1.11.1 Phase 1 회고 | 2h | 🟡 High | ⏳ |
| 1.11.2 Phase 2 계획 조정 | 3h | 🟡 High | ⏳ |

**총 예상 시간**: 20h
**실제 배정**: 40h (여유분 20h - 피봇 시 대안 검증에 사용)

**Phase 1 종료 Go/No-Go 기준**:
- ✅ 3개 치명적 보안 취약점 해결 완료
- ✅ 10% 테스트 커버리지 달성
- ✅ 10명 고객 인터뷰 완료
- ✅ 비즈니스 니치 확정 (B1 면접 영어 OR 대안)
- ✅ ADR 5개 작성 완료
- ⚠️ **중요 결정**: GO / PIVOT / NO-GO 명확히 결정

---

## 📊 Phase 1 요약

### 시간 배분 (총 160h)

| Week | 주제 | 배정 시간 | 주요 산출물 |
|------|------|-----------|-------------|
| 1-2 | 치명적 보안 패치 | 40h | XSS/프로필/인증 수정 완료 |
| 3-4 | 보안 이슈 + 테스트 인프라 | 40h | NoSQL/비밀번호 + Jest 설정 |
| 5-6 | 고객 인터뷰 + 경쟁사 분석 | 40h | 10명 인터뷰, 인사이트 문서 |
| 7-8 | 피봇 결정 + ADR 문서화 | 40h | GO/NO-GO 결정, ADR 5개 |

### 측정 가능한 성과 지표 (Week 8 종료 시)

| 지표 | 현재 (Week 0) | 목표 (Week 8) | 측정 방법 |
|------|---------------|---------------|-----------|
| **보안 등급** | B+ (치명적 3개) | A (치명적 0개) | 수동 보안 테스트 |
| **테스트 커버리지** | 0% | 10% | `npm run test:coverage` |
| **고객 인터뷰** | 0명 | 10명 | 인터뷰 기록 |
| **지불 의향** | 알 수 없음 | ≥50% | 인터뷰 데이터 |
| **ADR 문서** | 0개 | 5개 | `docs/adr/` 카운트 |
| **비즈니스 니치** | 불명확 | 확정 | 의사결정 문서 |

### 리스크 매트릭스 (Phase 1)

| 리스크 | 확률 | 영향 | 완화 전략 |
|--------|------|------|-----------|
| 🔴 보안 패치 중 버그 발생 | 30% | 높음 | 철저한 수동 테스트, Vercel Preview 배포 |
| 🟡 인터뷰 대상자 모집 실패 | 20% | 중간 | 인센티브 증액 ($5 → $10), 채널 확대 |
| 🟡 지불 의향 30% 미만 | 25% | 높음 | 대안 니치 2개 사전 준비, 추가 인터뷰 |
| 🟢 테스트 작성 지연 | 35% | 낮음 | 10% 목표 유연 조정 (7-8% 허용) |
| 🟢 시간 부족 (20h/week) | 40% | 중간 | 우선순위 조정, 저우선순위 Task 연기 |

### Phase 1 → Phase 2 전환 조건

**필수 조건 (Must Have)**:
- ✅ 치명적 보안 취약점 3개 해결 (XSS, 프로필, 인증)
- ✅ 비즈니스 니치 확정 (GO 또는 PIVOT 결정)

**권장 조건 (Should Have)**:
- ✅ 테스트 커버리지 8% 이상 (10% 목표, 80% 허용)
- ✅ 고객 인터뷰 8명 이상 (10명 목표, 80% 허용)

**선택 조건 (Nice to Have)**:
- ADR 5개 완료 (최소 3개)
- Phase 1 회고 완료

---

**다음**: Phase 2 (Week 9-16) - Business Validation & MVP Pivot 계획은 별도 파일로 작성 예정.

