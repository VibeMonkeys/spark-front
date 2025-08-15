import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Target, Star, CheckCircle, Calendar, TrendingUp, Filter, Play, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { missionApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmModal } from "./ui/confirm-modal";

// 카테고리별 색상 매핑
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "ADVENTUROUS": "bg-orange-500",
    "SOCIAL": "bg-blue-500", 
    "HEALTHY": "bg-green-500",
    "CREATIVE": "bg-purple-500",
    "LEARNING": "bg-indigo-500",
  };
  return colors[category] || "bg-gray-500";
};

// 난이도 한글 변환
const getDifficultyText = (difficulty: string) => {
  const texts: Record<string, string> = {
    "EASY": "쉬움",
    "MEDIUM": "보통", 
    "HARD": "어려움",
  };
  return texts[difficulty] || difficulty;
};

// 카테고리 한글 변환
const getCategoryText = (category: string) => {
  const texts: Record<string, string> = {
    "ADVENTUROUS": "모험적",
    "SOCIAL": "사교적",
    "HEALTHY": "건강",
    "CREATIVE": "창의적",
    "LEARNING": "학습",
  };
  return texts[category] || category;
};

interface MissionsPageProps {
  onMissionSelect?: (missionId: string) => void;
  onMissionContinue?: (missionId: string) => void;
  onNotification?: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  onTabChange?: (tab: string) => void;
}

