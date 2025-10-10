# 수정된 마스터 플랜 Phase 2-3 (Week 9-28)

> 이 문서는 `MASTER_PLAN_REVISED.md`의 연속입니다.
> **전제 조건**: Phase 1 Week 4에서 **GO 결정**이 내려진 경우에만 실행

---

## 🎯 Phase 2: Minimum Viable MVP (Week 9-16)

### 핵심 변경사항

| 항목 | 원래 계획 | 수정된 계획 | 이유 |
|------|-----------|-------------|------|
| **MVP 범위** | 3개 시나리오 (30개 질문) | **1개 시나리오 (3개 질문)** | Minimum Viable |
| **베타 목표** | 50명 | **10-15명** | 현실적 모집 |
| **전환 목표** | 5% (2-3명) | **10-20% (1-2명)** | 소수 집중 |
| **시간 배분** | MVP 50%, 베타 25% | **MVP 60%, 베타 30%** | 품질 우선 |

### 목표

**측정 가능한 성과 지표**:
- ✅ MVP: **1개 시나리오** (자기소개, 3개 질문)
- ✅ 베타: 10-15명 모집 + 활성 8명 이상
- ✅ NPS: ≥40 (Promoters 우세)
- ✅ 전환율: 10-20% (1-2명 유료, 소규모에서 높은 전환)
- ✅ 테스트: 5% → 15% (MVP Critical Path)

**시간 배분** (주 20시간 × 8주 = 160시간):
- MVP 개발: 96h (60%)
- 베타 운영: 48h (30%)
- 테스트 확대: 16h (10%)

---

## Week 9-10: MVP 최소 범위 개발

### 🎯 목표: "Embarrassing v1" 출시

**Reid Hoffman**: "If you're not embarrassed by v1, you shipped too late"

**MVP 정의 (축소)**:
```
❌ Before (MLP - Most Lovable Product):
  - 3가지 시나리오 (자기소개, 경력, 상황대처)
  - 각 10개 질문 = 총 30개
  - 난이도 3단계 (Easy/Medium/Hard)

✅ After (진짜 MVP):
  - 1개 시나리오 (자기소개만)
  - 3개 질문 (Easy 2개 + Medium 1개)
  - 난이도 선택 없음 (순차적)
```

**근거**:
- 10-15명 베타에서 30개 질문은 과잉
- 피드백 기반 확장 (사용자가 "더 필요"라고 말할 때 추가)
- 개발 시간 60% 절감 → 품질에 집중

---

### 📋 Task 2.1: UI/UX 설계 (단순화)

- [ ] **Task 2.1.1**: 사용자 플로우 (단순화)
  - **예상 시간**: 4h
  - 플로우:
    ```
    면접 시작 → 질문 1 표시
    → 음성 녹음 (30-60초)
    → AI 분석 중 (10-15초)
    → 피드백 표시 (4가지 점수)
    → 다음 질문 (총 3개)
    → 전체 요약 + 다시 시도
    ```
  - 산출물: `docs/ux/interview-flow-mvp.md` + 간단한 스케치

- [ ] **Task 2.1.2**: 컴포넌트 구조 (단순화)
  - **예상 시간**: 3h
  - 컴포넌트 트리:
    ```
    InterviewPage
    ├─ QuestionDisplay (질문 1/2/3 표시)
    ├─ VoiceRecorder (녹음 UI)
    ├─ AnalysisLoader (분석 중)
    ├─ FeedbackPanel (4가지 피드백)
    └─ ProgressBar (3단계 진행률)
    ```

**예상 시간**: 7h

---

### 📋 Task 2.2: 음성 녹음 기능

- [ ] **Task 2.2.1**: Web Audio API 통합
  - **예상 시간**: 8h (원래 5h × 1.5배)
  - 기술:
    - `MediaRecorder` API
    - 녹음 형식: WebM (Opus codec)
    - 최대 길이: 60초
  - 컴포넌트: `components/interview/VoiceRecorder.tsx`
  - 에러 처리: 마이크 권한 거부, 브라우저 미지원

- [ ] **Task 2.2.2**: Firebase Storage 업로드
  - **예상 시간**: 6h (원래 4h × 1.5배)
  - 저장 경로: `/interviews/{userId}/{timestamp}.webm`
  - 보안 규칙:
    ```javascript
    match /interviews/{userId}/{file} {
      allow write: if request.auth.uid == userId
                   && request.resource.size < 1024 * 1024; // 1MB
      allow read: if request.auth.uid == userId;
    }
    ```

