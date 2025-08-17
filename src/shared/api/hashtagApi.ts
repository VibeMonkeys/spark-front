import { api } from './base';
import { ApiResponse } from './types';

// 해시태그 관련 타입 정의
export interface HashtagStats {
  id: string;
  hashtag: string;
  category: 'FOOD' | 'HEALTH' | 'SOCIAL' | 'ADVENTURE' | 'CREATIVE' | 'OTHER';
  categoryDisplayName: string;
  categoryColor: string;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  totalCount: number;
  trendScore: number;
  lifecycle: 'NEW' | 'EMERGING' | 'PEAK' | 'DECLINING' | 'DORMANT';
  lifecycleDisplayName: string;
  lastUsedAt: string;
  date: string;
  isPopular: boolean;
  isTrending: boolean;
  relatedStoryCount?: number;
  growthRate?: number;
  recommendationScore?: number;
}

export interface HashtagSearchResponse {
  hashtags: HashtagStats[];
  totalCount: number;
  hasMore: boolean;
  searchQuery: string;
  suggestions: string[];
}

export interface HashtagSummary {
  totalHashtags: number;
  todayNewHashtags: number;
  trendingHashtags: number;
  topCategories: string[];
  averageTrendScore: number;
}

export interface AutocompleteResult {
  hashtag: string;
  count: number;
  category: string;
}

// 해시태그 API 함수들
export const hashtagApi = {
  // 인기 해시태그 조회
  getPopularHashtags: async (limit: number = 10): Promise<ApiResponse<HashtagStats[]>> => {
    const response = await api.get(`/hashtags/popular?limit=${limit}`);
    return response.data;
  },

  // 트렌딩 해시태그 조회
  getTrendingHashtags: async (limit: number = 10): Promise<ApiResponse<HashtagStats[]>> => {
    const response = await api.get(`/hashtags/trending?limit=${limit}`);
    return response.data;
  },

  // 해시태그 검색
  searchHashtags: async (query: string, limit: number = 10): Promise<ApiResponse<HashtagSearchResponse>> => {
    const response = await api.get(`/hashtags/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  // 해시태그 자동완성
  getAutocomplete: async (prefix: string, limit: number = 5): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/hashtags/autocomplete?prefix=${encodeURIComponent(prefix)}&limit=${limit}`);
    return response.data;
  },

  // 카테고리별 해시태그 조회
  getHashtagsByCategory: async (category: string, limit: number = 10): Promise<ApiResponse<HashtagStats[]>> => {
    const response = await api.get(`/hashtags/category/${category}?limit=${limit}`);
    return response.data;
  },

  // 해시태그 통계 요약
  getStatsSummary: async (): Promise<ApiResponse<HashtagSummary>> => {
    const response = await api.get('/hashtags/stats/summary');
    return response.data;
  },

  // 특정 해시태그 상세 정보
  getHashtagDetails: async (hashtag: string): Promise<ApiResponse<HashtagStats>> => {
    const response = await api.get(`/hashtags/${encodeURIComponent(hashtag)}`);
    return response.data;
  }
};