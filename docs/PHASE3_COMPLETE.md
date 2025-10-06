# Phase 3 완료 보고서 - 커리큘럼 시스템

**완료 일시**: 2025-10-04
**단계**: Phase 3 - 커리큘럼 시스템 개발
**상태**: ✅ 완료

---

## 📋 구현 완료 항목

### 1. 데이터 구조 설계

#### 타입 정의 (types/curriculum.ts)
- `ActivityType`: 6가지 활동 타입 (reading, listening, speaking, writing, vocabulary, grammar)
- `ActivityDifficulty`: 1-3 난이도 시스템
- `ActivityStatus`, `WeekStatus`: 진행 상태 관리
- `Activity`: 개별 학습 활동 구조
- `CurriculumWeek`: 주차별 커리큘럼 구조
- `UserWeekProgress`: 사용자 진행률 추적
- `ActivitySession`: 활동 세션 기록
- `CurriculumStats`: 통계 데이터

### 2. 샘플 커리큘럼 데이터

#### A1 레벨 4주차 커리큘럼 (lib/curriculum/curriculumData.ts)

**Week 1: 기초 인사와 자기소개** (180분)
- 7개 활동 (필수 5, 선택 2)
- 인사 표현, 자기소개 문법, 쓰기/말하기 연습

**Week 2: 숫자와 시간 표현** (195분)
- 8개 활동 (필수 6, 선택 2)
- 숫자 1-100, 시간 표현, 요일과 날짜

**Week 3: 가족과 친구 소개하기** (190분)
- 7개 활동 (필수 6, 선택 1)
- 가족 관계 단어, 소유격 문법, 외모/성격 묘사

**Week 4: 일상생활과 취미** (200분)
- 8개 활동 (필수 7, 선택 1)
- 일상 동사, 현재 시제, 취미 표현

#### 헬퍼 함수
- `getWeeksByLevel()`: 레벨별 주차 필터링
- `getWeekById()`: 주차 ID로 검색
- `getNextWeek()`, `getPreviousWeek()`: 네비게이션

### 3. 데이터 관리 훅 (hooks/useCurriculum.ts)

#### 조회 훅
- `useCurriculumWeeks(level)`: 레벨별 주차 목록
- `useCurriculumWeek(weekId)`: 특정 주차 상세
- `useWeekProgress(userId, weekId)`: 주차 진행률
- `useAllWeekProgress(userId)`: 전체 진행률
- `useCurriculumStats(userId)`: 통계 데이터

#### Mutation 훅
- `useStartActivity()`: 활동 시작 기록
- `useCompleteActivity()`: 활동 완료 처리
- `useUncompleteActivity()`: 활동 완료 취소

**특징**:
- React Query로 캐싱 및 동기화
- Firestore 통합 (weekProgress, activitySessions 컬렉션)
- 자동 쿼리 무효화 (optimistic updates)

### 4. UI 컴포넌트

#### WeekCard (components/curriculum/WeekCard.tsx)
- 주차 정보 카드
- 진행률 바 표시
- 상태 배지 (잠김, 시작 가능, 진행 중, 완료)
- 활동 수, 예상 시간, 실제 소요 시간 표시
- 클릭 시 주차 상세로 이동

#### ActivityTypeIcon (components/curriculum/ActivityTypeIcon.tsx)
- 활동 타입별 아이콘 (Heroicons)
- 타입별 레이블 및 색상 매핑
- 6가지 타입 지원

#### ActivityItem (components/curriculum/ActivityItem.tsx)
- 활동 아이템 카드
- 체크박스 (완료/미완료)
- 활동 정보 (제목, 설명, 타입, 난이도, 소요 시간)
- 필수/선택 배지
- 시작 버튼

#### ProgressBar (components/ui/ProgressBar.tsx)
- 진행률 표시 바
- 3가지 높이 (sm, md, lg)
- 4가지 색상 (primary, success, warning, danger)
- 선택적 퍼센트 라벨

### 5. 페이지 구현

#### 커리큘럼 목록 (/dashboard/curriculum)
- 레벨 탭 (A1, A2, B1, B2)
- 주차 그리드 레이아웃 (3열)
- 진행률 매핑 및 표시
- Empty State 처리
- 로딩 상태

#### 주차 상세 (/dashboard/curriculum/[weekId])
- 주차 헤더 (제목, 설명, 배지)
- 전체 진행률 바
- 통계 그리드 (총 활동, 필수 활동, 예상 시간, 소요 시간)
- 학습 목표 리스트
- 활동 목록 (ActivityItem 컴포넌트)
- 활동 완료/취소 토글
- 뒤로 가기 네비게이션

#### 활동 상세 (/dashboard/curriculum/[weekId]/[activityId])
- 활동 헤더 (타입, 제목, 설명)
- 실시간 타이머 (초 단위)
- 일시정지/재개 기능
- 활동 콘텐츠 영역 (placeholder)
- 완료 버튼 (자동 시간 기록)
- 이전/다음 활동 네비게이션
- 다음 활동 미리보기
- 자동 활동 시작 기록

---

## 🔧 해결한 기술적 이슈

### 1. Heroicons 패키지 누락
- **문제**: `@heroicons/react` 패키지가 설치되지 않음
- **해결**: `npm install @heroicons/react` 실행

### 2. ProgressBar export 누락
- **문제**: `components/ui/index.ts`에 ProgressBar export 누락
- **해결**: export 추가 및 컴포넌트 생성

### 3. .next 빌드 캐시 문제
- **문제**: EINVAL readlink 에러 (한글 경로 관련)
- **해결**: PowerShell로 `.next` 폴더 강제 삭제 후 재빌드

