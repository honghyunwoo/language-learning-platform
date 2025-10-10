# 마스터 플랜 Phase 2-3 (Week 9-24)

> 이 문서는 `MASTER_PLAN_6_MONTHS.md`의 연속입니다.

---

## 🎯 Phase 2: Business Validation & MVP Pivot (Week 9-16)

### 전제 조건 (Phase 1 결과)

**Phase 1 종료 시 확정된 사항**:
- ✅ 비즈니스 니치: **B1 면접 영어** (취업 준비생 20-30대)
- ✅ 차별화 포인트: 실전 면접 시뮬레이션 + AI 피드백
- ✅ 수익 모델: Freemium (무료 3회/월, 프리미엄 $5/월)
- ✅ 보안 기반: 치명적 취약점 해결 완료

### 목표

**측정 가능한 성과 지표**:
- ✅ MVP 핵심 기능 개발 완료 (면접 시뮬레이션 3종)
- ✅ 베타 테스터 50명 모집 + 활성 사용
- ✅ 전환율 5% 달성 (50명 중 2-3명 유료 전환)
- ✅ 테스트 커버리지: 10% → 25%
- ✅ 성능 개선 시작: 380KB → 280KB (1차 목표)

**시간 배분** (주 20시간 × 8주 = 160h):
- MVP 개발: 80h (50%)
- 베타 테스터 운영: 40h (25%)
- 테스트 확대: 24h (15%)
- 성능 최적화 1차: 16h (10%)

---

### Week 9-10: MVP 핵심 기능 개발 (면접 시뮬레이션)

#### 🎯 목표: B1 면접 영어 3가지 시나리오 구현

**시나리오 선정 근거** (Phase 1 인터뷰 결과):
1. **자기소개** (90% 요청) - "Tell me about yourself"
2. **경력 질문** (80% 요청) - "Why did you leave your last job?"
3. **상황 대처** (70% 요청) - "Tell me about a time when..."

---

#### 📋 Task 2.1: 면접 시뮬레이션 UI/UX 설계

- [ ] **Task 2.1.1**: 사용자 플로우 설계
  - 예상 시간: 4h
  - 의존성: 없음
  - 플로우:
    ```
    면접 선택 → 난이도 선택 (Easy/Medium/Hard)
    → 음성 녹음 (30-60초)
    → AI 분석 중 (10초)
    → 피드백 표시 (문법/발음/유창성/내용)
    → 다시 시도 / 다음 질문
    ```
  - 산출물: `docs/ux/interview-flow.md` + Figma 스케치

- [ ] **Task 2.1.2**: 면접 페이지 컴포넌트 구조
  - 예상 시간: 3h
  - 의존성: Task 2.1.1
  - 컴포넌트 트리:
    ```
    InterviewPage
    ├─ InterviewSelector (3가지 시나리오)
    ├─ DifficultySelector (Easy/Medium/Hard)
    ├─ VoiceRecorder (녹음 UI)
    ├─ AnalysisLoader (분석 중 애니메이션)
    └─ FeedbackPanel (4가지 피드백)
    ```
  - 산출물: `components/interview/` 디렉토리 생성

**예상 시간**: 7h

---

#### 📋 Task 2.2: 음성 녹음 기능 구현

- [ ] **Task 2.2.1**: Web Audio API 통합
  - 예상 시간: 5h
  - 의존성: Task 2.1.2
  - 기술:
    - `MediaRecorder` API (브라우저 네이티브)
    - 녹음 형식: WebM (Opus codec)
    - 최대 길이: 60초
    - 파일 크기: ~500KB
  - 컴포넌트: `components/interview/VoiceRecorder.tsx`
  - 에러 처리: 마이크 권한 거부, 브라우저 미지원

- [ ] **Task 2.2.2**: Firebase Storage 업로드
  - 예상 시간: 4h
  - 의존성: Task 2.2.1
  - 저장 경로: `/interviews/{userId}/{interviewId}/{timestamp}.webm`
  - 보안 규칙:
    ```javascript
    match /interviews/{userId}/{interviewId}/{file} {
      allow write: if request.auth.uid == userId
                   && request.resource.size < 1024 * 1024; // 1MB 제한
      allow read: if request.auth.uid == userId;
    }
    ```
  - 최적화: Resumable Upload (네트워크 끊김 대응)

- [ ] **Task 2.2.3**: 녹음 UI/UX 개선
  - 예상 시간: 3h
  - 의존성: Task 2.2.2
  - 기능:
    - 실시간 음성 파형 시각화 (Web Audio Analyser)
    - 타이머 표시 (60초 카운트다운)
    - 일시정지/재시작 버튼
    - 재녹음 버튼
  - 접근성: 키보드 단축키 (Space: 녹음/정지)

**예상 시간**: 12h

---

#### 📋 Task 2.3: AI 피드백 엔진 (OpenAI Whisper + GPT-4)

**중요 결정**: 외부 AI API 사용 (직접 모델 학습 X)
- 이유: 솔로 개발자, 시간/비용 효율
- 비용: Whisper ($0.006/분) + GPT-4 ($0.03/1K tokens)
- 예상: 50명 × 10회 = 500회 → $15/월 (감당 가능)

- [ ] **Task 2.3.1**: OpenAI API 설정
  - 예상 시간: 2h
  - 의존성: 없음
  - 작업:
    - OpenAI API 키 발급
    - `lib/ai/openai.ts` 초기화
    - 환경 변수 설정 (`.env.local`)
    - Rate limiting 설정 (Vercel Serverless 제한 고려)

- [ ] **Task 2.3.2**: 음성 → 텍스트 변환 (Whisper API)
  - 예상 시간: 4h
  - 의존성: Task 2.2.2, Task 2.3.1
  - API Route: `app/api/interview/transcribe/route.ts`
  - 입력: Firebase Storage URL
  - 출력: `{ text: string, confidence: number }`
  - 에러 처리: 음성 인식 실패 (재녹음 안내)

