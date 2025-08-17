import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, MessageCircle, Share, Filter, TrendingUp, Loader2, FileText, Target, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storyApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { NotificationBell } from "./ui/notification-bell";
import { StoryCreateModal } from "./StoryCreateModal";

interface StoryFeedItem {
  id: string;
  user: {
    name: string;
    avatar_url: string;
    level: string;
  };
  mission: {
    title: string;
    category: string;
    category_color: string;
  } | null;
  story: string;
  images: string[];
  location: string;
  tags: string[];
  likes: number;
  comments: number;
  time_ago: string;
  is_liked: boolean;
}

export function FeedPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'FREE_STORY' | 'MISSION_PROOF'>(() => {
    // localStorage에서 마지막 선택한 탭 복원
    const savedTab = localStorage.getItem('story-feed-tab');
    return savedTab === 'FREE_STORY' ? 'FREE_STORY' : 'MISSION_PROOF';
  });
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // 탭 변경 시 localStorage에 저장
  const handleFilterChange = (newFilter: 'FREE_STORY' | 'MISSION_PROOF') => {
    setFilter(newFilter);
    localStorage.setItem('story-feed-tab', newFilter);
  };

  // 스토리 피드 데이터 조회 (스토리 타입별)
  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ['story-feed-by-type', filter, user?.id],
    queryFn: () => storyApi.getStoryFeedByType(filter, undefined, 20, 'NEXT', user?.id),
    enabled: !!user?.id,
  });

  // 진행 중인 미션 조회 (미션 인증 시 필요)
  const { data: ongoingMissions } = useQuery({
    queryKey: ['ongoing-missions', user?.id],
    queryFn: () => fetch(`/api/v1/missions/ongoing?userId=${user?.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then(res => res.json()).then(data => data.data),
    enabled: !!user?.id && filter === 'MISSION_PROOF',
  });

  // 좋아요 토글 mutation (낙관적 업데이트 포함)
  const likeMutation = useMutation({
    mutationFn: async ({ storyId, isLiked }: { storyId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = isLiked 
        ? await storyApi.unlikeStory(storyId, user.id)
        : await storyApi.likeStory(storyId, user.id);
      
      return result;
    },
    onMutate: async ({ storyId, isLiked }) => {
      // 진행 중인 쿼리를 취소하여 낙관적 업데이트가 덮어쓰이지 않도록 함
      await queryClient.cancelQueries({ queryKey: ['story-feed-by-type', filter, user?.id] });
      
      // 이전 상태 저장 (롤백용)
      const previousData = queryClient.getQueryData(['story-feed-by-type', filter, user?.id]);
      
      // 낙관적으로 피드 데이터 업데이트
      queryClient.setQueryData(['story-feed-by-type', filter, user?.id], (old: any) => {
        if (!old?.items) return old;
        
        return {
          ...old,
          items: old.items.map((story: StoryFeedItem) => {
            if (story.id === storyId) {
              return {
                ...story,
                is_liked: !isLiked,
                likes: isLiked ? story.likes - 1 : story.likes + 1
              };
            }
            return story;
          })
        };
      });
      
      return { previousData };
    },
    onSuccess: (data, variables) => {
      // 서버 응답으로 캐시를 정확히 업데이트
      queryClient.setQueryData(['story-feed-by-type', filter, user?.id], (old: any) => {
        if (!old?.items) return old;
        
        return {
          ...old,
          items: old.items.map((story: StoryFeedItem) => {
            if (story.id === variables.storyId) {
              return {
                ...story,
                likes: data.likes,
                is_liked: data.is_liked
              };
            }
            return story;
          })
        };
      });
    },
    onError: (error: any, variables, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(['story-feed-by-type', filter, user?.id], context.previousData);
      }
    }
  });

  const handleLike = (storyId: string, isCurrentlyLiked: boolean) => {
    if (!user?.id) return;
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

  // getCategoryDisplayName 함수는 더 이상 사용하지 않음 (백엔드에서 한글 카테고리명 직접 제공)

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
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['story-feed-by-type'] })}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const stories = feedData?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              스토리 피드
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="size-4" />
              </Button>
              <NotificationBell />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "FREE_STORY" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("FREE_STORY")}
              className={filter === "FREE_STORY" ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
            >
              <FileText className="size-4 mr-1" />
              스토리
            </Button>
            <Button
              variant={filter === "MISSION_PROOF" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("MISSION_PROOF")}
              className={filter === "MISSION_PROOF" ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
            >
              <Target className="size-4 mr-1" />
              미션인증
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20 relative">
        <div className="py-4 space-y-6">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              {filter === "FREE_STORY" ? (
                <>
                  <FileText className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">아직 공유된 자유 스토리가 없습니다</p>
                  <p className="text-sm text-gray-500">일상을 공유하고 첫 번째 스토리를 만들어보세요!</p>
                </>
              ) : (
                <>
                  <Target className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">아직 공유된 미션 인증이 없습니다</p>
                  <p className="text-sm text-gray-500">미션을 완료하고 첫 번째 인증을 공유해보세요!</p>
                </>
              )}
            </div>
          ) : (
            stories.map((story: StoryFeedItem) => (
              <Card key={story.id} className="border-0 bg-white backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* User Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageWithFallback
                        src={story.user.avatar_url}
                        alt={story.user.name}
                        className="size-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{story.user.name}</span>
                          <Badge variant="secondary" className="text-xs border border-gray-200 bg-gray-50">
                            {story.user.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          {story.time_ago} • {story.location || '위치 미정'}
                        </p>
                      </div>
                    </div>
                    
                    {story.mission && (
                      <Badge className={`${story.mission.category_color} text-white border-0 text-xs`}>
                        {story.mission.category} • {story.mission.title}
                      </Badge>
                    )}
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
                      {story.story}
                    </p>
                    
                    {/* Hash Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {story.tags.map((tag, index) => (
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
                          onClick={() => handleLike(story.id, story.is_liked)}
                          disabled={likeMutation.isPending}
                          className={`
                            flex items-center gap-1 text-sm transition-all duration-200 disabled:opacity-50
                            ${story.is_liked 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-muted-foreground hover:text-red-500'
                            }
                            ${likeMutation.isPending ? 'animate-pulse' : 'hover:scale-105'}
                          `}
                        >
                          <Heart 
                            className={`
                              size-4 transition-all duration-200
                              ${story.is_liked ? 'text-red-500 fill-current scale-110' : 'hover:scale-110'} 
                              ${likeMutation.isPending ? 'animate-bounce' : ''}
                            `} 
                          />
                          <span className={`
                            font-medium transition-all duration-200
                            ${story.is_liked ? 'text-red-500' : ''}
                          `}>
                            {story.likes}
                          </span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors hover:scale-105 duration-200">
                          <MessageCircle className="size-4 hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{story.comments}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleShare(story.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-purple-500 transition-all duration-200 hover:scale-105"
                      >
                        <Share className="size-4 hover:scale-110 transition-transform duration-200" />
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
              }}
            >
              더 많은 스토리 보기
            </Button>
          </div>
        )}
      </div>

      {/* 플로팅 액션 버튼 - 스토리 작성 (스토리 탭에서만 표시) */}
      {filter === 'FREE_STORY' && (
        <div className="fixed bottom-24 z-50" style={{ right: 'calc(50vw - 192px + 16px)' }}>
          <div className="relative group">
            <Button
              size="lg"
              className="h-12 w-12 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={() => {
                setIsStoryModalOpen(true);
              }}
            >
              <Plus className="h-5 w-5 md:h-4 md:w-4 text-white" />
            </Button>
            
            {/* 툴팁 */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                자유 스토리 작성
                <div className="absolute top-full right-4 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스토리 작성 모달 */}
      <StoryCreateModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        storyType={filter}
        ongoingMissions={ongoingMissions || []}
      />
    </div>
  );
}