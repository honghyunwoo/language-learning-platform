# Firebase 배포 가이드

## 사전 준비

Firebase 설정 파일들이 생성되었습니다:
- ✅ `firebase.json` - Firebase 프로젝트 설정
- ✅ `firestore.rules` - Firestore 보안 규칙
- ✅ `firestore.indexes.json` - Firestore 인덱스 설정
- ✅ `.firebaserc` - Firebase 프로젝트 ID

## 1. Firebase 로그인

```bash
firebase login
```

브라우저가 열리며 Google 계정으로 로그인합니다.

## 2. Firestore 보안 규칙 배포

```bash
cd "c:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform"
firebase deploy --only firestore:rules
```

### 보안 규칙 내용

현재 `firestore.rules`에는 다음 보안 규칙이 설정되어 있습니다:

- **사용자 데이터**: 본인만 읽기/쓰기
- **진행률 데이터**: 본인만 접근
- **학습 일지**: 본인만 접근
- **커뮤니티 게시글**:
  - 읽기: 모두
  - 쓰기: 인증된 사용자
  - 수정/삭제: 작성자만
- **댓글**: 게시글과 동일
- **알림**: 본인만 읽기/수정

## 3. Firestore 인덱스 배포

```bash
firebase deploy --only firestore:indexes
```

### 생성되는 인덱스

1. **posts** - type + createdAt (게시글 타입별 정렬)
2. **posts** - category + createdAt (카테고리별 정렬)
3. **replies** - postId + createdAt (게시글별 댓글 정렬)
4. **journals** - userId + date (사용자별 일지 정렬)
5. **notifications** - userId + createdAt (사용자별 알림 정렬)

## 4. 전체 배포

```bash
firebase deploy
```

모든 설정(규칙, 인덱스)을 한 번에 배포합니다.

## 5. Firebase Hosting 배포 (선택사항)

Firebase Hosting을 사용하려면:

### 5.1. Static Export 설정

`next.config.ts`에 추가:

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### 5.2. 빌드 및 배포

```bash
npm run build
firebase deploy --only hosting
```

⚠️ **주의**: Static Export는 일부 Next.js 기능을 제한합니다.
- Server-side rendering 불가
- API routes 사용 불가
- 프로덕션에는 Vercel 권장

## 6. Firebase Emulator 사용 (로컬 개발)

로컬에서 Firebase 서비스를 에뮬레이트:

```bash
firebase emulators:start
```

에뮬레이터 UI: http://localhost:4000

### 에뮬레이터 포트
- Authentication: 9099
- Firestore: 8080
- Emulator UI: 4000

## 배포 확인

### Firestore 규칙 확인

Firebase Console > Firestore Database > 규칙 탭

### 인덱스 확인

Firebase Console > Firestore Database > 인덱스 탭

### 배포 로그

```bash
firebase deploy --only firestore:rules --debug
```

## 문제 해결

### 권한 오류

```
Error: HTTP Error: 403, The caller does not have permission
```

**해결**:
```bash
firebase login --reauth
```

### 프로젝트 ID 불일치

```
Error: Invalid project id
```

**해결**: `.firebaserc` 파일의 프로젝트 ID 확인

### 규칙 문법 오류

```
Error: Syntax error in security rules
```

**해결**: `firestore.rules` 파일의 문법 검사
```bash
firebase deploy --only firestore:rules --dry-run
```

## 다음 단계

1. ✅ Firebase 로그인
2. ✅ Firestore 보안 규칙 배포
3. ✅ Firestore 인덱스 배포
4. ⏭️ Vercel에 애플리케이션 배포 ([DEPLOYMENT.md](./DEPLOYMENT.md) 참조)

## 유용한 명령어

```bash
# 현재 로그인 계정 확인
firebase login:list

# 프로젝트 목록 보기
firebase projects:list

# 현재 프로젝트 확인
firebase use

# 로그아웃
firebase logout

# 배포 취소
firebase deploy --only firestore:rules --force

# 에뮬레이터 데이터 내보내기
firebase emulators:export ./emulator-data

# 에뮬레이터 데이터 가져오기
firebase emulators:start --import=./emulator-data
```

## 참고 자료

- [Firebase CLI 문서](https://firebase.google.com/docs/cli)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore 인덱스](https://firebase.google.com/docs/firestore/query-data/indexing)