- [ ] **Task 2.3.3**: GPT-4 피드백 생성
  - 예상 시간: 6h
  - 의존성: Task 2.3.2
  - API Route: `app/api/interview/feedback/route.ts`
  - 프롬프트 엔지니어링:
    ```
    You are an English interview coach for B1 level Korean speakers.
    Analyze this interview answer and provide feedback on:
    1. Grammar (0-100): Identify 2-3 specific errors
    2. Pronunciation (0-100): Based on transcript confidence
    3. Fluency (0-100): Filler words, pauses
    4. Content (0-100): Relevance, structure

    Answer: "{transcribed_text}"
    Question: "{interview_question}"

    Output JSON:
    {
      "grammar": { "score": 85, "errors": ["..."] },
      "pronunciation": { "score": 70, "tips": ["..."] },
      "fluency": { "score": 90, "analysis": "..." },
      "content": { "score": 80, "suggestions": ["..."] }
    }
    ```
  - 캐싱: 동일 답변 재분석 방지 (Firestore 저장)

- [ ] **Task 2.3.4**: 피드백 UI 구현
  - 예상 시간: 5h
  - 의존성: Task 2.3.3
  - 컴포넌트: `components/interview/FeedbackPanel.tsx`
  - 표시:
    - 4가지 점수 (Radial Progress Chart)
    - 문법 오류 하이라이팅 (빨간색 밑줄)
    - 개선 제안 (구체적 문장 예시)
    - 다음 질문 추천
  - 저장: Firestore `/interviews/{userId}/{interviewId}/feedback`

**예상 시간**: 17h

---

#### 📋 Task 2.4: 3가지 면접 시나리오 콘텐츠 제작

- [ ] **Task 2.4.1**: 자기소개 시나리오 (10개 질문)
  - 예상 시간: 4h
  - 질문 예시:
    - Easy: "What is your name and where are you from?"
    - Medium: "Tell me about your educational background."
    - Hard: "Describe your career goals for the next 5 years."
  - 모범 답안 (Reference): 각 질문당 2개 (Good/Excellent)
  - 저장: `public/data/interviews/self-introduction.json`

- [ ] **Task 2.4.2**: 경력 질문 시나리오 (10개 질문)
  - 예상 시간: 4h
  - 질문 예시:
    - Easy: "What was your role at your last company?"
    - Medium: "Why did you leave your previous job?"
    - Hard: "How did you handle a conflict with a coworker?"

- [ ] **Task 2.4.3**: 상황 대처 시나리오 (10개 질문)
  - 예상 시간: 4h
  - 질문 예시:
    - Easy: "Tell me about a challenging project."
    - Medium: "Describe a time you failed and what you learned."
    - Hard: "How would you handle a tight deadline with limited resources?"

**예상 시간**: 12h

---

#### 📝 Week 9-10 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.1.1 사용자 플로우 | 4h | 🟡 High | ⏳ |
| 2.1.2 컴포넌트 구조 | 3h | 🟡 High | ⏳ |
| 2.2.1 Web Audio API | 5h | 🔴 Critical | ⏳ |
| 2.2.2 Firebase Storage | 4h | 🔴 Critical | ⏳ |
| 2.2.3 녹음 UI/UX | 3h | 🟡 High | ⏳ |
| 2.3.1 OpenAI 설정 | 2h | 🔴 Critical | ⏳ |
| 2.3.2 Whisper 연동 | 4h | 🔴 Critical | ⏳ |
| 2.3.3 GPT-4 피드백 | 6h | 🔴 Critical | ⏳ |
| 2.3.4 피드백 UI | 5h | 🟡 High | ⏳ |
| 2.4.1-3 시나리오 제작 | 12h | 🟡 High | ⏳ |

**총 예상 시간**: 48h
**실제 배정**: 40h (여유분 -8h → Week 11로 이월)

**Go/No-Go 기준**:
- ✅ 3가지 시나리오 중 1개 완성 (자기소개 우선)
- ✅ 음성 녹음 → AI 피드백 E2E 플로우 동작
- ⚠️ 만약 OpenAI API 비용 초과 → 대안: 무료 3회/월 제한 강화

---

### Week 11-12: MVP 완성 + 베타 테스터 모집

#### 📋 Task 2.5: 나머지 2개 시나리오 완성

- [ ] **Task 2.5.1**: 경력 질문 시나리오 구현
  - 예상 시간: 6h (Week 9-10 이월분 포함)
  - 의존성: Task 2.4.2
  - 작업: JSON 데이터 → UI 통합 → 테스트

- [ ] **Task 2.5.2**: 상황 대처 시나리오 구현
  - 예상 시간: 6h
  - 의존성: Task 2.4.3
  - 작업: JSON 데이터 → UI 통합 → 테스트

**예상 시간**: 12h

---

#### 📋 Task 2.6: Freemium 모델 구현

**무료 vs 프리미엄 기능**:

| 기능 | 무료 | 프리미엄 ($5/월) |
|------|------|------------------|
| 면접 시도 | 3회/월 | 무제한 |
| AI 피드백 | 기본 (4가지 점수만) | 상세 (문법 오류 상세, 발음 팁) |
| 시나리오 접근 | 자기소개만 | 3가지 모두 |
| 이전 기록 | 최근 5개 | 무제한 |

- [ ] **Task 2.6.1**: Firestore 사용량 추적
  - 예상 시간: 4h
  - 의존성: 없음
  - 작업:
    - `/users/{userId}/subscription` 문서 생성
    - 필드: `{ plan: 'free' | 'premium', interviewsThisMonth: 3, resetDate: Date }`
    - Hook: `useSubscription()` (React Query)