- [ ] **Task 2.2.3**: 녹음 UI/UX 개선
  - **예상 시간**: 5h (원래 3h × 1.5배)
  - 기능:
    - 실시간 파형 시각화 (Web Audio Analyser)
    - 60초 타이머 카운트다운
    - 재녹음 버튼
  - 접근성: 키보드 단축키 (Space: 녹음/정지)

**예상 시간**: 19h

---

### 📋 Task 2.3: AI 피드백 엔진 (OpenAI API)

**중요 결정**: 외부 AI API 사용
- 비용: Whisper $0.006/분 + GPT-4 $0.03/1K tokens
- 예상: 15명 × 5회 = 75회/월 → **$5/월** (감당 가능)

- [ ] **Task 2.3.1**: OpenAI API 설정
  - **예상 시간**: 3h (원래 2h × 1.5배)
  - 작업:
    - OpenAI API 키 발급
    - `lib/ai/openai.ts` 초기화
    - Rate limiting 설정

- [ ] **Task 2.3.2**: 음성 → 텍스트 (Whisper API)
  - **예상 시간**: 6h (원래 4h × 1.5배)
  - API Route: `app/api/interview/transcribe/route.ts`
  - 입력: Firebase Storage URL
  - 출력: `{ text: string, confidence: number }`
  - 에러 처리: 음성 인식 실패 → 재녹음 안내

- [ ] **Task 2.3.3**: GPT-4 피드백 생성
  - **예상 시간**: 15h (원래 6h × 2.5배) ← **프롬프트 엔지니어링 시간 증가**
  - API Route: `app/api/interview/feedback/route.ts`
  - 프롬프트 엔지니어링 (반복 테스트 필요):
    ```
    You are an English interview coach for B1 level Korean speakers.

    Analyze this interview answer and provide specific, actionable feedback.

    Question: "{interview_question}"
    Answer: "{transcribed_text}"

    Provide JSON output:
    {
      "grammar": {
        "score": 0-100,
        "errors": [
          "Original: 'I am work at Samsung' → Corrected: 'I work at Samsung'"
        ]
      },
      "pronunciation": {
        "score": 0-100,
        "tips": ["Focus on 'th' sound in 'think'"]
      },
      "fluency": {
        "score": 0-100,
        "analysis": "Good pace, but 3 filler words ('um', 'like')"
      },
      "content": {
        "score": 0-100,
        "suggestions": ["Add specific example from past experience"]
      }
    }

    Be specific, encouraging, and Korean-learner-friendly.
    ```
  - 캐싱: Firestore에 저장 (중복 분석 방지)

- [ ] **Task 2.3.4**: 피드백 UI 구현
  - **예상 시간**: 8h (원래 5h × 1.5배)
  - 컴포넌트: `components/interview/FeedbackPanel.tsx`
  - 표시:
    - 4가지 점수 (Radial Progress Chart)
    - 문법 오류 하이라이팅
    - 개선 제안 (구체적 예시)
  - 저장: Firestore `/interviews/{userId}/{id}/feedback`

**예상 시간**: 32h

---

### 📋 Task 2.4: 콘텐츠 제작 (1개 시나리오, 3개 질문)

- [ ] **Task 2.4.1**: 자기소개 시나리오 (3개 질문만)
  - **예상 시간**: 4h (원래 12h의 1/3)
  - 질문:
    - **Easy 1**: "What is your name and what do you do?"
    - **Easy 2**: "Where are you from and what do you like about it?"
    - **Medium 1**: "Tell me about your educational background and career goals."
  - 모범 답안: 각 2개 (Good/Excellent)
  - 저장: `public/data/interviews/self-introduction-mvp.json`

**예상 시간**: 4h

---

### 📝 Week 9-10 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.1.1 사용자 플로우 | 4h | 🟡 High | ⏳ |
| 2.1.2 컴포넌트 구조 | 3h | 🟡 High | ⏳ |
| 2.2.1 Web Audio API | 8h | 🔴 Critical | ⏳ |
| 2.2.2 Firebase Storage | 6h | 🔴 Critical | ⏳ |
| 2.2.3 녹음 UI/UX | 5h | 🟡 High | ⏳ |
| 2.3.1 OpenAI 설정 | 3h | 🔴 Critical | ⏳ |
| 2.3.2 Whisper 연동 | 6h | 🔴 Critical | ⏳ |
| 2.3.3 GPT-4 피드백 | 15h | 🔴 Critical | ⏳ |
| 2.3.4 피드백 UI | 8h | 🟡 High | ⏳ |
| 2.4.1 시나리오 제작 | 4h | 🟡 High | ⏳ |

