# 배포 가이드

## 사전 준비사항

### 1. Firebase 프로젝트 설정 확인

- ✅ Firebase Authentication 활성화
- ✅ Firestore Database 생성
- ✅ Firestore 보안 규칙 배포
- ✅ 환경 변수 설정 완료

### 2. 프로덕션 빌드 테스트

```bash
npm run build
```

빌드가 성공적으로 완료되는지 확인합니다.

## Vercel 배포 (권장)

Vercel은 Next.js 애플리케이션에 최적화된 호스팅 플랫폼입니다.

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속
2. GitHub 계정으로 로그인

### 2. 프로젝트 Import

1. "Add New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: Next.js (자동 감지)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. 환경 변수 설정

Environment Variables 섹션에서 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_GA_ID=your_value (선택사항)
```

### 4. 배포

"Deploy" 버튼 클릭

- 배포 완료 후 제공되는 URL로 접속 가능
- 자동 HTTPS 인증서 발급
- Git push 시 자동 재배포

### 5. 커스텀 도메인 연결 (선택사항)

1. Vercel 프로젝트 > Settings > Domains
2. 도메인 추가
3. DNS 설정 (제공되는 안내 따라 진행)

## Firebase Hosting 배포

Firebase에서 직접 호스팅하는 방법입니다.

### 1. Firebase CLI 설치

```bash
npm install -g firebase-tools
```

### 2. Firebase 로그인

```bash
firebase login
```

### 3. Firebase 프로젝트 초기화

```bash
firebase init hosting
```

설정:
- Use an existing project: 생성한 Firebase 프로젝트 선택
- Public directory: `out`
- Configure as single-page app: Yes
- Set up automatic builds: No

### 4. Next.js Static Export 설정

`next.config.ts` 수정:

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

⚠️ **주의**: Static Export 사용 시 일부 기능 제한:
- Server-side rendering 불가
- API routes 사용 불가
- Image Optimization 제한

### 5. 빌드 및 배포

```bash
npm run build
firebase deploy --only hosting
```

## Netlify 배포

### 1. Netlify 계정 생성 및 로그인

[Netlify](https://www.netlify.com)

### 2. 프로젝트 Import

1. "Add new site" > "Import an existing project"
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3. 환경 변수 설정

Site settings > Build & deploy > Environment 에서 설정

### 4. Next.js 플러그인 활성화

Netlify는 Next.js를 자동으로 감지하고 플러그인을 설치합니다.

## Railway 배포

### 1. Railway 계정 생성

[Railway](https://railway.app)

### 2. 프로젝트 생성

1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 선택

### 3. 환경 변수 설정

Variables 탭에서 환경 변수 추가

### 4. 자동 배포

Railway가 자동으로 빌드 및 배포를 진행합니다.

## Docker 배포

### 1. Dockerfile 생성

```dockerfile
# 베이스 이미지
FROM node:18-alpine AS base

# 의존성 설치
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 빌드
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 프로덕션
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. 빌드 및 실행

```bash
# 이미지 빌드
docker build -t language-learning-platform .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  # ... 기타 환경 변수
  language-learning-platform
```

## Firestore 보안 규칙 배포

배포 후 반드시 Firestore 보안 규칙을 배포해야 합니다.

```bash
firebase deploy --only firestore:rules
```

또는 Firebase Console에서 직접 규칙 업데이트:

1. Firebase Console > Firestore Database > 규칙 탭
2. `firestore.rules` 파일 내용 복사/붙여넣기
3. "게시" 버튼 클릭

## 배포 후 확인사항

### 1. 기능 테스트

- ✅ 회원가입/로그인 작동
- ✅ 커리큘럼 페이지 로드
- ✅ Activity 학습 가능
- ✅ Journal 작성/조회
- ✅ Community 글 작성/조회
- ✅ Profile 통계 표시
- ✅ 알림 기능

### 2. 성능 확인

- [PageSpeed Insights](https://pagespeed.web.dev/)에서 성능 측정
- Lighthouse 점수 확인

### 3. 에러 모니터링

Sentry 설정 시:
- Sentry 대시보드에서 에러 발생 확인
- 에러 알림 설정

## CI/CD 설정 (GitHub Actions)

### GitHub Actions Workflow 예시

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

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

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          # ... 기타 secrets

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 문제 해결

### 빌드 실패

**오류**: Module not found 또는 Type error

**해결**:
```bash
# 캐시 삭제 및 재설치
rm -rf .next node_modules
npm install
npm run build
```

### 환경 변수 미적용

**증상**: Firebase 초기화 실패

**해결**:
1. 환경 변수가 `NEXT_PUBLIC_` 접두사로 시작하는지 확인
2. 배포 플랫폼의 환경 변수 설정 재확인
3. 배포 재시도

### Firestore 권한 오류

**오류**: Missing or insufficient permissions

**해결**:
```bash
firebase deploy --only firestore:rules
```

## 모니터링 및 유지보수

### 로그 확인

- **Vercel**: Vercel Dashboard > Project > Logs
- **Firebase**: Firebase Console > Functions > Logs
- **Sentry**: Error tracking dashboard

### 성능 모니터링

- Google Analytics: 사용자 행동 분석
- Vercel Analytics: Core Web Vitals 모니터링
- Firebase Performance: 앱 성능 추적

### 정기 업데이트

```bash
# 의존성 업데이트 확인
npm outdated

# 안전한 업데이트
npm update

# 메이저 버전 업데이트
npm install package@latest
```

## 비용 최적화

### Firebase Spark Plan (무료)

- Firestore: 1GB 저장소, 50K 읽기/20K 쓰기 per day
- Authentication: 무제한
- Hosting: 10GB 저장소, 360MB/day 전송

### Vercel Hobby Plan (무료)

- 무제한 배포
- 100GB 대역폭/month
- Serverless functions 100GB-hours

비용 초과 시 유료 플랜으로 업그레이드 필요

## 참고 자료

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Netlify Next.js](https://docs.netlify.com/integrations/frameworks/next-js/)
