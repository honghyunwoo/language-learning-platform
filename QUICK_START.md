# 🚀 빠른 시작 가이드

## Replit으로 5분 안에 배포하기

### 1️⃣ Replit에 프로젝트 가져오기

1. [Replit](https://replit.com) 접속 및 로그인
2. `+ Create` 버튼 클릭
3. `Import from GitHub` 선택
4. 저장소 URL 입력:
   ```
   https://github.com/honghyunwoo/language-learning-platform
   ```
5. `Import` 클릭

### 2️⃣ Firebase 설정

#### Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. `프로젝트 추가` 클릭
3. 프로젝트 이름 입력 (예: `language-learning`)
4. Google Analytics 설정 (선택사항)
5. `프로젝트 만들기` 클릭

#### 웹 앱 추가

1. Firebase 프로젝트 메인 화면
2. `</> Web` 아이콘 클릭
3. 앱 이름 입력 (예: `Language Learning Platform`)
4. Firebase SDK 코드 복사 (잠시 후 사용)

#### Authentication 설정

1. 좌측 메뉴 `Authentication` → `시작하기`
2. `Sign-in method` 탭
3. 이메일/비밀번호 활성화
4. Google 로그인 활성화 (선택사항)

#### Firestore Database 생성

1. 좌측 메뉴 `Firestore Database` → `데이터베이스 만들기`
2. `테스트 모드로 시작` 선택
3. 위치 선택: `asia-northeast3 (Seoul)`
4. `사용 설정` 클릭

#### Storage 설정

1. 좌측 메뉴 `Storage` → `시작하기`
2. `테스트 모드로 시작` 선택
3. `완료` 클릭

### 3️⃣ Replit Secrets 설정

Replit에서 `Tools` → `Secrets` 클릭하고 다음 값 추가:

**Firebase 설정값** (2단계에서 복사한 SDK 코드 참고):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
```

**추가 설정**:

```bash
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max_old_space_size=2048
```

### 4️⃣ Firebase 규칙 배포

Replit Shell에서 실행:

```bash
# Firebase CLI 로그인
npx firebase-tools login --no-localhost

# 프로젝트 초기화 (이미 설정되어 있음)
# npx firebase-tools init

# Firestore 규칙 배포
npx firebase-tools deploy --only firestore:rules

# Storage 규칙 배포
npx firebase-tools deploy --only storage
```

> **참고**: `--no-localhost` 플래그는 Replit 환경에서 필수입니다.

### 5️⃣ 앱 실행

Replit의 `Run` 버튼 클릭하거나:

```bash
npm run dev
```

앱이 실행되면 Replit 미리보기에 표시됩니다!

### 6️⃣ 프로덕션 배포

#### Replit Deployment

1. Replit에서 `Deploy` 버튼 클릭
2. `Autoscale` 선택
3. 설정:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. `Deploy` 클릭

배포 완료 후 공개 URL 받기:
```
https://your-project.your-username.repl.co
```

#### Firebase 도메인 허용

1. Firebase Console → Authentication → Settings
2. Authorized domains에 추가:
   ```
   *.repl.co
   your-project.your-username.repl.co
   ```

### 7️⃣ 초기 데이터 확인

앱 접속 후:
1. 회원가입 (이메일/비밀번호)
2. 레벨 테스트 진행
3. 커리큘럼 확인
4. Activity 시작!

## ✅ 체크리스트

- [ ] Replit에 프로젝트 가져오기 완료
- [ ] Firebase 프로젝트 생성
- [ ] Authentication 활성화
- [ ] Firestore Database 생성
- [ ] Storage 설정
- [ ] Replit Secrets 환경 변수 입력
- [ ] Firebase 규칙 배포
- [ ] 개발 서버 실행 성공
- [ ] 회원가입 테스트
- [ ] Replit Deployment 완료
- [ ] 공개 URL 동작 확인

## 🐛 문제 해결

### Firebase 연결 안됨
- Secrets의 환경 변수 확인
- Firebase 프로젝트 ID 일치 여부 확인

### 빌드 실패
```bash
rm -rf .next node_modules
npm install
npm run build
```

### 포트 에러
```bash
pkill -f next
npm run dev
```

### 메모리 부족
Secrets에 추가:
```
NODE_OPTIONS=--max_old_space_size=2048
```

## 📚 추가 문서

- [상세 배포 가이드](./REPLIT_DEPLOYMENT.md)
- [Firebase 설정 가이드](./docs/FIREBASE_SETUP.md)
- [프로젝트 README](./README.md)

## 💡 팁

1. **자동 저장**: Replit은 자동으로 저장되므로 `Ctrl+S` 불필요
2. **빠른 재시작**: Shell에서 `npm run dev` 재실행
3. **로그 확인**: Shell에서 실시간 로그 확인 가능
4. **모바일 테스트**: 배포 URL을 모바일에서 바로 테스트

## 🎉 완료!

이제 언어 학습 플랫폼이 배포되었습니다!

**배포 URL**: `https://your-project.your-username.repl.co`

---

문제가 있으면 [GitHub Issues](https://github.com/honghyunwoo/language-learning-platform/issues)에 남겨주세요.
