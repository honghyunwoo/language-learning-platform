/**
 * Uploaded Activity 렌더링 페이지
 * /dashboard/learn/1/week-1-vocabulary 형식
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { loadActivityById } from '@/lib/loaders/uploadedActivityLoader';
import ActivityRenderer from '@/components/activities/ActivityRenderer';

interface PageProps {
  params: {
    week: string;
    activityId: string;
  };
}

export default async function UploadedActivityPage({ params }: PageProps) {
  const { activityId } = params;

  // Activity 로드
  const activity = await loadActivityById(activityId);

  if (!activity) {
    notFound();
  }

  return (
    <Suspense fallback={<ActivityLoading />}>
      <ActivityRenderer activity={activity} />
    </Suspense>
  );
}

function ActivityLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading activity...</p>
      </div>
    </div>
  );
}
