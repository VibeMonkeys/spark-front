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
  // 투명도와 크기 계산
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);
  const rotation = isRefreshing ? 'animate-spin' : '';

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200",
        "bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm",
        isPulling || isRefreshing ? "visible" : "invisible"
      )}
      style={{
        height: `${Math.max(pullDistance, isRefreshing ? 80 : 0)}px`,
        opacity: isPulling || isRefreshing ? opacity : 0
      }}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-2 transition-all duration-200",
          rotation
        )}
        style={{
          transform: `scale(${scale})`,
          paddingTop: '20px'
        }}
      >
        <div
          className={cn(
            "p-3 rounded-full transition-all duration-200",
            canRefresh || isRefreshing
              ? "bg-purple-100 text-purple-600"
              : "bg-gray-100 text-gray-400"
          )}
        >
          <RefreshCw 
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              isRefreshing && "animate-spin",
              canRefresh && !isRefreshing && "rotate-180"
            )}
          />
        </div>
        
        <div className="text-center">
          <p
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              canRefresh || isRefreshing
                ? "text-purple-600"
                : "text-gray-400"
            )}
          >
            {isRefreshing
              ? "새로고침 중..."
              : canRefresh
              ? "놓으면 새로고침"
              : "아래로 당겨서 새로고침"
            }
          </p>
        </div>
      </div>
    </div>
  );
};