# 📋 System Testing Plan - 영어의 정석 (English Bible)

**생성일**: 2025-10-11
**Phase**: Phase 1 - MVP Production Readiness
**Step**: Step 6 - System Testing & QA
**목표**: 프로덕션 배포 전 모든 핵심 기능 검증

---

## 🎯 테스트 목표

1. **기능 완성도**: 모든 핵심 사용자 플로우 작동 확인
2. **데이터 무결성**: Progress 추적 정확성 검증
3. **크로스 브라우저**: Chrome, Firefox, Safari, Edge 호환성
4. **모바일 반응형**: iOS, Android 모바일 디바이스 테스트
5. **에러 처리**: 네트워크 실패, 인증 오류 등 예외 상황 대응
6. **성능**: 페이지 로드 속도, Firestore 쿼리 최적화
7. **오디오 재생**: 67개 MP3 파일 재생 검증

---

## 📝 테스트 범위

### ✅ In Scope
- 회원가입 및 로그인 (이메일/비밀번호, Google OAuth)
- Placement Test 전체 플로우 (20문제 → 결과 → 추천 레벨)
- Week 1-8 학습 플로우 (6가지 Activity 타입)
- Progress 추적 (Activity → Week → User Summary 자동 업데이트)
- 오디오 재생 (Listening Activity 67개 MP3)
- 학습 경로 자동화 (ContinueLearningButton)
- 에러 바운더리 및 재시도 로직
- 반응형 디자인 (Mobile, Tablet, Desktop)

### ❌ Out of Scope (Phase 2)
- Elite Track (Weeks 9-16) - 아직 vocabulary 개선 중
- 커뮤니티 기능 (게시판, 스터디 그룹)
- 학습 일지 (Journal)
- 인증서 및 성적표
- 관리자 대시보드
- 이메일 알림
- SEO 최적화

---

## 🧪 테스트 케이스

### **TC-001: 회원가입 및 로그인**

#### TC-001-1: 이메일/비밀번호 회원가입
**Steps**:
1. [Homepage](/) 방문
2. "시작하기" 버튼 클릭
3. "이메일로 계속하기" 선택
4. 이메일: `test@example.com`, 비밀번호: `Test1234!` 입력
5. "가입하기" 클릭

**Expected**:
- ✅ 회원가입 성공
- ✅ Firebase Auth에 사용자 생성
- ✅ Firestore `/users/{uid}` 문서 생성
- ✅ 자동으로 `/dashboard` 리다이렉트

**Priority**: 🔴 Critical

---

#### TC-001-2: Google OAuth 회원가입
**Steps**:
1. "Google로 계속하기" 클릭
2. Google 계정 선택 팝업
3. 계정 선택 및 승인

**Expected**:
- ✅ Google 인증 성공
- ✅ Firebase Auth에 사용자 생성
- ✅ Firestore 사용자 프로필 생성
- ✅ `/dashboard` 리다이렉트

**Priority**: 🔴 Critical

---

#### TC-001-3: 로그인 (기존 사용자)
**Steps**:
1. 로그아웃 후 다시 [Homepage](/) 방문
2. "로그인" 버튼 클릭
3. 이메일/비밀번호 입력

**Expected**:
- ✅ 로그인 성공
- ✅ 이전 학습 진행 상황 유지
- ✅ Dashboard에 올바른 통계 표시

**Priority**: 🔴 Critical

---

#### TC-001-4: 잘못된 비밀번호
**Steps**:
1. 올바른 이메일, 잘못된 비밀번호 입력

**Expected**:
- ✅ 에러 메시지: "비밀번호가 올바르지 않습니다."
- ✅ Toast 알림 표시
- ✅ 로그인 실패 (페이지 유지)

**Priority**: 🟡 High

---

### **TC-002: Placement Test**

#### TC-002-1: Placement Test 완료 플로우
**Steps**:
1. Dashboard에서 "레벨 테스트 시작" 클릭
2. Vocabulary 섹션 (6문제) 응답
3. Grammar 섹션 (6문제) 응답
4. Reading 섹션 (3 passages) 응답
5. Listening 섹션 (3 audio questions) 응답
6. Speaking 자기평가 (2 questions, 1-5 scale) 응답
7. "제출하기" 클릭

**Expected**:
- ✅ 총 20문제 모두 응답 가능
- ✅ Audio 재생 정상 작동
- ✅ 결과 페이지로 이동
- ✅ CEFR 레벨 표시 (A1.1 ~ C2)
- ✅ 추천 Week 표시 (예: A1.1 → Week 1)
- ✅ Firestore에 `placementTestResult` 저장
- ✅ User Summary에 `currentWeek` 설정

