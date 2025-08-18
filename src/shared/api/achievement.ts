import { api } from './base';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: {
    name: string;
    color: string;
    order: number;
  };
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementCount {
  unlockedCount: number;
  totalCount: number;
}

export const achievementApi = {
  /**
   * 사용자의 모든 업적 조회
   */
  getUserAchievements: async (): Promise<Achievement[]> => {
    try {
      const response = await api.get('/achievements');
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // 기본값 반환
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch user achievements:', error);
      // 기본값 반환
      return [];
    }
  },

  /**
   * 사용자의 달성한 업적 개수 조회
   */
  getAchievementCount: async (): Promise<AchievementCount> => {
    try {
      const response = await api.get('/achievements/count');
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // 기본값 반환
        return {
          unlockedCount: 0,
          totalCount: 0
        };
      }
    } catch (error) {
      console.error('Failed to fetch achievement count:', error);
      // 기본값 반환
      return {
        unlockedCount: 0,
        totalCount: 0
      };
    }
  }
};