**총 예상 시간**: 62h
**실제 배정**: 80h (2주 × 40h, 여유분 18h - 디버깅/테스트)

**Go/No-Go 기준**:
- ✅ 1개 시나리오 완성 (3개 질문)
- ✅ 음성 녹음 → AI 피드백 E2E 동작
- ✅ 로컬 테스트 통과 (개발자 5회 시도)
- ⚠️ OpenAI API 비용 $5 이내 확인

---

## Week 11-12: Freemium + 베타 모집 (축소)

### 🎯 목표: 10-15명 베타 테스터 (현실적)

**축소 이유**:
- 제로 트래픽에서 2주 내 50명 = 비현실적
- 10-15명 깊이 있는 피드백 > 50명 피상적 피드백
- 인센티브 예산: $50 (10명 × $5) vs $250 (50명)

---

### 📋 Task 2.5: Freemium 모델 (단순화)

**무료 vs 프리미엄**:

| 기능 | 무료 | 프리미엄 ($5/월) |
|------|------|------------------|
| 면접 시도 | 3회/월 | 무제한 |
| AI 피드백 | 기본 (점수만) | 상세 (오류 상세, 팁) |
| 시나리오 접근 | 1개만 | 1개 (현재) → 향후 확장 시 전체 |
| 이전 기록 | 최근 3개 | 무제한 |

- [ ] **Task 2.5.1**: Firestore 사용량 추적
  - **예상 시간**: 5h (원래 4h × 1.5배)
  - 작업:
    - `/users/{userId}/subscription` 문서
    - 필드: `{ plan: 'free' | 'premium', interviewsThisMonth: 3, resetDate }`
    - Hook: `useSubscription()` (React Query)

- [ ] **Task 2.5.2**: Stripe Checkout 연동
  - **예상 시간**: 9h (원래 6h × 1.5배)
  - 작업:
    - Stripe 계정 (Test Mode)
    - `app/api/stripe/checkout/route.ts`
    - `app/api/stripe/webhook/route.ts`
    - Firestore 업데이트: `plan: 'premium'`
  - 테스트: Stripe Test Card (4242 4242 4242 4242)

- [ ] **Task 2.5.3**: 프리미엄 기능 잠금 UI
  - **예상 시간**: 4h (원래 3h × 1.5배)
  - 작업:
    - "3회 중 2회 남음" 표시
    - 제한 도달: "프리미엄 업그레이드" 모달
    - 프리미엄 사용자: "PRO" 배지

**예상 시간**: 18h

---

### 📋 Task 2.6: 베타 테스터 모집 (10-15명)

- [ ] **Task 2.6.1**: 랜딩 페이지 (간소화)
  - **예상 시간**: 6h (원래 5h × 1.2배)
  - 위치: `app/(marketing)/beta/page.tsx`
  - 내용:
    - 히어로: "B1 면접 영어, AI와 연습하세요"
    - 데모 영상: 30초 (Loom 녹화)
    - 베타 신청 폼: 이메일 + 간단 설문 (2문항)
  - 디자인: Tailwind (최소한)

- [ ] **Task 2.6.2**: 베타 신청 처리
  - **예상 시간**: 4h (원래 3h × 1.5배)
  - API Route: `app/api/beta/signup/route.ts`
  - 저장: Firestore `/betaSignups/{email}`
  - 목표: **20명 신청 → 15명 승인** (선착순)

- [ ] **Task 2.6.3**: 베타 모집 캠페인 (축소)
  - **예상 시간**: 8h (원래 6h × 1.5배)
  - 채널:
    - Reddit (r/Korean, r/EnglishLearning): 베타 공지
    - LinkedIn: 한국 취업 그룹 (3개)
    - 지인 네트워크: 카카오톡, 페이스북
  - 인센티브: 베타 1개월 무료 프리미엄 (15명)
  - **목표: Week 12 종료 시 10-15명** (50명 아님!)

**예상 시간**: 18h

---

