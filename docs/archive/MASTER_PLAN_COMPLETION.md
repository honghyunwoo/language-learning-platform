# 회화 고수 플랫폼 완성 마스터플랜

## 🎯 최종 완성 비전

### "3개월 후, 사용자 경험"

**김민수 (25세, 영어 초보)**가 플랫폼을 방문합니다.

1. **레벨테스트 (15분)**
   - 문법 15문제, 어휘 20문제, 듣기 3대화, 말하기 3문장
   - 자동 채점: **A2 (초중급)** 판정
   - 약한 영역: **Speaking 55점** (취약), Listening 68점 (보통)
   - **추천 시작**: Week 3 (A2 레벨), Speaking 집중 필요

2. **맞춤형 학습 시작**
   - Dashboard에 **"Week 3부터 시작하는 걸 추천드려요!"** 표시
   - Week 1-2는 **"복습 자료"**로 언제든 접근 가능
   - **Speaking Activity**에 ⭐ 추천 표시

3. **실전 회화 학습 (Week 3, Day 1)**
   - **Vocabulary**: "카페에서 주문하기" 상황별 표현 학습
   - **Speaking**: AI와 실제 대화 시뮬레이션
     - AI: "Hi! What can I get for you?"
     - 사용자 녹음: "Can I get an iced Americano, please?"
     - **AI 피드백**: "발음 85점, 'please'의 'pl' 발음 개선 필요"
   - **Listening**: 빠른 원어민 대화 청취 + 슬랭 학습

4. **진행 상황 확인**
   - Dashboard: **"오늘 3개 Activity 완료! 연속 7일째 학습 중 🔥"**
   - **약한 영역 분석**: "Speaking 진행률 45% → Speaking 집중 추천"
   - **다음 추천**: "내일은 'Speaking - 친구 초대하기'를 해보세요"

5. **커뮤니티 참여**
   - 게시판: "카페 주문할 때 'Can I have~'랑 'Can I get~' 차이가 뭐예요?"
   - 스터디 그룹: "같이 영어 회화 연습할 사람 모집 (A2 레벨)"

6. **3주 후 재테스트**
   - Speaking 55점 → **72점** (+17점!)
   - 새 추천: **Week 5 (B1 레벨)** 도전 가능

---

## 🏗️ 시스템 아키텍처 (완성본)

### 핵심 컴포넌트

```
┌─────────────────────────────────────────────────────────────┐
│                    회화 고수 플랫폼                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ 레벨테스트   │→ │ 맞춤형 경로   │→ │ 실전 학습    │       │
│  │ (15분)      │  │ (즉시 추천)   │  │ (48개 콘텐츠)│       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│         ↓                                     ↓              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AI 피드백    │  │ 진행 추적     │  │ 커뮤니티     │       │
│  │ (발음/문법) │  │ (실시간)      │  │ (게시판/그룹)│       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

          ┌───────────────────────────────────┐
          │   Firebase Backend (기존 활용)    │
          │  - Authentication                 │
          │  - Firestore (진행 상황)          │
          │  - Storage (음성 녹음)            │
          └───────────────────────────────────┘
```

---

## 📋 Phase별 구현 계획

### **Phase 1: 레벨테스트 시스템** (우선순위: 최고)

#### 목표
사용자가 **자신의 실력을 정확히 파악**하고, **맞춤형 시작점**을 제공받는다.

#### 구현 항목

##### 1.1 테스트 문제 데이터 작성
**위치**: `data/levelTest/`

