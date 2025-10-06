# 🎯 마스터 구현 체크리스트

> **원칙**: 빠른 것보다 완벽한 것. 모든 단계를 꼼꼼하게 검증하며 진행.

---

## 📊 전체 구현 우선순위

### Phase 0: 사전 준비 및 검증 ✅
- [x] PRD 분석 완료
- [x] 미구현 기능 파악 완료
- [x] Resource Curation 상세 설계 완료
- [x] Blog/Community 상세 설계 완료
- [ ] 최종 구현 순서 결정
- [ ] 개발 환경 검증

### 우선순위 결정
```
1순위: Activity 콘텐츠 (플랫폼 핵심)
2순위: Resource Curation DB (독립적, 빠른 가치 제공)
3순위: Community/Blog (사용자 참여)
4순위: 품질 개선 (에러 처리, 성능, 보안)
```

---

## 🎓 PRIORITY 1: Activity 콘텐츠 구현

### 1.1 사전 조사 및 설계
- [x] 현재 Activity 페이지 구조 완전 분석
  - [x] `/dashboard/curriculum/[weekId]/[activityId]/page.tsx` 코드 리뷰
  - [x] 어떤 props가 전달되는지 파악
  - [x] 어떤 UI 컴포넌트가 필요한지 정리
- [x] CEFR 레벨별 콘텐츠 난이도 기준 정의
  - [x] A1: 기본 단어, 짧은 문장, 느린 속도
  - [x] A2: 일상 표현, 간단한 대화, 보통 속도
  - [x] B1: 복잡한 문장, 토론, 자연스러운 속도
  - [x] B2: 고급 어휘, 심화 주제, 빠른 속도
- [x] 각 Activity 타입별 JSON 스키마 설계
  - [x] Vocabulary 데이터 구조
  - [x] Reading 데이터 구조
  - [x] Grammar 데이터 구조
  - [x] Listening 데이터 구조
  - [x] Writing 데이터 구조
  - [x] Speaking 데이터 구조
- [x] Web Speech API 기술 검증
  - [x] 브라우저 호환성 확인
  - [x] 한국어 → 영어 TTS 품질 테스트
  - [x] 속도 조절 가능 여부 확인
- [x] MediaRecorder API 기술 검증
  - [x] 브라우저 호환성 확인
  - [x] 오디오 녹음 품질 테스트
  - [x] Blob 저장 방식 결정

### 1.2 Vocabulary Activity 구현

#### 1.2.1 데이터 준비
- [x] JSON 스키마 확정 (validate-activity-json.js에 구현됨)
  ```typescript
  interface VocabularyActivity {
    id: string;
    weekId: string;
    type: 'vocabulary';
    title: string;
    level: Level;
    words: VocabularyWord[];
    exercises: VocabularyExercise[];
  }
  ```
- [x] Week 1 (A1) 어휘 20개 선정 및 작성 (week-1-vocab.json)
  - [x] 일상 인사 (Hello, Hi, Good morning, etc.)
  - [x] 기본 명사 (Water, Book, Phone, etc.)
  - [x] 기본 동사 (Go, Come, Eat, etc.)
  - [x] 숫자 1-10
- [ ] Week 2 (A1) 어휘 20개 작성
- [ ] Week 3 (A2) 어휘 20개 작성
- [ ] Week 4 (A2) 어휘 20개 작성
- [ ] Week 5 (B1) 어휘 20개 작성
- [ ] Week 6 (B1) 어휘 20개 작성
- [ ] Week 7 (B2) 어휘 20개 작성
- [ ] Week 8 (B2) 어휘 20개 작성

#### 1.2.2 UI 컴포넌트 개발
- [x] VocabularyCard 컴포넌트 생성 (VocabularyActivity.tsx 내부 구현)
  - [x] 단어 앞/뒤 플립 애니메이션
  - [x] 발음 기호 표시
  - [x] 예문 표시
  - [x] TTS 버튼 (Web Speech API)
  - [ ] 북마크 기능 (향후 추가)
- [x] VocabularyList 컴포넌트 생성
  - [x] 카드 그리드 레이아웃
  - [x] 진행률 표시
  - [ ] 필터 (학습함/안함) - 향후 추가
- [x] VocabularyQuiz 컴포넌트 생성
  - [x] 4지선다형, fill_blank, matching
  - [x] 정답/오답 피드백
  - [x] 점수 계산
  - [ ] 결과 저장 (Firestore) - 진행률 시스템 구현 시 추가

#### 1.2.3 TTS 기능 구현
- [x] useTTS 훅 생성 (hooks/useTTS.ts)
  - [x] Web Speech API 래핑
  - [x] 에러 처리 (지원 안 하는 브라우저)
  - [x] 속도 조절 기능
  - [x] 음성 선택 기능 (미국/영국 영어)
- [x] TTS 버튼 컴포넌트
  - [x] 재생/정지 상태 관리
  - [x] 로딩 인디케이터
  - [x] 에러 메시지 표시

#### 1.2.4 학습 진행률 추적
- [ ] Firestore vocabulary_progress collection 설계
  ```typescript
  interface VocabularyProgress {
    userId: string;
    activityId: string;
    wordId: string;
    mastered: boolean;
    reviewCount: number;
    lastReviewedAt: Timestamp;
  }
  ```
- [ ] useVocabularyProgress 훅 생성
- [ ] 진행률 저장 로직
- [ ] 진행률 불러오기 로직
- [ ] 대시보드 연동 (Week 카드에 % 표시)

#### 1.2.5 테스트 및 검증
- [ ] A1 Vocabulary 테스트
  - [ ] 모든 단어 표시 확인
  - [ ] TTS 작동 확인
  - [ ] 퀴즈 정답/오답 처리 확인
  - [ ] 진행률 저장 확인
- [ ] 모바일 반응형 테스트
- [ ] 다크모드 테스트
- [ ] 에러 케이스 테스트
  - [ ] TTS 지원 안 하는 브라우저
  - [ ] 네트워크 오류
  - [ ] Firestore 오류

### 1.3 Reading Activity 구현

#### 1.3.1 데이터 준비
- [ ] JSON 스키마 확정
  ```typescript
  interface ReadingActivity {
    id: string;
    weekId: string;
    type: 'reading';
    title: string;
    level: Level;
    passage: {
      text: string;
      audioUrl?: string; // 나중에 TTS로 생성
    };
    vocabulary: { word: string; meaning: string; }[];
    comprehensionQuestions: Question[];
  }
  ```
- [ ] Week 1 (A1) 지문 작성
  - [ ] 주제: 자기소개 (80-100 단어)
  - [ ] 어휘 수준: 기초
  - [ ] 이해도 질문 5개 작성
- [ ] Week 2 (A1) 지문 작성
  - [ ] 주제: 일상 루틴
- [ ] Week 3 (A2) 지문 작성
  - [ ] 주제: 취미 소개 (150-200 단어)
- [ ] Week 4 (A2) 지문 작성
- [ ] Week 5 (B1) 지문 작성
  - [ ] 주제: 간단한 뉴스 기사 (250-300 단어)
