# 학습 리소스 큐레이션 DB - 상세 조사 및 설계

**작성일**: 2025-10-05
**목적**: PRD 3.1.2 기능 깊이 분석 및 구현 설계

---

## 📋 PRD 요구사항 분석

### 원문 요구사항
> "검증된 무료 학습 리소스를 체계적으로 분류하고 제시하는 데이터베이스... 직접 사용해보고 검증한 리소스만을 선별하여 제공"

### 핵심 가치 제안
1. **시간 절약**: 사용자가 리소스 검색에 시간 낭비 안 함
2. **품질 보증**: 검증된 리소스만 제공
3. **개인화**: 레벨, 영역, 시간에 맞춘 추천

---

## 🎯 리소스 데이터 구조 설계

### Firestore Schema
```typescript
// types/resource.ts
export interface LearningResource {
  id: string;

  // 기본 정보
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;

  // 분류
  type: ResourceType;
  level: Level[];  // 여러 레벨 가능
  skillAreas: SkillArea[];  // 여러 영역 가능

  // 특징
  contentLength: string;  // "10분", "30분", "1시간"
  frequency: string;      // "매일", "주 3회", "월 1회"
  features: string[];     // ["자막 제공", "느린 속도", "인터랙티브"]

  // 가이드
  usageGuide: string;  // Markdown
  targetAudience: string;

  // 메타데이터
  language: string;  // "en", "ko"
  isPaid: boolean;
  requiresSignup: boolean;

  // 통계
  rating: number;  // 0-5
  reviewCount: number;
  viewCount: number;
  bookmarkCount: number;

  // 관리
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ResourceType =
  | 'youtube_channel'
  | 'youtube_video'
  | 'podcast'
  | 'website'
  | 'app'
  | 'textbook'
  | 'course'
  | 'tool';

export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export type SkillArea =
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation';
```

### Review Schema
```typescript
export interface ResourceReview {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  userLevel: Level;

  rating: number;  // 1-5
  content: string;
  helpful: number;  // 도움됨 카운트

  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔍 필터링 및 검색 시스템

### 필터 옵션
```typescript
export interface ResourceFilters {
  type?: ResourceType[];
  level?: Level[];
  skillArea?: SkillArea[];
  contentLength?: ContentLengthRange;
  isPaid?: boolean;
  minRating?: number;
  language?: string;
}

export interface ContentLengthRange {
  min?: number;  // 분 단위
  max?: number;
}
```

### Firestore 쿼리 전략
```typescript
// hooks/useResources.ts
export const useResources = (filters: ResourceFilters) => {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      let q = collection(db, 'resources');

      // 복합 인덱스 필요한 쿼리
      if (filters.level?.length) {
        q = query(q, where('level', 'array-contains-any', filters.level));
      }

      if (filters.skillArea?.length) {
        q = query(q, where('skillAreas', 'array-contains-any', filters.skillArea));
      }

      if (filters.minRating) {
        q = query(q, where('rating', '>=', filters.minRating));
      }

      // 정렬
      q = query(q, orderBy('rating', 'desc'), orderBy('reviewCount', 'desc'));

      // 페이지네이션
      q = query(q, limit(20));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LearningResource));
    },
    staleTime: 1000 * 60 * 10, // 10분
  });
};
```

### Algolia 검색 (선택 사항)
무료 플랜으로 더 강력한 검색 가능
```typescript
// lib/algolia.ts (선택)
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

const index = searchClient.initIndex('resources');

export const searchResources = async (query: string, filters: ResourceFilters) => {
  const { hits } = await index.search(query, {
    filters: buildAlgoliaFilters(filters),
    hitsPerPage: 20,
  });
  return hits;
};
```

---

## 🎨 UI/UX 설계

### 리소스 카드 컴포넌트
```typescript
// components/resources/ResourceCard.tsx
interface ResourceCardProps {
  resource: LearningResource;
  onBookmark?: (id: string) => void;
}