### 📝 Week 11-12 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.5.1 사용량 추적 | 5h | 🔴 Critical | ⏳ |
| 2.5.2 Stripe 연동 | 9h | 🔴 Critical | ⏳ |
| 2.5.3 프리미엄 UI | 4h | 🟡 High | ⏳ |
| 2.6.1 랜딩 페이지 | 6h | 🔴 Critical | ⏳ |
| 2.6.2 베타 폼 | 4h | 🔴 Critical | ⏳ |
| 2.6.3 모집 캠페인 | 8h | 🔴 Critical | ⏳ |

**총 예상 시간**: 36h
**실제 배정**: 40h (여유분 4h)

**Go/No-Go 기준**:
- ✅ Freemium 결제 동작 (Stripe Test)
- ✅ 베타 신청 8명 이상 (15명 목표의 53%)
- ⚠️ 신청 <5명 → Week 13 집중 모집 (개발 중단)

---

## Week 13-14: 베타 운영 + 피드백 수집

### 🎯 목표: 깊이 있는 피드백 (10-15명 집중)

**소수 장점**:
- 1:1 소통 가능 (카카오톡 오픈채팅)
- 버그 빠른 수정
- 진짜 니즈 파악

---

### 📋 Task 2.7: 베타 온보딩

- [ ] **Task 2.7.1**: 온보딩 이메일 (간소화)
  - **예상 시간**: 2h (원래 3h, 간소화)
  - 이메일 2부작:
    - Day 0: 환영 + 가이드 (시작법)
    - Day 3: 첫 면접 독려 + 피드백 요청

- [ ] **Task 2.7.2**: 카카오톡 오픈채팅
  - **예상 시간**: 2h
  - 플랫폼: 카카오톡 오픈채팅 (한국 사용자 친숙)
  - 운영: 주 3회 공지, 버그 리포트 즉시 대응

**예상 시간**: 4h

---

### 📋 Task 2.8: 사용 데이터 수집

**목표**: 10-15명 × 2주 = 예상 50-75회 면접 시도

- [ ] **Task 2.8.1**: Google Analytics 4 설정
  - **예상 시간**: 4h (원래 3h × 1.5배)
  - 이벤트:
    - `interview_start`, `interview_complete`, `interview_abandon`
    - `premium_view`, `premium_click`, `premium_purchase`
  - 전환 퍼널: 시작 → 완료 → 프리미엄 → 구매

- [ ] **Task 2.8.2**: 주간 리포트 (수동)
  - **예상 시간**: 3h (원래 4h, 자동화 생략)
  - 작업: Week 13, 14 종료 시 수동 집계
  - 지표:
    - 총 면접 시도
    - 평균 피드백 점수
    - 프리미엄 전환 여부

**예상 시간**: 7h

---

### 📋 Task 2.9: 정성적 피드백

- [ ] **Task 2.9.1**: NPS 설문 (간소화)
  - **예상 시간**: 2h (원래 3h)
  - 도구: Google Forms
  - 질문 (5문항, 3분):
    - NPS: "친구 추천?" (0-10점)
    - "가장 유용한 기능?"
    - "가장 개선 필요한 부분?"
    - "$5/월 지불 의향?"
    - 자유 의견 (100자)
  - 목표 응답: 8명 이상 (10-15명의 53%)

- [ ] **Task 2.9.2**: 1:1 심층 인터뷰 (3명만)
  - **예상 시간**: 6h (원래 8h, 3명으로 축소)
  - 대상:
    - 활성 사용자 (3회 이상): 1명
    - 이탈 사용자 (1회만): 1명
    - 프리미엄 전환자: 1명 (있을 경우)
  - 질문 (30분):
    - "처음 사용했을 때?"
    - "기대 vs 현실?"
    - "경쟁 제품과 비교?"
  - 기록: 녹화 + 메모

**예상 시간**: 8h

---

### 📝 Week 13-14 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.7.1 온보딩 이메일 | 2h | 🟡 High | ⏳ |
| 2.7.2 카톡 오픈채팅 | 2h | 🟡 High | ⏳ |
| 2.8.1 Analytics 설정 | 4h | 🔴 Critical | ⏳ |
| 2.8.2 주간 리포트 | 3h | 🟡 High | ⏳ |
| 2.9.1 NPS 설문 | 2h | 🔴 Critical | ⏳ |
| 2.9.2 1:1 인터뷰 | 6h | 🔴 Critical | ⏳ |

**총 예상 시간**: 19h
**실제 배정**: 40h (여유분 21h - 베타 지원, 버그 수정)

