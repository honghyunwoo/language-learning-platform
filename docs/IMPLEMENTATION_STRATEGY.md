# 구현 전략 (Implementation Strategy)

**작성일**: 2025-10-05
**목적**: 미구현 기능들을 어떻게 구현할지 전략 수립

---

## 🎯 핵심 질문들

### 1. Activity 학습 콘텐츠 - 어떻게 만들 것인가?

#### 옵션 A: 정적 JSON 데이터 (빠름, 간단)
```typescript
// content/activities/reading/week1-day1.json
{
  "id": "reading-w1-d1",
  "type": "reading",
  "title": "Daily Routines",
  "passage": "My name is Sarah. I wake up at 7 AM every day...",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What time does Sarah wake up?",
      "options": ["6 AM", "7 AM", "8 AM", "9 AM"],
      "correctAnswer": 1
    }
  ],
  "vocabulary": [
    { "word": "wake up", "meaning": "잠에서 깨다" }
  ]
}
```

**장점**:
- 빠르게 구현 가능
- 복잡한 백엔드 불필요
- 버전 관리 쉬움 (Git)

**단점**:
- 수동으로 콘텐츠 작성 필요
- 확장성 제한적
- 동적 생성 불가

#### 옵션 B: Firestore에 저장 (유연함, 관리 편함)
```typescript
// Firestore Collection: activityContents
{
  id: "reading-w1-d1",
  type: "reading",
  title: "Daily Routines",
  passage: "...",
  questions: [...],
  vocabulary: [...]
}
```

**장점**:
- CMS처럼 관리 가능
- 실시간 업데이트
- 사용자별 맞춤 콘텐츠 가능

**단점**:
- 초기 데이터 입력 필요
- Firestore 쿼리 비용
- 복잡도 증가

#### 옵션 C: 외부 API 사용 (자동화)
```typescript
// 예: OpenAI API로 콘텐츠 생성
const generateReadingContent = async (level: string, topic: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Generate A1 level reading passage..." }
    ]
  });
  return response.choices[0].message.content;
};
```

**장점**:
- 자동 콘텐츠 생성
- 무한 확장 가능
- 개인화 쉬움

**단점**:
- API 비용 발생
- 품질 관리 어려움
- 외부 의존성

#### 💡 추천: **하이브리드 접근**
```
1단계: 정적 JSON으로 샘플 콘텐츠 (빠른 MVP)
2단계: Firestore로 마이그레이션 (관리 편의성)
3단계: AI 생성 추가 (확장성)
```

---

### 2. Listening 콘텐츠 - 오디오는 어디서?

#### 옵션 A: TTS (Text-to-Speech) 사용
```typescript
// Web Speech API (무료)
const speak = (text: string, lang: string = 'en-US') => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
};
```

**장점**:
- 무료
- 브라우저 내장
- 즉시 사용 가능

**단점**:
- 음질 제한적
- 브라우저별 차이
- 자연스럽지 않음

#### 옵션 B: 외부 TTS API (Google, AWS Polly)
```typescript
// Google Cloud TTS
const audioContent = await textToSpeech.synthesizeSpeech({
  input: { text: "Hello, how are you?" },
  voice: { languageCode: 'en-US', name: 'en-US-Neural2-A' },
  audioConfig: { audioEncoding: 'MP3' }
});
```

**장점**:
- 고품질 음성
- 다양한 목소리
- 자연스러움

**단점**:
- API 비용
- 네트워크 의존
- 저장 공간 필요

#### 옵션 C: 녹음 파일 업로드
```typescript
// Firebase Storage에 미리 녹음된 MP3 저장
const audioUrl = await getDownloadURL(ref(storage, 'audios/week1-day1.mp3'));
```

**장점**:
- 최고 품질
- 완전 제어

**단점**:
- 수동 녹음 필요
- Storage 비용
- 시간 소요

#### 💡 추천: **옵션 A (Web Speech API)**
- 이유: MVP에 충분, 무료, 빠른 구현

---

### 3. Speaking 기능 - 녹음은 어떻게?

