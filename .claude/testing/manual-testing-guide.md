# 🧪 Manual Testing Guide - 영어의 정석 (English Bible)

**테스트 날짜**: 2025-10-11
**개발 서버**: http://localhost:3008
**예상 소요 시간**: 95분 (약 1.5시간)

---

## 🎯 테스트 목적

프로덕션 배포 전 모든 핵심 사용자 플로우가 정상 작동하는지 검증합니다.

---

## ✅ 사전 준비

### 1. 개발 서버 확인
- [x] Next.js dev server 실행 중: http://localhost:3008
- [x] 67개 오디오 파일 준비 완료 (`/public/audio/*.mp3`)
- [x] 48개 Activity JSON 파일 준비 완료

### 2. 브라우저 준비
- **Primary Browser**: Chrome (최신 버전)
- **Secondary**: Firefox, Safari (크로스 브라우저 테스트용)
- **DevTools**: F12 (Console, Network 탭 확인용)

### 3. Firebase Console 준비
- Firebase Console 접속: https://console.firebase.google.com/
- Firestore Database 탭 열어두기 (실시간 데이터 확인용)

### 4. 테스트 계정 준비
- **Email Account 1**: `test1@example.com` / `Test1234!`
- **Email Account 2**: `test2@example.com` / `Test1234!`
- **Google Account**: 본인의 테스트용 Google 계정

---

## 📋 Phase 1: Authentication & Onboarding (15분)

### ✅ TC-001-1: 이메일/비밀번호 회원가입

**Steps**:
1. 브라우저에서 http://localhost:3008 접속
2. "시작하기" 버튼 클릭
3. "이메일로 계속하기" 선택
4. 이메일: `test1@example.com`, 비밀번호: `Test1234!` 입력
5. "가입하기" 클릭

**Expected Results**:
- [ ] 회원가입 성공 메시지 표시
- [ ] 자동으로 `/dashboard` 페이지로 리다이렉트
- [ ] Dashboard에 "환영합니다, test1님!" 표시
- [ ] Firebase Console → Authentication → Users에 새 사용자 추가 확인
- [ ] Firebase Console → Firestore → `users/{uid}` 문서 생성 확인

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

**Notes/Issues**:
```
(테스트 중 발견한 문제점 기록)
```

---

### ✅ TC-001-2: 로그아웃 및 재로그인

**Steps**:
1. Dashboard 상단 우측 프로필 아이콘 클릭
2. "로그아웃" 클릭
3. 홈페이지로 리다이렉트 확인
4. "로그인" 버튼 클릭
5. `test1@example.com` / `Test1234!` 입력
6. "로그인" 클릭

**Expected Results**:
- [ ] 로그아웃 성공 후 홈페이지로 이동
- [ ] 로그인 성공
- [ ] Dashboard 접근 (이전 상태 유지)

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-001-3: 잘못된 비밀번호 에러 처리

**Steps**:
1. 로그인 페이지에서 `test1@example.com` / `WrongPassword!` 입력
2. "로그인" 클릭

**Expected Results**:
- [ ] Toast 알림: "비밀번호가 올바르지 않습니다."
- [ ] 로그인 실패 (로그인 페이지 유지)
- [ ] Console에 에러 로그 없음 (정상적인 에러 처리)

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-001-4: Google OAuth 회원가입 (선택사항)

**Steps**:
1. 로그아웃 후 "시작하기" 클릭
2. "Google로 계속하기" 클릭
3. Google 계정 선택 팝업에서 본인 계정 선택
4. 권한 승인

**Expected Results**:
- [ ] Google OAuth 팝업 정상 표시
- [ ] 인증 성공
- [ ] Dashboard 접근
- [ ] Firebase Console에 Google 사용자 추가 확인

**Pass/Fail**: ⬜ PASS / ⬜ FAIL / ⬜ SKIP

---

## 📋 Phase 2: Placement Test (10분)

### ✅ TC-002-1: Placement Test 전체 플로우

**Steps**:
1. Dashboard에서 "레벨 테스트 시작" 버튼 클릭
2. **Vocabulary 섹션 (6문제)** 응답
   - 각 문제 선택지 클릭 가능 확인
   - "다음" 버튼으로 진행
