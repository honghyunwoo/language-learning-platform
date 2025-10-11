import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { RangeRequestsPlugin } from 'workbox-range-requests';

declare const self: ServiceWorkerGlobalScope;

// Precache 매니페스트 (next-pwa가 자동 생성)
precacheAndRoute(self.__WB_MANIFEST);

// 1. Documents - Network First (오프라인 폴백 자동 주입)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
      }),
    ],
    networkTimeoutSeconds: 3,
  })
);

// 2. Static Assets - Cache First
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1년
      }),
    ],
  })
);

// 3. Images - Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
      }),
    ],
  })
);

// 4. Audio Files - Stale While Revalidate + Range Requests (Delta 9)
registerRoute(
  ({ url }) => url.pathname.startsWith('/audio/'),
  new StaleWhileRevalidate({
    cacheName: 'audio-files',
    plugins: [
      new RangeRequestsPlugin(), // 부분 요청 지원 (시크바)
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
      }),
    ],
  })
);

// 5. JSON Data - Network First
registerRoute(
  ({ url }) =>
    url.pathname.includes('/activities/') ||
    url.pathname.includes('/assessment/'),
  new NetworkFirst({
    cacheName: 'activity-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1일
      }),
    ],
  })
);

// 업데이트 UX: 사용자 승인 시에만 활성화 (Delta 4)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
