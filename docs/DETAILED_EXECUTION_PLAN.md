# 상세 실행 계획 - 데이터 수집 전략 포함

## 📊 데이터 수집 전략

### 1. 필요한 데이터 유형

#### 1.1 레벨 테스트 문제 데이터
- Grammar 문제 20개 (A1-B2)
- Vocabulary 문제 30개 (A1-B2)
- Listening 대화 스크립트 10개

#### 1.2 Activity 콘텐츠 데이터
- 단어 리스트 (각 Week당 20개 × 8주 = 160개)
- 예문 (각 단어당 3개 = 480개)
- 대화 스크립트 (각 Week당 5개 × 8주 = 40개)
- 문법 설명 및 예문
- 읽기 지문 (각 Week당 5개 × 8주 = 40개)

#### 1.3 대화 시뮬레이션 데이터
- 시나리오 스크립트 5개
- 각 시나리오당 대화 턴 6-8개
- 각 턴당 선택지 3개 + 피드백

---

## 🔍 데이터 수집 방법

### Method 1: AI 생성 + 수동 검증 (추천)

**장점**:
- 빠른 속도
- 일관된 품질
- 비용 효율적

**프로세스**:
```
1. ChatGPT/Claude로 초안 생성
   ↓
2. 원어민 표현 검증 (온라인 리소스)
   ↓
3. 난이도 조정
   ↓
4. 최종 검토
```

**예시 프롬프트**:
```
"Create 20 A1-level English vocabulary words for 'Greetings and Introductions'
with Korean translations and 3 example sentences for each word.
Format: JSON with fields: word, pronunciation, partOfSpeech, meaning, examples[]"
```

### Method 2: 기존 리소스 활용 + 재가공

**활용 가능한 리소스**:
- **Cambridge English Corpus**: 실제 영어 사용 예시
- **COCA (Corpus of Contemporary American English)**: 미국 영어 말뭉치
- **British Council LearnEnglish**: CEFR 레벨별 자료
- **Voice of America (VOA) Learning English**: 초급자용 뉴스
- **ESL 교재 참고**: 구조와 난이도 벤치마킹

**합법적 사용**:
- 아이디어와 구조만 참고
- 내용은 직접 작성
- 저작권 침해 주의

### Method 3: 크라우드소싱 (장기 전략)

**단계**:
1. MVP 출시 후 사용자 피드백 수집
2. 원어민 검증자 모집 (커뮤니티)
3. 사용자 제출 예문 검토 후 채택
4. 기여자에게 뱃지 보상

---

## 📋 Phase 1: 레벨 테스트 시스템 (세분화)

### Phase 1.1: 데이터 수집 및 준비 (8-10시간)

#### Task 1.1.1: Grammar 문제 제작 (3-4시간)
**목표**: 20개 문법 문제 (CEFR 레벨별)

**Sub-tasks**:
- [ ] **1.1.1a**: A1 레벨 문제 5개 (1시간)
  - be동사 구분 (am/is/are)
  - 관사 선택 (a/an/the)
  - 단수/복수 명사
  - 기본 시제 (현재)
  - 인칭대명사

  **예시 JSON 구조**:
  ```json
  {
    "id": "grammar-a1-001",
    "level": "A1",
    "question": "I ___ a student.",
    "options": ["am", "is", "are", "be"],
    "correctAnswer": 0,
    "explanation": "'I'와 함께 사용하는 be동사는 'am'입니다.",
    "topic": "be-verb"
  }
  ```

- [ ] **1.1.1b**: A2 레벨 문제 5개 (1시간)
  - 과거 시제 (규칙/불규칙)
  - 미래 시제 (will/be going to)
  - 비교급/최상급
  - 빈도부사 위치
  - some/any

- [ ] **1.1.1c**: B1 레벨 문제 5개 (1시간)
  - 현재완료 (have/has + p.p)
  - 조동사 (can/could/should/must)
  - 가정법 과거 (If I were...)
  - 수동태 (be + p.p)
  - 관계대명사 (who/which/that)

