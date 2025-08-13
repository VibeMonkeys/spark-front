import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Target, Star, CheckCircle, Calendar, TrendingUp, Filter, Play } from "lucide-react";

const ongoingMissions = [
  {
    id: 1,
    category: "모험적",
    title: "가보지 않은 길로 퇴근하기",
    description: "평소와 다른 길을 선택해서 새로운 풍경을 만나보세요",
    difficulty: "Medium",
    duration: "20분",
    points: 20,
    progress: 0,
    timeLeft: "4시간 12분",
    categoryColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlb3BsZSUyMGFkdmVudHVyZSUyMGRhaWx5JTIwbWlzc2lvbnxlbnwxfHx8fDE3NTUwODY1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    category: "건강",
    title: "계단으로 5층 올라가기",
    description: "엘리베이터 대신 계단을 이용해 건강한 하루를 시작하세요",
    difficulty: "Easy",
    duration: "10분",
    points: 10,
    progress: 60,
    timeLeft: "3시간 45분",
    categoryColor: "bg-green-500",
    image: "https://images.unsplash.com/photo-1597644568217-780bd0b0efb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBzdGFpcnMlMjBoZWFsdGh5fGVufDF8fHx8MTc1NTA4NjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const completedMissions = [
  {
    id: 3,
    category: "사교적",
    title: "새로운 카페 발견하기",
    description: "회사 근처 숨겨진 카페를 찾아보세요",
    difficulty: "Medium",
    points: 20,
    completedAt: "2시간 전",
    rating: 5,
    categoryColor: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    category: "창의적",
    title: "일상 사물로 예술 작품 만들기",
    description: "주변에 있는 물건들로 창의적인 작품을 만들어보세요",
    difficulty: "Hard",
    points: 30,
    completedAt: "어제",
    rating: 4,
    categoryColor: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    category: "모험적",
    title: "버스 대신 한 정거장 걸어가기",
    description: "걸으면서 동네를 새롭게 관찰해보세요",
    difficulty: "Easy",
    points: 15,
    completedAt: "2일 전",
    rating: 4,
    categoryColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const categoryStats = [
  { name: "사교적", completed: 12, total: 18, color: "bg-blue-500", percentage: 67 },
  { name: "모험적", completed: 15, total: 20, color: "bg-orange-500", percentage: 75 },
  { name: "건강", completed: 8, total: 15, color: "bg-green-500", percentage: 53 },
  { name: "창의적", completed: 5, total: 12, color: "bg-purple-500", percentage: 42 },
  { name: "학습", completed: 2, total: 8, color: "bg-yellow-500", percentage: 25 }
];

export function MissionsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");

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
                <span className="text-lg font-bold text-purple-500">78%</span>
              </div>
              <p className="text-xs text-muted-foreground">완료율</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="ongoing">진행 중</TabsTrigger>
            <TabsTrigger value="completed">완료됨</TabsTrigger>
            <TabsTrigger value="stats">통계</TabsTrigger>
          </TabsList>

          {/* Ongoing Missions */}
          <TabsContent value="ongoing" className="space-y-4 mt-4">
            {ongoingMissions.length > 0 ? (
              ongoingMissions.map((mission) => (
                <Card key={mission.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={mission.image}
                      alt={mission.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${mission.categoryColor} text-white border-0 text-xs`}>
                        {mission.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs text-white font-medium">+{mission.points}P</span>
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
                        {mission.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{mission.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{mission.timeLeft} 남음</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        <Play className="size-3 mr-1" />
                        계속하기
                      </Button>
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
                  <Button variant="outline">미션 둘러보기</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Missions */}
          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedMissions.map((mission) => (
              <Card key={mission.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={mission.image}
                      alt={mission.title}
                      className="size-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${mission.categoryColor} text-white border-0 text-xs`}>
                              {mission.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {mission.difficulty}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm">{mission.title}</h3>
                          <p className="text-xs text-muted-foreground">{mission.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(mission.rating)}
                          </div>
                          <span className="text-xs text-muted-foreground">{mission.completedAt}</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="size-3" />
                          <span className="text-xs font-medium">+{mission.points}P</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="py-4 text-center">
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                더 많은 완료된 미션 보기
              </Button>
            </div>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6 mt-4">
            {/* Category Progress */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  카테고리별 진행도
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
                      <span className="font-medium">{category.completed}/{category.total}</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">이번 달 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">18</div>
                    <p className="text-xs text-muted-foreground">완료한 미션</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">450P</div>
                    <p className="text-xs text-muted-foreground">획득한 포인트</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">12일</div>
                    <p className="text-xs text-muted-foreground">최대 연속일</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                    <p className="text-xs text-muted-foreground">성공률</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}