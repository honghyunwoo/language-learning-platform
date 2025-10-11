/**
 * Activity Loader - 자동 Activity Import 시스템
 * 영어의 정석 - 48개 Activity 자동 로드
 */

import { Activity, ActivityType, ActivityMetadata } from '@/lib/types/activity';
import { cache } from 'react';

// ===== 파일 경로 상수 =====
const ACTIVITY_BASE_PATH = '/activities';
const ACTIVITY_FOLDERS: Record<ActivityType, string> = {
  vocabulary: 'vocabulary',
  grammar: 'grammar',
  listening: 'listening',
  speaking: 'speaking',
  reading: 'reading',
  writing: 'writing',
};

// ===== Activity 로드 함수 (캐시됨) =====
export const loadActivity = cache(async (type: ActivityType, weekId: string): Promise<Activity | null> => {
  try {
    const folder = ACTIVITY_FOLDERS[type];
    const fileName = `week-${weekId.split('-')[1]}-${getActivityFilePrefix(type)}.json`;
    const filePath = `${ACTIVITY_BASE_PATH}/${folder}/${fileName}`;

    const response = await fetch(filePath, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      console.warn(`Failed to load activity: ${filePath}`);
      return null;
    }

    const activity = await response.json();
    return activity as Activity;
  } catch (error) {
    console.error(`Error loading activity ${type} for ${weekId}:`, error);
    return null;
  }
});

// ===== 여러 Activity 로드 =====
export async function loadActivities(type: ActivityType, weekIds: string[]): Promise<Activity[]> {
  const promises = weekIds.map((weekId) => loadActivity(type, weekId));
  const results = await Promise.all(promises);
  return results.filter((activity): activity is Activity => activity !== null);
}

// ===== 주차별 모든 Activity 로드 =====
export async function loadWeekActivities(weekId: string): Promise<Partial<Record<ActivityType, Activity>>> {
  const types: ActivityType[] = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];

  const results = await Promise.all(
    types.map(async (type) => {
      const activity = await loadActivity(type, weekId);
      return { type, activity };
    })
  );

  const activitiesMap: Partial<Record<ActivityType, Activity>> = {};
  results.forEach(({ type, activity }) => {
    if (activity) {
      activitiesMap[type] = activity;
    }
  });

  return activitiesMap;
}

// ===== 모든 Activity 메타데이터 로드 =====
export const loadAllActivitiesMetadata = cache(async (): Promise<ActivityMetadata[]> => {
  try {
    const response = await fetch('/activities-metadata.json', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // Fallback: 모든 Activity를 수동으로 로드
      return generateAllActivitiesMetadata();
    }

    const metadata = await response.json();
    return metadata as ActivityMetadata[];
  } catch (error) {
    console.error('Error loading activities metadata:', error);
    return generateAllActivitiesMetadata();
  }
});

// ===== Activity 메타데이터 생성 (Fallback) =====
async function generateAllActivitiesMetadata(): Promise<ActivityMetadata[]> {
  const types: ActivityType[] = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];
  const weeks = Array.from({ length: 8 }, (_, i) => `week-${i + 1}`);

  const metadata: ActivityMetadata[] = [];

  for (const type of types) {
    for (const weekId of weeks) {
      try {
        const activity = await loadActivity(type, weekId);
        if (activity) {
          metadata.push({
            id: activity.id,
            type: activity.type,
            weekId: activity.weekId,
            level: activity.level,
            title: activity.title,
            description: activity.description,
            estimatedTime: activity.estimatedTime,
            difficulty: activity.difficulty,
          });
        }
      } catch (error) {
        console.warn(`Failed to generate metadata for ${type} ${weekId}`);
      }
    }
  }

  return metadata;
}

// ===== Activity 검색 =====
export async function searchActivities(query: string, filters?: {
  type?: ActivityType;
  level?: string;
  weekId?: string;
}): Promise<ActivityMetadata[]> {
  const allMetadata = await loadAllActivitiesMetadata();

  return allMetadata.filter((metadata) => {
    // 텍스트 검색
    const matchesQuery =
      query === '' ||
      metadata.title.toLowerCase().includes(query.toLowerCase()) ||
      metadata.description.toLowerCase().includes(query.toLowerCase());

    // 필터 적용
    const matchesType = !filters?.type || metadata.type === filters.type;
    const matchesLevel = !filters?.level || metadata.level === filters.level;
    const matchesWeek = !filters?.weekId || metadata.weekId === filters.weekId;

    return matchesQuery && matchesType && matchesLevel && matchesWeek;
  });
}

// ===== Activity 파일명 prefix 가져오기 =====
function getActivityFilePrefix(type: ActivityType): string {
  const prefixes: Record<ActivityType, string> = {
    vocabulary: 'vocab',
    grammar: 'grammar',
    listening: 'listening',
    speaking: 'speaking',
    reading: 'reading',
    writing: 'writing',
  };
  return prefixes[type];
}

// ===== Activity 유효성 검증 =====
export function validateActivity(activity: unknown): { valid: boolean; errors: string[] } {
  const act = activity as Record<string, unknown>;
  const errors: string[] = [];

  if (!act.id) errors.push('Missing id');
  if (!act.weekId) errors.push('Missing weekId');
  if (!act.type) errors.push('Missing type');
  if (!act.level) errors.push('Missing level');
  if (!act.title) errors.push('Missing title');
  if (!act.description) errors.push('Missing description');

  const validTypes: ActivityType[] = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];
  if (act.type && !validTypes.includes(act.type as ActivityType)) {
    errors.push(`Invalid type: ${act.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ===== Server-side Activity 로드 (Static) =====
export async function loadActivityStatic(type: ActivityType, weekId: string): Promise<Activity | null> {
  try {
    const folder = ACTIVITY_FOLDERS[type];
    const fileName = `week-${weekId.split('-')[1]}-${getActivityFilePrefix(type)}.json`;
    const filePath = `./data/activities/${folder}/${fileName}`;

    // Next.js environment에서 동적 import 사용
    const fs = await import('fs/promises');
    const path = await import('path');

    const fullPath = path.resolve(process.cwd(), filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const activity = JSON.parse(fileContent);

    return activity as Activity;
  } catch (error) {
    console.error(`Error loading activity ${type} for ${weekId}:`, error);
    return null;
  }
}

// ===== 클라이언트 사이드 Activity 로드 (Public) =====
export async function loadActivityClient(type: ActivityType, weekId: string): Promise<Activity | null> {
  try {
    const folder = ACTIVITY_FOLDERS[type];
    const weekNumber = weekId.split('-')[1];
    const fileName = `week-${weekNumber}-${getActivityFilePrefix(type)}.json`;

    // Public 폴더에서 로드 (클라이언트 사이드)
    const response = await fetch(`/activities/${folder}/${fileName}`);

    if (!response.ok) {
      console.warn(`Failed to load activity: ${fileName}`);
      return null;
    }

    const activity = await response.json();
    return activity as Activity;
  } catch (error) {
    console.error(`Error loading activity ${type} for ${weekId}:`, error);
    return null;
  }
}
