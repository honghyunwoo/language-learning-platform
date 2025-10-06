# 환경 변수 설정 가이드

## 필수 환경 변수

### Firebase 설정

프로젝트를 실행하기 위해서는 Firebase 프로젝트가 필요합니다.

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정 > 일반 탭에서 앱 추가 (웹 앱)
4. Firebase SDK 구성 정보 복사

### 환경 변수 파일 생성

1. 프로젝트 루트에 `.env.local` 파일 생성
2. `.env.example` 파일의 내용을 복사
3. Firebase Console에서 얻은 값으로 대체

```bash
# .env.local 예시
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Firebase 서비스 설정

### 1. Authentication 설정

1. Firebase Console > Authentication
2. 로그인 방법 탭에서 다음 제공업체 활성화:
   - 이메일/비밀번호
   - Google (선택사항)

### 2. Firestore Database 설정

1. Firebase Console > Firestore Database
2. "데이터베이스 만들기" 클릭
3. 프로덕션 모드로 시작
4. 지역 선택 (asia-northeast3 권장 - 서울)
5. 보안 규칙 배포:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Storage 설정 (선택사항)

현재 Storage는 결제가 필요하여 비활성화되어 있습니다.
활성화하려면:

1. Firebase Console > Storage
2. "시작하기" 클릭
3. 보안 규칙 설정
4. `lib/firebase.ts`에서 Storage 관련 주석 해제

## 선택적 환경 변수

### Google Analytics

웹사이트 방문자 추적을 위한 설정:

1. [Google Analytics](https://analytics.google.com/) 계정 생성
2. 새 속성 생성
3. 측정 ID (G-XXXXXXXXXX) 복사
4. `.env.local`에 추가:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Sentry Error Tracking

에러 모니터링을 위한 설정:

1. [Sentry](https://sentry.io/) 계정 생성
2. 새 프로젝트 생성 (Next.js 선택)
3. DSN 복사
4. `.env.local`에 추가:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_AUTH_TOKEN=your_auth_token
   ```

## 환경별 설정

### 개발 환경
```bash
# .env.local (gitignore에 포함됨)
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### 프로덕션 환경 (Vercel)

1. Vercel 프로젝트 설정 > Environment Variables
2. 모든 환경 변수를 Production, Preview, Development 환경에 추가
3. 배포 시 자동으로 적용됨

### 프로덕션 환경 (기타 호스팅)

호스팅 플랫폼의 환경 변수 설정 페이지에서 동일하게 설정

## 보안 주의사항

⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

- `.env.local`: 실제 값 (gitignore에 포함)
- `.env.example`: 예시 템플릿 (Git에 포함)

## 문제 해결

### Firebase 초기화 실패

```
Error: Firebase configuration is invalid
```

**해결방법**: 모든 `NEXT_PUBLIC_FIREBASE_*` 환경 변수가 설정되었는지 확인

### 환경 변수가 로드되지 않음

```
Error: process.env.NEXT_PUBLIC_FIREBASE_API_KEY is undefined
```

**해결방법**:
1. 개발 서버 재시작 (`npm run dev`)
2. `.env.local` 파일이 프로젝트 루트에 있는지 확인
3. 변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인

### Firestore 권한 오류

```
Error: Missing or insufficient permissions
```

**해결방법**: `firestore.rules` 파일을 Firebase에 배포
```bash
firebase deploy --only firestore:rules
```

## 참고 자료

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
