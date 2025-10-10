# 상세 구현 계획 (Detailed Implementation Plan)

**작성일**: 2025-10-05
**기준**: 원본 PRD vs 현재 구현 상태 비교 분석
**목적**: 실행 가능한 단계별 상세 계획 수립

---

## 📊 PRD vs 현재 구현 상태 분석

### PRD Must Have 기능 (3.1)
1. ✅ **체계적인 학습 커리큘럼 제공** - 구조만 완성
2. ❌ **학습 리소스 큐레이션 데이터베이스** - 없음
3. ❌ **블로그 시스템** (커뮤니티) - 없음
4. ✅ **진도 추적 및 대시보드** - 완성
5. ✅ **모바일 반응형 디자인** - 완성

### 현재 vs PRD 갭 분석

#### 갭 1: Activity 실제 콘텐츠 (PRD에는 명시 안 됨, 하지만 필수)
**PRD 원문**: "커리큘럼은 각 주차별로 **매일 수행할 활동**으로 세분화되며, 활동은 **입력(읽기, 듣기)과 출력(말하기, 쓰기)**이 균형 있게 배치됩니다"

**현재 상태**:
- 활동 구조만 있음
- 실제 지문, 문제, 오디오 없음
- "임시 콘텐츠 영역"만 표시

**필요한 것**:
- Reading: 영어 지문 + 독해 문제
- Listening: 오디오/TTS + 듣기 문제
- Speaking: 녹음 기능 + 샘플 문장
- Writing: 에디터 + 제출
- Vocabulary: 단어장 + 플래시카드
- Grammar: 문법 설명 + 연습 문제

#### 갭 2: 학습 리소스 큐레이션 (PRD 3.1.2)
**PRD 원문**: "검증된 무료 학습 리소스를 체계적으로 분류... YouTube 채널, 팟캐스트, 웹사이트, 앱"

**현재 상태**: 완전히 없음

**필요한 것**:
- Firestore resources 컬렉션
- 필터링/검색 UI
- 리소스 카드 컴포넌트
- 큐레이션 데이터 입력

#### 갭 3: 블로그 시스템 (PRD 3.1.3)
**PRD 원문**: "사용자들이 자신의 학습 여정, 팁, 경험을 공유... 각 사용자가 자신만의 학습 일지"

**현재 상태**:
- 링크만 있음 (/community)
- 페이지 없음

**필요한 것**:
- 커뮤니티 페이지
- 게시글 CRUD
- 댓글 시스템
- 좋아요/북마크

---

## 🎯 핵심 결정 사항

### 결정 1: Activity 콘텐츠 구현 방식

#### 옵션 비교
| 옵션 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A. 정적 JSON | 빠름, 간단, 무료 | 확장성 제한 | ✅ 1단계 |
| B. Firestore | 관리 편함, 동적 | 초기 입력 필요 | ⏳ 2단계 |
| C. AI 생성 | 자동화, 무한 | 비용, 품질 불안 | ❌ 제외 |

#### 최종 선택: **정적 JSON → Firestore 하이브리드**

**1단계 (즉시)**: 정적 JSON
```typescript
// content/activities/vocabulary/a1-week1.json
{
  "id": "vocab-a1-w1",
  "level": "A1",
  "week": 1,
  "type": "vocabulary",
  "words": [
    {
      "word": "hello",
      "meaning": "안녕하세요",
      "pronunciation": "헬로우",
      "example": "Hello, how are you?",
      "translation": "안녕하세요, 어떻게 지내세요?"
    }
  ]
}

// 12주 × 6가지 활동 = 72개 JSON 파일 필요
// 현실적으로: 우선 4주치만 (24개)
```

**2단계 (나중)**: Firestore로 마이그레이션
- 관리자 페이지에서 CRUD
- 사용자별 맞춤 콘텐츠

### 결정 2: 오디오 소스

#### 옵션 비교
| 옵션 | 장점 | 단점 | 선택 |
|------|------|------|------|
| Web Speech API | 무료, 즉시 가능 | 품질 제한 | ✅ |
| Google Cloud TTS | 고품질 | 비용 발생 | ❌ |
| 직접 녹음 | 최고 품질 | 시간 소요 | ❌ |

