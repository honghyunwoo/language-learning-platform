# Activity 페이지 코드 완전 분석

## 📋 파일 위치
`app/dashboard/curriculum/[weekId]/[activityId]/page.tsx`

---

## 🔍 핵심 발견 사항

### 1. **임시 콘텐츠 영역 확인** (216-230 라인)
```tsx
{/* 임시 콘텐츠 - 추후 활동 타입별 실제 콘텐츠로 교체 */}
<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
  <h3>활동 콘텐츠 영역</h3>
  <p>이 영역에 {getActivityTypeLabel(activity.type)} 활동 콘텐츠가 표시됩니다.</p>
</div>
```

**결론**: 214-232 라인을 실제 Activity 컴포넌트로 교체해야 함.

---

## 🎯 페이지 구조 분석

### Props & 데이터 흐름
```typescript
// 1. URL 파라미터
params: { weekId: string; activityId: string }

// 2. 데이터 로딩
const { data: week } = useCurriculumWeek(weekId);
const { data: progress } = useWeekProgress(userId, weekId);

// 3. Activity 객체 추출
const activity = week?.activities.find(a => a.id === activityId);
```

### Activity 객체 타입 (추론)
```typescript
interface Activity {
  id: string;
  type: 'vocabulary' | 'reading' | 'grammar' | 'listening' | 'writing' | 'speaking';
  title: string;
  description: string;
  duration: number; // 분
  difficulty: number; // 1-5
  requiredForCompletion: boolean;
}
```

---

## ✅ 이미 구현된 기능

### 1. 타이머 시스템 (33-59 라인)
- ✅ 초 단위 타이머
- ✅ 일시정지/재개 기능
- ✅ MM:SS 포맷 표시

### 2. 진행률 추적 (62-71, 108-134 라인)
- ✅ `startActivityMutation`: 활동 시작 기록
- ✅ `completeActivityMutation`: 활동 완료 처리
- ✅ `timeSpent` 계산 (분 단위)
- ✅ Firestore 저장

### 3. 네비게이션 (95-100, 235-264 라인)
- ✅ 이전/다음 활동 이동
- ✅ 완료 시 자동 이동
- ✅ "나중에 계속하기" 버튼

### 4. UI/UX
- ✅ Activity 타입별 아이콘 (`ActivityTypeIcon`)
- ✅ Activity 타입별 색상 (`getActivityTypeColor`)
- ✅ Activity 타입별 라벨 (`getActivityTypeLabel`)
- ✅ 완료 상태 표시
- ✅ 필수/선택 배지
- ✅ 다음 활동 미리보기

---

## 🔧 구현 해야 할 부분

### **핵심: 214-232 라인 교체**

현재:
```tsx
<div className="py-8">
  <div className="max-w-3xl mx-auto">
    {/* 임시 콘텐츠 */}
    <div className="bg-gray-50 ...">...</div>
  </div>
</div>
```

변경 후:
```tsx
<div className="py-8">
  <div className="max-w-3xl mx-auto">
    <ActivityContent
      activity={activity}
      weekId={week.id}
      onProgress={(data) => {/* 진행률 업데이트 */}}
    />
  </div>
</div>
```

---

## 📦 필요한 컴포넌트 구조

### 1. ActivityContent (라우터 컴포넌트)
```tsx
// components/activities/ActivityContent.tsx
interface ActivityContentProps {
  activity: Activity;
  weekId: string;
  onProgress?: (progressData: any) => void;
}

export default function ActivityContent({ activity, weekId, onProgress }: ActivityContentProps) {
  switch (activity.type) {
    case 'vocabulary':
      return <VocabularyActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    case 'reading':
      return <ReadingActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    case 'grammar':
      return <GrammarActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    case 'listening':
      return <ListeningActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    case 'writing':
      return <WritingActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    case 'speaking':
      return <SpeakingActivity activity={activity} weekId={weekId} onProgress={onProgress} />;
    default:
      return <div>지원하지 않는 활동 타입입니다.</div>;
  }
}
```

### 2. 각 Activity 타입별 컴포넌트
```
components/activities/
  ├── ActivityContent.tsx          // 라우터
  ├── VocabularyActivity.tsx       // 어휘 학습
  ├── ReadingActivity.tsx          // 읽기
  ├── GrammarActivity.tsx          // 문법
  ├── ListeningActivity.tsx        // 듣기
  ├── WritingActivity.tsx          // 쓰기
  └── SpeakingActivity.tsx         // 말하기
```

---

## 🗄️ 데이터 로딩 전략

### 옵션 1: Static JSON (선택됨 - 빠른 MVP)
```typescript
// data/activities/week-1-vocabulary-1.json
{
  "id": "w1-vocab-1",
  "weekId": "week-1",
  "type": "vocabulary",
  "title": "기본 인사 표현",
  "words": [
    {
      "id": "w1",
      "word": "Hello",
      "pronunciation": "/həˈloʊ/",
      "meaning": "안녕하세요",
      "example": "Hello, how are you?",
      "exampleMeaning": "안녕하세요, 어떻게 지내세요?"
    },
    // ... 19개 더
  ],
  "exercises": [...]
}
```

**로딩 방법**:
```tsx
// hooks/useActivityData.ts
export function useActivityData(activityId: string) {
  return useQuery(['activityData', activityId], async () => {
    const data = await import(`@/data/activities/${activityId}.json`);
    return data.default;
  });
}
```