**Priority**: 🔴 Critical

---

#### TC-002-2: Placement Test 결과 정확성
**Test Data**:
- 모든 A1 문제 정답 → A1.1 레벨
- 모든 B1 문제 정답 → B1 레벨
- 모든 C1 문제 정답 → C1 레벨
- A1 정답, B1 틀림 → A2 레벨

**Expected**:
- ✅ 점수 기반 레벨 결정
- ✅ 난이도 패턴 기반 조정 (상위 난이도 80%+ → 레벨업)
- ✅ 추천 Week가 레벨에 맞게 설정

**Priority**: 🔴 Critical

---

#### TC-002-3: Placement Test 재시험
**Steps**:
1. Placement Test 완료 후
2. Dashboard → "레벨 테스트 다시 하기" 클릭

**Expected**:
- ✅ 이전 결과 유지
- ✅ 새 결과로 덮어쓰기
- ✅ 추천 Week 업데이트

**Priority**: 🟡 High

---

### **TC-003: Week 학습 플로우**

#### TC-003-1: Week 1 Vocabulary Activity
**Steps**:
1. Dashboard → Week 1 카드 클릭
2. "Vocabulary" Activity 선택
3. 10문제 풀이
4. "제출하기" 클릭

**Expected**:
- ✅ 10문제 모두 응답 가능
- ✅ 정답/오답 피드백 표시
- ✅ 정답률 계산 (예: 8/10 = 80%)
- ✅ Firestore `/users/{uid}/progress/week-1/activities/week-1-vocabulary` 저장
- ✅ Week Progress 자동 업데이트
- ✅ User Summary 자동 업데이트
- ✅ "다음 Activity" 버튼 표시

**Priority**: 🔴 Critical

---

#### TC-003-2: Week 1 Listening Activity (Audio 재생)
**Steps**:
1. Week 1 → "Listening" Activity 선택
2. Audio 재생 버튼 클릭
3. 문제 풀이
4. "제출하기" 클릭

**Expected**:
- ✅ MP3 파일 정상 재생 (`/audio/week_1_listening.mp3`)
- ✅ Playback controls 작동 (Play, Pause, Volume)
- ✅ Audio 반복 재생 가능
- ✅ 정답 제출 후 Progress 저장

**Priority**: 🔴 Critical

---

#### TC-003-3: Week 1 Speaking Activity (녹음)
**Steps**:
1. Week 1 → "Speaking" Activity 선택
2. 프롬프트 읽기
3. "녹음 시작" 버튼 클릭
4. 30초 녹음
5. "녹음 중지" 및 제출

**Expected**:
- ✅ 마이크 권한 요청
- ✅ 녹음 타이머 표시
- ✅ 녹음 파일 재생 가능
- ✅ 자기평가 점수 입력 (1-5)
- ✅ Progress 저장

**Priority**: 🟡 High

---

#### TC-003-4: Week 1 완료 (6개 Activity)
**Steps**:
1. Week 1의 6개 Activity 모두 완료
   - Vocabulary (10문제)
   - Grammar (10문제)
   - Listening (5문제 + audio)
   - Speaking (3 prompts + 녹음)
   - Reading (1 passage + 5문제)
   - Writing (2 prompts + 작문)

**Expected**:
- ✅ Week Progress: `progressPercentage = 100%`
- ✅ Week Progress: `isCompleted = true`
- ✅ Week Progress Card에 "완료" 배지 표시
- ✅ User Summary: `completedWeeks += 1`
- ✅ User Summary: `currentWeek = 2` (자동 증가)
- ✅ ContinueLearningButton: "Week 2 학습 시작하기" 표시

**Priority**: 🔴 Critical

---

#### TC-003-5: Week Progress 정확성
**Steps**:
1. Week 1 Activity 3개 완료 (50%)

**Expected**:
- ✅ Week Progress: `completedActivities = 3`
- ✅ Week Progress: `totalActivities = 6`
- ✅ Week Progress: `progressPercentage = 50%`
- ✅ Week Progress Card 진행률 바: 50% 표시

**Priority**: 🔴 Critical

---

### **TC-004: Progress 추적 시스템**

#### TC-004-1: Activity Progress 저장
**Steps**:
1. Week 1 Vocabulary 완료 (8/10 정답)

