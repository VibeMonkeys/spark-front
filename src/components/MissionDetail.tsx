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

// 명언 리스트 (100개)
const inspirationalQuotes = [
  "성공의 비결은 시작하는 것이다. - 마크 트웨인",
  "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다. - 헨리 포드",
  "실패는 성공으로 가는 계단이다. - 토마스 에디슨",
  "꿈을 이루고 싶다면 꿈꾸는 것을 멈춰라. - 박지성",
  "할 수 있다는 믿음이 가장 중요하다. - 오프라 윈프리",
  "오늘 할 수 있는 일을 내일로 미루지 마라. - 벤자민 프랭클린",
  "위대한 일을 하려면 자신이 하는 일을 사랑해야 한다. - 스티브 잡스",
  "성공은 준비된 자에게 찾아온다. - 루이 파스퇴르",
  "인생에서 가장 큰 위험은 아무런 위험을 감수하지 않는 것이다. - 마크 저커버그",
  "변화는 삶의 끝이 아니라 새로운 시작이다. - 윈스턴 처칠",
  "어제는 역사이고, 내일은 신비이며, 오늘은 선물이다. - 엘리너 루즈벨트",
  "성공의 80%는 그냥 나타나는 것이다. - 우디 앨런",
  "자신을 믿어라. 당신은 생각보다 강하다.",
  "작은 진전도 진전이다.",
  "완벽함은 진보의 적이다. - 볼테르",
  "시작이 반이다. - 아리스토텔레스",
  "노력은 배신하지 않는다.",
  "오늘의 나는 어제의 나보다 나아지고 있다.",
  "불가능은 없다. 불가능은 포기하는 사람에게만 있다.",
  "인생은 10%는 무슨 일이 일어나는가이고, 90%는 그것에 어떻게 반응하는가이다.",
  "기회는 준비된 마음이 우연과 만날 때 생긴다. - 루이 파스퇴르",
  "당신의 한계는 당신이 정한다.",
  "성공하는 사람들의 비밀은 포기하지 않는 것이다.",
  "꿈꾸는 것을 두려워하지 마라.",
  "행동하지 않으면 아무 일도 일어나지 않는다.",
  "모든 성취는 시도해보겠다는 결심에서 시작된다.",
  "실수는 배움의 기회다.",
  "자신에게 투자하는 것이 가장 좋은 투자다.",
  "인내는 쓰지만 그 열매는 달다. - 아리스토텔레스",
  "목표가 없으면 도달할 곳도 없다.",
  "노력하는 자는 희망이 있다.",
  "포기하지 않으면 반드시 길이 보인다.",
  "작은 행동이 큰 변화를 만든다.",
  "자신을 믿는 것이 성공의 첫 걸음이다.",
  "매일매일이 새로운 기회다.",
  "도전하지 않으면 얻을 수 없다.",
  "꾸준함이 재능을 이긴다.",
  "성공은 하루아침에 이루어지지 않는다.",
  "당신의 태도가 당신의 고도를 결정한다.",
  "지금 이 순간이 가장 중요하다.",
  "실패를 두려워하지 말고 시도하지 않는 것을 두려워하라.",
  "변화를 원한다면 행동하라.",
  "한 걸음씩 나아가면 목표에 도달한다.",
  "긍정적인 마음이 긍정적인 결과를 만든다.",
  "어려움은 강해지는 기회다.",
  "자신만의 속도로 가면 된다.",
  "오늘은 어제보다 더 나은 날이다.",
  "용기는 두려움을 극복하는 힘이다.",
  "세상을 바꾸고 싶다면 자신부터 바꿔라. - 마하트마 간디",
  "학습에는 끝이 없다.",
  "열정은 모든 장애물을 뛰어넘는다.",
  "목표를 향해 한 걸음씩 나아가자.",
  "성장은 편안함을 벗어날 때 시작된다.",
  "매 순간이 새로운 시작이다.",
  "노력한 만큼 결과가 따라온다.",
  "자신의 가능성을 믿어라.",
  "도전은 성장의 원동력이다.",
  "인생은 마라톤이지 단거리 달리기가 아니다.",
  "준비된 자에게 기회는 온다.",
  "창의성은 용기에서 나온다.",
  "작은 습관이 큰 변화를 만든다.",
  "오늘 하루도 최선을 다하자.",
  "성공은 계획과 실행의 만남이다.",
  "꿈은 계획이 있을 때 목표가 된다.",
  "집중력이 성공의 열쇠다.",
  "인내와 끈기가 승리를 가져다준다.",
  "자신에게 한계를 두지 마라.",
  "매일 조금씩 발전하자.",
  "좋은 습관은 좋은 인생을 만든다.",
  "시간은 가장 소중한 자원이다.",
  "행복은 성공이 아니라 여정에 있다.",
  "자신을 과소평가하지 마라.",
  "도전은 새로운 가능성을 열어준다.",
  "끝까지 해보지 않으면 모른다.",
  "실패는 성공의 어머니다.",
  "지금이 가장 좋은 때다.",
  "마음가짐이 모든 것을 결정한다.",
  "목표를 세우고 행동하라.",
  "꿈을 현실로 만드는 것은 행동이다.",
  "작은 성공들이 모여 큰 성공이 된다.",
  "자신만의 길을 걸어가라.",
  "포기는 성공을 가로막는 유일한 장벽이다.",
  "매순간 최선을 다하면 된다.",
  "변화는 불편하지만 성장에 필요하다.",
  "자신의 꿈에 투자하라.",
  "기회는 만드는 것이다.",
  "꾸준함이 천재성을 능가한다.",
  "오늘의 작은 노력이 내일의 큰 성과가 된다.",
  "실수를 두려워하지 말고 배우지 않는 것을 두려워하라.",
  "목표가 있으면 길이 보인다.",
  "성공의 비밀은 시작하는 용기다.",
  "자신을 믿으면 세상도 당신을 믿는다.",
  "한계는 깨뜨리기 위해 존재한다.",
  "노력은 절대 배신하지 않는다.",
  "매일이 새로운 도전의 기회다.",
  "성장하려면 불편함을 감수해야 한다.",
  "꿈꾸지 않으면 이룰 수도 없다.",
  "행동이 모든 것을 바꾼다.",
  "자신의 잠재력을 믿어라.",
  "작은 변화가 큰 차이를 만든다.",
  "도전하는 자만이 성공할 수 있다.",
  "인생에서 가장 큰 모험은 꿈을 추구하는 것이다.",
  "준비하고 기다리면 기회가 온다.",
  "자신만의 속도로 성장하면 된다.",
  "오늘 하루를 의미있게 살자.",
  "목표를 향한 여정 자체가 보상이다."
];

