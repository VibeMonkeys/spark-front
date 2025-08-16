import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Gift, Coffee, ShoppingBag, Ticket, Clock, Check, Crown, Zap, Palette, GraduationCap, Utensils } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardsApi } from "../shared/api/rewardsApi";
import { useAuth } from "../contexts/AuthContext";

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
      console.error('Failed to exchange reward:', error);
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
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            리워드
          </h1>
          
          {/* Points Summary */}
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
          
          {/* Demo Product Notice */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-amber-600 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">데모 상품 안내</p>
                <p className="text-xs text-amber-700 mt-1">
                  현재 표시된 리워드는 모두 데모용 상품입니다. 추후 실제 상품이 적용될 예정입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="shop">리워드 샵</TabsTrigger>
            <TabsTrigger value="history">사용 내역</TabsTrigger>
          </TabsList>

          {/* Reward Shop */}
          <TabsContent value="shop" className="space-y-4 mt-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-purple-500 hover:bg-purple-600" : "bg-white/60"}
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
                    className={selectedCategory === category.id ? "bg-purple-500 hover:bg-purple-600" : "bg-white/60"}
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
                <Card key={reward.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden relative">
                  {reward.popular && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-red-500 text-white border-0">
                        <Zap className="size-3 mr-1" />
                        인기
                      </Badge>
                    </div>
                  )}
                  {reward.is_premium && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Crown className="size-3 mr-1" />
                        프리미엄
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex">
                    <ImageWithFallback
                      src={reward.image_url}
                      alt={reward.title}
                      className="w-24 h-24 object-cover flex-shrink-0"
                    />
                    <CardContent className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{reward.brand}</span>
                            {reward.discount && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {reward.discount}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{reward.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{reward.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            <span>유효기간: {reward.expires}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-purple-600">
                            <Star className="size-4 fill-current" />
                            <span className="font-bold">{reward.points.toLocaleString()}</span>
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
                          className={canAfford(reward.points) 
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
                            : "opacity-50"
                          }
                          onClick={() => handleExchangeReward(reward.id)}
                        >
                          {exchangeMutation.isPending ? "교환 중..." : canAfford(reward.points) ? "교환하기" : "포인트 부족"}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* More Rewards Coming */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Gift className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">더 많은 리워드가 준비 중이에요!</h3>
                <p className="text-sm text-muted-foreground">곧 새로운 브랜드 파트너십을 통해 더 다양한 혜택을 제공할 예정입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward History */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              {rewardHistory.map((item) => (
                <Card key={item.id} className="border-0 bg-white/60 backdrop-blur-sm">
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
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
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
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
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