3. **Grammar 섹션 (6문제)** 응답
4. **Reading 섹션 (3 passages)** 응답
   - 지문 읽기 가능 확인
   - 각 지문당 질문 응답
5. **Listening 섹션 (3 audio questions)** 응답
   - 🔊 **Audio 재생 버튼 클릭**
   - 오디오 정상 재생 확인 (3개 모두)
   - 재생 컨트롤 (Play, Pause, Volume) 작동 확인
6. **Speaking 자기평가 (2 questions)** 응답
   - 1-5 점수 선택
7. "제출하기" 클릭

**Expected Results**:
- [ ] 총 20문제 모두 응답 가능
- [ ] Audio 3개 모두 정상 재생 (`placement_a2.mp3`, `placement_b1.mp3`, `placement_c1.mp3`)
- [ ] "제출하기" 버튼 활성화
- [ ] 결과 페이지로 이동

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

**Audio Test Results**:
- [ ] `placement_a2.mp3` 재생 성공
- [ ] `placement_b1.mp3` 재생 성공
- [ ] `placement_c1.mp3` 재생 성공

---

### ✅ TC-002-2: Placement Test 결과 페이지

**Expected Results**:
- [ ] CEFR 레벨 표시 (A1.1, A1.2, A2.1, A2.2, B1.1, B1.2, B2.1, B2.2, C1, C2 중 하나)
- [ ] 점수 표시 (예: "20문제 중 15문제 정답")
- [ ] 추천 Week 표시 (예: "A1.1 레벨 → Week 1부터 시작하세요")
- [ ] "Week 1 시작하기" 버튼 표시
- [ ] Firebase Console → Firestore → `users/{uid}/placementTestResult` 문서 생성 확인
- [ ] Firebase Console → Firestore → `users/{uid}/progressSummary` 문서에 `currentWeek` 설정 확인

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

**Actual Results**:
```
CEFR Level: _______
Score: ___/20
Recommended Week: _______
```

---

## 📋 Phase 3: Week Learning Flow (20분)

### ✅ TC-003-1: Week 1 Vocabulary Activity

**Steps**:
1. Dashboard에서 "Week 1" 카드 클릭
2. "Vocabulary" Activity 선택
3. 10문제 풀이
4. "제출하기" 클릭

**Expected Results**:
- [ ] 10문제 모두 응답 가능
- [ ] 제출 후 결과 페이지 표시
- [ ] 정답/오답 피드백 표시
- [ ] 정답률 표시 (예: "80% (8/10 정답)")
- [ ] "다음 Activity" 버튼 표시
- [ ] Week Progress 업데이트: "1/6 완료" 표시

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-003-2: Week 1 Grammar Activity

**Steps**:
1. "다음 Activity" 클릭 또는 Week 1 페이지에서 "Grammar" 선택
2. 10문제 풀이
3. "제출하기" 클릭

**Expected Results**:
- [ ] 10문제 응답 가능
- [ ] 결과 페이지 정답률 표시
- [ ] Week Progress: "2/6 완료"

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-003-3: Week 1 Listening Activity (Audio 재생)

**Steps**:
1. "Listening" Activity 선택
2. 🔊 Audio 재생 버튼 클릭
3. 오디오 듣기 (여러 번 재생 가능 확인)
4. 5문제 풀이
5. "제출하기" 클릭

**Expected Results**:
- [ ] Audio 파일 정상 재생 (`week_1_listening.mp3` 또는 유사)
- [ ] Playback controls 작동 (Play, Pause, Volume, Seek)
- [ ] 여러 번 재생 가능
- [ ] 5문제 응답 가능
- [ ] Week Progress: "3/6 완료"

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-003-4: Week 1 Speaking Activity (녹음 - 선택사항)

**Steps**:
1. "Speaking" Activity 선택
2. 프롬프트 읽기 (예: "Introduce yourself in English")
3. "녹음 시작" 버튼 클릭
4. 브라우저 마이크 권한 승인
5. 30초 녹음
6. "녹음 중지" 클릭
7. 녹음 재생 확인
8. 자기평가 점수 입력 (1-5)
9. "제출하기" 클릭

