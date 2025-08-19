import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Hash, TrendingUp, Star, X, Loader2, FileText, Target, MessageCircle, Heart } from 'lucide-react';
import { hashtagApi, storyApi } from '../shared/api';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StorySearchResult {
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
  story_type: 'FREE_STORY' | 'MISSION_PROOF';
}

interface UnifiedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  open,
  onOpenChange,
  initialQuery = ''
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<StorySearchResult[]>([]);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'stories' | 'missions'>('all');

  // 통합 검색 함수
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHashtagSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // 해시태그로 시작하는 경우
      if (query.startsWith('#')) {
        const hashtag = query.slice(1);
        
        // 해시태그가 포함된 스토리 검색
        const [freeStories, missionProofs] = await Promise.all([
          storyApi.searchStoriesByHashtag(hashtag, 'FREE_STORY', 10),
          storyApi.searchStoriesByHashtag(hashtag, 'MISSION_PROOF', 10)
        ]);

        const allResults = [
          ...(freeStories.items || []).map((item: any) => ({ ...item, story_type: 'FREE_STORY' as const })),
          ...(missionProofs.items || []).map((item: any) => ({ ...item, story_type: 'MISSION_PROOF' as const }))
        ];

        setSearchResults(allResults);
      } else {
        // 일반 텍스트 검색 (스토리 내용 + 해시태그 검색)
        const [freeStories, missionProofs, hashtags] = await Promise.all([
          storyApi.searchStoriesByType(query, 'FREE_STORY', 10),
          storyApi.searchStoriesByType(query, 'MISSION_PROOF', 10),
          hashtagApi.searchHashtags(query, 5)
        ]);

        const allResults = [
          ...(freeStories.items || []).map((item: any) => ({ ...item, story_type: 'FREE_STORY' as const })),
          ...(missionProofs.items || []).map((item: any) => ({ ...item, story_type: 'MISSION_PROOF' as const }))
        ];

        setSearchResults(allResults);
        
        // 해시태그 제안
        if (hashtags.success && hashtags.data) {
          const suggestions = (hashtags.data as any).hashtags || [];
          setHashtagSuggestions(suggestions);
        }
      }
    } catch (error) {
      // Error handled silently
      setSearchResults([]);
      setHashtagSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운스된 검색
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    []
  );

  useEffect(() => {
    if (open && initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHashtagSuggestions([]);
    }
  }, [searchQuery, debouncedSearch]);

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
    setSearchResults([]);
    setHashtagSuggestions([]);
  };

  const handleHashtagClick = (hashtag: string) => {
    const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    setSearchQuery(formattedHashtag);
    performSearch(formattedHashtag);
  };

  const filteredResults = searchResults.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'stories') return result.story_type === 'FREE_STORY';
    if (activeTab === 'missions') return result.story_type === 'MISSION_PROOF';
    return true;
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] min-h-[600px] overflow-hidden p-0 gap-0 rounded-2xl border-0 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">통합 검색</h2>
              <p className="text-sm text-gray-600">스토리, 미션인증, 해시태그를 검색하세요</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          {/* 검색 입력 */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="스토리 내용, 해시태그 검색... (예: #카페, 운동, 독서)"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
            />
          </div>

          {/* 해시태그 제안 */}
          {hashtagSuggestions.length > 0 && !searchQuery.startsWith('#') && (
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="text-sm font-medium text-gray-700 mb-1">관련 해시태그</div>
              <div className="flex flex-wrap gap-2">
                {hashtagSuggestions.map((hashtag, index) => (
                  <button
                    key={index}
                    onClick={() => handleHashtagClick(hashtag.hashtag)}
                    className="flex items-center gap-1 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-3 py-1 text-sm transition-colors duration-150"
                  >
                    <Hash className="w-3 h-3 text-blue-500" />
                    <span>{hashtag.hashtag}</span>
                    <span className="text-xs text-gray-500">({hashtag.totalCount})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 탭 */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-150 ${
                activeTab === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              전체 ({filteredResults.length})
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-150 ${
                activeTab === 'stories'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                스토리 ({searchResults.filter(r => r.story_type === 'FREE_STORY').length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-150 ${
                activeTab === 'missions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                미션인증 ({searchResults.filter(r => r.story_type === 'MISSION_PROOF').length})
              </div>
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="h-80 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <div className="text-gray-600 font-medium">검색 중...</div>
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <div className="text-sm text-gray-600 font-medium mb-2">
                  {filteredResults.length}개의 결과를 찾았습니다
                </div>
                {filteredResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow duration-150"
                  >
                    {/* 사용자 정보 */}
                    <div className="flex items-center gap-3 mb-2">
                      <ImageWithFallback
                        src={result.user.avatar_url}
                        alt={result.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{result.user.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {result.user.level}
                          </Badge>
                          <Badge 
                            variant={result.story_type === 'FREE_STORY' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {result.story_type === 'FREE_STORY' ? '스토리' : '미션인증'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(result.time_ago)} • {result.location || '위치 미정'}
                        </p>
                      </div>
                    </div>

                    {/* 미션 정보 */}
                    {result.mission && (
                      <Badge className={`${result.mission.category_color} text-white border-0 text-xs mb-2`}>
                        {result.mission.category} • {result.mission.title}
                      </Badge>
                    )}

                    {/* 스토리 내용 */}
                    <p className="text-sm text-gray-800 leading-relaxed mb-2 line-clamp-2">
                      {result.story}
                    </p>

                    {/* 해시태그 */}
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {result.tags.slice(0, 3).map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => handleHashtagClick(tag)}
                            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </button>
                        ))}
                        {result.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{result.tags.length - 3}개</span>
                        )}
                      </div>
                    )}

                    {/* 상호작용 */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Heart className="w-4 h-4" />
                        <span>{result.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{result.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : searchQuery.trim() ? (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-2xl w-fit mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-gray-900 font-semibold mb-2">검색 결과가 없습니다</div>
                <div className="text-gray-500 text-sm">다른 키워드로 검색해보세요</div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl w-fit mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-gray-900 font-semibold mb-2">스토리와 미션을 검색해보세요</div>
                <div className="text-gray-500 text-sm">
                  텍스트나 해시태그로 원하는 내용을 찾을 수 있어요
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Dialog>
  );
};

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}