- [ ] **1.1.1d**: B2 레벨 문제 5개 (1-1.5시간)
  - 분사구문
  - 도치 구문
  - 가정법 과거완료
  - 복합 관계대명사
  - 시제 일치

- [ ] **1.1.1e**: 문제 검증 및 JSON 파일 생성 (0.5시간)
  - 난이도 체크
  - 오타/문법 오류 확인
  - `data/levelTest/grammar.json` 생성

#### Task 1.1.2: Vocabulary 문제 제작 (3-4시간)
**목표**: 30개 어휘 문제

**Sub-tasks**:
- [ ] **1.1.2a**: A1 단어 8개 + 문제 (1시간)
  - 주제: 가족, 음식, 숫자, 색깔, 기본 동사
  - 형식: 단어 뜻 맞추기, 동의어, 문장 빈칸

  **예시**:
  ```json
  {
    "id": "vocab-a1-001",
    "level": "A1",
    "question": "My ___ is a teacher. (어머니)",
    "options": ["mother", "father", "sister", "brother"],
    "correctAnswer": 0,
    "wordMeaning": "mother = 어머니"
  }
  ```

- [ ] **1.1.2b**: A2 단어 8개 + 문제 (1시간)
  - 주제: 직업, 취미, 날씨, 장소, 교통
  - 난이도 상승: 문맥 유추

- [ ] **1.1.2c**: B1 단어 7개 + 문제 (1시간)
  - 주제: 추상 개념, 감정, 의견, 사회
  - 형식: 문맥에서 의미 파악

- [ ] **1.1.2d**: B2 단어 7개 + 문제 (1시간)
  - 주제: 관용구, 비즈니스, 학술, 뉴스
  - 형식: 동의어/반의어, 콜로케이션

- [ ] **1.1.2e**: JSON 파일 생성 (0.5시간)
  - `data/levelTest/vocabulary.json`

#### Task 1.1.3: Listening 스크립트 제작 (2-2.5시간)
**목표**: 10개 듣기 대화

**Sub-tasks**:
- [ ] **1.1.3a**: A1-A2 대화 5개 (1-1.5시간)
  - 대화 1: 카페 주문 (3-4턴)
  - 대화 2: 길 묻기
  - 대화 3: 전화 통화
  - 대화 4: 쇼핑
  - 대화 5: 자기소개
  - 각 대화당 1-2문제 (총 7-10문제)

  **예시 스크립트**:
  ```json
  {
    "id": "listening-a1-001",
    "level": "A1-A2",
    "title": "Ordering Coffee",
    "dialogue": [
      { "speaker": "Barista", "text": "Hi! What can I get for you?" },
      { "speaker": "Customer", "text": "Hi! Can I get a latte, please?" },
      { "speaker": "Barista", "text": "Sure! What size?" },
      { "speaker": "Customer", "text": "Medium, please." }
    ],
    "questions": [
      {
        "question": "What does the customer order?",
        "options": ["Latte", "Coffee", "Tea", "Juice"],
        "correctAnswer": 0
      }
    ]
  }
  ```

- [ ] **1.1.3b**: B1-B2 대화 5개 (1시간)
  - 대화 1: 뉴스 요약
  - 대화 2: 직장 회의
  - 대화 3: 인터뷰
  - 대화 4: 학술 토론
  - 대화 5: 전화 상담

- [ ] **1.1.3c**: TTS 음성 테스트 (0.5시간)
  - 각 대화 TTS로 재생 테스트
  - 속도 조정 (0.7x, 1.0x)
  - `data/levelTest/listening.json`

---

### Phase 1.2: UI/UX 구현 (4-6시간)

#### Task 1.2.1: 레벨 테스트 시작 페이지 (1-1.5시간)
- [ ] **1.2.1a**: 페이지 컴포넌트 생성 (0.5시간)
  - `app/level-test/page.tsx` 생성
  - 레이아웃 구조 설계

