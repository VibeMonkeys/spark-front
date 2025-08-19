import { api } from './base';
import type { 
  ApiResponse, 
  DailyQuestResponse, 
  CompleteDailyQuestResponse, 
  CompleteDailyQuestRequest,
  DailyQuestStats 
} from './types';

/**
 * 일일 퀘스트 API 서비스
 * "삶을 게임처럼 즐겨라!" - 게임화된 일상 관리 시스템
 */
export const dailyQuestApi = {
  /**
   * 오늘의 일일 퀘스트 개요 조회
   * - 4개의 기본 퀘스트 (이불 개기, 샤워하기, 집 청소하기, 감사 일기)
   * - 사용자 진행 상황
   * - 완료율 기반 특수 보상 정보
   */
  getTodaysQuests: async (userId: number): Promise<ApiResponse<DailyQuestResponse>> => {
    const response = await api.get(`/daily-quests/today?userId=${userId}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 완료
   * - 퀘스트 완료 처리
   * - 포인트 및 스탯 보상 지급
   * - 진행률 기반 특수 보상 확인
   * - 연속 완료 스트릭 업데이트
   */
  completeQuest: async (
    userId: number, 
    request: CompleteDailyQuestRequest
  ): Promise<ApiResponse<CompleteDailyQuestResponse>> => {
    const response = await api.post(`/daily-quests/complete?userId=${userId}`, request);
    return response.data;
  },

  /**
   * 일일 퀘스트 통계 조회
   * - 전체 참여 일수
   * - 완료율 통계
   * - 스트릭 정보
   * - 특수 보상 획득 현황
   */
  getStats: async (userId: number): Promise<ApiResponse<DailyQuestStats>> => {
    const response = await api.get(`/daily-quests/stats?userId=${userId}`);
    return response.data;
  },

  /**
   * 특정 날짜의 일일 퀘스트 조회
   * - 과거 날짜의 퀘스트 완료 기록 조회
   * - 히스토리 및 분석용
   */
  getQuestsByDate: async (
    userId: number, 
    date: string
  ): Promise<ApiResponse<DailyQuestResponse>> => {
    const response = await api.get(`/daily-quests/history?userId=${userId}&date=${date}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 주간 요약
   * - 지난 7일간의 완료율
   * - 주간 성과 통계
   * - 트렌드 분석
   */
  getWeeklySummary: async (userId: number): Promise<ApiResponse<{
    weekStartDate: string;
    weekEndDate: string;
    totalQuests: number;
    completedQuests: number;
    completionRate: number;
    perfectDays: number;
    totalPointsEarned: number;
    specialRewardsEarned: number;
    averageDailyCompletion: number;
    streakProgress: {
      currentStreak: number;
      longestStreakThisWeek: number;
    };
    dailyBreakdown: Array<{
      date: string;
      completedQuests: number;
      totalQuests: number;
      completionPercentage: number;
      isPerfectDay: boolean;
    }>;
  }>> => {
    const response = await api.get(`/daily-quests/weekly-summary?userId=${userId}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 월간 요약
   * - 이번 달 전체 성과
   * - 월간 트렌드 및 개선 사항
   * - 성과 비교 (이전 달 대비)
   */
  getMonthlySummary: async (userId: number): Promise<ApiResponse<{
    monthYear: string;
    totalQuests: number;
    completedQuests: number;
    completionRate: number;
    perfectDays: number;
    totalPointsEarned: number;
    specialRewardsEarned: number;
    averageDailyCompletion: number;
    streakProgress: {
      longestStreakThisMonth: number;
      currentStreak: number;
    };
    weeklyBreakdown: Array<{
      weekNumber: number;
      weekStartDate: string;
      weekEndDate: string;
      completionRate: number;
      perfectDays: number;
    }>;
    improvementTrend: '📈 큰 향상' | '📊 향상 중' | '🔥 조금씩 향상' | '➡️ 유지' | '📉 개선 필요';
    comparisonWithPreviousMonth: {
      completionRateDiff: number;
      perfectDaysDiff: number;
      pointsDiff: number;
    };
  }>> => {
    const response = await api.get(`/daily-quests/monthly-summary?userId=${userId}`);
    return response.data;
  },

  /**
   * 리더보드 순위 조회
   * - 일일 퀘스트 완료율 기준 랭킹
   * - 주간/월간 리더보드
   * - 사용자 순위 정보
   */
  getLeaderboard: async (
    period: 'daily' | 'weekly' | 'monthly' = 'weekly',
    limit: number = 50
  ): Promise<ApiResponse<{
    period: string;
    leaderboard: Array<{
      rank: number;
      userId: number;
      userName: string;
      avatarUrl?: string;
      level?: number;
      completionRate: number;
      perfectDays: number;
      totalPoints: number;
      currentStreak: number;
    }>;
    userRank?: {
      rank: number;
      totalParticipants: number;
      percentile: number;
    };
  }>> => {
    const response = await api.get(`/daily-quests/leaderboard?period=${period}&limit=${limit}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 알림 설정 조회
   */
  getNotificationSettings: async (userId: number): Promise<ApiResponse<{
    morningReminder: {
      enabled: boolean;
      time: string; // "09:00" 형식
    };
    eveningCheck: {
      enabled: boolean;
      time: string; // "18:00" 형식
    };
    lastChanceAlert: {
      enabled: boolean;
      time: string; // "23:50" 형식
    };
  }>> => {
    const response = await api.get(`/daily-quests/notification-settings?userId=${userId}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 알림 설정 업데이트
   */
  updateNotificationSettings: async (
    userId: number, 
    settings: {
      morningReminder?: { enabled: boolean; time: string; };
      eveningCheck?: { enabled: boolean; time: string; };
      lastChanceAlert?: { enabled: boolean; time: string; };
    }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.put(`/daily-quests/notification-settings?userId=${userId}`, settings);
    return response.data;
  },

  /**
   * 사용자 맞춤 격려 메시지 조회
   * - 현재 진행률에 따른 개인화된 메시지
   * - 연속 달성 일수에 따른 축하 메시지
   */
  getMotivationalMessage: async (userId: number): Promise<ApiResponse<{
    message: string;
    messageType: 'encouragement' | 'celebration' | 'reminder' | 'achievement';
    emoji: string;
    additionalInfo?: {
      streakCount?: number;
      completionRate?: number;
      specialReward?: string;
    };
  }>> => {
    const response = await api.get(`/daily-quests/motivational-message?userId=${userId}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 초기화
   * - 사용자의 오늘 퀘스트가 없을 때 4개 기본 퀘스트 생성
   * - 이불 개기, 샤워하기, 집 청소하기, 감사 일기 작성
   */
  initializeDailyQuests: async (userId: number): Promise<ApiResponse<DailyQuestResponse>> => {
    const response = await api.post(`/daily-quests/${userId}/initialize`);
    return response.data;
  }
};