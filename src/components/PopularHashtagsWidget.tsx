import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Hash, TrendingUp, Loader2 } from "lucide-react";
import { hashtagApi, HashtagStats } from "../shared/api";

interface PopularHashtagsWidgetProps {
  onHashtagClick?: (hashtag: string) => void;
  limit?: number;
  showTrending?: boolean;
}

export function PopularHashtagsWidget({ 
  onHashtagClick, 
  limit = 10, 
  showTrending = false 
}: PopularHashtagsWidgetProps) {
  const [showAll, setShowAll] = useState(false);
  
  // 인기 해시태그 조회
  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popular-hashtags', limit],
    queryFn: () => hashtagApi.getPopularHashtags(limit),
  });

  // 트렌딩 해시태그 조회 (showTrending이 true일 때만)
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending-hashtags', limit],
    queryFn: () => hashtagApi.getTrendingHashtags(limit),
    enabled: showTrending,
  });

  const isLoading = isPopularLoading || (showTrending && isTrendingLoading);
  
  const popularHashtags = popularData?.data || [];
  const trendingHashtags = trendingData?.data || [];

  const displayLimit = showAll ? limit : 6;
  const hasMore = popularHashtags.length > displayLimit;

  const handleHashtagClick = (hashtag: string) => {
    onHashtagClick?.(hashtag);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'FOOD': 'bg-orange-100 text-orange-700 border-orange-200',
      'HEALTH': 'bg-green-100 text-green-700 border-green-200',
      'SOCIAL': 'bg-blue-100 text-blue-700 border-blue-200',
      'ADVENTURE': 'bg-purple-100 text-purple-700 border-purple-200',
      'CREATIVE': 'bg-pink-100 text-pink-700 border-pink-200',
      'OTHER': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors['OTHER'];
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            <span className="text-sm text-gray-600">인기 해시태그 로딩 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* 인기 해시태그 */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Hash className="h-4 w-4 text-purple-600" />
            인기 해시태그
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {popularHashtags.slice(0, displayLimit).map((hashtag: HashtagStats) => (
              <button
                key={hashtag.id}
                onClick={() => handleHashtagClick(hashtag.hashtag)}
                className="group"
              >
                <Badge 
                  variant="secondary" 
                  className={`
                    ${getCategoryColor(hashtag.category)} 
                    hover:scale-105 transition-all duration-200 cursor-pointer
                    text-xs font-medium border
                  `}
                >
                  <span className="flex items-center gap-1">
                    {hashtag.hashtag}
                    <span className="text-xs opacity-70">
                      {hashtag.totalCount > 999 ? '999+' : hashtag.totalCount}
                    </span>
                  </span>
                </Badge>
              </button>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                {showAll ? '접기' : `${popularHashtags.length - displayLimit}개 더 보기`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 트렌딩 해시태그 (showTrending이 true일 때만 표시) */}
      {showTrending && trendingHashtags.length > 0 && (
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              트렌딩 해시태그
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {trendingHashtags.slice(0, 5).map((hashtag: HashtagStats, index: number) => (
                <button
                  key={hashtag.id}
                  onClick={() => handleHashtagClick(hashtag.hashtag)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-600 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                        {hashtag.hashtag}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {hashtag.categoryDisplayName}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>{hashtag.trendScore.toFixed(1)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}