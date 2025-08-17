import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './button';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationPopup } from './notification-popup';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = ""
}) => {
  const { unreadCount, isConnected } = useNotifications();
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-8 w-8 rounded-full hover:bg-gray-100"
        onClick={() => setIsNotificationPopupOpen(true)}
      >
        <Bell className={`size-4 ${isConnected ? 'text-gray-600' : 'text-gray-400'}`} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </Button>
      {/* 연결 상태 표시 - 읽지 않은 알림이 있을 때만 표시 */}
      {unreadCount > 0 && (
        <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
      
      {/* 알림 팝업 */}
      <NotificationPopup
        isOpen={isNotificationPopupOpen}
        onClose={() => setIsNotificationPopupOpen(false)}
      />
    </div>
  );
};

export default NotificationBell;