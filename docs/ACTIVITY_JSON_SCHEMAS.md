# Activity JSON 스키마 상세 설계

> **목적**: 모든 Activity 데이터의 표준 JSON 구조 정의

---

## 📁 파일 구조

```
data/activities/
├── vocabulary/
│   ├── week-1-vocab.json
│   ├── week-2-vocab.json
│   └── ... (8개)
├── reading/
│   ├── week-1-reading.json
│   └── ... (8개)
├── grammar/
│   ├── week-1-grammar.json
│   └── ... (8개)
├── listening/
│   ├── week-1-listening.json
│   └── ... (8개)
├── writing/
│   ├── week-1-writing.json
│   └── ... (8개)
└── speaking/
    ├── week-1-speaking.json
    └── ... (8개)
```

**총 48개 JSON 파일** (6 타입 × 8 주)

---

## 1️⃣ Vocabulary JSON 스키마

### TypeScript 인터페이스
```typescript
interface VocabularyActivity {
  id: string;
  weekId: string;
  type: 'vocabulary';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  words: VocabularyWord[];
  exercises: VocabularyExercise[];
}

interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string; // IPA 발음 기호
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
  meaning: string; // 한국어 뜻
  example: string; // 영어 예문
  exampleMeaning: string; // 예문 한국어 해석
  imageUrl?: string; // 선택적 이미지
  audioUrl?: string; // TTS로 생성할 예정
}

interface VocabularyExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching';
  question: string;
  options?: string[]; // multiple_choice용
  answer: string | string[]; // 정답
  explanation?: string; // 해설
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-vocab",
  "weekId": "week-1",
  "type": "vocabulary",
  "level": "A1",
  "title": "기본 인사 표현",
  "description": "일상생활에서 가장 많이 사용하는 인사 표현을 배웁니다.",

  "words": [
    {
      "id": "w1",
      "word": "Hello",
      "pronunciation": "/həˈloʊ/",
      "partOfSpeech": "noun",
      "meaning": "안녕하세요",
      "example": "Hello, how are you?",
      "exampleMeaning": "안녕하세요, 어떻게 지내세요?"
    },
    {
      "id": "w2",
      "word": "Good morning",
      "pronunciation": "/ɡʊd ˈmɔːrnɪŋ/",
      "partOfSpeech": "other",
      "meaning": "좋은 아침입니다",
      "example": "Good morning, everyone!",
      "exampleMeaning": "좋은 아침입니다, 여러분!"
    },
    {
      "id": "w3",
      "word": "Thank you",
      "pronunciation": "/θæŋk juː/",
      "partOfSpeech": "other",
      "meaning": "감사합니다",
      "example": "Thank you for your help.",
      "exampleMeaning": "도와주셔서 감사합니다."
    }
    // ... 총 20개 단어
  ],

  "exercises": [
    {
      "id": "ex1",
      "type": "multiple_choice",
      "question": "What does 'Hello' mean in Korean?",
      "options": ["안녕하세요", "감사합니다", "미안합니다", "잘 가세요"],
      "answer": "안녕하세요",
      "explanation": "'Hello'는 '안녕하세요'라는 뜻입니다."
    },
    {
      "id": "ex2",
      "type": "fill_blank",
      "question": "_____, how are you? (Hello를 넣으세요)",
      "answer": "Hello",
      "explanation": "인사말로 'Hello'를 사용합니다."
    },
    {
      "id": "ex3",
      "type": "matching",
      "question": "Match the English with Korean",
      "options": ["Hello", "Thank you", "Good morning"],
      "answer": ["안녕하세요", "감사합니다", "좋은 아침입니다"]
    }
    // ... 총 15개 연습 문제
  ]
}
```

---

## 2️⃣ Reading JSON 스키마

