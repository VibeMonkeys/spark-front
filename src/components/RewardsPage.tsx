import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Gift, Coffee, ShoppingBag, Ticket, Clock, Check, Crown, Zap, Palette, GraduationCap, Utensils } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardsApi } from "../shared/api/rewardsApi";
import { useAuth } from "../contexts/AuthContext";
import { NotificationBell } from "./ui/notification-bell";
import { DailyQuestIcon } from "./ui/daily-quest-icon";

const rewardCategories = [
  { id: "카페", name: "카페", icon: Coffee },
  { id: "쇼핑", name: "쇼핑", icon: ShoppingBag },
  { id: "엔터테인먼트", name: "엔터테인먼트", icon: Ticket },
  { id: "음식", name: "음식", icon: Utensils },
  { id: "뷰티", name: "뷰티", icon: Palette },
  { id: "프리미엄", name: "프리미엄", icon: Crown }
];

// 카테고리 매핑
const getCategoryId = (category: string) => {
  const categoryMap: Record<string, string> = {
    "카페": "coffee",
    "쇼핑": "shopping", 
    "엔터테인먼트": "entertainment",
    "음식": "food",
    "뷰티": "beauty",
    "프리미엄": "premium"
  };
  return categoryMap[category] || category.toLowerCase();
};

export function RewardsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // 데모 팝업 관련 코드 제거

  // 리워드 페이지 전체 데이터 조회
  const { data: rewardsPageData, isLoading, error } = useQuery({
    queryKey: ['rewards-page', user?.id],
    queryFn: () => rewardsApi.getRewardsPage(user!.id),
    enabled: !!user?.id,
  });

  // 리워드 교환 mutation
  const exchangeMutation = useMutation({
    mutationFn: ({ rewardId, userId }: { rewardId: string; userId: string }) => {
      return rewardsApi.exchangeReward(rewardId, userId);
    },
    onSuccess: () => {
      // 리워드 페이지 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['rewards-page', user?.id] });
    },
    onError: (error: any) => {
      // Error handled silently
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">리워드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !rewardsPageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">리워드 정보를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['rewards-page', user?.id] })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const { user_points: userPoints, available_rewards: availableRewards, reward_history: rewardHistory } = rewardsPageData;

  const filteredRewards = selectedCategory === "all" 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const canAfford = (points: number) => userPoints.current >= points;

  const handleExchangeReward = (rewardId: string) => {
    if (!user?.id) return;
    exchangeMutation.mutate({ rewardId, userId: user.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              리워드
            </h1>
            <div className="flex items-center gap-2">
              <DailyQuestIcon />
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Points Summary */}
        <div className="py-4">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="size-5 fill-current" />
                    <span className="text-2xl font-bold">{userPoints.current.toLocaleString()}</span>
                  </div>
                  <p className="text-sm opacity-90">사용 가능한 포인트</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">+{userPoints.this_month}</div>
                  <p className="text-xs opacity-90">이번 달 획득</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl h-12">
            <TabsTrigger 
              value="shop" 
              className="rounded-lg font-semibold text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              리워드 샵
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-lg font-semibold text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              사용 내역
            </TabsTrigger>
          </TabsList>

          {/* Reward Shop */}
          <TabsContent value="shop" className="space-y-4 mt-1">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-white"}
              >
                전체
              </Button>
              {rewardCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-white"}
                  >
                    <Icon className="size-4 mr-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Rewards Grid */}
            <div className="space-y-4">
              {filteredRewards.map((reward) => (
                <Card key={reward.id} className="border-0 bg-white backdrop-blur-sm overflow-hidden relative p-3">
                  {/* 인기/프리미엄 배지 - 오른쪽 정렬로 배치 */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                    {reward.popular && (
                      <Badge className="bg-red-500 text-white border-0 text-xs px-2 py-0.5">
                        <Zap className="size-3 mr-1 flex-shrink-0" />
                        <span>인기</span>
                      </Badge>
                    )}
                    {reward.is_premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-0.5">
                        <Crown className="size-3 mr-1 flex-shrink-0" />
                        <span>프리미엄</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* 이미지 영역 - 더 큰 크기로 조정 */}
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100 rounded-xl shadow-sm">
                      <ImageWithFallback
                        src={reward.image_url}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        {reward.discount && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 px-2 py-0.5 mb-2">
                            {reward.discount}
                          </Badge>
                        )}
                        <h3 className="font-semibold text-sm leading-tight mb-1">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{reward.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3 flex-shrink-0" />
                          <span>유효기간: {reward.expires}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-purple-600">
                            <Star className="size-4 fill-current flex-shrink-0" />
                            <span className="font-bold text-sm">{reward.points.toLocaleString()}</span>
                          </div>
                          {reward.original_price && (
                            <span className="text-xs text-muted-foreground line-through">
                              {reward.original_price}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={!canAfford(reward.points) || exchangeMutation.isPending}
                          className={`flex-shrink-0 text-white font-medium transition-all duration-200 text-xs px-3 py-1.5 h-auto ${
                            canAfford(reward.points) 
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg" 
                              : "bg-gray-400 text-gray-100 cursor-not-allowed"
                          }`}
                          onClick={() => handleExchangeReward(reward.id)}
                        >
                          {exchangeMutation.isPending ? "교환 중..." : canAfford(reward.points) ? "교환하기" : "포인트 부족"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* More Rewards Coming */}
            <Card className="border-0 bg-white backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Gift className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">더 많은 리워드가 준비 중이에요!</h3>
                <p className="text-sm text-muted-foreground">곧 새로운 브랜드 파트너십을 통해 더 다양한 혜택을 제공할 예정입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward History */}
          <TabsContent value="history" className="space-y-4 mt-1">
            <div className="space-y-3">
              {rewardHistory.map((item) => (
                <Card key={item.id} className="border-0 bg-white backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <Badge 
                        variant={item.status === "USED" ? "default" : "secondary"}
                        className={item.status === "USED" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                      >
                        {item.status === "USED" ? <Check className="size-3 mr-1" /> : null}
                        {item.status === "USED" ? "사용됨" : item.status === "EXPIRED" ? "만료됨" : "사용 가능"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        <p>코드: {item.code}</p>
                        <p>{item.used_at}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-red-600">
                          <Star className="size-3 fill-current" />
                          <span className="font-medium">-{item.points.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {rewardHistory.length === 0 && (
              <Card className="border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Gift className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">아직 사용한 리워드가 없어요</h3>
                  <p className="text-sm text-muted-foreground mb-4">리워드 샵에서 다양한 혜택을 확인해보세요!</p>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("shop")}
                  >
                    리워드 샵 보기
                  </Button>
                </CardContent>
              </Card>
            )}

            {rewardHistory.length > 0 && (
              <div className="py-4 text-center">
                <Button variant="outline" className="bg-white backdrop-blur-sm">
                  더 많은 내역 보기
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}