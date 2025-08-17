import React from 'react';
import { Bell, Check, X, Clock, Star } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected } = useNotifications();

  if (!isOpen) return null;

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MISSION_COMPLETED':
      case 'LEVEL_UP':
      case 'ACHIEVEMENT_UNLOCKED':
        return <Star className="size-4 text-yellow-500" />;
      case 'MISSION_STARTED':
        return <Bell className="size-4 text-blue-500" />;
      default:
        return <Bell className="size-4 text-gray-500" />;
    }
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 팝업 컨테이너 - 종 버튼 하단에 위치 */}
      <div className="absolute top-12 right-0 z-50 w-80 max-w-[calc(100vw-2rem)]">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
          {/* 헤더 */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">알림</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* 연결 상태 */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                {isConnected ? '연결됨' : '연결 안됨'}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 rounded-full hover:bg-gray-200"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* 알림 리스트 */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="size-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                      !notification.isRead && "bg-blue-50/50"
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(parseInt(notification.id));
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-sm font-medium leading-5",
                            notification.isRead ? "text-gray-700" : "text-gray-900"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className={cn(
                          "text-sm mt-1 leading-5",
                          notification.isRead ? "text-gray-500" : "text-gray-600"
                        )}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="size-3" />
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  markAllAsRead();
                }}
              >
                <Check className="size-4 mr-1" />
                모두 읽음으로 표시
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;