### TypeScript 인터페이스
```typescript
interface ReadingActivity {
  id: string;
  weekId: string;
  type: 'reading';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  passage: ReadingPassage;
  vocabulary: ReadingVocabulary[];
  questions: ReadingQuestion[];
}

interface ReadingPassage {
  text: string;
  wordCount: number;
  estimatedReadingTime: number; // 분
  audioText?: string; // TTS용 (문단 구분)
}

interface ReadingVocabulary {
  word: string;
  meaning: string;
  lineNumber?: number; // 지문 내 위치
}

interface ReadingQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-reading",
  "weekId": "week-1",
  "type": "reading",
  "level": "A1",
  "title": "자기소개",
  "description": "간단한 자기소개 글을 읽고 이해합니다.",

  "passage": {
    "text": "My name is Sarah. I am 25 years old. I live in Seoul with my family.\n\nI am a teacher. I teach English at a school. I like my job very much.\n\nIn my free time, I like reading books and watching movies. I also like cooking. My favorite food is pizza.",
    "wordCount": 58,
    "estimatedReadingTime": 2,
    "audioText": "My name is Sarah. I am 25 years old. I live in Seoul with my family. [PAUSE] I am a teacher. I teach English at a school. I like my job very much. [PAUSE] In my free time, I like reading books and watching movies. I also like cooking. My favorite food is pizza."
  },

  "vocabulary": [
    { "word": "teacher", "meaning": "선생님" },
    { "word": "free time", "meaning": "여가 시간" },
    { "word": "favorite", "meaning": "가장 좋아하는" }
  ],

  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "How old is Sarah?",
      "options": ["20", "25", "30", "35"],
      "answer": "25"
    },
    {
      "id": "q2",
      "type": "true_false",
      "question": "Sarah lives alone.",
      "options": ["True", "False"],
      "answer": "False",
      "explanation": "She lives with her family."
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "question": "What is Sarah's job?",
      "options": ["Doctor", "Teacher", "Cook", "Student"],
      "answer": "Teacher"
    },
    {
      "id": "q4",
      "type": "short_answer",
      "question": "What is Sarah's favorite food?",
      "answer": "Pizza"
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "question": "What does Sarah like to do in her free time?",
      "options": [
        "Reading and watching movies",
        "Playing sports",
        "Sleeping",
        "Shopping"
      ],
      "answer": "Reading and watching movies"
    }
  ]
}
```

---

## 3️⃣ Grammar JSON 스키마

### TypeScript 인터페이스
```typescript
interface GrammarActivity {
  id: string;
  weekId: string;
  type: 'grammar';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  topic: string;
  explanation: GrammarExplanation;
  exercises: GrammarExercise[];
}

interface GrammarExplanation {
  rule: string; // Markdown 형식
  usageNotes: string[]; // 사용 팁
  examples: GrammarExample[];
  commonMistakes?: string[]; // 흔한 실수
}

interface GrammarExample {
  english: string;
  korean: string;
  highlight?: string; // 강조할 부분
}

interface GrammarExercise {
  id: string;
  type: 'fill_blank' | 'choose_correct' | 'rearrange' | 'find_error';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-grammar",
  "weekId": "week-1",
  "type": "grammar",
  "level": "A1",
  "title": "Be 동사 (am, is, are)",
  "description": "Be 동사의 기본 사용법을 배웁니다.",

  "topic": "Be Verbs (am, is, are)",

  "explanation": {
    "rule": "# Be 동사 규칙\n\nBe 동사는 '~이다', '~있다'의 의미를 가진 동사입니다.\n\n## 인칭에 따른 변화\n- **I** → am\n- **You / We / They** → are\n- **He / She / It** → is\n\n## 문장 형태\n- 긍정문: I am happy.\n- 부정문: I am not happy.\n- 의문문: Are you happy?",

    "usageNotes": [
      "I는 항상 am과 함께 사용합니다.",
      "You는 단수/복수 모두 are를 사용합니다.",
      "He, She, It은 is를 사용합니다."
    ],

    "examples": [
      {
        "english": "I am a student.",
        "korean": "나는 학생입니다.",
        "highlight": "am"
      },
      {
        "english": "You are happy.",
        "korean": "너는 행복해.",
        "highlight": "are"
      },
      {
        "english": "She is my friend.",
        "korean": "그녀는 내 친구야.",
        "highlight": "is"
      },
      {
        "english": "We are teachers.",
        "korean": "우리는 선생님들입니다.",
        "highlight": "are"
      },
      {
        "english": "It is a book.",
        "korean": "그것은 책입니다.",
        "highlight": "is"
      }
    ],

    "commonMistakes": [
      "❌ I is a student. → ✅ I am a student.",
      "❌ You is happy. → ✅ You are happy.",
      "❌ She am a teacher. → ✅ She is a teacher."
    ]
  },

  "exercises": [
    {
      "id": "ex1",
      "type": "fill_blank",
      "question": "I ___ a teacher.",
      "answer": "am",
      "explanation": "I 뒤에는 항상 am을 사용합니다."
    },
    {
      "id": "ex2",
      "type": "fill_blank",
      "question": "They ___ students.",
      "answer": "are",
      "explanation": "They(그들은) 뒤에는 are를 사용합니다."
    },
    {
      "id": "ex3",
      "type": "choose_correct",
      "question": "She ___ a doctor. (is / are / am)",
      "options": ["is", "are", "am"],
      "answer": "is",
      "explanation": "She(그녀는) 뒤에는 is를 사용합니다."
    },
    {
      "id": "ex4",
      "type": "find_error",
      "question": "I is happy. (틀린 부분을 찾으세요)",
      "answer": "is → am",
      "explanation": "I 뒤에는 am을 사용해야 합니다."
    },
    {
      "id": "ex5",
      "type": "rearrange",
      "question": "다음 단어를 올바른 순서로 배열하세요: [a, I, am, student]",
      "answer": "I am a student",
      "explanation": "주어(I) + be동사(am) + 보어(a student) 순서입니다."
    }
    // ... 총 15개
  ]
}
```