#### 옵션 A: MediaRecorder API (브라우저 내장)
```typescript
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  recorder.start();
};
```

**장점**:
- 무료
- 브라우저 내장
- 간단한 구현

**단점**:
- 발음 평가 불가
- 저장만 가능

#### 옵션 B: 발음 평가 API (Azure Speech)
```typescript
// Azure Speech to Text + Pronunciation Assessment
const result = await speechRecognizer.recognizeOnceAsync(audioConfig);
const pronunciationScore = result.properties.getProperty(
  PropertyId.SpeechServiceResponse_JsonResult
);
```

**장점**:
- 발음 점수 제공
- 정확도 평가
- 피드백 가능

**단점**:
- API 비용
- 복잡도 증가

#### 💡 추천: **옵션 A (MediaRecorder)**
- 이유: MVP에 충분, 나중에 평가 기능 추가 가능

---

### 4. Writing 기능 - 첨삭은 어떻게?

#### 옵션 A: 단순 제출 (첨삭 없음)
```typescript
const submitWriting = async (content: string) => {
  await addDoc(collection(db, 'writings'), {
    userId,
    content,
    submittedAt: new Date()
  });
};
```

**장점**:
- 즉시 구현 가능
- 비용 없음

**단점**:
- 피드백 없음
- 학습 효과 제한적

#### 옵션 B: AI 첨삭 (GPT API)
```typescript
const getAIFeedback = async (writing: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an English teacher..." },
      { role: "user", content: `Please review: ${writing}` }
    ]
  });
  return response.choices[0].message.content;
};
```

**장점**:
- 즉각 피드백
- 문법/표현 교정
- 개인화된 조언

**단점**:
- API 비용 높음
- 품질 보장 어려움

#### 옵션 C: 사람 첨삭 (커뮤니티)
```typescript
// 다른 사용자나 튜터가 첨삭
const requestReview = async (writingId: string) => {
  await updateDoc(doc(db, 'writings', writingId), {
    status: 'pending_review',
    reviewRequested: true
  });
};
```

**장점**:
- 고품질 피드백
- 커뮤니티 활성화

**단점**:
- 시간 지연
- 튜터 필요

#### 💡 추천: **옵션 A → B 순차 구현**
1. 먼저 제출 기능만 (빠른 MVP)
2. 나중에 AI 첨삭 추가

---

### 5. 커뮤니티 - 어떤 구조로?

#### 데이터 구조 설계
```typescript
// Firestore Collections
{
  posts: {
    id: string;
    userId: string;
    category: 'question' | 'tip' | 'review';
    title: string;
    content: string; // Markdown
    tags: string[];
    likes: number;
    views: number;
    createdAt: Date;
  },

  comments: {
    id: string;
    postId: string;
    userId: string;
    content: string;
    likes: number;
    createdAt: Date;
  },

  bookmarks: {
    userId: string;
    postId: string;
    createdAt: Date;
  }
}
```

#### 에디터 선택
**옵션 A**: Textarea (간단)
**옵션 B**: react-markdown + react-simplemde-editor (마크다운)
**옵션 C**: Tiptap/Lexical (WYSIWYG)

**추천**: 옵션 B (마크다운)
- 이유: 개발자 친화적, 코드 블록 지원

---

## 🛠️ 기술 스택 결정

### 필요한 라이브러리

#### 1. Activity 콘텐츠 관련
```json
{
  "react-markdown": "^9.0.0",        // 마크다운 렌더링
  "react-syntax-highlighter": "^15.5.0" // 코드 하이라이트
}
```

#### 2. 오디오/녹음 관련
```json
{
  // 브라우저 내장 API 사용 (추가 라이브러리 불필요)
  // MediaRecorder, SpeechSynthesis
}
```

#### 3. 커뮤니티 관련
```json
{
  "react-simplemde-editor": "^5.2.0", // 마크다운 에디터
  "date-fns": "^3.0.0"                // 날짜 포맷팅
}
```