- [ ] **Task 2.6.2**: 결제 연동 (Stripe Checkout)
  - 예상 시간: 6h
  - 의존성: Task 2.6.1
  - 작업:
    - Stripe 계정 생성 (Test Mode)
    - `app/api/stripe/checkout/route.ts` (결제 세션 생성)
    - `app/api/stripe/webhook/route.ts` (결제 완료 Webhook)
    - Firestore 업데이트: `plan: 'premium'`
  - 테스트: Stripe Test Card (4242 4242 4242 4242)

- [ ] **Task 2.6.3**: 프리미엄 기능 잠금 UI
  - 예상 시간: 3h
  - 의존성: Task 2.6.1
  - 작업:
    - 무료 사용자: "3회 중 2회 남음" 표시
    - 제한 도달 시: "프리미엄 업그레이드" 모달
    - 프리미엄 사용자: 배지 표시 ("PRO" 아이콘)

**예상 시간**: 13h

---

#### 📋 Task 2.7: 베타 테스터 모집 (50명 목표)

- [ ] **Task 2.7.1**: 랜딩 페이지 제작
  - 예상 시간: 5h
  - 의존성: Task 2.5 완료 (MVP 완성)
  - 위치: `app/(marketing)/beta/page.tsx` (별도 레이아웃)
  - 내용:
    - 히어로: "B1 면접 영어, AI와 함께 연습하세요"
    - 데모 영상: 30초 (Loom 녹화)
    - 베타 신청 폼: 이메일 + 간단한 설문 (3문항)
    - CTA: "지금 무료로 시작하기"
  - 디자인: Tailwind + Shadcn/ui

- [ ] **Task 2.7.2**: 베타 신청 폼 처리
  - 예상 시간: 3h
  - 의존성: Task 2.7.1
  - API Route: `app/api/beta/signup/route.ts`
  - 저장: Firestore `/betaSignups/{email}`
  - 이메일: Firebase 이메일 발송 (승인 링크)
  - 목표: 100명 신청 → 50명 승인 (선착순)

- [ ] **Task 2.7.3**: 베타 테스터 모집 캠페인
  - 예상 시간: 6h
  - 의존성: Task 2.7.2
  - 채널:
    - Reddit (r/Korean, r/EnglishLearning): 베타 공지 포스팅
    - LinkedIn: 한국 취업 준비생 그룹 (5개)
    - 인크루트/사람인: 커뮤니티 게시판
    - 지인 네트워크: 카카오톡, 페이스북
  - 인센티브: 베타 테스터 1개월 무료 프리미엄 (선착순 50명)
  - 목표: Week 12 종료 시 50명 달성

**예상 시간**: 14h

---

#### 📝 Week 11-12 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.5.1-2 나머지 시나리오 | 12h | 🔴 Critical | ⏳ |
| 2.6.1 사용량 추적 | 4h | 🔴 Critical | ⏳ |
| 2.6.2 Stripe 연동 | 6h | 🔴 Critical | ⏳ |
| 2.6.3 프리미엄 UI | 3h | 🟡 High | ⏳ |
| 2.7.1 랜딩 페이지 | 5h | 🔴 Critical | ⏳ |
| 2.7.2 베타 폼 | 3h | 🔴 Critical | ⏳ |
| 2.7.3 모집 캠페인 | 6h | 🔴 Critical | ⏳ |

**총 예상 시간**: 39h
**실제 배정**: 40h

**Go/No-Go 기준**:
- ✅ MVP 3가지 시나리오 모두 완성
- ✅ Freemium 결제 동작 (Stripe Test Mode)
- ✅ 베타 신청 30명 이상 (50명 목표의 60%)
- ⚠️ 만약 신청 <20명 → Week 13 집중 모집 (개발 중단)

---

### Week 13-14: 베타 운영 + 피드백 수집

#### 📋 Task 2.8: 베타 테스터 온보딩

- [ ] **Task 2.8.1**: 온보딩 이메일 시퀀스
  - 예상 시간: 3h
  - 의존성: Task 2.7.2
  - 이메일 3부작:
    - Day 0: 환영 + 가이드 (시작하는 법)
    - Day 3: 첫 면접 독려 (10분이면 끝!)
    - Day 7: 피드백 요청 (설문조사 링크)
  - 도구: Firebase Email Triggers (Cloud Functions)

- [ ] **Task 2.8.2**: 베타 테스터 전용 채널
  - 예상 시간: 2h
  - 의존성: 없음
  - 플랫폼 선택:
    - Option A: Discord 서버 (실시간 소통)
    - Option B: 카카오톡 오픈채팅 (한국 사용자 친숙)
  - 결정: **카카오톡 오픈채팅** (타겟 사용자 20-30대 한국인)
  - 운영: 주 2회 공지, 버그 리포트 수집

**예상 시간**: 5h

---

#### 📋 Task 2.9: 사용 데이터 수집 + 분석

**목표**: 50명 × 2주 = 예상 100회 면접 시도

- [ ] **Task 2.9.1**: Analytics 설정 (Google Analytics 4)
  - 예상 시간: 3h
  - 의존성: 없음
  - 이벤트 추적:
    - `interview_start`: 시나리오 선택
    - `interview_complete`: 피드백 확인
    - `interview_abandon`: 중도 포기 (이탈 지점 분석)
    - `premium_view`: 프리미엄 모달 노출
    - `premium_click`: 결제 페이지 이동
    - `premium_purchase`: 결제 완료
  - 전환 퍼널: 시작 → 완료 → 프리미엄 뷰 → 구매

- [ ] **Task 2.9.2**: 주간 리포트 자동화
  - 예상 시간: 4h
  - 의존성: Task 2.9.1
  - 스크립트: `scripts/weekly-report.ts`
  - Firestore 쿼리:
    - 총 면접 시도 횟수
    - 평균 피드백 점수 (4가지)
    - 가장 인기 있는 시나리오
    - 프리미엄 전환율
  - 출력: `docs/beta/WEEK_{N}_REPORT.md` (자동 생성)
  - 일정: 매주 일요일 자동 실행 (GitHub Actions)