- [ ] Week 6 (B1) 지문 작성
- [ ] Week 7 (B2) 지문 작성
  - [ ] 주제: 에세이 (400-500 단어)
- [ ] Week 8 (B2) 지문 작성

#### 1.3.2 UI 컴포넌트 개발
- [ ] ReadingPassage 컴포넌트
  - [ ] 지문 렌더링
  - [ ] 단어 하이라이트 기능
  - [ ] 클릭 시 뜻 팝오버
  - [ ] TTS 전체 읽기 버튼
  - [ ] 폰트 크기 조절
- [ ] VocabularyHelper 컴포넌트
  - [ ] 어려운 단어 목록
  - [ ] 뜻 표시
  - [ ] 개별 발음 듣기
- [ ] ComprehensionQuiz 컴포넌트
  - [ ] 문제 렌더링
  - [ ] 답안 선택
  - [ ] 정답 확인
  - [ ] 해설 표시

#### 1.3.3 읽기 보조 기능
- [ ] 단어 하이라이트 기능
  - [ ] 클릭 시 사전 팝오버
  - [ ] 자주 틀린 단어 색상 구분
- [ ] 읽기 속도 측정
  - [ ] 시작/종료 시간 기록
  - [ ] WPM(Words Per Minute) 계산
  - [ ] 레벨별 권장 속도 비교
- [ ] 북마크 기능
  - [ ] 읽다가 멈춘 위치 저장
  - [ ] 다음에 이어서 읽기

#### 1.3.4 진행률 추적
- [ ] Firestore reading_progress collection
  ```typescript
  interface ReadingProgress {
    userId: string;
    activityId: string;
    completed: boolean;
    readingTime: number; // 초
    wpm: number;
    quizScore: number;
    completedAt?: Timestamp;
  }
  ```
- [ ] useReadingProgress 훅
- [ ] 진행률 저장/불러오기
- [ ] 통계 대시보드 연동

#### 1.3.5 테스트 및 검증
- [ ] 모든 지문 표시 확인
- [ ] TTS 전체 읽기 작동 확인
- [ ] 단어 하이라이트 작동 확인
- [ ] 퀴즈 정답 처리 확인
- [ ] 읽기 속도 계산 정확성 확인
- [ ] 모바일/태블릿 반응형 테스트
- [ ] 에러 케이스 테스트

### 1.4 Grammar Activity 구현

#### 1.4.1 데이터 준비
- [ ] JSON 스키마 확정
  ```typescript
  interface GrammarActivity {
    id: string;
    weekId: string;
    type: 'grammar';
    title: string;
    level: Level;
    topic: string; // "Present Simple", "Past Tense", etc.
    explanation: {
      rule: string; // Markdown
      examples: { english: string; korean: string; }[];
      tips: string[];
    };
    exercises: GrammarExercise[];
  }
  ```
- [ ] Week 1 (A1) 문법 주제 선정 및 작성
  - [ ] 주제: "Be 동사 (am, is, are)"
  - [ ] 설명 작성 (쉬운 한국어 + 영어)
  - [ ] 예문 10개 작성
  - [ ] 연습 문제 15개 작성
- [ ] Week 2 (A1): "Present Simple"
- [ ] Week 3 (A2): "Past Simple"
- [ ] Week 4 (A2): "Present Continuous"
- [ ] Week 5 (B1): "Present Perfect"
- [ ] Week 6 (B1): "Modal Verbs"
- [ ] Week 7 (B2): "Passive Voice"
- [ ] Week 8 (B2): "Conditional Sentences"

#### 1.4.2 UI 컴포넌트 개발
- [ ] GrammarExplanation 컴포넌트
  - [ ] Markdown 렌더링 (react-markdown)
  - [ ] 예문 카드
  - [ ] TTS 예문 읽기
  - [ ] 접기/펼치기 기능
- [ ] GrammarExercise 컴포넌트
  - [ ] 빈칸 채우기 (Fill in the blank)
  - [ ] 문장 재배열 (Rearrange)
  - [ ] 오류 찾기 (Find the error)
  - [ ] 정답 확인 및 해설
- [ ] GrammarQuiz 컴포넌트
  - [ ] 문제 풀이 인터페이스
  - [ ] 즉각적인 피드백
  - [ ] 틀린 문제 다시 풀기

#### 1.4.3 인터랙티브 기능
- [ ] 빈칸 채우기 인터페이스
  - [ ] 드래그 앤 드롭
  - [ ] 텍스트 입력
  - [ ] 자동 완성 힌트
- [ ] 문장 재배열 인터페이스
  - [ ] 단어 카드 드래그
  - [ ] 순서 확인
  - [ ] 애니메이션
- [ ] 오류 찾기 인터페이스
  - [ ] 단어 클릭 선택
  - [ ] 정답 하이라이트
  - [ ] 설명 표시

#### 1.4.4 진행률 추적
- [ ] Firestore grammar_progress collection
  ```typescript
  interface GrammarProgress {
    userId: string;
    activityId: string;
    exercisesCompleted: number;
    totalExercises: number;
    accuracy: number; // %
    weakPoints: string[]; // 자주 틀린 문법 포인트
  }
  ```
- [ ] useGrammarProgress 훅
- [ ] 정답률 분석
- [ ] 취약점 파악 로직

#### 1.4.5 테스트 및 검증
- [ ] 모든 문법 설명 표시 확인
- [ ] 연습 문제 작동 확인
- [ ] 정답 검증 로직 정확성
- [ ] 진행률 저장 확인
- [ ] 반응형 테스트
- [ ] 에러 케이스 테스트

### 1.5 Listening Activity 구현

#### 1.5.1 데이터 준비
- [ ] JSON 스키마 확정
  ```typescript
  interface ListeningActivity {
    id: string;
    weekId: string;
    type: 'listening';
    title: string;
    level: Level;
    audio: {
      text: string; // TTS로 변환할 텍스트
      speed: number; // 0.5 (느림) ~ 1.5 (빠름)
    };
    transcript?: string; // 스크립트 (처음엔 숨김)
    questions: ListeningQuestion[];
  }
  ```
- [ ] Week 1 (A1) 듣기 스크립트 작성
  - [ ] 주제: 짧은 인사 대화 (30초)
  - [ ] 속도: 0.6 (매우 느림)
  - [ ] 이해도 질문 3개
- [ ] Week 2 (A1): 간단한 안내 방송
- [ ] Week 3 (A2): 친구 간 대화 (1분)
- [ ] Week 4 (A2): 전화 통화
- [ ] Week 5 (B1): 뉴스 클립 (1.5분)
- [ ] Week 6 (B1): 인터뷰
- [ ] Week 7 (B2): 강의 일부 (2분)
- [ ] Week 8 (B2): 토론

#### 1.5.2 TTS 오디오 생성
- [ ] Web Speech API 오디오 생성 함수
  ```typescript
  const generateAudio = (text: string, speed: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    return utterance;
  };
  ```
- [ ] 오디오 재생 컨트롤
  - [ ] 재생/일시정지
  - [ ] 속도 조절 (0.5x ~ 1.5x)
  - [ ] 구간 반복
  - [ ] 진행 바