**최종 선택**: Web Speech API
- 이유: PRD의 "완전 무료" 원칙 준수
- 나중에 업그레이드 가능

### 결정 3: 커뮤니티 vs Activity 우선순위

#### 고민: 무엇을 먼저?

**옵션 A**: Activity 먼저 → 커뮤니티
- 장점: 학습 플랫폼 핵심 완성
- 단점: 커뮤니티 없어서 동기 부여 부족

**옵션 B**: 커뮤니티 먼저 → Activity
- 장점: 사용자 참여 빠르게 유도
- 단점: 학습할 콘텐츠가 없음

**PRD 근거**:
> "첫 3개월 내에... 사용자가 직접 작성한 학습 경험 공유 글이 월 50개 이상"

**최종 선택**: **병행 개발**
- Week 1: Activity 기본 (Vocabulary, Reading)
- Week 2: 커뮤니티 기본 (게시판)
- Week 3: Activity 확장 + 커뮤니티 고도화

---

## 📅 4주 상세 실행 계획

### Week 1: 긴급 수정 + 핵심 Activity

#### Day 1: 긴급 수정 (8시간)
```
[ ] Error Boundary 추가 (1시간)
    - components/ErrorBoundary.tsx 생성
    - app/layout.tsx에 적용
    - 테스트: 에러 발생 시나리오

[ ] Toast Notification (1.5시간)
    - npm install react-hot-toast
    - lib/toast.ts 유틸 생성
    - 모든 mutation에 적용

[ ] 작동 안 하는 링크 수정 (2시간)
    - /level-test → app/level-test/page.tsx (준비 중 페이지)
    - /community → app/dashboard/community/page.tsx (기본)

[ ] Firebase Security Rules (2시간)
    - firestore.rules 수정
    - storage.rules 작성 (나중을 위해)
    - Firebase Console에 배포
    - 테스트: 권한 확인

[ ] Environment Variable Validation (1시간)
    - lib/firebase.ts에 검증 로직
    - 누락 시 명확한 에러 메시지

[ ] 문서 정리 (0.5시간)
    - CHANGELOG.md 업데이트
    - 진행 상황 기록
```

#### Day 2-3: Vocabulary Activity (16시간)
```
[ ] 데이터 구조 설계 (2시간)
    - types/activity-content.ts
    - VocabularyContent 인터페이스
    - QuizQuestion 인터페이스

[ ] 샘플 콘텐츠 생성 (4시간)
    - content/activities/vocabulary/a1-week1.json
    - 50개 단어 (A1 레벨 필수 어휘)
    - 10개 퀴즈 문제 (매칭, 빈칸)

[ ] Flashcard 컴포넌트 (3시간)
    - components/activity/VocabularyFlashcard.tsx
    - 앞면/뒷면 flip 애니메이션
    - 다음/이전 버튼
    - 진행률 표시

[ ] Quiz 컴포넌트 (3시간)
    - components/activity/VocabularyQuiz.tsx
    - 매칭 문제 (drag & drop or 선택)
    - 빈칸 채우기
    - 정답 확인 및 피드백

[ ] Activity 페이지 통합 (3시간)
    - app/dashboard/curriculum/[weekId]/[activityId]/page.tsx 수정
    - activity.type === 'vocabulary' 분기
    - JSON 파일 로드
    - 컴포넌트 렌더링

[ ] 테스트 및 버그 수정 (1시간)
```

**구현 예시 코드**:
```typescript
// types/activity-content.ts
export interface VocabularyWord {
  word: string;
  meaning: string;
  pronunciation?: string;
  example: string;
  translation: string;
  audioUrl?: string; // TTS 생성
}

export interface VocabularyQuiz {
  id: string;
  type: 'matching' | 'fill-blank' | 'multiple-choice';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface VocabularyContent {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  week: number;
  title: string;
  words: VocabularyWord[];
  quizzes: VocabularyQuiz[];
}

// components/activity/VocabularyFlashcard.tsx
const VocabularyFlashcard = ({ word }: { word: VocabularyWord }) => {
  const [flipped, setFlipped] = useState(false);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="relative w-full h-64 cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`card-flip ${flipped ? 'flipped' : ''}`}>
        {/* 앞면 */}
        <div className="card-front">
          <h2 className="text-4xl font-bold">{word.word}</h2>
          <button onClick={(e) => { e.stopPropagation(); speak(); }}>
            🔊 발음 듣기
          </button>
          <p className="text-sm text-gray-500">클릭하여 뜻 보기</p>
        </div>

        {/* 뒷면 */}
        <div className="card-back">
          <h3 className="text-2xl font-semibold">{word.meaning}</h3>
          <p className="mt-4">{word.example}</p>
          <p className="text-gray-600">{word.translation}</p>
        </div>
      </div>
    </div>
  );
};
```

