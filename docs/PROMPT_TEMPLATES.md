# Activity 구현 프롬프트 템플릿

> **목적**: Activity 구현 시 표준화된 프롬프트를 사용하여 일관성 있는 결과물 생성

---

## 📋 사용 방법

1. 구현할 Activity 타입 선택 (vocabulary, reading, grammar, listening, writing, speaking)
2. 해당 섹션의 프롬프트 복사
3. `{변수}` 부분을 실제 값으로 치환
4. AI에게 프롬프트 전달

---

## 🎯 Activity 컴포넌트 생성 프롬프트

### Grammar Activity
```
{타입}Activity 컴포넌트를 다음 사양으로 생성해주세요:

**기본 구조**:
- 파일명: components/activities/GrammarActivity.tsx
- VocabularyActivity, ReadingActivity 패턴 따름
- TypeScript + React 'use client' 컴포넌트

**필수 기능**:
1. 문법 설명 섹션
   - 규칙 설명 표시
   - 예문 제시
   - 주요 포인트 강조

2. 연습 문제 섹션
   - 문제 타입: multiple_choice, fill_blank, sentence_ordering
   - 정답 확인 및 즉각 피드백
   - 해설 표시

3. 공통 기능
   - useTTS 훅 통합 (예문 음성 재생)
   - 진행률 표시
   - 탭 전환 (설명 ↔ 연습)
   - 다크모드 지원

**데이터 인터페이스**:
```typescript
interface GrammarActivityData {
  id: string;
  weekId: string;
  type: 'grammar';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  rules: Array<{
    id: string;
    rule: string;
    explanation: string;
    examples: Array<{
      sentence: string;
      translation: string;
    }>;
  }>;

  exercises: Array<{
    id: string;
    type: 'multiple_choice' | 'fill_blank' | 'sentence_ordering';
    question: string;
    options?: string[];
    answer: string | string[];
    explanation?: string;
  }>;
}
```

**UI 요구사항**:
- 문법 설명: 카드 형식, 예문은 회색 박스
- 연습 문제: VocabularyActivity와 동일한 스타일
- 반응형 디자인
- Heroicons 사용

**참고 파일**:
- components/activities/VocabularyActivity.tsx
- components/activities/ReadingActivity.tsx
```

---

### Listening Activity
```
{타입}Activity 컴포넌트를 다음 사양으로 생성해주세요:

**기본 구조**:
- 파일명: components/activities/ListeningActivity.tsx
- ReadingActivity 패턴 기반
- TypeScript + React 'use client' 컴포넌트

**필수 기능**:
1. 음성 재생 섹션
   - TTS로 지문 음성 재생
   - 재생 속도 조절 (0.5x, 0.75x, 1x, 1.25x)
   - 반복 재생 버튼
   - 재생 진행 표시

2. 받아쓰기 섹션
   - 텍스트 입력 필드
   - 실시간 단어 비교
   - 틀린 단어 하이라이트

3. 이해도 문제 섹션
   - ReadingActivity와 동일한 문제 형식
   - 음성 기반 질문

**데이터 인터페이스**:
```typescript
interface ListeningActivityData {
  id: string;
  weekId: string;
  type: 'listening';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  audio: {
    text: string;
    speed: number; // 기본 속도
    pausePoints?: number[]; // 쉼표 위치 (초)
  };

  dictation?: {
    targetSentences: string[];
  };

  questions: Array<{
    id: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    question: string;
    options?: string[];
    answer: string;
    explanation?: string;
  }>;
}
```

**UI 요구사항**:
- 오디오 플레이어: 재생/일시정지, 속도 조절, 진행 바
- 받아쓰기: 여러 줄 텍스트 입력, 단어별 정답 표시
- 문제: ReadingActivity 스타일 재사용

**참고 파일**:
- components/activities/ReadingActivity.tsx
- hooks/useTTS.ts
```

---

### Writing Activity
```
{타입}Activity 컴포넌트를 다음 사양으로 생성해주세요:

**기본 구조**:
- 파일명: components/activities/WritingActivity.tsx
- TypeScript + React 'use client' 컴포넌트

**필수 기능**:
1. 작문 가이드 섹션
   - 주제 및 요구사항 표시
   - 예시 문장 제공
   - 단어 수 카운터

2. 작문 입력 섹션
   - 텍스트 에리어
   - 실시간 단어 수 표시
   - 임시 저장 기능

3. 자가 평가 섹션
   - 체크리스트 (문법, 어휘, 구조)
   - 제출 확인

**데이터 인터페이스**:
```typescript
interface WritingActivityData {
  id: string;
  weekId: string;
  type: 'writing';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  prompt: {
    topic: string;
    requirements: string[];
    minWords: number;
    maxWords: number;
  };