- [ ] **Task 2.9.3**: 사용자 행동 분석
  - 예상 시간: 5h
  - 의존성: Task 2.9.2 (2주 데이터 필요)
  - 분석 질문:
    - 이탈이 가장 많은 지점은? (녹음 시작 전? 피드백 확인 후?)
    - 평균 면접 완료 시간은? (목표: <5분)
    - 재방문율은? (Week 1 vs Week 2)
    - 프리미엄 전환 트리거는? (3회 제한 도달 후?)
  - 산출물: `docs/beta/USER_BEHAVIOR_ANALYSIS.md`

**예상 시간**: 12h

---

#### 📋 Task 2.10: 정성적 피드백 수집

- [ ] **Task 2.10.1**: 베타 테스터 설문조사 (NPS)
  - 예상 시간: 3h
  - 의존성: Week 14 시작 (베타 2주차)
  - 도구: Google Forms
  - 질문 (10문항, 5분 소요):
    - **NPS**: "친구에게 추천?" (0-10점)
    - "가장 유용한 기능은?"
    - "가장 개선이 필요한 부분은?"
    - "AI 피드백이 도움이 되었나요?" (1-5점)
    - "$5/월 지불 의향?" (매우 그렇다 ~ 전혀 아니다)
    - 자유 의견 (200자)
  - 인센티브: 설문 참여자 중 5명 추첨 (프리미엄 3개월 무료)
  - 목표 응답: 30명 (50명의 60%)

- [ ] **Task 2.10.2**: 1:1 심층 인터뷰 (5명)
  - 예상 시간: 8h
  - 의존성: Task 2.10.1
  - 대상 선정:
    - 활성 사용자 (5회 이상 면접): 2명
    - 이탈 사용자 (1회만 시도): 2명
    - 프리미엄 전환자: 1명
  - 질문 (45분):
    - "처음 사용했을 때 느낌은?"
    - "기대했던 것과 다른 점은?"
    - "경쟁 제품(Cambly, ELSA)과 비교하면?"
    - "어떤 상황에서 이 제품을 사용하나요?"
  - 기록: 녹화 + 전사 (Whisper API 활용)

**예상 시간**: 11h

---

#### 📝 Week 13-14 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.8.1 온보딩 이메일 | 3h | 🟡 High | ⏳ |
| 2.8.2 베타 채널 | 2h | 🟡 High | ⏳ |
| 2.9.1 Analytics 설정 | 3h | 🔴 Critical | ⏳ |
| 2.9.2 주간 리포트 | 4h | 🟡 High | ⏳ |
| 2.9.3 행동 분석 | 5h | 🔴 Critical | ⏳ |
| 2.10.1 NPS 설문 | 3h | 🔴 Critical | ⏳ |
| 2.10.2 1:1 인터뷰 | 8h | 🔴 Critical | ⏳ |

**총 예상 시간**: 28h
**실제 배정**: 40h (여유분 12h - 베타 테스터 지원에 사용)

**Go/No-Go 기준**:
- ✅ 베타 테스터 활성 30명 이상 (50명 중 60%)
- ✅ 총 면접 시도 50회 이상 (목표 100회의 50%)
- ✅ NPS 설문 응답 20명 이상
- ⚠️ **중요**: NPS 점수 ≥40 (Promoters - Detractors) → 계속 진행
- 🚨 만약 NPS <20 → 대규모 피봇 필요 (Phase 3 일정 조정)

---

### Week 15-16: 베타 피드백 반영 + Phase 2 마무리

#### 📋 Task 2.11: 베타 피드백 기반 개선 (Top 3)

**가정**: 베타 테스터 피드백 상위 3개 이슈 (예상)

- [ ] **Task 2.11.1**: 이슈 #1 수정 (예: 음성 인식 정확도 낮음)
  - 예상 시간: 6h
  - 대응:
    - Whisper API 언어 힌트 추가 (`language: 'en'`)
    - 녹음 품질 개선 (Sample Rate: 16kHz → 48kHz)
    - 배경 소음 필터링 (Web Audio Filters)

- [ ] **Task 2.11.2**: 이슈 #2 수정 (예: 피드백 너무 일반적)
  - 예상 시간: 6h
  - 대응:
    - GPT-4 프롬프트 개선 (구체적 예시 요청)
    - 문법 오류 하이라이팅 강화
    - 모범 답안 비교 기능 추가

- [ ] **Task 2.11.3**: 이슈 #3 수정 (예: UI 복잡함)
  - 예상 시간: 6h
  - 대응:
    - 온보딩 튜토리얼 추가 (첫 방문 시)
    - 버튼 배치 개선 (UX 리서치 기반)
    - 로딩 상태 개선 (Skeleton UI)

**예상 시간**: 18h

---

#### 📋 Task 2.12: 테스트 커버리지 확대 (10% → 25%)

**목표**: MVP 핵심 플로우 테스트 추가

- [ ] **Task 2.12.1**: 면접 플로우 E2E 테스트 (Playwright)
  - 예상 시간: 6h
  - 의존성: Task 2.5 완료
  - 시나리오:
    - 로그인 → 면접 선택 → 녹음 (mock) → 피드백 확인
  - 파일: `tests/e2e/interview-flow.spec.ts`
  - 커버리지: ~5% 추가

- [ ] **Task 2.12.2**: AI API 통합 테스트
  - 예상 시간: 5h
  - 대상:
    - `app/api/interview/transcribe` (Whisper Mock)
    - `app/api/interview/feedback` (GPT-4 Mock)
  - 도구: MSW (Mock Service Worker)
  - 커버리지: ~3% 추가