```json
// grammar-test.json (15문제, 난이도별)
{
  "questions": [
    {
      "id": "g1",
      "level": "A1",
      "question": "I ___ a student.",
      "options": ["am", "is", "are", "be"],
      "answer": "am",
      "explanation": "I와 함께 쓰는 be동사는 am입니다."
    },
    {
      "id": "g8",
      "level": "B1",
      "question": "If I ___ you, I would take the job.",
      "options": ["am", "was", "were", "be"],
      "answer": "were",
      "explanation": "가정법 과거: If I were you (내가 너라면)"
    }
    // ... 15문제 (A1: 5개, A2: 5개, B1: 5개)
  ]
}

// vocabulary-test.json (20문제, 레벨별)
{
  "words": [
    {
      "id": "v1",
      "level": "A1",
      "word": "Hello",
      "options": ["안녕하세요", "감사합니다", "미안합니다", "잘 가세요"],
      "answer": "안녕하세요"
    }
    // ... 20문제
  ]
}

// listening-test.json (3대화, 속도별)
{
  "dialogues": [
    {
      "id": "l1",
      "level": "A1",
      "audioText": "Hello! My name is Tom. Nice to meet you.",
      "speed": 0.7,
      "questions": [
        {
          "question": "What is the speaker's name?",
          "options": ["Tom", "Tim", "Bob", "John"],
          "answer": "Tom"
        }
      ]
    }
    // ... 3대화
  ]
}

// speaking-test.json (3문장, 난이도별)
{
  "sentences": [
    {
      "id": "s1",
      "level": "A1",
      "text": "Hello, my name is John.",
      "rubric": {
        "pronunciation": ["'th' 발음 없지만 기본 발음 체크", "이름 명확성"],
        "fluency": ["막힘 없이 말하기"],
        "grammar": ["주어-동사 구조 정확성"]
      }
    }
    // ... 3문장
  ]
}
```

**예상 시간**: 4-5시간

##### 1.2 레벨테스트 UI 개발
**위치**: `app/level-test/page.tsx`

**화면 구성**:
```
┌────────────────────────────────────────┐
│  🎯 레벨테스트 (15-20분)               │
│                                        │
│  [진행률 바: ████░░░░░░ 40%]          │
│                                        │
│  Part 1: 문법 (15문제)                 │
│  ───────────────────────────────────  │
│  Q8. If I ___ you, I would take it.   │
│   ( ) am  ( ) was  (●) were  ( ) be   │
│                                        │
│  [이전] [다음]               [8/15]    │
└────────────────────────────────────────┘
```

**기능**:
- ✅ Part 1-4 순차 진행
- ✅ 타이머 (Part별 시간 제한 없음, 전체 20분 권장)
- ✅ 진행률 표시
- ✅ 자동 저장 (페이지 나가도 이어서 가능)
- ✅ Speaking Part: 녹음 기능 (기존 TTS Hook 활용!)

**예상 시간**: 6-8시간

##### 1.3 자동 채점 로직
**위치**: `lib/levelTest/scoring.ts`

```typescript
// 채점 알고리즘
function calculateLevel(scores: TestScores): UserLevel {
  const { grammar, vocabulary, listening, speaking } = scores;

  // 평균 점수 계산
  const average = (grammar + vocabulary + listening + speaking) / 4;

  // 레벨 판정
  if (average >= 80) return { level: 'B2', startWeek: 'week-7' };
  if (average >= 65) return { level: 'B1', startWeek: 'week-5' };
  if (average >= 45) return { level: 'A2', startWeek: 'week-3' };
  return { level: 'A1', startWeek: 'week-1' };
}

// 약한 영역 분석
function analyzeWeaknesses(scores: TestScores): Weakness[] {
  const weaknesses = [];

  if (scores.speaking < 65) {
    weaknesses.push({
      skill: 'speaking',
      score: scores.speaking,
      recommendation: 'Speaking Activity를 우선 학습하세요'
    });
  }

  // ... 다른 영역도 동일

  return weaknesses;
}
```

**예상 시간**: 2시간

##### 1.4 결과 저장 및 추천
**위치**: `hooks/useLevelTest.ts` (신규)

```typescript
export const useSaveLevelTestResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: LevelTestResult) => {
      const { userId, scores, level, recommendedStartWeek, weaknesses } = result;

      // Firestore에 저장 (기존 useFirestore Hook 활용!)
      await setDoc(doc(db, 'levelTestResults', userId), {
        ...result,
        testDate: new Date().toISOString(),
      });

      // 사용자 프로필에 추천 주차 설정
      await updateDoc(doc(db, 'users', userId), {
        recommendedStartWeek,
        currentLevel: level,
        weakSkills: weaknesses.map(w => w.skill),
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      queryClient.invalidateQueries(['levelTest']);
    }
  });
};
```

**예상 시간**: 2시간

**Phase 1 총 예상 시간**: **14-17시간**

---

### **Phase 2: Activity 콘텐츠 회화 고수 버전** (우선순위: 최고)

#### 목표
기존 48개 Activity를 **실전 회화 중심**으로 전환, **네이티브 표현** 및 **상황별 대화** 추가

#### 전략

