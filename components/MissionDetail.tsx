import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Clock, Star, MapPin, Users, Camera, Heart } from "lucide-react";

interface MissionDetailProps {
  onBack: () => void;
  onStartMission: () => void;
}

const missionData = {
  id: 1,
  category: "모험적",
  title: "가보지 않은 길로 퇴근하기",
  description: "평소와 다른 길을 선택해서 새로운 풍경을 만나보세요. 일상 속에서 작은 모험을 통해 새로운 발견의 즐거움을 느껴보세요.",
  detailedDescription: "오늘은 평소 다니던 길 대신 새로운 경로를 선택해보세요. 지도를 보지 말고 직감을 따라 걸어보거나, 평소에 지나치기만 했던 골목길로 들어가 보세요. 작은 상점, 예쁜 건물, 또는 아름다운 나무 한 그루를 발견할 수 있을 거예요.",
  difficulty: "Medium",
  duration: "20분",
  points: 20,
  image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  categoryColor: "bg-orange-500",
  tips: [
    "안전한 시간대와 장소를 선택하세요",
    "휴대폰 배터리와 교통카드를 확인하세요",
    "발견한 것들을 사진으로 기록해보세요",
    "시간에 여유를 두고 출발하세요"
  ],
  completedBy: 1847,
  averageRating: 4.6
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

export function MissionDetail({ onBack, onStartMission }: MissionDetailProps) {
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
        {/* Mission Image & Basic Info */}
        <div className="py-6">
          <Card className="overflow-hidden border-0 bg-white/60 backdrop-blur-sm">
            <div className="relative">
              <ImageWithFallback
                src={missionData.image}
                alt={missionData.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className={`${missionData.categoryColor} text-white border-0`}>
                  {missionData.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm text-white font-medium">+{missionData.points}P</span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold">{missionData.title}</h2>
                <Badge variant="outline">
                  {missionData.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">{missionData.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  <span>{missionData.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>{missionData.completedBy.toLocaleString()}명 완료</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500 fill-current" />
                  <span>{missionData.averageRating}</span>
                </div>
              </div>

              <Button 
                onClick={onStartMission}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
                size="lg"
              >
                미션 시작하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Description */}
        <section className="mb-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">미션 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {missionData.detailedDescription}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tips */}
        <section className="mb-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">미션 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {missionData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="size-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Similar Missions */}
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
                          {mission.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">+{mission.points}P</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      도전
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