- [ ] **Task 2.12.3**: Freemium Hook 단위 테스트
  - 예상 시간: 4h
  - 대상: `hooks/useSubscription.ts`
  - 케이스:
    - 무료 사용자 제한 체크
    - 프리미엄 업그레이드 플로우
    - 월간 리셋 로직
  - 커버리지: ~2% 추가

**예상 시간**: 15h

**커버리지 목표**: 10% → 25% (15% 증가)

---

#### 📋 Task 2.13: Phase 2 회고 + Phase 3 준비

- [ ] **Task 2.13.1**: Phase 2 회고
  - 예상 시간: 2h
  - 질문:
    - MVP 개발에서 가장 어려웠던 점?
    - 베타 테스터 피드백 중 예상 밖이었던 것?
    - Phase 3에서 개선할 점?
  - 산출물: `docs/retrospective/PHASE_2.md`

- [ ] **Task 2.13.2**: Phase 3 계획 조정
  - 예상 시간: 3h
  - 작업:
    - 베타 데이터 기반 우선순위 재정렬
    - 성능 최적화 목표 조정 (실제 번들 크기 기준)
    - 테스트 전략 조정 (Critical Path 재정의)

**예상 시간**: 5h

---

#### 📝 Week 15-16 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 2.11.1-3 피드백 반영 | 18h | 🔴 Critical | ⏳ |
| 2.12.1 E2E 테스트 | 6h | 🟡 High | ⏳ |
| 2.12.2 API 테스트 | 5h | 🟡 High | ⏳ |
| 2.12.3 Hook 테스트 | 4h | 🟡 High | ⏳ |
| 2.13.1 회고 | 2h | 🟡 High | ⏳ |
| 2.13.2 Phase 3 조정 | 3h | 🟡 High | ⏳ |

**총 예상 시간**: 38h
**실제 배정**: 40h

**Phase 2 종료 Go/No-Go 기준**:
- ✅ MVP 3가지 시나리오 모두 안정화
- ✅ 베타 활성 사용자 30명 이상 유지
- ✅ 프리미엄 전환 2명 이상 (5% 목표)
- ✅ NPS 점수 ≥40
- ✅ 테스트 커버리지 22% 이상 (25% 목표의 88%)
- ⚠️ **중요 결정**: Phase 3 계속 진행 OR 피봇

---

## 📊 Phase 2 요약

### 시간 배분 (총 160h)

| Week | 주제 | 배정 시간 | 주요 산출물 |
|------|------|-----------|-------------|
| 9-10 | MVP 핵심 개발 | 40h | 면접 시뮬레이션 (1개 완성) |
| 11-12 | MVP 완성 + 모집 | 40h | 3가지 시나리오 + 50명 모집 |
| 13-14 | 베타 운영 + 분석 | 40h | 데이터 수집 + NPS 설문 |
| 15-16 | 피드백 반영 + 테스트 | 40h | 개선 3가지 + 25% 커버리지 |

### 측정 가능한 성과 지표 (Week 16 종료 시)

| 지표 | Week 8 | 목표 (Week 16) | 측정 방법 |
|------|--------|----------------|-----------|
| **MVP 기능** | 0개 | 3개 시나리오 | 수동 테스트 |
| **베타 테스터** | 0명 | 50명 (활성 30명) | Firestore 사용자 수 |
| **전환율** | 0% | 5% (2-3명 유료) | Stripe 결제 데이터 |
| **NPS 점수** | 알 수 없음 | ≥40 | Google Forms |
| **테스트 커버리지** | 10% | 25% | `npm run test:coverage` |
| **번들 크기** | 380KB | 280KB (1차) | Next.js Build 분석 |

---

## 🚀 Phase 3: Performance & Testing (Week 17-24)

### 목표

**측정 가능한 성과 지표**:
- ✅ 100명 활성 사용자 달성
- ✅ 프리미엄 전환율 5% 유지 (5명 유료)
- ✅ 테스트 커버리지: 25% → 40%
- ✅ 성능 최적화: 280KB → 190KB (최종 목표)
- ✅ Lighthouse 점수: 65 → 90
- ✅ 상용화 준비 완료 (프로덕션 체크리스트 100%)

**시간 배분** (주 20시간 × 8주 = 160h):
- 성능 최적화: 60h (37.5%)
- 테스트 확대: 50h (31.25%)
- 그로스 해킹: 30h (18.75%)
- 상용화 준비: 20h (12.5%)

---

### Week 17-18: 성능 최적화 (Phase 1)

#### 🎯 목표: 번들 크기 280KB → 220KB (20% 감소)

**전략**: Firebase SDK 모듈화 + Code Splitting

---

#### 📋 Task 3.1: Firebase SDK 모듈화

**현재 문제**: Firebase SDK 전체 import → 300KB

- [ ] **Task 3.1.1**: Firebase Modular Import 전환
  - 예상 시간: 6h
  - 영향 범위:
    - `lib/firebase/config.ts` (초기화)
    - 19개 파일 (import 구문 변경)
  - Before:
    ```typescript
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    ```
  - After:
    ```typescript
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, query } from 'firebase/firestore';
    ```
  - 예상 절감: 150KB (50%)

- [ ] **Task 3.1.2**: Tree-shaking 검증
  - 예상 시간: 2h
  - 도구: `@next/bundle-analyzer`
  - 작업: 번들 분석 → 미사용 Firebase 모듈 제거
  - 검증: Build 후 번들 크기 비교

**예상 시간**: 8h
**예상 절감**: 150KB

---

#### 📋 Task 3.2: Code Splitting (Dynamic Import)

**현재 문제**: 모든 Activity 컴포넌트가 초기 로드

