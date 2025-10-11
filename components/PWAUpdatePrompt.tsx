'use client';

import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [wb, setWb] = useState<Workbox | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // ✅ Delta 8: basePath 안전 등록
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      const workbox = new Workbox(`${base}/sw.js`);

      // ✅ Delta 4: waiting 이벤트로 새 버전 감지
      workbox.addEventListener('waiting', () => {
        setShowPrompt(true);
        setWb(workbox);
      });

      workbox.register();
    }
  }, []);

  const handleUpdate = () => {
    if (wb) {
      // ✅ Delta 4: messageSkipWaiting 호출
      wb.messageSkipWaiting();

      // ✅ Delta 4: controlling 이벤트 후 리로드
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-blue-600 p-4 text-white shadow-lg">
      <div className="mb-2 font-semibold">새 버전 이용 가능</div>
      <p className="mb-4 text-sm">
        앱의 새 버전이 준비되었습니다. 업데이트하시겠습니까?
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="rounded bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
        >
          업데이트
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="rounded border border-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          나중에
        </button>
      </div>
    </div>
  );
}
