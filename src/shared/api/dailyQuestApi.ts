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
    const response = await api.post(`/daily-quests/complete`, { 
      userId: userId, 
      questType: request.questId === 5 ? 'MAKE_BED' : 
                 request.questId === 6 ? 'TAKE_SHOWER' :
                 request.questId === 7 ? 'CLEAN_HOUSE' : 'GRATITUDE_JOURNAL'
    });
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
    const response = await api.get(`/daily-quests/date/${date}?userId=${userId}`);
    return response.data;
  },

  /**
   * 일일 퀘스트 주간 요약
   * - 지난 7일간의 완료율
   * - 주간 성과 통계
   * - 트렌드 분석
   */
  getWeeklySummary: async (userId: number): Promise<ApiResponse<{
    week: string;
    totalQuests: number;
    completionRate: string;
    streak: number;
    perfectDays: number;
    totalPoints: number;
    avgDailyCompletion: string;
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
    month: string;
    totalQuests: number;
    completionRate: string;
    perfectDays: number;
    totalPoints: number;
    activeDays: number;
    bestStreak: number;
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
    // 리더보드 데이터를 모의 데이터로 제공 (백엔드 엔드포인트가 아직 없음)
    return {
      success: true,
      data: {
        period,
        leaderboard: Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
          rank: i + 1,
          userId: 1000 + i,
          userName: `사용자${i + 1}`,
          avatarUrl: `https://example.com/avatar${i + 1}.jpg`,
          level: Math.floor(Math.random() * 10) + 1,
          completionRate: Math.floor(Math.random() * 40) + 60,
          perfectDays: Math.floor(Math.random() * 15),
          totalPoints: Math.floor(Math.random() * 1000) + 500,
          currentStreak: Math.floor(Math.random() * 10)
        })),
        userRank: {
          rank: Math.floor(Math.random() * 50) + 1,
          totalParticipants: 100,
          percentile: Math.floor(Math.random() * 80) + 10
        }
      },
      message: 'Leaderboard retrieved',
      timestamp: new Date().toISOString()
    };
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
    // 알림 설정 데이터를 모의 데이터로 제공 (백엔드 엔드포인트가 아직 없음)
    return {
      success: true,
      data: {
        morningReminder: {
          enabled: true,
          time: "09:00"
        },
        eveningCheck: {
          enabled: true,
          time: "18:00"
        },
        lastChanceAlert: {
          enabled: false,
          time: "23:50"
        }
      },
      message: 'Notification settings retrieved',
      timestamp: new Date().toISOString()
    };
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
    // 알림 설정 업데이트를 모의 응답으로 제공 (백엔드 엔드포인트가 아직 없음)
    return {
      success: true,
      data: { message: '알림 설정이 업데이트되었습니다.' },
      message: 'Notification settings updated',
      timestamp: new Date().toISOString()
    };
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
    // 격려 메시지를 모의 데이터로 제공 (백엔드 엔드포인트가 아직 없음)
    const messages = [
      { message: "오늘도 힘찬 하루 시작해봐요!", emoji: "🌅", type: 'encouragement' as const },
      { message: "벌써 절반 완료! 잘하고 있어요!", emoji: "🎉", type: 'celebration' as const },
      { message: "퀘스트를 완료하고 성장해보세요!", emoji: "🚀", type: 'reminder' as const },
      { message: "대단해요! 연속 달성 중이에요!", emoji: "🔥", type: 'achievement' as const }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return {
      success: true,
      data: {
        message: randomMessage.message,
        messageType: randomMessage.type,
        emoji: randomMessage.emoji,
        additionalInfo: {
          streakCount: Math.floor(Math.random() * 10),
          completionRate: Math.floor(Math.random() * 100),
          specialReward: "포인트 보너스"
        }
      },
      message: 'Motivational message retrieved',
      timestamp: new Date().toISOString()
    };
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