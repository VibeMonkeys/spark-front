import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Settings, Star, Flame, Trophy, Calendar, Target, TrendingUp, Gift, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../shared/api";


export function ProfilePage() {
  const { user, logout } = useAuth();

  // 프로필 데이터 조회
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => userApi.getProfilePage(user!.id),
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      await logout();
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
  const categoryStats = userData.statistics?.category_stats || [];
  const achievements = profileData.achievements;
  const recentMissions = profileData.recent_missions;

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
            <Button variant="ghost" size="sm">
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
        {/* Profile Header */}
        <div className="py-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src={userData.avatar_url}
                  alt={userData.name}
                  className="size-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">레벨 {userData.level} {userData.level_title}</p>
                  <p className="text-xs text-muted-foreground">{userData.join_date} 가입</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>다음 레벨까지</span>
                  <span className="font-medium">{pointsToNextLevel}P</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <section className="mb-6">
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
        </section>

        {/* Category Stats */}
        <section className="mb-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-5" />
                카테고리별 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryStats.map((category) => (
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
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section className="mb-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="size-5" />
                업적
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`text-center p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100"
                        : "bg-gray-100 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className="text-xs font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Missions */}
        <section className="mb-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">최근 완료한 미션</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  전체보기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMissions.map((mission) => (
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
                      <span className="text-xs text-muted-foreground">{mission.completed_at}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Star className="size-3 fill-current" />
                      <span className="text-xs font-medium">+{mission.points}P</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}