- [ ] **1.2.1b**: 소개 섹션 UI (0.5시간)
  - 제목: "당신의 영어 실력을 확인하세요"
  - 설명: 테스트 구성 (Grammar 20문제, Vocabulary 30문제, Listening 10문제)
  - 예상 소요 시간: 25-30분
  - 시작 버튼

- [ ] **1.2.1c**: 테스트 안내 모달 (0.5시간)
  - 주의사항
  - 채점 방식 설명
  - "테스트 시작" 버튼

#### Task 1.2.2: 문제 풀이 UI (2-3시간)
- [ ] **1.2.2a**: Grammar 문제 UI (0.5시간)
  - 객관식 라디오 버튼
  - 문제 번호 표시
  - "다음" 버튼

- [ ] **1.2.2b**: Vocabulary 문제 UI (0.5시간)
  - 빈칸 채우기 UI
  - 선택지 버튼 스타일

- [ ] **1.2.2c**: Listening 문제 UI (1시간)
  - 오디오 플레이어 (TTS 버튼)
  - 재생/일시정지 버튼
  - 속도 조절 (느리게/보통)
  - 반복 재생 버튼
  - 대화 스크립트 보기 (처음엔 숨김)

- [ ] **1.2.2d**: 진행 상황 바 (0.5시간)
  - 전체 60문제 중 현재 위치
  - 백분율 표시
  - 색상 변화 (진행될수록 색 변화)

#### Task 1.2.3: 결과 화면 UI (1-1.5시간)
- [ ] **1.2.3a**: 결과 요약 섹션 (0.5시간)
  - 총 점수
  - 판정 레벨 (A1/A2/B1/B2)
  - 축하 메시지

- [ ] **1.2.3b**: 상세 분석 차트 (0.5시간)
  - Chart.js로 레이더 차트
  - Grammar/Vocabulary/Listening 점수 비교
  - 강점/약점 텍스트

- [ ] **1.2.3c**: 추천 Week 카드 (0.5시간)
  - 추천 Week 강조 표시
  - "학습 시작하기" 버튼

---

### Phase 1.3: 로직 구현 (3-4시간)

#### Task 1.3.1: 테스트 진행 로직 (1.5-2시간)
- [ ] **1.3.1a**: 상태 관리 (0.5시간)
  - `useState`로 현재 문제 인덱스
  - 답안 배열 저장
  - 시작 시간 기록

- [ ] **1.3.1b**: 답안 제출 로직 (0.5시간)
  - 답안 선택 시 배열 업데이트
  - "다음" 버튼 활성화
  - 마지막 문제 체크

- [ ] **1.3.1c**: TTS 재생 로직 (0.5시간)
  - useTTS 훅 활용
  - Listening 문제에서 자동/수동 재생
  - 속도 조절 기능

#### Task 1.3.2: 채점 및 레벨 판정 (1-1.5시간)
- [ ] **1.3.2a**: 채점 함수 (0.5시간)
  - Grammar 정답 개수
  - Vocabulary 정답 개수
  - Listening 정답 개수
  - 총점 계산

- [ ] **1.3.2b**: 레벨 판정 알고리즘 (0.5시간)
  ```typescript
  // lib/levelTest/evaluateLevel.ts
  export const evaluateLevel = (scores: TestScores): UserLevel => {
    const grammarLevel = getGrammarLevel(scores.grammar); // 0-5점 → A1, 6-10 → A2...
    const vocabLevel = getVocabLevel(scores.vocabulary);
    const listeningLevel = getListeningLevel(scores.listening);

    // 가장 낮은 레벨을 시작점으로 (안전한 접근)
    const recommendedLevel = Math.min(grammarLevel, vocabLevel, listeningLevel);

    return {
      level: mapToCEFR(recommendedLevel), // A1, A2, B1, B2
      startWeek: getRecommendedWeek(recommendedLevel),
      strengths: analyzeStrengths(scores),
      weaknesses: analyzeWeaknesses(scores),
      grammarScore: scores.grammar,
      vocabularyScore: scores.vocabulary,
      listeningScore: scores.listening
    };
  };
  ```

