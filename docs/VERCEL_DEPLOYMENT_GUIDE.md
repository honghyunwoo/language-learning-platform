# Vercel 배포 가이드

## 개요

이 문서는 언어 학습 플랫폼 (영어의 정석)을 Vercel에 자동 배포하는 전체 프로세스를 설명합니다.

**프로젝트 정보**:
- Next.js 15.5.4
- Firebase/Firestore 백엔드
- PWA 지원 (Service Worker)
- 빌드 시간: 약 2-3분

---

## 1단계: GitHub 저장소 준비

### 1.1 저장소 생성

1. [GitHub](https://github.com) 접속 및 로그인
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. 저장소 설정:
   - **Repository name**: `english-curriculum-platform` (추천)
   - **Description**: "언어 학습 플랫폼 - 영어의 정석 (MVP)"
   - **Visibility**: Private (추천) 또는 Public
   - **초기화 옵션**: 모두 체크 해제 (기존 프로젝트 푸시)
4. `Create repository` 클릭

### 1.2 로컬 저장소 연결

```bash
# 현재 저장소의 리모트 URL 확인
git remote -v

# 리모트가 없거나 변경이 필요한 경우:
git remote add origin https://github.com/[YOUR_USERNAME]/english-curriculum-platform.git

# 또는 기존 리모트 변경:
git remote set-url origin https://github.com/[YOUR_USERNAME]/english-curriculum-platform.git
```

### 1.3 환경 변수 보호 확인

**중요**: 다음 파일들이 `.gitignore`에 포함되어 있는지 확인:
```
.env*
.env.local
.env.production
```

현재 `.gitignore`는 `.env*` 패턴으로 모든 환경 변수 파일을 제외하고 있습니다. ✅

### 1.4 코드 푸시

```bash
# 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: MVP 출시 준비 완료

- Next.js 15.5.4 프로덕션 빌드 최적화
- PWA 서비스 워커 활성화
- Firebase Firestore 통합
- 8주 커리큘럼 + 배치고사 구현
- Vercel 배포 설정 추가"

# GitHub에 푸시
git push -u origin main
```

**트러블슈팅**:
- 인증 실패 시: Personal Access Token 사용
  - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - 권한: `repo` 전체 체크
  - 생성된 토큰을 비밀번호 대신 사용

---

## 2단계: Vercel 프로젝트 생성

### 2.1 Vercel 계정 연결

1. [Vercel](https://vercel.com) 접속
2. `Sign Up` 또는 `Log In`
3. **GitHub로 로그인** (권장)
   - Vercel이 GitHub 저장소에 접근할 수 있도록 허용

### 2.2 새 프로젝트 생성

1. Vercel 대시보드에서 `Add New...` → `Project` 클릭
2. `Import Git Repository` 섹션에서:
   - GitHub 저장소 목록에서 `english-curriculum-platform` 선택
   - 또는 저장소 URL 직접 입력
3. `Import` 클릭

### 2.3 프로젝트 설정

**Framework Preset**: Next.js (자동 감지) ✅

**Build and Output Settings**:
- **Build Command**: `npm run build` (자동 설정)
- **Output Directory**: `.next` (자동 설정)
- **Install Command**: `npm install` (자동 설정)

**Root Directory**: `.` (프로젝트 루트)

---

## 3단계: 환경 변수 설정

### 3.1 필수 환경 변수

Vercel 프로젝트 설정 페이지에서 `Environment Variables` 탭:

#### Firebase 클라이언트 설정 (필수)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123...
```

**찾는 방법**:
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택
3. 프로젝트 설정 (톱니바퀴 아이콘) → 일반 탭
4. "내 앱" 섹션 → 웹 앱 선택 → 구성 확인

#### Firebase Admin SDK (선택사항)

서버사이드 작업이 필요한 경우에만 추가:

```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**찾는 방법**:
1. Firebase Console → 프로젝트 설정 → 서비스 계정 탭
2. `새 비공개 키 생성` 클릭
3. JSON 파일 다운로드
4. JSON 내용을 환경 변수로 복사

**주의**: Private Key는 `\n`을 그대로 유지해야 합니다.

#### 기타 설정

```env
NEXT_TELEMETRY_DISABLED=1
```

### 3.2 환경별 설정

각 환경 변수에 대해 적용 범위 선택:
- **Production**: 프로덕션 배포에만 적용
- **Preview**: PR 및 브랜치 배포에 적용
- **Development**: 로컬 개발에 적용 (Vercel CLI 사용 시)

**권장 설정**: Production + Preview 체크 ✅

### 3.3 환경 변수 추가 방법

#### 방법 1: Vercel 대시보드 (추천)

1. 프로젝트 선택 → `Settings` → `Environment Variables`
2. 변수 이름 입력 (예: `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. 값 입력
4. 적용 환경 선택 (Production, Preview, Development)
5. `Save` 클릭
6. 모든 변수 추가 후 → `Redeploy` 필요

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경 변수 추가
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# 값 입력 프롬프트에서 입력

# .env.local 파일에서 자동 추가
vercel env pull .env.local
```

#### 방법 3: .env 파일 업로드 (빠른 설정)

1. 로컬 `.env.local` 파일 준비
2. Vercel 대시보드 → Environment Variables
3. `Bulk Edit` 버튼 클릭
4. `.env` 파일 내용 복사 붙여넣기
5. `Save` 클릭

---

## 4단계: 첫 배포 실행

### 4.1 자동 배포 트리거

환경 변수 설정 완료 후:

1. Vercel 대시보드 → 프로젝트 선택
2. `Deployments` 탭
3. 우측 상단 `Redeploy` 버튼 클릭 (환경 변수 적용)

또는 GitHub에서 자동 트리거:

```bash
git commit --allow-empty -m "chore: trigger Vercel deployment"
git push
```

### 4.2 배포 진행 상황 모니터링

1. Vercel 대시보드 → 프로젝트 → `Deployments`
2. 최신 배포 항목 클릭
3. 빌드 로그 실시간 확인:
   - Installing dependencies
   - Building application
   - Deployment completed

**예상 빌드 시간**: 2-3분

### 4.3 배포 성공 확인

배포 완료 후:
- 배포 URL: `https://[project-name]-[random-string].vercel.app`
- 상태: `Ready` (녹색 체크)
- 도메인 클릭 → 실제 사이트 확인

**체크리스트**:
- [ ] 홈페이지 로딩
- [ ] 로그인 / 회원가입 동작
- [ ] 대시보드 접근
- [ ] 학습 활동 렌더링
- [ ] Service Worker 등록 (PWA)

---

## 5단계: 자동 배포 설정

### 5.1 Git 브랜치 전략

Vercel은 기본적으로 다음 브랜치에 자동 배포:

- **main** (또는 master): 프로덕션 배포
- **기타 모든 브랜치**: 프리뷰 배포

### 5.2 자동 배포 플로우

#### 프로덕션 배포 (main 브랜치)

```bash
# 기능 개발
git checkout -b feature/new-feature
# 작업...

# main에 머지
git checkout main
git merge feature/new-feature
git push origin main

# Vercel이 자동으로 감지하여 프로덕션 배포 시작
```

배포 트리거:
1. GitHub에 푸시 감지
2. Vercel Webhook 수신
3. 자동 빌드 시작
4. 성공 시 프로덕션 URL 업데이트
5. GitHub PR에 배포 상태 코멘트 추가

#### 프리뷰 배포 (기능 브랜치)

```bash
# 새 브랜치 생성
git checkout -b feature/experimental

# 변경사항 푸시
git commit -am "feat: 실험적 기능 추가"
git push origin feature/experimental
```

Vercel이 자동으로:
- 프리뷰 환경 생성 (`https://[project]-[branch]-[user].vercel.app`)
- GitHub PR에 프리뷰 링크 코멘트 추가
- 프로덕션 환경에 영향 없음

### 5.3 Pull Request 통합

GitHub PR 생성 시:

1. Vercel Bot이 자동으로 코멘트 추가:
   - 프리뷰 배포 URL
   - 빌드 로그 링크
   - 배포 상태 (빌드 중 / 성공 / 실패)

2. PR 머지 전 프리뷰 환경에서 테스트 가능

3. PR 머지 후:
   - main 브랜치 자동 배포
   - 프리뷰 환경 자동 삭제 (선택사항)

### 5.4 배포 알림 설정

Vercel → 프로젝트 → Settings → Notifications:

- **Slack**: Webhook URL 추가
- **Email**: 배포 상태 이메일 수신
- **Discord**: Webhook 통합

---

## 6단계: 커스텀 도메인 연결 (선택사항)

### 6.1 도메인 추가

1. Vercel 대시보드 → 프로젝트 → `Settings` → `Domains`
2. `Add` 버튼 클릭
3. 도메인 입력 (예: `english-curriculum.com`)
4. DNS 설정 방법 선택:
   - **Vercel Nameservers** (권장): 자동 설정
   - **Custom Nameservers**: 수동 DNS 레코드 추가

### 6.2 DNS 설정 (Custom Nameservers)

도메인 등록업체 (예: GoDaddy, Namecheap)에서:

**A 레코드**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME 레코드** (www 서브도메인):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 6.3 SSL 인증서

Vercel이 자동으로:
- Let's Encrypt SSL 인증서 발급
- HTTPS 리다이렉트 설정
- 인증서 자동 갱신

**설정 시간**: 24-48시간 (DNS 전파 시간)

### 6.4 도메인 확인

1. `https://[your-domain.com]` 접속
2. SSL 인증서 유효성 확인 (자물쇠 아이콘)
3. Vercel 배포 URL에서 커스텀 도메인으로 리다이렉트 확인

---

## 7단계: 성능 최적화 및 모니터링

### 7.1 Vercel Analytics 활성화

1. Vercel 대시보드 → 프로젝트 → `Analytics`
2. `Enable Analytics` 클릭
3. 무료 플랜: 월 10,000 페이지뷰

**제공 지표**:
- 페이지뷰 및 고유 방문자
- 페이지 로딩 시간 (TTFB, FCP, LCP)
- 디바이스 및 브라우저 분포
- 지역별 트래픽

### 7.2 Vercel Speed Insights

1. 프로젝트 → `Speed Insights` 탭
2. `Enable Speed Insights` 클릭

**모니터링 지표**:
- **LCP** (Largest Contentful Paint): < 2.5초 목표
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 7.3 Build 캐시 최적화

Vercel은 자동으로:
- `node_modules` 캐싱
- Next.js 빌드 캐시 (`.next/cache`)
- 의존성 변경 시에만 재설치

**수동 캐시 무효화**:
```bash
vercel --force  # 모든 캐시 무시하고 재빌드
```

### 7.4 에러 추적 (Sentry 통합)

선택사항이지만 프로덕션 권장:

1. [Sentry](https://sentry.io) 계정 생성
2. Sentry 프로젝트 생성 (Next.js 선택)
3. 환경 변수 추가:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_AUTH_TOKEN=...
   ```
4. 자동 에러 리포팅 활성화

---

## 8단계: 프로덕션 체크리스트

배포 전 최종 확인:

### 보안
- [ ] 모든 시크릿이 환경 변수로 설정됨
- [ ] `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] Firebase 보안 규칙 활성화
- [ ] API 키 제한 설정 (Firebase Console)

### 성능
- [ ] 프로덕션 빌드 성공 (`npm run build`)
- [ ] 번들 크기 최적화 확인
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] Service Worker 동작 확인 (PWA)

### 기능
- [ ] 로그인/회원가입 동작
- [ ] 데이터베이스 연결 확인
- [ ] 모든 페이지 라우팅 정상
- [ ] 반응형 디자인 확인 (모바일/태블릿)

### SEO
- [ ] `metadata` 설정 (title, description)
- [ ] Open Graph 이미지 설정
- [ ] Sitemap 생성 (`sitemap.xml`)
- [ ] Robots.txt 설정

---

## 9단계: 트러블슈팅

### 빌드 실패 (Build Failed)

**원인 1**: 환경 변수 누락
```
Error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined
```

**해결**:
1. Vercel → Settings → Environment Variables
2. 누락된 변수 추가
3. Redeploy

**원인 2**: TypeScript 타입 에러
```
Type error: Property 'xxx' does not exist on type 'yyy'
```

**해결**:
1. 로컬에서 `npm run build` 실행하여 에러 확인
2. TypeScript 에러 수정
3. 다시 푸시

**원인 3**: 의존성 버전 충돌
```
npm ERR! peer dependency conflict
```

**해결**:
```bash
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "fix: resolve peer dependency conflicts"
git push
```

### 런타임 에러 (Runtime Error)

**Firebase 연결 실패**:
```javascript
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**해결**:
1. Firebase API 키 확인 (공백, 줄바꿈 없는지)
2. Firebase Console에서 도메인 허용 목록 확인:
   - Firebase Console → Authentication → Settings → Authorized domains
   - `[project-name].vercel.app` 추가

**Service Worker 충돌**:
```
Uncaught (in promise) DOMException: Failed to register ServiceWorker
```

**해결**:
1. `vercel.json`에서 Service Worker 헤더 확인
2. HTTPS 환경에서만 동작 (Vercel은 자동 HTTPS)

### 배포 속도 느림

**빌드 시간 > 5분**:

**최적화**:
1. 불필요한 의존성 제거
2. 빌드 캐시 활용 확인
3. `next.config.ts`에서 최적화 설정:
   ```typescript
   const nextConfig = {
     compiler: {
       removeConsole: process.env.NODE_ENV === 'production'
     }
   }
   ```

### Serverless Function 타임아웃

**에러**: `Function Execution Timeout`

**해결**:
1. `vercel.json`에서 타임아웃 증가:
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 60
       }
     }
   }
   ```

2. 무료 플랜: 최대 10초
3. Pro 플랜: 최대 60초

---

## 10단계: 지속적 개선

### 자동 테스트 통합 (CI/CD)

GitHub Actions 워크플로우 추가:

`.github/workflows/vercel-deploy.yml`:
```yaml
name: Vercel Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm test # 테스트 추가 시
```

### 배포 전 자동 승인

Vercel → Settings → Git → Deploy Protection:
- **Enable Deploy Protection**: main 브랜치 배포 전 승인 필요

### 롤백 전략

배포 실패 시:

1. Vercel 대시보드 → Deployments
2. 이전 성공한 배포 선택
3. `Promote to Production` 클릭
4. 즉시 이전 버전으로 롤백

**자동 롤백**:
- Vercel은 빌드 실패 시 자동으로 이전 버전 유지
- 프로덕션 URL은 변경되지 않음

---

## 요약: 빠른 배포 체크리스트

### 1분 체크리스트

```bash
# 1. 코드 푸시
git add .
git commit -m "feat: MVP 출시"
git push origin main

# 2. Vercel 프로젝트 생성
# - Vercel 대시보드에서 Import
# - GitHub 저장소 선택

# 3. 환경 변수 설정
# - NEXT_PUBLIC_FIREBASE_* 추가
# - FIREBASE_ADMIN_* 추가 (선택)

# 4. 배포 시작
# - 자동 또는 Redeploy 버튼 클릭

# 5. 확인
# - [project-name].vercel.app 접속
# - 기능 테스트
```

### 지원 리소스

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포 가이드**: https://nextjs.org/docs/deployment
- **Firebase 설정**: https://firebase.google.com/docs/web/setup
- **Vercel 커뮤니티**: https://github.com/vercel/vercel/discussions

---

**배포 완료 후**:
- [ ] 프로덕션 URL 공유
- [ ] Firebase Analytics 설정
- [ ] 사용자 피드백 수집
- [ ] 성능 모니터링 시작

**문의 사항**: Vercel Support (support@vercel.com) 또는 Discord 커뮤니티

---

**마지막 업데이트**: 2025-10-11
**버전**: 1.0
**작성자**: DevOps Team
