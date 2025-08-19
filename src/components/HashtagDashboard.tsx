import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HashtagWidget } from './HashtagWidget';
import { HashtagSearchModal } from './HashtagSearchModal';
import { 
  Hash, 
  TrendingUp, 
  Star, 
  BarChart3, 
  PieChart, 
  Search,
  Calendar,
  Users,
  Flame
} from 'lucide-react';

interface HashtagStatsSummary {
  totalHashtags: number;
  totalDailyUsage: number;
  averageTrendScore: number;
  topCategories: CategoryUsage[];
  newHashtags: number;
  trendingCount: number;
  popularCount: number;
}

interface CategoryUsage {
  category: string;
  displayName: string;
  count: number;
  percentage: number;
  color: string;
}

interface HashtagDashboardProps {
  onHashtagClick?: (hashtag: string) => void;
  className?: string;
}

export const HashtagDashboard: React.FC<HashtagDashboardProps> = ({
  onHashtagClick,
  className = ''
}) => {
  const [summary, setSummary] = useState<HashtagStatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/hashtags/stats/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.data);
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedPeriod]);

  const handleHashtagSelect = (hashtag: string) => {
    onHashtagClick?.(hashtag);
    setIsSearchModalOpen(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPeriodDisplayName = () => {
    switch (selectedPeriod) {
      case 'today': return '오늘';
      case 'week': return '이번 주';
      case 'month': return '이번 달';
      default: return '오늘';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">해시태그 데이터를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">해시태그 대시보드</h2>
          <p className="text-gray-600">{getPeriodDisplayName()} 해시태그 활동 현황</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { key: 'today', label: '오늘' },
              { key: 'week', label: '주간' },
              { key: 'month', label: '월간' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as typeof selectedPeriod)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedPeriod === period.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <Button onClick={() => setIsSearchModalOpen(true)} className="gap-2">
            <Search className="w-4 h-4" />
            해시태그 검색
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">전체 해시태그</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalHashtags)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">일일 사용량</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalDailyUsage)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">트렌딩 해시태그</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.trendingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">인기 해시태그</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.popularCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            카테고리별 분포
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.topCategories.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{category.displayName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}개
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtag Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HashtagWidget
          type="trending"
          limit={8}
          onHashtagClick={onHashtagClick}
        />
        
        <HashtagWidget
          type="popular"
          limit={8}
          onHashtagClick={onHashtagClick}
        />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {summary.averageTrendScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">평균 트렌드 점수</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {summary.newHashtags}
            </div>
            <div className="text-sm text-gray-600">오늘 새로운 해시태그</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(summary.totalDailyUsage / summary.totalHashtags || 0)}
            </div>
            <div className="text-sm text-gray-600">해시태그당 평균 사용량</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Modal */}
      <HashtagSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        onHashtagSelect={handleHashtagSelect}
      />
    </div>
  );
};