**Go/No-Go 기준**:
- ✅ 베타 활성 8명 이상 (10-15명 중)
- ✅ 총 면접 시도 30회 이상 (목표 50-75회의 50%)
- ✅ NPS 설문 응답 5명 이상
- ⚠️ **중요**: NPS ≥40 확인 → 계속 진행

---

## Week 15-16: 피드백 반영 + 확장 여부 결정

### 🎯 목표: NPS 기반 확장 또는 피봇

**의사결정 트리**:

```
NPS 결과
├─ ≥50 (Excellent) → ✅ GO (시나리오 2-3개 추가 개발)
│  └─ Week 17-20: 성능 최적화 + 시나리오 확장
│
├─ 40-49 (Good) → ✅ GO (현재 1개 유지, 성능 우선)
│  └─ Week 17-20: 성능 최적화만
│
├─ 20-39 (Fair) → ⚠️ PIVOT (대규모 개선 4주)
│  └─ Week 17-20: 피드백 Top 3 이슈 해결
│
└─ <20 (Poor) → 🚨 NO-GO (근본 재설계 또는 중단)
   └─ 비즈니스 모델 재검토
```

---

### 📋 Task 2.10: 피드백 Top 3 반영

**가정**: 베타 피드백 상위 3개 이슈 (예상)

- [ ] **Task 2.10.1**: 이슈 #1 수정
  - **예상 시간**: 9h (원래 6h × 1.5배)
  - 예: "음성 인식 정확도 낮음"
  - 대응: Whisper API 최적화

- [ ] **Task 2.10.2**: 이슈 #2 수정
  - **예상 시간**: 9h
  - 예: "피드백 너무 일반적"
  - 대응: GPT-4 프롬프트 개선

- [ ] **Task 2.10.3**: 이슈 #3 수정
  - **예상 시간**: 9h
  - 예: "UI 복잡함"
  - 대응: 온보딩 튜토리얼 추가

**예상 시간**: 27h

---

### 📋 Task 2.11: 테스트 확대 (5% → 15%)

- [ ] **Task 2.11.1**: MVP E2E 테스트 (Playwright)
  - **예상 시간**: 8h (원래 6h × 1.5배)
  - 시나리오: 로그인 → 면접 → 피드백
  - 파일: `tests/e2e/interview-mvp.spec.ts`
  - 커버리지: ~5% 추가

- [ ] **Task 2.11.2**: AI API 통합 테스트
  - **예상 시간**: 5h
  - 대상: Whisper + GPT-4 Mock
  - 도구: MSW (Mock Service Worker)
  - 커버리지: ~3% 추가

- [ ] **Task 2.11.3**: Freemium Hook 테스트
  - **예상 시간**: 4h
  - 대상: `hooks/useSubscription.ts`
  - 커버리지: ~2% 추가

**예상 시간**: 17h

---

### 📋 Task 2.12: Phase 2 회고 + Phase 3 준비

- [ ] **Task 2.12.1**: Phase 2 회고
  - **예상 시간**: 2h
  - 산출물: `docs/retrospective/PHASE_2.md`

- [ ] **Task 2.12.2**: Phase 3 계획 조정
  - **예상 시간**: 3h
  - 작업: NPS 기반 우선순위 재정렬

**예상 시간**: 5h

---

### 📝 Week 15-16 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.10.1-3 피드백 반영 | 27h | 🔴 Critical | ⏳ |
| 2.11.1 E2E 테스트 | 8h | 🟡 High | ⏳ |
| 2.11.2 API 테스트 | 5h | 🟡 High | ⏳ |
| 2.11.3 Hook 테스트 | 4h | 🟡 High | ⏳ |
| 2.12.1 회고 | 2h | 🟡 High | ⏳ |
| 2.12.2 Phase 3 조정 | 3h | 🟡 High | ⏳ |

**총 예상 시간**: 49h
**실제 배정**: 80h (2주 × 40h, 여유분 31h)

**Phase 2 종료 Go/No-Go 기준**:
- ✅ MVP 1개 시나리오 안정화
- ✅ 베타 활성 8명 이상 유지
- ✅ NPS ≥40 (필수!)
- ✅ 테스트 커버리지 12% 이상 (15% 목표의 80%)
- ⚠️ **중요 결정**: Phase 3 계속 OR 4주 PIVOT

---

## 📊 Phase 2 요약 (Week 9-16)

