# 🚀 배포 가이드

**작성일**: 2025-01-27  
**목적**: 프로덕션 환경 배포를 위한 완전한 가이드

---

## 📋 **배포 전 체크리스트**

### ✅ **완료된 항목들**
- [x] **Error Boundary 전역 적용** - 앱 안정성 확보
- [x] **Toast 알림 시스템** - 사용자 피드백 개선
- [x] **커뮤니티 기능 완성** - 게시글 작성/조회/필터링
- [x] **리소스 페이지 완성** - 데이터 연결 및 UI 개선
- [x] **Activity 콘텐츠 데이터 연결** - 48개 완전한 학습 활동
- [x] **Firebase 보안 규칙 작성** - 프로덕션 준비 완료

### 🔥 **남은 필수 작업**
- [ ] **Firebase 프로젝트 생성 및 설정**
- [ ] **환경 변수 설정**
- [ ] **Firebase 보안 규칙 배포**
- [ ] **Vercel 배포**

---

## 🔧 **1단계: Firebase 프로젝트 설정**

### 1.1 Firebase 프로젝트 생성
```bash
# Firebase CLI 설치 (이미 설치되어 있다면 생략)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init
```

### 1.2 Firebase 서비스 활성화
Firebase 콘솔에서 다음 서비스들을 활성화하세요:

- ✅ **Authentication** (이메일/비밀번호, Google OAuth)
- ✅ **Firestore Database** (NoSQL 데이터베이스)
- ✅ **Storage** (파일 저장소)
- ✅ **Hosting** (선택사항, Vercel 사용 시 불필요)

### 1.3 Firestore 데이터베이스 생성
```bash
# 보안 규칙 배포
firebase deploy --only firestore:rules

# 인덱스 배포 (필요시)
firebase deploy --only firestore:indexes
```

---

## 🔑 **2단계: 환경 변수 설정**

### 2.1 `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Language Learning Platform
```

### 2.2 Firebase 설정 값 찾기
Firebase 콘솔 > 프로젝트 설정 > 일반 > 웹 앱에서 설정 값을 복사하세요.

---

## 🚀 **3단계: Vercel 배포**

### 3.1 Vercel CLI 설치 및 로그인
```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 로그인
vercel login
```

### 3.2 프로젝트 빌드 테스트
```bash
# 의존성 설치
npm install

# 빌드 테스트
npm run build

# 프로덕션 서버 테스트
npm run start
```

### 3.3 Vercel 배포
```bash
# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3.4 환경 변수 설정 (Vercel)
Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GA_ID (선택사항)
NEXT_PUBLIC_SENTRY_DSN (선택사항)
```

---

## 🛡️ **4단계: 보안 및 최적화**

### 4.1 Firebase 보안 규칙 확인
```bash
# 보안 규칙 테스트
firebase emulators:start --only firestore

# 보안 규칙 배포
firebase deploy --only firestore:rules
```

### 4.2 도메인 설정
Firebase Authentication > 설정 > 승인된 도메인에 프로덕션 도메인을 추가하세요.

### 4.3 CORS 설정
필요시 Firebase Storage CORS 설정을 추가하세요.

---

## 📊 **5단계: 모니터링 설정**

### 5.1 Google Analytics (선택사항)
```typescript
// lib/analytics.ts 파일에서 GA 설정 확인
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
```

### 5.2 Sentry 에러 추적 (선택사항)
```typescript
// lib/sentry.ts 파일에서 Sentry 설정 확인
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

---

## 🧪 **6단계: 배포 후 테스트**

### 6.1 기본 기능 테스트
- [ ] 사용자 회원가입/로그인
- [ ] 대시보드 접근
- [ ] 커리큘럼 페이지 로딩
- [ ] Activity 콘텐츠 표시
- [ ] 커뮤니티 게시글 작성/조회
- [ ] 리소스 페이지 로딩

### 6.2 성능 테스트
- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 최적화 확인
- [ ] 모바일 반응형 확인

### 6.3 보안 테스트
- [ ] 인증되지 않은 접근 차단 확인
- [ ] Firestore 보안 규칙 동작 확인

---

## 🔄 **7단계: CI/CD 설정 (선택사항)**

### 7.1 GitHub Actions 설정
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🆘 **문제 해결**

### 일반적인 문제들

#### 1. Firebase 연결 오류
```bash
# Firebase 프로젝트 확인
firebase projects:list

# 현재 프로젝트 설정
firebase use your-project-id
```

#### 2. 빌드 오류
```bash
# 캐시 클리어
rm -rf .next
npm run build
```

#### 3. 환경 변수 오류
- Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
- `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인

#### 4. 보안 규칙 오류
```bash
# 보안 규칙 문법 확인
firebase emulators:start --only firestore
```

---

## 📈 **배포 후 할 일**

### 즉시 해야 할 일
1. **첫 번째 사용자 테스트** - 실제 사용자로 가입하여 전체 플로우 테스트
2. **데이터 입력** - 커뮤니티에 샘플 게시글 작성
3. **리소스 추가** - Firestore에 학습 리소스 데이터 입력

### 향후 개선 사항
1. **성능 모니터링** - Google Analytics, Vercel Analytics 설정
2. **에러 추적** - Sentry 설정 및 모니터링
3. **사용자 피드백** - 피드백 수집 시스템 구축

---

## 🎉 **배포 완료!**

모든 단계를 완료하면 완전히 작동하는 언어 학습 플랫폼이 프로덕션 환경에서 실행됩니다!

**주요 특징:**
- ✅ 48개 완전한 학습 Activity
- ✅ 커뮤니티 기능 (게시글, 댓글, 좋아요)
- ✅ 리소스 페이지
- ✅ 학습 일지 및 통계
- ✅ 반응형 디자인
- ✅ Firebase 인증 및 데이터베이스
- ✅ 에러 핸들링 및 사용자 피드백

**다음 단계:** 사용자 피드백을 수집하고 지속적으로 개선해 나가세요! 🚀
