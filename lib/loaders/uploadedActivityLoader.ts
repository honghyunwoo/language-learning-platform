/**
 * Uploaded Activity Loader
 * public/activities/ 폴더에서 Activity JSON 로드
 */

import { cache } from 'react';
import { ActivityType, UploadedActivity } from '@/lib/types/uploaded-activity';

const ACTIVITY_BASE_PATH = '/activities';

const TYPE_FOLDERS: Record<ActivityType, string> = {
  vocabulary: 'vocabulary',
  grammar: 'grammar',
  listening: 'listening',
  speaking: 'speaking',
  reading: 'reading',
  writing: 'writing',
};

/**
 * 특정 Activity 로드
 * @param type Activity 타입
 * @param week 주차 (1-8)
 * @returns Activity 객체 또는 null
 */
export const loadUploadedActivity = cache(
  async (type: ActivityType, week: number): Promise<UploadedActivity | null> => {
    try {
      const folder = TYPE_FOLDERS[type];
      const fileName = `week-${week}-${type}.json`;
      const filePath = `${ACTIVITY_BASE_PATH}/${folder}/${fileName}`;

      const response = await fetch(filePath, {
        next: { revalidate: 3600 }, // 1시간 캐시
      });

      if (!response.ok) {
        console.error(`Failed to load activity: ${filePath}`);
        return null;
      }

      const activity = (await response.json()) as UploadedActivity;
      return activity;
    } catch (error) {
      console.error(`Error loading activity ${type} for week ${week}:`, error);
      return null;
    }
  }
);

/**
 * 특정 주차의 모든 Activity 로드
 * @param week 주차 (1-8)
 * @returns Activity 배열
 */
export const loadWeekActivities = cache(async (week: number): Promise<UploadedActivity[]> => {
  const types: ActivityType[] = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];
  const activities: UploadedActivity[] = [];

  await Promise.all(
    types.map(async (type) => {
      const activity = await loadUploadedActivity(type, week);
      if (activity) {
        activities.push(activity);
      }
    })
  );

  return activities.sort((a, b) => {
    const typeOrder = { vocabulary: 0, grammar: 1, listening: 2, speaking: 3, reading: 4, writing: 5 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
});

/**
 * 모든 Activity 메타데이터 로드
 */
export const loadActivitiesMetadata = cache(async () => {
  try {
    const response = await fetch(`${ACTIVITY_BASE_PATH}/activities-metadata.json`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to load activities metadata');
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading activities metadata:', error);
    return null;
  }
});

/**
 * Activity ID로 로드 (id 형식: "week-{week}-{type}")
 */
export const loadActivityById = cache(async (activityId: string): Promise<UploadedActivity | null> => {
  const match = activityId.match(/week-(\d+)-(\w+)/);
  if (!match) {
    console.error(`Invalid activity ID format: ${activityId}`);
    return null;
  }

  const [, weekStr, typeStr] = match;
  const week = parseInt(weekStr, 10);
  const type = typeStr as ActivityType;

  return loadUploadedActivity(type, week);
});
