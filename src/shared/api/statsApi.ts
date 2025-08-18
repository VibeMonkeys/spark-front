import { api } from './base';
import { 
  ApiResponse, 
  UserStats, 
  StatsRankingItem, 
  UserRankingInfo,
  AllocateStatPointsRequest 
} from './types';

export const statsApi = {
  // 사용자 스탯 조회
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // React Query에서 undefined 반환을 방지하기 위해 에러를 던집니다
      throw error;
    }
  },

  // 스탯 초기화 (새 사용자용)
  initializeStats: (): Promise<ApiResponse<UserStats>> => {
    return api.post('/stats/initialize');
  },

  // 스탯 포인트 할당
  allocateStatPoints: (request: AllocateStatPointsRequest): Promise<ApiResponse<UserStats>> => {
    return api.post('/stats/allocate', request);
  },

  // 전체 스탯 랭킹 조회
  getTotalStatsRanking: (limit: number = 10): Promise<ApiResponse<StatsRankingItem[]>> => {
    return api.get(`/stats/ranking/total?limit=${limit}`);
  },

  // 특정 스탯 랭킹 조회
  getStatRanking: (statType: string, limit: number = 10): Promise<ApiResponse<StatsRankingItem[]>> => {
    return api.get(`/stats/ranking/${statType}?limit=${limit}`);
  },

  // 사용자 랭킹 정보 조회
  getUserRankingInfo: (): Promise<ApiResponse<UserRankingInfo>> => {
    return api.get('/stats/ranking/me');
  }
};