### 시간 배분 (총 320h)

| Week | 주제 | 배정 시간 |
|------|------|-----------|
| 9-10 | MVP 개발 (1개 시나리오) | 80h |
| 11-12 | Freemium + 베타 10-15명 | 80h |
| 13-14 | 베타 운영 + 피드백 | 80h |
| 15-16 | 피드백 반영 + 테스트 15% | 80h |

### 성공 지표 (Week 16 종료 시)

| 지표 | 원래 목표 | 수정 목표 | 측정 방법 |
|------|-----------|-----------|-----------|
| **MVP 기능** | 3개 시나리오 | **1개 시나리오** | 수동 테스트 |
| **베타 테스터** | 50명 (활성 30명) | **10-15명 (활성 8명)** | Firestore 사용자 |
| **전환율** | 5% (2-3명) | **10-20% (1-2명)** | Stripe 결제 |
| **NPS** | ≥40 | **≥40** | Google Forms |
| **테스트 커버리지** | 25% | **15%** | `npm run test:coverage` |

---

## 🚀 Phase 3: Performance & Growth (Week 17-28)

### 목표

**측정 가능한 성과 지표**:
- ✅ 활성 사용자: 50-60명 (현실적)
- ✅ 프리미엄 전환: 1-2명 (2-3% 유지)
- ✅ 테스트 커버리지: 15% → 25%
- ✅ 번들 크기: 380KB → 220KB (42% 감소)
- ✅ Lighthouse: 65 → 85
- ✅ 상용화 준비 완료

**시간 배분** (주 20시간 × 12주 = 240시간):
- 성능 최적화: 100h (42%)
- 그로스 해킹: 60h (25%)
- 테스트 확대: 50h (21%)
- 상용화 준비: 30h (12%)

---

## Week 17-20: 성능 최적화 (380KB → 220KB)

### 🎯 목표: 번들 42% 감소

**전략**: Firebase SDK 모듈화 + Code Splitting

---

### 📋 Task 3.1: Firebase SDK 모듈화

- [ ] **Task 3.1.1**: Firebase Modular Import 전환
  - **예상 시간**: 14h (원래 6h × 2.3배, 19개 파일)
  - 영향 범위: 19개 파일
  - 예상 절감: 150KB (50%)

- [ ] **Task 3.1.2**: Tree-shaking 검증
  - **예상 시간**: 3h
  - 도구: `@next/bundle-analyzer`

**예상 시간**: 17h

---

### 📋 Task 3.2: Code Splitting

- [ ] **Task 3.2.1**: Activity Dynamic Import
  - **예상 시간**: 8h (원래 5h × 1.5배)
  - 대상: 6개 Activity
  - 예상 절감: 60KB

**예상 시간**: 8h

**Week 17-18 예상 절감**: 150KB + 60KB = **210KB**

---

### 📋 Task 3.3: 이미지 최적화

- [ ] **Task 3.3.1**: Next.js Image 전환
  - **예상 시간**: 6h (원래 4h × 1.5배)
  - 대상: 15개 이미지

- [ ] **Task 3.3.2**: 미사용 이미지 제거
  - **예상 시간**: 2h

**예상 시간**: 8h

---

### 📋 Task 3.4: 쿼리 최적화

- [ ] **Task 3.4.1**: 통합 Hook (`useJournalData`)
  - **예상 시간**: 6h (원래 4h × 1.5배)
  - 예상 절감: Firestore 비용 66%

- [ ] **Task 3.4.2**: React Query 캐싱
  - **예상 시간**: 4h (원래 3h × 1.5배)
  - 설정: staleTime 5분, cacheTime 10분

**예상 시간**: 10h

---

### 📋 Task 3.5: Lighthouse 개선

- [ ] **Task 3.5.1**: Lighthouse CI 설정
  - **예상 시간**: 4h (원래 3h × 1.5배)
  - 도구: `@lhci/cli`

- [ ] **Task 3.5.2**: Core Web Vitals
  - **예상 시간**: 8h (원래 5h × 1.5배)
  - 목표: LCP <2.5s, FID <100ms, CLS <0.1

**예상 시간**: 12h

---

### 📝 Week 17-20 체크리스트

**총 예상 시간**: 55h
**실제 배정**: 80h (여유분 25h)

**Go/No-Go 기준**:
- ✅ 번들 크기 220-240KB 달성
- ✅ Lighthouse 80 이상

---