**Expected Results**:
- [ ] 브라우저 마이크 권한 요청 팝업 표시
- [ ] 녹음 타이머 표시
- [ ] 녹음 파일 재생 가능
- [ ] 자기평가 점수 입력 가능
- [ ] Week Progress: "4/6 완료"

**Pass/Fail**: ⬜ PASS / ⬜ FAIL / ⬜ SKIP (마이크 없음)

---

### ✅ TC-003-5: Week 1 Reading Activity

**Steps**:
1. "Reading" Activity 선택
2. 지문 읽기
3. 5문제 풀이
4. "제출하기" 클릭

**Expected Results**:
- [ ] 지문 정상 표시 (스크롤 가능)
- [ ] 5문제 응답 가능
- [ ] Week Progress: "5/6 완료"

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-003-6: Week 1 Writing Activity

**Steps**:
1. "Writing" Activity 선택
2. 프롬프트 읽기 (예: "Write about your daily routine")
3. 텍스트 입력 (최소 50단어)
4. "제출하기" 클릭

**Expected Results**:
- [ ] 텍스트 에디터 정상 작동
- [ ] 단어 수 카운터 표시
- [ ] 제출 성공
- [ ] Week Progress: "6/6 완료" (100%)

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-003-7: Week 1 완료 상태 확인

**Steps**:
1. Dashboard로 돌아가기
2. Week 1 카드 확인

**Expected Results**:
- [ ] Week 1 Progress Bar: 100%
- [ ] "완료" 배지 표시 (녹색 체크마크)
- [ ] Week Progress Card: "6/6 Activity 완료"
- [ ] 평균 정답률 표시 (예: "85%")

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

## 📋 Phase 4: Progress Tracking Verification (10분)

### ✅ TC-004-1: Firestore Activity Progress 확인

**Steps**:
1. Firebase Console 접속
2. Firestore Database 탭
3. `users/{uid}/progress/week-1/activities/week-1-vocabulary` 경로 확인

