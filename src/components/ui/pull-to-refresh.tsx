import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from './utils';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isPulling,
  pullDistance,
  isRefreshing,
  canRefresh,
  threshold = 80
}) => {
  // 새로고침 중일 때만 표시
  if (!isRefreshing) {
    return null;
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
        <RefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
      </div>
    </div>
  );
};