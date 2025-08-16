import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ConfirmModal } from "./ui/confirm-modal";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { statsApi } from "../shared/api";
import { StatValue, UserStats } from "../shared/api/types";
import { 
  TrendingUp, 
  Plus, 
  Minus, 
  Trophy, 
  Star,
  Target,
  Zap
} from "lucide-react";

interface StatsSectionProps {
  className?: string;
}

const STAT_TYPES = [
  { key: 'strength', name: 'STRENGTH' },
  { key: 'intelligence', name: 'INTELLIGENCE' },
  { key: 'creativity', name: 'CREATIVITY' },
  { key: 'sociability', name: 'SOCIABILITY' },
  { key: 'adventurous', name: 'ADVENTUROUS' },
  { key: 'discipline', name: 'DISCIPLINE' }
];

export function StatsSection({ className }: StatsSectionProps) {
  const queryClient = useQueryClient();
  const [pendingAllocations, setPendingAllocations] = useState<Record<string, number>>({});
  const [isApplyMode, setIsApplyMode] = useState(false);

  // 사용자 스탯 데이터 조회
  const { data: statsResponse, isLoading, error } = useQuery({
    queryKey: ['user-stats'],
    queryFn: statsApi.getUserStats,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
    enabled: true, // 항상 실행되도록 설정
    onError: (error) => {
      console.error('Stats query failed:', error);
    }
  });

  // 스탯 포인트 일괄 할당 뮤테이션
  const allocatePointsMutation = useMutation({
    mutationFn: async () => {
      // 모든 펜딩 할당을 순차적으로 수행
      for (const [statKey, points] of Object.entries(pendingAllocations)) {
        if (points > 0) {
          const statType = STAT_TYPES.find(t => t.key === statKey)?.name;
          if (statType) {
            await statsApi.allocateStatPoints({ statType, points });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setPendingAllocations({});
      setIsApplyMode(false);
    },
    onError: (error) => {
      console.error('스탯 포인트 할당 실패:', error);
    }
  });

  const userStats = statsResponse?.data?.data; // API 응답에서 실제 데이터 추출

  // 스탯 데이터 유효성 검사 함수
  const isValidStatValue = (stat: any): stat is StatValue => {
    return stat && 
           typeof stat === 'object' && 
           typeof stat.current === 'number' &&
           typeof stat.icon === 'string' &&
           typeof stat.displayName === 'string';
  };

  const handleStatIncrement = (statKey: string) => {
    const currentPending = pendingAllocations[statKey] || 0;
    const totalPendingPoints = Object.values(pendingAllocations).reduce((sum, points) => sum + points, 0);
    
    if (userStats && totalPendingPoints < userStats.availablePoints) {
      setPendingAllocations(prev => ({
        ...prev,
        [statKey]: currentPending + 1
      }));
      setIsApplyMode(true);
    }
  };

  const handleStatDecrement = (statKey: string) => {
    const currentPending = pendingAllocations[statKey] || 0;
    if (currentPending > 0) {
      setPendingAllocations(prev => {
        const newAllocations = { ...prev };
        if (currentPending === 1) {
          delete newAllocations[statKey];
        } else {
          newAllocations[statKey] = currentPending - 1;
        }
        return newAllocations;
      });
      
      // 모든 펜딩 할당이 0이면 적용 모드 해제
      const totalPending = Object.values(pendingAllocations).reduce((sum, points) => sum + points, 0);
      if (totalPending <= 1) {
        setIsApplyMode(false);
      }
    }
  };

  const handleApplyAllocations = () => {
    allocatePointsMutation.mutate();
  };

  const handleCancelAllocations = () => {
    setPendingAllocations({});
    setIsApplyMode(false);
  };

  const getTotalPendingPoints = () => {
    return Object.values(pendingAllocations).reduce((sum, points) => sum + points, 0);
  };

  const renderStatItem = (statKey: string, stat: StatValue) => {
    const pendingPoints = pendingAllocations[statKey] || 0;
    const totalPendingPoints = getTotalPendingPoints();
    const canAllocate = userStats && totalPendingPoints < userStats.availablePoints;
    
    return (
      <div 
        key={statKey} 
        className={`relative bg-white rounded-2xl p-3 border transition-all duration-200 ${
          pendingPoints > 0 ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* 스탯 정보 */}
          <div className="flex items-center gap-2">
            <div className="text-xl">{stat?.icon || '🎯'}</div>
            <div>
              <div className="text-xs font-medium text-gray-600">
                {stat?.displayName || 'Unknown'}
              </div>
              <div className="flex items-baseline gap-1">
                <div className="text-lg font-bold text-gray-900">
                  {(stat?.current || 0) + pendingPoints}
                </div>
                {pendingPoints > 0 && (
                  <div className="text-xs text-blue-600 font-medium">
                    (+{pendingPoints})
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* +/- 버튼 */}
          <div className="flex items-center gap-1">
            {pendingPoints > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="w-5 h-5 rounded-full p-0 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all"
                onClick={() => handleStatDecrement(statKey)}
              >
                <Minus className="size-2 text-red-600" />
              </Button>
            )}
            
            {userStats && userStats.availablePoints > 0 ? (
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 rounded-full p-0 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={() => handleStatIncrement(statKey)}
                disabled={!canAllocate}
              >
                <Plus className="size-3 text-blue-600" />
              </Button>
            ) : (
              <div className="w-6 h-6 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                <Plus className="size-2 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={`border-0 bg-white/60 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="size-5" />
            스탯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 더 엄격한 userStats 유효성 검사
  const hasValidUserStats = userStats && 
    typeof userStats === 'object' && 
    typeof userStats.totalStats === 'number';

  if (error || !hasValidUserStats) {
    // 디버깅을 위한 로깅
    if (error) {
      console.error('Stats API error:', error);
    }
    if (!hasValidUserStats) {
      console.warn('Invalid userStats data:', userStats);
    }
    
    return (
      <Card className={`border-0 bg-white/60 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="size-5" />
            RPG 스탯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              {error?.message === 'Network Error' || (error as any)?.response?.status === 401
                ? '로그인 후 스탯을 확인할 수 있습니다.'
                : '스탯 데이터를 불러오는 중 오류가 발생했습니다.'}
            </p>
            <Button
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['user-stats'] })}
            >
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`border-0 bg-white/60 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                능력치
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                총 스탯: {userStats.totalStats}
              </CardDescription>
            </div>
            {userStats.availablePoints > 0 && (
              <div className="flex flex-col">
                <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl self-end">
                  <div className="text-sm font-semibold">
                    {userStats.availablePoints - getTotalPendingPoints()} SP
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">분배가능</div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 스탯 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {STAT_TYPES.map(({ key }) => {
              const stat = userStats?.[key as keyof typeof userStats] as StatValue;
              // 스탯 데이터 유효성 검사
              if (!isValidStatValue(stat)) {
                console.warn(`Invalid stat data for ${key}:`, stat);
                return null;
              }
              return renderStatItem(key, stat);
            }).filter(Boolean)}
          </div>

          {/* 보상 정보 카드 */}
          <div className="mt-4 bg-gray-50 rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-base">🎁</div>
              <h4 className="font-semibold text-sm text-gray-900">미션 완료 보상</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                <div className="text-sm">⚡</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">자동 증가</p>
                  <p className="text-xs text-gray-600">카테고리별 +1</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl">
                <div className="text-sm">🎯</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">할당 포인트</p>
                  <p className="text-xs text-gray-600">자유 배분 +2</p>
                </div>
              </div>
            </div>
          </div>

          {/* 적용/취소 버튼 */}
          {isApplyMode && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleCancelAllocations}
                variant="outline"
                className="flex-1 rounded-2xl border-gray-300 hover:bg-gray-50"
              >
                취소
              </Button>
              <Button
                onClick={handleApplyAllocations}
                disabled={allocatePointsMutation.isPending}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
              >
                {allocatePointsMutation.isPending ? '적용 중...' : `적용하기 (${getTotalPendingPoints()}SP)`}
              </Button>
            </div>
          )}
          
          {/* 하단 정보 */}
          {userStats.availablePoints === 0 && !isApplyMode && (
            <div className="mt-3 text-center p-3 bg-blue-50 rounded-2xl">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <span>⚡</span>
                <span className="text-sm font-medium">미션 클리어로 경험치를 획득하세요!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
}