**Expected Data Structure**:
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
  "firstAttempt": Timestamp,
  "lastAttempt": Timestamp,
  "timeSpent": 120 (seconds),
  "answers": { ... }
}
```

**Verification**:
- [ ] 문서 존재 확인
- [ ] `completed: true` 확인
- [ ] `accuracy` 정확하게 계산됨 (correctAnswers / totalQuestions * 100)
- [ ] Timestamp 필드 정상

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-004-2: Firestore Week Progress 확인

**Steps**:
1. Firestore Database 탭
2. `users/{uid}/progress/week-1` 경로 확인

**Expected Data Structure**:
```json
{
  "weekId": "week-1",
  "weekNumber": 1,
  "totalActivities": 6,
  "completedActivities": 6,
  "progressPercentage": 100,
  "averageAccuracy": 85,
  "isCompleted": true,
  "startedAt": Timestamp,
  "completedAt": Timestamp,
  "activities": {
    "week-1-vocabulary": { "completed": true, "accuracy": 80 },
    "week-1-grammar": { "completed": true, "accuracy": 90 },
    ...
  }
}
```

**Verification**:
- [ ] `completedActivities: 6`
- [ ] `progressPercentage: 100`
- [ ] `isCompleted: true`
- [ ] `averageAccuracy` 정확하게 계산됨
- [ ] `completedAt` Timestamp 설정됨

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-004-3: Firestore User Progress Summary 확인

**Steps**:
1. Firestore Database 탭
2. `users/{uid}/progressSummary` 경로 확인

**Expected Data Structure**:
```json
{
  "userId": "uid",
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
      "completedAt": Timestamp
    }
  },
  "stats": {
    "totalActivitiesCompleted": 6,
    "totalActivities": 96
  }
}
```

**Verification**:
- [ ] `currentWeek: 2` (자동 증가)
- [ ] `completedWeeks: 1`
- [ ] `overallProgress: 6.25%` (1 week / 16 weeks * 100)
- [ ] `weeklyProgress["week-1"].completed: true`

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-004-4: ContinueLearningButton 자동 추천

**Steps**:
1. Dashboard로 돌아가기
2. "학습 계속하기" 버튼 확인

**Expected Results**:
- [ ] 버튼 텍스트: "Week 2 학습 시작하기"
- [ ] 버튼 클릭 시 `/dashboard/learn/2` 이동

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

## 📋 Phase 5: Audio Verification (5분)

### ✅ TC-005-1: Placement Test Audio (3개)

**Verification**:
- [ ] `placement_a2.mp3` 재생 성공
- [ ] `placement_b1.mp3` 재생 성공
- [ ] `placement_c1.mp3` 재생 성공
- [ ] 음질 acceptable (gTTS 기준)
- [ ] 404 에러 없음

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-005-2: Week 1-8 Listening Audio (샘플 8개)

**Steps**:
1. Week 1 Listening Activity 오디오 재생 확인 (이미 완료)
2. Week 2-8 중 2-3개 Week의 Listening Activity 샘플 테스트

**Verification**:
- [ ] Week 1 오디오 재생 성공
- [ ] Week 2 오디오 재생 성공 (샘플)
- [ ] Week 3 오디오 재생 성공 (샘플)
- [ ] 모든 오디오 404 에러 없음

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

## 📋 Phase 6: Error Handling (10분)

### ✅ TC-006-1: 네트워크 오류 (Offline)

**Steps**:
1. DevTools 열기 (F12)
2. Network 탭 → "Offline" 선택
3. Week 2 Vocabulary Activity 시작
4. 문제 풀고 "제출하기" 클릭
5. 에러 확인
6. Network → "Online" 복구
7. "다시 시도" 클릭

**Expected Results**:
- [ ] Toast 알림: "네트워크 연결을 확인해주세요"
- [ ] 자동 재시도 시도 (최대 3회, 지수 백오프)
- [ ] Online 복구 후 "다시 시도" 버튼으로 제출 성공
- [ ] Console에 에러 로그 적절하게 기록됨

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-006-2: 컴포넌트 렌더링 에러 (Error Boundary)

**Steps**:
1. DevTools Console 열기
2. 의도적으로 에러 발생 (테스트용 URL 접속)
   - 예: http://localhost:3008/dashboard/invalid-page

**Expected Results**:
- [ ] Global Error Boundary 페이지 표시
- [ ] 에러 메시지: "앗! 문제가 발생했습니다"
- [ ] "다시 시도" 버튼 표시
- [ ] "대시보드로 돌아가기" 버튼 표시
- [ ] Dev 모드: 에러 상세 정보 표시
- [ ] Production 모드: 사용자 친화적 메시지만 표시

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

## 📋 Phase 7: Cross-Browser Testing (15분)

### ✅ TC-007-1: Chrome 테스트

**Steps**:
1. Chrome 브라우저에서 모든 핵심 기능 재테스트
   - 로그인
   - Placement Test (Audio 재생 포함)
   - Week 1 Activity 1개

**Expected Results**:
- [ ] 모든 기능 정상 작동
- [ ] UI 레이아웃 정상
- [ ] Audio 재생 정상

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-007-2: Firefox 테스트 (선택사항)

**Steps**:
1. Firefox 브라우저 열기
2. http://localhost:3008 접속
3. 로그인 및 Placement Test Audio 재생 확인

**Expected Results**:
- [ ] 로그인 성공
- [ ] UI 레이아웃 정상 (Flexbox, Grid 호환성)
- [ ] Audio 재생 정상

**Pass/Fail**: ⬜ PASS / ⬜ FAIL / ⬜ SKIP

---

### ✅ TC-007-3: Safari 테스트 (macOS/iOS - 선택사항)

**Steps**:
1. Safari 브라우저 열기 (macOS 또는 iPhone)
2. http://localhost:3008 접속
3. Audio 재생 확인

**Expected Results**:
- [ ] 로그인 성공
- [ ] Audio 재생 정상 (Safari는 MP3 포맷 지원)
- [ ] UI 정상

**Pass/Fail**: ⬜ PASS / ⬜ FAIL / ⬜ SKIP

---

## 📋 Phase 8: Mobile Responsive Testing (10분)

### ✅ TC-008-1: iPhone (DevTools Responsive Mode)

**Steps**:
1. Chrome DevTools 열기 (F12)
2. Device Toolbar 토글 (Ctrl + Shift + M)
3. Device: iPhone SE (375x667) 선택
4. 페이지 새로고침
5. Dashboard 확인

**Expected Results**:
- [ ] Navigation 메뉴 → 햄버거 아이콘 (☰) 표시
- [ ] Week Progress Card 1열 레이아웃 (세로 스택)
- [ ] Activity 카드 터치 가능 (클릭 영역 충분)
- [ ] Audio controls 모바일 최적화
- [ ] 텍스트 가독성 (최소 16px)
- [ ] 버튼 크기 적절 (최소 44x44px)
- [ ] 스크롤 정상 작동

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-008-2: Android (Galaxy S20 - 360x640)

**Steps**:
1. DevTools Device: Galaxy S20 (360x640) 선택
2. Dashboard 및 Activity 페이지 확인

**Expected Results**:
- [ ] 모든 반응형 레이아웃 정상
- [ ] Touch events 정상 작동
- [ ] Audio 재생 정상

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

### ✅ TC-008-3: Tablet (iPad - 768x1024)

**Steps**:
1. DevTools Device: iPad (768x1024) 선택
2. Dashboard 확인

**Expected Results**:
- [ ] 2-column 레이아웃 (주요 콘텐츠 + 사이드바)
- [ ] Sidebar 표시
- [ ] 터치 및 스와이프 제스처 작동

**Pass/Fail**: ⬜ PASS / ⬜ FAIL

---

## 📊 Test Results Summary

### **Overall Status**

| Category | Total | Pass | Fail | Skip |
|----------|-------|------|------|------|
| Authentication | 4 | __ | __ | __ |
| Placement Test | 2 | __ | __ | __ |
| Week Learning | 7 | __ | __ | __ |
| Progress Tracking | 4 | __ | __ | __ |
| Audio Verification | 2 | __ | __ | __ |
| Error Handling | 2 | __ | __ | __ |
| Cross-Browser | 3 | __ | __ | __ |
| Mobile Responsive | 3 | __ | __ | __ |
| **TOTAL** | **27** | **__** | **__** | **__** |

### **Pass Rate**: ___%

---

## 🐛 Bugs Found

### **BUG-001: [제목]**
- **Priority**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
- **Category**: Authentication / Placement Test / Week Learning / Progress / Audio / Error / UI
- **재현 단계**:
  1. ...
- **예상 동작**: ...
- **실제 동작**: ...
- **스크린샷**: (첨부)
- **Console 에러**:
  ```
  (에러 로그 붙여넣기)
  ```
- **해결 방법**: ...

*(아직 버그 없음 - 테스트 중 발견 시 추가)*

---

## ✅ Production Readiness Checklist

테스트 완료 후 다음 조건 충족 여부 확인:

- [ ] Critical Tests 100% 통과
- [ ] High Priority Tests 90% 이상 통과
- [ ] 🔴 Critical 버그 0개
- [ ] 🟡 High 버그 2개 이하
- [ ] 모든 오디오 파일 재생 가능
- [ ] Chrome, Firefox, Safari 호환성 (최소 Chrome 필수)
- [ ] iPhone, Android 반응형 정상
- [ ] Firestore 데이터 구조 정확
- [ ] Progress Tracking 자동 업데이트 정상

**프로덕션 배포 승인**: ⬜ YES / ⬜ NO (조건부) / ⬜ NO (추가 작업 필요)

---

## 📝 Next Steps

### **If All Tests Pass (프로덕션 준비 완료)**:
1. `.env.local` → `.env.production` 설정 검증
2. Firebase Security Rules 배포
3. `npm run build` → 프로덕션 빌드
4. Vercel 또는 Firebase Hosting 배포
5. 프로덕션 환경에서 스모크 테스트

### **If Critical Bugs Found (긴급 수정 필요)**:
1. 버그 수정 작업 시작
2. 수정 후 회귀 테스트 (Regression Test)
3. 재배포

### **If Minor Issues Found (조건부 배포)**:
1. Minor 버그 Backlog에 추가
2. Week 1-8만 먼저 배포 (Elite Track 제외)
3. 사용자 피드백 수집 후 개선

---

**테스트 완료 시간**: ________
**테스터**: ________
**최종 결과**: ⬜ PASS / ⬜ FAIL
