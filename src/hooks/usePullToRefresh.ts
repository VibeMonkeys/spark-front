import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // 새로고침 트리거 임계값 (px)
  resistance?: number; // 드래그 저항도 (0-1)
  enabled?: boolean; // 기능 활성화 여부
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 0.5,
  enabled = true
}: PullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canRefresh: false
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isScrollAtTop = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // 스크롤이 맨 위에 있는지 확인
      isScrollAtTop.current = window.scrollY === 0;
      
      if (!isScrollAtTop.current) return;

      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrollAtTop.current || state.isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // 아래로 드래그할 때만 처리
      if (deltaY > 0) {
        // 기본 스크롤 동작 방지
        e.preventDefault();

        const pullDistance = Math.min(deltaY * resistance, threshold * 2);
        const canRefresh = pullDistance >= threshold;

        setState(prev => ({
          ...prev,
          isPulling: true,
          pullDistance,
          canRefresh
        }));
      }
    };

    const handleTouchEnd = async () => {
      if (!state.isPulling) return;

      if (state.canRefresh && !state.isRefreshing) {
        // 새로고침 상태로 전환
        setState(prev => ({ 
          ...prev, 
          isRefreshing: true,
          isPulling: false,
          pullDistance: 0
        }));
        
        try {
          await onRefresh();
        } catch (error) {
          // Error handled silently
        }
        
        // 새로고침 완료 후 부드러운 사라짐을 위해 딜레이
        setTimeout(() => {
          setState({
            isPulling: false,
            pullDistance: 0,
            isRefreshing: false,
            canRefresh: false
          });
        }, 500); // 500ms 후 스피너 사라짐 (더 여유있게)
      } else {
        // 새로고침 조건 미달성 시 즉시 상태 초기화
        setState({
          isPulling: false,
          pullDistance: 0,
          isRefreshing: false,
          canRefresh: false
        });
      }
    };

    // 터치 이벤트 등록
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onRefresh, threshold, resistance, state.isPulling, state.canRefresh, state.isRefreshing]);

  return state;
};