const ResourceCard = ({ resource, onBookmark }: ResourceCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* 썸네일 */}
      <div className="aspect-video relative">
        <Image
          src={resource.thumbnailUrl || '/placeholder.png'}
          alt={resource.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <Badge className="absolute top-2 right-2">
          {resource.type}
        </Badge>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

        {/* 레벨 및 영역 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {resource.level.map(l => (
            <Badge key={l} variant="outline">{l}</Badge>
          ))}
          {resource.skillAreas.map(area => (
            <Badge key={area} variant="secondary">
              {getSkillAreaLabel(area)}
            </Badge>
          ))}
        </div>

        {/* 특징 */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>⏱️ {resource.contentLength}</span>
          <span>📅 {resource.frequency}</span>
          {resource.isPaid && <span>💰 유료</span>}
        </div>

        {/* 평점 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>⭐ {resource.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              ({resource.reviewCount} 리뷰)
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onBookmark?.(resource.id)}
            >
              🔖 북마크
            </Button>
            <Button
              size="sm"
              onClick={() => window.open(resource.url, '_blank')}
            >
              바로가기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
```

### 필터 UI
```typescript
// components/resources/ResourceFilters.tsx
const ResourceFilters = ({ filters, onFilterChange }: FilterProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <h3 className="font-bold mb-4">필터</h3>

      {/* 레벨 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">레벨</label>
        <div className="flex flex-wrap gap-2">
          {['A1', 'A2', 'B1', 'B2'].map(level => (
            <Checkbox
              key={level}
              checked={filters.level?.includes(level)}
              onCheckedChange={(checked) => {
                // Update filters
              }}
            >
              {level}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* 리소스 타입 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">타입</label>
        <Select
          value={filters.type?.[0]}
          onValueChange={(value) => {
            // Update filters
          }}
        >
          <option value="">전체</option>
          <option value="youtube_channel">YouTube 채널</option>
          <option value="podcast">팟캐스트</option>
          <option value="website">웹사이트</option>
          <option value="app">앱</option>
        </Select>
      </div>

      {/* 학습 영역 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">학습 영역</label>
        <div className="flex flex-wrap gap-2">
          {SKILL_AREAS.map(area => (
            <Checkbox
              key={area}
              checked={filters.skillArea?.includes(area)}
            >
              {getSkillAreaLabel(area)}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* 시간 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">콘텐츠 길이</label>
        <Select>
          <option value="">전체</option>
          <option value="0-15">15분 이하</option>
          <option value="15-30">15-30분</option>
          <option value="30-60">30분-1시간</option>
          <option value="60+">1시간 이상</option>
        </Select>
      </div>

      {/* 평점 */}
      <div className="mb-4">
        <label className="block font-medium mb-2">최소 평점</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating || 0}
          onChange={(e) => {
            // Update filters
          }}
        />
        <span>{filters.minRating || 0}⭐ 이상</span>
      </div>
    </div>
  );
};
```

---

## 📊 샘플 데이터 구조

### YouTube 채널 예시
```json
{
  "id": "res_001",
  "title": "English with Lucy",
  "description": "영국 영어 발음과 일상 회화를 배울 수 있는 채널. 자막 제공.",
  "url": "https://youtube.com/@EnglishwithLucy",
  "thumbnailUrl": "https://yt3.ggpht.com/...",

  "type": "youtube_channel",
  "level": ["A2", "B1", "B2"],
  "skillAreas": ["listening", "pronunciation", "vocabulary"],

  "contentLength": "10-15분",
  "frequency": "주 3-4회",
  "features": [
    "영국 영어 발음",
    "자막 제공",
    "느린 속도 옵션",
    "일상 표현 중심"
  ],

  "usageGuide": "매일 아침 출근길에 1개씩 시청하세요. 자막 없이 먼저 듣고, 이해 안 되는 부분만 자막으로 확인하는 방식을 추천합니다.",
  "targetAudience": "영국 영어에 관심 있는 중급 학습자",

  "language": "en",
  "isPaid": false,
  "requiresSignup": false,

  "rating": 4.7,
  "reviewCount": 234,
  "viewCount": 15600,
  "bookmarkCount": 1200,

  "verified": true,
  "verifiedBy": "admin",
  "verifiedAt": "2025-10-01T00:00:00Z",
  "createdAt": "2025-09-15T00:00:00Z",
  "updatedAt": "2025-10-05T00:00:00Z"
}
```

### 팟캐스트 예시
```json
{
  "id": "res_002",
  "title": "6 Minute English (BBC)",
  "description": "BBC에서 제작한 초급-중급용 6분 영어 팟캐스트",
  "url": "https://www.bbc.co.uk/learningenglish/...",
  "thumbnailUrl": "...",

  "type": "podcast",
  "level": ["A2", "B1"],
  "skillAreas": ["listening", "vocabulary"],

  "contentLength": "6분",
  "frequency": "주 1회",
  "features": [
    "스크립트 제공",
    "어휘 설명",
    "다양한 주제",
    "명확한 발음"
  ],

  "usageGuide": "1. 먼저 스크립트 없이 듣기 2. 스크립트 보며 다시 듣기 3. 새로운 어휘 5개 암기",
  "targetAudience": "듣기 실력을 빠르게 향상시키고 싶은 A2-B1 학습자",

  "language": "en",
  "isPaid": false,
  "requiresSignup": false,

  "rating": 4.9,
  "reviewCount": 567,
  "viewCount": 28900,
  "bookmarkCount": 3400
}
```

---

## 🔧 구현 순서

### Phase 1: 기본 구조 (2일)
```
Day 1:
[ ] 데이터 구조 정의 (types/resource.ts)
[ ] Firestore 컬렉션 생성
[ ] Security Rules 추가
[ ] 샘플 데이터 10개 입력