##### 2.1 콘텐츠 작성 가이드라인
**위치**: `docs/CONTENT_WRITING_GUIDE.md` (신규)

**핵심 원칙**:
1. **실전 우선**: 시험 영어 → 실생활 영어
2. **상황 중심**: 단어 암기 → 상황별 표현
3. **네이티브 표현**: 교과서 문장 → 진짜 쓰는 표현
4. **한국인 특화**: 콩글리시 경고, 발음 가이드

**템플릿 예시** (Vocabulary):
```json
{
  "word": "appreciate",
  "koreanMeaning": "감사하다",
  "realLifeUsage": {
    "situation": "동료가 도와줬을 때",
    "examples": [
      {
        "context": "Casual (친구)",
        "sentence": "Thanks a ton! I really appreciate it.",
        "translation": "정말 고마워! 진심으로 감사해."
      },
      {
        "context": "Formal (직장)",
        "sentence": "I appreciate you taking the time to help me with this.",
        "translation": "이 일을 도와주신 시간에 감사드립니다."
      }
    ]
  },
  "vsOtherWords": {
    "thankYou": "'Thank you'는 기본, 'appreciate'는 더 진심 어린 감사",
    "grateful": "'grateful'은 '고마움을 느낀다' (감정), 'appreciate'는 '고맙게 여긴다' (행동)"
  },
  "commonMistakes": [
    "❌ 'I very appreciate' (부사 위치 틀림)",
    "✅ 'I really appreciate it' (really 사용)"
  ],
  "practiceDialogue": [
    "A: Here's the report you needed.",
    "B: I really appreciate it! This saves me a lot of time.",
    "A: No problem, happy to help!"
  ]
}
```

**예상 시간**: 2시간 (가이드 작성)

##### 2.2 Activity 타입별 샘플 제작 (6개)
**각 타입별 Week 1 샘플**

- Vocabulary: 실전 표현 중심 (3시간)
- Speaking: 대화 시뮬레이션 (4시간)
- Listening: 빠른 원어민 + 슬랭 (3시간)
- Grammar: 회화 필수 문법만 (2시간)
- Writing: 문자/이메일 실전 (3시간)
- Reading: SNS/뉴스 실제 자료 (2시간)

**예상 시간**: **17시간** (샘플 6개)

##### 2.3 전체 48개 Activity 일괄 전환
**전략**: 타입별 템플릿 적용 + 수동 검토

**작업 분배**:
- Vocabulary 8개 (주차별): 8시간
- Speaking 8개: 12시간 (대화 시나리오 제작 필요)
- Listening 8개: 10시간
- Grammar 8개: 6시간
- Writing 8개: 8시간
- Reading 8개: 8시간

**예상 시간**: **52시간**

**Phase 2 총 예상 시간**: **71시간** (약 9일, 하루 8시간 기준)

---

### **Phase 3: 맞춤형 학습 경로 UI** (우선순위: 중)

#### 목표
사용자 레벨에 맞는 **추천 시스템** 및 **시각적 안내**

#### 구현 항목

##### 3.1 Dashboard 추천 섹션
**위치**: `app/dashboard/page.tsx` 수정

**추가 요소**:
```tsx
{/* 레벨테스트 결과 기반 추천 */}
{levelTestResult && (
  <div className="glass p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-4">
      💡 {levelTestResult.level} 레벨에 맞는 추천
    </h3>
    <p className="mb-4">
      Week {recommendedWeek}부터 시작하는 걸 추천드려요!
    </p>

    {/* 약한 영역 표시 */}
    {weaknesses.length > 0 && (
      <div className="mt-4">
        <p className="font-semibold">⚠️ 집중 필요 영역:</p>
        {weaknesses.map(w => (
          <div key={w.skill} className="mt-2">
            <Badge>{w.skill}</Badge> {w.score}점
            <p className="text-sm">{w.recommendation}</p>
          </div>
        ))}
      </div>
    )}

    {/* 추천 Activity */}
    <div className="mt-6">
      <p className="font-semibold">🎯 다음 추천 Activity:</p>
      <ActivityCard activity={nextRecommended} highlight />
    </div>
  </div>
)}
```

**예상 시간**: 4시간

##### 3.2 WeekCard에 레벨 표시
**위치**: `components/curriculum/WeekCard.tsx` 수정

