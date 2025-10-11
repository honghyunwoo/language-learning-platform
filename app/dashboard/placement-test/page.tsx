'use client';

/**
 * Placement Test 페이지
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlacementTestView from '@/components/assessment/PlacementTestView';
import PlacementResult from '@/components/assessment/PlacementResult';
import { PlacementTest, PlacementTestResult } from '@/lib/types/placement-test';
import { gradePlacementTest } from '@/lib/assessment/placementScoring';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PlacementTestPage() {
  const [test, setTest] = useState<PlacementTest | null>(null);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRecentTest, setHasRecentTest] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadTest();
    checkRecentTest();
  }, [user]);

  async function loadTest() {
    try {
      const response = await fetch('/assessment/placement_test.json');
      const data = await response.json();
      setTest(data);
    } catch (error) {
      console.error('Failed to load placement test:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkRecentTest() {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'placementTest', 'latest');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const lastTest = docSnap.data() as PlacementTestResult;
        const lastTestDate = new Date(lastTest.timestamp);
        const daysSince = (Date.now() - lastTestDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSince < 30) {
          setHasRecentTest(true);
          setResult(lastTest);
        }
      }
    } catch (error) {
      console.error('Failed to check recent test:', error);
    }
  }

  async function handleComplete(answers: Record<string, string | number>) {
    if (!test || !user) return;

    // 채점
    const testResult = gradePlacementTest(test, answers);
    testResult.userId = user.uid;

    // Firestore 저장
    try {
      const docRef = doc(db, 'users', user.uid, 'placementTest', 'latest');
      await setDoc(docRef, testResult);

      // 사용자 프로필에 레벨 업데이트
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          level: testResult.level,
          recommendedWeek: testResult.recommendedWeek,
          lastPlacementTest: testResult.timestamp,
        },
        { merge: true }
      );

      setResult(testResult);
    } catch (error) {
      console.error('Failed to save test result:', error);
    }
  }

  function handleRetry() {
    setResult(null);
    setHasRecentTest(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">레벨 테스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 30일 이내 재시험 제한
  if (hasRecentTest && !result) {
    const lastTestDate = new Date(result?.timestamp || '');
    const nextTestDate = new Date(lastTestDate);
    nextTestDate.setDate(nextTestDate.getDate() + 30);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">재시험 대기 중</h2>
          <p className="text-gray-600 mb-6">
            레벨 테스트는 30일에 1회만 응시 가능합니다.
            <br />
            다음 응시 가능일: <strong>{nextTestDate.toLocaleDateString()}</strong>
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Dashboard로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 결과 표시
  if (result) {
    return <PlacementResult result={result} />;
  }

  // 테스트 시작 안내
  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">테스트를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-6">잠시 후 다시 시도해주세요.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Dashboard로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 테스트 진행
  return <PlacementTestView test={test} onComplete={handleComplete} />;
}
