import { api } from './base';
import { 
  ApiResponse, 
  PagedResponse, 
  Mission, 
  MissionDetailResponse, 
  CategoryStatResponse,
  MissionCompletionResponse,
  TodaysMissionsResponse,
  DailyMissionLimit
} from './types';

export const missionApi = {
  // 오늘의 미션 조회 (제한 정보 포함)
  getTodaysMissions: async (userId: string): Promise<TodaysMissionsResponse> => {
    const response = await api.get<ApiResponse<TodaysMissionsResponse>>(`/missions/today?userId=${userId}`);
    return response.data.data;
  },

  // 일일 미션 시작 제한 정보 조회
  getDailyMissionLimit: async (userId: string): Promise<DailyMissionLimit> => {
    const response = await api.get<ApiResponse<DailyMissionLimit>>(`/missions/daily-limit?userId=${userId}`);
    return response.data.data;
  },

  // 미션 상세 조회
  getMissionDetail: async (missionId: string): Promise<MissionDetailResponse> => {
    try {
      const response = await api.get<ApiResponse<MissionDetailResponse>>(`/missions/${missionId}`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Mission not found');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch mission detail:', error);
      // React Query에서 undefined 반환을 방지하기 위해 에러를 던집니다
      throw error;
    }
  },

  // 미션 시작
  startMission: async (missionId: string, userId: string): Promise<Mission> => {
    const response = await api.post<ApiResponse<Mission>>(`/missions/${missionId}/start?userId=${userId}`);
    return response.data.data;
  },

  // 미션 진행도 업데이트
  updateMissionProgress: async (missionId: string, userId: string, progress: number): Promise<Mission> => {
    const response = await api.put<ApiResponse<Mission>>(
      `/missions/${missionId}/progress?userId=${userId}&progress=${progress}`
    );
    return response.data.data;
  },

  // 미션 완료
  completeMission: async (missionId: string, userId: string): Promise<MissionCompletionResponse> => {
    const response = await api.post<ApiResponse<MissionCompletionResponse>>(`/missions/${missionId}/complete?userId=${userId}`);
    return response.data.data;
  },

  // 진행 중인 미션 조회
  getOngoingMissions: async (userId: string): Promise<Mission[]> => {
    const response = await api.get<ApiResponse<Mission[]>>(`/missions/ongoing?userId=${userId}`);
    return response.data.data;
  },

  // 완료된 미션 조회 (페이징)
  getCompletedMissions: async (
    userId: string, 
    page: number = 0, 
    size: number = 20, 
    category?: string
  ): Promise<PagedResponse<Mission>> => {
    const params = new URLSearchParams({
      userId,
      page: page.toString(),
      size: size.toString(),
    });
    if (category) {
      params.append('category', category);
    }
    const response = await api.get<ApiResponse<PagedResponse<Mission>>>(`/missions/completed?${params}`);
    return response.data.data;
  },

  // 인기 미션 조회
  getPopularMissions: async (limit: number = 10): Promise<Mission[]> => {
    const response = await api.get<ApiResponse<Mission[]>>(`/missions/popular?limit=${limit}`);
    return response.data.data;
  },

  // 미션 리롤 (새로운 미션으로 교체)
  rerollMissions: async (userId: string): Promise<Mission[]> => {
    const response = await api.post<ApiResponse<Mission[]>>(`/missions/reroll?userId=${userId}`);
    return response.data.data;
  },

  // 카테고리별 통계 조회
  getCategoryStatistics: async (userId: string): Promise<CategoryStatResponse[]> => {
    const response = await api.get<ApiResponse<CategoryStatResponse[]>>(`/missions/category-stats?userId=${userId}`);
    return response.data.data;
  },

  // 일일 미션 생성 (관리자용 또는 시스템 호출)
  generateDailyMissions: async (userId: string): Promise<Mission[]> => {
    const response = await api.post<ApiResponse<Mission[]>>(`/missions/generate-daily?userId=${userId}`);
    return response.data.data;
  },

  // 미션 포기
  abandonMission: async (missionId: string, userId: string): Promise<Mission> => {
    const response = await api.post<ApiResponse<Mission>>(`/missions/${missionId}/abandon?userId=${userId}`);
    return response.data.data;
  },

  // 미션 인증 및 완료 (스토리 자동 생성 포함)
  verifyMission: async (missionId: string, verificationData: {
    story: string;
    images: string[];
    location: string;
    isPublic: boolean;
    userTags: string[];
  }): Promise<{
    story_id: string;
    points_earned: number;
    streak_count: number;
    level_up?: boolean;
    new_level?: number;
    stats_increased?: {
      category: string;
      pointsGained: number;
      allocatablePointsGained: number;
      totalStats: number;
    };
  }> => {
    const response = await api.post<ApiResponse<{
      story_id: string;
      points_earned: number;
      streak_count: number;
      level_up?: boolean;
      new_level?: number;
      stats_increased?: {
        category: string;
        pointsGained: number;
        allocatablePointsGained: number;
        totalStats: number;
      };
    }>>(`/missions/${missionId}/verify`, {
      mission_id: missionId,
      story: verificationData.story,
      images: verificationData.images,
      location: verificationData.location,
      is_public: verificationData.isPublic,
      user_tags: verificationData.userTags
    });
    return response.data.data;
  },
};