**Expected Firestore Data**:
```json
{
  "activityId": "week-1-vocabulary",
  "weekId": "week-1",
  "completed": true,
  "score": 8,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "accuracy": 80,
  "attempts": 1,
  "firstAttempt": "2025-10-11T10:00:00Z",
  "lastAttempt": "2025-10-11T10:00:00Z",
  "timeSpent": 120,
  "answers": {...}
}
```

**Priority**: 🔴 Critical

---

#### TC-004-2: Week Progress 자동 업데이트
**Steps**:
1. Week 1 Activity 3개 완료

**Expected Firestore Data** (`/users/{uid}/progress/week-1`):
```json
{
  "weekId": "week-1",
  "weekNumber": 1,
  "totalActivities": 6,
  "completedActivities": 3,
  "progressPercentage": 50,
  "averageAccuracy": 85,
  "isCompleted": false,
  "activities": {
    "week-1-vocabulary": {
      "completed": true,
      "accuracy": 80,
      "attempts": 1
    },
    "week-1-grammar": {
      "completed": true,
      "accuracy": 90,
      "attempts": 1
    },
    "week-1-listening": {
      "completed": true,
      "accuracy": 85,
      "attempts": 1
    }
  }
}
```

**Priority**: 🔴 Critical

---

#### TC-004-3: User Progress Summary 자동 업데이트
**Steps**:
1. Week 1 완료 (100%)

**Expected Firestore Data** (`/users/{uid}/progressSummary`):
```json
{
  "userId": "test-uid",
  "currentWeek": 2,
  "totalWeeks": 16,
  "completedWeeks": 1,
  "overallProgress": 6.25,
  "overallAccuracy": 85,
  "totalLearningTime": 3600,
  "weeklyProgress": {
    "week-1": {
      "completed": true,
      "progressPercentage": 100,
      "completedAt": "2025-10-11T12:00:00Z"
    }
  },
  "stats": {
    "totalActivitiesCompleted": 6,
    "totalActivities": 96
  }
}
```

**Priority**: 🔴 Critical

---

### **TC-005: 학습 경로 자동화**

#### TC-005-1: ContinueLearningButton - 신규 사용자
**Steps**:
1. 신규 사용자 로그인 (Placement Test 미완료)
2. Dashboard 확인

**Expected**:
- ✅ ContinueLearningButton: "레벨 테스트부터 시작하세요"
- ✅ 클릭 시 `/dashboard/placement-test` 이동

**Priority**: 🔴 Critical

---

#### TC-005-2: ContinueLearningButton - Placement Test 완료
**Steps**:
1. Placement Test 완료 (추천 레벨: A1.1 → Week 1)
2. Dashboard 확인

**Expected**:
- ✅ ContinueLearningButton: "Week 1 학습 시작하기"
- ✅ 클릭 시 `/dashboard/learn/1` 이동

**Priority**: 🔴 Critical

---

#### TC-005-3: ContinueLearningButton - Week 진행 중
**Steps**:
1. Week 1 Activity 3개 완료 (50%)
2. Dashboard 확인

**Expected**:
- ✅ ContinueLearningButton: "Week 1 학습 계속하기"
- ✅ 클릭 시 `/dashboard/learn/1` 이동

**Priority**: 🔴 Critical

---

#### TC-005-4: ContinueLearningButton - Week 완료
**Steps**:
1. Week 1 완료 (100%)
2. Dashboard 확인

**Expected**:
- ✅ User Summary: `currentWeek = 2`
- ✅ ContinueLearningButton: "Week 2 학습 시작하기"
- ✅ 클릭 시 `/dashboard/learn/2` 이동

**Priority**: 🔴 Critical

---

### **TC-006: 오디오 재생 검증**

#### TC-006-1: 모든 Placement Test 오디오
**Steps**:
1. Placement Test Listening 섹션
2. 3개 오디오 파일 재생 확인

**Expected**:
- ✅ `/audio/placement_a2.mp3` 재생
- ✅ `/audio/placement_b1.mp3` 재생
- ✅ `/audio/placement_c1.mp3` 재생

**Priority**: 🔴 Critical

---

#### TC-006-2: Week 1-8 Listening 오디오 (32개)
**Steps**:
1. Week 1-8 각 Week의 Listening Activity
2. 모든 오디오 파일 재생 확인

**Expected**:
- ✅ 총 32개 MP3 파일 정상 재생
- ✅ No 404 errors
- ✅ Audio quality acceptable (gTTS)

**Priority**: 🔴 Critical

---

#### TC-006-3: Elite Track Listening 오디오 (32개)
**Steps**:
1. Week 9-16 각 Week의 Listening Activity
2. 모든 오디오 파일 재생 확인

**Expected**:
- ✅ 총 32개 MP3 파일 정상 재생
- ✅ No 404 errors

