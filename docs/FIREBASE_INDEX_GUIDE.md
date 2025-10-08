# Firebase Index 에러 해결 가이드

## 📋 문제 상황

Firebase 콘솔에서 다음과 같은 에러가 발생할 때:

```
FirebaseError: The query requires an index.
```

이는 Firestore에서 복합 쿼리를 실행할 때 필요한 인덱스가 없기 때문입니다.

---

## 🔧 해결 방법

### 방법 1: Firebase 콘솔에서 직접 생성 (가장 쉬움)

1. **에러 메시지 확인**
   - 브라우저 콘솔(F12)에서 Firebase 에러 메시지를 찾습니다
   - 에러 메시지에 **파란색 링크**가 포함되어 있습니다

2. **링크 클릭**
   - 해당 링크를 클릭하면 Firebase 콘솔로 이동합니다
   - 자동으로 필요한 인덱스 설정 페이지가 열립니다

3. **인덱스 생성**
   - "Create Index" 또는 "인덱스 만들기" 버튼을 클릭
   - 보통 2-5분 정도 소요됩니다
   - 완료되면 "Enabled" 상태로 변경됩니다

4. **페이지 새로고침**
   - 인덱스 생성이 완료되면 앱 페이지를 새로고침합니다
   - 에러가 사라져야 합니다

---

### 방법 2: firestore.indexes.json 파일 사용

프로젝트에 이미 `firestore.indexes.json` 파일이 있습니다:

```bash
firebase deploy --only firestore:indexes
```

현재 필요한 인덱스가 이미 정의되어 있는지 확인:

```json
{
  "indexes": [
    {
      "collectionGroup": "progress",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "weekId", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "posts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 🔍 자주 발생하는 인덱스 에러

### 1. Progress 컬렉션 (학습 진행률)
**쿼리**: `userId`와 `weekId`로 필터링
```typescript
where('userId', '==', userId).where('weekId', '==', weekId)
```

**필요한 인덱스**:
- `userId` (Ascending)
- `weekId` (Ascending)

### 2. Posts 컬렉션 (커뮤니티 게시글)
**쿼리**: `category`로 필터링하고 `createdAt`로 정렬
```typescript
where('category', '==', category).orderBy('createdAt', 'desc')
```

**필요한 인덱스**:
- `category` (Ascending)
- `createdAt` (Descending)

### 3. Journal 컬렉션 (학습 일지)
**쿼리**: `userId`로 필터링하고 `date`로 정렬
```typescript
where('userId', '==', userId).orderBy('date', 'desc')
```

**필요한 인덱스**:
- `userId` (Ascending)
- `date` (Descending)

---

## 📝 인덱스 생성 체크리스트

### 단계 1: 에러 확인
- [ ] 브라우저 콘솔(F12) 열기
- [ ] Firebase 에러 메시지 찾기
- [ ] 에러 메시지의 파란색 링크 확인

### 단계 2: 인덱스 생성
- [ ] 링크 클릭하여 Firebase 콘솔 이동
- [ ] "Create Index" 버튼 클릭
- [ ] 2-5분 대기 (상태: Building → Enabled)

### 단계 3: 확인
- [ ] 인덱스 상태가 "Enabled"인지 확인
- [ ] 앱 페이지 새로고침
- [ ] 에러가 사라졌는지 확인

---

## ⚠️ 주의사항

1. **인덱스 생성 시간**
   - 보통 2-5분 소요
   - 데이터가 많으면 더 오래 걸릴 수 있음

2. **인덱스 제한**
   - Firebase 무료 플랜: 200개까지
   - 복합 인덱스는 신중하게 생성

3. **자동 인덱스 vs 복합 인덱스**
   - 단일 필드 쿼리: 자동 인덱스 사용
   - 여러 필드 쿼리: 복합 인덱스 필요

---

## 🚀 빠른 해결 (권장)

**가장 빠른 방법**:
1. 앱에서 에러 발생 → 콘솔에서 파란색 링크 클릭
2. Firebase 콘솔에서 "Create Index" 클릭
3. 5분 대기
4. 페이지 새로고침

이 방법이 가장 간단하고 확실합니다! 🎯
