// PWA 유틸리티 함수들

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;

  constructor() {
    this.init();
  }

  private init() {
    // Service Worker 등록
    this.registerServiceWorker();
    
    // 설치 프롬프트 이벤트 감지
    this.setupInstallPrompt();
    
    // 설치 상태 확인
    this.checkInstallStatus();
  }

  // Service Worker 등록
  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker 등록 성공:', registration.scope);
        
        // 업데이트 확인
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새 버전 사용 가능
                this.showUpdateAvailable();
              }
            });
          }
        });
        
      } catch (error) {
        console.error('❌ Service Worker 등록 실패:', error);
      }
    }
  }

  // 설치 프롬프트 설정
  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 PWA 설치 프롬프트 사용 가능');
      e.preventDefault(); // 기본 프롬프트 방지
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      
      // 커스텀 설치 버튼 표시
      this.showInstallButton();
    });

    // 설치 완료 이벤트
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA 설치 완료!');
      this.isInstalled = true;
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  // 설치 상태 확인
  private checkInstallStatus() {
    // 스탠드얼론 모드인지 확인 (설치된 상태)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('📱 PWA가 이미 설치되어 있음');
    }

    // iOS Safari 홈화면 추가 확인
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
      console.log('🍎 iOS에서 홈화면에 추가됨');
    }
  }

  // PWA 설치 실행
  public async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('❌ 설치 프롬프트를 사용할 수 없음');
      return false;
    }

    try {
      // 설치 프롬프트 표시
      await this.deferredPrompt.prompt();
      
      // 사용자 선택 대기
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ 사용자가 PWA 설치를 수락함');
        return true;
      } else {
        console.log('❌ 사용자가 PWA 설치를 거부함');
        return false;
      }
    } catch (error) {
      console.error('❌ PWA 설치 중 오류:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  // 설치 가능 여부 확인
  public isInstallable(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  // 이미 설치된 상태인지 확인
  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  // 커스텀 설치 버튼 표시
  private showInstallButton() {
    // 실제 UI에서는 설치 버튼을 표시
    const event = new CustomEvent('pwa-installable', { detail: true });
    window.dispatchEvent(event);
  }

  // 설치 버튼 숨기기
  private hideInstallButton() {
    const event = new CustomEvent('pwa-installable', { detail: false });
    window.dispatchEvent(event);
  }

  // 업데이트 사용 가능 알림
  private showUpdateAvailable() {
    const event = new CustomEvent('pwa-update-available');
    window.dispatchEvent(event);
  }

  // Push 알림 권한 요청
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('❌ 이 브라우저는 알림을 지원하지 않음');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Push 구독 설정 (WebSocket 연동용)
  public async setupPushSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // VAPID public key (실제로는 환경변수에서 가져와야 함)
          'BGxJjfNpWJoOjMuyF5mFjfFZXwrz4Q4QJ4iO3L5IjxKqh1_NzR0pT8zGqN3YFxuoV2IzJnN8Eg2Vo6qQ8J4YUxE'
        )
      });

      console.log('✅ Push 구독 성공:', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Push 구독 실패:', error);
      return null;
    }
  }

  // VAPID 키 변환 헬퍼
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// 싱글톤 인스턴스
export const pwaManager = new PWAManager();

// React Hook
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // PWA 상태 이벤트 리스너
    const handleInstallable = (event: CustomEvent) => {
      setIsInstallable(event.detail);
    };

    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('pwa-installable', handleInstallable as EventListener);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    // 초기 상태 설정
    setIsInstalled(pwaManager.isAppInstalled());
    setIsInstallable(pwaManager.isInstallable());

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable as EventListener);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
    updateAvailable,
    installPWA: () => pwaManager.installPWA(),
    requestNotificationPermission: () => pwaManager.requestNotificationPermission(),
  };
};

// 타입 추가
import { useState, useEffect } from 'react';