**Priority**: 🟡 High (Elite Track은 Phase 2)

---

### **TC-007: 에러 핸들링**

#### TC-007-1: 네트워크 오류 (Offline)
**Steps**:
1. DevTools → Network → Offline 설정
2. Week 1 Vocabulary Activity 완료 시도
3. "제출하기" 클릭

**Expected**:
- ✅ Toast 알림: "네트워크 연결을 확인해주세요"
- ✅ 자동 재시도 (최대 3회, 지수 백오프)
- ✅ 재시도 실패 시 에러 바운더리 표시
- ✅ "다시 시도" 버튼 제공

**Priority**: 🟡 High

---

#### TC-007-2: Firestore Permission Denied
**Steps**:
1. Firestore Security Rules에서 임시로 모든 접근 거부
2. Activity 완료 시도

**Expected**:
- ✅ 에러 메시지: "접근 권한이 없습니다."
- ✅ Toast 알림 표시
- ✅ 에러 로그 기록

**Priority**: 🟡 High

---

#### TC-007-3: 컴포넌트 렌더링 에러
**Steps**:
1. 의도적으로 컴포넌트에서 에러 발생
   ```tsx
   throw new Error('Test error');
   ```

**Expected**:
- ✅ Global Error Boundary 표시
- ✅ 에러 메시지: "앗! 문제가 발생했습니다"
- ✅ "다시 시도" 버튼 작동
- ✅ "대시보드로 돌아가기" 버튼 작동

**Priority**: 🟡 High

---

### **TC-008: 크로스 브라우저 테스트**

#### TC-008-1: Chrome (최신 버전)
**Test**: 모든 핵심 기능 (TC-001 ~ TC-005)

**Expected**:
- ✅ 모든 기능 정상 작동
- ✅ UI 레이아웃 정상
- ✅ Audio 재생 정상

**Priority**: 🔴 Critical

---

#### TC-008-2: Firefox (최신 버전)
**Test**: 모든 핵심 기능

**Expected**:
- ✅ 모든 기능 정상 작동
- ✅ UI 레이아웃 정상 (Flexbox, Grid 호환성)
- ✅ Audio 재생 정상

**Priority**: 🟡 High

---

#### TC-008-3: Safari (macOS, iOS)
**Test**: 모든 핵심 기능

**Expected**:
- ✅ 모든 기능 정상 작동
- ✅ Audio 재생 정상 (Safari는 MP3 포맷 지원)
- ✅ PWA 기능 작동 (향후 Phase 2)

**Priority**: 🟡 High

---

#### TC-008-4: Edge (최신 버전)
**Test**: 모든 핵심 기능

**Expected**:
- ✅ 모든 기능 정상 작동 (Chromium 기반)

**Priority**: 🟢 Medium

---

### **TC-009: 모바일 반응형 테스트**

#### TC-009-1: iPhone (iOS Safari)
**Viewport**: 375x667 (iPhone SE)

**Expected**:
- ✅ Navigation 메뉴 햄버거 아이콘으로 변환
- ✅ Week Progress Card 1열 레이아웃
- ✅ Activity 카드 터치 가능
- ✅ Audio controls 모바일 최적화
- ✅ 텍스트 가독성 (최소 16px)

**Priority**: 🔴 Critical

---

#### TC-009-2: Android (Chrome)
**Viewport**: 360x640 (Galaxy S20)

**Expected**:
- ✅ 모든 반응형 레이아웃 정상
- ✅ Touch events 정상 작동
- ✅ Audio 재생 정상

**Priority**: 🔴 Critical

---

#### TC-009-3: Tablet (iPad)
**Viewport**: 768x1024

**Expected**:
- ✅ 2-column 레이아웃
- ✅ Sidebar 표시
- ✅ 터치 및 스와이프 제스처

**Priority**: 🟡 High

---

### **TC-010: 성능 테스트**

#### TC-010-1: 페이지 로드 속도
**Metrics**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

**Expected**:
- ✅ FCP < 1.5s
- ✅ LCP < 2.5s
- ✅ TTI < 3.5s

**Tools**: Lighthouse, WebPageTest

**Priority**: 🟡 High

---

#### TC-010-2: Firestore 쿼리 성능
**Test**:
1. `getUserProgressSummary()` 호출 시간
2. `getWeekProgress()` 호출 시간
3. `saveActivityProgress()` 저장 시간

**Expected**:
- ✅ Summary 조회 < 500ms
- ✅ Week Progress 조회 < 300ms
- ✅ Activity 저장 < 200ms

