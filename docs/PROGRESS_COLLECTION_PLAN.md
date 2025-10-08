# 진행률 컬렉션 통합 계획

## 현재 상태

### 사용 중인 컬렉션

1. **`weekProgress`** (useCurriculum.ts:53)
   - Document ID: `{userId}_{weekId}`
   - 용도: 주차별 완료 상태 및 시간 추적
   - 필드: userId, weekId, status, completedActivities[], timeSpent

2. **`activity_progress`** (lib/firebase/progress.ts:30)
   - Document ID: `{userId}_{activityId}`
   - 용도: 개별 활동 상세 진행률 (점수, weak points 등)
   - 필드: userId, activityId, score, weakPoints[], attempts

3. **`userProgress`** (hooks/useUserProgress.ts:26)
   - Document ID: `{userId}_current`
   - 용도: 사용자 전체 진행 현황
   - 필드: currentWeek, learningTimeLog[], totalActivities

## 문제점

- 데이터가 3개 컬렉션에 분산되어 있어 동기화 어려움
- 쿼리 복잡도 증가 (여러 컬렉션 조회 필요)
- Security Rules도 3곳에 중복 관리 필요

## 제안된 통합 구조

### Option A: 계층적 구조 유지 (권장)

각 컬렉션은 서로 다른 목적으로 사용되므로, **현재 구조 유지하고 일관성만 개선**

**변경사항:**
- `userProgress/{userId}_current` → `userProgress/{userId}`
- 각 컬렉션의 역할 명확화 문서화
- Firestore Rules 강화 ✅ (완료)

**장점:**
- 최소한의 코드 변경
- 기존 데이터 마이그레이션 불필요
- 각 컬렉션의 용도가 명확함

### Option B: 단일 컬렉션 통합

모든 진행률 데이터를 `progress` 컬렉션으로 통합

**구조:**
```typescript
/progress/{userId} - 사용자 전체 진행률
/progress/{userId}/weeks/{weekId} - 주차별 진행률 (subcollection)
/progress/{userId}/activities/{activityId} - 활동별 진행률 (subcollection)
```

**단점:**
- 대규모 코드 리팩토링 필요
- 기존 데이터 마이그레이션 스크립트 작성 필요
- 쿼리 패턴 변경

## 권장 조치: Option A

**즉시 조치 (완료):**
- ✅ Firestore Rules에 `weekProgress`, `activity_progress` 규칙 추가

**점진적 개선:**
1. Document ID 일관성 개선
   - `userProgress/{userId}_current` → `userProgress/{userId}`
2. 각 컬렉션의 역할 문서화
3. 데이터 동기화 로직 추가 (활동 완료 시 weekProgress도 업데이트)

## 다음 단계

Phase 2에서 Mock 데이터 제거 작업 시, 진행률 동기화 로직도 함께 개선 예정.
