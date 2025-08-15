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
    <div key={statKey} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{stat?.icon || '🎯'}</span>
          <span className="font-medium text-sm">{stat?.displayName || 'Unknown'}</span>
        </div>
        <Badge 
          variant="secondary" 
          className="text-xs"
          style={{ backgroundColor: `${stat?.grade?.color || '#9CA3AF'}20`, color: stat?.grade?.color || '#9CA3AF' }}
        >
          {stat?.grade?.displayName || 'N/A'}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: stat?.color || '#6B7280' }}>
            {stat?.current || 0}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{stat?.grade?.displayName || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>기본: {stat?.base || 0} | 할당: {stat?.allocated || 0}</span>
        </div>
        
        {userStats && userStats.availablePoints > 0 ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={() => handleAllocatePoints(STAT_TYPES.find(t => t.key === statKey)?.name || '')}
          >
            <Plus className="size-3 mr-1" />
            포인트 할당
          </Button>
        ) : (
          <div className="mt-2 text-xs text-center text-muted-foreground p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span>🎁</span>
              <span className="font-medium">미션 완료 시</span>
            </div>
            <div className="text-xs text-blue-600">
              자동 +2P · 할당 +1P
            </div>
          </div>
        )}
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="size-5" />
              RPG 스탯
            </CardTitle>
            <div className="flex items-center gap-2">
              {userStats.availablePoints > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Zap className="size-3 mr-1" />
                  {userStats.availablePoints}P 사용 가능
                </Badge>
              )}
              <Badge variant="outline">
                총합 {userStats.totalStats}
              </Badge>
            </div>
          </div>
          <CardDescription>
            미션을 완료하면서 나만의 캐릭터를 성장시켜보세요!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 주요 스탯 요약 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="size-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">{userStats.totalStats}</span>
              </div>
              <p className="text-xs text-blue-700">총 스탯</p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-lg">{userStats.dominantStat?.icon || '🎯'}</span>
                <span className="text-lg font-bold text-purple-600">{userStats.dominantStat?.value || 0}</span>
              </div>
              <p className="text-xs text-purple-700">최고 스탯</p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="size-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">{(userStats.averageStatValue || 0).toFixed(1)}</span>
              </div>
              <p className="text-xs text-green-700">평균 스탯</p>
            </div>
          </div>

          {/* 개별 스탯 */}
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

          {/* 간단한 팁 */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground text-center">
              💡 미션 완료시 자동 스탯 증가 + 할당 포인트를 받아요!
            </p>
          </div>
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
        title="스탯 포인트 할당"
        confirmText="할당하기"
        showCancel={true}
        isLoading={allocatePointsMutation.isPending}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {selectedStat && `${STAT_TYPES.find(t => t.name === selectedStat)?.key}에 포인트를 할당하시겠습니까?`}
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={pointsToAllocate <= 1}
              onClick={() => setPointsToAllocate(Math.max(1, pointsToAllocate - 1))}
            >
              <Minus className="size-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{pointsToAllocate}</span>
              <span className="text-sm text-muted-foreground">포인트</span>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              disabled={!userStats || pointsToAllocate >= userStats.availablePoints}
              onClick={() => setPointsToAllocate(pointsToAllocate + 1)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              사용 가능: {userStats?.availablePoints || 0}P
            </p>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
}