#### 4. UX 개선
```json
{
  "react-hot-toast": "^2.4.1",        // Toast 알림
  "framer-motion": "^10.0.0"          // 애니메이션 (선택)
}
```

---

## 📋 구현 단계별 계획

### Phase 1: 긴급 수정 (1일)
**목표**: 현재 작동하지 않는 것들 수정

```
1. Error Boundary 추가
   - components/ErrorBoundary.tsx 생성
   - app/layout.tsx에 적용

2. Toast Notification
   - react-hot-toast 설치
   - lib/toast.ts 유틸 생성
   - 모든 mutation에 적용

3. 작동 안 하는 링크 처리
   - /level-test → "준비 중" 페이지
   - /community → 커뮤니티 페이지 (기본)
   - /dashboard/community → 동일

4. Firebase Security Rules
   - firestore.rules 수정
   - 배포
```

---

### Phase 2: Vocabulary Activity (2-3일)
**목표**: 가장 간단한 Activity 구현

```
1. 데이터 구조 정의
   - types/activity-content.ts
   - VocabularyContent 타입

2. 샘플 콘텐츠 생성
   - content/activities/vocabulary/week1-day1.json
   - 10개 단어 리스트

3. 컴포넌트 구현
   - components/activity/VocabularyFlashcard.tsx
   - components/activity/VocabularyQuiz.tsx
   - components/activity/VocabularyList.tsx

4. Activity 페이지 통합
   - app/dashboard/curriculum/[weekId]/[activityId]/page.tsx
   - activity.type === 'vocabulary' 분기 처리
```

**구현 방법**:
```typescript
// Vocabulary 데이터 구조
interface VocabularyContent {
  id: string;
  words: Array<{
    word: string;
    meaning: string;
    pronunciation?: string;
    example: string;
    translation: string;
  }>;
  quizzes: Array<{
    type: 'matching' | 'fill-blank';
    question: string;
    options?: string[];
    correctAnswer: string | number;
  }>;
}

// 플래시카드 컴포넌트
const VocabularyFlashcard = ({ word, meaning, example }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div onClick={() => setFlipped(!flipped)}>
      {flipped ? (
        <div>{meaning}</div>
      ) : (
        <div>{word}</div>
      )}
    </div>
  );
};
```

---

### Phase 3: Reading Activity (3-4일)
**목표**: 핵심 학습 콘텐츠

```
1. 데이터 구조
   - ReadingContent 타입
   - Question 타입 (multiple-choice, short-answer)

2. 샘플 콘텐츠
   - A1 레벨 지문 5개
   - 각 지문당 5-7개 문제

3. 컴포넌트
   - components/activity/ReadingPassage.tsx
   - components/activity/ReadingQuestion.tsx
   - components/activity/VocabularyTooltip.tsx

4. 기능
   - 단어 클릭 시 뜻 툴팁
   - 문제 풀이 및 정답 확인
   - 정답/해설 표시
```

**구현 방법**:
```typescript
interface ReadingContent {
  passage: string;
  vocabulary: Array<{ word: string; meaning: string; }>;
  questions: Array<{
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  }>;
}

// 툴팁 컴포넌트
const VocabularyTooltip = ({ word, meaning }) => {
  return (
    <span className="relative group">
      <span className="cursor-help underline decoration-dotted">
        {word}
      </span>
      <div className="absolute hidden group-hover:block">
        {meaning}
      </div>
    </span>
  );
};
```

---

### Phase 4: Grammar Activity (2-3일)
**목표**: 문법 설명 + 연습

```
1. 데이터 구조
   - GrammarContent 타입

2. 샘플 콘텐츠
   - 문법 규칙 설명
   - 예시 문장
   - 연습 문제

3. 컴포넌트
   - components/activity/GrammarExplanation.tsx
   - components/activity/GrammarExercise.tsx
```

---

### Phase 5: Listening Activity (2-3일)
**목표**: 듣기 연습

```
1. TTS 통합
   - Web Speech API 사용
   - 재생/일시정지/속도 조절

2. 컴포넌트
   - components/activity/AudioPlayer.tsx
   - components/activity/ListeningQuestion.tsx
   - components/activity/ScriptToggle.tsx

3. 기능
   - 오디오 재생
   - 스크립트 보기/숨기기
   - 문제 풀이
```