#### 1.5.3 UI 컴포넌트 개발
- [ ] AudioPlayer 컴포넌트
  - [ ] 재생 컨트롤
  - [ ] 진행 바
  - [ ] 속도 조절 버튼
  - [ ] 반복 재생 설정
- [ ] TranscriptViewer 컴포넌트
  - [ ] 처음엔 숨김 (듣기 연습용)
  - [ ] "스크립트 보기" 버튼
  - [ ] 현재 재생 위치 하이라이트
- [ ] ListeningQuiz 컴포넌트
  - [ ] 질문 렌더링
  - [ ] 답안 선택
  - [ ] 정답 확인
  - [ ] 다시 듣기 버튼

#### 1.5.4 듣기 보조 기능
- [ ] 구간 반복 기능
  - [ ] 시작/끝 지점 선택
  - [ ] 반복 횟수 설정
- [ ] 속도 조절 기능
  - [ ] 0.5x (초급)
  - [ ] 0.75x (중급)
  - [ ] 1.0x (정상)
  - [ ] 1.25x (고급)
- [ ] 자막 싱크 기능
  - [ ] 재생 위치에 맞춰 스크립트 하이라이트
  - [ ] 클릭 시 해당 위치로 이동

#### 1.5.5 진행률 추적
- [ ] Firestore listening_progress collection
  ```typescript
  interface ListeningProgress {
    userId: string;
    activityId: string;
    listenCount: number; // 몇 번 들었는지
    transcriptViewed: boolean; // 스크립트 봤는지
    quizScore: number;
    averageSpeed: number; // 평균 청취 속도
  }
  ```
- [ ] useListeningProgress 훅
- [ ] 듣기 통계 분석

#### 1.5.6 테스트 및 검증
- [ ] TTS 오디오 품질 확인
- [ ] 재생 컨트롤 작동 확인
- [ ] 속도 조절 확인
- [ ] 스크립트 싱크 정확성
- [ ] 퀴즈 정답 처리 확인
- [ ] 모바일 반응형 테스트

### 1.6 Writing Activity 구현

#### 1.6.1 데이터 준비
- [ ] JSON 스키마 확정
  ```typescript
  interface WritingActivity {
    id: string;
    weekId: string;
    type: 'writing';
    title: string;
    level: Level;
    prompt: string; // 작문 주제
    requirements: {
      minWords: number;
      maxWords: number;
      mustInclude?: string[]; // 반드시 포함할 단어/표현
      suggestedStructure?: string[]; // 추천 구조
    };
    sampleAnswer?: string; // 모범 답안
  }
  ```
- [ ] Week 1 (A1) 작문 주제
  - [ ] 주제: "자기소개 3문장으로 쓰기"
  - [ ] 요구사항: 30-50 단어
  - [ ] 필수 포함: "My name is...", "I am...", "I like..."
  - [ ] 모범 답안 작성
- [ ] Week 2 (A1): "나의 하루 일과"
- [ ] Week 3 (A2): "좋아하는 취미 소개"
- [ ] Week 4 (A2): "친구에게 편지 쓰기"
- [ ] Week 5 (B1): "의견 제시 글쓰기"
- [ ] Week 6 (B1): "비교/대조 에세이"
- [ ] Week 7 (B2): "논증 에세이"
- [ ] Week 8 (B2): "보고서 작성"

#### 1.6.2 UI 컴포넌트 개발
- [ ] WritingEditor 컴포넌트
  - [ ] 텍스트 에디어 (Textarea)
  - [ ] 실시간 단어 수 카운트
  - [ ] 요구사항 체크리스트
  - [ ] 자동 저장 (localStorage)
  - [ ] 제출 버튼
- [ ] WritingPrompt 컴포넌트
  - [ ] 주제 표시
  - [ ] 요구사항 표시
  - [ ] 도움말 토글
  - [ ] 모범 답안 (제출 후 공개)
- [ ] WritingFeedback 컴포넌트 (Phase 1은 기본)
  - [ ] 제출 완료 메시지
  - [ ] 단어 수 확인
  - [ ] 필수 표현 포함 여부 확인
  - [ ] (나중에 AI 피드백 추가)

#### 1.6.3 작문 보조 기능
- [ ] 실시간 통계
  - [ ] 단어 수
  - [ ] 문장 수
  - [ ] 평균 단어 길이
- [ ] 기본 검사 (AI 없이)
  - [ ] 필수 표현 포함 체크
  - [ ] 최소 단어 수 충족
  - [ ] 대문자 시작 체크
  - [ ] 마침표 종료 체크
- [ ] 자동 저장
  - [ ] 3초마다 localStorage 저장
  - [ ] 새로고침 후 복구

#### 1.6.4 진행률 추적
- [ ] Firestore writing_progress collection
  ```typescript
  interface WritingProgress {
    userId: string;
    activityId: string;
    draft: string; // 작성 중인 글
    submitted: boolean;
    submittedText?: string;
    wordCount: number;
    submittedAt?: Timestamp;
  }
  ```
- [ ] useWritingProgress 훅
- [ ] 제출 이력 관리
- [ ] 모범 답안 비교 (제출 후)

#### 1.6.5 테스트 및 검증
- [ ] 에디터 작동 확인
- [ ] 단어 수 카운트 정확성
- [ ] 요구사항 체크 로직 확인
- [ ] 자동 저장 작동 확인
- [ ] 제출 후 모범 답안 표시 확인
- [ ] 모바일 입력 테스트

### 1.7 Speaking Activity 구현

#### 1.7.1 데이터 준비
- [ ] JSON 스키마 확정
  ```typescript
  interface SpeakingActivity {
    id: string;
    weekId: string;
    type: 'speaking';
    title: string;
    level: Level;
    task: string; // 말하기 과제
    modelAudio?: string; // 모델 음성 (TTS 생성)
    tips: string[]; // 발음 팁
    evaluationCriteria?: {
      fluency: string;
      pronunciation: string;
      content: string;
    };
  }
  ```
- [ ] Week 1 (A1) 말하기 주제
  - [ ] 과제: "자신을 3문장으로 소개하기"
  - [ ] 모델 텍스트 작성
  - [ ] 발음 팁 3개 작성
- [ ] Week 2 (A1): "일상 인사 대화"
- [ ] Week 3 (A2): "취미 소개"
- [ ] Week 4 (A2): "전화 대화 연습"
- [ ] Week 5 (B1): "의견 말하기"
- [ ] Week 6 (B1): "스토리텔링"
- [ ] Week 7 (B2): "프레젠테이션"
- [ ] Week 8 (B2): "토론 참여"

#### 1.7.2 녹음 기능 구현
- [ ] useRecorder 훅 생성
  ```typescript
  const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    // MediaRecorder API 구현
  };
  ```
- [ ] 브라우저 호환성 체크
- [ ] 마이크 권한 요청
- [ ] 녹음 시작/정지
- [ ] Blob 저장 (localStorage, 임시)

#### 1.7.3 UI 컴포넌트 개발
- [ ] SpeakingPrompt 컴포넌트
  - [ ] 과제 표시
  - [ ] 모델 오디오 재생 (TTS)
  - [ ] 발음 팁 표시