  examples?: Array<{
    text: string;
    translation: string;
  }>;

  checklist: Array<{
    id: string;
    item: string;
  }>;
}
```

**UI 요구사항**:
- 프롬프트: 카드 형식, 요구사항 리스트
- 입력: 큰 텍스트 에리어, 우측 하단에 단어 수
- 체크리스트: 체크박스 형식

**참고 파일**:
- components/activities/VocabularyActivity.tsx
```

---

### Speaking Activity
```
{타입}Activity 컴포넌트를 다음 사양으로 생성해주세요:

**기본 구조**:
- 파일명: components/activities/SpeakingActivity.tsx
- TypeScript + React 'use client' 컴포넌트

**필수 기능**:
1. 모범 발음 섹션
   - TTS로 문장 재생
   - 속도 조절
   - 발음 기호 표시

2. 녹음 섹션
   - MediaRecorder API 사용
   - 녹음 시작/중지
   - 녹음 시간 표시
   - 재생 기능

3. 자가 평가 섹션
   - 발음 체크리스트
   - 녹음 다시 듣기

**데이터 인터페이스**:
```typescript
interface SpeakingActivityData {
  id: string;
  weekId: string;
  type: 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  sentences: Array<{
    id: string;
    text: string;
    translation: string;
    pronunciation?: string;
    tips?: string;
  }>;

  checklist: Array<{
    id: string;
    item: string;
  }>;
}
```

**UI 요구사항**:
- 모범 발음: 큰 텍스트, 재생 버튼, 속도 조절
- 녹음: 마이크 아이콘, 타이머, 파형 애니메이션
- 체크리스트: 자가 평가 항목

**참고 파일**:
- hooks/useTTS.ts
- app/test-apis/page.tsx (MediaRecorder 예제)
```

---

## 📄 JSON 데이터 생성 프롬프트

### Grammar JSON
```
Week {주차} Grammar 데이터를 다음 사양으로 생성해주세요:

**기본 정보**:
- 파일명: data/activities/grammar/week-{주차}-grammar.json
- CEFR 레벨: {레벨} (A1, A2, B1, B2)
- 주제: {문법 주제}

**CEFR 레벨 가이드** (docs/CEFR_CONTENT_STANDARDS.md 참조):
- A1: 현재형, be동사, 단순 문장
- A2: 과거형, 미래형, 기본 접속사
- B1: 완료형, 조건문, 관계대명사
- B2: 수동태, 가정법, 복합 문장

**필수 포함 사항**:
1. 문법 규칙 3-5개
   - 규칙 설명 (간단명료)
   - 예문 2-3개 (영어 + 한글 번역)
   - 주의사항

2. 연습 문제 10-15개
   - multiple_choice: 60%
   - fill_blank: 30%
   - sentence_ordering: 10%
   - 각 문제에 해설 포함

**JSON 구조**:
```json
{
  "id": "week-{N}-grammar",
  "weekId": "week-{N}",
  "type": "grammar",
  "level": "{레벨}",
  "title": "{제목}",
  "description": "{설명}",

  "rules": [
    {
      "id": "r1",
      "rule": "현재형 be동사 (am, is, are)",
      "explanation": "주어에 따라 be동사의 형태가 달라집니다.",
      "examples": [
        {
          "sentence": "I am a student.",
          "translation": "나는 학생입니다."
        }
      ]
    }
  ],

  "exercises": [...]
}
```

**품질 기준**:
- 예문은 실생활 상황
- 해설은 왜 그 답인지 명확히 설명
- 난이도 점진적 증가
```

---

### Listening JSON
```
Week {주차} Listening 데이터를 다음 사양으로 생성해주세요:

**기본 정보**:
- 파일명: data/activities/listening/week-{주차}-listening.json
- CEFR 레벨: {레벨}
- 주제: {주제}

**CEFR 레벨 가이드**:
- A1: 80-100 단어, 느린 속도 (0.6x), 간단한 문장
- A2: 100-150 단어, 보통 속도 (0.8x), 기본 접속사
- B1: 150-200 단어, 정상 속도 (1.0x), 복합 문장
- B2: 200-300 단어, 빠른 속도 (1.2x), 관용 표현

**필수 포함 사항**:
1. 음성 텍스트
   - 자연스러운 대화 또는 내레이션
   - [PAUSE] 마커로 쉼표 표시
   - TTS 친화적 문장

2. 받아쓰기 (선택)
   - 핵심 문장 2-3개

3. 이해도 문제 8-12개
   - 세부 정보 파악
   - 주제 이해
   - 추론 문제

**JSON 구조**:
```json
{
  "id": "week-{N}-listening",
  "type": "listening",
  "level": "{레벨}",

  "audio": {
    "text": "대화 또는 내레이션 전체 텍스트. [PAUSE] 문장 구분.",
    "speed": 0.7
  },

  "dictation": {
    "targetSentences": ["받아쓰기 문장1", "문장2"]
  },

  "questions": [...]
}
```
```

