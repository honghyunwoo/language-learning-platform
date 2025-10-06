import { useQuery } from '@tanstack/react-query';

type ActivityType = 'vocabulary' | 'reading' | 'grammar' | 'listening' | 'writing' | 'speaking';

export function useActivityData(type: ActivityType, weekId: string) {
  return useQuery({
    queryKey: ['activityData', type, weekId],
    queryFn: async () => {
      try {
        // weekId 변환: A1-W1 → week-1
        const weekNumber = weekId.split('-W')[1] || '1';
        const fileName = `week-${weekNumber}`;

        // Dynamic import로 JSON 데이터 로드
        const data = await import(
          `@/data/activities/${type}/${fileName}-${type === 'vocabulary' ? 'vocab' : type}.json`
        );
        return data.default;
      } catch (error) {
        console.error(`Failed to load activity data: ${type} ${weekId}`, error);
        throw new Error(`활동 데이터를 불러올 수 없습니다: ${type} ${weekId}`);
      }
    },
    staleTime: Infinity, // 정적 데이터이므로 무한 캐싱
    gcTime: 1000 * 60 * 60, // 1시간 가비지 컬렉션
    retry: 1, // 1번만 재시도
  });
}