- [ ] AudioRecorder 컴포넌트
  - [ ] 녹음 버튼
  - [ ] 녹음 중 인디케이터
  - [ ] 시간 표시
  - [ ] 재녹음 버튼
- [ ] RecordingPlayback 컴포넌트
  - [ ] 녹음된 오디오 재생
  - [ ] 파형 시각화 (선택)
  - [ ] 모델 음성과 비교 재생
  - [ ] 제출 버튼

#### 1.7.4 말하기 보조 기능
- [ ] 모델 오디오 재생
  - [ ] TTS로 모델 텍스트 읽기
  - [ ] 속도 조절
  - [ ] 반복 재생
- [ ] 녹음 관리
  - [ ] 최대 녹음 시간 설정
  - [ ] 재녹음 기능
  - [ ] 임시 저장 (새로고침 방지)
- [ ] 기본 평가 (AI 없이)
  - [ ] 녹음 시간 체크
  - [ ] 제출 완료 확인
  - [ ] (나중에 발음 평가 AI 추가)

#### 1.7.5 진행률 추적
- [ ] Firestore speaking_progress collection
  ```typescript
  interface SpeakingProgress {
    userId: string;
    activityId: string;
    recordingDuration: number; // 초
    attempts: number; // 녹음 시도 횟수
    submitted: boolean;
    submittedAt?: Timestamp;
    // audioUrl: string; // Storage 연동 시 추가
  }
  ```
- [ ] useSpeakingProgress 훅
- [ ] 녹음 이력 관리
- [ ] (Storage 없이 제출 여부만 추적)

#### 1.7.6 테스트 및 검증
- [ ] MediaRecorder API 작동 확인
- [ ] 마이크 권한 처리 확인
- [ ] 녹음/재생 확인
- [ ] 모델 오디오 TTS 확인
- [ ] 제출 프로세스 확인
- [ ] 모바일 녹음 테스트
- [ ] 에러 케이스 테스트
  - [ ] 마이크 없음
  - [ ] 권한 거부
  - [ ] 브라우저 미지원

### 1.8 Activity 통합 및 라우팅

#### 1.8.1 Activity 타입별 라우팅
- [ ] ActivityContent 컴포넌트 생성
  ```tsx
  // components/activities/ActivityContent.tsx
  const ActivityContent = ({ activity }) => {
    switch (activity.type) {
      case 'vocabulary': return <VocabularyActivity data={data} />;
      case 'reading': return <ReadingActivity data={data} />;
      case 'grammar': return <GrammarActivity data={data} />;
      case 'listening': return <ListeningActivity data={data} />;
      case 'writing': return <WritingActivity data={data} />;
      case 'speaking': return <SpeakingActivity data={data} />;
    }
  };
  ```
- [ ] JSON 데이터 로딩 로직
- [ ] 에러 처리 (데이터 없음)
- [ ] 로딩 스켈레톤

#### 1.8.2 페이지 통합
- [ ] `page.tsx`에서 "임시 콘텐츠" 제거
- [ ] ActivityContent 컴포넌트 연동
- [ ] 진행률 표시 업데이트
- [ ] 완료 버튼 기능 구현
- [ ] 이전/다음 Activity 네비게이션

#### 1.8.3 전체 진행률 시스템
- [ ] useOverallProgress 훅
  - [ ] 모든 타입의 진행률 집계
  - [ ] Week별 완료율 계산
  - [ ] 전체 완료율 계산
- [ ] Dashboard 업데이트
  - [ ] Week 카드에 진행률 표시
  - [ ] 완료된 Activity 체크 표시
  - [ ] 다음 추천 Activity 하이라이트

#### 1.8.4 최종 검증
- [ ] 모든 Week의 모든 Activity 테스트
  - [ ] Week 1: 6개 Activity × 테스트
  - [ ] Week 2: 6개 Activity × 테스트
  - [ ] Week 3: 6개 Activity × 테스트
  - [ ] Week 4: 6개 Activity × 테스트
  - [ ] Week 5: 6개 Activity × 테스트
  - [ ] Week 6: 6개 Activity × 테스트
  - [ ] Week 7: 6개 Activity × 테스트
  - [ ] Week 8: 6개 Activity × 테스트
- [ ] 진행률 동기화 확인
- [ ] 에러 처리 전반 확인
- [ ] 성능 최적화
  - [ ] JSON 데이터 lazy loading
  - [ ] 컴포넌트 code splitting
  - [ ] 이미지 최적화

---

## 🗂️ PRIORITY 2: Resource Curation DB 구현

### 2.1 Firestore 데이터베이스 설계

#### 2.1.1 Collection 구조 확정
- [ ] `learning_resources` collection 생성
- [ ] `resource_reviews` subcollection 설계
- [ ] 복합 인덱스 계획
  - [ ] type + level
  - [ ] level + rating
  - [ ] createdAt (desc)
- [ ] 보안 규칙 작성

#### 2.1.2 데이터 스키마 구현
- [ ] TypeScript 인터페이스 작성
  ```typescript
  // types/resource.ts
  interface LearningResource { ... }
  interface ResourceReview { ... }
  ```
- [ ] Firestore 변환 함수
  - [ ] toFirestore()
  - [ ] fromFirestore()
- [ ] Timestamp 처리

### 2.2 Resource CRUD 구현

#### 2.2.1 Hooks 개발
- [ ] useResources 훅
  ```typescript
  const useResources = (filters?: ResourceFilters) => {
    // Firestore query with filters
  };
  ```
- [ ] useResource 훅 (단일 리소스)
- [ ] useCreateResource 훅 (관리자용)
- [ ] useUpdateResource 훅 (관리자용)
- [ ] useResourceReviews 훅

#### 2.2.2 필터링 로직
- [ ] 타입별 필터 (youtube, podcast, website, app)
- [ ] 레벨별 필터 (A1, A2, B1, B2)
- [ ] 스킬별 필터 (listening, reading, speaking, writing)
- [ ] 정렬 옵션
  - [ ] 최신순
  - [ ] 인기순 (rating)
  - [ ] 리뷰 많은 순

#### 2.2.3 테스트
- [ ] 필터링 쿼리 성능 테스트
- [ ] 복합 필터 조합 테스트
- [ ] 페이지네이션 테스트

### 2.3 UI 컴포넌트 개발

#### 2.3.1 ResourceCard 컴포넌트
- [ ] 레이아웃 구현
  - [ ] 썸네일 (또는 타입 아이콘)
  - [ ] 제목 및 설명
  - [ ] 레벨 배지
  - [ ] 스킬 배지
  - [ ] 별점 및 리뷰 수
  - [ ] 북마크 버튼
- [ ] 호버 효과
- [ ] 클릭 시 상세 페이지 이동
- [ ] 반응형 레이아웃

#### 2.3.2 ResourceFilters 컴포넌트
- [ ] 타입 필터 (탭 형식)
- [ ] 레벨 필터 (체크박스)
- [ ] 스킬 필터 (체크박스)
- [ ] 정렬 드롭다운
- [ ] 필터 초기화 버튼
- [ ] 선택된 필터 표시