---

### Writing JSON
```
Week {주차} Writing 데이터를 다음 사양으로 생성해주세요:

**CEFR 레벨 가이드**:
- A1: 30-50 단어, 자기소개, 간단한 묘사
- A2: 50-80 단어, 일상 경험, 의견 표현
- B1: 80-120 단어, 에세이, 설명문
- B2: 120-200 단어, 논증, 복잡한 주제

**필수 포함 사항**:
1. 작문 프롬프트
   - 명확한 주제
   - 구체적 요구사항 (3-5개)
   - 단어 수 범위

2. 예시 (선택)
   - 모범 답안 1-2개
   - 한글 번역

3. 자가 평가 체크리스트
   - 문법 정확성
   - 어휘 적절성
   - 구조 논리성

**JSON 구조**:
```json
{
  "id": "week-{N}-writing",
  "type": "writing",

  "prompt": {
    "topic": "자기소개",
    "requirements": [
      "이름과 나이 포함",
      "직업 또는 학업 상황 설명",
      "취미 1-2개 언급"
    ],
    "minWords": 30,
    "maxWords": 50
  },

  "examples": [...],
  "checklist": [...]
}
```
```

---

### Speaking JSON
```
Week {주차} Speaking 데이터를 다음 사양으로 생성해주세요:

**CEFR 레벨 가이드**:
- A1: 5-8 문장, 기본 인사, 자기소개
- A2: 8-12 문장, 일상 대화, 의견 표현
- B1: 12-15 문장, 토론, 설명
- B2: 15-20 문장, 프레젠테이션, 논증

**필수 포함 사항**:
1. 연습 문장
   - 주제별 그룹화
   - 발음 기호 (어려운 단어만)
   - 발음 팁

2. 자가 평가 체크리스트
   - 발음 정확성
   - 유창성
   - 억양

**JSON 구조**:
```json
{
  "id": "week-{N}-speaking",
  "type": "speaking",

  "sentences": [
    {
      "id": "s1",
      "text": "Hello, how are you?",
      "translation": "안녕하세요, 어떻게 지내세요?",
      "pronunciation": "/həˈloʊ, haʊ ɑːr juː/",
      "tips": "'how are'는 빠르게 연음으로 발음"
    }
  ],

  "checklist": [...]
}
```
```

---

## 🔗 통합 프롬프트 (Activity + JSON 동시 생성)

```
{타입}Activity 구현을 다음 순서로 진행해주세요:

**1단계: 컴포넌트 생성**
[위 "Activity 컴포넌트 생성 프롬프트" 사용]

**2단계: JSON 데이터 생성**
[위 "JSON 데이터 생성 프롬프트" 사용]

**3단계: 통합**
- ActivityContent.tsx에 import 추가
- switch case에 라우팅 추가

**4단계: 검증**
- TypeScript 타입 에러 없음
- JSON 파싱 가능
- 데이터 구조 일치
```

---

## 📝 변수 치환 예시

### Grammar Activity 예시
```
GrammarActivity 컴포넌트를 다음 사양으로 생성해주세요:

**기본 구조**:
- 파일명: components/activities/GrammarActivity.tsx
- VocabularyActivity, ReadingActivity 패턴 따름
...
```

### Week 1 Grammar JSON 예시
```
Week 1 Grammar 데이터를 다음 사양으로 생성해주세요:

**기본 정보**:
- 파일명: data/activities/grammar/week-1-grammar.json
- CEFR 레벨: A1
- 주제: Be동사 (am, is, are)
...
```

---

## 🎯 사용 팁

1. **단계별 진행**: 컴포넌트 먼저, 데이터 나중에
2. **참고 파일 활용**: 기존 Activity 구조 재사용
3. **검증 필수**: 생성 후 반드시 타입 체크 및 빌드 테스트
4. **점진적 개선**: 첫 버전은 기본 기능만, 이후 개선
