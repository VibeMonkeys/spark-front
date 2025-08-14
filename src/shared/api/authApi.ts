import { api } from './base';
import { ApiResponse } from './types';

// 인증 관련 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
    level: number;
    level_title: string;
    current_points: number;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    completed_missions: number;
    total_days: number;
    join_date: string;
    preferences: Record<string, boolean>;
    statistics: {
      category_stats: Array<{
        name: string;
        completed: number;
        total: number;
        percentage: number;
        color: string;
      }>;
      this_month_points: number;
      this_month_missions: number;
      average_rating: number;
    };
  };
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = {
  // 로그인
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', request);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '로그인에 실패했습니다.');
    }
  },

  // 회원가입
  signup: async (request: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', request);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '회원가입에 실패했습니다.');
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // 토큰 갱신
  refreshToken: async (request: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', request);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || '토큰 갱신에 실패했습니다.');
    }
  }
};