export function MissionsPage({ onMissionSelect, onMissionContinue, onNotification, onTabChange }: MissionsPageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState("ongoing");
  
  // 미션 포기 확인 모달 상태
  const [abandonConfirm, setAbandonConfirm] = useState<{
    isOpen: boolean;
    missionId: string | null;
    missionTitle: string;
  }>({ isOpen: false, missionId: null, missionTitle: '' });

  // 미션 포기 mutation
  const abandonMissionMutation = useMutation({
    mutationFn: ({ missionId, userId }: { missionId: string; userId: string }) =>
      missionApi.abandonMission(missionId, userId),
    onSuccess: () => {
      // 성공시 관련 쿼리들을 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['missions-ongoing', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] }); // 오늘의 미션도 갱신
      onNotification?.('success', '미션 포기 완료', '미션이 성공적으로 포기되었습니다.');
    },
    onError: (error: any) => {
      console.error('미션 포기 실패:', error);
      onNotification?.('error', '미션 포기 실패', '미션 포기에 실패했습니다. 다시 시도해주세요.');
    }
  });

  const handleAbandonMission = (missionId: string, missionTitle: string) => {
    if (!user?.id) return;
    
    // 확인 모달 표시
    setAbandonConfirm({
      isOpen: true,
      missionId,
      missionTitle
    });
  };
  
  const confirmAbandonMission = () => {
    if (!user?.id || !abandonConfirm.missionId) return;
    
    abandonMissionMutation.mutate({
      missionId: abandonConfirm.missionId,
      userId: user.id
    });
    
    // 모달 닫기
    setAbandonConfirm({ isOpen: false, missionId: null, missionTitle: '' });
  };

  // 진행 중인 미션 조회  
  const { data: ongoingMissionsData = [], isLoading: isLoadingOngoing, error: ongoingError } = useQuery({
    queryKey: ['missions-ongoing', user?.id],
    queryFn: async () => {
      console.log('🔍 [MissionsPage] Fetching ongoing missions for user:', user?.id);
      console.log('🔍 [MissionsPage] API URL will be:', `http://localhost:8099/api/v1/missions/ongoing?userId=${user?.id}`);
      try {
        const result = await missionApi.getOngoingMissions(user!.id);
        console.log('✅ [MissionsPage] Ongoing missions API response:', result);
        return result;
      } catch (error) {
        console.error('❌ [MissionsPage] Failed to load ongoing missions:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // 완료된 미션 조회
  const { data: completedMissionsData, isLoading: isLoadingCompleted, error: completedError } = useQuery({
    queryKey: ['missions-completed', user?.id],
    queryFn: async () => {
      console.log('🔍 [MissionsPage] Fetching completed missions for user:', user?.id);
      try {
        const result = await missionApi.getCompletedMissions(user!.id, 0, 20);
        console.log('✅ [MissionsPage] Completed missions API response:', result);
        return result;
      } catch (error) {
        console.error('❌ [MissionsPage] Failed to load completed missions:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // 실제 데이터 추출 및 테스트 데이터 폴백
  const ongoingMissions = ongoingMissionsData || [];
  const completedMissions = completedMissionsData?.items || [];
  
  console.log('🔧 [MissionsPage] Final data processing:', {
    ongoingMissionsData,
    ongoingMissions: ongoingMissions.length,
    completedMissionsData,
    completedMissions: completedMissions.length
  });

  // 디버깅을 위한 콘솔 로그
  console.log('📊 [MissionsPage] Render state:', {
    user: user?.id,
    ongoingMissions,
    ongoingMissionsLength: ongoingMissions?.length || 0,
    isLoadingOngoing,
    ongoingError: ongoingError?.toString(),
    completedMissionsData,
    completedMissions: completedMissions?.length || 0,
    isLoadingCompleted,
    completedError: completedError?.toString(),
    activeSubTab
  });

  // 조건부 렌더링 디버깅
  if (isLoadingOngoing) {
    console.log('🔄 [MissionsPage] Currently loading ongoing missions...');
  }
  if (ongoingError) {
    console.log('❌ [MissionsPage] Error loading ongoing missions:', ongoingError);
  }
  if (ongoingMissions?.length > 0) {
    console.log('✅ [MissionsPage] Found ongoing missions:', ongoingMissions.length, ongoingMissions);
  } else {
    console.log('🚫 [MissionsPage] No ongoing missions found, array:', ongoingMissions);
  }
  
  if (isLoadingCompleted) {
    console.log('🔄 [MissionsPage] Currently loading completed missions...');
  }
  if (completedError) {
    console.log('❌ [MissionsPage] Error loading completed missions:', completedError);
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              내 미션
            </h1>
            <Button variant="ghost" size="sm">
              <Filter className="size-4" />
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="size-4 text-blue-500" />
                <span className="text-lg font-bold text-blue-500">{ongoingMissions.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">진행 중</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="size-4 text-green-500" />
                <span className="text-lg font-bold text-green-500">{completedMissions.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">완료</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="size-4 text-purple-500" />
                <span className="text-lg font-bold text-purple-500">
                  {completedMissions.length + ongoingMissions.length > 0 
                    ? Math.round((completedMissions.length / (completedMissions.length + ongoingMissions.length)) * 100)
                    : 0}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">완료율</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="py-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="ongoing" className="flex items-center gap-2">
              진행 중
              {ongoingMissions.length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {ongoingMissions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              완료됨
              {completedMissions.length > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {completedMissions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Ongoing Missions */}
          <TabsContent value="ongoing" className="space-y-4 mt-4">
            {isLoadingOngoing ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : ongoingMissions.length > 0 ? (
              ongoingMissions.map((mission) => (
                <Card key={mission.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={mission.image_url}
                      alt={mission.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(mission.category)} text-white border-0`}>
                        {getCategoryText(mission.category)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div className="bg-white/90 rounded-full px-2 py-1">
                        <span className="text-xs text-purple-600 font-medium">+{mission.reward_points}P</span>
                      </div>
                      <div className="bg-blue-500/90 rounded-full px-2 py-1">
                        <span className="text-xs text-white font-medium">⚡+2</span>
                      </div>
                    </div>
                    {mission.progress > 0 && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <Progress value={mission.progress} className="h-1.5 bg-white/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{mission.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getDifficultyText(mission.difficulty)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
                    
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{mission.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{mission.time_left} 남음</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex-1"
                          onClick={() => onMissionContinue?.(mission.id)}
                        >
                          <Play className="size-3 mr-1" />
                          계속하기
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                          onClick={() => handleAbandonMission(mission.id, mission.title)}
                          disabled={abandonMissionMutation.isPending}
                        >
                          <X className="size-3 mr-1" />
                          포기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Target className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">진행 중인 미션이 없어요</h3>
                  <p className="text-sm text-muted-foreground mb-4">홈에서 새로운 미션을 선택해보세요!</p>
                  <Button variant="outline" onClick={() => onTabChange?.('home')}>미션 둘러보기</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Missions */}
          <TabsContent value="completed" className="space-y-4 mt-4">
            {isLoadingCompleted ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : completedMissions.length > 0 ? (
              completedMissions.map((mission) => (
                <Card key={mission.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
                  <div className="relative h-28">
                    <ImageWithFallback
                      src={mission.image_url}
                      alt={mission.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(mission.category)} text-white border-0`}>
                        {getCategoryText(mission.category)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                      <CheckCircle className="size-4 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{mission.title}</h3>
                      <div className="flex items-center gap-1">
                        {renderStars(mission.average_rating || 0)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{mission.description}</p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>+{mission.reward_points}P 획득</span>
                          <span>•</span>
                          <span>{getDifficultyText(mission.difficulty)}</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">완료</span>
                      </div>
                      
                      {/* 획득한 스탯 보상 표시 */}
                      <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-700 font-medium">✅ 획득한 보상</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">⚡ {getCategoryText(mission.category)} +2</span>
                            <span className="text-blue-600">🎯 할당 +1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">완료한 미션이 없어요</h3>
                  <p className="text-sm text-muted-foreground mb-4">첫 번째 미션을 완료해보세요!</p>
                  <Button variant="outline">미션 시작하기</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 미션 포기 확인 모달 */}
      <ConfirmModal
        isOpen={abandonConfirm.isOpen}
        onClose={() => setAbandonConfirm({ isOpen: false, missionId: null, missionTitle: '' })}
        onConfirm={confirmAbandonMission}
        type="error"
        title="미션 포기 확인"
        message={`정말 "${abandonConfirm.missionTitle}" 미션을 포기하시겠습니까? 포기한 미션은 다시 복구할 수 없습니다.`}
        confirmText="포기하기"
        cancelText="취소"
        showCancel={true}
      />
    </div>
  );
}