---

## 4️⃣ Listening JSON 스키마

### TypeScript 인터페이스
```typescript
interface ListeningActivity {
  id: string;
  weekId: string;
  type: 'listening';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  audio: ListeningAudio;
  transcript: ListeningTranscript;
  questions: ListeningQuestion[];
}

interface ListeningAudio {
  text: string; // TTS로 변환할 텍스트
  speed: number; // 0.5 ~ 1.2
  duration: number; // 예상 재생 시간 (초)
  speaker?: 'male' | 'female' | 'both'; // 화자
}

interface ListeningTranscript {
  full: string;
  segments?: TranscriptSegment[]; // 타임스탬프별
  vocabulary?: { word: string; meaning: string; }[];
}

interface TranscriptSegment {
  startTime: number; // 초
  endTime: number;
  text: string;
  speaker?: string;
}

interface ListeningQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-listening",
  "weekId": "week-1",
  "type": "listening",
  "level": "A1",
  "title": "기본 인사 대화",
  "description": "간단한 인사 대화를 듣고 이해합니다.",

  "audio": {
    "text": "A: Hello. My name is Tom. B: Hi Tom. I am Sarah. Nice to meet you. A: Nice to meet you too. Where are you from? B: I am from Korea. How about you? A: I am from Canada.",
    "speed": 0.6,
    "duration": 25,
    "speaker": "both"
  },

  "transcript": {
    "full": "A: Hello. My name is Tom.\nB: Hi Tom. I am Sarah. Nice to meet you.\nA: Nice to meet you too. Where are you from?\nB: I am from Korea. How about you?\nA: I am from Canada.",

    "segments": [
      {
        "startTime": 0,
        "endTime": 3,
        "text": "Hello. My name is Tom.",
        "speaker": "A"
      },
      {
        "startTime": 3,
        "endTime": 8,
        "text": "Hi Tom. I am Sarah. Nice to meet you.",
        "speaker": "B"
      },
      {
        "startTime": 8,
        "endTime": 13,
        "text": "Nice to meet you too. Where are you from?",
        "speaker": "A"
      },
      {
        "startTime": 13,
        "endTime": 18,
        "text": "I am from Korea. How about you?",
        "speaker": "B"
      },
      {
        "startTime": 18,
        "endTime": 22,
        "text": "I am from Canada.",
        "speaker": "A"
      }
    ],

    "vocabulary": [
      { "word": "Nice to meet you", "meaning": "만나서 반가워요" },
      { "word": "Where are you from", "meaning": "어디 출신이에요?" }
    ]
  },

  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "What is the man's name?",
      "options": ["Tom", "Sarah", "John", "Mike"],
      "answer": "Tom"
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "question": "Where is Sarah from?",
      "options": ["Canada", "Korea", "USA", "Japan"],
      "answer": "Korea"
    },
    {
      "id": "q3",
      "type": "true_false",
      "question": "Tom is from Korea.",
      "options": ["True", "False"],
      "answer": "False",
      "explanation": "Tom is from Canada, not Korea."
    }
  ]
}
```

---

## 5️⃣ Writing JSON 스키마

