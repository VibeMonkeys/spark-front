import { api } from './base';
import { ApiResponse } from './types';

export interface UserPointsResponse {
  current: number;
  total: number;
  this_month: number;
}

export interface RewardResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  original_price: string;
  points: number;
  discount: string;
  image_url: string;
  expires: string;
  popular: boolean;
  is_premium: boolean;
}

export interface UserRewardResponse {
  id: string;
  title: string;
  brand: string;
  points: number;
  code: string;
  status: string;
  used_at: string;
  expires_at?: string;
}

export interface RewardsPageResponse {
  user_points: UserPointsResponse;
  available_rewards: RewardResponse[];
  reward_history: UserRewardResponse[];
}

export const rewardsApi = {
  // 리워드 페이지 전체 데이터 조회
  getRewardsPage: async (userId: string): Promise<RewardsPageResponse> => {
    try {
      const response = await api.get<ApiResponse<RewardsPageResponse>>(`/rewards/page?userId=${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch rewards page');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch rewards page:', error);
      throw error;
    }
  },

  // 사용자 포인트 정보 조회
  getUserPoints: async (userId: string): Promise<UserPointsResponse> => {
    try {
      const response = await api.get<ApiResponse<UserPointsResponse>>(`/rewards/points?userId=${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch user points');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user points:', error);
      throw error;
    }
  },

  // 사용 가능한 리워드 조회
  getAvailableRewards: async (
    userId: string,
    category?: string,
    maxPoints?: number,
    page: number = 0,
    size: number = 20
  ): Promise<RewardResponse[]> => {
    try {
      const params = new URLSearchParams({
        userId,
        page: page.toString(),
        size: size.toString()
      });
      
      if (category) params.append('category', category);
      if (maxPoints) params.append('maxPoints', maxPoints.toString());

      const response = await api.get<ApiResponse<{ data: RewardResponse[] }>>(`/rewards?${params}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch available rewards');
      }
      return response.data.data.data;
    } catch (error) {
      console.error('Failed to fetch available rewards:', error);
      throw error;
    }
  },

  // 리워드 교환
  exchangeReward: async (rewardId: string, userId: string): Promise<UserRewardResponse> => {
    try {
      const response = await api.post<ApiResponse<UserRewardResponse>>(`/rewards/${rewardId}/exchange?userId=${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to exchange reward');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to exchange reward:', error);
      throw error;
    }
  },

  // 사용자 리워드 내역 조회
  getUserRewards: async (
    userId: string,
    status?: string,
    page: number = 0,
    size: number = 20
  ): Promise<UserRewardResponse[]> => {
    try {
      const params = new URLSearchParams({
        userId,
        page: page.toString(),
        size: size.toString()
      });
      
      if (status) params.append('status', status);

      const response = await api.get<ApiResponse<{ data: UserRewardResponse[] }>>(`/rewards/my-rewards?${params}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch user rewards');
      }
      return response.data.data.data;
    } catch (error) {
      console.error('Failed to fetch user rewards:', error);
      throw error;
    }
  },

  // 인기 리워드 조회
  getPopularRewards: async (limit: number = 10): Promise<RewardResponse[]> => {
    try {
      const response = await api.get<ApiResponse<RewardResponse[]>>(`/rewards/popular?limit=${limit}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch popular rewards');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch popular rewards:', error);
      throw error;
    }
  },

  // 카테고리별 리워드 조회
  getRewardsByCategory: async (category: string): Promise<RewardResponse[]> => {
    try {
      const response = await api.get<ApiResponse<RewardResponse[]>>(`/rewards/category/${category}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to fetch rewards by category');
      }
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch rewards by category:', error);
      throw error;
    }
  }
};