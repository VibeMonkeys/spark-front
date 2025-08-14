import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, MessageCircle, Share, Filter, TrendingUp, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";

interface StoryFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  userLevel: string;
  missionId: string;
  missionTitle: string;
  missionCategory: string;
  storyText: string;
  images: string[];
  location: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  hashTags: string[];
  createdAt: string;
}

export function FeedPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("latest");

  // 스토리 피드 데이터 조회
  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ['story-feed', filter, user?.id],
    queryFn: () => storyApi.getStoryFeed(filter, 0, 20, undefined, user?.id),
    enabled: !!user?.id,
  });

  // 좋아요 토글 mutation
  const likeMutation = useMutation({
    mutationFn: ({ storyId, isLiked }: { storyId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return isLiked 
        ? storyApi.unlikeStory(storyId, user.id)
        : storyApi.likeStory(storyId, user.id);
    },
    onSuccess: () => {
      // 피드 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['story-feed'] });
    },
    onError: (error: any) => {
      console.error('Like/unlike failed:', error);
    }
  });

  const handleLike = (storyId: string, isCurrentlyLiked: boolean) => {
    likeMutation.mutate({ storyId, isLiked: isCurrentlyLiked });
  };

  const handleShare = (storyId: string) => {
    // 웹 공유 API 사용 또는 클립보드 복사
    if (navigator.share) {
      navigator.share({
        title: 'SPARK 미션 스토리',
        text: '흥미로운 미션 스토리를 확인해보세요!',
        url: `${window.location.origin}/story/${storyId}`
      });
    } else {
      // 클립보드에 URL 복사
      navigator.clipboard.writeText(`${window.location.origin}/story/${storyId}`);
      // TODO: 토스트 알림 표시
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ADVENTURE':
      case 'ADVENTUROUS':
        return 'bg-orange-500';
      case 'SOCIAL':
        return 'bg-blue-500';
      case 'HEALTH':
      case 'HEALTHY':
        return 'bg-green-500';
      case 'CREATIVE':
        return 'bg-purple-500';
      case 'LEARNING':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'ADVENTURE':
      case 'ADVENTUROUS':
        return '모험적';
      case 'SOCIAL':
        return '사교적';
      case 'HEALTH':
      case 'HEALTHY':
        return '건강';
      case 'CREATIVE':
        return '창의적';
      case 'LEARNING':
        return '학습';
      default:
        return category;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return '방금 전';
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">스토리 피드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">스토리를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['story-feed'] })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const stories = feedData?.data || [];

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
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">아직 공유된 스토리가 없습니다</p>
              <p className="text-sm text-gray-500">미션을 완료하고 첫 번째 스토리를 공유해보세요!</p>
            </div>
          ) : (
            stories.map((story: StoryFeedItem) => (
              <Card key={story.id} className="border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* User Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageWithFallback
                        src={story.userAvatarUrl}
                        alt={story.userName}
                        className="size-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{story.userName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {story.userLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(story.createdAt)} • {story.location || '위치 미정'}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={`${getCategoryColor(story.missionCategory)} text-white border-0 text-xs`}>
                      {getCategoryDisplayName(story.missionCategory)} • {story.missionTitle}
                    </Badge>
                  </div>

                  {/* Images */}
                  {story.images && story.images.length > 0 && (
                    <div className="aspect-square relative">
                      <ImageWithFallback
                        src={story.images[0]}
                        alt="미션 인증 사진"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-foreground/90 leading-relaxed mb-2">
                      {story.storyText}
                    </p>
                    
                    {/* Hash Tags */}
                    {story.hashTags && story.hashTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {story.hashTags.map((tag, index) => (
                          <span key={index} className="text-xs text-blue-600 hover:text-blue-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(story.id, story.isLikedByCurrentUser)}
                          disabled={likeMutation.isPending}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Heart 
                            className={`size-4 ${story.isLikedByCurrentUser ? 'text-red-500 fill-current' : ''}`} 
                          />
                          <span>{story.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                          <MessageCircle className="size-4" />
                          <span>{story.commentCount}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleShare(story.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                      >
                        <Share className="size-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {stories.length > 0 && (
          <div className="py-8 text-center">
            <Button
              variant="outline"
              className="bg-white/60 backdrop-blur-sm"
              onClick={() => {
                // TODO: 다음 페이지 로드 기능 구현
                console.log('Load more stories');
              }}
            >
              더 많은 스토리 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}