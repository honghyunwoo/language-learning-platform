# 블로그/커뮤니티 시스템 상세 설계

## 📋 목차
1. [개요](#개요)
2. [데이터 스키마](#데이터-스키마)
3. [커뮤니티 카테고리 분석](#커뮤니티-카테고리-분석)
4. [UI/UX 컴포넌트](#uiux-컴포넌트)
5. [기술적 결정사항](#기술적-결정사항)
6. [구현 단계](#구현-단계)
7. [샘플 데이터](#샘플-데이터)

---

## 개요

### PRD 요구사항 (3.1.3)
- 사용자 블로그 작성/관리
- 카테고리별 분류
- Markdown 기반 글 작성
- 댓글, 좋아요, 북마크 기능
- 검색 및 필터링
- 인기글, 최신글 정렬

### 핵심 목표
- 학습자들의 경험 공유와 상호작용
- 커뮤니티 기반 학습 동기 부여
- 리소스 리뷰 및 추천 생태계 구축

---

## 데이터 스키마

### 1. Posts Collection (`posts`)

```typescript
interface Post {
  id: string;
  title: string;
  content: string; // Markdown
  excerpt: string; // 자동 생성 (첫 150자)

  // 작성자 정보
  authorId: string;
  authorName: string;
  authorAvatar?: string;

  // 분류
  category: PostCategory;
  tags: string[]; // 최대 5개

  // 연관 정보
  level?: Level; // 글이 다루는 레벨 (optional)
  relatedResourceId?: string; // 리소스 리뷰인 경우

  // 통계
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;

  // 메타데이터
  status: 'draft' | 'published' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;

  // SEO
  slug: string; // URL-friendly title
  metaDescription?: string;
}

type PostCategory =
  | 'learning_journal'   // 학습 일지
  | 'learning_tips'      // 학습 팁
  | 'resource_review'    // 리소스 리뷰
  | 'qna'                // 질문과 답변
  | 'success_story'      // 성공 사례
  | 'motivation';        // 동기 부여

type Level = 'A1' | 'A2' | 'B1' | 'B2';
```

### 2. Comments Subcollection (`posts/{postId}/comments`)

**결정: Subcollection 방식 선택**
- 이유: 무한 대댓글 방지, 쿼리 성능, 보안 규칙 단순화
- 대댓글은 1단계만 허용 (parent-child 구조)

```typescript
interface Comment {
  id: string;
  postId: string;

  // 작성자
  authorId: string;
  authorName: string;
  authorAvatar?: string;

  // 내용
  content: string; // Plain text, 최대 500자

  // 대댓글 구조
  parentCommentId?: string; // 대댓글인 경우

  // 통계
  likeCount: number;

  // 메타데이터
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  isEdited: boolean;
  isDeleted: boolean; // Soft delete
}
```

### 3. Likes Collection (`likes`)

**결정: 별도 Collection으로 분리**
- 이유: 중복 좋아요 방지, 사용자별 좋아요 목록 조회 용이

```typescript
interface Like {
  id: string; // {userId}_{targetType}_{targetId}
  userId: string;
  targetType: 'post' | 'comment';
  targetId: string; // postId or commentId
  createdAt: Timestamp;
}

// Composite Index 필요:
// - userId + targetType (내가 좋아요한 글/댓글 조회)
// - targetType + targetId (특정 글/댓글의 좋아요 수)
```

### 4. Bookmarks Collection (`bookmarks`)

```typescript
interface Bookmark {
  id: string; // {userId}_{postId}
  userId: string;
  postId: string;

  // 북마크 폴더 (나중에 확장)
  folderId?: string;

  // 개인 메모
  note?: string;

  createdAt: Timestamp;
}

// Composite Index:
// - userId + createdAt (시간순 정렬)
```

### 5. PostViews Collection (`post_views`)

**결정: IP 기반 중복 카운트 방지**

```typescript
interface PostView {
  id: string; // {postId}_{userId or IP}
  postId: string;
  userId?: string; // 로그인 사용자
  ipHash?: string; // 비로그인 사용자 (해시 처리)
  createdAt: Timestamp;
  expiresAt: Timestamp; // 24시간 후 (중복 방지 윈도우)
}

// TTL Index: expiresAt (자동 삭제)
```

---

## 커뮤니티 카테고리 분석

### 1. 학습 일지 (learning_journal)
**목적**: 개인 학습 여정 기록 및 공유

**주요 내용**:
- 일일/주간/월간 학습 기록
- 학습한 내용 요약
- 어려웠던 점과 극복 방법
- 학습 시간 및 진도

**UI 특징**:
- 날짜별 타임라인 뷰
- 연속 학습 일수 배지
- 학습 시간 통계 차트

### 2. 학습 팁 (learning_tips)
**목적**: 효과적인 학습 방법 공유

**주요 내용**:
- 학습 전략 및 기법
- 시간 관리 노하우
- 암기/이해 팁
- 도구 활용법

**UI 특징**:
- Step-by-step 가이드 형식
- 체크리스트 컴포넌트
- 난이도 표시

### 3. 리소스 리뷰 (resource_review)
**목적**: 학습 리소스 평가 및 추천

**주요 내용**:
- 리소스 상세 리뷰
- 장단점 분석
- 추천 대상 (레벨, 학습 목표)
- 사용 후기

**UI 특징**:
- 별점 시스템
- 리소스 카드 미리보기
- pros/cons 섹션

### 4. 질문과 답변 (qna)
**목적**: 학습 중 궁금증 해결

**주요 내용**:
- 문법/표현 질문
- 학습 방향 질문
- 기술적 문제 해결

**UI 특징**:
- 답변 채택 기능
- 답변 정렬 (인기순, 최신순)
- 해결됨/미해결 상태 표시

### 5. 성공 사례 (success_story)
**목적**: 동기 부여 및 롤모델 제시

**주요 내용**:
- 목표 달성 스토리
- 레벨업 경험담
- 시험 합격/인증 취득
- Before/After 비교

**UI 특징**:
- 인스피레이션 강조 디자인
- 타임라인 형식
- 성취 배지 표시

### 6. 동기 부여 (motivation)
**목적**: 학습 의욕 고취

**주요 내용**:
- 격려 메시지
- 학습 명언
- 힘든 시기 극복기
- 목표 재설정 경험

**UI 특징**:
- 감성적 디자인
- 공감 리액션 (❤️, 💪, 🔥)
- 짧고 임팩트 있는 형식

---

## UI/UX 컴포넌트

### 1. PostCard (게시글 카드)

```tsx
// components/community/PostCard.tsx
interface PostCardProps {
  post: Post;
  variant?: 'compact' | 'full';
  showActions?: boolean;
}

// 주요 요소:
// - 카테고리 배지
// - 제목
// - Excerpt (요약)
// - 작성자 정보 (아바타 + 이름)
// - 통계 (조회수, 좋아요, 댓글, 북마크)
// - 작성 시간 (상대 시간: "3시간 전")
// - 태그 목록
```

**레이아웃**:
```
┌─────────────────────────────────────────┐
│ [카테고리]                   [북마크 아이콘] │
│                                         │
│ 게시글 제목                              │
│ 게시글 요약 미리보기...                   │
│                                         │
│ [아바타] 작성자명 • 3시간 전              │
│ 👁 124  ❤️ 45  💬 12                   │
│ #태그1 #태그2                            │
└─────────────────────────────────────────┘
```

### 2. PostEditor (게시글 작성기)

```tsx
// components/community/PostEditor.tsx
interface PostEditorProps {
  initialData?: Partial<Post>;
  onSave: (post: Post) => Promise<void>;
  onCancel: () => void;
}

// 기능:
// - Markdown 에디터 (react-simplemde-editor)
// - 실시간 미리보기
// - 제목, 카테고리, 태그 입력
// - 임시 저장 (localStorage)
// - 이미지 업로드 (나중에 Storage 연동)
```

**레이아웃**:
```
┌─────────────────┬──────────────────────┐
│ 제목 입력        │                      │
├─────────────────┤                      │
│ [카테고리 선택]  │   실시간 미리보기      │
├─────────────────┤                      │
│ Markdown 에디터  │                      │
│                 │                      │
│                 │                      │
└─────────────────┴──────────────────────┘
│ #태그 입력 (최대 5개)                    │
│ [임시저장] [미리보기] [취소] [게시하기]   │
└─────────────────────────────────────────┘
```

### 3. CommentSection (댓글 섹션)

```tsx
// components/community/CommentSection.tsx
interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
}

// 기능:
// - 댓글 작성 (로그인 필요)
// - 대댓글 작성 (1단계만)
// - 댓글 좋아요
// - 댓글 수정/삭제 (본인만)
// - 정렬 (최신순, 인기순)
```

**구조**:
```
┌─────────────────────────────────────────┐
│ 댓글 12개                                │
├─────────────────────────────────────────┤
│ [아바타] 사용자1 • 2시간 전              │
│ 댓글 내용입니다...                       │
│ ❤️ 5   [답글]                          │
│                                         │
│   └─ [아바타] 사용자2 • 1시간 전         │
│      대댓글 내용입니다...                │
│      ❤️ 2                              │
├─────────────────────────────────────────┤
│ [댓글 작성 입력창]                       │
│ [게시]                                  │
└─────────────────────────────────────────┘
```

### 4. CategoryFilter (카테고리 필터)

```tsx
// components/community/CategoryFilter.tsx
interface CategoryFilterProps {
  selectedCategory?: PostCategory;
  onCategoryChange: (category?: PostCategory) => void;
  postCounts: Record<PostCategory, number>;
}
```

**레이아웃** (탭 형식):
```
[ 전체 (245) ] [ 학습일지 (89) ] [ 학습팁 (34) ] ...
```

### 5. PostListView (게시글 목록)

```tsx
// components/community/PostListView.tsx
interface PostListViewProps {
  posts: Post[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  sortBy: 'latest' | 'popular' | 'mostViewed';
  onSortChange: (sort: string) => void;
}

// 기능:
// - 그리드/리스트 뷰 전환
// - 정렬 옵션
// - 무한 스크롤 (react-intersection-observer)
// - 로딩 스켈레톤
```

---

## 기술적 결정사항

### 1. Markdown 에디터
**선택**: `react-simplemde-editor`

**이유**:
- 경량화된 Markdown 에디터
- 실시간 미리보기 내장
- 커스터마이징 가능
- 한국어 지원

**대안 검토**:
- ~~`@uiw/react-md-editor`~~: 더 무겁고 복잡
- ~~`react-quill`~~: WYSIWYG 에디터 (Markdown 아님)

### 2. 댓글 구조
**선택**: Subcollection + 1단계 대댓글

**이유**:
- 무한 중첩 방지 (UX 복잡도 감소)
- 쿼리 성능 최적화
- Firestore 보안 규칙 단순화
- 대부분 커뮤니티는 1-2단계만 사용

**구현 방식**:
```
posts/{postId}/comments/{commentId}
- parentCommentId 필드로 대댓글 관계 표현
- 최상위 댓글: parentCommentId = null
- 대댓글: parentCommentId = 상위 댓글 ID
```

### 3. 좋아요/북마크 중복 방지
**선택**: 복합 ID 전략

```typescript
// Like ID 생성
const likeId = `${userId}_${targetType}_${targetId}`;

// Firestore setDoc with ID
await setDoc(doc(db, 'likes', likeId), likeData);
// → 자동으로 중복 방지 (같은 ID면 덮어쓰기)
```

### 4. 조회수 카운팅
**선택**: IP 해시 기반 24시간 중복 방지

**구현**:
```typescript
// 1. 사용자 식별
const viewId = userId
  ? `${postId}_${userId}`
  : `${postId}_${hashIP(userIP)}`;

// 2. 기존 조회 확인 (24시간 이내)
const existingView = await getDoc(doc(db, 'post_views', viewId));
if (existingView.exists()) return; // 중복 조회

// 3. 조회 기록 생성
await setDoc(doc(db, 'post_views', viewId), {
  postId,
  userId,
  ipHash: !userId ? hashIP(userIP) : null,
  createdAt: serverTimestamp(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

// 4. 게시글 조회수 증가
await updateDoc(doc(db, 'posts', postId), {
  viewCount: increment(1)
});
```

### 5. 실시간 업데이트
**선택**: 선택적 실시간 구독

**전략**:
- 게시글 목록: 실시간 X (새로고침 버튼)
- 게시글 상세: 실시간 O (댓글, 좋아요 수)
- 댓글 섹션: 실시간 O

**이유**: 비용 최적화 + 필요한 곳만 실시간

```typescript
// 실시간 구독 예시
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, `posts/${postId}/comments`),
    (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(comments);
    }
  );
  return unsubscribe;
}, [postId]);
```

---

## 구현 단계

### Phase 1: 기본 게시글 시스템 (2-3일)

**Day 1: 데이터 레이어**
- [ ] Firestore Posts collection 생성
- [ ] 게시글 CRUD hooks 작성
  - `useCreatePost()`
  - `useUpdatePost()`
  - `useDeletePost()`
  - `usePost(postId)`
  - `usePosts(filters)`
- [ ] 보안 규칙 작성 (posts)

**Day 2: UI 컴포넌트**
- [ ] PostCard 컴포넌트
- [ ] PostEditor 컴포넌트 (react-simplemde-editor)
- [ ] PostListView 컴포넌트
- [ ] CategoryFilter 컴포넌트

**Day 3: 페이지 연결**
- [ ] `/dashboard/community` 메인 페이지
- [ ] `/dashboard/community/new` 글쓰기 페이지
- [ ] `/dashboard/community/[postId]` 상세 페이지
- [ ] `/dashboard/community/my-posts` 내 글 관리

### Phase 2: 댓글 시스템 (1-2일)

**Day 4: 댓글 기능**
- [ ] Comments subcollection 생성
- [ ] 댓글 CRUD hooks
  - `useAddComment()`
  - `useComments(postId)`
  - `useUpdateComment()`
  - `useDeleteComment()`
- [ ] CommentSection 컴포넌트
- [ ] 대댓글 UI 구현
- [ ] 보안 규칙 (comments)

### Phase 3: 상호작용 기능 (1-2일)

**Day 5: 좋아요 & 북마크**
- [ ] Likes collection 생성
- [ ] Bookmarks collection 생성
- [ ] Hooks 작성
  - `useLikePost()`
  - `useLikeComment()`
  - `useBookmark()`
  - `useMyBookmarks()`
- [ ] UI 업데이트 (좋아요 버튼, 북마크 아이콘)
- [ ] 보안 규칙 (likes, bookmarks)

**Day 6: 조회수 & 통계**
- [ ] PostViews collection 생성
- [ ] 조회수 카운팅 로직
- [ ] 인기글/최신글 쿼리
- [ ] 통계 표시 UI

### Phase 4: 고급 기능 (1-2일)

**Day 7: 검색 & 필터**
- [ ] 태그 기반 검색
- [ ] 카테고리 필터
- [ ] 정렬 옵션 (최신, 인기, 조회수)
- [ ] 무한 스크롤 구현

**Day 8: 품질 개선**
- [ ] 로딩 스켈레톤
- [ ] 에러 처리
- [ ] 임시 저장 기능 (localStorage)
- [ ] SEO 최적화 (slug, meta)
- [ ] Toast 알림
- [ ] 반응형 디자인 점검

---

## 샘플 데이터

### 샘플 게시글 1: 학습 일지
```typescript
{
  id: "post_001",
  title: "영어 학습 100일 달성! 🎉",
  content: `
# 100일간의 여정

드디어 영어 학습 100일을 달성했습니다!

## 학습 방법
- 매일 아침 30분 듣기 연습
- 주 3회 Speaking 연습
- 매일 10개 단어 암기

## 변화
- Before: 기본 대화도 어려웠음
- After: 간단한 일상 대화 가능!

## 다음 목표
200일 달성하고 B1 레벨 도전하기
  `,
  excerpt: "드디어 영어 학습 100일을 달성했습니다! 매일 아침 30분 듣기 연습, 주 3회 Speaking 연습...",
  authorId: "user_001",
  authorName: "열심히하는학습자",
  authorAvatar: "/avatars/user1.jpg",
  category: "learning_journal",
  tags: ["100일챌린지", "성장기록", "A2"],
  level: "A2",
  viewCount: 234,
  likeCount: 45,
  commentCount: 12,
  bookmarkCount: 8,
  status: "published",
  createdAt: "2025-01-15T09:00:00Z",
  slug: "영어-학습-100일-달성"
}
```

### 샘플 게시글 2: 학습 팁
```typescript
{
  id: "post_002",
  title: "쉐도잉 효과 200% 높이는 방법",
  content: `
# 쉐도잉 완벽 가이드

쉐도잉을 3개월간 매일 하면서 발견한 핵심 팁들을 공유합니다.

## 1. 자료 선택이 80%
- 난이도: 현재 레벨 - 0.5 (약간 쉬운 것)
- 길이: 2-3분 (짧은 게 좋음)
- 관심사: 재미있어야 꾸준히 함

## 2. 3단계 프로세스
1. **듣기만** (3회): 내용 이해
2. **스크립트 보며 따라하기** (5회): 정확한 발음 학습
3. **스크립트 없이 따라하기** (10회): 실전 연습

## 3. 추천 리소스
- TED-Ed (초급)
- BBC 6 Minute English (중급)
- 팟캐스트 (고급)
  `,
  excerpt: "쉐도잉을 3개월간 매일 하면서 발견한 핵심 팁들을 공유합니다...",
  authorId: "user_002",
  authorName: "영어마스터",
  category: "learning_tips",
  tags: ["쉐도잉", "발음", "듣기", "실전팁"],
  viewCount: 567,
  likeCount: 89,
  commentCount: 23,
  bookmarkCount: 34,
  status: "published",
  createdAt: "2025-01-10T14:30:00Z",
  slug: "쉐도잉-효과-200-높이는-방법"
}
```

### 샘플 게시글 3: 리소스 리뷰
```typescript
{
  id: "post_003",
  title: "BBC Learning English 6개월 사용 후기",
  content: `
# BBC Learning English 완전 분석

**종합 평점: ⭐⭐⭐⭐⭐ (5/5)**

## 장점 👍
- 무료!
- 체계적인 레벨별 콘텐츠
- 매일 업데이트되는 6 Minute English
- 발음이 정확한 영국 영어

## 단점 👎
- 영국 영어 중심 (미국 영어 선호자는 주의)
- 앱 UI가 약간 구식
- Speaking 연습은 부족함

## 추천 대상
- A2-B1 레벨 학습자
- 영국 영어 선호자
- 듣기/읽기 집중 학습자

## 사용 팁
1. 6 Minute English를 루틴으로
2. 스크립트 꼭 확인하기
3. Vocabulary 섹션 복습 필수
  `,
  excerpt: "BBC Learning English 6개월 사용 후기. 무료지만 체계적인 콘텐츠...",
  authorId: "user_003",
  authorName: "리소스헌터",
  category: "resource_review",
  tags: ["BBC", "무료리소스", "듣기", "B1"],
  level: "B1",
  relatedResourceId: "resource_002", // BBC 6 Minute English
  viewCount: 892,
  likeCount: 134,
  commentCount: 45,
  bookmarkCount: 67,
  status: "published",
  createdAt: "2025-01-08T11:00:00Z",
  slug: "bbc-learning-english-6개월-후기"
}
```

### 샘플 댓글 예시
```typescript
// post_002의 댓글
{
  id: "comment_001",
  postId: "post_002",
  authorId: "user_004",
  authorName: "초보학습자",
  content: "쉐도잉 시작한 지 일주일인데 이미 효과를 느껴요! 특히 2-3분 짧은 자료 선택 팁이 도움됐습니다.",
  parentCommentId: null,
  likeCount: 12,
  createdAt: "2025-01-11T10:00:00Z",
  isEdited: false,
  isDeleted: false
}

// 대댓글
{
  id: "comment_002",
  postId: "post_002",
  authorId: "user_002",
  authorName: "영어마스터",
  content: "좋은 결과가 있어서 기쁩니다! 꾸준히 하시면 1달 후엔 더 큰 변화를 느끼실 거예요 💪",
  parentCommentId: "comment_001",
  likeCount: 5,
  createdAt: "2025-01-11T11:30:00Z",
  isEdited: false,
  isDeleted: false
}
```

---

## Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 게시글
    match /posts/{postId} {
      // 읽기: 모든 인증된 사용자
      allow read: if request.auth != null;

      // 생성: 인증된 사용자, 본인 정보만
      allow create: if request.auth != null
        && request.resource.data.authorId == request.auth.uid;

      // 수정: 작성자만
      allow update: if request.auth != null
        && resource.data.authorId == request.auth.uid;

      // 삭제: 작성자만
      allow delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;

      // 댓글
      match /comments/{commentId} {
        allow read: if request.auth != null;

        allow create: if request.auth != null
          && request.resource.data.authorId == request.auth.uid;

        allow update, delete: if request.auth != null
          && resource.data.authorId == request.auth.uid;
      }
    }

    // 좋아요
    match /likes/{likeId} {
      allow read: if request.auth != null;

      allow create, delete: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // 북마크
    match /bookmarks/{bookmarkId} {
      allow read, create, delete: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }

    // 조회수 (제한적 쓰기)
    match /post_views/{viewId} {
      allow read: if false; // 직접 읽기 불필요
      allow create: if request.auth != null;
    }
  }
}
```

---

## 성능 최적화 전략

### 1. Firestore 복합 인덱스
```
Collection: posts
- category (Ascending) + publishedAt (Descending)
- authorId (Ascending) + createdAt (Descending)
- status (Ascending) + likeCount (Descending)

Collection: likes
- userId (Ascending) + targetType (Ascending)
- targetType (Ascending) + targetId (Ascending)

Collection: bookmarks
- userId (Ascending) + createdAt (Descending)
```

### 2. React Query 캐싱 전략
```typescript
// 게시글 목록: 5분 캐싱
useQuery(['posts', filters], fetchPosts, {
  staleTime: 5 * 60 * 1000,
});

// 게시글 상세: 실시간 업데이트
useQuery(['post', postId], fetchPost, {
  staleTime: 0, // 항상 최신 데이터
  refetchInterval: 30000, // 30초마다 refetch
});
```

### 3. 페이지네이션
```typescript
// 무한 스크롤 방식
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  ['posts', category],
  ({ pageParam = null }) => fetchPosts(category, pageParam),
  {
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
  }
);

// Firestore 쿼리
const fetchPosts = async (category, startAfter) => {
  let q = query(
    collection(db, 'posts'),
    where('category', '==', category),
    orderBy('publishedAt', 'desc'),
    limit(20)
  );

  if (startAfter) {
    q = query(q, startAfter(startAfter));
  }

  const snapshot = await getDocs(q);
  return {
    posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  };
};
```

---

## 다음 단계 체크리스트

### 우선순위 결정 필요
- [ ] Resource Curation DB 먼저? (독립적, 빠른 구현 가능)
- [ ] Community 먼저? (사용자 참여 핵심)
- [ ] 병렬 구현? (두 팀으로 나눠서)

### 기술 검증 필요
- [ ] react-simplemde-editor 한국어 테스트
- [ ] Firestore 복합 쿼리 성능 테스트
- [ ] 무한 스크롤 스크롤 성능 테스트

### 디자인 검토 필요
- [ ] 카테고리별 색상 스키마
- [ ] 게시글 카드 레이아웃 finalize
- [ ] 모바일 반응형 체크

---

## 예상 문제점 및 대응책

### 문제 1: Markdown 이미지 업로드
**문제**: Storage 결제 필요
**대응**:
- 단기: 외부 이미지 URL만 허용
- 중기: Imgur API 연동 (무료)
- 장기: Storage 결제 후 직접 호스팅

### 문제 2: 스팸/어뷰징
**문제**: 무분별한 게시글 작성
**대응**:
- Rate limiting (1시간 5개 제한)
- 신고 기능
- 관리자 검토 시스템 (나중에)

### 문제 3: 댓글 알림
**문제**: 내 글에 댓글 달렸을 때 알림
**대응**:
- 단기: 없음 (MVP)
- 중기: 인앱 알림 (Firestore trigger)
- 장기: 이메일 알림 (Firebase Functions)

### 문제 4: SEO
**문제**: 게시글 검색 노출
**대응**:
- Next.js metadata API 활용
- Slug 기반 URL
- Open Graph 태그
- Sitemap 생성

---

## 총 예상 구현 시간

| Phase | 작업 | 예상 시간 |
|-------|------|-----------|
| 1 | 기본 게시글 시스템 | 2-3일 |
| 2 | 댓글 시스템 | 1-2일 |
| 3 | 상호작용 기능 | 1-2일 |
| 4 | 고급 기능 & 품질 | 1-2일 |
| **총합** | | **5-9일** |

**리소스 큐레이션과 비교**:
- Resource Curation: 5-6일
- Community: 5-9일
- **병렬 구현 가능**: 두 기능은 독립적

---

## 최종 권고사항

1. **Resource Curation 먼저 구현 추천**
   - 이유: 더 단순하고 빠름, 커뮤니티 리소스 리뷰의 기반
   - 순서: Resource DB → Community (리소스 리뷰 카테고리 연동)

2. **Community는 MVP 접근**
   - Phase 1-2만 먼저 (게시글 + 댓글)
   - Phase 3-4는 사용자 피드백 후 (좋아요, 북마크, 검색)

3. **품질 우선**
   - 더미 데이터 대신 실제 샘플 3-5개 작성
   - 에러 처리 철저히
   - 모바일 반응형 필수

4. **Activity 콘텐츠와의 조화**
   - Activity 완료 후 "학습 일지 작성하기" 유도
   - Resource 사용 후 "리뷰 남기기" 프롬프트
