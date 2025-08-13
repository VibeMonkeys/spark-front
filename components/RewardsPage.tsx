import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Gift, Coffee, ShoppingBag, Ticket, Clock, Check, Crown, Zap } from "lucide-react";

const userPoints = {
  current: 1240,
  total: 3850,
  thisMonth: 450
};

const rewardCategories = [
  { id: "coffee", name: "카페", icon: Coffee },
  { id: "shopping", name: "쇼핑", icon: ShoppingBag },
  { id: "entertainment", name: "엔터테인먼트", icon: Ticket },
  { id: "premium", name: "프리미엄", icon: Crown }
];

const availableRewards = [
  {
    id: 1,
    category: "coffee",
    title: "스타벅스 아메리카노",
    description: "전국 스타벅스에서 사용 가능",
    originalPrice: "₩4,500",
    points: 350,
    discount: "22%",
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "스타벅스",
    expires: "30일",
    popular: true
  },
  {
    id: 2,
    category: "entertainment",
    title: "CGV 영화 관람권",
    description: "평일 2D 영화 관람 (팝콘 세트 포함)",
    originalPrice: "₩12,000",
    points: 900,
    discount: "25%",
    image: "https://images.unsplash.com/photo-1489599743715-0a6c9f46b9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "CGV",
    expires: "60일",
    popular: false
  },
  {
    id: 3,
    category: "coffee",
    title: "투썸플레이스 케이크 세트",
    description: "아메리카노 + 시그니처 케이크",
    originalPrice: "₩8,500",
    points: 650,
    discount: "23%",
    image: "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "투썸플레이스",
    expires: "30일",
    popular: false
  },
  {
    id: 4,
    category: "shopping",
    title: "GS25 편의점 상품권",
    description: "전국 GS25에서 사용 가능",
    originalPrice: "₩5,000",
    points: 400,
    discount: "20%",
    image: "https://images.unsplash.com/photo-1570197506759-8b9de9b7a1b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "GS25",
    expires: "90일",
    popular: true
  },
  {
    id: 5,
    category: "premium",
    title: "MONKEYS Premium 1개월",
    description: "무제한 리롤, 프리미엄 미션, 광고 제거",
    originalPrice: "₩4,900",
    points: 1200,
    discount: "FREE",
    image: "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "MONKEYS",
    expires: "즉시 적용",
    popular: false,
    isPremium: true
  }
];

const rewardHistory = [
  {
    id: 1,
    title: "스타벅스 아메리카노",
    points: 350,
    usedAt: "2시간 전",
    status: "사용됨",
    code: "STBK-1234-5678"
  },
  {
    id: 2,
    title: "GS25 편의점 상품권",
    points: 400,
    usedAt: "3일 전",
    status: "사용됨",
    code: "GS25-9876-5432"
  },
  {
    id: 3,
    title: "투썸플레이스 케이크 세트",
    points: 650,
    usedAt: "1주 전",
    status: "만료됨",
    code: "TSOM-1111-2222"
  }
];

export function RewardsPage() {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRewards = selectedCategory === "all" 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const canAfford = (points: number) => userPoints.current >= points;

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
                  <div className="text-lg font-semibold">+{userPoints.thisMonth}</div>
                  <p className="text-xs opacity-90">이번 달 획득</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  {reward.isPremium && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Crown className="size-3 mr-1" />
                        프리미엄
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex">
                    <ImageWithFallback
                      src={reward.image}
                      alt={reward.title}
                      className="w-24 h-24 object-cover flex-shrink-0"
                    />
                    <CardContent className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{reward.brand}</span>
                            {reward.discount !== "FREE" && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {reward.discount} 할인
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
                          {reward.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {reward.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          disabled={!canAfford(reward.points)}
                          className={canAfford(reward.points) 
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
                            : "opacity-50"
                          }
                        >
                          {canAfford(reward.points) ? "교환하기" : "포인트 부족"}
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
                        variant={item.status === "사용됨" ? "default" : "secondary"}
                        className={item.status === "사용됨" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                      >
                        {item.status === "사용됨" ? <Check className="size-3 mr-1" /> : null}
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">
                        <p>코드: {item.code}</p>
                        <p>{item.usedAt}</p>
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

            <div className="py-4 text-center">
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                더 많은 내역 보기
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}