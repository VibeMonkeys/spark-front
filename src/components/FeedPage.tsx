import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, MessageCircle, Share, Filter, TrendingUp } from "lucide-react";

const feedData = [
  {
    id: 1,
    user: {
      name: "김지윤",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      level: "레벨 8 탐험가"
    },
    mission: {
      title: "새로운 카페 발견하기",
      category: "사교적",
      categoryColor: "bg-blue-500"
    },
    images: [
      "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    story: "회사 근처에 숨겨진 작은 카페를 발견했어요! 직접 로스팅하는 원두 향이 정말 좋았고, 사장님이 친절하게 원두에 대해 설명해주셨어요 ☕️ 다음에 또 가고 싶은 곳이네요!",
    likes: 24,
    comments: 7,
    timeAgo: "2시간 전",
    location: "강남구"
  },
  {
    id: 2,
    user: {
      name: "이준호",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      level: "레벨 5 모험가"
    },
    mission: {
      title: "모르는 사람과 프리스비 하기",
      category: "모험적",
      categoryColor: "bg-orange-500"
    },
    images: [
      "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    story: "한강에서 혼자 프리스비 던지고 있었는데, 지나가던 분들이 같이 하자고 하시더라고요! 새로운 친구들도 만나고 너무 재미있었어요 🥏 역시 용기를 내보길 잘했네요!",
    likes: 31,
    comments: 12,
    timeAgo: "4시간 전",
    location: "한강공원"
  },
  {
    id: 3,
    user: {
      name: "박서연",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      level: "레벨 12 전문가"
    },
    mission: {
      title: "계단으로 10층 올라가기",
      category: "건강",
      categoryColor: "bg-green-500"
    },
    images: [
      "https://images.unsplash.com/photo-1597644568217-780bd0b0efb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBzdGFpcnMlMjBoZWFsdGh5fGVufDF8fHx8MTc1NTA4NjU2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    story: "엘리베이터 대신 계단으로! 처음엔 힘들었지만 10층까지 올라가니 뿌듯하고 개운하네요 💪 운동 안 한 지 오래됐는데 이런 식으로라도 몸을 움직이니 좋은 것 같아요.",
    likes: 18,
    comments: 5,
    timeAgo: "6시간 전",
    location: "회사"
  }
];

export function FeedPage() {
  const [filter, setFilter] = useState("latest");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              스토리 피드
            </h1>
            <Button variant="ghost" size="sm">
              <Filter className="size-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "latest" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("latest")}
              className={filter === "latest" ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              최신순
            </Button>
            <Button
              variant={filter === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("popular")}
              className={filter === "popular" ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              <TrendingUp className="size-4 mr-1" />
              인기순
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        <div className="py-4 space-y-6">
          {feedData.map((post) => (
            <Card key={post.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {/* User Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageWithFallback
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{post.user.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.user.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{post.timeAgo} • {post.location}</p>
                    </div>
                  </div>
                  
                  <Badge className={`${post.mission.categoryColor} text-white border-0 text-xs`}>
                    {post.mission.category} • {post.mission.title}
                  </Badge>
                </div>

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={post.images[0]}
                      alt="미션 인증 사진"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                    {post.story}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart 
                          className={`size-4 ${likedPosts.has(post.id) ? 'text-red-500 fill-current' : ''}`} 
                        />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                        <MessageCircle className="size-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                      <Share className="size-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="py-8 text-center">
          <Button
            variant="outline"
            className="bg-white/60 backdrop-blur-sm"
          >
            더 많은 스토리 보기
          </Button>
        </div>
      </div>
    </div>
  );
}