### 4. useEffect dependency warning
- **문제**: `startActivityMutation`이 dependency에 포함되지 않음
- **해결**: `eslint-disable-next-line` 주석 추가 (mutation 함수는 stable)

---

## 📊 빌드 결과

### 빌드 성공
```
✓ Compiled successfully in 5.1s
✓ Generating static pages (9/9)
✓ Finalizing page optimization
```

### 라우트 크기
```
Route (app)                                         Size  First Load JS
┌ ○ /                                            1.07 kB         124 kB
├ ○ /dashboard                                   69.8 kB         316 kB
├ ○ /dashboard/curriculum                        3.21 kB         256 kB
├ ƒ /dashboard/curriculum/[weekId]               3.33 kB         255 kB
├ ƒ /dashboard/curriculum/[weekId]/[activityId]  2.75 kB         254 kB
└ ...
```

### 경고 (Warning)
- ESLint: `<img>` 태그 사용 (Header, Sidebar) - 기능에 영향 없음
- 기존 Phase 2 경고와 동일

---

## 🎯 주요 기능

### 1. 커리큘럼 브라우징
- 레벨별 주차 목록 탐색
- 진행률 실시간 표시
- 상태 기반 UI (잠김, 시작 가능, 진행 중, 완료)

### 2. 진행률 추적
- Firestore 기반 진행률 저장
- 활동 완료 체크박스
- 필수 활동 완료 시 주차 자동 완료
- 실제 소요 시간 기록

### 3. 활동 학습
- 실시간 타이머
- 자동 세션 기록
- 완료 시 진행률 업데이트
- 이전/다음 활동 네비게이션

### 4. 통계 및 분석
- 총 활동 수 vs 완료 활동 수
- 예상 시간 vs 실제 소요 시간
- 주차 완료율
- 필수 활동 추적

---

## 📂 파일 구조

### 새로 생성된 파일
```
types/
  curriculum.ts                     # 커리큘럼 타입 정의

lib/
  curriculum/
    curriculumData.ts               # 샘플 데이터 (A1 Week 1-4)

hooks/
  useCurriculum.ts                  # 커리큘럼 데이터 훅

components/
  curriculum/
    WeekCard.tsx                    # 주차 카드
    ActivityItem.tsx                # 활동 아이템
    ActivityTypeIcon.tsx            # 활동 타입 아이콘
  ui/
    ProgressBar.tsx                 # 진행률 바

app/
  dashboard/
    curriculum/
      page.tsx                      # 커리큘럼 목록
      [weekId]/
        page.tsx                    # 주차 상세
        [activityId]/
          page.tsx                  # 활동 상세
```

### 수정된 파일
```
components/ui/index.ts              # ProgressBar export 추가
package.json                        # @heroicons/react 추가
```

---

## ⚠️ 알려진 제한사항

### 1. 활동 콘텐츠 Placeholder
- 현재 활동 페이지는 기본 구조만 구현
- 실제 학습 콘텐츠 (읽기 지문, 듣기 파일, 연습 문제 등) 미구현
- Phase 4-5에서 타입별 실제 콘텐츠 구현 필요

### 2. 로컬 데이터
- 현재 커리큘럼 데이터는 `curriculumData.ts`에 하드코딩
- Firestore에 저장하지 않고 클라이언트에서 직접 로드
- 추후 Admin 패널을 통한 CMS 기능 필요

### 3. A1 레벨만 구현
- A2, B1, B2 레벨 데이터 미작성
- Empty State로 처리

### 4. 스트릭 연동 미구현
- 활동 완료가 스트릭 증가로 연결되지 않음
- `User.streak` 업데이트 로직 필요

---

## 🚀 다음 단계 (Phase 4)

### 우선순위 기능
1. **학습 일지 시스템**
   - 일별 학습 기록
   - 메모 및 복습 노트
   - 학습 시간 자동 집계

2. **활동 콘텐츠 구현**
   - 읽기: 지문 + 이해 문제
   - 듣기: 오디오 플레이어 + 문제
   - 말하기: 음성 녹음 + 평가
   - 쓰기: 텍스트 에디터 + 제출
   - 어휘: 플래시카드 + 퀴즈
   - 문법: 설명 + 연습 문제

3. **커뮤니티 기능**
   - 학습 질문 게시판
   - 학습 팁 공유
   - 동료 학습자 찾기

### 개선 사항
1. A2, B1, B2 레벨 커리큘럼 작성
2. 활동 완료 시 스트릭 증가 연동
3. 주차 잠금 로직 (순차 진행 강제)
4. 커리큘럼 CMS (Admin 패널)
5. 모바일 최적화

---

## 🎓 기술 스택

### 새로 추가된 패키지
- `@heroicons/react`: 아이콘 라이브러리

### 사용 기술
- Next.js 15 App Router: 동적 라우팅
- React Query: 서버 상태 관리
- Firestore: 진행률 데이터베이스
- TypeScript: 타입 안전성
- Tailwind CSS v4: 스타일링

---

## ✅ 품질 체크리스트

- [x] TypeScript 에러 0개
- [x] ESLint 에러 0개
- [x] 프로덕션 빌드 성공
- [x] 동적 라우팅 작동
- [x] Firestore 통합
- [x] 반응형 디자인
- [x] 다크모드 지원
- [x] 로딩 상태 처리
- [x] 에러 상태 처리
- [x] Empty State 처리

---

**Phase 3 완료!** 🎉

커리큘럼 시스템의 기본 구조가 완성되었습니다. 사용자는 레벨별 주차를 탐색하고, 활동을 완료하며, 진행률을 추적할 수 있습니다. 다음 단계에서는 실제 학습 콘텐츠와 학습 일지 기능을 구현할 예정입니다.
