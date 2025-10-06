// 학습 리소스 타입 정의
export type ResourceType = 'youtube' | 'podcast' | 'website' | 'app';
export type ResourceCategory = 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
export type ResourceDuration = '10min' | '15-30min' | '30min+';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  levels: string[]; // ['A1', 'A2']
  categories: ResourceCategory[];
  duration: ResourceDuration;
  features: string[]; // ['subtitles', 'slow-speed', 'interactive']
  howToUse: string;
  pros: string[];
  cons: string[];
  rating: number; // 1-5
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  userId: string;
  userNickname: string;
  rating: number;
  review: string;
  helpful: number;
  createdAt: string;
}

export interface ResourceFilters {
  type?: ResourceType;
  levels?: string[];
  categories?: ResourceCategory[];
  duration?: ResourceDuration;
  features?: string[];
  sort?: 'rating' | 'recent' | 'popular';
}