#### 2.3.3 ResourceDetail 컴포넌트
- [ ] 리소스 정보 표시
  - [ ] 제목 및 설명
  - [ ] 타입, 레벨, 스킬
  - [ ] 콘텐츠 길이, 업데이트 주기
  - [ ] 주요 특징 목록
- [ ] 사용 가이드 (Markdown)
- [ ] 외부 링크 버튼
- [ ] 리뷰 섹션
- [ ] 북마크/공유 버튼

#### 2.3.4 ResourceReviewSection 컴포넌트
- [ ] 리뷰 목록 표시
  - [ ] 작성자 정보
  - [ ] 별점
  - [ ] 내용
  - [ ] 작성일
- [ ] 리뷰 작성 폼
  - [ ] 별점 선택
  - [ ] 텍스트 입력
  - [ ] 제출 버튼
- [ ] 리뷰 정렬 (최신순, 인기순)
- [ ] 페이지네이션

### 2.4 샘플 데이터 추가

#### 2.4.1 YouTube 채널 (5개)
- [ ] English with Lucy
  - [ ] 모든 필드 작성
  - [ ] Firestore에 추가
  - [ ] 리뷰 2-3개 작성
- [ ] BBC Learning English
- [ ] Rachel's English
- [ ] Learn English with EnglishClass101.com
- [ ] Easy English

#### 2.4.2 Podcast (5개)
- [ ] BBC 6 Minute English
- [ ] All Ears English
- [ ] The English We Speak
- [ ] Plain English
- [ ] Luke's English Podcast

#### 2.4.3 Website (5개)
- [ ] Duolingo
- [ ] BBC Learning English (웹사이트)
- [ ] British Council Learn English
- [ ] Grammarly Blog
- [ ] Cambridge Dictionary

#### 2.4.4 App (5개)
- [ ] Duolingo
- [ ] Memrise
- [ ] Anki
- [ ] HelloTalk
- [ ] Tandem

### 2.5 페이지 구현

#### 2.5.1 리소스 목록 페이지
- [ ] `/dashboard/resources` 라우트 생성
- [ ] ResourceFilters 배치
- [ ] ResourceCard 그리드 레이아웃
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 로딩 스켈레톤
- [ ] 빈 상태 (No results)

#### 2.5.2 리소스 상세 페이지
- [ ] `/dashboard/resources/[id]` 라우트 생성
- [ ] ResourceDetail 컴포넌트 배치
- [ ] ResourceReviewSection 배치
- [ ] 관련 리소스 추천
- [ ] SEO 메타데이터

#### 2.5.3 네비게이션 연동
- [ ] Sidebar에 "리소스" 메뉴 추가
- [ ] 아이콘 선택
- [ ] Active 상태 표시

### 2.6 북마크 기능

#### 2.6.1 Bookmarks Collection
- [ ] Firestore collection 설계
  ```typescript
  interface ResourceBookmark {
    userId: string;
    resourceId: string;
    createdAt: Timestamp;
  }
  ```
- [ ] 복합 인덱스: userId + createdAt
- [ ] 보안 규칙

#### 2.6.2 Hooks
- [ ] useBookmarkResource 훅
  - [ ] 북마크 추가/제거 토글
  - [ ] 낙관적 업데이트
- [ ] useMyBookmarks 훅
  - [ ] 내 북마크 목록 조회
- [ ] useIsBookmarked 훅
  - [ ] 특정 리소스 북마크 여부

#### 2.6.3 UI
- [ ] 북마크 버튼 (하트 아이콘)
- [ ] 북마크 상태 표시
- [ ] 내 북마크 페이지
  - [ ] `/dashboard/resources/bookmarks`
  - [ ] 북마크한 리소스 목록
  - [ ] 제거 기능

### 2.7 리뷰 시스템

#### 2.7.1 Review CRUD
- [ ] useCreateReview 훅
- [ ] useUpdateReview 훅
- [ ] useDeleteReview 훅
- [ ] 리뷰 작성 권한 (본인만)

#### 2.7.2 평점 계산
- [ ] 평균 별점 계산 로직
- [ ] 리뷰 수 카운트
- [ ] Firestore에 평점 업데이트
  - [ ] Cloud Function (나중에)
  - [ ] 또는 클라이언트에서 transaction

#### 2.7.3 리뷰 관리
- [ ] 본인 리뷰 수정/삭제
- [ ] 신고 기능 (나중에)
- [ ] 관리자 검토 (나중에)

### 2.8 검색 기능

#### 2.8.1 기본 검색
- [ ] 제목 검색 (Firestore text search 한계)
- [ ] 태그 검색
- [ ] 설명 검색

#### 2.8.2 고급 검색 (선택)
- [ ] Algolia 연동 (유료, 나중에)
- [ ] 또는 클라이언트 사이드 필터링
- [ ] 검색 히스토리

### 2.9 테스트 및 검증

#### 2.9.1 기능 테스트
- [ ] 모든 필터 조합 테스트
- [ ] 북마크 추가/제거 테스트
- [ ] 리뷰 작성/수정/삭제 테스트
- [ ] 페이지네이션 테스트
- [ ] 정렬 테스트

#### 2.9.2 성능 테스트
- [ ] 대량 데이터 로딩 (100+ 리소스)
- [ ] 쿼리 성능 측정
- [ ] 복합 인덱스 최적화

#### 2.9.3 UX 테스트
- [ ] 모바일 반응형
- [ ] 로딩 상태
- [ ] 에러 처리
- [ ] 빈 상태

---

## 💬 PRIORITY 3: Community/Blog 시스템 구현

### 3.1 Firestore 데이터베이스 설계

#### 3.1.1 Posts Collection
- [ ] `posts` collection 생성
- [ ] 복합 인덱스 계획
  - [ ] category + publishedAt (desc)
  - [ ] authorId + createdAt (desc)
  - [ ] status + likeCount (desc)
- [ ] 보안 규칙 작성

#### 3.1.2 Comments Subcollection
- [ ] `posts/{postId}/comments` 구조
- [ ] 대댓글 구조 (parentCommentId)
- [ ] 인덱스: createdAt, likeCount
- [ ] 보안 규칙

#### 3.1.3 Likes & Bookmarks Collection
- [ ] `likes` collection (복합 ID 전략)
- [ ] `bookmarks` collection
- [ ] 인덱스 설계
- [ ] 보안 규칙

#### 3.1.4 Post Views Collection
- [ ] `post_views` collection
- [ ] IP 해시 전략
- [ ] TTL 인덱스 (24시간)
- [ ] 보안 규칙

### 3.2 게시글 시스템 구현

#### 3.2.1 Post CRUD Hooks
- [ ] useCreatePost 훅
- [ ] useUpdatePost 훅
- [ ] useDeletePost 훅
- [ ] usePost 훅 (단일 게시글)
- [ ] usePosts 훅 (목록, 필터링)

#### 3.2.2 Slug 생성
- [ ] 한글 → 영문 transliteration
- [ ] URL-safe slug 생성
- [ ] 중복 처리 (slug-1, slug-2...)

