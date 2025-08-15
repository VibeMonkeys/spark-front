import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Star, Flame, Target, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { homeApi, missionApi, levelApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { MissionLimitIndicator } from "../shared/ui";

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

interface HomePageProps {
  onMissionSelect: (missionId: string) => void;
}

export function HomePage({ onMissionSelect }: HomePageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 오늘의 미션 조회 (템플릿 미션 + 제한 정보)
  const { data: todaysMissionsResponse, isLoading: isLoadingMissions, error: missionsError } = useQuery({
    queryKey: ['missions', 'today', user?.id],
    queryFn: () => missionApi.getTodaysMissions(user!.id),
    enabled: !!user?.id,
  });

  // 레벨 진행 상황 조회
  const { data: levelProgress } = useQuery({
    queryKey: ['level-progress', user?.id],
    queryFn: () => levelApi.getUserLevelProgress(user!.id),
    enabled: !!user?.id,
  });

  // 미션 리롤 뮤테이션
  const rerollMutation = useMutation({
    mutationFn: () => missionApi.rerollMissions(user!.id),
    onSuccess: () => {
      // 오늘의 미션 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] });
    },
  });

  if (isLoadingMissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">홈페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (missionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  // todaysMissionsResponse에서 미션 목록과 제한 정보 추출
  const todaysMissions = todaysMissionsResponse?.missions || [];
  const dailyLimit = todaysMissionsResponse?.daily_limit;
  
  // 실제 사용자 데이터 및 레벨 진행 상황 사용
  const userSummary = {
    name: user?.name || '사용자',
    current_streak: user?.current_streak || 0,
    current_points: user?.current_points || 0,
    level: levelProgress?.current_level || user?.level || 1,
    level_title: levelProgress?.level_title_display || user?.level_title || 'BEGINNER',
    progress_to_next_level: levelProgress?.level_progress_percentage || 0,
    points_to_next_level: levelProgress?.points_to_next_level || 0
  };

  // 디버깅 로그
  console.log('🏠 [HomePage] User data:', user);
  console.log('🏠 [HomePage] Level progress:', levelProgress);
  console.log('🏠 [HomePage] UserSummary:', userSummary);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SPARK
            </h1>
            <p className="text-xs text-muted-foreground">안녕하세요, {userSummary.name}님!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
              <Flame className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">{userSummary.current_streak}일</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
              <Star className="size-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">{userSummary.current_points.toLocaleString()}P</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Progress Section */}
        <div className="py-6">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">레벨 {userSummary.level} {userSummary.level_title}</h3>
                  <p className="text-sm opacity-90">이번달 {userSummary.current_points}P 획득</p>
                </div>
                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="size-6" />
                </div>
              </div>
              <Progress value={userSummary.progress_to_next_level} className="h-2 bg-white/20" />
              <p className="text-xs opacity-75 mt-2">다음 레벨까지: {userSummary.points_to_next_level}P</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Missions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">오늘의 미션</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600"
              onClick={() => rerollMutation.mutate()}
              disabled={rerollMutation.isPending}
            >
              {rerollMutation.isPending ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                "리롤하기"
              )}
            </Button>
          </div>

          {/* 일일 제한 정보 표시 */}
          {dailyLimit && (
            <div className="mb-4">
              <MissionLimitIndicator 
                limit={dailyLimit} 
                compact={false}
                showProgress={true}
                showBadge={true}
              />
            </div>
          )}

          <div className="space-y-4">
            {todaysMissions?.map((mission) => (
              <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                <div className="relative">
                  <ImageWithFallback
                    src={mission.image_url || "https://images.unsplash.com/photo-1584515501397-335d595b2a17?w=400"}
                    alt={mission.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getCategoryColor(mission.category)} text-white border-0`}>
                      {getCategoryText(mission.category)}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs text-white font-medium">+{mission.reward_points}P</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{mission.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {getDifficultyText(mission.difficulty)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{mission.duration}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600"
                      onClick={() => onMissionSelect(mission.id)}
                    >
                      도전하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}