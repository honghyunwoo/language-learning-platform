# 🚀 Manual Testing - START HERE

**개발 서버**: http://localhost:3008
**예상 소요 시간**: 95분 (1.5시간)

---

## ✅ 준비 완료 상태

- ✅ Next.js dev server 실행 중 (http://localhost:3008)
- ✅ 67개 오디오 파일 준비 완료
- ✅ 48개 Activity JSON 파일 준비 완료
- ✅ Test Plan 문서 작성 완료
- ✅ Manual Testing Guide 작성 완료

---

## 🎯 빠른 시작 (3단계)

### **Step 1: 브라우저 열기**
```
Chrome 브라우저에서 http://localhost:3008 접속
```

### **Step 2: 테스트 가이드 열기**
```
파일: .claude/testing/manual-testing-guide.md
(또는 이 폴더에서 확인)
```

### **Step 3: Phase별로 테스트 진행**
```
Phase 1: Authentication (15분)
Phase 2: Placement Test (10분)
Phase 3: Week Learning (20분)
Phase 4: Progress Tracking (10분)
Phase 5-8: Audio, Errors, Browser, Mobile (40분)
```

---

## 📋 간단 체크리스트 (핵심만)

### **Phase 1: Authentication** ✅
- [ ] 회원가입 (`test1@example.com` / `Test1234!`)
- [ ] 로그아웃 → 재로그인
- [ ] 잘못된 비밀번호 에러 확인

### **Phase 2: Placement Test** ✅
- [ ] 20문제 모두 응답
- [ ] 🔊 Audio 3개 재생 확인
- [ ] 결과 페이지 (CEFR 레벨 + 추천 Week)

### **Phase 3: Week Learning** ✅
- [ ] Week 1 Vocabulary (10문제)
- [ ] Week 1 Grammar (10문제)
- [ ] Week 1 Listening (🔊 Audio 재생)
- [ ] Week 1 Speaking (선택사항)
- [ ] Week 1 Reading (5문제)
- [ ] Week 1 Writing (텍스트 입력)
- [ ] Week 1 완료 → "완료" 배지 확인

### **Phase 4: Progress Tracking** ✅
- [ ] Firebase Console → Firestore 데이터 확인
  - `users/{uid}/progress/week-1/activities/*`
  - `users/{uid}/progress/week-1`
  - `users/{uid}/progressSummary`
- [ ] Dashboard → "Week 2 시작하기" 버튼 확인

### **Phase 5-8: 추가 테스트** ✅
- [ ] Audio 재생 (Placement + Week 1-8 샘플)
- [ ] 네트워크 오류 테스트 (DevTools Offline)
- [ ] Error Boundary 테스트
- [ ] Chrome, Firefox, Safari (선택)
- [ ] Mobile Responsive (DevTools → iPhone SE)

---

## 🔥 Critical Tests (필수)

이 5가지는 반드시 PASS 해야 프로덕션 배포 가능:

1. ✅ **회원가입/로그인** → Dashboard 접근
2. ✅ **Placement Test 완료** → CEFR 레벨 표시
3. ✅ **Week 1 Activity 1개 완료** → Progress 저장 확인
4. ✅ **Audio 재생** → Placement Test 오디오 3개
5. ✅ **Firestore 데이터** → Activity Progress 저장 확인

---

## 🐛 버그 발견 시

### **버그 리포트 작성**:
1. `.claude/testing/test-results.md` 파일 열기
2. "🐛 발견된 버그" 섹션에 추가:
   ```markdown
   ### **BUG-001: [간단한 제목]**
   - **Priority**: 🔴 Critical
   - **재현 단계**: 1. ... 2. ... 3. ...
   - **예상**: ...
   - **실제**: ...
   - **Console 에러**: (붙여넣기)
   ```

### **우선순위 기준**:
- 🔴 **Critical**: 핵심 기능 작동 안 함 (로그인, 제출 불가 등)
- 🟡 **High**: 중요 기능 문제 (Audio 재생 실패, Progress 저장 안 됨)
- 🟢 **Medium**: UI 버그, 사소한 기능 오류
- ⚪ **Low**: 디자인 개선, 편의 기능

---

## 📊 테스트 완료 후

### **All Tests Pass**:
```
✅ 프로덕션 준비 완료!

다음 단계:
1. npm run build (프로덕션 빌드)
2. Firebase Hosting 배포
3. 프로덕션 환경 스모크 테스트
```

### **Minor Bugs Found**:
```
🟡 조건부 배포 가능

Week 1-8 기본 커리큘럼만 먼저 배포
Elite Track (Week 9-16)은 Phase 2로 연기
사용자 피드백 수집 후 개선
```

### **Critical Bugs Found**:
```
🔴 긴급 수정 필요

버그 수정 작업 시작
수정 후 회귀 테스트 (Regression Test)
재배포
```

---

## 📁 관련 문서

- **상세 테스트 가이드**: `.claude/testing/manual-testing-guide.md` (400+ lines)
- **테스트 계획서**: `.claude/testing/test-plan.md` (311 lines)
- **테스트 결과**: `.claude/testing/test-results.md` (업데이트 예정)
- **Step 6 요약**: `.claude/testing/step-6-summary.md`

---

## 🆘 문제 해결

### **Q: 개발 서버가 실행 안 되면?**
```bash
cd language-learning-platform
npm run dev
```

### **Q: Audio 파일이 404 에러나면?**
```bash
# 오디오 파일 위치 확인
ls public/audio/*.mp3 | wc -l
# 67개 파일 있어야 함
```

### **Q: Firebase Console 접속 방법?**
```
https://console.firebase.google.com/
프로젝트 선택 → Firestore Database 탭
```

### **Q: DevTools 여는 방법?**
```
F12 (Windows/Linux)
Cmd + Option + I (Mac)
```

---

## 🎉 테스트 시작!

**준비됐으면 지금 바로 시작하세요**:

1. 브라우저에서 http://localhost:3008 열기
2. `.claude/testing/manual-testing-guide.md` 참고
3. Phase 1부터 순서대로 진행

**Good Luck! 화이팅!** 🚀
