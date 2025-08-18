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
  // 아무것도 안 보여줄 때
  if (!isPulling && !isRefreshing) {
    return null;
  }

  // 드래그 중 또는 새로고침 중 스피너의 Y 위치 계산
  const getSpinnerPosition = () => {
    if (isRefreshing) {
      // 새로고침 중: 120px 위치에서 스피너 돌림 (더 아래로)
      return 120;
    } else if (isPulling) {
      // 드래그 중: pullDistance * 0.9 비율로 잘 따라옴
      // 최대 threshold * 1.4까지 내려가도록 확장
      return Math.min(pullDistance * 0.9, threshold * 1.4);
    }
    return -50; // 초기 위치는 위에 숨김
  };

  // 스피너 크기 계산 (드래그할수록 커짐)
  const getSpinnerScale = () => {
    if (isRefreshing) return 1;
    if (!isPulling) return 0;
    // 더 부드러운 스케일링: 0.4에서 시작해서 1.1까지
    const progress = Math.min(pullDistance / threshold, 1);
    return 0.4 + (progress * 0.7);
  };

  // 스피너 투명도 계산
  const getSpinnerOpacity = () => {
    if (isRefreshing) return 1;
    if (!isPulling) return 0;
    // 30% 지점부터 서서히 나타남
    const startThreshold = threshold * 0.3;
    if (pullDistance < startThreshold) return 0;
    return Math.min((pullDistance - startThreshold) / (threshold - startThreshold), 1);
  };

  // 회전 각도 계산 - 더 자연스러운 회전
  const getSpinnerRotation = () => {
    if (isRefreshing) {
      // 새로고침 중엔 CSS 애니메이션으로 처리하므로 0 반환
      return 0;
    }
    if (!isPulling) return 0;
    
    const progress = Math.min(pullDistance / threshold, 1);
    // easeOutQuart 함수를 적용한 부드러운 회전
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    
    if (canRefresh) {
      // 새로고침 가능 상태에서는 180도 고정
      return 180;
    } else {
      // 드래그 중에는 0도에서 170도까지 부드럽게
      return easedProgress * 170;
    }
  };

  const spinnerPosition = getSpinnerPosition();
  const spinnerScale = getSpinnerScale();
  const spinnerOpacity = getSpinnerOpacity();
  const spinnerRotation = getSpinnerRotation();

  return (
    <div 
      className="fixed left-0 right-0 z-50 flex items-center justify-center transition-all duration-300 ease-out"
      style={{
        top: `${spinnerPosition}px`,
        opacity: spinnerOpacity
      }}
    >
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200"
        style={{
          transform: `scale(${spinnerScale})`
        }}
      >
        <RefreshCw 
          className={cn(
            "w-5 h-5 text-purple-600",
            isRefreshing ? "animate-spin" : "transition-transform duration-100 ease-out"
          )}
          style={{
            transform: isRefreshing ? undefined : `rotate(${spinnerRotation}deg)`
          }}
        />
      </div>
    </div>
  );
};