import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Settings, Star, Flame, Trophy, Calendar, Target, TrendingUp, Gift } from "lucide-react";

const userStats = {
  name: "김지윤",
  level: 8,
  levelTitle: "탐험가",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  currentPoints: 1240,
  totalPoints: 3850,
  nextLevelPoints: 1500,
  currentStreak: 7,
  longestStreak: 21,
  completedMissions: 42,
  totalDays: 35,
  joinDate: "2024년 12월"
};

const categoryStats = [
  { name: "사교적", completed: 12, color: "bg-blue-500", percentage: 65 },
  { name: "모험적", completed: 15, color: "bg-orange-500", percentage: 80 },
  { name: "건강", completed: 8, color: "bg-green-500", percentage: 45 },
  { name: "창의적", completed: 5, color: "bg-purple-500", percentage: 30 },
  { name: "학습", completed: 2, color: "bg-yellow-500", percentage: 15 }
];

const achievements = [
  { id: 1, name: "첫 걸음", description: "첫 미션 완료", icon: "🎯", unlocked: true },
  { id: 2, name: "불타는 열정", description: "7일 연속 미션 완료", icon: "🔥", unlocked: true },
  { id: 3, name: "소셜 버터플라이", description: "사교적 미션 10개 완료", icon: "🦋", unlocked: true },
  { id: 4, name: "모험왕", description: "모험적 미션 15개 완료", icon: "🗺️", unlocked: true },
  { id: 5, name: "마라토너", description: "30일 연속 미션 완료", icon: "🏃", unlocked: false },
  { id: 6, name: "마스터", description: "레벨 10 달성", icon: "👑", unlocked: false }
];

const recentMissions = [
  {
    id: 1,
    title: "새로운 카페 발견하기",
    category: "사교적",
    completedAt: "오늘",
    points: 20,
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "가보지 않은 길로 퇴근하기",
    category: "모험적",
    completedAt: "어제",
    points: 20,
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function ProfilePage() {
  const progressToNextLevel = ((userStats.currentPoints) / userStats.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            내 프로필
          </h1>
          <Button variant="ghost" size="sm">
            <Settings className="size-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Profile Header */}
        <div className="py-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src={userStats.avatar}
                  alt={userStats.name}
                  className="size-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{userStats.name}</h2>
                  <p className="text-muted-foreground">레벨 {userStats.level} {userStats.levelTitle}</p>
                  <p className="text-xs text-muted-foreground">{userStats.joinDate} 가입</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>다음 레벨까지</span>
                  <span className="font-medium">{userStats.nextLevelPoints - userStats.currentPoints}P</span>
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
                  <span className="text-xl font-bold text-blue-500">{userStats.currentPoints.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">현재 포인트</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Flame className="size-4 text-orange-500" />
                  <span className="text-xl font-bold text-orange-500">{userStats.currentStreak}</span>
                </div>
                <p className="text-xs text-muted-foreground">연속 완료일</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Target className="size-4 text-green-500" />
                  <span className="text-xl font-bold text-green-500">{userStats.completedMissions}</span>
                </div>
                <p className="text-xs text-muted-foreground">완료한 미션</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Calendar className="size-4 text-purple-500" />
                  <span className="text-xl font-bold text-purple-500">{userStats.totalDays}</span>
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
                    src={mission.image}
                    alt={mission.title}
                    className="size-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{mission.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {mission.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{mission.completedAt}</span>
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