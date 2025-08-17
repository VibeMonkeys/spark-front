import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Settings, Star, Flame, Trophy, Calendar, Target, TrendingUp, Gift, LogOut, Info, User, BarChart3, Award, Activity } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { userApi, levelApi, achievementApi, missionApi } from "../shared/api";
import { LevelProgress } from "./LevelProgress";
import { LevelSystemModal } from "./LevelSystemModal";
import { ConfirmModal } from "./ui/confirm-modal";
import { StatsSection } from "./StatsSection";
import { CompletedMissionsModal } from "./CompletedMissionsModal";
import { useState } from "react";



export function ProfilePage({ onEditProfile }: { onEditProfile?: () => void }) {
  const { user, logout } = useAuth();
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCompletedMissionsModalOpen, setIsCompletedMissionsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // 프로필 데이터 조회
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => userApi.getProfilePage(user!.id),
    enabled: !!user?.id,
  });

  // 레벨 진행 상황 조회
  const { data: levelProgress } = useQuery({
    queryKey: ['level-progress', user?.id],
    queryFn: () => levelApi.getUserLevelProgress(user!.id),
    enabled: !!user?.id,
  });

  // 사용자 업적 조회
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => achievementApi.getUserAchievements(),
    enabled: !!user?.id,
  });

  // 카테고리별 통계 조회
  const { data: categoryStatistics, refetch: refetchCategoryStats } = useQuery({
    queryKey: ['category-statistics', user?.id],
    queryFn: () => missionApi.getCategoryStatistics(user!.id),
    enabled: !!user?.id,
  });

  // 최근 완료한 미션 조회
  const { data: recentCompletedMissions, refetch: refetchRecentMissions } = useQuery({
    queryKey: ['missions-completed-recent', user?.id],
    queryFn: () => missionApi.getCompletedMissions(user!.id, 0, 5),
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 활동 탭을 클릭할 때 최신 데이터 불러오기
    if (value === 'activity') {
      refetchCategoryStats();
      refetchRecentMissions();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">프로필 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const userData = profileData.user;
  const userStatistics = profileData.statistics;
  const achievementsData = achievements || [];
  
  // 카테고리별 통계 데이터 (백엔드에서 이미 변환된 데이터 사용)
  const categoryStats = categoryStatistics || [];
  
  // 최근 완료한 미션 데이터
  const recentMissions = recentCompletedMissions?.items || [];

  // 다음 레벨까지 진행도 계산 (임시 계산법)
  const nextLevelPoints = (userData.level + 1) * 1000;
  const pointsToNextLevel = Math.max(0, nextLevelPoints - userData.current_points);
  const progressToNextLevel = userData.current_points > 0 ? 
    ((userData.current_points % 1000) / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            내 프로필
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEditProfile}>
              <Settings className="size-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Enhanced Profile Header */}
        <div className="py-4">
          <Card className="border-0 bg-white backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={userData.avatar_url}
                    alt={userData.name}
                    className="size-16 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 size-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                  <p className="text-sm text-gray-500">
                    매일 성장하는 스파크 멤버 ✨
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl h-14">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center gap-1 rounded-lg font-semibold text-xs transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm text-gray-600"
            >
              <BarChart3 className="size-4" />
              개요
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex flex-col items-center justify-center gap-1 rounded-lg font-semibold text-xs transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm text-gray-600"
            >
              <User className="size-4" />
              스탯
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex flex-col items-center justify-center gap-1 rounded-lg font-semibold text-xs transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm text-gray-600"
            >
              <Award className="size-4" />
              업적
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="flex flex-col items-center justify-center gap-1 rounded-lg font-semibold text-xs transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm text-gray-600"
            >
              <Activity className="size-4" />
              활동
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-2 space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="size-4 text-blue-500" />
                    <span className="text-xl font-bold text-blue-500">{userData.current_points.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">현재 포인트</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Flame className="size-4 text-orange-500" />
                    <span className="text-xl font-bold text-orange-500">{userData.current_streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">연속 완료일</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Target className="size-4 text-green-500" />
                    <span className="text-xl font-bold text-green-500">{userData.completed_missions}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">완료한 미션</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Calendar className="size-4 text-purple-500" />
                    <span className="text-xl font-bold text-purple-500">{userData.total_days}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">활동 일수</p>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <LevelProgress 
              levelProgress={levelProgress} 
              showDetails={true}
              onLevelInfoClick={() => setIsLevelModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-2">
            <StatsSection />
          </TabsContent>

          <TabsContent value="achievements" className="mt-2 space-y-4">
            {isLoadingAchievements ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 완료된 업적 */}
                {achievementsData.filter(achievement => achievement.isUnlocked).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      완료된 업적 ({achievementsData.filter(achievement => achievement.isUnlocked).length})
                    </h3>
                    <div className="space-y-2">
                      {achievementsData.filter(achievement => achievement.isUnlocked).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="border-0 bg-white backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            {/* Achievement Icon */}
                            <div className="relative">
                              <div className="size-12 rounded-2xl flex items-center justify-center text-xl bg-gray-50 border border-gray-200">
                                {achievement.icon}
                              </div>
                              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Trophy className="size-2 text-white" />
                              </div>
                            </div>
                            
                            {/* Achievement Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    {achievement.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {achievement.description}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500 font-medium ml-2">
                                  ✓ 완료
                                </div>
                              </div>
                              
                              {/* Rarity */}
                              <div className="flex items-center justify-between">
                                <span 
                                  className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                  style={{ backgroundColor: achievement.rarity.color }}
                                >
                                  {achievement.rarity.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 진행 중인 업적 */}
                {achievementsData.filter(achievement => !achievement.isUnlocked).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      진행 중인 업적 ({achievementsData.filter(achievement => !achievement.isUnlocked).length})
                    </h3>
                    <div className="space-y-2">
                      {achievementsData.filter(achievement => !achievement.isUnlocked).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="border-0 bg-white backdrop-blur-sm rounded-2xl p-4 hover:bg-white/70 transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            {/* Achievement Icon */}
                            <div className="size-12 rounded-2xl flex items-center justify-center text-xl bg-gray-50 border border-gray-200 opacity-70">
                              {achievement.icon}
                            </div>
                            
                            {/* Achievement Info */}
                            <div className="flex-1 min-w-0">
                              <div className="mb-2">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-bold text-gray-700 text-sm">
                                    {achievement.name}
                                  </h4>
                                  <div className="text-xs text-gray-500 font-medium ml-2">
                                    진행중
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">
                                  {achievement.description}
                                </p>
                              </div>
                              
                              {/* Progress Bar */}
                              {achievement.progress > 0 && (
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>진행률</span>
                                    <span className="font-medium">{achievement.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${achievement.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Rarity */}
                              <div className="flex items-center justify-between">
                                <span 
                                  className="text-xs px-2 py-1 rounded-full text-white font-medium opacity-80"
                                  style={{ backgroundColor: achievement.rarity.color }}
                                >
                                  {achievement.rarity.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-2 space-y-4">
            {/* Category Stats */}
            <Card className="border-0 bg-white backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <TrendingUp className="size-3 text-white" />
                  </div>
                  카테고리별 활동
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {categoryStats.length > 0 ? (
                  <div className="space-y-3">
                    {categoryStats.map((category) => (
                      <div key={category.name} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`size-3 rounded-full ${category.color}`} />
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </div>
                          <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            {category.completed}개
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="size-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">카테고리별 통계를 불러오는 중...</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Missions */}
            <Card className="border-0 bg-white backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <div className="bg-green-500 p-1.5 rounded-lg">
                      <Target className="size-3 text-white" />
                    </div>
                    최근 완료한 미션
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                    onClick={() => setIsCompletedMissionsModalOpen(true)}
                  >
                    전체보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {recentMissions.length > 0 ? (
                  <div className="space-y-2">
                    {recentMissions.map((mission) => (
                      <div key={mission.id} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <ImageWithFallback
                              src={mission.image_url || "https://images.unsplash.com/photo-1584515501397-335d595b2a17?w=400"}
                              alt={mission.title}
                              className="size-10 rounded-lg object-cover"
                            />
                            <div className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
                              <Trophy className="size-1.5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate mb-1">{mission.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                                {mission.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                              +{mission.reward_points}P
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="size-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">완료한 미션이 없습니다</p>
                    <p className="text-gray-400 text-xs mt-1">첫 미션을 완료해보세요!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 레벨 시스템 모달 */}
      <LevelSystemModal 
        isOpen={isLevelModalOpen} 
        onClose={() => setIsLevelModalOpen(false)} 
      />

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        type="info"
        title="로그아웃"
        message="정말 로그아웃하시겠습니까?"
        confirmText="로그아웃"
        showCancel={true}
      />

      {/* 완료한 미션 전체보기 모달 */}
      <CompletedMissionsModal
        isOpen={isCompletedMissionsModalOpen}
        onClose={() => setIsCompletedMissionsModalOpen(false)}
      />
    </div>
  );
}