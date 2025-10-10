# 회화 고수 양성 콘텐츠 전략 (수정본)

## 🎯 핵심 목표

### 미션
**"영어 회화 잘하고 싶은 모든 사람이 무료로 실력을 키울 수 있는 플랫폼"**

### 타겟 사용자
- 초보자 (A1): 영어로 기본 인사도 어려운 사람
- 중급자 (A2-B1): 간단한 대화는 되지만 막히는 사람
- 고급자 (B2+): 유창하게 하고 싶은데 자연스러움이 부족한 사람

### 핵심 가치
1. **무료 접근성**: 누구나 부담 없이 시작
2. **개인 맞춤형**: 레벨테스트로 적합한 시작점
3. **실전 중심**: 실제 대화에서 바로 쓸 수 있는 능력

---

## 💡 "회화 고수"의 정의

### 회화 고수 = 3가지 능력

#### 1. **유창성 (Fluency)**
- 막힘없이 말할 수 있다
- 생각을 바로바로 영어로 표현한다
- 대화가 자연스럽게 흐른다

#### 2. **정확성 (Accuracy)**
- 문법 실수가 적다
- 발음이 알아듣기 쉽다
- 적절한 단어를 선택한다

#### 3. **자연스러움 (Naturalness)**
- 네이티브처럼 말한다
- 상황에 맞는 표현을 쓴다
- 문화적으로 적절하다

---

## 🎓 레벨테스트 시스템 설계

### 테스트 구성 (15-20분)

#### Part 1: 기초 문법 (5분)
```json
{
  "type": "grammar_quiz",
  "questions": 15,
  "topics": ["be동사", "현재시제", "과거시제", "조동사", "관사"],
  "scoring": "정답률로 A1/A2/B1 구분"
}
```

#### Part 2: 어휘력 (5분)
```json
{
  "type": "vocabulary_test",
  "questions": 20,
  "levels": ["기초 500단어", "중급 1000단어", "고급 2000단어"],
  "scoring": "맞은 레벨에 따라 점수"
}
```

#### Part 3: 듣기 이해 (5분)
```json
{
  "type": "listening_comprehension",
  "dialogues": 3,
  "difficulty": ["slow + clear", "normal speed", "native speed"],
  "scoring": "이해도 측정"
}
```

#### Part 4: 말하기 녹음 (5분)
```json
{
  "type": "speaking_sample",
  "tasks": [
    "자기소개 (30초)",
    "사진 묘사 (30초)",
    "의견 말하기 (1분)"
  ],
  "scoring": "발음, 유창성, 문법 자동 분석 (AI) + 자가 평가"
}
```

### 레벨 판정 기준

| 레벨 | 문법 | 어휘 | 듣기 | 말하기 | 시작 주차 |
|------|------|------|------|--------|-----------|
| **A1 (초보)** | 0-40% | 0-30% | 0-40% | 간단한 문장 어려움 | Week 1 |
| **A2 (초중급)** | 41-65% | 31-60% | 41-65% | 기본 대화 가능 | Week 3 |
| **B1 (중급)** | 66-80% | 61-80% | 66-80% | 일상 대화 가능 | Week 5 |
| **B2+ (고급)** | 81-100% | 81-100% | 81-100% | 유창하지만 자연스러움 부족 | Week 7 |

---

## 📚 회화 고수를 위한 Activity 타입별 전략

### 1. **Vocabulary (어휘)** - 실전 표현 중심

#### ❌ 기존 (시험 중심)
- 단어 뜻 암기
- 예문 1개
- 문법적 설명

#### ✅ 회화 고수 (실전 중심)
- **상황별 표현**: "레스토랑에서", "친구와 수다", "회의에서"
- **네이티브 표현**: "Thank you"보다 "I appreciate it", "Thanks a ton"
- **콩글리시 vs 진짜 영어**: "Fighting!" → "You can do it!", "Good luck!"
- **뉘앙스 차이**: "Can you~" (가능성) vs "Could you~" (정중함)

**예시**:
```json
{
  "word": "appreciate",
  "meaning": "감사하다 (Thank you보다 격식 있음)",
  "realLifeContext": {
    "situation": "동료가 도와줬을 때",
    "natural": "I really appreciate your help!",
    "formal": "I appreciate you taking the time.",
    "casual": "Thanks a ton! / Thanks so much!"
  },
  "koreanMistake": "한국인은 모든 상황에 'Thank you'만 쓰지만, 네이티브는 상황별로 다양하게 표현합니다.",
  "practiceDialogue": [
    "A: Here's the report you needed.",
    "B: I really appreciate it! This saves me a lot of time."
  ]
}
```

