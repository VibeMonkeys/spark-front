import { api } from './base';

// 레벨 정보 타입 정의
export interface LevelInfo {
  level: number;
  level_title: string;
  level_title_display: string;
  required_points: number;
  next_level_points: number | null;
  description: string;
  benefits: string[];
  icon: string;
  color: string;
  badge: string;
}

export interface UserLevelProgress {
  current_level: number;
  level_title: string;
  level_title_display: string;
  current_points: number;
  total_points: number;
  points_to_next_level: number;
  level_progress_percentage: number;
  next_level_points: number | null;
  icon: string;
  color: string;
  badge: string;
}

export interface LevelTitleGroup {
  title: string;
  display_name: string;
  description: string;
  level_range: string;
  color: string;
  icon: string;
  levels: LevelInfo[];
}

export interface LevelSystemResponse {
  user_progress: UserLevelProgress;
  all_levels: LevelInfo[];
  level_titles: LevelTitleGroup[];
}

export const levelApi = {
  /**
   * 전체 레벨 시스템 조회
   */
  getLevelSystem: async (userId: number): Promise<LevelSystemResponse> => {
    const response = await api.get(`/levels/system?user_id=${userId}`);
    return response.data.data;
  },

  /**
   * 사용자 레벨 진행 상황 조회
   */
  getUserLevelProgress: async (userId: number): Promise<UserLevelProgress> => {
    try {
      const response = await api.get(`/levels/progress?user_id=${userId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // 기본값 반환
        return {
          current_level: 1,
          level_title: 'EXPLORER',
          level_title_display: '탐험가',
          current_points: 0,
          total_points: 0,
          points_to_next_level: 100,
          level_progress_percentage: 0,
          next_level_points: 100,
          icon: '🗺️',
          color: '#10B981',
          badge: '🏃‍♂️'
        };
      }
    } catch (error) {
      console.error('Failed to fetch level progress:', error);
      // 기본값 반환
      return {
        current_level: 1,
        level_title: 'EXPLORER',
        level_title_display: '탐험가',
        current_points: 0,
        total_points: 0,
        points_to_next_level: 100,
        level_progress_percentage: 0,
        next_level_points: 100,
        icon: '🗺️',
        color: '#10B981',
        badge: '🏃‍♂️'
      };
    }
  },

  /**
   * 특정 레벨 정보 조회
   */
  getLevelInfo: async (level: number): Promise<LevelInfo> => {
    const response = await api.get(`/levels/${level}`);
    return response.data.data;
  },

  /**
   * 모든 레벨 정보 조회
   */
  getAllLevels: async (): Promise<LevelInfo[]> => {
    const response = await api.get('/levels/all');
    return response.data.data;
  }
};