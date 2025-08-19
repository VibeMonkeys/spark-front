import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Target, Star, CheckCircle, Calendar, TrendingUp, Filter, Play, X, Camera, Mountain, MessageCircle, Heart, Palette, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { missionApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmModal } from "./ui/confirm-modal";
import { NotificationBell } from "./ui/notification-bell";
import { DailyQuestIcon } from "./ui/daily-quest-icon";

// 카테고리별 아이콘 반환
const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    "ADVENTURE": Mountain,
    "SOCIAL": MessageCircle,
    "HEALTH": Heart,
    "CREATIVE": Palette,
    "LEARNING": BookOpen,
    "ADVENTUROUS": Mountain,
    "HEALTHY": Heart,
  };
  return icons[category] || Target;
};

// 토스 스타일 미니멀 테마
const getCategoryTheme = (category: string) => {
  return {
    bg: "bg-white",
    text: "text-gray-900",
    accent: "bg-gradient-to-r from-purple-600 to-blue-600",
    shadow: "shadow-sm hover:shadow-md",
    iconBg: "bg-gray-100 border border-gray-200",
    iconColor: "text-gray-600"
  };
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
      // 알림 없이 바로 포기 완료
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
      try {
        const result = await missionApi.getOngoingMissions(user!.id);
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
      try {
        const result = await missionApi.getCompletedMissions(user!.id, 0, 20);
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              내 미션
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="size-4" />
              </Button>
              <DailyQuestIcon />
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 py-4">
          <div className="text-center bg-white backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="size-4 text-purple-600" />
              <span className="text-lg font-bold text-purple-600">{ongoingMissions.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">진행 중</p>
          </div>
          <div className="text-center bg-white backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-lg font-bold text-green-500">{completedMissions.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">완료</p>
          </div>
          <div className="text-center bg-white backdrop-blur-sm rounded-lg p-3">
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

        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl h-12">
            <TabsTrigger 
              value="ongoing" 
              className="flex items-center gap-2 rounded-lg font-semibold text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
            >
              진행 중
              {ongoingMissions.length > 0 && (
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {ongoingMissions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="flex items-center gap-2 rounded-lg font-semibold text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
            >
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
              ongoingMissions.map((mission) => {
                const CategoryIcon = getCategoryIcon(mission.category);
                const theme = getCategoryTheme(mission.category);
                return (
                  <Card 
                    key={mission.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 ${theme.bg} ${theme.shadow} rounded-2xl`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        {/* Left: Icon + Title */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`size-11 ${theme.iconBg} rounded-xl flex items-center justify-center`}>
                            <CategoryIcon className={`size-5 ${theme.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-base ${theme.text} leading-tight mb-1`}>
                              {mission.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md font-medium border border-gray-200">
                                {getCategoryText(mission.category)}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">
                                {getDifficultyText(mission.difficulty)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right: Points */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-gray-100 text-gray-700 rounded-md px-2 py-1 border border-gray-200">
                            <span className="text-xs font-medium">+{mission.reward_points}P</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded-md px-2 py-1 border border-purple-200">
                            <span className="text-xs font-medium">스탯+2</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {mission.description}
                      </p>

                      {/* Progress */}
                      {mission.progress > 0 && (
                        <div className="mb-4">
                          <Progress value={mission.progress} className="h-2 bg-gray-100" />
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="size-4" />
                            <span>{mission.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            <span>{mission.time_left} 남음</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-200"
                            onClick={() => onMissionContinue?.(mission.id)}
                          >
                            <Camera className="size-3 mr-1" />
                            인증하기
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 px-3 py-2 rounded-lg"
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
                );
              })
            ) : (
              <Card className="border-0 bg-white backdrop-blur-sm">
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
              completedMissions.map((mission) => {
                const CategoryIcon = getCategoryIcon(mission.category);
                const theme = getCategoryTheme(mission.category);
                return (
                  <Card 
                    key={mission.id} 
                    className={`overflow-hidden transition-all duration-200 border border-green-200 bg-green-50 shadow-sm rounded-2xl`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        {/* Left: Icon + Title */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="size-11 bg-green-100 border border-green-200 rounded-xl flex items-center justify-center">
                            <CategoryIcon className="size-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-gray-900 leading-tight mb-1">
                              {mission.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-700 bg-white px-2 py-1 rounded-md font-medium border border-gray-200">
                                {getCategoryText(mission.category)}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">
                                {getDifficultyText(mission.difficulty)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right: Completed status and rating */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-green-500 rounded-full p-1.5">
                            <CheckCircle className="size-4 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(mission.average_rating || 0)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {mission.description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-green-600 font-medium">+{mission.reward_points}P 획득</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">완료</span>
                        </div>
                        
                        {/* 획득한 스탯 보상 표시 */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 rounded-md px-2 py-1 border border-green-200">
                            <span className="text-xs font-medium">{getCategoryText(mission.category)} +2</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-0 bg-white backdrop-blur-sm">
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