**추가 요소**:
```tsx
{/* 레벨 배지 */}
<Badge color={getColorByLevel(week.level)}>
  {week.level} 레벨
</Badge>

{/* 추천 표시 */}
{isRecommended && (
  <div className="absolute top-2 right-2">
    <Badge color="yellow">⭐ 추천</Badge>
  </div>
)}

{/* 복습 표시 */}
{isReview && (
  <Badge color="gray">📚 복습 자료</Badge>
)}
```

**예상 시간**: 2시간

##### 3.3 Activity 필터링 및 정렬
**위치**: `app/dashboard/curriculum/page.tsx` 수정

**기능**:
- ✅ 레벨별 필터 (A1, A2, B1, B2)
- ✅ 타입별 필터 (Vocabulary, Speaking 등)
- ✅ 추천순 정렬 (약한 영역 우선)

**예상 시간**: 3시간

**Phase 3 총 예상 시간**: **9시간**

---

### **Phase 4: AI 음성 피드백 시스템** (우선순위: 중)

#### 목표
사용자의 **발음과 유창성**을 AI가 자동 평가하고 피드백 제공

#### 구현 항목

##### 4.1 Web Speech API 활용 (기존 기능 확장!)
**위치**: `hooks/useSpeechRecognition.ts` (신규)

**기능**:
```typescript
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.start();
    setIsListening(true);
  };

  return { transcript, isListening, startListening };
};
```

**예상 시간**: 3시간

##### 4.2 발음 정확도 분석 (간단 버전)
**위치**: `lib/ai/pronunciationScore.ts`

**알고리즘** (간단 버전):
```typescript
function scorePronunciation(targetText: string, spokenText: string): number {
  // 1. 정확도: Levenshtein Distance
  const accuracy = 1 - (levenshteinDistance(targetText, spokenText) / targetText.length);

  // 2. 주요 단어 체크
  const targetWords = targetText.toLowerCase().split(' ');
  const spokenWords = spokenText.toLowerCase().split(' ');
  const matchedWords = targetWords.filter(w => spokenWords.includes(w)).length;
  const wordAccuracy = matchedWords / targetWords.length;

  // 최종 점수 (0-100)
  const score = (accuracy * 0.6 + wordAccuracy * 0.4) * 100;
  return Math.round(score);
}
```

**예상 시간**: 4시간

##### 4.3 피드백 UI
**위치**: `components/activities/SpeakingActivity.tsx` 수정

**피드백 표시**:
```tsx
{feedback && (
  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
    <h4 className="font-bold">🎙️ AI 피드백</h4>
    <div className="mt-2">
      <p>발음 정확도: <span className="font-bold text-blue-600">{feedback.score}점</span></p>
      <p className="text-sm mt-1">들은 내용: "{feedback.transcript}"</p>

      {feedback.suggestions.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold">💡 개선 포인트:</p>
          <ul className="list-disc list-inside">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="text-sm">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
)}
```

**예상 시간**: 3시간

**Phase 4 총 예상 시간**: **10시간**

---

### **Phase 5: 실전 대화 시뮬레이션** (우선순위: 낮, but 차별화!)

#### 목표
AI와 **실시간 대화 연습** (챗봇 스타일)

#### 구현 항목

##### 5.1 대화 시나리오 데이터
**위치**: `data/conversations/` (신규)

```json
{
  "id": "cafe-order",
  "title": "카페에서 주문하기",
  "level": "A2",
  "scenario": "당신은 카페에 들어가서 음료를 주문하려고 합니다.",
  "conversation": [
    {
      "role": "ai",
      "message": "Hi! What can I get for you today?",
      "expectedUserResponse": ["주문하기", "음료 선택"],
      "hints": ["Can I get~", "I'd like~", "Could I have~"]
    },
    {
      "role": "user",
      "input": "" // 사용자 입력 대기
    },
    {
      "role": "ai",
      "message": "Sure! What size would you like?",
      "expectedUserResponse": ["사이즈 말하기"],
      "hints": ["small", "medium", "large"]
    }
    // ... 대화 이어짐
  ]
}
```

**예상 시간**: 6시간 (시나리오 10개)

##### 5.2 대화 UI
**위치**: `app/dashboard/conversation/[id]/page.tsx` (신규)