#### 3.2.3 Excerpt 자동 생성
- [ ] Markdown에서 텍스트 추출
- [ ] 첫 150자 자르기
- [ ] 단어 중간에서 안 잘리게

### 3.3 Markdown 에디터 통합

#### 3.3.1 react-simplemde-editor 설치
- [ ] 패키지 설치
  ```bash
  npm install react-simplemde-editor easymde
  ```
- [ ] CSS 임포트
- [ ] 한국어 설정

#### 3.3.2 PostEditor 컴포넌트
- [ ] 제목 입력 필드
- [ ] 카테고리 선택 (6가지)
- [ ] 태그 입력 (최대 5개)
- [ ] Markdown 에디터
- [ ] 실시간 미리보기
- [ ] 임시 저장 (localStorage)
- [ ] 제출 버튼

#### 3.3.3 Markdown 렌더링
- [ ] react-markdown 설치
- [ ] 커스텀 스타일링
- [ ] 코드 하이라이팅 (선택)
- [ ] 링크 새 창 열기

### 3.4 UI 컴포넌트 개발

#### 3.4.1 PostCard 컴포넌트
- [ ] Compact variant
  - [ ] 제목, excerpt, 메타 정보
  - [ ] 1줄 레이아웃
- [ ] Full variant
  - [ ] 카테고리 배지
  - [ ] 제목 (큰 글씨)
  - [ ] Excerpt (3줄)
  - [ ] 작성자 정보
  - [ ] 통계 (조회, 좋아요, 댓글)
  - [ ] 태그 목록
- [ ] 호버 효과
- [ ] 북마크 아이콘

#### 3.4.2 CategoryFilter 컴포넌트
- [ ] 6가지 카테고리 탭
  - [ ] 학습 일지
  - [ ] 학습 팁
  - [ ] 리소스 리뷰
  - [ ] 질문과 답변
  - [ ] 성공 사례
  - [ ] 동기 부여
- [ ] 게시글 수 표시
- [ ] Active 상태 표시

#### 3.4.3 PostListView 컴포넌트
- [ ] 그리드/리스트 뷰 토글
- [ ] 정렬 옵션
  - [ ] 최신순
  - [ ] 인기순 (좋아요)
  - [ ] 조회수 많은 순
- [ ] 무한 스크롤
- [ ] 로딩 스켈레톤

#### 3.4.4 CommentSection 컴포넌트
- [ ] 댓글 목록
  - [ ] 작성자 정보
  - [ ] 내용
  - [ ] 좋아요 수
  - [ ] 답글 버튼
- [ ] 대댓글 표시 (1단계)
- [ ] 댓글 작성 폼
- [ ] 정렬 (최신순, 인기순)

### 3.5 댓글 시스템

#### 3.5.1 Comment CRUD Hooks
- [ ] useAddComment 훅
- [ ] useComments 훅
- [ ] useUpdateComment 훅
- [ ] useDeleteComment 훅
- [ ] 실시간 구독 (onSnapshot)

#### 3.5.2 대댓글 구현
- [ ] 답글 버튼 UI
- [ ] 대댓글 입력 폼 토글
- [ ] parentCommentId 설정
- [ ] 대댓글 인덴트 표시
- [ ] 1단계 제한 (대댓글의 대댓글 방지)

#### 3.5.3 댓글 관리
- [ ] 본인 댓글 수정/삭제
- [ ] Soft delete (isDeleted 플래그)
- [ ] 삭제된 댓글 표시 ("삭제된 댓글")

### 3.6 상호작용 기능

#### 3.6.1 좋아요 시스템
- [ ] useLikePost 훅
  - [ ] 복합 ID 생성
  - [ ] 토글 기능
  - [ ] 낙관적 업데이트
- [ ] useLikeComment 훅
- [ ] 좋아요 버튼 UI
  - [ ] 하트 아이콘
  - [ ] 채워진/빈 상태
  - [ ] 애니메이션

#### 3.6.2 북마크 시스템
- [ ] useBookmarkPost 훅
  - [ ] 복합 ID 전략
  - [ ] 토글 기능
- [ ] useMyBookmarks 훅
- [ ] 북마크 버튼 UI
- [ ] 내 북마크 페이지

#### 3.6.3 조회수 시스템
- [ ] useRecordView 훅
  - [ ] IP 해시 생성 (클라이언트)
  - [ ] 24시간 중복 방지
  - [ ] Firestore transaction
- [ ] 조회수 표시 UI
- [ ] 인기글 쿼리 (조회수 기준)

### 3.7 페이지 구현

#### 3.7.1 커뮤니티 메인 페이지
- [ ] `/dashboard/community` 라우트
- [ ] CategoryFilter 배치
- [ ] PostListView 배치
- [ ] 글쓰기 버튼 (로그인 필요)
- [ ] 인기글 사이드바 (선택)

#### 3.7.2 글쓰기 페이지
- [ ] `/dashboard/community/new` 라우트
- [ ] PostEditor 컴포넌트
- [ ] 인증 체크 (비로그인 시 리다이렉트)
- [ ] 제출 시 목록으로 이동

#### 3.7.3 게시글 상세 페이지
- [ ] `/dashboard/community/[slug]` 라우트
- [ ] 게시글 내용 렌더링 (Markdown)
- [ ] 작성자 정보
- [ ] 좋아요/북마크 버튼
- [ ] 조회수 기록
- [ ] CommentSection
- [ ] 수정/삭제 버튼 (작성자만)

#### 3.7.4 내 글 관리 페이지
- [ ] `/dashboard/community/my-posts` 라우트
- [ ] 내가 쓴 글 목록
- [ ] 임시 저장 글 목록
- [ ] 수정/삭제 액션

#### 3.7.5 내 북마크 페이지
- [ ] `/dashboard/community/bookmarks` 라우트
- [ ] 북마크한 글 목록
- [ ] 북마크 제거 기능

### 3.8 검색 및 필터링

#### 3.8.1 카테고리 필터
- [ ] 쿼리 where('category', '==', category)
- [ ] URL 파라미터 동기화

#### 3.8.2 태그 검색
- [ ] 태그 클릭 시 필터
- [ ] array-contains 쿼리

#### 3.8.3 전체 검색 (선택)
- [ ] 제목 검색 (제한적)
- [ ] 클라이언트 사이드 필터링
- [ ] 또는 Algolia (나중에)

### 3.9 샘플 게시글 작성

#### 3.9.1 학습 일지 (3개)
- [ ] "영어 학습 100일 달성" 작성
- [ ] "A1에서 A2로 레벨업 후기" 작성
- [ ] "매일 30분 학습 3개월 기록" 작성

#### 3.9.2 학습 팁 (3개)
- [ ] "쉐도잉 효과 200% 높이는 방법" 작성
- [ ] "단어 암기 최적의 루틴" 작성
- [ ] "듣기 실력 빠르게 늘리는 법" 작성

#### 3.9.3 리소스 리뷰 (3개)
- [ ] "BBC Learning English 6개월 후기" 작성
- [ ] "Duolingo vs Memrise 비교" 작성
- [ ] "English with Lucy 채널 완전 분석" 작성