Day 2:
[ ] ResourceCard 컴포넌트
[ ] ResourceList 페이지
[ ] 기본 필터 (레벨, 타입)
[ ] useResources hook
```

### Phase 2: 필터 및 검색 (1-2일)
```
[ ] ResourceFilters 컴포넌트
[ ] 복합 필터 쿼리
[ ] 무한 스크롤
[ ] URL 쿼리 파라미터 연동
```

### Phase 3: 리뷰 시스템 (1-2일)
```
[ ] ResourceReview 데이터 구조
[ ] 리뷰 작성 컴포넌트
[ ] 리뷰 목록 표시
[ ] 평점 집계
```

### Phase 4: 북마크 및 추천 (1일)
```
[ ] 북마크 기능
[ ] 내 북마크 페이지
[ ] 개인화 추천 알고리즘
```

---

## 📋 필요한 샘플 리소스 목록

### 우선 입력할 리소스 (20개)

**YouTube 채널 (5개)**:
1. English with Lucy (A2-B2, 발음+회화)
2. Learn English with EnglishClass101 (A1-A2, 기초)
3. BBC Learning English (A2-B1, 듣기+어휘)
4. Rachel's English (B1-B2, 발음)
5. Real English (B1-B2, 실생활 영어)

**팟캐스트 (5개)**:
1. 6 Minute English (BBC) (A2-B1)
2. All Ears English (B1-B2)
3. The English We Speak (BBC) (B1-B2)
4. ESL Pod (A2-B1)
5. Voice of America Learning English (A1-A2)

**웹사이트 (5개)**:
1. Duolingo (A1-A2, 어휘+문법)
2. BBC Learning English (A2-B2, 종합)
3. British Council Learn English (A1-B2, 종합)
4. News in Levels (A1-B1, 읽기)
5. LyricsTraining (A2-B2, 듣기)

**앱 (3개)**:
1. HelloTalk (A2-B2, 회화)
2. Tandem (B1-B2, 회화)
3. Anki (전체, 어휘)

**도구 (2개)**:
1. Grammarly (B1-B2, 쓰기)
2. YouGlish (A2-B2, 발음)

---

## 🎯 성공 지표

### 사용성 지표
- 리소스 페이지 체류 시간 > 2분
- 필터 사용률 > 40%
- 리소스 클릭률 > 25%
- 북마크 전환율 > 15%

### 콘텐츠 지표
- 평균 리소스 평점 > 4.0
- 리뷰 작성률 > 10%
- 월간 신규 리소스 추가 > 5개

---

## 💡 확장 아이디어

### 나중에 추가 가능
1. **리소스 플레이리스트**: 사용자가 리소스 묶어서 공유
2. **학습 경로**: "이 리소스 → 다음 리소스" 순서 제안
3. **AI 추천**: 학습 패턴 분석하여 개인화 추천
4. **리소스 요청**: 사용자가 원하는 리소스 요청
5. **크리에이터 협업**: 리소스 제작자와 파트너십

---

**다음 단계**: 블로그/커뮤니티 시스템 상세 조사
