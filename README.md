# 🌍 Language Learning Platform

CEFR 기반의 체계적인 영어 학습 플랫폼입니다. A1부터 B2까지 단계별 커리큘럼과 다양한 학습 활동을 제공합니다.

## ✨ 주요 기능

### 📚 체계적인 커리큘럼
- **CEFR 기반 레벨 시스템** (A1, A2, B1, B2)
- **8주 완성 커리큘럼** - 각 레벨별 체계적인 학습 경로
- **6가지 학습 활동**: 듣기, 말하기, 읽기, 쓰기, 어휘, 문법

### 📊 학습 관리
- **실시간 진행률 추적** - 활동별/주차별 학습 진도 확인
- **학습 일지 (Journal)** - 매일의 학습 기록 및 통계
- **학습 통계** - 총 학습 시간, 완료 활동, 연속 학습일 추적

### 👥 커뮤니티
- **게시판** - 질문, 팁, 토론 게시글 작성
- **스터디 그룹** - 함께 공부할 그룹 찾기
- **답변 채택 시스템** - 질문 게시글에 베스트 답변 선택

### 🏆 동기부여 시스템
- **뱃지 시스템** - 학습 마일스톤 달성 시 뱃지 획득
- **연속 학습 추적** - Streak 기록으로 꾸준한 학습 유도
- **알림 시스템** - 일일 리마인더 및 성취 알림

## 🛠️ 기술 스택

- **Next.js 15.5.4** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS v4** - 유틸리티 기반 스타일링
- **Firebase** - Authentication, Firestore, Security Rules
- **React Query** - 서버 상태 관리
- **Framer Motion** - 애니메이션

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

자세한 환경 변수 설정은 [ENVIRONMENT.md](./ENVIRONMENT.md)를 참조하세요.

### 3. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호)
3. Firestore Database 생성
4. Firestore 보안 규칙 배포:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3008 에서 애플리케이션을 확인할 수 있습니다.

## 📖 문서

- [환경 변수 설정 가이드](./ENVIRONMENT.md)
- [배포 가이드](./DEPLOYMENT.md)
- [개발 로드맵](./DEVELOPMENT_ROADMAP.md)

## 📋 주요 스크립트

```bash
npm run dev        # 개발 서버 (포트 3008)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run lint       # ESLint 실행
npm run validate:json  # Activity JSON 검증
```

## 📊 프로젝트 통계

- **48개** Activity JSON 파일
- **6가지** 학습 활동 유형
- **4개** CEFR 레벨 (A1-B2)
- **8주** 커리큘럼 (각 레벨)

## 🌐 배포

Vercel, Firebase Hosting, Netlify 등 다양한 플랫폼에 배포 가능합니다.
자세한 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

## 🔐 보안

- Firebase Authentication으로 안전한 사용자 인증
- Firestore Security Rules로 데이터 접근 제어
- 환경 변수를 통한 민감 정보 관리

---

**Made with ❤️ using Next.js and Firebase**
