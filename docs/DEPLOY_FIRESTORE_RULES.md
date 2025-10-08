# Firestore Security Rules 배포 가이드

## 🚨 중요: 즉시 배포 필요!

Phase 1에서 수정한 Firestore Security Rules를 배포하지 않으면, 다음 기능들이 작동하지 않습니다:

- ❌ Journal (학습 일지) 저장/조회 실패
- ❌ Community 댓글 작성 불가
- ❌ Community 좋아요 기능 불가
- ❌ Study Groups 생성/가입 불가
- ❌ 학습 진행률 저장 실패

---

## 방법 1: Firebase Console (추천)

### 단계:

1. **Firebase Console 접속**
   - https://console.firebase.google.com 접속
   - 프로젝트 선택

2. **Firestore Database 메뉴**
   - 왼쪽 메뉴에서 `Firestore Database` 클릭
   - 상단 탭에서 `규칙` 클릭

3. **규칙 복사/붙여넣기**
   - 프로젝트의 `firestore.rules` 파일 전체 내용 복사
   - Firebase Console 편집기에 붙여넣기

4. **게시**
   - `게시` 버튼 클릭
   - 배포 완료까지 약 1분 소요

---

## 방법 2: Firebase CLI

### 전제조건:

```bash
# Firebase CLI 설치 확인
firebase --version

# 미설치 시
npm install -g firebase-tools

# Firebase 로그인
firebase login
```

### 배포 명령:

```bash
# 프로젝트 루트에서 실행
cd "c:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform"

# Firestore Rules 배포
firebase deploy --only firestore:rules

# Firestore Indexes 함께 배포 (권장)
firebase deploy --only firestore
```

---

## 배포 확인

### 1. Firebase Console에서 확인

- Firestore Database → 규칙 탭
- 마지막 배포 시간 확인
- 새로 추가된 규칙 존재 확인:
  - `/replies/{replyId}`
  - `/likes/{likeId}`
  - `/studyGroups/{groupId}`
  - `/weekProgress/{progressId}`
  - `/activity_progress/{progressId}`

### 2. 애플리케이션에서 테스트

**Journal 테스트:**
```
1. 로그인
2. Journal 페이지 이동
3. 새 일지 작성
4. 콘솔 에러 없이 저장되는지 확인
```

**Community 테스트:**
```
1. 로그인
2. Community 페이지 이동
3. 게시글에 댓글 작성 시도
4. 좋아요 버튼 클릭
5. 정상 동작 확인
```

---

## 배포 후 예상 로그

### 성공 시:

```
✅ Deploy complete!

Project Console: https://console.firebase.google.com/...
```

### 실패 시:

```
❌ Error: Unexpected token...
```

→ `firestore.rules` 파일 문법 오류. 수정 후 재배포.

---

## 문제 해결

### "Permission denied" 에러

**원인**: 기존 데이터가 `journalEntries` 컬렉션에 있는 경우

**해결**:
1. Firebase Console → Firestore Database
2. `journalEntries` 컬렉션 찾기
3. 모든 문서 선택 → Export
4. `journals` 컬렉션에 Import

또는 수동으로:
```javascript
// Firebase Console → 데이터 탭 → Cloud Shell
const admin = require('firebase-admin');
const db = admin.firestore();

async function migrate() {
  const oldDocs = await db.collection('journalEntries').get();
  const batch = db.batch();

  oldDocs.forEach(doc => {
    const newRef = db.collection('journals').doc(doc.id);
    batch.set(newRef, doc.data());
  });

  await batch.commit();
  console.log('Migration complete!');
}

migrate();
```

---

## 다음 단계

✅ Firestore Rules 배포 완료 후:

1. 개발 서버 재시작
2. 브라우저 캐시 삭제
3. 로그아웃/로그인
4. Journal, Community 기능 전체 테스트
5. 정상 작동 확인 후 Phase 2 진행

---

## 긴급 문의

배포 중 문제 발생 시:
- Firebase Console에서 이전 버전으로 롤백 가능
- `규칙` 탭 → `기록` → 이전 버전 선택 → `복원`