### 옵션 2: Firestore (나중에)
```tsx
export function useActivityData(activityId: string) {
  return useQuery(['activityData', activityId], async () => {
    const docRef = doc(db, 'activity_content', activityId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  });
}
```

---

## 🔄 진행률 연동 방법

### 현재 페이지가 제공하는 기능
1. **타이머**: `timeElapsed` state (초 단위)
2. **완료 처리**: `handleComplete()` 함수
3. **Mutation**: `completeActivityMutation`

### Activity 컴포넌트가 해야 할 일
```tsx
// VocabularyActivity.tsx 예시
export default function VocabularyActivity({ activity, weekId, onProgress }) {
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // 진행률 업데이트
    onProgress?.({
      masteredWords,
      quizScore,
      completionRate: (masteredWords.length / activity.words.length) * 100
    });
  }, [masteredWords, quizScore]);

  // 컴포넌트 로직...
}
```

---

## 🎨 UI 일관성 유지

### 페이지가 제공하는 스타일
- **최대 너비**: `max-w-3xl` (line 215)
- **중앙 정렬**: `mx-auto`
- **패딩**: `py-8`

### Activity 컴포넌트 스타일 가이드
```tsx
// 모든 Activity 컴포넌트는 다음 구조 사용
<div className="space-y-6">
  {/* 섹션 1: 설명/안내 */}
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">...</div>

  {/* 섹션 2: 주요 콘텐츠 */}
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">...</div>

  {/* 섹션 3: 연습/퀴즈 */}
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">...</div>
</div>
```

---

## 🚀 구현 순서 (권장)

### Step 1: ActivityContent 라우터 생성
- [ ] `components/activities/ActivityContent.tsx` 생성
- [ ] Type switch 로직 구현
- [ ] 기본 에러 처리

### Step 2: Vocabulary Activity (파일럿)
- [ ] JSON 스키마 설계
- [ ] 샘플 데이터 1개 작성 (Week 1)
- [ ] `VocabularyActivity.tsx` 컴포넌트 구현
- [ ] 페이지에 연동 테스트

### Step 3: 나머지 5개 타입 (반복)
- [ ] Reading → Grammar → Listening → Writing → Speaking
- [ ] 각 타입마다 Week 1 데이터 1개씩 작성
- [ ] 컴포넌트 구현 및 테스트

### Step 4: 전체 데이터 작성
- [ ] 각 Week별 6개 Activity × 8주 = 48개
- [ ] 점진적으로 추가 (Week 1-2 먼저, 나머지는 나중에)

---

## 🔍 중요 파일 위치

### 현재 존재하는 파일
- [x] `app/dashboard/curriculum/[weekId]/[activityId]/page.tsx`
- [x] `components/curriculum/ActivityTypeIcon.tsx`
- [x] `hooks/useCurriculum.ts`

### 생성해야 할 파일
- [ ] `components/activities/ActivityContent.tsx`
- [ ] `components/activities/VocabularyActivity.tsx`
- [ ] `components/activities/ReadingActivity.tsx`
- [ ] `components/activities/GrammarActivity.tsx`
- [ ] `components/activities/ListeningActivity.tsx`
- [ ] `components/activities/WritingActivity.tsx`
- [ ] `components/activities/SpeakingActivity.tsx`
- [ ] `data/activities/*.json` (48개)
- [ ] `hooks/useActivityData.ts`

---

## 📊 Activity 타입별 데이터 스키마 (간략)

### Vocabulary
```typescript
{
  words: VocabularyWord[];
  exercises: {
    type: 'multiple_choice' | 'fill_blank' | 'matching';
    questions: Question[];
  }[];
}
```

### Reading
```typescript
{
  passage: { text: string; audioUrl?: string; };
  vocabulary: { word: string; meaning: string; }[];
  questions: ComprehensionQuestion[];
}
```

### Grammar
```typescript
{
  topic: string;
  explanation: { rule: string; examples: Example[]; };
  exercises: GrammarExercise[];
}
```

### Listening
```typescript
{
  audio: { text: string; speed: number; };
  transcript?: string;
  questions: ListeningQuestion[];
}
```

### Writing
```typescript
{
  prompt: string;
  requirements: {
    minWords: number;
    maxWords: number;
    mustInclude?: string[];
  };
  sampleAnswer?: string;
}
```

### Speaking
```typescript
{
  task: string;
  modelAudio?: string;
  tips: string[];
  evaluationCriteria?: {...};
}
```

---

## ✅ 체크리스트 완료 항목

- [x] Activity 페이지 코드 완전 분석
- [x] 임시 콘텐츠 영역 위치 파악 (214-232 라인)
- [x] 기존 기능 목록 작성
- [x] 구현 필요 부분 정의
- [x] 컴포넌트 구조 설계
- [x] 데이터 로딩 전략 결정
- [x] UI 일관성 가이드 작성
- [x] 구현 순서 수립

---

## 🎯 다음 단계

**즉시 시작**: CEFR 레벨별 콘텐츠 기준 정의
- A1, A2, B1, B2 난이도 기준 명확화
- 각 레벨별 어휘, 문법, 문장 복잡도 정의
- 오디오 속도 기준 설정
