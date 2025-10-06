# 🚀 다음 단계 우선순위 작업 목록

**작성일**: 2025-10-05
**현재 Phase 1 진행률**: 80%
**다음 목표**: Phase 1 완성 → 95%+

---

## 🔥 CRITICAL: 즉시 필요한 작업 (Phase 1 핵심 완성)

### 1. Firestore 진행률 추적 시스템 구축 ⏱️ 4-6시간
**중요도**: 🔴 CRITICAL
**이유**: Dashboard 진행률 표시 및 사용자 학습 추적 필수

#### 작업 세부 사항:
```typescript
// 1. Firestore Collections 설계
interfaces/progress.ts 생성:
- VocabularyProgress
- ReadingProgress
- GrammarProgress
- ListeningProgress
- WritingProgress
- SpeakingProgress

// 2. Hooks 생성
hooks/useVocabularyProgress.ts
hooks/useReadingProgress.ts
hooks/useGrammarProgress.ts
hooks/useListeningProgress.ts
hooks/useWritingProgress.ts
hooks/useSpeakingProgress.ts
hooks/useOverallProgress.ts (통합)

// 3. Activity 컴포넌트 연동
각 Activity에 진행률 저장 로직 추가
- 완료 버튼 클릭 시 Firestore 업데이트
- 퀴즈 점수 저장
- 소요 시간 기록

// 4. Dashboard 업데이트
Dashboard Week 카드에 진행률 % 표시
완료된 Activity 체크 표시
```

#### 체크리스트:
- [ ] `types/progress.ts` 인터페이스 정의
- [ ] `lib/firebase/progress.ts` CRUD 함수
- [ ] `hooks/useVocabularyProgress.ts` 생성
- [ ] `hooks/useReadingProgress.ts` 생성
- [ ] `hooks/useGrammarProgress.ts` 생성
- [ ] `hooks/useListeningProgress.ts` 생성
- [ ] `hooks/useWritingProgress.ts` 생성
- [ ] `hooks/useSpeakingProgress.ts` 생성
- [ ] `hooks/useOverallProgress.ts` 통합 hook
- [ ] VocabularyActivity 진행률 저장 연동
- [ ] ReadingActivity 진행률 저장 연동
- [ ] GrammarActivity 진행률 저장 연동
- [ ] ListeningActivity 진행률 저장 연동
- [ ] WritingActivity 진행률 저장 연동
- [ ] SpeakingActivity 진행률 저장 연동
- [ ] Dashboard Week 카드 진행률 표시
- [ ] Firestore Security Rules 업데이트

---

### 2. 에러 처리 및 로딩 상태 강화 ⏱️ 2-3시간
**중요도**: 🔴 HIGH
**이유**: 사용자 경험 개선, 프로덕션 안정성

#### 작업 세부 사항:
```typescript
// 1. ErrorBoundary 컴포넌트
components/ErrorBoundary.tsx 생성
- React Error Boundary
- 에러 UI 디자인
- 재시도 버튼
- 에러 로깅 (console)

// 2. SkeletonLoader
components/ui/SkeletonLoader.tsx
- ActivityCardSkeleton
- ListSkeleton
- DetailSkeleton

// 3. Toast 알림 시스템
react-hot-toast 설치
- 성공 알림
- 에러 알림
- 정보 알림

// 4. 브라우저 호환성 체크
- Web Speech API 미지원 대응
- MediaRecorder API 미지원 대응
```

#### 체크리스트:
- [ ] `npm install react-hot-toast` 설치
- [ ] `components/ErrorBoundary.tsx` 생성
- [ ] `app/layout.tsx`에 ErrorBoundary 적용
- [ ] `components/ui/SkeletonLoader.tsx` 생성
- [ ] ActivityContent에 Skeleton 적용
- [ ] `lib/utils/browserCheck.ts` 생성
- [ ] useTTS에 브라우저 체크 추가
- [ ] SpeakingActivity 녹음 권한 처리
- [ ] Toast 알림 통합 (성공/에러/정보)

---