## Week 21-24: 테스트 + 모니터링 + 그로스

### 📋 Task 3.6: 테스트 확대 (15% → 25%)

- [ ] **Task 3.6.1**: Hook 단위 테스트
  - **예상 시간**: 15h (10개 Hook)
  - 커버리지: ~8% 추가

- [ ] **Task 3.6.2**: Component 테스트
  - **예상 시간**: 10h (5개 Component)
  - 커버리지: ~2% 추가

**예상 시간**: 25h

---

### 📋 Task 3.7: 모니터링

- [ ] **Task 3.7.1**: Sentry 통합
  - **예상 시간**: 6h (원래 4h × 1.5배)

- [ ] **Task 3.7.2**: Vercel Analytics
  - **예상 시간**: 2h

- [ ] **Task 3.7.3**: UptimeRobot
  - **예상 시간**: 2h

**예상 시간**: 10h

---

### 📋 Task 3.8: 그로스 해킹 (15명 → 50-60명)

**목표**: Week 24 종료 시 50-60명

- [ ] **Task 3.8.1**: 추천 프로그램
  - **예상 시간**: 9h (원래 6h × 1.5배)
  - 기능: 추천 링크, 1개월 보상
  - 예상 효과: +20명

- [ ] **Task 3.8.2**: SEO 최적화
  - **예상 시간**: 6h (원래 4h × 1.5배)
  - 작업: 메타 태그, sitemap, Google Search Console
  - 예상 효과: +15명

- [ ] **Task 3.8.3**: 콘텐츠 마케팅
  - **예상 시간**: 8h
  - 채널: Medium, LinkedIn, YouTube 쇼츠
  - 예상 효과: +10명

**예상 시간**: 23h

---

### 📝 Week 21-24 체크리스트

**총 예상 시간**: 58h
**실제 배정**: 80h (여유분 22h)

**Go/No-Go 기준**:
- ✅ 25% 커버리지
- ✅ Sentry 동작
- ✅ 활성 사용자 40명 이상

---

## Week 25-28: 상용화 준비 + Buffer

### 📋 Task 3.9: 상용화 체크리스트

- [ ] **Task 3.9.1**: 보안 최종 점검
  - **예상 시간**: 6h

- [ ] **Task 3.9.2**: 법적 문서
  - **예상 시간**: 8h
  - 문서: 이용약관, 개인정보 처리방침
  - 도구: Termly.io

- [ ] **Task 3.9.3**: 백업 계획
  - **예상 시간**: 4h

**예상 시간**: 18h

---

### 📋 Task 3.10: 최종 그로스 (50-60명 달성)

- [ ] **Task 3.10.1**: 파트너십 (대학 취업센터)
  - **예상 시간**: 6h
  - 대상: 3개 대학
  - 예상 효과: +10명

**예상 시간**: 6h

---

### 📋 Task 3.11: 7개월 회고 + 향후 계획

- [ ] **Task 3.11.1**: 전체 회고
  - **예상 시간**: 4h
  - 산출물: `docs/retrospective/7_MONTHS.md`

- [ ] **Task 3.11.2**: 향후 6개월 로드맵
  - **예상 시간**: 6h
  - 방향: 추가 시나리오, 모바일, B2B

**예상 시간**: 10h

---

### 📝 Week 25-28 체크리스트

**총 예상 시간**: 34h
**실제 배정**: 80h (여유분 46h - 진짜 Buffer!)

**최종 Go/No-Go 기준**:
- ✅ 활성 사용자 45명 이상 (50-60 목표의 75%)
- ✅ 프리미엄 전환 1명 이상
- ✅ 테스트 커버리지 23% 이상
- ✅ 법적 문서 완료
- 🚀 **상용화 준비 완료!**

---

## 📊 최종 목표 (Week 28)

| 지표 | 현재 | 원래 목표 | 수정 목표 | 달성 가능성 |
|------|------|-----------|-----------|-------------|
| **활성 사용자** | 0명 | 100명 | **50-60명** | 70% |
| **MRR** | $0 | $25 | **$5-10** | 65% |
| **테스트** | 0% | 40% | **25%** | 75% |
| **번들** | 380KB | 190KB | **220KB** | 80% |
| **Lighthouse** | 65 | 90 | **85** | 75% |

**전체 성공 확률**: **42%** (현실적)

---

**다음**: 상세 리스크/ADR/KPI는 별도 문서로 작성