- [ ] **1.3.2c**: 강점/약점 분석 (0.5시간)
  - 3개 영역 점수 비교
  - 텍스트 생성 ("문법이 강점입니다", "듣기 연습이 필요합니다")

#### Task 1.3.3: Firestore 저장 (0.5-1시간)
- [ ] **1.3.3a**: 결과 저장 함수 (0.5시간)
  ```typescript
  // lib/levelTest/saveLevelTestResult.ts
  export const saveLevelTestResult = async (
    userId: string,
    result: LevelTestResult
  ) => {
    await setDoc(doc(db, 'levelTestResults', userId), {
      ...result,
      completedAt: serverTimestamp(),
      testVersion: '1.0'
    });
  };
  ```

- [ ] **1.3.3b**: 결과 조회 훅 (0.5시간)
  ```typescript
  // hooks/useLevelTestResult.ts
  export const useLevelTestResult = (userId?: string) => {
    return useQuery({
      queryKey: ['levelTestResult', userId],
      queryFn: async () => {
        const docRef = doc(db, 'levelTestResults', userId!);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      },
      enabled: !!userId
    });
  };
  ```

---

## 📋 Phase 2: Week 1-2 Activity 변환 (세분화)

### Phase 2.1: Vocabulary Activity (8-10시간)

#### Task 2.1.1: Week 1 Vocabulary 데이터 수집 (2-3시간)
- [ ] **2.1.1a**: 핵심 단어 20개 선정 (0.5시간)
  - 주제: "인사와 자기소개"
  - AI 프롬프트:
  ```
  "Create a JSON array of 20 A1-level English words for 'Greetings and Self-Introduction'.
  Include: word, pronunciation (IPA), partOfSpeech, koreanMeaning, difficulty (1-5).
  Words should cover: greetings (hello, hi), names (name, my), countries, jobs, basic verbs."
  ```

- [ ] **2.1.1b**: 각 단어별 예문 3개 작성 (1.5-2시간)
  - 총 60개 예문
  - 실생활 상황 기반
  - 난이도 순서 (쉬움 → 어려움)

  **예시**:
  ```json
  {
    "word": "hello",
    "pronunciation": "/həˈloʊ/",
    "partOfSpeech": "interjection",
    "koreanMeaning": "안녕하세요",
    "difficulty": 1,
    "examples": [
      {
        "sentence": "Hello! How are you?",
        "translation": "안녕하세요! 어떻게 지내세요?",
        "situation": "친구를 만났을 때"
      },
      {
        "sentence": "Hello, my name is John.",
        "translation": "안녕하세요, 제 이름은 John입니다.",
        "situation": "처음 만난 사람에게"
      },
      {
        "sentence": "Hello? Is anyone there?",
        "translation": "여보세요? 누구 있나요?",
        "situation": "전화를 걸 때"
      }
    ],
    "imageUrl": "/images/vocabulary/hello.png" // 나중에 추가
  }
  ```

- [ ] **2.1.1c**: 이미지/아이콘 준비 (0.5시간)
  - 무료 아이콘 사이트 활용 (Flaticon, Icons8)
  - 또는 emoji 사용
  - 20개 이미지 수집

#### Task 2.1.2: Week 1 Vocabulary 연습문제 제작 (2-2.5시간)
- [ ] **2.1.2a**: 객관식 문제 5개 (0.5시간)
  - 단어 뜻 맞추기
  ```json
  {
    "type": "multiple-choice",
    "question": "What does 'hello' mean?",
    "options": ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
    "correctAnswer": 0
  }
  ```

- [ ] **2.1.2b**: 빈칸 채우기 5개 (0.5시간)
  - 문장에서 단어 선택
  ```json
  {
    "type": "fill-in-blank",
    "sentence": "___ ! Nice to meet you.",
    "options": ["Hello", "Goodbye", "Sorry", "Please"],
    "correctAnswer": 0
  }
  ```

