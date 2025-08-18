import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { webSocketClient, WebSocketNotification } from '../shared/api/websocket';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: WebSocketNotification[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: number) => void;
  deleteAllNotifications: () => void;
  clearNotifications: () => void;
  showNotification: (notification: Omit<WebSocketNotification, 'id' | 'isRead' | 'createdAt'>) => void;
  navigateFromNotification: (actionUrl: string) => void;
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
  onNavigate?: (view: string, tab?: string) => void;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  onShowNotification,
  onNavigate 
}) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 상태를 자동으로 클리어
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // 5초 후 에러 메시지 제거

      return () => clearTimeout(timer);
    }
  }, [error]);

  const addNotification = useCallback((notification: WebSocketNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // 최대 50개 유지
    
    // 미션 관련 알림은 팝업으로 표시하지 않음 (알림 종에서만 확인 가능)
    if (onShowNotification && 
        notification.type !== 'MISSION_STARTED' && 
        notification.type !== 'MISSION_COMPLETED') {
      const notificationType = mapNotificationType(notification.type);
      setTimeout(() => {
        onShowNotification(notificationType, notification.title, notification.message);
      }, 0);
    }
  }, [onShowNotification]);

  const markAsRead = useCallback(async (notificationId: number) => {
    if (!user?.id || isNaN(notificationId)) {
      return;
    }
    
    // 낙관적 업데이트
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id == notificationId || notification.id === notificationId.toString()
          ? { ...notification, isRead: true }
          : notification
      );
      return updated;
    });
    
    // API 호출로 서버에 읽음 상태 업데이트
    try {
      const response = await fetch(`/notifications/${notificationId}/read?userId=${parseInt(user.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('읽음 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('알림 읽음 처리에 실패했습니다.');
      // 실패 시 상태를 원상복구
      setNotifications(prev => 
        prev.map(notification =>
          notification.id == notificationId || notification.id === notificationId.toString()
            ? { ...notification, isRead: false }
            : notification
        )
      );
    }
  }, [user?.id, token]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    // 낙관적 업데이트
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // API 호출로 서버에 모든 알림 읽음 처리
    try {
      const response = await fetch(`/notifications/read-all?userId=${parseInt(user.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('모든 알림 읽음 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setError('모든 알림 읽음 처리에 실패했습니다.');
      // 실패 시 원래 상태로 복원 (읽지 않은 상태로 되돌리기)
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: false }))
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token]);

  const deleteNotification = useCallback(async (notificationId: number) => {
    if (!user?.id || isNaN(notificationId)) {
      return;
    }
    
    setError(null);
    
    // 삭제할 알림을 백업하고 UI에서 먼저 제거
    let deletedNotification: WebSocketNotification | null = null;
    setNotifications(prev => {
      deletedNotification = prev.find(n => n.id === notificationId.toString() || n.id == notificationId) || null;
      const filtered = prev.filter(notification => notification.id !== notificationId.toString() && notification.id != notificationId);
      return filtered;
    });
    
    // API 호출로 서버에서 삭제
    try {
      const response = await fetch(`/notifications/${notificationId}?userId=${parseInt(user.id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('알림 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setError('알림 삭제에 실패했습니다.');
      // 실패 시 삭제된 알림을 다시 복원
      if (deletedNotification) {
        setNotifications(prev => [deletedNotification!, ...prev]);
      }
    }
  }, [user?.id, token]);

  const deleteAllNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    // 모든 알림을 백업하고 UI에서 먼저 제거
    let previousNotifications: WebSocketNotification[] = [];
    setNotifications(prev => {
      previousNotifications = [...prev];
      return [];
    });
    
    // API 호출로 서버에서 모든 알림 삭제
    try {
      const response = await fetch(`/notifications/all?userId=${parseInt(user.id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('모든 알림 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      setError('모든 알림 삭제에 실패했습니다.');
      // 실패 시 백업된 알림들을 복원
      setNotifications(previousNotifications);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const navigateFromNotification = useCallback((actionUrl: string) => {
    if (!onNavigate) return;
    
    // 외부 URL인 경우
    if (actionUrl.startsWith('http://') || actionUrl.startsWith('https://')) {
      window.open(actionUrl, '_blank');
      return;
    }
    
    // 내부 라우트 매핑
    switch (actionUrl) {
      case '/missions/current':
        onNavigate('main', 'missions');
        break;
      case '/profile':
        // 프로필 관련 데이터 새로고침
        if (user?.id) {
          queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
          queryClient.invalidateQueries({ queryKey: ['level-progress', user.id] });
          queryClient.invalidateQueries({ queryKey: ['achievements', user.id] });
          queryClient.invalidateQueries({ queryKey: ['category-statistics', user.id] });
          queryClient.invalidateQueries({ queryKey: ['missions-completed-recent', user.id] });
        }
        onNavigate('main', 'profile');
        break;
      case '/achievements':
        // 업적 관련 데이터 새로고침
        if (user?.id) {
          queryClient.invalidateQueries({ queryKey: ['achievements', user.id] });
          queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        }
        onNavigate('main', 'profile'); // 일단 프로필 탭으로
        break;
      default:
        onNavigate('main', 'home');
        break;
    }
  }, [onNavigate, queryClient, user?.id]);

  const showNotification = useCallback((notification: Omit<WebSocketNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const fullNotification: WebSocketNotification = {
      ...notification,
      id: `local-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    addNotification(fullNotification);
  }, [addNotification]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // 서버에서 기존 알림 목록 로드
  const loadNotifications = useCallback(async () => {
    if (!user?.id || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/notifications?userId=${parseInt(user.id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('알림 목록 로드에 실패했습니다.');
      }

      const result = await response.json();
      if (result.success && result.data) {
        const existingNotifications = result.data.map((item: any) => ({
          id: item.id.toString(),
          type: item.type,
          title: item.title,
          message: item.message,
          actionUrl: item.actionUrl,
          imageUrl: item.imageUrl,
          isRead: item.isRead,
          createdAt: item.createdAt,
        }));
        setNotifications(existingNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setError('알림 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
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
  }, [user, token, addNotification]);

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
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    clearNotifications,
    showNotification,
    navigateFromNotification,
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