- [ ] **Task 3.2.1**: Activity 컴포넌트 Dynamic Import
  - 예상 시간: 5h
  - 대상: 6개 Activity (Listening, Speaking, Reading, Writing, Grammar, Vocabulary)
  - Before:
    ```typescript
    import Listening from './activities/Listening';
    ```
  - After:
    ```typescript
    const Listening = dynamic(() => import('./activities/Listening'), {
      loading: () => <ActivitySkeleton />,
      ssr: false
    });
    ```
  - 예상 절감: 60KB (초기 로드에서 제외)

- [ ] **Task 3.2.2**: Route-based Code Splitting 검증
  - 예상 시간: 3h
  - 작업: Next.js App Router 자동 분할 확인
  - 최적화: 큰 페이지 분할 (`dashboard/community` → 별도 청크)

**예상 시간**: 8h
**예상 절감**: 60KB

**Week 17-18 총 예상 절감**: 210KB → 280KB - 210KB = **70KB 절감** (목표: 60KB)

---

#### 📋 Task 3.3: 이미지 최적화

- [ ] **Task 3.3.1**: Next.js Image 컴포넌트 전환
  - 예상 시간: 4h
  - 대상: 15개 이미지 (Activity 아이콘, 커뮤니티 썸네일)
  - Before: `<img src="/icon.png" />`
  - After: `<Image src="/icon.png" width={64} height={64} alt="..." />`
  - 효과: WebP 자동 변환, Lazy Loading

- [ ] **Task 3.3.2**: 미사용 이미지 제거
  - 예상 시간: 2h
  - 작업: `public/` 디렉토리 정리
  - 도구: `npx find-unused-exports`

**예상 시간**: 6h

---

#### 📋 Task 3.4: Lighthouse 측정 + 개선

- [ ] **Task 3.4.1**: Lighthouse CI 설정
  - 예상 시간: 3h
  - 도구: `@lhci/cli`
  - 작업:
    - `.lighthouserc.js` 설정
    - GitHub Actions 추가 (PR마다 자동 실행)
  - 목표: Performance 70 이상 유지

- [ ] **Task 3.4.2**: Core Web Vitals 개선
  - 예상 시간: 5h
  - 지표:
    - LCP (Largest Contentful Paint): <2.5s
    - FID (First Input Delay): <100ms
    - CLS (Cumulative Layout Shift): <0.1
  - 개선:
    - 폰트 preload (`<link rel="preload">`)
    - 이미지 크기 명시 (CLS 방지)

**예상 시간**: 8h

---

#### 📝 Week 17-18 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 3.1.1 Firebase 모듈화 | 6h | 🔴 Critical | ⏳ |
| 3.1.2 Tree-shaking | 2h | 🟡 High | ⏳ |
| 3.2.1 Dynamic Import | 5h | 🔴 Critical | ⏳ |
| 3.2.2 Route Splitting | 3h | 🟡 High | ⏳ |
| 3.3.1 Image 최적화 | 4h | 🟡 High | ⏳ |
| 3.3.2 미사용 이미지 제거 | 2h | 🟢 Low | ⏳ |
| 3.4.1 Lighthouse CI | 3h | 🟡 High | ⏳ |
| 3.4.2 Core Web Vitals | 5h | 🟡 High | ⏳ |

**총 예상 시간**: 30h
**실제 배정**: 40h (여유분 10h - 디버깅)

**Go/No-Go 기준**:
- ✅ 번들 크기 220KB 이하 달성
- ✅ Lighthouse Performance 75 이상
- ⚠️ 만약 목표 미달 → Week 19-20 추가 최적화

---

### Week 19-20: 성능 최적화 (Phase 2) + 테스트 확대

#### 📋 Task 3.5: 쿼리 최적화 (N+1 문제 해결)

**현재 문제**: 학습 일지 조회 시 중복 쿼리 (66% 낭비)

- [ ] **Task 3.5.1**: 통합 Hook 생성 (`useJournalData`)
  - 예상 시간: 4h
  - Before:
    ```typescript
    const entries = useJournalEntries(); // Query 1
    const weekly = useWeeklyProgress(); // Query 2 (Journal 재조회)
    const monthly = useMonthlyStats(); // Query 3 (Journal 재조회)
    ```
  - After:
    ```typescript
    const { entries, weeklyProgress, monthlyStats } = useJournalData();
    // 단일 쿼리 + 클라이언트 계산
    ```
  - 예상 절감: Firestore 비용 66%

- [ ] **Task 3.5.2**: React Query 캐싱 전략
  - 예상 시간: 3h
  - 설정:
    - `staleTime: 5 * 60 * 1000` (5분)
    - `cacheTime: 10 * 60 * 1000` (10분)
  - 효과: 불필요한 재조회 방지

**예상 시간**: 7h

---

#### 📋 Task 3.6: 테스트 커버리지 확대 (25% → 35%)

- [ ] **Task 3.6.1**: Hook 단위 테스트 (10개 Hook)
  - 예상 시간: 10h
  - 대상:
    - `hooks/useCommunity.ts` (7개 함수)
    - `hooks/useResources.ts` (4개 함수)
    - `hooks/useJournal.ts` (5개 함수)
    - `hooks/useActivities.ts` (3개 함수)
  - 커버리지: ~8% 추가

- [ ] **Task 3.6.2**: Component 통합 테스트 (주요 5개)
  - 예상 시간: 8h
  - 대상:
    - `components/interview/VoiceRecorder.tsx`
    - `components/interview/FeedbackPanel.tsx`
    - `components/community/PostCard.tsx`
    - `components/activities/ActivityCard.tsx`
    - `components/journal/JournalEntry.tsx`
  - 커버리지: ~2% 추가

**예상 시간**: 18h

---

#### 📋 Task 3.7: 그로스 해킹 (50명 → 75명)

**목표**: Week 20 종료 시 75명 활성 사용자

