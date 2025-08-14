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
  getLevelSystem: async (userId: string): Promise<LevelSystemResponse> => {
    const response = await api.get(`/levels/system?user_id=${userId}`);
    return response.data;
  },

  /**
   * 사용자 레벨 진행 상황 조회
   */
  getUserLevelProgress: async (userId: string): Promise<UserLevelProgress> => {
    const response = await api.get(`/levels/progress?user_id=${userId}`);
    return response.data;
  },

  /**
   * 특정 레벨 정보 조회
   */
  getLevelInfo: async (level: number): Promise<LevelInfo> => {
    const response = await api.get(`/levels/${level}`);
    return response.data;
  },

  /**
   * 모든 레벨 정보 조회
   */
  getAllLevels: async (): Promise<LevelInfo[]> => {
    const response = await api.get('/levels/all');
    return response.data;
  }
};