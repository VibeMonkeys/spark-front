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
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
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
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h2>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    레벨 {userData.level} {userData.level_title} • 매일 성장하는 스파크 멤버 🌟
                  </p>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm h-16 rounded-xl p-1 border border-gray-200/50">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center justify-center gap-1 p-2 h-full transition-all duration-200 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:shadow-blue-100/50 rounded-lg border-0"
            >
              <BarChart3 className="size-4" />
              <span className="text-xs font-medium">개요</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex flex-col items-center justify-center gap-1 p-2 h-full transition-all duration-200 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:shadow-blue-100/50 rounded-lg border-0"
            >
              <User className="size-4" />
              <span className="text-xs font-medium">스탯</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex flex-col items-center justify-center gap-1 p-2 h-full transition-all duration-200 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:shadow-blue-100/50 rounded-lg border-0"
            >
              <Award className="size-4" />
              <span className="text-xs font-medium">업적</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="flex flex-col items-center justify-center gap-1 p-2 h-full transition-all duration-200 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:shadow-blue-100/50 rounded-lg border-0"
            >
              <Activity className="size-4" />
              <span className="text-xs font-medium">활동</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-2 space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="size-4 text-blue-500" />
                    <span className="text-xl font-bold text-blue-500">{userData.current_points.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">현재 포인트</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Flame className="size-4 text-orange-500" />
                    <span className="text-xl font-bold text-orange-500">{userData.current_streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">연속 완료일</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Target className="size-4 text-green-500" />
                    <span className="text-xl font-bold text-green-500">{userData.completed_missions}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">완료한 미션</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {achievementsData.filter(achievement => achievement.isUnlocked).length}
                      </div>
                      완료된 업적
                    </h3>
                    <div className="space-y-3">
                      {achievementsData.filter(achievement => achievement.isUnlocked).map((achievement) => (
                        <Card
                          key={achievement.id}
                          className="border border-gray-200 bg-white shadow-sm transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              {/* Achievement Icon */}
                              <div className="size-12 rounded-2xl flex items-center justify-center text-xl bg-blue-50">
                                {achievement.icon}
                              </div>
                              
                              {/* Achievement Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {achievement.name}
                                  </h4>
                                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    ✓
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                  {achievement.description}
                                </p>
                                
                                {/* Rarity */}
                                <div className="mt-2">
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                    style={{ backgroundColor: achievement.rarity.color }}
                                  >
                                    {achievement.rarity.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* 진행 중인 업적 */}
                {achievementsData.filter(achievement => !achievement.isUnlocked).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {achievementsData.filter(achievement => !achievement.isUnlocked).length}
                      </div>
                      진행 중인 업적
                    </h3>
                    <div className="space-y-3">
                      {achievementsData.filter(achievement => !achievement.isUnlocked).map((achievement) => (
                        <Card
                          key={achievement.id}
                          className="border border-gray-200 bg-gray-50 transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              {/* Achievement Icon */}
                              <div className="size-12 rounded-2xl flex items-center justify-center text-xl bg-gray-100">
                                {achievement.icon}
                              </div>
                              
                              {/* Achievement Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-500">
                                    {achievement.name}
                                  </h4>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                  {achievement.description}
                                </p>
                                
                                {/* Progress Bar */}
                                {achievement.progress > 0 && (
                                  <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                      <span>진행률</span>
                                      <span>{achievement.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${achievement.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {/* Rarity */}
                                <div className="mt-2">
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                    style={{ backgroundColor: achievement.rarity.color }}
                                  >
                                    {achievement.rarity.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-2 space-y-4">
            {/* Category Stats */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  카테고리별 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryStats.length > 0 ? (
                  categoryStats.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`size-3 rounded-full ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">{category.completed}개</span>
                      </div>
                      <Progress value={category.percentage} className="h-1.5" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">카테고리별 통계를 불러오는 중...</p>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Missions */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">최근 완료한 미션</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600"
                    onClick={() => setIsCompletedMissionsModalOpen(true)}
                  >
                    전체보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMissions.length > 0 ? (
                  recentMissions.map((mission) => (
                    <div key={mission.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                      <ImageWithFallback
                        src={mission.image_url || "https://images.unsplash.com/photo-1584515501397-335d595b2a17?w=400"}
                        alt={mission.title}
                        className="size-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{mission.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {mission.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-blue-600">
                          <Star className="size-3 fill-current" />
                          <span className="text-xs font-medium">+{mission.reward_points}P</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">완료한 미션이 없습니다</p>
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