const getRandomQuote = () => {
  return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
};

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
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100">
            <ArrowLeft className="size-5 text-gray-700" />
          </Button>
          <h1 className="font-semibold text-xl text-gray-900">미션 상세</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6 pb-4">
        {/* Mission Header Card - 홈 스타일 */}
        <div className="mb-5">
          <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100 bg-white shadow-sm rounded-2xl`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                {/* Left: Title */}
                <div className="flex-1 min-w-0">
                  <h2 className={`font-semibold text-xl text-gray-900 leading-tight mb-2`}>
                    {missionData.title}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium border border-blue-100">
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
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="size-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="size-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600 mb-1">{missionDetail.completed_by?.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-600 font-medium">명 완료</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="size-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="size-5 text-green-600" />
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600 mb-1">{missionDetail.success_rate || 0}%</div>
                <p className="text-xs text-gray-600 font-medium">성공률</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="size-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center">
                    <Target className="size-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-600 mb-1">{getDifficultyText(missionData.difficulty)}</div>
                <p className="text-xs text-gray-600 font-medium">난이도</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Description */}
        <section className="mb-5">
          <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <div className="size-9 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="size-4 text-orange-600" />
                </div>
                <span className="text-gray-900">미션 소개</span>
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">{missionData.description}</p>
            </CardContent>
          </Card>
        </section>


        {/* Mission Action Button */}
        <div className="mb-5">
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
        <section className="mb-5">
          <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="pb-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="size-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="size-4 text-emerald-600" />
                </div>
                <span className="text-gray-900 font-bold">상세 설명</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="-mt-2">
              <p className="text-gray-700 leading-relaxed text-base">
                {missionDetail.detailed_description || missionData.description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tips */}
        {tips.length > 0 && (
          <section className="mb-5">
            <Card className="border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="size-9 bg-pink-50 border border-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="size-4 text-pink-600" />
                  </div>
                  <span className="text-gray-900 font-bold">성공 팁</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-2">
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-7 bg-pink-50 border border-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-pink-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Encouragement Message */}
        <section className="mb-5">
          <Card className="border border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardContent className="p-5 text-center">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                💪 도전해보세요!
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm italic">
                "{getRandomQuote()}"
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/60 rounded-xl p-3 border border-blue-200">
                  <div className="font-bold text-blue-600 text-lg">
                    {missionDetail.completed_by?.toLocaleString() || 0}명
                  </div>
                  <div className="text-gray-600">이미 완료했어요</div>
                </div>
                <div className="bg-white/60 rounded-xl p-3 border border-blue-200">
                  <div className="font-bold text-blue-600 text-lg">
                    {missionData.duration}
                  </div>
                  <div className="text-gray-600">평균 완료 시간</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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