- [ ] **Task 3.7.1**: 추천 프로그램 구현
  - 예상 시간: 6h
  - 기능:
    - 추천 링크 생성 (`/invite/{referralCode}`)
    - 추천자/피추천자 보상 (1개월 프리미엄)
    - Firestore 추적: `/users/{userId}/referrals`
  - 예상 효과: +15명 (기존 50명 × 30% 추천율)

- [ ] **Task 3.7.2**: SEO 최적화
  - 예상 시간: 4h
  - 작업:
    - `app/layout.tsx` 메타 태그 (`og:image`, `description`)
    - `sitemap.xml`, `robots.txt` 생성
    - Google Search Console 등록
  - 예상 효과: +10명 (자연 유입)

**예상 시간**: 10h

---

#### 📝 Week 19-20 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 3.5.1 통합 Hook | 4h | 🔴 Critical | ⏳ |
| 3.5.2 캐싱 전략 | 3h | 🟡 High | ⏳ |
| 3.6.1 Hook 테스트 | 10h | 🟡 High | ⏳ |
| 3.6.2 Component 테스트 | 8h | 🟡 High | ⏳ |
| 3.7.1 추천 프로그램 | 6h | 🟡 High | ⏳ |
| 3.7.2 SEO 최적화 | 4h | 🟡 High | ⏳ |

**총 예상 시간**: 35h
**실제 배정**: 40h

**Go/No-Go 기준**:
- ✅ 테스트 커버리지 33% 이상 (35% 목표의 94%)
- ✅ 활성 사용자 70명 이상
- ✅ Firestore 비용 50% 절감 확인

---

### Week 21-22: 최종 성능 최적화 + 모니터링

#### 📋 Task 3.8: 최종 번들 최적화 (220KB → 190KB)

- [ ] **Task 3.8.1**: 의존성 분석 + 경량화
  - 예상 시간: 5h
  - 도구: `npx depcheck`
  - 작업:
    - 미사용 패키지 제거 (예: 중복 date 라이브러리)
    - 경량 대안 탐색 (moment.js → date-fns)
  - 예상 절감: 20KB

- [ ] **Task 3.8.2**: Brotli 압축 설정
  - 예상 시간: 2h
  - 작업: Vercel 자동 Brotli 검증
  - 효과: 추가 15% 압축 (실제 전송 크기)

**예상 시간**: 7h

---

#### 📋 Task 3.9: 모니터링 + 알림 시스템

**목표**: 프로덕션 에러 실시간 감지

- [ ] **Task 3.9.1**: Sentry 통합
  - 예상 시간: 4h
  - 작업:
    - `@sentry/nextjs` 설치
    - `sentry.client.config.ts`, `sentry.server.config.ts` 설정
    - Source Map 업로드 (디버깅용)
  - 알림: Slack/Discord Webhook
  - 예산: Free Tier (5K 이벤트/월)

- [ ] **Task 3.9.2**: 성능 모니터링 (Vercel Analytics)
  - 예상 시간: 2h
  - 작업: Vercel Dashboard 확인
  - 지표: Real User Monitoring (RUM)
    - 평균 로딩 시간
    - 에러율
    - 디바이스/브라우저 분포

- [ ] **Task 3.9.3**: Uptime 모니터링
  - 예상 시간: 2h
  - 도구: UptimeRobot (Free)
  - 설정: 5분마다 핑, 다운 시 이메일 알림

**예상 시간**: 8h

---

#### 📋 Task 3.10: 테스트 최종 확대 (35% → 40%)

- [ ] **Task 3.10.1**: E2E 테스트 추가 (Playwright)
  - 예상 시간: 10h
  - 시나리오 (3개):
    - 회원가입 → 첫 면접 → 피드백 확인
    - 무료 3회 소진 → 프리미엄 업그레이드
    - 커뮤니티 게시글 작성 → 댓글 달기
  - 커버리지: ~3% 추가

- [ ] **Task 3.10.2**: API Route 테스트
  - 예상 시간: 5h
  - 대상: 8개 API Route
    - `/api/interview/*` (3개)
    - `/api/community/*` (3개)
    - `/api/journal/*` (2개)
  - 커버리지: ~2% 추가

**예상 시간**: 15h

---

#### 📝 Week 21-22 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 3.8.1 의존성 경량화 | 5h | 🟡 High | ⏳ |
| 3.8.2 Brotli 압축 | 2h | 🟢 Low | ⏳ |
| 3.9.1 Sentry 통합 | 4h | 🔴 Critical | ⏳ |
| 3.9.2 Vercel Analytics | 2h | 🟡 High | ⏳ |
| 3.9.3 Uptime 모니터링 | 2h | 🟡 High | ⏳ |
| 3.10.1 E2E 테스트 | 10h | 🟡 High | ⏳ |
| 3.10.2 API 테스트 | 5h | 🟡 High | ⏳ |

**총 예상 시간**: 30h
**실제 배정**: 40h (여유분 10h)

**Go/No-Go 기준**:
- ✅ 번들 크기 195KB 이하 (190KB 목표의 97%)
- ✅ 테스트 커버리지 38% 이상
- ✅ Sentry 에러 트래킹 동작 확인

---

### Week 23-24: 상용화 준비 + 100명 달성

#### 🎯 최종 목표: 100명 활성 사용자 + 프로덕션 체크리스트 100%

---

#### 📋 Task 3.11: 그로스 최종 스퍼트 (75명 → 100명)

- [ ] **Task 3.11.1**: 콘텐츠 마케팅
  - 예상 시간: 6h
  - 채널:
    - Medium 블로그 포스트: "면접 영어 준비 완벽 가이드 (B1 레벨)"
    - YouTube 쇼츠: 30초 데모 영상 (5개)
    - LinkedIn: 성공 사례 포스팅 (베타 테스터 인터뷰)
  - 예상 효과: +15명