**구현 방법**:
```typescript
const TextToSpeech = ({ text, lang = 'en-US' }) => {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0; // 속도

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  return (
    <button onClick={speak}>
      {speaking ? 'Playing...' : 'Play'}
    </button>
  );
};
```

---

### Phase 6: Writing Activity (2-3일)
**목표**: 작문 연습

```
1. 에디터
   - Textarea (간단한 텍스트)

2. 제출 기능
   - Firestore에 저장
   - 제출 이력 조회

3. 예시 답안
   - 샘플 답안 표시
```

---

### Phase 7: Speaking Activity (2-3일)
**목표**: 말하기 연습

```
1. 녹음 기능
   - MediaRecorder API
   - 녹음 시작/중지
   - 오디오 재생

2. 저장
   - Blob → Firestore (base64)
   - 또는 나중에 Storage (결제 후)
```

**구현 방법**:
```typescript
const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop' : 'Record'}
      </button>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};
```

---

### Phase 8: 커뮤니티 (3-5일)
**목표**: 기본 게시판

```
1. 데이터 구조
   - types/community.ts
   - Post, Comment 타입

2. 페이지
   - app/dashboard/community/page.tsx (목록)
   - app/dashboard/community/[postId]/page.tsx (상세)
   - app/dashboard/community/new/page.tsx (작성)

3. 컴포넌트
   - components/community/PostCard.tsx
   - components/community/CommentList.tsx
   - components/community/MarkdownEditor.tsx

4. 기능
   - 게시글 CRUD
   - 댓글 CRUD
   - 좋아요/북마크
```

---

## 💰 비용 고려사항

### 무료로 가능한 것
- ✅ Firestore (1일 50K reads, 20K writes)
- ✅ Firebase Authentication (무제한)
- ✅ Web Speech API (TTS)
- ✅ MediaRecorder API (녹음)
- ✅ Firebase Hosting (10GB/월)

### 비용 발생 (선택 사항)
- ❌ Firebase Storage (결제 필요) → 나중에
- ❌ OpenAI API (AI 첨삭) → 나중에
- ❌ Azure Speech (발음 평가) → 나중에
- ❌ Google Cloud TTS (고품질 음성) → 나중에

### 💡 전략: MVP는 무료 기술만 사용

---

## 🎯 최종 추천 전략

### 우선순위
```
Tier 1 (긴급): Error Boundary, Toast, 링크 수정, Security Rules
Tier 2 (핵심): Vocabulary → Reading → Grammar
Tier 3 (확장): Listening → Writing → Speaking
Tier 4 (커뮤니티): 게시판 기본 기능
Tier 5 (고도화): AI 기능, 발음 평가 등
```

### 기술 선택
```
✅ 정적 JSON (Activity 콘텐츠)
✅ Web Speech API (TTS)
✅ MediaRecorder (녹음)
✅ Textarea (Writing)
✅ react-markdown (커뮤니티)
✅ react-hot-toast (알림)
```

### 일정
```
Week 1: Tier 1 + Tier 2 시작
Week 2: Tier 2 완료 + Tier 3 시작
Week 3: Tier 3 완료 + Tier 4
Week 4: 품질 개선 + 테스트
```

---

## 🤔 고민해야 할 질문들

### 1. 콘텐츠 품질
- [ ] 직접 작성 vs AI 생성 vs 기존 자료 활용?
- [ ] 난이도 검증은 어떻게?
- [ ] 콘텐츠 양은 얼마나?

### 2. 사용자 경험
- [ ] 모바일 최적화는?
- [ ] 오프라인 지원은?
- [ ] 학습 데이터 분석은?

### 3. 확장성
- [ ] 다른 언어 추가 가능하게?
- [ ] 난이도별 콘텐츠 관리는?
- [ ] CMS 도입 필요?

---

**다음 단계**: 이 전략을 바탕으로 구현 시작 여부 결정
