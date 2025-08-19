import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Hash, TrendingUp, Star, RefreshCw } from 'lucide-react';

interface HashtagStats {
  id: string;
  hashtag: string;
  category: string;
  categoryDisplayName: string;
  categoryColor: string;
  dailyCount: number;
  weeklyCount: number;
  totalCount: number;
  trendScore: number;
  isPopular: boolean;
  isTrending: boolean;
}

interface HashtagWidgetProps {
  type: 'popular' | 'trending';
  limit?: number;
  onHashtagClick?: (hashtag: string) => void;
  className?: string;
}

export const HashtagWidget: React.FC<HashtagWidgetProps> = ({
  type,
  limit = 10,
  onHashtagClick,
  className = ''
}) => {
  const [hashtags, setHashtags] = useState<HashtagStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchHashtags = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'popular' ? 'popular' : 'trending';
      const response = await fetch(`/api/hashtags/${endpoint}?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHashtags(data.data || []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHashtags();
    
    // 5분마다 자동 새로고침
    const interval = setInterval(fetchHashtags, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [type, limit]);

  const handleHashtagClick = (hashtag: string) => {
    onHashtagClick?.(hashtag);
  };

  const getTitle = () => {
    return type === 'popular' ? '인기 해시태그' : '트렌딩 해시태그';
  };

  const getIcon = () => {
    return type === 'popular' ? 
      <Star className="w-4 h-4 text-yellow-500" /> : 
      <TrendingUp className="w-4 h-4 text-red-500" />;
  };

  const formatLastUpdated = () => {
    const diffMs = new Date().getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    return lastUpdated.toLocaleDateString();
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">{formatLastUpdated()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchHashtags}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading && hashtags.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">로딩 중...</div>
          </div>
        ) : hashtags.length === 0 ? (
          <div className="text-center py-4">
            <Hash className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <div className="text-sm text-gray-500">해시태그가 없습니다</div>
          </div>
        ) : (
          <div className="space-y-2">
            {hashtags.slice(0, limit).map((hashtag, index) => (
              <div
                key={hashtag.id}
                onClick={() => handleHashtagClick(hashtag.hashtag)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <span 
                      className="text-sm font-medium text-blue-600 group-hover:text-blue-700 truncate"
                      title={hashtag.hashtag}
                    >
                      {hashtag.hashtag}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5 border-0"
                      style={{ 
                        backgroundColor: hashtag.categoryColor + '20', 
                        color: hashtag.categoryColor 
                      }}
                    >
                      {hashtag.categoryDisplayName}
                    </Badge>
                    
                    {hashtag.isTrending && type === 'popular' && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5">
                        급상승
                      </Badge>
                    )}
                    
                    {hashtag.isPopular && type === 'trending' && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5">
                        인기
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900">
                    {type === 'trending' ? hashtag.dailyCount : hashtag.totalCount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {type === 'trending' ? '오늘' : '전체'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hashtags.length > limit && (
          <div className="pt-2 mt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-gray-600 hover:text-gray-800"
              onClick={() => {
                // 추후 전체 해시태그 목록 페이지로 이동 또는 모달 열기 예정
              }}
            >
              더 보기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};