- [ ] **2.1.2c**: 매칭 문제 5개 (0.5시간)
  - 단어-의미 연결
  ```json
  {
    "type": "matching",
    "pairs": [
      { "word": "hello", "meaning": "안녕하세요" },
      { "word": "name", "meaning": "이름" },
      { "word": "nice", "meaning": "좋은" }
    ]
  }
  ```

- [ ] **2.1.2d**: 문제 검증 (0.5시간)
  - 난이도 조정
  - 오타 수정

#### Task 2.1.3: Week 1 UI 컴포넌트 수정 (1.5-2시간)
- [ ] **2.1.3a**: 기존 VocabularyActivity 분석 (0.5시간)
  - `components/activities/VocabularyActivity.tsx` 읽기
  - 현재 구조 파악
  - 수정 필요 부분 확인

- [ ] **2.1.3b**: 데이터 형식 맞추기 (0.5시간)
  - JSON 스키마 정의
  - TypeScript 인터페이스 업데이트

- [ ] **2.1.3c**: UI 개선 (0.5-1시간)
  - 이미지 표시 추가
  - 예문 섹션 강화
  - TTS 버튼 추가 (단어/예문 읽어주기)

#### Task 2.1.4: Week 2 Vocabulary (동일 프로세스) (2-3시간)
- [ ] 주제: "일상 루틴"
- [ ] 단어 20개 + 예문 60개
- [ ] 연습문제 15개
- [ ] JSON 파일 생성

---

### Phase 2.2: Listening Activity (8-10시간)

#### Task 2.2.1: Week 1 대화 스크립트 제작 (3-4시간)
- [ ] **2.2.1a**: 시나리오 1 - 첫 만남 (0.5-1시간)
  ```json
  {
    "id": "week1-listening-01",
    "title": "첫 만남 인사",
    "level": "A1",
    "scenario": "파티에서 처음 만난 두 사람",
    "dialogue": [
      {
        "speaker": "Tom",
        "text": "Hi! I'm Tom. Nice to meet you!",
        "translation": "안녕하세요! 저는 Tom이에요. 만나서 반가워요!"
      },
      {
        "speaker": "Jane",
        "text": "Hi Tom! I'm Jane. Nice to meet you too!",
        "translation": "안녕하세요 Tom! 저는 Jane이에요. 저도 만나서 반가워요!"
      },
      {
        "speaker": "Tom",
        "text": "Are you from Korea?",
        "translation": "한국에서 오셨나요?"
      },
      {
        "speaker": "Jane",
        "text": "Yes, I am. How about you?",
        "translation": "네, 맞아요. 당신은요?"
      }
    ],
    "questions": [
      {
        "question": "What is the man's name?",
        "options": ["Tom", "Jane", "John", "Mike"],
        "correctAnswer": 0
      },
      {
        "question": "Where is Jane from?",
        "options": ["Korea", "USA", "Japan", "China"],
        "correctAnswer": 0
      }
    ]
  }
  ```

- [ ] **2.2.1b**: 시나리오 2-5 (각 0.5-1시간)
  - 시나리오 2: 이름 묻기
  - 시나리오 3: 국적 묻기
  - 시나리오 4: 직업 묻기
  - 시나리오 5: 작별 인사

- [ ] **2.2.1c**: 질문 제작 (0.5시간)
  - 각 대화당 2-3문제
  - 총 12-15문제

#### Task 2.2.2: TTS 테스트 및 조정 (1-1.5시간)
- [ ] **2.2.2a**: useTTS 개선 (0.5시간)
  - 속도 조절 기능 추가
  - 대화별 재생 기능

- [ ] **2.2.2b**: 음성 테스트 (0.5-1시간)
  - 각 대화 재생 테스트
  - 발음 이상한 단어 수정
  - 속도 0.7x / 1.0x 비교

#### Task 2.2.3: Listening UI 개선 (2-3시간)
- [ ] **2.2.3a**: 오디오 플레이어 UI (1시간)
  - 재생/일시정지 버튼
  - 속도 조절 버튼
  - 진행 바

