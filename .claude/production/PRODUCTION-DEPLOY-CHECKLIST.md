# 🚀 Production Deployment Checklist

**프로젝트**: 영어의 정석 (English Bible)
**버전**: MVP v1.0
**배포 날짜**: 2025-10-11

---

## ✅ Phase 1: Pre-Deployment Verification (배포 전 검증)

### **1. Code Quality** ✅
- [x] 모든 TypeScript 컴파일 에러 해결
- [x] ESLint 에러 0개
- [x] 프로덕션 빌드 성공 (`npm run build`)
- [x] 모든 핵심 컴포넌트 구현 완료
- [x] Error Boundary 구현 (Global + Dashboard)
- [x] Loading States 구현

### **2. Data Integrity** ✅
- [x] Placement Test JSON 검증 (20문제 구조 확인)
- [x] Week 1-8 Activity JSON 파일 (48개) 검증
- [x] Audio 파일 67개 모두 존재 확인
- [x] Firestore Schema 정의 완료
- [x] Progress Tracking 로직 구현 완료

### **3. Firebase Configuration** ✅
- [x] Firebase 프로젝트 생성
- [x] Firebase Authentication 설정 (Email/Password, Google OAuth)
- [x] Firestore Database 생성
- [x] `.env.local` 파일 설정 완료
- [x] Firebase SDK 연결 확인

### **4. Testing** ⏸️
- [ ] Manual Testing 실행 (27개 체크리스트)
- [ ] Critical Tests 5개 PASS 확인
  - [ ] 회원가입/로그인
  - [ ] Placement Test 완료
  - [ ] Week 1 Activity 완료
  - [ ] Audio 재생
  - [ ] Firestore 데이터 저장
- [ ] 🔴 Critical 버그 0개
- [ ] 🟡 High 버그 2개 이하

---

## ✅ Phase 2: Production Environment Setup (프로덕션 환경 설정)

### **1. Firebase Production Settings**

#### **A. Firestore Security Rules 배포**
```bash
# Firebase CLI 설치 (아직 안 했다면)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (이미 했다면 Skip)
firebase init firestore

# Firestore Rules 배포
firebase deploy --only firestore:rules
```

**필수 Security Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;

      // Progress subcollection
      match /progress/{weekId}/{document=**} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }

      // Progress Summary
      match /progressSummary/{document=**} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

#### **B. Firebase Authentication 설정 확인**
- [x] Firebase Console → Authentication → Sign-in method
- [x] Email/Password 활성화
- [x] Google OAuth 활성화 (승인된 도메인 추가)

#### **C. Firebase Hosting 설정 (Option 1)**
```bash
# Firebase Hosting 초기화
firebase init hosting

# 설정:
# - Public directory: out (Next.js export 사용 시) 또는 .next (Next.js + Firebase Functions)
# - Single-page app: Yes
# - Set up automatic builds: No (수동 배포)

# 배포
firebase deploy --only hosting
```

---

### **2. Environment Variables (Production)**

#### **Vercel 배포 시** (Option 2 - 권장):
1. Vercel 프로젝트 생성
2. GitHub 저장소 연결
3. Environment Variables 설정:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_ga_id
```

4. Deploy: `vercel --prod`

---

### **3. Domain & SSL**

#### **A. Custom Domain 설정**
- [ ] 도메인 구매 (예: english-bible.com)
- [ ] DNS 설정
  - Vercel: Vercel DNS 설정 따라하기
  - Firebase Hosting: Firebase Console → Hosting → 커스텀 도메인 추가
- [ ] SSL 인증서 자동 발급 확인 (Vercel/Firebase 자동)

#### **B. Authorized Domains 추가**
- [ ] Firebase Console → Authentication → Settings → Authorized domains
- [ ] 프로덕션 도메인 추가 (예: english-bible.com, www.english-bible.com)

---

## ✅ Phase 3: Deployment Execution (실제 배포)

### **Option 1: Vercel 배포** (권장 ✅)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. Vercel 로그인
vercel login

# 3. 프로젝트 연결 (처음 한 번만)
vercel link

# 4. 프로덕션 배포
vercel --prod

# 배포 완료 후 URL 확인:
# ✓ Production: https://english-bible.vercel.app
```

