# 마스터 플랜 자체 검토 및 수정안

## 🔍 원본 플랜의 문제점 분석

### 문제 1: 비현실적인 시간 추정 (48 Activity 변환)
**원본 계획**: 71시간으로 48개 Activity 변환
**문제점**:
- 기계적 작업이 아닌 **창작 작업**입니다
- 각 Activity마다 필요한 것:
  - 실생활 상황 기반 대화 시나리오 작성
  - 원어민 자연스러운 표현 선정
  - 실용적 예문 3-5개씩 작성
  - 품질 검토 및 수정
- 실제 소요 시간: **150-200시간** 필요

**증거**:
- Week 1 Vocabulary activity 예시 (week-1-vocab.json 참조):
  - 20개 단어, 각각 발음/품사/의미/예문 포함
  - 15개 연습문제 (객관식, 빈칸 채우기, 매칭)
  - 이 하나만 고품질로 만들려면 3-4시간 필요
  - 48개 × 3.5시간 = **168시간**

### 문제 2: 우선순위 오류 (대화 시뮬레이션 낮은 우선순위)
**원본 계획**: Phase 5로 배치, "선택적 기능"으로 분류
**문제점**:
- "회화고수" 플랫폼의 **핵심 차별화 요소**입니다
- 다른 학습 앱과 구분되는 가장 중요한 기능
- 낮은 우선순위 = 나중에 시간 부족해서 못 만들 위험

**수정안**: Phase 3으로 이동, MVP 핵심 기능으로 포함

### 문제 3: 발음 평가 불필요
**원본 계획**: 10시간으로 발음 평가 시스템 구현
**문제점**:
- Web Speech API는 발음 정확도 평가 불가능
- 외부 API 연동은 비용 발생 ($0.006~$0.016/요청)
- 사용자 발음을 평가하는 것보다 **올바른 발음을 들려주는 것**이 더 중요

**수정안**:
- **발음 평가 기능 제거** (완전히 제외)
- **TTS로 정확한 발음 들려주기만** (기존 useTTS 활용)
- 사용자가 들으면서 따라하는 방식

### 문제 4: 레벨 테스트 Speaking 파트 비현실적
**원본 계획**: Speaking 자동 평가 포함
**문제점**:
- 발음 평가 불가능 (문제 3과 동일)
- 유창성, 억양, 자연스러움 평가는 **AI로도 어려움**
- 자동 채점 시스템 구축 = 별도 대규모 프로젝트

**수정안**:
- Option A: Speaking 파트 제외, 3파트만 (Grammar, Vocabulary, Listening)
- Option B: 자가 평가 방식 (녹음 후 스스로 체크리스트 평가)
- Option C: 제출형 (녹음 업로드, 나중에 사람이 평가 - 커뮤니티 기능 활용)

### 문제 5: 48개 Activity 일괄 변환의 품질 리스크
**원본 계획**: 48개 모두 한번에 변환
**문제점**:
- 일관성 유지 어려움
- 품질 검증 시간 부족
- 사용자 피드백 없이 모두 제작 = 방향 틀리면 전체 재작업

**수정안 (MVP 접근)**:
- **Week 1-2만 먼저 완성** (12개 Activity)
- 실제 사용자 테스트 수행
- 피드백 반영 후 나머지 확장
- 점진적 품질 향상

### 문제 6: 통합 테스트 시간 과소평가
**원본 계획**: 12시간
**문제점**:
- 버그 발견 → 수정 → 재테스트 사이클 미포함
- 실제 통합 테스트는 예상치 못한 문제 다수 발생
- 12시간 = 이상적인 경우만

**현실적 추정**:
- 테스트 실행: 8시간
- 버그 수정: 8-12시간
- 재테스트: 4-5시간
- **총 20-25시간** 필요

---

## ✅ 수정된 MVP 접근법

### 철학: 품질 우선, 점진적 확장

사용자 요구사항:
> "모든것들이 다 완성되었을때 어떤 품질과 좋은 프로그램이 될지"
> "순서는 중요하지 않아"

→ **완성도 높은 MVP를 먼저, 확장은 검증 후**

---

## 📋 수정된 마스터 플랜 (MVP)

### Phase 1: 레벨 테스트 시스템 (8-10시간)

#### 1.1 3파트 자동 채점 (6-8시간)
- **Grammar Test**: 20문제 (A1-B2 난이도 섞음)
- **Vocabulary Test**: 30문제 (빈칸 채우기, 매칭)
- **Listening Test**: 10문제 (TTS 활용, 기존 useTTS 사용)