- [ ] **2.2.3b**: 대화 스크립트 표시 (0.5시간)
  - 처음엔 숨김
  - "스크립트 보기" 버튼
  - 현재 재생 중인 문장 하이라이트

- [ ] **2.2.3c**: 질문 UI (0.5-1시간)
  - 객관식 선택
  - 정답/오답 피드백

#### Task 2.2.4: Week 2 Listening (동일 프로세스) (2-3시간)
- [ ] 주제: "일상 대화"
- [ ] 시나리오 5개
- [ ] 질문 15개

---

### Phase 2.3: Speaking Activity (10-12시간)

#### Task 2.3.1: Week 1 발음 포인트 분석 (2-3시간)
- [ ] **2.3.1a**: 핵심 문장 10개 선정 (0.5시간)
  ```json
  [
    {
      "sentence": "Hello! How are you?",
      "pronunciation": "/həˈloʊ haʊ ɑːr juː/",
      "keyPoints": [
        "Hello의 'H' 발음 강하게",
        "How의 /haʊ/ 이중모음",
        "are you 연음 → /ɑːr juː/"
      ]
    }
  ]
  ```

- [ ] **2.3.1b**: 발음 팁 작성 (1-1.5시간)
  - 각 문장별 발음 포인트 3-5개
  - 한국인이 어려워하는 발음 강조
  - 입모양 설명 (선택사항)

- [ ] **2.3.1c**: 연습 방법 가이드 (0.5-1시간)
  - 단계별 연습 (천천히 → 보통 속도)
  - 녹음해서 비교하기
  - 반복 횟수 추천 (3-5회)

#### Task 2.3.2: TTS 다단계 재생 구현 (2-3시간)
- [ ] **2.3.2a**: 단어별 재생 (1시간)
  - 문장을 단어로 분리
  - 각 단어 개별 재생 버튼
  - 0.5배속으로 천천히

- [ ] **2.3.2b**: 문장 전체 재생 (0.5시간)
  - 느린 속도 (0.7x)
  - 보통 속도 (1.0x)
  - 빠른 속도 (1.3x) - 고급용

- [ ] **2.3.2c**: UI 구현 (0.5-1시간)
  - 재생 버튼 배치
  - 현재 재생 중 단어 하이라이트
  - 속도 표시

#### Task 2.3.3: 역할극 시나리오 제작 (3-4시간)
- [ ] **2.3.3a**: 시나리오 1 - 카페 주문 (1-1.5시간)
  ```json
  {
    "id": "week1-roleplay-01",
    "title": "카페에서 주문하기",
    "roles": [
      { "name": "Customer", "lines": [...] },
      { "name": "Barista", "lines": [...] }
    ],
    "script": [
      { "role": "Barista", "text": "Hi! What can I get for you?" },
      { "role": "Customer", "text": "Hi! Can I get a latte, please?" }
    ],
    "tips": [
      "주문할 때: Can I get... / I'd like...",
      "예의 바르게: please 추가",
      "감사 인사: Thank you!"
    ]
  }
  ```

- [ ] **2.3.3b**: 시나리오 2-3 (각 1시간)
  - 시나리오 2: 길 묻기
  - 시나리오 3: 전화 통화

- [ ] **2.3.3c**: UI 구현 (1시간)
  - 역할 선택 (Customer/Barista)
  - 대사 표시
  - TTS로 상대방 대사 재생
  - 역할 교대 버튼

#### Task 2.3.4: Week 2 Speaking (동일 프로세스) (3-4시간)

---

### Phase 2.4-2.6: Grammar, Writing, Reading (각각 동일한 세분화 프로세스)

**공통 프로세스**:
1. 데이터 수집 (2-3시간)
2. 연습문제 제작 (2-3시간)
3. UI 개선 (1.5-2시간)
4. 테스트 및 검증 (1시간)

---

## 📋 Phase 3: 대화 시뮬레이션 (세분화)