- [ ] **Task 3.11.2**: 파트너십 탐색
  - 예상 시간: 4h
  - 대상:
    - 대학교 취업 지원 센터 (3개 대학)
    - 영어 학습 커뮤니티 (Reddit, Facebook)
  - 제안: 학생 할인 (50% off, 1개월)
  - 예상 효과: +10명

**예상 시간**: 10h

---

#### 📋 Task 3.12: 프로덕션 체크리스트 완수

- [ ] **Task 3.12.1**: 보안 최종 점검
  - 예상 시간: 4h
  - 항목:
    - Firebase Rules 재검토
    - API Rate Limiting 확인
    - HTTPS 강제 (Vercel 자동)
    - 환경 변수 보안 (`.env.local` → Vercel Secrets)

- [ ] **Task 3.12.2**: 성능 최종 검증
  - 예상 시간: 3h
  - 지표:
    - Lighthouse: Performance 90+
    - Bundle: 190KB 이하
    - 첫 로딩: <2.5초 (LCP)

- [ ] **Task 3.12.3**: 법적 준비
  - 예상 시간: 5h
  - 문서:
    - 이용약관 (Terms of Service)
    - 개인정보 처리방침 (Privacy Policy)
    - 환불 정책 (Refund Policy)
  - 도구: Termly.io (무료 생성기)

- [ ] **Task 3.12.4**: 백업 + 재해 복구 계획
  - 예상 시간: 3h
  - 작업:
    - Firestore 자동 백업 설정 (일일)
    - Firebase Admin SDK 복구 스크립트
    - Vercel Rollback 절차 문서화

**예상 시간**: 15h

---

#### 📋 Task 3.13: 최종 회고 + 로드맵

- [ ] **Task 3.13.1**: 6개월 회고
  - 예상 시간: 3h
  - 질문:
    - 가장 큰 성취는?
    - 가장 어려웠던 순간은?
    - 처음 계획과 달라진 점은?
    - 다음 6개월 우선순위는?
  - 산출물: `docs/retrospective/6_MONTHS.md`

- [ ] **Task 3.13.2**: 향후 6개월 로드맵 초안
  - 예상 시간: 4h
  - 방향:
    - 추가 시나리오 (비즈니스 영어, 프레젠테이션)
    - 모바일 앱 (React Native)
    - B2B 진출 (기업 교육)
  - 산출물: `docs/ROADMAP_NEXT_6_MONTHS.md`

- [ ] **Task 3.13.3**: 상용화 공식 론칭 준비
  - 예상 시간: 5h
  - 작업:
    - 베타 해제 (Public 오픈)
    - Product Hunt 등록 준비
    - 론칭 이메일 작성 (100명 베타 테스터)
    - 소셜 미디어 공지 (LinkedIn, Reddit)

**예상 시간**: 12h

---

#### 📝 Week 23-24 체크리스트

| Task | 예상 시간 | 우선순위 | 상태 |
|------|-----------|----------|------|
| 3.11.1 콘텐츠 마케팅 | 6h | 🔴 Critical | ⏳ |
| 3.11.2 파트너십 | 4h | 🟡 High | ⏳ |
| 3.12.1 보안 점검 | 4h | 🔴 Critical | ⏳ |
| 3.12.2 성능 검증 | 3h | 🔴 Critical | ⏳ |
| 3.12.3 법적 준비 | 5h | 🔴 Critical | ⏳ |
| 3.12.4 백업 계획 | 3h | 🟡 High | ⏳ |
| 3.13.1 6개월 회고 | 3h | 🟡 High | ⏳ |
| 3.13.2 로드맵 초안 | 4h | 🟡 High | ⏳ |
| 3.13.3 론칭 준비 | 5h | 🔴 Critical | ⏳ |

**총 예상 시간**: 37h
**실제 배정**: 40h

**최종 Go/No-Go 기준 (상용화 준비)**:
- ✅ 100명 활성 사용자 달성 (또는 95명, 95%)
- ✅ 프리미엄 전환 5명 이상 (5% 유지)
- ✅ 테스트 커버리지 38% 이상 (40% 목표의 95%)
- ✅ Lighthouse Performance 88+ (90 목표의 97%)
- ✅ 번들 크기 195KB 이하
- ✅ 프로덕션 체크리스트 100% 완료
- ✅ 법적 문서 (이용약관, 개인정보) 준비 완료
- 🚀 **상용화 준비 완료!**

---

## 📊 Phase 3 요약

### 시간 배분 (총 160h)

| Week | 주제 | 배정 시간 | 주요 산출물 |
|------|------|-----------|-------------|
| 17-18 | 성능 최적화 1차 | 40h | 번들 280KB → 220KB |
| 19-20 | 최적화 2차 + 테스트 | 40h | 커버리지 25% → 35% |
| 21-22 | 모니터링 + 테스트 | 40h | Sentry 통합, 35% → 40% |
| 23-24 | 상용화 준비 + 100명 | 40h | 프로덕션 체크리스트 100% |

### 측정 가능한 성과 지표 (Week 24 종료 시)

| 지표 | Week 16 | 목표 (Week 24) | 측정 방법 |
|------|---------|----------------|-----------|
| **활성 사용자** | 50명 | 100명 | Firestore `/users` 활성 필터 |
| **프리미엄 전환** | 2-3명 (5%) | 5명 (5%) | Stripe 결제 데이터 |
| **테스트 커버리지** | 25% | 40% | `npm run test:coverage` |
| **번들 크기** | 280KB | 190KB | Next.js Build 분석 |
| **Lighthouse** | 75 | 90 | Lighthouse CI |
| **MRR (월 수익)** | $10-15 | $25 | Stripe Dashboard |
| **NPS 점수** | 40 | 50+ | 분기별 설문 |

---

**다음**: Part 3 (리스크 매트릭스, ADR, KPI)는 별도 파일로 작성합니다.

