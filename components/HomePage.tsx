import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Clock, Users, Star, Flame, ChevronRight, MapPin, Target } from "lucide-react";

const todaysMissions = [
  {
    id: 1,
    category: "모험적",
    title: "가보지 않은 길로 퇴근하기",
    description: "평소와 다른 길을 선택해서 새로운 풍경을 만나보세요",
    difficulty: "Medium",
    duration: "20분",
    points: 20,
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    categoryColor: "bg-orange-500"
  },
  {
    id: 2,
    category: "사교적",
    title: "카페에서 옆 테이블 사람과 대화하기",
    description: "자연스럽게 인사하며 짧은 대화를 나눠보세요",
    difficulty: "Hard",
    duration: "30분",
    points: 30,
    image: "https://images.unsplash.com/photo-1655579932488-e05b9f649ede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY29udmVyc2F0aW9uJTIwc29jaWFsfGVufDF8fHx8MTc1NTA4NjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    categoryColor: "bg-blue-500"
  },
  {
    id: 3,
    category: "건강",
    title: "계단으로 5층 올라가기",
    description: "엘리베이터 대신 계단을 이용해 건강한 하루를 시작하세요",
    difficulty: "Easy",
    duration: "10분",
    points: 10,
    image: "https://images.unsplash.com/photo-1597644568217-780bd0b0efb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBzdGFpcnMlMjBoZWFsdGh5fGVufDF8fHx8MTc1NTA4NjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    categoryColor: "bg-green-500"
  }
];

const recentStories = [
  {
    id: 1,
    user: "김지윤",
    mission: "새로운 카페 발견하기",
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    story: "회사 근처에 숨겨진 작은 카페를 발견했어요! 직접 로스팅하는 원두 향이 정말 좋았습니다 ☕️",
    likes: 24,
    timeAgo: "2시간 전"
  },
  {
    id: 2,
    user: "이준호",
    mission: "모르는 사람과 프리스비 하기",
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    story: "한강에서 혼자 프리스비 던지고 있었는데, 지나가던 분들이 같이 하자고 하시더라고요! 새로운 친구들도 만나고 너무 재미있었어요 🥏",
    likes: 31,
    timeAgo: "4시간 전"
  }
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MONKEYS
            </h1>
            <p className="text-xs text-muted-foreground">오늘도 새로운 모험을 시작해요!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
              <Flame className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">7일</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
              <Star className="size-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">1,240P</span>
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
                  <h3 className="font-semibold">레벨 7 모험가</h3>
                  <p className="text-sm opacity-90">다음 레벨까지 320P</p>
                </div>
                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="size-6" />
                </div>
              </div>
              <Progress value={68} className="h-2 bg-white/20" />
            </CardContent>
          </Card>
        </div>

        {/* Today's Missions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">오늘의 미션</h2>
            <Button variant="ghost" size="sm" className="text-blue-600">
              리롤하기
            </Button>
          </div>

          <div className="space-y-4">
            {todaysMissions.map((mission, index) => (
              <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                <div className="relative">
                  <ImageWithFallback
                    src={mission.image}
                    alt={mission.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${mission.categoryColor} text-white border-0`}>
                      {mission.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs text-white font-medium">+{mission.points}P</span>
                  </div>
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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{mission.duration}</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0">
                      도전하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Stories */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">최근 스토리</h2>
            <Button variant="ghost" size="sm" className="text-blue-600">
              더보기
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentStories.map((story) => (
              <Card key={story.id} className="border-0 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={story.image}
                      alt={story.mission}
                      className="size-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{story.user}</span>
                        <Badge variant="secondary" className="text-xs">
                          {story.mission}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{story.story}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 text-red-500 fill-current" />
                          <span>{story.likes}</span>
                        </div>
                        <span>{story.timeAgo}</span>
                      </div>
                    </div>
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