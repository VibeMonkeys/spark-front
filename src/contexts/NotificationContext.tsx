import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { webSocketClient, WebSocketNotification } from '../shared/api/websocket';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: WebSocketNotification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  showNotification: (notification: Omit<WebSocketNotification, 'id' | 'isRead' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  onShowNotification?: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  onShowNotification 
}) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notification: WebSocketNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // 최대 50개 유지
    
    // 미션 시작 알림은 팝업으로 표시하지 않음 (알림 종에서만 확인 가능)
    if (onShowNotification && notification.type !== 'MISSION_STARTED') {
      const notificationType = mapNotificationType(notification.type);
      setTimeout(() => {
        onShowNotification(notificationType, notification.title, notification.message);
      }, 0);
    }
  }, [onShowNotification]);

  const markAsRead = useCallback((notificationId: number) => {
    if (!user?.id || isNaN(notificationId)) {
      return;
    }
    
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId.toString()
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    // API 호출로 서버에 읽음 상태 업데이트
    fetch(`/api/v1/notifications/${notificationId}/read?userId=${parseInt(user.id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .catch(error => {
      console.error('Failed to mark notification as read:', error);
    });
  }, [user?.id, token]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // API 호출로 서버에 모든 알림 읽음 처리
    try {
      await fetch(`/api/v1/notifications/read-all?userId=${parseInt(user.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [user?.id, token]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showNotification = useCallback((notification: Omit<WebSocketNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const fullNotification: WebSocketNotification = {
      ...notification,
      id: `local-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    addNotification(fullNotification);
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 서버에서 기존 알림 목록 로드
  const loadNotifications = useCallback(async () => {
    if (!user?.id || !token) return;

    try {
      const response = await fetch(`/api/v1/notifications?userId=${parseInt(user.id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const existingNotifications = result.data.map((item: any) => ({
            id: item.id.toString(),
            type: item.type,
            title: item.title,
            message: item.message,
            isRead: item.isRead,
            createdAt: item.createdAt,
          }));
          setNotifications(existingNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (user && token) {
      // 먼저 기존 알림 로드
      loadNotifications();

      // WebSocket 연결
      webSocketClient.updateToken(token);
      webSocketClient.connect()
        .then(() => {
          setIsConnected(true);
        })
        .catch(error => {
          console.error('Failed to connect WebSocket:', error);
          setIsConnected(false);
        });

      // 알림 핸들러 등록
      const unsubscribe = webSocketClient.onNotification(addNotification);

      // 연결 상태 모니터링
      const statusInterval = setInterval(() => {
        setIsConnected(webSocketClient.isConnected());
      }, 5000);

      return () => {
        unsubscribe();
        clearInterval(statusInterval);
      };
    } else {
      // 로그아웃 시 연결 해제
      webSocketClient.disconnect();
      setIsConnected(false);
      setNotifications([]);
    }
  }, [user, token, addNotification, loadNotifications]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      webSocketClient.disconnect();
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 알림 타입을 UI 모달 타입으로 매핑
function mapNotificationType(type: string): 'success' | 'error' | 'warning' | 'info' {
  switch (type) {
    case 'MISSION_COMPLETED':
    case 'LEVEL_UP':
    case 'ACHIEVEMENT_UNLOCKED':
      return 'success';
    case 'MISSION_STARTED':
    case 'FRIEND_ACTIVITY':
      return 'info';
    case 'DAILY_REMINDER':
      return 'warning';
    case 'SYSTEM_ANNOUNCEMENT':
    default:
      return 'info';
  }
}