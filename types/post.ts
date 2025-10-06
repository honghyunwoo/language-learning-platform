// 게시글 타입 정의
export type PostCategory = 'journal' | 'tip' | 'review' | 'question' | 'success';

export interface Post {
  id: string;
  authorId: string;
  authorNickname: string;
  authorLevel: string;
  authorProfilePic: string | null;
  title: string;
  content: string; // 마크다운 형식
  category: PostCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  bookmarkCount: number;
  isPublished: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  authorProfilePic: string | null;
  content: string;
  createdAt: string;
  likeCount: number;
  parentCommentId: string | null; // 답글인 경우
  replies?: Comment[];
}

export interface PostFilters {
  category?: PostCategory;
  tags?: string[];
  level?: string;
  sort?: 'recent' | 'popular' | 'trending';
  limit?: number;
  cursor?: string;
}