#### Day 4-5: Reading Activity (16시간)
```
[ ] 데이터 구조 (2시간)
    - types/activity-content.ts에 ReadingContent 추가
    - ReadingQuestion 인터페이스

[ ] 샘플 콘텐츠 생성 (5시간)
    - content/activities/reading/a1-week1.json
    - A1 레벨 지문 3개 (각 150-200 단어)
    - 각 지문당 5-7개 문제
    - 어휘 주석 (10-15개 단어)

[ ] Passage 컴포넌트 (3시간)
    - components/activity/ReadingPassage.tsx
    - 텍스트 렌더링
    - 어휘 툴팁 (클릭/호버)
    - TTS 읽어주기 기능

[ ] Question 컴포넌트 (4시간)
    - components/activity/ReadingQuestion.tsx
    - Multiple choice
    - True/False
    - Short answer
    - 정답 확인 및 해설

[ ] Activity 페이지 통합 (2시간)
    - activity.type === 'reading' 분기
    - 진행 상태 저장
```

**샘플 콘텐츠 예시**:
```json
{
  "id": "reading-a1-week1-day1",
  "level": "A1",
  "week": 1,
  "title": "My Daily Routine",
  "passage": "My name is Sarah. I wake up at 7 AM every day. I brush my teeth and eat breakfast. I like toast and coffee for breakfast. Then I go to work by bus. I work from 9 AM to 5 PM...",
  "vocabulary": [
    { "word": "wake up", "meaning": "잠에서 깨다" },
    { "word": "brush my teeth", "meaning": "양치하다" },
    { "word": "breakfast", "meaning": "아침 식사" }
  ],
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What time does Sarah wake up?",
      "options": ["6 AM", "7 AM", "8 AM", "9 AM"],
      "correctAnswer": 1,
      "explanation": "The passage says 'I wake up at 7 AM every day.'"
    }
  ]
}
```

---

### Week 2: 커뮤니티 기본 + Grammar Activity

#### Day 6-7: 커뮤니티 기본 구조 (16시간)
```
[ ] 데이터 구조 (2시간)
    - types/community.ts
    - Post, Comment, Like, Bookmark 인터페이스

[ ] Firestore 설정 (1시간)
    - posts, comments 컬렉션 생성
    - Security Rules 추가

[ ] 게시판 목록 페이지 (4시간)
    - app/dashboard/community/page.tsx
    - 게시글 카드 컴포넌트
    - 필터 (카테고리, 태그)
    - 무한 스크롤

[ ] 게시글 상세 페이지 (3시간)
    - app/dashboard/community/[postId]/page.tsx
    - 마크다운 렌더링
    - 좋아요/북마크 버튼

[ ] 게시글 작성 페이지 (4시간)
    - app/dashboard/community/new/page.tsx
    - 마크다운 에디터 (react-simplemde-editor)
    - 카테고리/태그 선택
    - 제출 로직

[ ] hooks 생성 (2시간)
    - hooks/useCommunity.ts
    - useCreatePost, useUpdatePost, useDeletePost
    - useLikePost, useBookmarkPost
```

**데이터 구조**:
```typescript
// types/community.ts
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  category: 'journal' | 'tip' | 'review' | 'question' | 'success' | 'motivation';
  title: string;
  content: string; // Markdown
  tags: string[];
  level?: 'A1' | 'A2' | 'B1' | 'B2';
  likes: number;
  comments: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  createdAt: Date;
}
```