### Phase 3.1: 시나리오 1 - 카페 주문 (5-6시간)

#### Task 3.1.1: 시나리오 설계 (2-3시간)
- [ ] **3.1.1a**: 대화 흐름 설계 (1시간)
  ```
  Turn 1: 바리스타 인사 → 고객 주문
  Turn 2: 사이즈 확인 → 고객 사이즈 선택
  Turn 3: 매장/포장 확인 → 고객 선택
  Turn 4: 이름 확인 → 고객 이름 말하기
  Turn 5: 가격 안내 → 고객 감사 인사
  ```

- [ ] **3.1.1b**: 각 턴별 선택지 작성 (1-1.5시간)
  ```json
  {
    "turn": 1,
    "speaker": "barista",
    "text": "Hi! What can I get for you today?",
    "options": [
      {
        "id": "perfect",
        "text": "Hi! Can I get a tall latte, please?",
        "naturalness": 100,
        "feedback": "✅ 완벽합니다! 'Can I get...'은 가장 자연스러운 주문 표현입니다.",
        "culturalTip": "미국에서는 'please'를 붙이면 더 정중합니다.",
        "points": 20,
        "nextTurn": 2
      },
      {
        "id": "okay",
        "text": "I want a tall latte.",
        "naturalness": 70,
        "feedback": "⚠️ 의미는 통하지만, 'Can I get...' 또는 'I'd like...'가 더 자연스럽습니다.",
        "improvement": "'I want' 대신 'Can I get'을 사용해보세요.",
        "points": 14,
        "nextTurn": 2
      },
      {
        "id": "wrong",
        "text": "Give me a latte.",
        "naturalness": 30,
        "feedback": "❌ 이 표현은 매우 무례하게 들립니다. 'Can I get...'을 사용하세요.",
        "explanation": "'Give me'는 명령조로 들려서 서비스 상황에서는 적절하지 않습니다.",
        "correctForm": "Can I get a tall latte, please?",
        "points": 6,
        "nextTurn": 2
      }
    ]
  }
  ```

- [ ] **3.1.1c**: 피드백 작성 (0.5-1시간)
  - 각 선택지마다 상세 피드백
  - 문화적 팁 추가
  - 개선 제안

#### Task 3.1.2: JSON 데이터 파일 생성 (1시간)
- [ ] **3.1.2a**: 전체 시나리오 JSON 작성
- [ ] **3.1.2b**: 데이터 검증
  - 턴 연결 확인
  - nextTurn ID 매칭
  - 오타 수정

#### Task 3.1.3: UI 컴포넌트 개발 (2-3시간)
- [ ] **3.1.3a**: 채팅 인터페이스 (1시간)
  - 말풍선 스타일
  - 캐릭터 아바타
  - 애니메이션 효과

- [ ] **3.1.3b**: 선택지 버튼 (0.5시간)
  - 3개 버튼 레이아웃
  - 호버 효과
  - 선택 시 애니메이션

- [ ] **3.1.3c**: 피드백 팝업 (0.5-1시간)
  - 점수 표시
  - 피드백 텍스트
  - 다음 턴 넘어가기 버튼

- [ ] **3.1.3d**: 진행률 바 (0.5시간)
  - Turn 1/5 표시
  - 진행률 %

### Phase 3.2: 시나리오 2-5 (각 4-5시간, 동일 프로세스)
- [ ] 시나리오 2: 길 묻기 (4-5시간)
- [ ] 시나리오 3: 전화 주문 (4-5시간)
- [ ] 시나리오 4: 쇼핑 (4-5시간)
- [ ] 시나리오 5: 병원 예약 (4-5시간)

### Phase 3.3: 로직 및 통합 (3-4시간)
- [ ] **3.3.1**: 상태 관리 (1시간)
- [ ] **3.3.2**: 점수 계산 (1시간)
- [ ] **3.3.3**: Firestore 저장 (1시간)
- [ ] **3.3.4**: 완료 화면 (0.5-1시간)

---

## 📋 데이터 수집 자동화 도구