## 🟡 HIGH: 중요하지만 긴급하지 않음

### 3. Writing Activity 자동 저장 기능 ⏱️ 1-2시간
**중요도**: 🟡 HIGH
**이유**: 사용자 데이터 손실 방지

#### 작업 세부 사항:
```typescript
// WritingActivity.tsx 업데이트
- useEffect로 3초마다 localStorage 저장
- 컴포넌트 마운트 시 복구 체크
- 제출 시 draft 삭제
```

#### 체크리스트:
- [ ] localStorage 저장 로직 추가
- [ ] 복구 프롬프트 UI 생성
- [ ] 제출 시 draft 삭제
- [ ] 테스트: 새로고침 후 복구

---

### 4. Week 2-3 데이터 준비 (A1 레벨) ⏱️ 3-4시간
**중요도**: 🟡 HIGH
**이유**: 사용자가 Week 1 완료 후 계속 학습 가능

#### 작업 세부 사항:
```json
// Week 2 주제
vocabulary: "일상 루틴 관련 단어 20개"
reading: "나의 하루 일과 (150-200 단어)"
grammar: "Present Simple (일반 동사)"
listening: "간단한 안내 방송 (40초)"
writing: "나의 하루 일과 작성"
speaking: "일상 인사 대화 연습"

// Week 3 주제 (A2 시작)
vocabulary: "취미 관련 단어 20개"
reading: "좋아하는 취미 소개 (200-250 단어)"
grammar: "Past Simple"
listening: "친구 간 대화 (1분)"
writing: "좋아하는 취미 소개"
speaking: "취미에 대해 말하기"
```

#### 체크리스트:
- [ ] Week 2 Vocabulary JSON 작성
- [ ] Week 2 Reading JSON 작성
- [ ] Week 2 Grammar JSON 작성
- [ ] Week 2 Listening JSON 작성
- [ ] Week 2 Writing JSON 작성
- [ ] Week 2 Speaking JSON 작성
- [ ] Week 3 Vocabulary JSON 작성
- [ ] Week 3 Reading JSON 작성
- [ ] Week 3 Grammar JSON 작성
- [ ] Week 3 Listening JSON 작성
- [ ] Week 3 Writing JSON 작성
- [ ] Week 3 Speaking JSON 작성
- [ ] 모든 JSON 검증 통과

---

## 🟢 MEDIUM: 개선 사항

### 5. Activity 페이지 네비게이션 개선 ⏱️ 1-2시간
**중요도**: 🟢 MEDIUM
**이유**: 사용자 편의성 향상

#### 작업 세부 사항:
```tsx
// Activity 페이지에 추가
- "이전 Activity" 버튼
- "다음 Activity" 버튼
- "Week로 돌아가기" 버튼
- "완료" 버튼 (진행률 저장)
```

#### 체크리스트:
- [ ] NavigationButtons 컴포넌트 생성
- [ ] Activity 순서 로직 구현
- [ ] 완료 버튼 기능 구현
- [ ] 진행률 저장 연동

---

### 6. Dashboard 개선 ⏱️ 1-2시간
**중요도**: 🟢 MEDIUM
**이유**: 진행률 시각화

#### 작업 세부 사항:
```tsx
// Dashboard 업데이트
- 전체 진행률 Progress Bar
- Week별 완료율 표시
- 완료된 Activity 체크 아이콘
- 다음 추천 Activity 하이라이트
```

#### 체크리스트:
- [ ] 전체 진행률 계산 로직
- [ ] Progress Bar UI 추가
- [ ] Week 카드 진행률 % 표시
- [ ] 완료 Activity 체크 표시
- [ ] 추천 Activity 하이라이트

---

### 7. 이미지 최적화 ⏱️ 30분
**중요도**: 🟢 LOW
**이유**: 성능 개선, ESLint 경고 제거

#### 작업 세부 사항:
```tsx
// <img> → next/Image 전환
components/layout/Header.tsx:71
components/layout/Sidebar.tsx:181
```

