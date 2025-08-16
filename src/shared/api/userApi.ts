import { api } from './base';
import { ApiResponse, User, CreateUserRequest } from './types';

export interface UserStatisticsResponse {
  userId: number;
  thisMonthPoints: number;
  thisMonthMissions: number;
  totalDays: number;
  averageRating: number;
  totalRatings: number;
  categoryStats: Record<string, number>;
}

export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
}

export interface UpdatePreferencesRequest {
  preferences: Record<string, boolean>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AchievementResponse {
  id: number;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface RecentMissionResponse {
  id: number;
  title: string;
  category: string;
  completedAt: string;
  pointsEarned: number;
  imageUrl: string;
}

export interface ProfilePageResponse {
  user: User;
  statistics: UserStatisticsResponse;
  achievements: AchievementResponse[];
  recentMissions: RecentMissionResponse[];
}

export interface LeaderboardUserResponse {
  rank: number;
  userId: number;
  name: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  points: number;
  streak: number;
}

export const userApi = {
  // 사용자 생성 (회원가입)
  createUser: async (request: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', request);
    return response.data;
  },

  // 사용자 조회
  getUser: async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '사용자 조회에 실패했습니다.');
    }
  },

  // 프로필 페이지 데이터 조회
  getProfilePage: async (userId: number): Promise<ProfilePageResponse> => {
    const response = await api.get(`/users/${userId}/profile`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '프로필 데이터 조회에 실패했습니다.');
    }
  },

  // 프로필 업데이트
  updateProfile: async (userId: number, request: UpdateProfileRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}/profile`, request);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (userId: number, currentPassword: string, newPassword: string): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '비밀번호 변경에 실패했습니다.');
    }
  },

  // 선호도 업데이트
  updatePreferences: async (userId: number, request: UpdatePreferencesRequest): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}/preferences`, request);
    return response.data;
  },

  // 사용자 통계 조회
  getUserStatistics: async (userId: number): Promise<UserStatisticsResponse> => {
    const response = await api.get<ApiResponse<UserStatisticsResponse>>(`/users/${userId}/statistics`);
    return response.data;
  },

  // 리더보드 조회 (포인트 기준)
  getLeaderboard: async (limit: number = 10): Promise<LeaderboardUserResponse[]> => {
    const response = await api.get<ApiResponse<LeaderboardUserResponse[]>>(`/users/leaderboard?limit=${limit}`);
    return response.data;
  },

  // 연속 수행일 리더보드 조회
  getStreakLeaderboard: async (limit: number = 10): Promise<LeaderboardUserResponse[]> => {
    const response = await api.get<ApiResponse<LeaderboardUserResponse[]>>(`/users/streak-leaderboard?limit=${limit}`);
    return response.data;
  },
};