**Priority**: 🟡 High

---

#### TC-010-3: 번들 크기
**Metrics**:
- JavaScript bundle size
- CSS bundle size
- Total page weight

**Expected**:
- ✅ JS bundle < 300KB (gzipped)
- ✅ CSS < 50KB (gzipped)
- ✅ Total page weight < 1MB (excluding audio)

**Priority**: 🟢 Medium

---

## 🐛 버그 추적 템플릿

### Bug Report Format
```markdown
## BUG-XXX: [간단한 제목]

**우선순위**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

**재현 단계**:
1. Step 1
2. Step 2
3. ...

**예상 동작**:
[무엇이 일어나야 하는가]

**실제 동작**:
[실제로 무엇이 일어났는가]

**환경**:
- Browser: Chrome 120.0
- OS: Windows 11
- Device: Desktop

**스크린샷**:
[이미지 첨부]

**에러 로그**:
```
[Console errors]
```

**해결 방법**:
[수정 내용]

**검증 완료**: ✅ / ❌
```

---

## 📊 테스트 진행 상황 추적

### Critical Tests (Must Pass)
- [ ] TC-001-1: 이메일 회원가입
- [ ] TC-001-2: Google OAuth
- [ ] TC-002-1: Placement Test 완료
- [ ] TC-002-2: Placement Test 결과 정확성
- [ ] TC-003-1: Vocabulary Activity
- [ ] TC-003-2: Listening Activity (Audio)
- [ ] TC-003-4: Week 완료 플로우
- [ ] TC-004-1: Activity Progress 저장
- [ ] TC-004-2: Week Progress 자동 업데이트
- [ ] TC-004-3: User Summary 자동 업데이트
- [ ] TC-005-1~4: ContinueLearningButton 모든 케이스
- [ ] TC-006-1: Placement Test 오디오
- [ ] TC-006-2: Week 1-8 오디오
- [ ] TC-008-1: Chrome 테스트
- [ ] TC-009-1: iPhone 반응형
- [ ] TC-009-2: Android 반응형

### High Priority Tests
- [ ] TC-001-4: 잘못된 비밀번호
- [ ] TC-002-3: Placement Test 재시험
- [ ] TC-003-3: Speaking Activity 녹음
- [ ] TC-007-1: 네트워크 오류
- [ ] TC-007-2: Permission Denied
- [ ] TC-008-2: Firefox 테스트
- [ ] TC-008-3: Safari 테스트
- [ ] TC-009-3: Tablet 반응형
- [ ] TC-010-1: 페이지 로드 속도
- [ ] TC-010-2: Firestore 쿼리 성능

### Medium/Low Priority Tests
- [ ] TC-008-4: Edge 테스트
- [ ] TC-010-3: 번들 크기

---

## ✅ Pass Criteria

**프로덕션 배포 승인 조건**:
1. ✅ Critical Tests 100% 통과
2. ✅ High Priority Tests 90% 이상 통과
3. ✅ 🔴 Critical 버그 0개
4. ✅ 🟡 High 버그 2개 이하
5. ✅ 모든 오디오 파일 재생 가능
6. ✅ Chrome, Firefox, Safari 호환성
7. ✅ iPhone, Android 반응형 정상
8. ✅ 페이지 로드 < 3초
9. ✅ Firestore 쿼리 < 1초

---

## 📅 테스트 일정

**예상 소요 시간**: 4시간

**Day 1 (2시간)**:
- TC-001 ~ TC-003: 기능 테스트 (인증, Placement, Week 학습)
- TC-004 ~ TC-005: Progress 추적, 학습 경로

**Day 2 (1시간)**:
- TC-006: 오디오 검증 (67개 파일)
- TC-007: 에러 시나리오

**Day 3 (1시간)**:
- TC-008: 크로스 브라우저 (Chrome, Firefox, Safari)
- TC-009: 모바일 반응형 (iPhone, Android, iPad)
- TC-010: 성능 측정

**버그 수정**: 발견 즉시 수정 (추가 1-2시간)

---

## 📝 테스트 완료 체크리스트

완료 시 `.claude/testing/test-results.md` 파일 생성:
- [ ] 모든 Critical Tests 통과
- [ ] 버그 리포트 작성 완료
- [ ] 수정 사항 문서화
- [ ] 성능 지표 기록
- [ ] 브라우저 호환성 매트릭스 작성
- [ ] 모바일 테스트 결과 정리
- [ ] 프로덕션 배포 승인 여부 결정

---

**다음 단계**: 실제 테스트 실행 및 결과 문서화
