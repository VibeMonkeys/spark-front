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
  console.log('[SW] Service Worker 설치됨');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 캐시 오픈됨');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] 정적 리소스 캐싱 완료');
        return self.skipWaiting(); // 즉시 활성화
      })
  );
});

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker 활성화됨');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] 이전 캐시 삭제:', cacheName);
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
          // API 응답을 임시 캐시에 저장 (10분)
          if (response.ok) {
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
          // 오프라인일 때 캐시된 API 응답 반환
          return caches.match(event.request);
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
          console.log('[SW] 캐시에서 반환:', event.request.url);
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        console.log('[SW] 네트워크에서 가져오기:', event.request.url);
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
  console.log('[SW] Push 알림 수신:', event);
  
  let notificationData = {
    title: 'Spark',
    body: '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'spark-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: '열기',
        icon: '/icons/icon-72x72.png'
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
      console.error('[SW] Push 데이터 파싱 오류:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭됨:', event.notification.tag);
  
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
      console.log('[SW] 백그라운드 동기화 실행')
    );
  }
});