### Tool 1: AI 프롬프트 템플릿
```typescript
// scripts/generateVocabulary.ts
const generateVocabularyPrompt = (week: number, topic: string, level: string) => {
  return `
Create a JSON array of 20 ${level}-level English vocabulary words for the topic: "${topic}".

Requirements:
- Include fields: word, pronunciation (IPA), partOfSpeech, koreanMeaning, difficulty (1-5)
- Provide 3 example sentences per word with Korean translations
- Include situational context for each example
- Ensure words are appropriate for ${level} learners

Format:
{
  "word": "hello",
  "pronunciation": "/həˈloʊ/",
  "partOfSpeech": "interjection",
  "koreanMeaning": "안녕하세요",
  "difficulty": 1,
  "examples": [...]
}
`;
};
```

### Tool 2: 데이터 검증 스크립트
```typescript
// scripts/validateActivityData.ts
export const validateVocabularyData = (data: any) => {
  const errors = [];

  // 필수 필드 체크
  if (!data.word) errors.push('Missing word field');
  if (!data.examples || data.examples.length !== 3) {
    errors.push('Must have exactly 3 examples');
  }

  // 난이도 범위 체크
  if (data.difficulty < 1 || data.difficulty > 5) {
    errors.push('Difficulty must be 1-5');
  }

  return errors;
};
```

### Tool 3: 일괄 변환 스크립트
```bash
# scripts/convertActivities.sh
# Week 1-2 모든 Activity JSON 파일 일괄 생성

for week in 1 2; do
  for type in vocabulary listening speaking grammar writing reading; do
    echo "Generating Week $week - $type..."
    node scripts/generate-${type}.js --week=$week
  done
done
```

---

## 🗓️ 추천 작업 순서

### Week 1 목표
1. Phase 1.1 완료 (데이터 수집)
2. Phase 1.2 완료 (UI)
3. Phase 1.3 완료 (로직)
→ **레벨 테스트 작동**

### Week 2-3 목표
1. Phase 2.1 완료 (Vocabulary Week 1-2)
2. Phase 2.2 완료 (Listening Week 1-2)
→ **2가지 Activity 완성**

### Week 4-5 목표
1. Phase 2.3-2.6 완료 (나머지 Activity)
→ **Week 1-2 전체 완성**

### Week 6-7 목표
1. Phase 3 완료 (대화 시뮬레이션 5개)
→ **핵심 차별화 기능 완성**

### Week 8 목표
1. Phase 12 완료 (통합 테스트)
→ **MVP 출시**

---

## 💾 데이터 파일 구조

```
data/
├── levelTest/
│   ├── grammar.json          # 20 문제
│   ├── vocabulary.json        # 30 문제
│   └── listening.json         # 10 대화
│
├── activities/
│   ├── week-1/
│   │   ├── vocabulary.json    # 20 단어 + 60 예문 + 15 문제
│   │   ├── listening.json     # 5 대화 + 15 문제
│   │   ├── speaking.json      # 10 문장 + 3 역할극
│   │   ├── grammar.json       # 설명 + 20 예문 + 15 문제
│   │   ├── writing.json       # 가이드 + 예시 5개
│   │   └── reading.json       # 5 지문 + 15 문제
│   │
│   └── week-2/
│       └── (동일 구조)
│
└── conversations/
    ├── cafe-order.json        # 5-7 턴 대화
    ├── asking-directions.json
    ├── phone-order.json
    ├── shopping.json
    └── hospital-appointment.json
```

---

## 다음 단계

어떤 Task부터 시작하시겠습니까?

**추천 시작점**:
1. **Phase 1.1.1a**: Grammar A1 문제 5개 제작 (1시간) - 가장 빠르게 완성 가능
2. **Phase 1.1.2a**: Vocabulary A1 문제 8개 제작 (1시간) - 데이터 구조 확립
3. **Phase 2.1.1a**: Week 1 단어 20개 선정 (0.5시간) - AI 활용 연습

어떤 것부터 진행할까요?