### TypeScript 인터페이스
```typescript
interface WritingActivity {
  id: string;
  weekId: string;
  type: 'writing';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  prompt: WritingPrompt;
  requirements: WritingRequirements;
  sampleAnswer: string;
  rubric?: WritingRubric;
}

interface WritingPrompt {
  task: string; // 과제 설명
  situation?: string; // 상황 설명
  hints?: string[]; // 힌트
}

interface WritingRequirements {
  minWords: number;
  maxWords: number;
  mustInclude?: string[]; // 반드시 포함할 표현
  suggestedStructure?: string[]; // 추천 구조
  targetGrammar?: string[]; // 사용해야 할 문법
}

interface WritingRubric {
  content: string; // 내용 평가 기준
  grammar: string; // 문법 평가 기준
  vocabulary: string; // 어휘 평가 기준
  organization: string; // 구성 평가 기준
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-writing",
  "weekId": "week-1",
  "type": "writing",
  "level": "A1",
  "title": "자기소개 쓰기",
  "description": "자신을 소개하는 짧은 글을 작성합니다.",

  "prompt": {
    "task": "자신을 3-5 문장으로 소개하는 글을 쓰세요.",
    "situation": "새로운 친구에게 자신을 소개한다고 생각하세요.",
    "hints": [
      "이름과 나이를 말하세요",
      "어디에 사는지 말하세요",
      "무엇을 좋아하는지 말하세요"
    ]
  },

  "requirements": {
    "minWords": 30,
    "maxWords": 50,
    "mustInclude": [
      "My name is...",
      "I am...",
      "I like..."
    ],
    "suggestedStructure": [
      "1. 이름 소개",
      "2. 나이/직업 소개",
      "3. 거주지 소개",
      "4. 좋아하는 것 소개"
    ],
    "targetGrammar": [
      "Be 동사 (am, is, are)",
      "현재형"
    ]
  },

  "sampleAnswer": "My name is Alex. I am 22 years old. I am a student. I live in Seoul with my family. I like reading books and playing soccer. I also like pizza. Nice to meet you!",

  "rubric": {
    "content": "모든 필수 정보 포함 (이름, 나이, 거주지, 좋아하는 것)",
    "grammar": "Be 동사 올바르게 사용",
    "vocabulary": "기본 어휘 적절하게 사용",
    "organization": "논리적인 순서로 작성"
  }
}
```

---

## 6️⃣ Speaking JSON 스키마

### TypeScript 인터페이스
```typescript
interface SpeakingActivity {
  id: string;
  weekId: string;
  type: 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  description: string;

  task: SpeakingTask;
  modelAnswer: SpeakingModel;
  tips: SpeakingTips;
  evaluation?: SpeakingEvaluation;
}

interface SpeakingTask {
  instruction: string;
  situation?: string;
  timeLimit: number; // 초
  preparationTime?: number; // 준비 시간 (초)
}

interface SpeakingModel {
  text: string; // 모델 답안 텍스트
  audioSpeed: number; // TTS 속도
  keyPhrases?: string[]; // 핵심 표현
}

interface SpeakingTips {
  pronunciation: string[]; // 발음 팁
  grammar: string[]; // 문법 팁
  fluency: string[]; // 유창성 팁
}

interface SpeakingEvaluation {
  criteria: {
    pronunciation: string;
    fluency: string;
    content: string;
    grammar: string;
  };
}
```

### JSON 예시 (Week 1 - A1)
```json
{
  "id": "week-1-speaking",
  "weekId": "week-1",
  "type": "speaking",
  "level": "A1",
  "title": "자기소개 말하기",
  "description": "자신을 소개하는 짧은 말하기 연습을 합니다.",

  "task": {
    "instruction": "자신을 3-5 문장으로 소개하세요.",
    "situation": "처음 만난 사람에게 자신을 소개한다고 생각하세요.",
    "timeLimit": 30,
    "preparationTime": 30
  },

  "modelAnswer": {
    "text": "Hello. My name is Alex. I am 22 years old. I am a student. I like reading books. Nice to meet you.",
    "audioSpeed": 0.6,
    "keyPhrases": [
      "My name is...",
      "I am...",
      "I like...",
      "Nice to meet you"
    ]
  },

  "tips": {
    "pronunciation": [
      "'Hello'는 '헬로우'가 아닌 '헬로'로 발음하세요",
      "'My name is'는 연음하여 '마이 네임 이즈'로 발음하세요",
      "'Nice to meet you'에서 't'는 약하게 발음됩니다"
    ],
    "grammar": [
      "Be 동사를 정확히 사용하세요 (I am, You are, He/She is)",
      "현재형으로 말하세요"
    ],
    "fluency": [
      "천천히, 또박또박 말하세요",
      "문장 사이에 짧은 pause를 두세요",
      "자신감 있게 말하세요"
    ]
  },

  "evaluation": {
    "criteria": {
      "pronunciation": "명확하게 발음했는가?",
      "fluency": "자연스럽게 말했는가?",
      "content": "필요한 정보를 모두 포함했는가?",
      "grammar": "Be 동사를 올바르게 사용했는가?"
    }
  }
}
```

