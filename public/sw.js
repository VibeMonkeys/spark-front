// Spark PWA Service Worker
const CACHE_NAME = 'spark-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/manifest.json'
];

// 설치 이벤트 - 정적 리소스 캐싱
self.addEventListener('install', (event) => {
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting(); // 즉시 활성화
      })
  );
});

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim(); // 모든 클라이언트 제어
      })
  );
});

// Fetch 이벤트 - 네트워크 요청 인터셉트
self.addEventListener('fetch', (event) => {
  // API 요청은 항상 네트워크 우선
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // GET 요청만 캐시 (PUT, POST, DELETE 등은 캐시 불가)
          if (response.ok && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open('spark-api-cache').then(cache => {
              cache.put(event.request, responseClone);
              // 10분 후 자동 삭제
              setTimeout(() => {
                cache.delete(event.request);
              }, 10 * 60 * 1000);
            });
          }
          return response;
        })
        .catch(() => {
          // 오프라인일 때 캐시된 API 응답 반환 (GET 요청만)
          if (event.request.method === 'GET') {
            return caches.match(event.request);
          }
          return new Response('Network error', { status: 503 });
        })
    );
    return;
  }

  // 정적 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾은 경우
        if (response) {
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then((response) => {
            // 유효하지 않은 응답이면 그대로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 오프라인 페이지 반환
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Push 알림 이벤트
self.addEventListener('push', (event) => {
  
  let notificationData = {
    title: 'Spark',
    body: '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    tag: 'spark-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: '열기',
        icon: '/icons/icon-72x72.svg'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // 앱 열기
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clients) => {
        // 이미 열린 탭이 있으면 포커스
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 새 탭 열기
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});

// 백그라운드 동기화 (나중에 구현)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 오프라인에서 작성한 데이터 동기화
    );
  }
});