#### 체크리스트:
- [ ] Header.tsx `<img>` → `<Image>` 전환
- [ ] Sidebar.tsx `<img>` → `<Image>` 전환
- [ ] width/height 지정
- [ ] 빌드 경고 제거 확인

---

## 📅 작업 일정 제안

### Day 1 (오늘)
- [x] Phase 1 검토 완료
- [ ] Firestore 진행률 시스템 설계 (2시간)
- [ ] hooks 생성 및 CRUD 함수 구현 (2시간)

### Day 2
- [ ] Activity 컴포넌트 진행률 연동 (3시간)
- [ ] Dashboard 진행률 표시 (1시간)
- [ ] 에러 처리 및 Toast 알림 (2시간)

### Day 3
- [ ] SkeletonLoader 구현 (1시간)
- [ ] Writing 자동 저장 (1시간)
- [ ] Week 2 데이터 준비 (2-3시간)

### Day 4
- [ ] Week 3 데이터 준비 (2-3시간)
- [ ] Activity 네비게이션 개선 (1-2시간)
- [ ] 이미지 최적화 (30분)

### Day 5
- [ ] 전체 테스트 및 검증
- [ ] 버그 수정
- [ ] Phase 1 완료 보고서 작성

---

## 🎯 Phase 1 완성 기준

### 필수 조건 (95%+)
- [x] ✅ 6가지 Activity UI 완성
- [x] ✅ Week 1 데이터 완비
- [x] ✅ JSON 검증 시스템
- [x] ✅ 빌드 성공
- [ ] ⏳ Firestore 진행률 추적 (6개 collection)
- [ ] ⏳ 에러 처리 및 로딩 상태
- [ ] ⏳ Week 2 데이터 (최소)

### 권장 조건 (100%)
- [ ] ⏳ Week 2-3 데이터 완비
- [ ] ⏳ Activity 네비게이션
- [ ] ⏳ Dashboard 진행률 표시
- [ ] ⏳ 이미지 최적화

---

## 🚀 Phase 2 진행 조건

**최소 조건**: Phase 1 진행률 95% 이상
- Firestore 진행률 추적 완성
- 에러 처리 기본 구현
- Week 2 데이터 최소 1개

**권장 조건**: Phase 1 진행률 100%
- Week 2-3 데이터 완비
- 모든 개선 사항 적용

---

## 📊 우선순위 정리

| 순위 | 작업 | 중요도 | 예상 시간 | 의존성 |
|-----|------|--------|----------|--------|
| 1 | Firestore 진행률 시스템 | 🔴 | 4-6h | 없음 |
| 2 | 에러 처리 & Toast | 🔴 | 2-3h | 없음 |
| 3 | Writing 자동 저장 | 🟡 | 1-2h | 없음 |
| 4 | Week 2 데이터 | 🟡 | 2-3h | 없음 |
| 5 | Week 3 데이터 | 🟡 | 2-3h | Week 2 |
| 6 | Activity 네비게이션 | 🟢 | 1-2h | 진행률 시스템 |
| 7 | Dashboard 개선 | 🟢 | 1-2h | 진행률 시스템 |
| 8 | 이미지 최적화 | 🟢 | 30m | 없음 |

**총 예상 시간**: 13.5-20.5시간 (약 3-5일)

---

## ✅ 다음 즉시 시작할 작업

### 🎯 Step 1: Firestore 진행률 시스템 설계
**예상 시간**: 2시간

1. `types/progress.ts` 인터페이스 정의
2. `lib/firebase/progress.ts` CRUD 함수
3. `hooks/useVocabularyProgress.ts` 기본 구조

### 🎯 Step 2: Hooks 생성
**예상 시간**: 2시간

4. 나머지 Activity Progress hooks 생성
5. `hooks/useOverallProgress.ts` 통합 hook

### 🎯 Step 3: Activity 연동
**예상 시간**: 3시간

6. 각 Activity 컴포넌트에 진행률 저장 로직 추가
7. 완료 버튼 기능 구현

---

**작업 시작**: Firestore 진행률 시스템 구축
**목표**: 오늘 중 Step 1-2 완료