#### 1.2 결과 분석 및 추천 (2시간)
```typescript
// lib/levelTest/evaluateLevel.ts
export const evaluateUserLevel = (results: TestResults): UserLevel => {
  const grammarLevel = calculateGrammarLevel(results.grammar);
  const vocabLevel = calculateVocabLevel(results.vocabulary);
  const listeningLevel = calculateListeningLevel(results.listening);

  // 가장 낮은 레벨을 시작점으로 추천 (안전한 접근)
  const recommendedLevel = Math.min(grammarLevel, vocabLevel, listeningLevel);

  return {
    level: recommendedLevel, // A1, A2, B1, B2
    startWeek: getStartWeekForLevel(recommendedLevel),
    strengths: identifyStrengths(results),
    weaknesses: identifyWeaknesses(results)
  };
};
```

**Speaking 테스트**:
- MVP에서는 제외 (기술적 한계)
- 향후 자가평가 또는 커뮤니티 평가 방식 검토

---

### Phase 2: Week 1-2 Activity 변환 (36-40시간)

**범위**: 12개 Activity만 (48개 아님)
- Week 1: 6개 (Vocabulary, Listening, Speaking, Grammar, Writing, Reading)
- Week 2: 6개

#### 2.1 변환 작업 (28-32시간)
각 Activity당 2.5-3시간:
- 실생활 상황 시나리오 작성
- 자연스러운 대화 예문 제작
- 연습문제 15-20개 작성
- 품질 검토

**예시: Week 1 Speaking Activity 개선**
```json
// 기존 (TOEIC 스타일)
{
  "sentences": [
    { "text": "Hello! How are you?" }
  ]
}

// 변환 후 (실생활 회화)
{
  "scenarios": [
    {
      "situation": "카페에서 커피 주문하기",
      "context": "스타벅스에 처음 가서 커피를 주문하는 상황",
      "dialogue": [
        { "role": "barista", "text": "Hi! What can I get for you today?" },
        { "role": "you", "text": "Hi! Can I get a tall latte, please?" },
        { "role": "barista", "text": "Sure! For here or to go?" },
        { "role": "you", "text": "To go, please." }
      ],
      "keyPhrases": [
        "Can I get...",
        "For here or to go",
        "That'll be..."
      ],
      "practiceTask": "바리스타 역할과 손님 역할을 번갈아가며 연습하세요"
    }
  ]
}
```

#### 2.2 품질 검증 (8시간)
- 전체 12개 Activity 크로스 체크
- 난이도 일관성 확인
- 예문 자연스러움 검토
- 사용자 테스트 (베타 테스터 2-3명)

---

### Phase 3: 대화 시뮬레이션 (15-18시간) ⭐ 핵심 기능

**우선순위 상향**: Phase 5 → Phase 3

#### 3.1 5가지 실생활 시나리오 (10-12시간)
```typescript
// components/ConversationSimulation/scenarios.ts
export const scenarios = [
  {
    id: 'cafe-order',
    title: '카페에서 주문하기',
    level: 'A1',
    situation: '스타벅스에서 커피 주문',
    dialogue: [
      {
        speaker: 'barista',
        text: 'Hi! What can I get for you?',
        options: [
          {
            text: 'Can I get a latte?',
            feedback: '✅ 완벽합니다! 간단하고 자연스러운 주문 표현입니다.',
            nextId: 2
          },
          {
            text: 'I want latte.',
            feedback: '⚠️ 문법적으로는 맞지만, "Can I get..." 이 더 자연스럽습니다.',
            nextId: 2
          },
          {
            text: 'Give me latte.',
            feedback: '❌ 너무 직접적입니다. "Can I get..."을 사용해보세요.',
            nextId: 2
          }
        ]
      }
    ]
  },
  // 4개 시나리오 더...
];
```

#### 3.2 UI 컴포넌트 (5-6시간)
- 대화 인터페이스 (채팅 스타일)
- 선택지 버튼 + 피드백 표시
- 진행 상황 시각화
- 완료 후 리뷰 화면

---

### Phase 4: 맞춤형 학습 경로 UI (6-8시간)

#### 4.1 Dashboard 추천 시스템 (4-5시간)
```typescript
// app/dashboard/page.tsx 수정
const RecommendedWeek = () => {
  const { user } = useAuth();
  const { data: levelTestResult } = useLevelTestResult(user?.uid);
  const { getCurrentWeek } = useOverallProgress();

  // 레벨 테스트 했으면 그 결과로, 안 했으면 진행률로
  const recommendedWeek = levelTestResult?.startWeek || getCurrentWeek();

  return (
    <Card>
      <h2>당신에게 추천하는 학습</h2>
      <p>레벨: {levelTestResult?.level || '미정'}</p>
      <Link href={`/learn/${recommendedWeek}`}>
        <Button>{recommendedWeek} 시작하기</Button>
      </Link>
    </Card>
  );
};
```