#### 3.9.4 각 게시글에 댓글 2-3개 작성
- [ ] 실제 사용자 관점 댓글
- [ ] 대댓글 포함

### 3.10 고급 기능

#### 3.10.1 임시 저장
- [ ] localStorage에 draft 저장
- [ ] 3초마다 자동 저장
- [ ] 새로고침 시 복구 프롬프트
- [ ] 제출 시 draft 삭제

#### 3.10.2 이미지 업로드 (외부 URL)
- [ ] Markdown 이미지 문법 지원
- [ ] 외부 URL 입력 UI
- [ ] (Storage는 나중에)

#### 3.10.3 SEO 최적화
- [ ] Next.js metadata API
- [ ] Open Graph 태그
- [ ] Twitter Card
- [ ] Canonical URL

### 3.11 테스트 및 검증

#### 3.11.1 기능 테스트
- [ ] 게시글 CRUD 전체 플로우
- [ ] 댓글/대댓글 작성
- [ ] 좋아요/북마크 토글
- [ ] 조회수 증가 (중복 방지)
- [ ] 카테고리 필터
- [ ] 정렬 옵션

#### 3.11.2 Markdown 테스트
- [ ] 헤딩, 리스트, 링크
- [ ] 코드 블록
- [ ] 이미지 (외부 URL)
- [ ] 특수 문자 이스케이프

#### 3.11.3 성능 테스트
- [ ] 대량 게시글 로딩 (100+)
- [ ] 댓글 실시간 업데이트
- [ ] 무한 스크롤 성능

#### 3.11.4 보안 테스트
- [ ] 본인만 수정/삭제 가능
- [ ] XSS 방지 (Markdown sanitize)
- [ ] SQL Injection 방지 (Firestore는 기본 안전)

---

## 🛡️ PRIORITY 4: 품질 개선 및 최적화

### 4.1 에러 처리

#### 4.1.1 Error Boundary
- [ ] ErrorBoundary 컴포넌트 생성
  ```tsx
  // components/ErrorBoundary.tsx
  class ErrorBoundary extends React.Component { ... }
  ```
- [ ] app/layout.tsx에 적용
- [ ] 에러 UI 디자인
- [ ] 에러 로깅 (Sentry 나중에)

#### 4.1.2 API 에러 처리
- [ ] Firestore 에러 처리
  - [ ] permission-denied
  - [ ] not-found
  - [ ] network-error
- [ ] Toast 알림
- [ ] 재시도 로직 (React Query)

#### 4.1.3 Form 검증
- [ ] React Hook Form 통합
- [ ] Zod 스키마 검증
- [ ] 에러 메시지 표시
- [ ] 실시간 검증

### 4.2 로딩 상태

#### 4.2.1 Skeleton UI
- [ ] SkeletonCard 컴포넌트
- [ ] SkeletonList 컴포넌트
- [ ] SkeletonDetail 컴포넌트
- [ ] 모든 페이지에 적용

#### 4.2.2 로딩 인디케이터
- [ ] Spinner 컴포넌트
- [ ] Progress Bar 컴포넌트
- [ ] 버튼 로딩 상태
- [ ] 글로벌 로딩 (페이지 전환)

#### 4.2.3 빈 상태
- [ ] EmptyState 컴포넌트
- [ ] No results 메시지
- [ ] CTA 버튼 (액션 유도)

### 4.3 Toast 알림 시스템

#### 4.3.1 react-hot-toast 설치
- [ ] 패키지 설치
- [ ] Toaster 컴포넌트 배치
- [ ] 커스텀 스타일링

#### 4.3.2 알림 통합
- [ ] 성공 알림
  - [ ] 게시글 작성 완료
  - [ ] 댓글 작성 완료
  - [ ] 북마크 추가
- [ ] 에러 알림
  - [ ] 네트워크 오류
  - [ ] 권한 오류
  - [ ] 검증 실패
- [ ] 정보 알림
  - [ ] 임시 저장 완료
  - [ ] 복사 완료

### 4.4 Firebase 보안 규칙

#### 4.4.1 Production 규칙 작성
- [ ] posts collection 규칙
  - [ ] 읽기: 인증된 사용자
  - [ ] 쓰기: 본인 정보만
  - [ ] 수정/삭제: 작성자만
- [ ] comments subcollection 규칙
- [ ] likes collection 규칙
- [ ] bookmarks collection 규칙
- [ ] learning_resources 규칙
- [ ] user_progress 규칙

#### 4.4.2 규칙 테스트
- [ ] Firebase Emulator로 테스트
- [ ] 권한 체크 시나리오 작성
- [ ] Production 배포

### 4.5 성능 최적화

#### 4.5.1 이미지 최적화
- [ ] img → next/Image 전환
- [ ] 모든 이미지 태그 찾기
  ```bash
  grep -r "<img" app/ components/
  ```
- [ ] next/Image로 교체
- [ ] width/height 지정
- [ ] placeholder blur

#### 4.5.2 Code Splitting
- [ ] React.lazy로 페이지 분할
- [ ] Suspense 적용
- [ ] 동적 import
  ```tsx
  const PostEditor = lazy(() => import('./PostEditor'));
  ```

#### 4.5.3 Bundle 분석
- [ ] @next/bundle-analyzer 설치
- [ ] 번들 크기 확인
- [ ] 불필요한 패키지 제거
- [ ] Tree shaking 확인

#### 4.5.4 React Query 최적화
- [ ] staleTime 조정
- [ ] cacheTime 조정
- [ ] refetchOnWindowFocus 제어
- [ ] Prefetching 전략

### 4.6 접근성 (A11y)

#### 4.6.1 Keyboard Navigation
- [ ] 모든 인터랙티브 요소 Tab 가능
- [ ] Focus visible 스타일
- [ ] Skip to content 링크
- [ ] Escape로 모달 닫기

#### 4.6.2 ARIA 속성
- [ ] aria-label 추가
- [ ] aria-describedby
- [ ] role 속성
- [ ] aria-live (동적 콘텐츠)

#### 4.6.3 시맨틱 HTML
- [ ] div → semantic tags
- [ ] button vs a 태그 올바른 사용
- [ ] 헤딩 계층 구조 확인

#### 4.6.4 색상 대비
- [ ] WCAG AA 기준 확인
- [ ] 다크모드 대비 확인
- [ ] Color blind 시뮬레이션

### 4.7 SEO 최적화

#### 4.7.1 메타데이터
- [ ] 모든 페이지 metadata 추가
- [ ] Open Graph 이미지
- [ ] Twitter Card
- [ ] Canonical URL

#### 4.7.2 Sitemap
- [ ] sitemap.xml 생성
- [ ] 동적 페이지 포함
- [ ] robots.txt

#### 4.7.3 구조화된 데이터
- [ ] JSON-LD 스키마
- [ ] Article schema (게시글)
- [ ] Course schema (커리큘럼)

### 4.8 모바일 최적화

#### 4.8.1 반응형 점검
- [ ] 모든 페이지 모바일 테스트
- [ ] 터치 타겟 크기 (44px 이상)
- [ ] 가로 스크롤 방지
- [ ] 폰트 크기 조정

