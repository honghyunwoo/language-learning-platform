# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력: `language-learning-platform` (또는 원하는 이름)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. 웹 앱 추가

1. Firebase 프로젝트 대시보드에서 웹 아이콘(</>)을 클릭
2. 앱 닉네임 입력: `Language Learning Blog`
3. Firebase Hosting 설정 체크박스는 선택하지 않음 (Vercel 사용 예정)
4. "앱 등록" 클릭
5. Firebase SDK 설정 정보가 표시됨 (나중에 사용)

## 3. Authentication 설정

### 이메일/비밀번호 인증 활성화

1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭 선택
4. "이메일/비밀번호" 클릭
5. "사용 설정" 토글 활성화
6. "저장" 클릭

### Google 인증 활성화

1. "Sign-in method" 탭에서 "Google" 클릭
2. "사용 설정" 토글 활성화
3. 프로젝트 지원 이메일 선택
4. "저장" 클릭

## 4. Firestore Database 설정

### 데이터베이스 생성

1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 위치 선택: `asia-northeast3` (서울) 권장
4. "테스트 모드에서 시작" 선택 (나중에 보안 규칙 적용)
5. "사용 설정" 클릭

### 보안 규칙 적용

1. "규칙" 탭 선택
2. 프로젝트 루트의 `firestore.rules` 파일 내용 복사
3. Firebase Console의 규칙 편집기에 붙여넣기
4. "게시" 클릭

### 인덱스 설정

다음 복합 인덱스가 필요합니다:

**posts 컬렉션:**
- `isPublished` (오름차순) + `createdAt` (내림차순)
- `category` (오름차순) + `createdAt` (내림차순)
- `authorId` (오름차순) + `createdAt` (내림차순)

**인덱스 생성 방법:**
1. "인덱스" 탭 선택
2. "복합 인덱스 추가" 클릭
3. 컬렉션 ID와 필드 설정
4. "만들기" 클릭

또는 첫 쿼리 실행 시 Firebase가 자동으로 필요한 인덱스 링크를 제공합니다.

## 5. Storage 설정

### Storage 버킷 생성

1. 왼쪽 메뉴에서 "Storage" 클릭
2. "시작하기" 클릭
3. 보안 규칙: "테스트 모드에서 시작" 선택
4. 위치: Firestore와 동일한 위치 선택 (`asia-northeast3`)
5. "완료" 클릭

### 보안 규칙 적용

1. "Rules" 탭 선택
2. 프로젝트 루트의 `storage.rules` 파일 내용 복사
3. Firebase Console의 규칙 편집기에 붙여넣기
4. "게시" 클릭

## 6. 환경변수 설정

### Firebase 설정 정보 확인

1. 프로젝트 설정(톱니바퀴 아이콘) → "프로젝트 설정" 클릭
2. "일반" 탭 스크롤 다운
3. "내 앱" 섹션에서 웹 앱 선택
4. "SDK 설정 및 구성" 아래 "구성" 선택
5. Firebase SDK snippet의 `firebaseConfig` 객체 확인

### .env.local 파일 생성

1. 프로젝트 루트에 `.env.local` 파일 생성
2. `.env.local.example` 파일 내용 복사
3. Firebase Console에서 확인한 값으로 변경:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=실제_API_키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=실제_sender_ID
NEXT_PUBLIC_FIREBASE_APP_ID=실제_app_ID
```

4. `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다

## 7. Firebase CLI 설정 (선택사항)

로컬에서 보안 규칙을 배포하려면 Firebase CLI가 필요합니다:

```bash
# Firebase CLI 전역 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init

# 선택사항:
# - Firestore: firestore.rules 파일 연결
# - Storage: storage.rules 파일 연결
# - Functions: 서버리스 함수 사용 시

# 규칙 배포
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 8. 테스트

### 연결 테스트

개발 서버를 실행하고 브라우저 콘솔에서 확인:

```bash
npm run dev
```

브라우저 개발자 도구 콘솔에서:

```javascript
// Firebase 연결 확인
import { auth, db, storage } from '@/lib/firebase';
console.log('Auth:', auth);
console.log('Firestore:', db);
console.log('Storage:', storage);
```

에러가 없으면 Firebase 설정이 정상적으로 완료된 것입니다.

## 9. 프로덕션 배포 시 주의사항

### Vercel 환경변수 설정

1. Vercel 프로젝트 대시보드 접속
2. Settings → Environment Variables
3. `.env.local`의 모든 변수를 추가
4. Production, Preview, Development 환경 모두 선택
5. "Save" 클릭

### Firebase 할당량 모니터링

1. Firebase Console → 사용량 탭
2. Firestore 읽기/쓰기 작업 확인
3. Storage 저장공간 및 다운로드 확인
4. Authentication 사용자 수 확인

무료 플랜(Spark) 할당량:
- Firestore: 50,000 읽기/20,000 쓰기/일
- Storage: 1GB 저장공간, 10GB 다운로드/월
- Authentication: 무제한

필요시 Blaze 플랜(종량제)으로 업그레이드

## 10. 보안 체크리스트

- [x] Firestore 보안 규칙 적용
- [x] Storage 보안 규칙 적용
- [x] API 키는 환경변수로 관리
- [x] `.env.local` 파일은 `.gitignore`에 포함
- [ ] Production 환경에서 보안 규칙 테스트
- [ ] 민감한 사용자 데이터는 서버 측에서만 접근
- [ ] Rate limiting 설정 (App Check 사용 권장)

## 문제 해결

### "Permission denied" 에러

- Firestore/Storage 보안 규칙을 확인하세요
- Firebase Console에서 규칙이 올바르게 배포되었는지 확인
- 사용자가 올바르게 인증되었는지 확인

### 환경변수가 undefined

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 변수명이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인 (클라이언트 사용 시)
- 개발 서버를 재시작하세요 (`npm run dev` 다시 실행)

### Firebase 초기화 에러

- `firebaseConfig` 객체의 모든 값이 올바른지 확인
- Firebase Console에서 웹 앱이 정상적으로 등록되었는지 확인
- 브라우저 콘솔에서 에러 메시지를 자세히 확인