**Vercel 장점**:
- ✅ 자동 SSL 인증서
- ✅ Global CDN (빠른 로딩)
- ✅ 자동 스케일링
- ✅ Git push 시 자동 배포 (CI/CD)
- ✅ Preview URL (브랜치별 미리보기)

---

### **Option 2: Firebase Hosting 배포**

```bash
# 1. Next.js Static Export
npm run build

# 2. Export to static files
npm run export

# 3. Firebase 배포
firebase deploy --only hosting

# 배포 완료 후 URL 확인:
# ✓ Hosting URL: https://your-project.web.app
```

**Firebase Hosting 장점**:
- ✅ Firebase 서비스와 통합
- ✅ 무료 SSL
- ✅ Global CDN
- ✅ 간단한 설정

---

## ✅ Phase 4: Post-Deployment Verification (배포 후 검증)

### **1. Smoke Testing (스모크 테스트)**
배포 후 프로덕션 환경에서 5가지 Critical Tests 재확인:

#### **Test 1: 회원가입/로그인**
- [ ] 프로덕션 URL 접속 (https://english-bible.vercel.app)
- [ ] 새 계정 생성 (`prod-test@example.com`)
- [ ] 로그인 성공
- [ ] Dashboard 접근 확인

#### **Test 2: Placement Test**
- [ ] 레벨 테스트 시작
- [ ] 20문제 모두 응답
- [ ] Audio 재생 확인 (3개)
- [ ] 결과 페이지 CEFR 레벨 표시

#### **Test 3: Week 1 Activity**
- [ ] Week 1 Vocabulary Activity 완료
- [ ] 제출 성공
- [ ] Progress 저장 확인

#### **Test 4: Audio 재생**
- [ ] Placement Test 오디오 3개 재생
- [ ] Week 1 Listening 오디오 재생
- [ ] 404 에러 없음

#### **Test 5: Firestore 데이터**
- [ ] Firebase Console → Firestore
- [ ] `/users/{uid}/progress/week-1/activities/*` 확인
- [ ] Data 정상 저장 확인

---

### **2. Performance Testing**

#### **A. Lighthouse Score 확인**
```bash
# Chrome DevTools → Lighthouse
# Run analysis on production URL
```

**목표**:
- [ ] Performance: > 80
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 80

#### **B. Load Time 확인**
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s

#### **C. Firestore Query Performance**
- [ ] `getUserProgressSummary()` < 500ms
- [ ] `saveActivityProgress()` < 200ms

---

### **3. Error Monitoring 설정** (선택사항)

#### **Sentry 통합** (권장):
```bash
# 1. Sentry 계정 생성: https://sentry.io

# 2. Sentry 프로젝트 생성

# 3. Environment Variables 추가:
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# 4. @sentry/nextjs 설치
npm install --save @sentry/nextjs

# 5. Sentry 초기화
npx @sentry/wizard@latest -i nextjs
```

**Sentry 장점**:
- ✅ 실시간 에러 알림
- ✅ 에러 스택 트레이스
- ✅ 사용자 영향 분석
- ✅ 성능 모니터링

---

## ✅ Phase 5: Monitoring & Maintenance (모니터링 & 유지보수)

### **1. Analytics 설정**

#### **Google Analytics 4 통합**:
```bash
# 1. GA4 프로젝트 생성: https://analytics.google.com

# 2. Environment Variable 추가:
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 3. Google Analytics 스크립트 추가 (app/layout.tsx):
```

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### **2. Firebase Usage Monitoring**

#### **Firestore 비용 모니터링**:
- [ ] Firebase Console → Usage and billing
- [ ] 일일 읽기/쓰기 작업 추적
- [ ] 예산 알림 설정 ($10/월)

**예상 비용** (사용자 1,000명 기준):
```
Firestore:
- Reads: 1,000 users × 100 reads/day = 100,000 reads/day
- Writes: 1,000 users × 20 writes/day = 20,000 writes/day
- 월간: 3M reads + 600K writes ≈ $7.98/월

Firebase Authentication:
- 무료 (50,000 DAU까지)

Firebase Hosting:
- 무료 (10GB storage, 360MB/day 전송)
```

---

### **3. Backup Strategy**

#### **Firestore 자동 백업**:
```bash
# Firebase Console → Firestore → Backups
# 자동 백업 활성화 (일일)
```

#### **코드 백업**:
- [ ] GitHub 저장소에 정기적으로 Push
- [ ] Tag 생성 (버전 관리): `git tag v1.0.0`

---

## ✅ Phase 6: Launch Checklist (론칭 체크리스트)

### **배포 당일**
- [ ] ✅ 프로덕션 빌드 성공
- [ ] ✅ Vercel/Firebase 배포 성공
- [ ] ✅ Custom Domain 연결 (선택사항)
- [ ] ✅ SSL 인증서 활성화
- [ ] ✅ Firestore Security Rules 배포
- [ ] ✅ Smoke Test 5개 PASS
- [ ] ✅ Lighthouse Score 확인
- [ ] ✅ Google Analytics 연결 (선택사항)
- [ ] ✅ Sentry Error Monitoring (선택사항)

### **론칭 후 24시간 이내**
- [ ] 실제 사용자 피드백 수집
- [ ] 에러 로그 확인 (Sentry or Firebase Crashlytics)
- [ ] Firestore 사용량 확인
- [ ] Performance 지표 확인 (GA4)

### **론칭 후 1주일 이내**
- [ ] 사용자 리텐션 분석
- [ ] 가장 많이 사용되는 기능 파악
- [ ] 버그 수정 및 핫픽스 배포
- [ ] Phase 2 계획 수립 (Elite Track, 커뮤니티 등)

---

## 🚨 Rollback Plan (롤백 계획)

### **Critical Issue 발생 시**:

#### **Vercel 배포 롤백**:
```bash
# 1. Vercel Dashboard → Deployments
# 2. 이전 성공한 배포 선택
# 3. "Promote to Production" 클릭
```

#### **Firebase Hosting 롤백**:
```bash
# 1. Firebase Console → Hosting → Release History
# 2. 이전 버전 선택
# 3. "Rollback" 클릭
```

#### **Firestore Rules 롤백**:
```bash
# 1. Firebase Console → Firestore → Rules → History
# 2. 이전 버전 복원
```

---

## 📊 Success Metrics (성공 지표)

### **Week 1 목표**:
- [ ] 100명 회원가입
- [ ] 80% Placement Test 완료율
- [ ] 50% Week 1 시작율
- [ ] < 3초 페이지 로드 시간
- [ ] < 1% 에러율

### **Month 1 목표**:
- [ ] 500명 회원가입
- [ ] 40% Week 1 완료율
- [ ] 평균 세션 시간 > 10분
- [ ] 일일 활성 사용자 (DAU) 100명

---

## 🎉 Deployment Complete!

**프로덕션 배포 완료 후**:

```
✅ 영어의 정석 (English Bible) MVP v1.0 배포 완료!

🌐 Production URL: https://english-bible.vercel.app
📊 Firebase Console: https://console.firebase.google.com/
📈 Analytics: https://analytics.google.com/

다음 단계:
1. 사용자 피드백 수집
2. 버그 수정 및 개선
3. Phase 2 계획 (Elite Track 완성, 커뮤니티 기능)
4. 마케팅 및 프로모션
```

**축하합니다! 🎉🚀**
