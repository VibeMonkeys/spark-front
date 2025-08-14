import { api } from './base';
import { 
  ApiResponse, 
  PagedResponse, 
  Reward, 
  UserReward, 
  RewardsPageResponse 
} from './types';

export interface UserPointsResponse {
  current: number;
  total: number;
  thisMonth: number;
  spent: number;
  thisMonthSpent: number;
}

export interface RewardStatistics {
  totalExchanged: number;
  totalPointsSpent: number;
  thisMonthExchanged: number;
  thisMonthPointsSpent: number;
  favoriteCategory: string;
  mostUsedBrand: string;
}

export const rewardApi = {
  // 리워드 페이지 전체 데이터 조회
  getRewardsPage: async (userId: string): Promise<RewardsPageResponse> => {
    const response = await api.get<ApiResponse<RewardsPageResponse>>(`/rewards/page?userId=${userId}`);
    return response.data;
  },

  // 사용 가능한 리워드 조회
  getAvailableRewards: async (
    userId: string,
    category?: string,
    maxPoints?: number,
    page: number = 0,
    size: number = 20
  ): Promise<PagedResponse<Reward>> => {
    const params = new URLSearchParams({
      userId,
      page: page.toString(),
      size: size.toString(),
    });
    if (category) params.append('category', category);
    if (maxPoints) params.append('maxPoints', maxPoints.toString());
    
    const response = await api.get<ApiResponse<PagedResponse<Reward>>>(`/rewards?${params}`);
    return response.data;
  },

  // 리워드 상세 조회
  getReward: async (rewardId: string): Promise<Reward> => {
    const response = await api.get<ApiResponse<Reward>>(`/rewards/${rewardId}`);
    return response.data;
  },

  // 리워드 교환
  exchangeReward: async (rewardId: string, userId: string): Promise<UserReward> => {
    const response = await api.post<ApiResponse<UserReward>>(`/rewards/${rewardId}/exchange?userId=${userId}`);
    return response.data;
  },

  // 사용자 리워드 내역 조회
  getUserRewards: async (
    userId: string,
    status?: string,
    page: number = 0,
    size: number = 20
  ): Promise<PagedResponse<UserReward>> => {
    const params = new URLSearchParams({
      userId,
      page: page.toString(),
      size: size.toString(),
    });
    if (status) params.append('status', status);
    
    const response = await api.get<ApiResponse<PagedResponse<UserReward>>>(`/rewards/my-rewards?${params}`);
    return response.data;
  },

  // 리워드 사용
  useReward: async (userRewardId: string, userId: string): Promise<UserReward> => {
    const response = await api.post<ApiResponse<UserReward>>(`/rewards/my-rewards/${userRewardId}/use?userId=${userId}`);
    return response.data;
  },

  // 사용자 포인트 정보 조회
  getUserPoints: async (userId: string): Promise<UserPointsResponse> => {
    const response = await api.get<ApiResponse<UserPointsResponse>>(`/rewards/points?userId=${userId}`);
    return response.data;
  },

  // 인기 리워드 조회
  getPopularRewards: async (limit: number = 10): Promise<Reward[]> => {
    const response = await api.get<ApiResponse<Reward[]>>(`/rewards/popular?limit=${limit}`);
    return response.data;
  },

  // 카테고리별 리워드 조회
  getRewardsByCategory: async (category: string): Promise<Reward[]> => {
    const response = await api.get<ApiResponse<Reward[]>>(`/rewards/category/${category}`);
    return response.data;
  },

  // 만료 임박 리워드 조회
  getExpiringRewards: async (userId: string, withinDays: number = 7): Promise<UserReward[]> => {
    const response = await api.get<ApiResponse<UserReward[]>>(
      `/rewards/expiring?userId=${userId}&withinDays=${withinDays}`
    );
    return response.data;
  },

  // 리워드 통계 조회
  getRewardStatistics: async (userId: string): Promise<RewardStatistics> => {
    const response = await api.get<ApiResponse<RewardStatistics>>(`/rewards/statistics?userId=${userId}`);
    return response.data;
  },
};