---

### 2. **Speaking (말하기)** - 실전 대화 시뮬레이션

#### ❌ 기존 (문장 따라 읽기)
- 준비된 문장 읽기
- 발음 연습만

#### ✅ 회화 고수 (실전 대화)
- **롤플레이**: 카페 주문, 길 묻기, 친구 초대
- **즉흥 말하기**: 주제 주고 1분 말하기
- **반응 연습**: 상대방 말에 자연스럽게 반응
- **필러 워드**: "Um", "Well", "You know" 자연스럽게 사용

**예시**:
```json
{
  "scenario": "카페에서 음료 주문하기",
  "yourRole": "고객",
  "task": "아이스 아메리카노 주문 + 설탕 추가 요청",
  "conversation": [
    {
      "barista": "Hi! What can I get for you today?",
      "you": "[여기서 주문하세요]",
      "naturalResponse": "Can I get an iced Americano, please?",
      "additionalRequest": "Could I also get some sugar on the side?"
    },
    {
      "barista": "Sure! What size would you like?",
      "you": "[사이즈 말하기]",
      "naturalResponse": "I'll take a medium, please."
    }
  ],
  "commonMistakes": [
    "❌ 'I want coffee' (너무 직접적, 무례하게 들림)",
    "✅ 'Can I get~', 'I'd like~', 'Could I have~' (정중함)"
  ],
  "culturalTip": "영어권에서는 'please'와 함께 간접적으로 요청하는 것이 기본 매너입니다."
}
```

---

### 3. **Listening (듣기)** - 실제 대화 듣기

#### ❌ 기존 (교과서 듣기)
- 느리고 명확한 발음
- 교과서 문장

#### ✅ 회화 고수 (실전 듣기)
- **실제 대화 속도**: 빠른 원어민 대화
- **연음/축약**: "I'm gonna", "Wanna", "Gotta"
- **억양/뉘앙스**: 화난 톤, 기쁜 톤, 놀란 톤 구분
- **슬랭/관용구**: "Piece of cake", "Break a leg"

**예시**:
```json
{
  "audio": "Real conversation - Friends talking",
  "speed": 1.0,
  "transcript": "A: Wanna grab coffee later? B: I'd love to, but I'm swamped today. Rain check?",
  "breakdowns": [
    {
      "phrase": "Wanna",
      "formal": "Want to",
      "explanation": "원어민은 'want to'를 거의 'wanna'로 발음합니다."
    },
    {
      "phrase": "grab coffee",
      "literal": "커피를 잡다 (?)",
      "real": "커피 마시러 가다 (casual 표현)",
      "formal": "get coffee", "have coffee"
    },
    {
      "phrase": "I'm swamped",
      "meaning": "너무 바빠서 허우적대는 중",
      "alternatives": ["I'm super busy", "I'm overwhelmed", "I'm tied up"]
    },
    {
      "phrase": "Rain check?",
      "meaning": "다음에 하자? (약속을 미루는 정중한 표현)",
      "response": "Sure! / Of course! / Sounds good!"
    }
  ]
}
```

---

### 4. **Grammar (문법)** - 회화 필수 문법만

#### ❌ 기존 (시험 문법)
- 모든 문법 규칙
- 복잡한 설명

#### ✅ 회화 고수 (실전 문법)
- **회화에서 자주 쓰는 것만**: 현재시제, 과거시제, 조동사, 의문문
- **실수하면 티 나는 것**: 3인칭 단수 -s, 관사 a/an/the
- **회화체 문법**: 축약형, 생략, 도치
- **실전 적용**: 바로 대화에 써먹기

**예시**:
```json
{
  "grammar": "현재완료 (have + p.p.)",
  "whyImportant": "경험 말할 때 자주 씀! 'I went to Paris'와 'I've been to Paris'의 뉘앙스 차이",
  "conversationExample": [
    {
      "situation": "여행 경험 나누기",
      "wrong": "A: You went to Japan? B: Yes, I went there last year.",
      "natural": "A: Have you ever been to Japan? B: Yeah, I've been there a couple of times!",
      "difference": "Have you been~은 '경험 있어?'라는 뉘앙스. Went는 '특정 시점에 갔다'는 뉘앙스."
    }
  ],
  "practice": [
    "자신의 경험 3가지를 현재완료로 말해보세요.",
    "예: I've tried sushi, I've watched that movie, I've met him before."
  ]
}
```

---

### 5. **Writing (쓰기)** - 실전 메시지 작성

#### ❌ 기존 (에세이)
- 긴 글 쓰기
- 형식적 문장

