import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Search, Hash, TrendingUp, Star, X, Loader2, Sparkles } from 'lucide-react';
import { hashtagApi, HashtagStats, AutocompleteResult } from '../shared/api';

interface HashtagSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHashtagSelect?: (hashtag: string) => void;
}

export const HashtagSearchModal: React.FC<HashtagSearchModalProps> = ({
  open,
  onOpenChange,
  onHashtagSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HashtagStats[]>([]);
  const [popularHashtags, setPopularHashtags] = useState<HashtagStats[]>([]);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'popular'>('search');

  // API 호출 함수들
  const searchHashtags = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await hashtagApi.searchHashtags(query, 20);
      if (response.success && response.data) {
        setSearchResults(response.data.hashtags);
      }
    } catch (error) {
      // Error handled silently
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAutocomplete = async (prefix: string) => {
    if (prefix.length < 2) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const response = await hashtagApi.getAutocomplete(prefix, 5);
      if (response.success && response.data) {
        setAutocompleteResults(response.data);
      }
    } catch (error) {
      // Error handled silently
      setAutocompleteResults([]);
    }
  };

  const getPopularHashtags = async () => {
    try {
      const response = await hashtagApi.getPopularHashtags(15);
      if (response.success && response.data) {
        setPopularHashtags(response.data);
      }
    } catch (error) {
      // Error handled silently
      setPopularHashtags([]);
    }
  };

  // 디바운스된 검색
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchHashtags(query);
    }, 300),
    []
  );

  const debouncedAutocomplete = useCallback(
    debounce((prefix: string) => {
      getAutocomplete(prefix);
    }, 200),
    []
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (open) {
      getPopularHashtags();
      setSearchQuery('');
      setSearchResults([]);
      setAutocompleteResults([]);
      setActiveTab('search');
    }
  }, [open]);

  // 검색어 변경 시 자동완성 및 검색
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedAutocomplete(searchQuery);
      debouncedSearch(searchQuery);
      setActiveTab('search');
    } else {
      setAutocompleteResults([]);
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch, debouncedAutocomplete]);

  const handleHashtagClick = (hashtag: string) => {
    onHashtagSelect?.(hashtag);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const renderHashtagItem = (hashtag: HashtagStats, index: number) => (
    <div
      key={hashtag.id}
      onClick={() => handleHashtagClick(hashtag.hashtag)}
      className={`group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors duration-150 border border-gray-100 hover:border-blue-200 ${
        index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-500' : 'bg-gray-100'} transition-colors duration-150`}>
          <Hash className={`w-4 h-4 ${index === 0 ? 'text-white' : 'text-gray-500'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{hashtag.hashtag}</span>
            {hashtag.isTrending && (
              <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                급상승
              </div>
            )}
            {hashtag.isPopular && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                인기
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ 
                backgroundColor: hashtag.categoryColor + '20', 
                color: hashtag.categoryColor
              }}
            >
              {hashtag.categoryDisplayName}
            </span>
            <span className="text-xs text-gray-500">• {hashtag.totalCount.toLocaleString()}개 사용</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-sm text-gray-900">{hashtag.dailyCount}</div>
        <div className="text-xs text-gray-500">오늘</div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[70vh] min-h-[400px] overflow-hidden p-0 gap-0 rounded-2xl border-0 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">해시태그 검색</h2>
              <p className="text-sm text-gray-600">원하는 해시태그를 찾아보세요</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 검색 입력 */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="해시태그를 검색하세요... (예: 카페, 운동, 독서)"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
            />
            
            {/* 자동완성 */}
            {autocompleteResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                {autocompleteResults.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setAutocompleteResults([]);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors duration-150"
                  >
                    <div className="p-1 bg-gray-100 rounded-lg">
                      <Hash className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="font-medium">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 탭 */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-150 ${
                activeTab === 'search'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                검색 결과
              </div>
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-150 ${
                activeTab === 'popular'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                인기 해시태그
              </div>
            </button>
          </div>

          {/* 결과 영역 */}
          <div className="h-64 min-h-[256px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
            {activeTab === 'search' && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-16 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <div className="text-gray-600 font-medium">검색 중...</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-600 font-medium mb-4">
                      총 {searchResults.length}개의 해시태그를 찾았습니다
                    </div>
                    {searchResults.map((hashtag, index) => renderHashtagItem(hashtag, index))}
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
                      <Hash className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-gray-900 font-semibold mb-2">해시태그를 검색해보세요</div>
                    <div className="text-gray-500 text-sm">관심있는 주제를 입력하면 관련 해시태그를 찾을 수 있어요</div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'popular' && (
              <>
                {popularHashtags.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-600 font-medium mb-4">
                      지금 가장 인기있는 해시태그들이에요
                    </div>
                    {popularHashtags.map((hashtag, index) => renderHashtagItem(hashtag, index))}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl w-fit mx-auto mb-4">
                      <Star className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="text-gray-900 font-semibold mb-2">인기 해시태그가 없습니다</div>
                    <div className="text-gray-500 text-sm">첫 번째 해시태그를 만들어보세요!</div>
                  </div>
                )}
              </>
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