**화면**:
```
┌────────────────────────────────────────┐
│  💬 카페에서 주문하기                   │
│  ──────────────────────────────────    │
│                                        │
│  🤖 AI: Hi! What can I get for you?   │
│                                        │
│  🎤 [녹음하기] 또는 [타이핑하기]       │
│  👤 You: ________________             │
│                                        │
│  💡 힌트: Can I get~, I'd like~       │
│                                        │
│  [전송]                                │
└────────────────────────────────────────┘
```

**예상 시간**: 8시간

**Phase 5 총 예상 시간**: **14시간** (선택적)

---

### **Phase 6: 통합 테스트 및 품질 검증** (우선순위: 최고)

#### 목표
**전체 시스템이 완벽히 작동**하는지 검증

#### 검증 항목

##### 6.1 기능 테스트
- [ ] 레벨테스트 → 결과 저장 → Dashboard 반영
- [ ] 추천 주차 시작 → Activity 완료 → 진행률 업데이트
- [ ] Speaking 녹음 → AI 피드백 → 점수 저장
- [ ] 커뮤니티 게시 → 댓글 → 알림
- [ ] 스트릭 계산 → 배지 획득

##### 6.2 성능 테스트
- [ ] 페이지 로딩 속도 (<3초)
- [ ] 빌드 크기 (<500KB First Load JS)
- [ ] Firestore 쿼리 최적화

##### 6.3 사용자 테스트
- [ ] 본인이 직접 A1 → B2까지 학습 경로 체험
- [ ] 레벨테스트 정확도 확인
- [ ] AI 피드백 유용성 평가

**예상 시간**: **12시간**

---

## 📊 전체 예상 시간 정리

| Phase | 내용 | 예상 시간 | 우선순위 |
|-------|------|-----------|----------|
| **Phase 1** | 레벨테스트 시스템 | 14-17시간 | ⭐⭐⭐ |
| **Phase 2** | Activity 콘텐츠 전환 (48개) | 71시간 | ⭐⭐⭐ |
| **Phase 3** | 맞춤형 학습 경로 UI | 9시간 | ⭐⭐ |
| **Phase 4** | AI 음성 피드백 | 10시간 | ⭐⭐ |
| **Phase 5** | 실전 대화 시뮬레이션 | 14시간 | ⭐ (선택) |
| **Phase 6** | 통합 테스트 및 검증 | 12시간 | ⭐⭐⭐ |
| **총계** | | **130-137시간** | |
| **실작업 (선택 제외)** | | **116시간** (약 15일, 하루 8시간) |

---

## 🚀 실행 전략

### 병렬 작업 가능 항목
1. **Phase 1 + Phase 2 샘플** (동시 진행 가능)
   - 레벨테스트 문제 작성 (4시간)
   - Activity 샘플 6개 작성 (17시간)
   - **총 21시간 → 병렬 시 약 10-12시간**

2. **Phase 2 대량 작업 시 자동화**
   - 템플릿 기반 일괄 적용
   - 타입별로 구조 통일
   - **예상 52시간 → 자동화 시 약 30-35시간**

### 품질 관리
- ✅ **매 Phase 완료 후 빌드 테스트**
- ✅ **주요 기능 완성 시 사용자 직접 체험**
- ✅ **콘텐츠 작성 후 샘플 검증 (일관성 체크)**

---

## 🎯 최종 완성 체크리스트

### 사용자 경험 (User Journey)
- [ ] 첫 방문 → 레벨테스트 → 맞춤 추천 → 학습 시작 (완벽한 온보딩)
- [ ] 매일 로그인 → 추천 Activity → 완료 → 피드백 → 진행률 확인
- [ ] 약한 영역 자동 감지 → 집중 훈련 → 재테스트 → 레벨 상승

### 기술적 완성도
- [ ] 모든 기능 작동 (버그 0개)
- [ ] 빌드 성공 (최적화 완료)
- [ ] 모바일 반응형 (완벽)
- [ ] 성능 최적화 (빠른 로딩)

### 콘텐츠 완성도
- [ ] 48개 Activity 모두 회화 고수 버전
- [ ] 상황별 실전 표현 포함
- [ ] 한국인 특화 팁 일관성
- [ ] 네이티브 표현 풍부

---

**작성일**: 2025-10-09
**목표**: 3개월 내 **회화 고수 양성 플랫폼** 완성
**핵심 가치**: 무료, 맞춤형, 실전 중심