#### 4.8.2 모바일 UX
- [ ] Bottom sheet (모바일 모달)
- [ ] Pull to refresh
- [ ] Swipe 제스처
- [ ] 모바일 네비게이션

### 4.9 최종 검증

#### 4.9.1 전체 기능 테스트
- [ ] 회원가입/로그인 플로우
- [ ] 커리큘럼 전체 탐색
- [ ] Activity 6가지 모두 완료
- [ ] Resource 추가/북마크
- [ ] 커뮤니티 글 작성/댓글
- [ ] 진행률 추적 정확성

#### 4.9.2 크로스 브라우저 테스트
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge

#### 4.9.3 성능 측정
- [ ] Lighthouse 점수
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

#### 4.9.4 보안 점검
- [ ] Firebase 보안 규칙 검증
- [ ] XSS 방지 확인
- [ ] CSRF 방지 (Firebase 기본)
- [ ] 환경 변수 보안

---

## 📝 PHASE 5: 문서화 및 최종 정리

### 5.1 사용자 문서

#### 5.1.1 README 업데이트
- [ ] 프로젝트 소개
- [ ] 주요 기능 목록
- [ ] 기술 스택
- [ ] 설치 방법
- [ ] 환경 변수 설정
- [ ] 실행 방법
- [ ] 스크린샷

#### 5.1.2 사용자 가이드
- [ ] 회원가입 방법
- [ ] 커리큘럼 사용법
- [ ] Activity별 가이드
- [ ] Resource 활용법
- [ ] 커뮤니티 이용 방법

### 5.2 개발자 문서

#### 5.2.1 코드 주석
- [ ] 복잡한 로직 주석 추가
- [ ] 함수 JSDoc 추가
- [ ] 타입 설명 추가

#### 5.2.2 아키텍처 문서
- [ ] 폴더 구조 설명
- [ ] 데이터 플로우
- [ ] 상태 관리 전략
- [ ] API 설계

#### 5.2.3 기여 가이드
- [ ] 코드 스타일
- [ ] PR 프로세스
- [ ] 테스트 작성법
- [ ] 이슈 템플릿

### 5.3 Cleanup

#### 5.3.1 코드 정리
- [ ] 사용 안 하는 파일 삭제
- [ ] console.log 제거
- [ ] TODO 주석 처리
- [ ] 중복 코드 제거

#### 5.3.2 의존성 정리
- [ ] 사용 안 하는 패키지 제거
- [ ] package.json 정리
- [ ] peerDependencies 확인

#### 5.3.3 환경 설정
- [ ] .env.example 업데이트
- [ ] .gitignore 확인
- [ ] vercel.json 설정

### 5.4 배포 준비

#### 5.4.1 Production 빌드
- [ ] npm run build 성공 확인
- [ ] 빌드 경고 해결
- [ ] 번들 크기 확인

#### 5.4.2 환경 변수
- [ ] Production 환경 변수 준비
- [ ] Firebase Production 프로젝트
- [ ] Vercel 환경 변수 설정

#### 5.4.3 배포 체크리스트
- [ ] Firebase 보안 규칙 배포
- [ ] Firestore 인덱스 생성
- [ ] Domain 설정
- [ ] SSL 인증서

---

## 🎉 완료 기준

### 최소 완료 조건 (MVP)
- [ ] ✅ 모든 Activity 콘텐츠 구현 (48개 Activity)
- [ ] ✅ Resource Curation DB (20개 리소스)
- [ ] ✅ Community/Blog (게시글 + 댓글)
- [ ] ✅ 진행률 추적 정상 작동
- [ ] ✅ 에러 처리 및 로딩 상태
- [ ] ✅ 모바일 반응형
- [ ] ✅ Firebase 보안 규칙

### 우수 완료 조건
- [ ] 🌟 모든 기본 조건 + 아래 항목
- [ ] 🌟 좋아요/북마크 시스템
- [ ] 🌟 검색 및 고급 필터
- [ ] 🌟 접근성 (A11y) 준수
- [ ] 🌟 Lighthouse 90+ 점수
- [ ] 🌟 완전한 문서화

---

## 📊 진행 상황 추적

### 현재 상태
- **Phase 0**: ✅ 완료 (사전 조사)
- **Phase 1**: ⏳ 준비 중 (Activity 콘텐츠)
- **Phase 2**: ⬜ 대기 중 (Resource Curation)
- **Phase 3**: ⬜ 대기 중 (Community)
- **Phase 4**: ⬜ 대기 중 (품질 개선)
- **Phase 5**: ⬜ 대기 중 (문서화)

### 예상 일정
- **Phase 1**: 10-14일
- **Phase 2**: 5-6일
- **Phase 3**: 5-9일
- **Phase 4**: 3-5일
- **Phase 5**: 2-3일
- **총 예상**: 25-37일

---

## 🔧 기술 스택 체크리스트

### 프론트엔드
- [x] Next.js 15.5.4
- [x] TypeScript
- [x] Tailwind CSS v4
- [x] React Query
- [x] Zustand
- [ ] react-simplemde-editor (설치 필요)
- [ ] react-markdown (설치 필요)
- [ ] react-hot-toast (설치 필요)

### 백엔드/DB
- [x] Firebase Auth
- [x] Firestore
- [ ] Firestore Security Rules (업데이트 필요)
- [ ] Firestore Indexes (생성 필요)

### APIs
- [ ] Web Speech API (브라우저 테스트 필요)
- [ ] MediaRecorder API (브라우저 테스트 필요)

### 개발 도구
- [ ] ESLint 설정 확인
- [ ] Prettier 설정 확인
- [ ] Husky (pre-commit hook)
- [ ] 번들 분석기

---

## 🚨 위험 요소 및 대응

### 기술적 위험
1. **Web Speech API 브라우저 호환성**
   - 대응: 폴백 UI, "지원 안 함" 안내

2. **Firestore 쿼리 제한**
   - 대응: 복합 인덱스 미리 생성, 클라이언트 필터링

3. **Storage 없이 오디오 저장**
   - 대응: 제출 여부만 추적, 나중에 Storage 추가

### 일정 위험
1. **예상보다 긴 구현 시간**
   - 대응: MVP 기능 먼저, 나머지는 Phase 2로

2. **디버깅 시간 과다**
   - 대응: 단계별 검증, 에러 로깅 강화

### 품질 위험
1. **더미 데이터 사용**
   - 대응: 실제 콘텐츠 우선 작성

2. **테스트 부족**
   - 대응: 각 Phase마다 검증 단계 필수

---

## ✅ 다음 단계

**즉시 시작**: Phase 1.1 - Activity 사전 조사
- [ ] Activity 페이지 코드 완전 분석
- [ ] CEFR 레벨별 콘텐츠 기준 정의
- [ ] JSON 스키마 6가지 설계
- [ ] Web Speech API 기술 검증
- [ ] MediaRecorder API 기술 검증

**작업 시작 전 확인사항**:
- [ ] 개발 서버 실행 중인지 확인
- [ ] Firebase 연결 정상 확인
- [ ] Git 브랜치 생성 (feature/activity-content)
- [ ] 체크리스트 이 문서로 진행 상황 추적