---

## 📂 파일 네이밍 규칙

### 일관된 네이밍
```
{type}-week-{weekNumber}.json

예시:
- vocabulary-week-1.json
- reading-week-1.json
- grammar-week-1.json
- listening-week-1.json
- writing-week-1.json
- speaking-week-1.json
```

### ID 규칙
```
{weekId}-{type}

예시:
- week-1-vocab
- week-1-reading
- week-1-grammar
- week-1-listening
- week-1-writing
- week-1-speaking
```

---

## 🔄 데이터 로딩 전략

### 옵션 1: Dynamic Import (선택됨)
```typescript
// hooks/useActivityData.ts
import { useQuery } from '@tanstack/react-query';

export function useActivityData(type: ActivityType, weekId: string) {
  return useQuery(
    ['activityData', type, weekId],
    async () => {
      const data = await import(
        `@/data/activities/${type}/${type}-${weekId}.json`
      );
      return data.default;
    },
    {
      staleTime: Infinity, // 정적 데이터이므로 캐싱
      cacheTime: 1000 * 60 * 60, // 1시간
    }
  );
}
```

### 옵션 2: API Route (나중에)
```typescript
// app/api/activities/[type]/[weekId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { type: string; weekId: string } }
) {
  const data = await import(
    `@/data/activities/${params.type}/${params.type}-${params.weekId}.json`
  );
  return Response.json(data.default);
}
```

---

## ✅ JSON 작성 체크리스트

### 모든 Activity 공통
- [ ] ID 형식 확인 ({weekId}-{type})
- [ ] weekId 정확성
- [ ] type 정확성
- [ ] level 정확성 (A1, A2, B1, B2)
- [ ] title 명확성
- [ ] description 유용성

### Vocabulary 전용
- [ ] 단어 20개 이상
- [ ] 발음 기호 정확성
- [ ] 예문 품질 (레벨에 맞는지)
- [ ] 연습 문제 15개 이상
- [ ] 다양한 문제 유형 (객관식, 빈칸, 매칭)

### Reading 전용
- [ ] 지문 길이 (레벨별 기준 준수)
- [ ] 단어 수 카운트 정확성
- [ ] 어휘 리스트 유용성
- [ ] 질문 5개 (사실, 추론, 어휘 혼합)
- [ ] TTS용 텍스트 (pause 포함)

### Grammar 전용
- [ ] 규칙 설명 명확성 (한국어)
- [ ] 예문 10개 이상
- [ ] 연습 문제 15개 이상
- [ ] 흔한 실수 목록
- [ ] 다양한 문제 유형

### Listening 전용
- [ ] 스크립트 난이도 (레벨별)
- [ ] 속도 설정 (레벨별 기준)
- [ ] 타임스탬프 정확성
- [ ] 어휘 리스트
- [ ] 질문 3-5개

### Writing 전용
- [ ] 과제 명확성
- [ ] 요구사항 구체성 (단어 수, 필수 표현)
- [ ] 모범 답안 품질
- [ ] 평가 기준 명확성

### Speaking 전용
- [ ] 과제 명확성
- [ ] 모델 답안 적절성
- [ ] 발음 팁 유용성
- [ ] 시간 제한 적절성

---

## 🎯 다음 단계

**완료**: 6가지 Activity 타입 JSON 스키마 설계 ✅

**다음**: Web Speech API 및 MediaRecorder API 기술 검증
- 브라우저 호환성 테스트
- TTS 품질 확인
- 녹음 기능 테스트
- 실제 구현 가능 여부 확인
