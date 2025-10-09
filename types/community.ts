// 게시물 타입 (useCommunity.ts와 호환)
export type PostType = 'question' | 'discussion' | 'share' | 'tip';

// 게시물 카테고리 (useCommunity.ts와 호환)
export type PostCategory =
  | 'journal'      // 학습 일지
  | 'tip'          // 팁
  | 'review'       // 리뷰
  | 'question'     // 질문
  | 'success'      // 성공 사례
  | 'grammar'      // 문법
  | 'vocabulary'   // 어휘
  | 'listening'    // 듣기
  | 'speaking'     // 말하기
  | 'reading'      // 읽기
  | 'writing'      // 쓰기
  | 'general'      // 일반
  | 'study-tips';  // 학습 팁

// 난이도 레벨
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2';

// 게시물
export interface Post {
  id: string;
  type: PostType;
  category: PostCategory;
  authorId: string;
  authorName: string;
  authorLevel?: DifficultyLevel;
  title: string;
  content: string; // Markdown
  tags?: string[];
  imageUrls?: string[];
  likes: number;
  viewCount: number;
  replyCount: number;
  isResolved?: boolean; // 질문인 경우 해결 여부
  acceptedReplyId?: string; // 채택된 답변 ID
  createdAt: string;
  updatedAt: string;
}

// 답변/댓글
export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLevel?: DifficultyLevel;
  content: string; // Markdown
  likes: number;
  isAccepted?: boolean; // 채택 여부
  createdAt: string;
  updatedAt: string;
}

// 좋아요
export interface Like {
  id: string;
  userId: string;
  targetId: string; // 게시물 또는 댓글 ID
  targetType: 'post' | 'reply';
  createdAt: string;
}

// 스터디 그룹
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  level: DifficultyLevel;
  category: PostCategory;
  memberIds: string[];
  maxMembers: number;
  isPublic: boolean;
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 그룹 멤버
export interface GroupMember {
  groupId: string;
  userId: string;
  userName: string;
  userLevel?: DifficultyLevel;
  role: 'admin' | 'member';
  joinedAt: string;
}

// 그룹 활동
export interface GroupActivity {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  type: 'post' | 'comment' | 'achievement';
  content: string;
  createdAt: string;
}

// 게시물 생성 데이터
export interface CreatePostData {
  type: PostType;
  category: PostCategory;
  title: string;
  content: string;
  tags?: string[];
  imageUrls?: string[];
}

// 게시물 업데이트 데이터
export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  imageUrls?: string[];
  isResolved?: boolean;
}

// 답변 생성 데이터
export interface CreateReplyData {
  postId: string;
  content: string;
}

// 그룹 생성 데이터
export interface CreateGroupData {
  name: string;
  description: string;
  level: DifficultyLevel;
  category: PostCategory;
  maxMembers: number;
  isPublic: boolean;
  imageUrl?: string;
  tags?: string[];
}
