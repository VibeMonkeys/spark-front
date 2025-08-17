import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Clock, Star, MapPin, Users, Camera, Heart, Trophy, Zap, Calendar, Timer, CheckCircle, PlayCircle, Target, Mountain, MessageCircle, Palette, BookOpen, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { missionApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { MissionLimitIndicator, MissionLimitExceededModal } from "../shared/ui";

interface MissionDetailProps {
  missionId: number | null;
  onBack: () => void;
  onStartMission: () => void;
  onVerifyMission: () => void;
  onViewMissionDetail?: (missionId: number) => void;
  isStartingMission?: boolean;
  onShowNotification?: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  onNavigateToMissions?: () => void;
}

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
    "모험적": Mountain,
    "사교적": MessageCircle,
    "건강": Heart,
    "창의적": Palette,
    "학습": BookOpen,
  };
  return icons[category] || Target;
};

// 토스 스타일 미니멀 테마
const getCategoryTheme = (category: string) => {
  return {
    bg: "bg-white",
    text: "text-gray-900",
    accent: "bg-blue-500",
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

const similarMissions = [
  {
    id: 2,
    title: "버스 대신 한 정거장 걸어가기",
    points: 15,
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "동네 숨은 맛집 찾기",
    points: 25,
    difficulty: "Medium"
  }
];

export function MissionDetail({ 
  missionId, 
  onBack, 
  onStartMission, 
  onVerifyMission, 
  onViewMissionDetail, 
  isStartingMission = false,
  onShowNotification,
  onNavigateToMissions
}: MissionDetailProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showLimitModal, setShowLimitModal] = React.useState(false);

  // 미션 상세 데이터 조회
  const { data: missionDetail, isLoading, error } = useQuery({
    queryKey: ['mission-detail', missionId],
    queryFn: () => missionApi.getMissionDetail(missionId!),
    enabled: !!missionId,
  });

  // 일일 제한 정보 조회
  const { data: dailyLimit } = useQuery({
    queryKey: ['daily-limit', user?.id],
    queryFn: () => missionApi.getDailyMissionLimit(user!.id),
    enabled: !!user?.id,
  });


  // 미션 시작 뮤테이션
  const startMissionMutation = useMutation({
    mutationFn: (missionId: string) => missionApi.startMission(missionId, user!.id),
    onSuccess: (startedMission) => {
      // 관련 쿼리들 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['daily-limit', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['mission-detail', missionId] });
      queryClient.invalidateQueries({ queryKey: ['missions-ongoing', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['missions'] }); // 모든 미션 관련 쿼리 무효화
      
      // 알림 없이 바로 미션 탭으로 이동
      
      // 미션 탭으로 이동
      if (onNavigateToMissions) {
        onNavigateToMissions();
      }
    },
    onError: (error: any) => {
      console.error('❌ [MissionDetail] 미션 시작 실패:', error);
      // 제한 초과 오류인 경우에만 모달 표시
      if (error?.response?.data?.error?.code === 'DAILY_LIMIT_EXCEEDED') {
        setShowLimitModal(true);
      }
    },
  });

  const handleStartMission = () => {
    if (!missionId) return;
    
    if (dailyLimit?.can_start) {
      startMissionMutation.mutate(missionId);
    } else {
      setShowLimitModal(true);
    }
  };

  if (!missionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">미션을 선택해주세요.</p>
          <Button onClick={onBack}>돌아가기</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">미션 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !missionDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">미션 정보를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={onBack}>돌아가기</Button>
        </div>
      </div>
    );
  }

  // 백엔드 응답은 미션 데이터를 바로 반환
  const missionData = missionDetail;
  const tips = missionDetail.tips || [];
  const similarMissions = missionDetail.similar_missions || [];

  // TODO: 실제로는 백엔드에서 사용자의 미션 상태를 가져와야 함
  // 현재는 임시로 로컬 상태로 관리
  const isInProgress = false; // 미션이 시작되었는지 여부

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-semibold text-lg">미션 상세</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Mission Header Card - 홈 스타일 */}
        <div className="py-4">
          <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white shadow-sm rounded-2xl`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                {/* Left: Icon + Title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`size-11 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center`}>
                    {React.createElement(getCategoryIcon(missionData.category), { className: "size-5 text-gray-600" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`font-semibold text-xl text-gray-900 leading-tight mb-2`}>
                      {missionData.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md font-medium border border-gray-200">
                        {getCategoryText(missionData.category)}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {getDifficultyText(missionData.difficulty)}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Timer className="size-4" />
                        <span>{missionData.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right: Points */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-700 rounded-md px-2 py-1 border border-gray-200">
                    <Trophy className="size-4" />
                    <span className="text-sm font-medium">+{missionData.reward_points}P</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-md px-2 py-1 border border-blue-200">
                    <span className="text-sm font-medium">스탯+2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-0 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="size-5 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-blue-600">{missionDetail.completed_by?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">명 완료</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <div className="text-lg font-bold text-green-600">{missionDetail.success_rate || 0}%</div>
                <p className="text-xs text-muted-foreground">성공률</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="size-5 text-purple-500" />
                </div>
                <div className="text-lg font-bold text-purple-600">{getDifficultyText(missionData.difficulty)}</div>
                <p className="text-xs text-muted-foreground">난이도</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Description */}
        <section className="mb-6">
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Zap className="size-5 text-orange-500" />
                미션 소개
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">{missionData.description}</p>
            </CardContent>
          </Card>
        </section>


        {/* Mission Action Button */}
        <div className="mb-6">
          {!isInProgress ? (
            <Button 
              onClick={handleStartMission}
              disabled={startMissionMutation.isPending || !dailyLimit?.can_start}
              className={`w-full relative overflow-hidden font-semibold border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-out h-16 rounded-2xl group ${
                dailyLimit?.can_start 
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              size="lg"
            >
              {/* 배경 애니메이션 효과 */}
              {dailyLimit?.can_start && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* 빛나는 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </>
              )}
              
              {/* 버튼 내용 */}
              <div className="relative flex items-center justify-center gap-3">
                {startMissionMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="text-lg">미션 시작 중...</span>
                  </>
                ) : !dailyLimit?.can_start ? (
                  <>
                    <span className="text-lg">일일 제한 도달 (3/3)</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <PlayCircle className="size-6 drop-shadow-lg" />
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-lg tracking-wide">🚀 미션 시작하기</span>
                  </>
                )}
              </div>
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">미션이 시작되었습니다!</p>
                    <p className="text-sm text-green-600">언제든지 아래 버튼으로 인증하세요.</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={onVerifyMission}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-0 shadow-lg transform hover:scale-105 transition-all duration-200 h-14"
                size="lg"
              >
                <Camera className="size-5 mr-2" />
                인증하기
              </Button>
            </div>
          )}
        </div>

        {/* Detailed Description */}
        <section className="mb-6">
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="size-5 text-green-500" />
                상세 설명
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base">
                {missionDetail.detailed_description || missionData.description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tips */}
        {tips.length > 0 && (
          <section className="mb-6">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="size-5 text-red-500" />
                  성공 팁
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Similar Missions */}
        {similarMissions.length > 0 && (
          <section className="mb-6">
            <h3 className="font-semibold text-lg mb-4">비슷한 미션</h3>
            <div className="space-y-3">
              {similarMissions.map((mission) => (
                <Card key={mission.id} className="border-0 bg-white/40 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{mission.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getDifficultyText(mission.difficulty)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">+{mission.points}P</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600"
                        onClick={() => onViewMissionDetail?.(mission.id)}
                      >
                        도전
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 제한 초과 모달 */}
      {dailyLimit && (
        <MissionLimitExceededModal
          open={showLimitModal}
          onOpenChange={setShowLimitModal}
          limit={dailyLimit}
          onClose={() => setShowLimitModal(false)}
        />
      )}
    </div>
  );
}