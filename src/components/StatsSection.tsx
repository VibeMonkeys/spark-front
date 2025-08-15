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
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [pointsToAllocate, setPointsToAllocate] = useState(1);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

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

  // 스탯 포인트 할당 뮤테이션
  const allocatePointsMutation = useMutation({
    mutationFn: statsApi.allocateStatPoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setIsAllocationModalOpen(false);
      setSelectedStat(null);
      setPointsToAllocate(1);
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

  const handleAllocatePoints = (statType: string) => {
    setSelectedStat(statType);
    setIsAllocationModalOpen(true);
  };

  const confirmAllocation = () => {
    if (selectedStat && pointsToAllocate > 0) {
      allocatePointsMutation.mutate({
        statType: selectedStat,
        points: pointsToAllocate
      });
    }
  };

  const renderStatItem = (statKey: string, stat: StatValue) => (
    <div 
      key={statKey} 
      className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 hover:border-gray-300/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        {/* 아이콘 */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex-shrink-0">
          <span className="text-base">{stat?.icon || '🎯'}</span>
        </div>
        
        {/* 스탯 정보 - 세로 배치 */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            {stat?.displayName || 'Unknown'}
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight">
            {stat?.current || 0}
          </div>
        </div>
        
        {/* + 버튼 */}
        <div className="flex-shrink-0">
          {userStats && userStats.availablePoints > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="w-6 h-6 rounded-full p-0 border border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
              onClick={() => handleAllocatePoints(STAT_TYPES.find(t => t.key === statKey)?.name || '')}
            >
              <Plus className="size-2.5 text-blue-600" />
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
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Star className="size-3 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  능력치
                </span>
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 flex items-center gap-2">
                <Trophy className="size-3" />
                총 스탯: {userStats.totalStats}
              </CardDescription>
            </div>
            {userStats.availablePoints > 0 && (
              <div className="text-right">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1.5 text-sm font-semibold">
                  <Zap className="size-3 mr-1" />
                  {userStats.availablePoints} SP
                </Badge>
                <div className="text-xs text-gray-500 mt-1">스킬 포인트</div>
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
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                🎁
              </div>
              <h4 className="font-semibold text-sm text-gray-800">미션 완료 보상</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-lg">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">자동 증가</p>
                  <p className="text-xs text-gray-500">카테고리별 +1</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-lg">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">할당 포인트</p>
                  <p className="text-xs text-gray-500">자유 배분 +2</p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 정보 */}
          {userStats.availablePoints === 0 && (
            <div className="mt-4 text-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50">
              <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
                <span>⚡</span>
                <span>미션 클리어로 경험치를 획득하세요!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 스탯 포인트 할당 모달 */}
      <ConfirmModal
        isOpen={isAllocationModalOpen}
        onClose={() => {
          setIsAllocationModalOpen(false);
          setSelectedStat(null);
          setPointsToAllocate(1);
        }}
        onConfirm={confirmAllocation}
        type="info"
        title="스킬 포인트 할당"
        confirmText="할당하기"
        showCancel={true}
        isLoading={allocatePointsMutation.isPending}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-lg text-gray-700">
              <span className="font-semibold text-purple-600">
                {selectedStat && STAT_TYPES.find(t => t.name === selectedStat)?.key}
              </span> 스킬을 강화합니다
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="outline"
              className="w-10 h-10 rounded-full border-2 hover:border-red-400 hover:bg-red-50"
              disabled={pointsToAllocate <= 1}
              onClick={() => setPointsToAllocate(Math.max(1, pointsToAllocate - 1))}
            >
              <Minus className="size-4 text-red-500" />
            </Button>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl px-6 py-4 border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-700 text-center">
                {pointsToAllocate}
              </div>
              <div className="text-xs text-purple-500 text-center mt-1 font-medium">
                SP
              </div>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              className="w-10 h-10 rounded-full border-2 hover:border-green-400 hover:bg-green-50"
              disabled={!userStats || pointsToAllocate >= userStats.availablePoints}
              onClick={() => setPointsToAllocate(pointsToAllocate + 1)}
            >
              <Plus className="size-4 text-green-500" />
            </Button>
          </div>
          
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-700">
              <Zap className="size-3 inline mr-1" />
              보유 스킬 포인트: <span className="font-bold text-purple-600">{userStats?.availablePoints || 0} SP</span>
            </p>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
}