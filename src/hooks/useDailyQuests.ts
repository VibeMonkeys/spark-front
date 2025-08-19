import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyQuestApi } from '../shared/api';
import { useAuth } from '../contexts/AuthContext';
import type { 
  DailyQuestResponse, 
  CompleteDailyQuestRequest, 
  CompleteDailyQuestResponse,
  DailyQuestStats 
} from '../shared/api/types';

/**
 * 일일 퀘스트 상태 관리 훅
 * "삶을 게임처럼 즐겨라!" - React Query를 활용한 서버 상태 관리
 */
export function useDailyQuests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 오늘의 일일 퀘스트 조회
  const {
    data: todaysQuests,
    isLoading: isLoadingQuests,
    error: questsError,
    refetch: refetchQuests
  } = useQuery({
    queryKey: ['dailyQuests', 'today', user?.id],
    queryFn: () => dailyQuestApi.getTodaysQuests(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
  });

  // 일일 퀘스트 통계 조회
  const {
    data: questStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dailyQuests', 'stats', user?.id],
    queryFn: () => dailyQuestApi.getStats(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000,    // 30분
  });

  // 주간 요약 조회
  const {
    data: weeklySummary,
    isLoading: isLoadingWeekly,
    error: weeklyError,
    refetch: refetchWeekly
  } = useQuery({
    queryKey: ['dailyQuests', 'weekly', user?.id],
    queryFn: () => dailyQuestApi.getWeeklySummary(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000,    // 1시간
  });

  // 월간 요약 조회
  const {
    data: monthlySummary,
    isLoading: isLoadingMonthly,
    error: monthlyError,
    refetch: refetchMonthly
  } = useQuery({
    queryKey: ['dailyQuests', 'monthly', user?.id],
    queryFn: () => dailyQuestApi.getMonthlySummary(user!.id),
    enabled: !!user?.id,
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  });

  // 리더보드 조회
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard
  } = useQuery({
    queryKey: ['dailyQuests', 'leaderboard', 'weekly'],
    queryFn: () => dailyQuestApi.getLeaderboard('weekly', 50),
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000,    // 30분
  });

  // 격려 메시지 조회
  const {
    data: motivationalMessage,
    refetch: refetchMessage
  } = useQuery({
    queryKey: ['dailyQuests', 'message', user?.id],
    queryFn: () => dailyQuestApi.getMotivationalMessage(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000,   // 15분
  });

  // 퀘스트 완료 뮤테이션
  const completeQuestMutation = useMutation({
    mutationFn: (request: CompleteDailyQuestRequest) => 
      dailyQuestApi.completeQuest(user!.id, request),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'today', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'stats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'weekly', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'monthly', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'message', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'leaderboard'] });
      
      // 사용자 정보도 업데이트 (포인트, 레벨 등)
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['userStats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['home', user?.id] });
    },
    onError: (error) => {
      console.error('❌ [useDailyQuests] Quest completion failed:', error);
    }
  });

  // 알림 설정 조회
  const {
    data: notificationSettings,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ['dailyQuests', 'notifications', user?.id],
    queryFn: () => dailyQuestApi.getNotificationSettings(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000,    // 1시간
  });

  // 알림 설정 업데이트 뮤테이션
  const updateNotificationsMutation = useMutation({
    mutationFn: (settings: Parameters<typeof dailyQuestApi.updateNotificationSettings>[1]) =>
      dailyQuestApi.updateNotificationSettings(user!.id, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'notifications', user?.id] });
    }
  });

  // 일일 퀘스트 초기화 뮤테이션
  const initializeDailyQuestsMutation = useMutation({
    mutationFn: () => dailyQuestApi.initializeDailyQuests(user!.id),
    onSuccess: () => {
      // 퀘스트 초기화 후 모든 관련 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'today', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'stats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests', 'message', user?.id] });
    },
    onError: (error) => {
      console.error('❌ [useDailyQuests] Quest initialization failed:', error);
    }
  });

  // 편의 함수들
  const completeQuest = (questId: number, note?: string) => {
    return completeQuestMutation.mutate({ questId, note });
  };

  const updateNotifications = (settings: Parameters<typeof dailyQuestApi.updateNotificationSettings>[1]) => {
    return updateNotificationsMutation.mutate(settings);
  };

  const initializeDailyQuests = () => {
    return initializeDailyQuestsMutation.mutate();
  };

  const refreshAllData = async () => {
    await Promise.allSettled([
      refetchQuests(),
      refetchStats(),
      refetchWeekly(),
      refetchMonthly(),
      refetchLeaderboard(),
      refetchMessage(),
      refetchNotifications()
    ]);
  };

  // 계산된 값들
  const questsData = todaysQuests?.data;
  const statsData = questStats?.data;
  const weeklyData = weeklySummary?.data;
  const monthlyData = monthlySummary?.data;
  const leaderboardData = leaderboard?.data;
  const messageData = motivationalMessage?.data;
  const notificationsData = notificationSettings?.data;

  // 현재 진행률 계산
  const currentProgress = questsData?.overview.summary.completionPercentage || 0;
  const completedQuests = questsData?.overview.summary.completedQuests || 0;
  const totalQuests = questsData?.overview.summary.totalQuests || 4;

  // 특수 보상 상태 확인
  const availableSpecialRewards = questsData?.overview.availableSpecialRewards || [];
  const hasUnlockedReward = availableSpecialRewards.some(reward => reward.isUnlocked);

  // 스트릭 정보
  const currentStreak = questsData?.overview.summary.currentStreak || 0;
  const longestStreak = questsData?.overview.summary.longestStreak || 0;

  // 로딩 상태
  const isLoading = isLoadingQuests || isLoadingStats;
  const isUpdating = completeQuestMutation.isPending || updateNotificationsMutation.isPending;

  // 에러 상태
  const hasError = questsError || statsError || weeklyError || monthlyError;

  return {
    // 데이터
    quests: questsData?.overview.quests || [],
    userProgress: questsData?.overview.userProgress || [],
    summary: questsData?.overview.summary,
    stats: statsData,
    weeklySummary: weeklyData,
    monthlySummary: monthlyData,
    leaderboard: leaderboardData,
    motivationalMessage: messageData,
    notificationSettings: notificationsData,
    availableSpecialRewards,

    // 계산된 값들
    currentProgress,
    completedQuests,
    totalQuests,
    hasUnlockedReward,
    currentStreak,
    longestStreak,

    // 상태
    isLoading,
    isUpdating,
    hasError,

    // 액션들
    completeQuest,
    updateNotifications,
    initializeDailyQuests,
    refreshAllData,

    // 개별 리페치 함수들
    refetchQuests,
    refetchStats,
    refetchWeekly,
    refetchMonthly,
    refetchLeaderboard,
    refetchMessage,
    refetchNotifications,

    // 뮤테이션 객체들 (상세한 상태가 필요한 경우)
    completeQuestMutation,
    updateNotificationsMutation,
    initializeDailyQuestsMutation
  };
}

/**
 * 특정 날짜의 일일 퀘스트 조회 훅
 */
export function useDailyQuestsByDate(date: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dailyQuests', 'date', date, user?.id],
    queryFn: () => dailyQuestApi.getQuestsByDate(user!.id, date),
    enabled: !!user?.id && !!date,
    staleTime: 60 * 60 * 1000, // 1시간 (과거 데이터는 변경되지 않음)
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  });
}

/**
 * 기간별 리더보드 조회 훅
 */
export function useDailyQuestLeaderboard(period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
  return useQuery({
    queryKey: ['dailyQuests', 'leaderboard', period],
    queryFn: () => dailyQuestApi.getLeaderboard(period, 50),
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000,    // 30분
  });
}