#### 4.2 Week 카드 레벨 뱃지 (2-3시간)
- 각 Week에 A1/A2/B1/B2 뱃지 표시
- 현재 레벨보다 높은 Week은 잠금 표시
- 기존 `useOverallProgress`의 `canProgressToNextWeek` 활용

---

### Phase 5: TTS 발음 듣기 강화 (2-3시간)

**기존 useTTS 활용 + 개선**

#### 5.1 발음 듣기 기능 강화 (2-3시간)
```typescript
// hooks/useTTS.ts 개선
export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string, options?: TTSOptions) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate || 1.0; // 속도 조절 (0.5 = 느리게, 1.5 = 빠르게)
    utterance.pitch = options?.pitch || 1.0; // 음높이

    // 발음 시작/종료 이벤트
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakSlow = (text: string) => speak(text, { rate: 0.7 }); // 천천히
  const speakNormal = (text: string) => speak(text, { rate: 1.0 }); // 보통

  const stop = () => window.speechSynthesis.cancel();

  return { speak, speakSlow, speakNormal, stop, isSpeaking };
};
```

**추가 기능**:
- 속도 조절 버튼 (느리게/보통 속도)
- 반복 재생 버튼
- 문장별 재생 버튼
- **발음 평가 기능 없음** (들으면서 따라하기만)

---

### Phase 6: 통합 테스트 및 품질 검증 (20-25시간)

#### 6.1 기능 테스트 (8-10시간)
- [ ] 레벨 테스트 → 추천 → Week 시작 플로우
- [ ] 12개 Activity 모두 정상 작동
- [ ] 진행률 저장 및 복원
- [ ] 대화 시뮬레이션 5개 시나리오
- [ ] TTS 발음 듣기 기능 (속도 조절, 반복)

#### 6.2 버그 수정 (8-10시간)
- 예상치 못한 에러 처리
- Edge case 대응
- 크로스 브라우저 테스트

#### 6.3 사용자 테스트 (4-5시간)
- 베타 테스터 2-3명 초대
- 피드백 수집 및 개선
- 최종 품질 검증

---

## 📊 MVP vs 원본 비교

| 항목 | 원본 계획 | MVP 수정안 |
|------|----------|-----------|
| **레벨 테스트** | 4파트 (Speaking 포함) | 3파트 (Grammar, Vocabulary, Listening) |
| **Activity 변환** | 48개 (71h) | 12개 (36-40h) |
| **대화 시뮬레이션** | Phase 5 (선택) | Phase 3 (핵심) |
| **발음 기능** | 발음 평가 (10h) | TTS 듣기만 (2-3h) |
| **통합 테스트** | 12h | 20-25h (현실적) |
| **총 시간** | 130-137h | **87-101h** |
| **완성 기간** | 16-17일 | **11-13일** |
| **품질 보장** | ❌ 시간 부족 위험 | ✅ 검증 가능 |

---

## 🎯 MVP 이후 확장 계획

### Phase 7: Week 3-8 Activity 확장 (108-120시간)
- 36개 Activity 추가
- Week 1-2 피드백 반영
- 일관성 유지

### Phase 8: TTS 음성 품질 개선 (선택사항)
- 더 자연스러운 음성 API 연동 (Google Cloud TTS, Amazon Polly)
- 다양한 억양/속도 옵션
- 여러 화자 음성 선택

### Phase 9: 커뮤니티 Speaking 평가
- 사용자끼리 녹음 교환
- 피드백 주고받기
- 베지 보상

---

## 💡 핵심 개선 사항 요약

1. **현실적 시간 추정**: 71h → 150-200h (창작 작업 특성 반영)
2. **우선순위 조정**: 대화 시뮬레이션을 핵심 기능으로
3. **발음 평가 제거**: 평가 대신 TTS로 올바른 발음 들려주기만 (2-3h)
4. **품질 우선 접근**: 12개 먼저 완벽하게, 48개 나중에
5. **점진적 확장**: MVP → 사용자 테스트 → 피드백 반영 → 확장
6. **시간 여유**: 87-101시간, 천천히 차근차근 개발

**사용자 요구사항 반영**:
> "모든것들이 다 완성되었을때 어떤 품질과 좋은 프로그램이 될지"

→ **완성도 높은 MVP로 품질 검증 후, 확장 진행**
