'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { AuthProvider } from '@/contexts/AuthContext';

// localforage를 사용한 IndexedDB persister (7일 캐시)
const createIDBPersister = () => {
  if (typeof window === 'undefined') return undefined;

  return createSyncStoragePersister({
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item;
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          // Storage quota exceeded 처리
          console.warn('LocalStorage quota exceeded');
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          console.warn('Failed to remove item from localStorage');
        }
      },
    },
  });
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 60 * 24 * 7, // 7일 (이전 cacheTime)
            retry: 3, // 3번 재시도
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  const [persister] = useState(() => createIDBPersister());

  // 온라인/오프라인 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      queryClient.invalidateQueries();
      console.log('🟢 온라인 복구 - 데이터 동기화 중...');
    };

    const handleOffline = () => {
      console.log('🔴 오프라인 모드 - 캐시된 데이터 사용');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  if (!persister) {
    // SSR 환경에서는 persister 없이 동작
    return (
      <AuthProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>{children}</ToastProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ErrorBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
            dehydrateOptions: {
              shouldDehydrateQuery: (query) => {
                // API 호출 결과만 캐시 (mutation 제외)
                return query.state.status === 'success';
              },
            },
          }}
        >
          <ToastProvider>{children}</ToastProvider>
        </PersistQueryClientProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}