#### Day 8-9: Grammar Activity (16시간)
```
[ ] 데이터 구조 (1시간)
    - GrammarContent 인터페이스

[ ] 샘플 콘텐츠 (5시간)
    - 문법 규칙 설명 (Present Simple 등)
    - 예시 문장 10개
    - 연습 문제 15개

[ ] Explanation 컴포넌트 (3시간)
    - components/activity/GrammarExplanation.tsx
    - 규칙 설명
    - 예시 문장
    - 표/차트 (필요 시)

[ ] Exercise 컴포넌트 (5시간)
    - components/activity/GrammarExercise.tsx
    - 빈칸 채우기
    - 문장 배열
    - 오류 찾기
    - 정답 확인

[ ] Activity 페이지 통합 (2시간)
```

---

### Week 3: Listening + Writing + Speaking

#### Day 10-11: Listening Activity (16시간)
```
[ ] 데이터 구조 (1시간)
    - ListeningContent 인터페이스

[ ] TTS 통합 (3시간)
    - Web Speech API 래퍼 함수
    - 속도 조절 (0.5x, 1x, 1.5x)
    - 재생/일시정지/정지

[ ] 샘플 콘텐츠 (4시간)
    - 대화 스크립트 5개
    - 듣기 문제 각 5개

[ ] AudioPlayer 컴포넌트 (3시간)
    - components/activity/AudioPlayer.tsx
    - 재생 컨트롤
    - 진행 바
    - 스크립트 토글

[ ] ListeningQuestion 컴포넌트 (3시간)
    - 문제 표시
    - 정답 확인

[ ] Activity 페이지 통합 (2시간)
```

**TTS 구현**:
```typescript
// lib/text-to-speech.ts
export const speak = (
  text: string,
  options: {
    lang?: string;
    rate?: number; // 0.1 ~ 10
    pitch?: number; // 0 ~ 2
    volume?: number; // 0 ~ 1
  } = {}
) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'en-US';
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  return new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });
};
```

#### Day 12: Writing Activity (8시간)
```
[ ] 데이터 구조 (1시간)
    - WritingContent, WritingSubmission 인터페이스

[ ] 샘플 콘텐츠 (2시간)
    - 작문 주제 10개
    - 가이드라인
    - 예시 답안

[ ] Writing 컴포넌트 (3시간)
    - components/activity/WritingPrompt.tsx
    - Textarea 에디터
    - 단어 수 카운터
    - 예시 답안 보기

[ ] 제출 로직 (2시간)
    - Firestore에 저장
    - 제출 이력 조회
```

#### Day 13: Speaking Activity (8시간)
```
[ ] 데이터 구조 (1시간)
    - SpeakingContent 인터페이스

[ ] 샘플 콘텐츠 (2시간)
    - 연습 문장/주제 10개

[ ] AudioRecorder 컴포넌트 (4시간)
    - components/activity/AudioRecorder.tsx
    - MediaRecorder API
    - 녹음/정지
    - 재생
    - Blob 저장 (Firestore base64)

[ ] Activity 페이지 통합 (1시간)
```

**녹음 구현**:
```typescript
// hooks/useAudioRecorder.ts
export const useAudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
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
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast.error('마이크 권한이 필요합니다');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return { recording, audioURL, startRecording, stopRecording };
};
```

---

### Week 4: 커뮤니티 고도화 + 품질 개선

#### Day 14-15: 커뮤니티 댓글/좋아요 (16시간)
```
[ ] 댓글 시스템 (8시간)
    - components/community/CommentList.tsx
    - components/community/CommentForm.tsx
    - 댓글 작성/수정/삭제
    - 실시간 업데이트

[ ] 좋아요/북마크 (4시간)
    - hooks/useLikePost.ts
    - hooks/useBookmarkPost.ts
    - UI 피드백 (애니메이션)

[ ] 알림 시스템 (4시간)
    - 댓글 알림
    - 좋아요 알림
    - Firestore 트리거
```

#### Day 16-17: 품질 개선 (16시간)
```
[ ] 이미지 최적화 (2시간)
    - <img> → Next/Image
    - 자동 최적화

[ ] Form Validation 강화 (3시간)
    - Zod 스키마
    - 실시간 validation
    - 에러 메시지

[ ] Skeleton Loading UI (4시간)
    - components/ui/Skeleton.tsx
    - 모든 페이지에 적용

[ ] 검색/필터 기능 (5시간)
    - 커뮤니티 검색
    - 커리큘럼 필터
    - Algolia or Firestore 쿼리

[ ] 레벨 테스트 페이지 (2시간)
    - 간단한 10문제 퀴즈
    - 결과에 따라 레벨 추천
```

