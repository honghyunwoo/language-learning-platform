# Firebase 프로젝트 설정 가이드

## 1단계: Firebase 프로젝트 생성

### 1. Firebase Console 접속
1. 브라우저에서 https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인

### 2. 새 프로젝트 생성
1. "프로젝트 추가" 또는 "Add project" 클릭
2. 프로젝트 이름 입력 (예: `language-learning-platform`)
3. Google Analytics 사용 여부 선택 (선택사항 - 나중에도 추가 가능)
4. "프로젝트 만들기" 클릭
5. 프로젝트 생성 완료 대기 (약 30초)

## 2단계: 웹 앱 추가

### 1. 웹 앱 등록
1. Firebase Console 메인 페이지에서 "웹" 아이콘(</>) 클릭
2. 앱 닉네임 입력 (예: `web-app`)
3. Firebase Hosting 설정은 체크 안 해도 됨 (나중에 설정 가능)
4. "앱 등록" 클릭

### 2. Firebase SDK 구성 정보 복사
화면에 다음과 같은 코드가 나타납니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**⚠️ 이 값들을 복사해두세요! 나중에 .env.local 파일에 입력해야 합니다.**

## 3단계: Authentication 설정

### 1. 이메일/비밀번호 인증 활성화
1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 또는 "Get started" 클릭
3. "Sign-in method" 탭 클릭
4. "이메일/비밀번호" 또는 "Email/Password" 클릭
5. "사용 설정" 토글 켜기
6. "저장" 클릭

### 2. Google 로그인 활성화
1. 같은 "Sign-in method" 탭에서
2. "Google" 클릭
3. "사용 설정" 토글 켜기
4. 프로젝트 공개용 이름 입력 (예: `언어 학습 플랫폼`)
5. 프로젝트 지원 이메일 선택
6. "저장" 클릭

## 4단계: Firestore Database 생성

### 1. Firestore 데이터베이스 만들기
1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. **보안 규칙 선택**:
   - 개발 중이므로 **"테스트 모드에서 시작"** 선택
   - ⚠️ 주의: 나중에 보안 규칙을 반드시 설정해야 합니다!
4. 위치 선택:
   - `asia-northeast3 (Seoul)` 추천 (한국 서버)
5. "사용 설정" 클릭

### 2. 컬렉션 구조 (자동 생성됨 - 참고용)
앱 사용 시 자동으로 다음 컬렉션들이 생성됩니다:
- `users` - 사용자 프로필
- `userProgress` - 사용자 진도
- `weekProgress` - 주차별 진도
- `journalEntries` - 학습 일지
- `activitySessions` - 활동 세션

## 5단계: Storage 설정

### 1. Firebase Storage 활성화
1. 왼쪽 메뉴에서 "Storage" 클릭
2. "시작하기" 클릭
3. **보안 규칙 선택**:
   - 개발 중이므로 **"테스트 모드에서 시작"** 선택
   - ⚠️ 주의: 나중에 보안 규칙을 반드시 설정해야 합니다!
4. 위치는 Firestore와 동일하게 선택 (`asia-northeast3`)
5. "완료" 클릭

## 6단계: 환경 변수 설정

### 1. .env.local 파일 수정
프로젝트 루트의 `.env.local` 파일을 열고, 2단계에서 복사한 값들로 업데이트하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=여기에_apiKey_붙여넣기
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=여기에_authDomain_붙여넣기
NEXT_PUBLIC_FIREBASE_PROJECT_ID=여기에_projectId_붙여넣기
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=여기에_storageBucket_붙여넣기
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_붙여넣기
NEXT_PUBLIC_FIREBASE_APP_ID=여기에_appId_붙여넣기
```

### 2. 개발 서버 재시작
환경 변수 변경 후 반드시 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl + C)
# 개발 서버 재시작
npm run dev
```

## 7단계: 테스트

### 1. 회원가입 테스트
1. http://localhost:3000/signup 접속
2. 이메일, 비밀번호, 이름 입력
3. "회원가입" 클릭
4. Firebase Console > Authentication > Users에서 사용자 생성 확인

### 2. 로그인 테스트
1. http://localhost:3000/login 접속
2. 방금 생성한 이메일, 비밀번호 입력
3. "로그인" 클릭
4. 대시보드로 리디렉션 확인

### 3. Google 로그인 테스트
1. 로그인 페이지에서 "Google로 로그인" 클릭
2. Google 계정 선택
3. 권한 승인
4. 대시보드로 리디렉션 확인

## 8단계: 보안 규칙 설정 (중요!)

테스트 모드는 30일 후 자동으로 비활성화됩니다. 프로덕션 배포 전에 반드시 보안 규칙을 설정하세요.

### Firestore 보안 규칙
1. Firebase Console > Firestore Database > 규칙 탭
2. 다음 규칙으로 업데이트:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서: 본인만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 사용자 진도: 본인만 읽기/쓰기 가능
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }

    // 주차 진도: 본인만 읽기/쓰기 가능
    match /weekProgress/{weekId} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }

    // 학습 일지: 본인만 읽기/쓰기 가능
    match /journalEntries/{entryId} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }

    // 활동 세션: 본인만 읽기/쓰기 가능
    match /activitySessions/{sessionId} {
      allow read, write: if request.auth != null &&
                          resource.data.userId == request.auth.uid;
    }
  }
}
```

3. "게시" 클릭

### Storage 보안 규칙
1. Firebase Console > Storage > 규칙 탭
2. 다음 규칙으로 업데이트:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 프로필 이미지: 본인만 읽기/쓰기 가능
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true; // 모든 사용자가 프로필 이미지 볼 수 있음
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // 5MB 제한
                   && request.resource.contentType.matches('image/.*'); // 이미지만
    }
  }
}
```

3. "게시" 클릭

## 문제 해결

### Q1: "Firebase: Error (auth/invalid-api-key)" 에러가 나요
- `.env.local` 파일의 API Key가 정확한지 확인
- 개발 서버를 재시작했는지 확인
- Firebase Console에서 API Key를 다시 복사해서 붙여넣기

### Q2: Google 로그인이 안 돼요
- Firebase Console > Authentication > Sign-in method에서 Google이 활성화되어 있는지 확인
- 프로젝트 지원 이메일이 설정되어 있는지 확인

### Q3: Firestore에 데이터가 안 써져요
- Firebase Console > Firestore Database가 생성되어 있는지 확인
- 보안 규칙이 너무 엄격하지 않은지 확인 (개발 중에는 테스트 모드 사용)

### Q4: Storage에 이미지 업로드가 안 돼요
- Firebase Console > Storage가 활성화되어 있는지 확인
- 보안 규칙이 너무 엄격하지 않은지 확인

## 다음 단계

Firebase 설정이 완료되면:
1. ✅ 회원가입/로그인 테스트
2. ✅ 프로필 생성/수정 테스트
3. ✅ 학습 일지 작성 테스트
4. ✅ 대시보드 데이터 로딩 테스트

모든 기능이 정상 작동하는지 확인 후, 보안 규칙을 프로덕션 수준으로 강화하세요.