#### ✅ 회화 고수 (실전 글쓰기)
- **문자/채팅**: 친구에게 문자 보내기
- **이메일**: 비즈니스 이메일, 캐주얼 이메일
- **SNS**: 인스타 캡션, 댓글 달기
- **회화 연습**: 쓰면서 말하기 연습

**예시**:
```json
{
  "task": "친구에게 약속 잡는 문자 보내기",
  "situation": "오랜만에 연락하는 친구",
  "wrongExample": "Hello. Are you free tomorrow? Let's meet. Goodbye.",
  "naturalExample": "Hey! Long time no see 😊 Are you free this weekend? Let's grab dinner and catch up!",
  "breakdown": [
    "Hey! (친구에게 격식 없는 인사)",
    "Long time no see (오랜만이야 - 관용구)",
    "grab dinner (저녁 먹으러 가자 - 회화체)",
    "catch up (근황 나누다)",
    "이모지 사용 (친근함 표현)"
  ],
  "culturalNote": "영어권 문자는 매우 캐주얼! 한국어처럼 격식 차리지 않습니다."
}
```

---

### 6. **Reading (읽기)** - 실전 자료 읽기

#### ❌ 기존 (교과서 지문)
- 인위적인 글
- 어려운 어휘

#### ✅ 회화 고수 (실전 자료)
- **SNS 포스트**: 인스타, 트위터, 페이스북
- **뉴스 헤드라인**: 간단한 뉴스
- **영화 대사**: 실제 영화/드라마 대사
- **광고/메뉴**: 일상에서 보는 글

**예시**:
```json
{
  "source": "Instagram Post",
  "text": "Just wrapped up an amazing week! So grateful for all the support. Can't wait to share what's next 🙌",
  "breakdown": [
    {
      "phrase": "wrapped up",
      "meaning": "마무리했다 (finished)",
      "formal": "completed", "concluded"
    },
    {
      "phrase": "So grateful",
      "tone": "진심 어린 감사 (very thankful)",
      "koreanNote": "SNS에서 자주 쓰는 감사 표현"
    },
    {
      "phrase": "Can't wait to",
      "meaning": "~하는 게 너무 기대된다",
      "usage": "긍정적 기대감 표현"
    }
  ],
  "practiceTask": "자신의 일주일을 SNS 포스트처럼 영어로 써보세요."
}
```

---

## 🚀 개인 맞춤형 학습 경로

### 레벨별 커리큘럼

#### A1 (초보자) - Week 1~4
**목표**: 기본 대화 가능하게
- Week 1-2: 인사, 자기소개, 기본 문장
- Week 3-4: 일상 대화 (주문하기, 길 묻기)

#### A2 (초중급) - Week 3~6
**목표**: 일상 대화 유창하게
- Week 3-4: 과거/미래 이야기
- Week 5-6: 의견 표현, 감정 말하기

#### B1 (중급) - Week 5~8
**목표**: 복잡한 주제도 대화 가능
- Week 5-6: 경험 나누기, 설명하기
- Week 7-8: 토론, 설득하기

#### B2+ (고급) - Week 7~8 + 심화
**목표**: 네이티브처럼 자연스럽게
- Week 7-8: 슬랭, 관용구, 문화적 뉘앙스
- 심화: 실전 대화 마스터, 발음/억양 완성

---

## 💰 무료 + 수익화 모델

### 무료 (Core)
- ✅ 레벨테스트
- ✅ 8주 커리큘럼 (Week 1-8 모든 Activity)
- ✅ 커뮤니티 (게시판, 스터디 그룹)
- ✅ 학습 일지

### 프리미엄 (Optional)
- 🎯 **1:1 AI 튜터**: 실시간 대화 연습
- 🎯 **발음 교정**: AI 음성 분석 + 피드백
- 🎯 **추가 콘텐츠**: Week 9-16 고급 과정
- 🎯 **수료증**: 레벨별 인증서

---

## 📋 다음 단계

### 우선순위 1: 레벨테스트 구현
- Part 1-4 문제 제작
- 자동 채점 로직
- 레벨 판정 알고리즘

### 우선순위 2: Activity 콘텐츠 개선
- 실전 회화 중심으로 재작성
- 상황별 대화 시뮬레이션 추가
- 네이티브 표현, 슬랭, 관용구 포함

### 우선순위 3: 사용자 경험 개선
- 맞춤형 학습 경로 UI
- 진행 상황 시각화
- 실전 대화 연습 기능

---

**작성일**: 2025-10-09
**목적**: 회화 고수 양성을 위한 실전 중심 콘텐츠 전략
