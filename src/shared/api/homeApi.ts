import { api } from './base';
import { ApiResponse, HomePageResponse, UserSummaryResponse, Mission, StoryFeedItem } from './types';

export const homeApi = {
  // 홈페이지 전체 데이터 조회
  getHomePageData: async (userId: number): Promise<HomePageResponse> => {
    const response = await api.get<ApiResponse<HomePageResponse>>(`/home?userId=${userId}`);
    return response.data.data;
  },

  // 사용자 요약 정보 조회
  getUserSummary: async (userId: number): Promise<UserSummaryResponse> => {
    const response = await api.get<ApiResponse<UserSummaryResponse>>(`/home/user-summary?userId=${userId}`);
    return response.data.data;
  },

  // 오늘의 추천 미션 조회
  getTodaysMissions: async (userId: number): Promise<Mission[]> => {
    const response = await api.get<ApiResponse<Mission[]>>(`/home/todays-missions?userId=${userId}`);
    return response.data.data;
  },

  // 최근 스토리 조회 (홈페이지용)
  getRecentStories: async (limit: number = 10, userId?: number): Promise<StoryFeedItem[]> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (userId) {
      params.append('userId', userId.toString());
    }
    const response = await api.get<ApiResponse<StoryFeedItem[]>>(`/home/recent-stories?${params}`);
    return response.data.data;
  },
};