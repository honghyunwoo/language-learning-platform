# Replit 배포 가이드

## 🚀 Replit으로 빠른 배포

이 가이드는 언어 학습 플랫폼을 Replit에서 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **Replit 계정** - [replit.com](https://replit.com) 회원가입
2. **Firebase 프로젝트** - Firebase Console에서 프로젝트 생성
3. **GitHub 저장소** - https://github.com/honghyunwoo/language-learning-platform

## 🎯 단계별 배포 방법

### 1단계: Replit에서 프로젝트 가져오기

#### 방법 A: GitHub에서 직접 가져오기 (권장)

1. [Replit](https://replit.com) 로그인
2. 우측 상단 `+ Create` 버튼 클릭
3. `Import from GitHub` 선택
4. GitHub 저장소 URL 입력:
   ```
   https://github.com/honghyunwoo/language-learning-platform
   ```
5. `Import from GitHub` 버튼 클릭

#### 방법 B: 수동으로 프로젝트 생성

1. `+ Create` → `Node.js` 템플릿 선택
2. 프로젝트 이름: `language-learning-platform`
3. GitHub에서 코드 복사하여 붙여넣기

### 2단계: 환경 변수 설정

Replit의 Secrets (Tools → Secrets) 탭에서 다음 환경 변수를 추가:

#### Firebase 설정
```bash
# Firebase Web App Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (배포 시 필요)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"
```

#### Firebase 설정값 찾는 방법

1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택
3. 프로젝트 설정 (⚙️) → 일반 탭
4. "내 앱" 섹션에서 웹 앱 추가 (</> 아이콘)
5. `firebaseConfig` 객체의 값들을 복사

#### Firebase Admin SDK 키 생성

1. Firebase Console → 프로젝트 설정 → 서비스 계정 탭
2. "새 비공개 키 생성" 버튼 클릭
3. JSON 파일 다운로드
4. JSON 파일의 내용을 Secrets에 추가:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

### 3단계: 의존성 설치

Replit Shell에서 실행:

```bash
npm install
```

### 4단계: 개발 서버 실행

Replit의 "Run" 버튼을 클릭하거나 Shell에서:

```bash
npm run dev
```

앱이 자동으로 실행되고 Replit의 웹뷰에 표시됩니다.

### 5단계: Firebase 규칙 배포

Replit Shell에서:

```bash
# Firebase CLI 로그인
firebase login --no-localhost

# Firestore 규칙 배포
firebase deploy --only firestore:rules

# Storage 규칙 배포 (필요시)
firebase deploy --only storage
```

### 6단계: 프로덕션 배포

#### Replit Deployments 사용

1. Replit 프로젝트에서 `Deploy` 버튼 클릭
2. `Autoscale Deployment` 선택 (추천)
3. 설정:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Port**: `3000`
4. `Deploy` 버튼 클릭

배포가 완료되면 고유한 URL이 제공됩니다:
```
https://your-project.your-username.repl.co
```

## 🔧 Replit 최적화

### package.json 수정

`package.json`에 다음 스크립트가 있는지 확인:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "prebuild": "npm run validate:json"
  }
}
```

### 메모리 최적화

Replit의 무료 플랜은 메모리가 제한적이므로, 필요시 `.env.local` 추가:

```bash
# Next.js 빌드 최적화
NODE_OPTIONS="--max_old_space_size=2048"
```

## 📊 Firestore 인덱스 생성

앱을 사용하면서 Firestore 에러가 발생하면:

1. 에러 메시지에서 인덱스 생성 링크 클릭
2. 또는 Firebase Console → Firestore Database → 인덱스 탭에서 수동 생성

### 필수 복합 인덱스

```
컬렉션: posts
필드: category (ASC), createdAt (DESC)

컬렉션: posts
필드: authorId (ASC), createdAt (DESC)

컬렉션: notifications
필드: userId (ASC), createdAt (DESC)

컬렉션: weekProgress
필드: userId (ASC), status (ASC)
```

## 🔒 보안 설정

### Firestore 규칙 적용

`firestore.rules` 파일이 프로젝트에 포함되어 있습니다:

```bash
firebase deploy --only firestore:rules
```

### CORS 설정

Firebase Storage를 사용하는 경우, CORS 설정이 필요할 수 있습니다.

## 🐛 문제 해결

### 빌드 실패

**문제**: `npm run build` 실패
**해결**:
```bash
# 캐시 삭제
rm -rf .next node_modules
npm install
npm run build
```

### Firebase 연결 안됨

**문제**: Firebase 인증 실패
**해결**:
1. Secrets의 환경 변수 확인
2. Firebase Console에서 도메인 추가:
   - Authentication → Settings → Authorized domains
   - Replit 도메인 추가: `*.repl.co`

### 포트 충돌

**문제**: Port already in use
**해결**:
```bash
# 실행 중인 프로세스 종료
pkill -f next

# 다시 실행
npm run dev
```

### 메모리 부족

**문제**: JavaScript heap out of memory
**해결**:
```bash
# .env.local 파일에 추가
NODE_OPTIONS="--max_old_space_size=2048"
```

## 📱 모바일 테스트

Replit은 자동으로 모바일 미리보기를 제공합니다:
- 우측 상단 "Open in new tab" 클릭
- 브라우저 개발자 도구로 모바일 뷰 테스트

## 🔄 자동 배포 (CI/CD)

GitHub에 푸시하면 Replit이 자동으로 감지하고 재배포:

1. Replit 프로젝트 설정
2. `Version Control` → `Connect to GitHub`
3. 저장소 연결
4. `Auto-deploy` 활성화

## 📈 성능 모니터링

### Replit 내장 모니터링

- CPU 사용량
- 메모리 사용량
- 네트워크 트래픽

### Next.js Analytics

무료 플랜에서는 제한적이지만, Vercel Analytics 추가 가능:

```bash
npm install @vercel/analytics
```

## 💡 추가 팁

### 1. 환경별 설정

```bash
# 개발
npm run dev

# 프로덕션 빌드 테스트
npm run build
npm start
```

### 2. 빠른 재시작

Replit Shell에서:
```bash
# 개발 서버 재시작
npm run dev
```

### 3. 로그 확인

```bash
# 실시간 로그
tail -f .next/trace

# 에러 로그
npm run dev 2>&1 | grep -i error
```

## 🎉 배포 완료 체크리스트

- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정 (Secrets)
- [ ] Firebase 프로젝트 연동
- [ ] `npm install` 성공
- [ ] `npm run dev` 로컬 테스트
- [ ] `npm run build` 빌드 성공
- [ ] Firestore 규칙 배포
- [ ] Replit Deployment 완료
- [ ] 배포 URL 테스트
- [ ] Firebase 도메인 허용 설정
- [ ] 모바일 반응형 테스트

## 🌐 배포 URL

배포 완료 후 공유 가능한 URL:
```
https://language-learning-platform.your-username.repl.co
```

## 📞 도움말

문제가 발생하면:
1. Replit 커뮤니티 포럼
2. Firebase 문서
3. Next.js 문서
4. GitHub Issues

---

**제작**: Claude Code
**프로젝트**: Language Learning Platform
**GitHub**: https://github.com/honghyunwoo/language-learning-platform