---

## 📦 필요한 라이브러리 설치

### 즉시 설치
```bash
npm install react-hot-toast           # Toast 알림
npm install react-markdown            # 마크다운 렌더링
npm install react-simplemde-editor    # 마크다운 에디터
npm install date-fns                  # 날짜 포맷
npm install zod                       # Form validation
```

### 선택적 설치 (나중에)
```bash
npm install framer-motion             # 애니메이션
npm install react-spring              # 플래시카드 애니메이션
npm install algolia                   # 검색 (무료 티어)
```

---

## 📋 콘텐츠 제작 계획

### 우선순위 콘텐츠
1. **Vocabulary A1 Week 1-4** (200 단어)
2. **Reading A1 Week 1-4** (12 지문)
3. **Grammar A1 Week 1-4** (4 문법 규칙)
4. **Listening A1 Week 1-4** (12 대화)
5. **Writing A1 Week 1-4** (12 주제)
6. **Speaking A1 Week 1-4** (12 주제)

### 콘텐츠 소스
- **어휘**: Oxford 3000 기본 단어
- **지문**: 공개 도메인 간단한 이야기
- **문법**: 기본 문법 규칙 (Present Simple, Past Simple 등)
- **대화**: 일상 대화 시나리오

---

## 🎯 완료 기준

### Week 1 완료 기준
- [x] 모든 긴급 수정 완료 (링크, 보안)
- [x] Vocabulary Activity 작동
- [x] Reading Activity 작동
- [x] 최소 4주차 콘텐츠 준비

### Week 2 완료 기준
- [x] 커뮤니티 게시판 작동 (작성/조회)
- [x] Grammar Activity 작동
- [x] 사용자가 글 작성 가능

### Week 3 완료 기준
- [x] Listening Activity 작동 (TTS)
- [x] Writing Activity 작동 (제출)
- [x] Speaking Activity 작동 (녹음)
- [x] 6가지 Activity 모두 기본 기능 완성

### Week 4 완료 기준
- [x] 커뮤니티 댓글/좋아요 작동
- [x] 검색/필터 기능
- [x] 레벨 테스트 페이지
- [x] 전체 플랫폼 MVP 완성

---

## 🚨 리스크 관리

### 리스크 1: 콘텐츠 제작 시간 부족
**완화 방안**:
- AI 도구로 초안 생성 (ChatGPT)
- 공개 도메인 자료 활용
- 우선순위: A1 레벨만 먼저

### 리스크 2: TTS 품질 문제
**완화 방안**:
- 여러 TTS 엔진 테스트
- 속도 조절 옵션 제공
- 나중에 고품질 TTS 업그레이드

### 리스크 3: Firestore 무료 할당량 초과
**완화 방안**:
- 캐싱 최대화 (React Query)
- 정적 JSON 최대한 활용
- 읽기 최적화 (복합 쿼리)

---

## 📝 체크리스트 요약

### 긴급 (Day 1)
- [ ] Error Boundary
- [ ] Toast Notification
- [ ] 링크 수정 (/level-test, /community)
- [ ] Firebase Security Rules
- [ ] Environment Variable Validation

### 핵심 (Week 1-2)
- [ ] Vocabulary Activity
- [ ] Reading Activity
- [ ] Grammar Activity
- [ ] 커뮤니티 기본 (게시판)

### 확장 (Week 3)
- [ ] Listening Activity
- [ ] Writing Activity
- [ ] Speaking Activity

### 완성 (Week 4)
- [ ] 커뮤니티 댓글/좋아요
- [ ] 검색/필터
- [ ] 품질 개선
- [ ] 레벨 테스트

---

**다음 단계**: 이 계획을 승인받고 실행 시작

**예상 완료 시점**: 4주 후 (2025-11-02)

**최종 목표**: 완전히 작동하는 MVP (PRD Must Have 100% 달성)
