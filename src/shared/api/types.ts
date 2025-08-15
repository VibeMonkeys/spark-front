// 백엔드 API 응답 구조와 일치하는 타입 정의

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  page_info: PageInfo;
}

// 공통 타입들
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  currentPoints: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  completedMissions: number;
  totalDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  userId?: string;
  title: string;
  description: string;
  detailed_description?: string;
  category: string;
  category_color?: string;
  difficulty: string;
  status: string;
  reward_points: number;
  duration: string;
  image_url: string;
  tips: string[];
  progress: number;
  time_left?: string;
  completed_by?: number;
  average_rating?: number;
  assigned_at?: string;
  expires_at?: string;
}

export interface Story {
  id: string;
  userId: string;
  missionId: string;
  missionTitle: string;
  missionCategory: string;
  storyText: string;
  images: string[];
  location: string;
  autoTags: string[];
  userTags: string[];
  isPublic: boolean;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoryFeedItem {
  storyId: string;
  user: {
    userId: string;
    name: string;
    avatarUrl: string;
    level: number;
    levelTitle: string;
  };
  mission: {
    missionId: string;
    title: string;
    category: string;
  };
  content: {
    storyText: string;
    images: string[];
    tags: string[];
  };
  interactions: {
    likes: number;
    comments: number;
    isLikedByCurrentUser: boolean;
  };
  timeAgo: string;
  location: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  originalPrice: string;
  requiredPoints: number;
  discountPercentage: number;
  imageUrl: string;
  expirationDays: number;
  isPopular: boolean;
  isPremium: boolean;
  isActive: boolean;
  totalExchanged: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  rewardBrand: string;
  pointsUsed: number;
  exchangeCode: string;
  status: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

// 응답 DTO 타입들
export interface UserSummaryResponse {
  userId: string;
  name: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  currentPoints: number;
  currentStreak: number;
  completionRate: number;
  thisMonthPoints: number;
  thisMonthMissions: number;
}

export interface HomePageResponse {
  userSummary: UserSummaryResponse;
  todaysMissions: Mission[];
  recentStories: StoryFeedItem[];
}

export interface MissionDetailResponse {
  id: string;
  title: string;
  description: string;
  detailed_description: string;
  category: string;
  category_color: string;
  difficulty: string;
  reward_points: number;
  duration: string;
  image_url: string;
  tips: string[];
  completed_by: number;
  average_rating: number;
  similar_missions: {
    id: string;
    title: string;
    difficulty: string;
    points: number;
  }[];
}

export interface RewardsPageResponse {
  userPoints: {
    current: number;
    total: number;
    thisMonth: number;
    spent: number;
    thisMonthSpent: number;
  };
  availableRewards: Reward[];
  rewardHistory: UserReward[];
}

export interface CategoryStatResponse {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}

export interface MissionVerificationResponse {
  story_id: string;
  points_earned: number;
  streak_count: number;
  level_up: boolean;
  new_level?: number;
  stats_increased?: {
    category: string;
    pointsGained: number;
    allocatablePointsGained: number;
    totalStats: number;
  };
}

export interface MissionCompletionResponse {
  mission: Mission;
  points_earned: number;
  streak_count: number;
  level_up: boolean;
  new_level?: number;
  total_points: number;
  this_month_points: number;
  remaining_missions?: Mission[];
}

// 일일 미션 제한 정보
export interface DailyMissionLimit {
  max_daily_starts: number;
  current_started: number;
  remaining_starts: number;
  can_start: boolean;
  reset_time: string;
}

// 오늘의 미션 응답 (제한 정보 포함)
export interface TodaysMissionsResponse {
  missions: Mission[];
  daily_limit: DailyMissionLimit;
}

// 요청 DTO 타입들
export interface CreateUserRequest {
  email: string;
  name: string;
  avatarUrl: string;
}

export interface MissionVerificationRequest {
  missionId: string;
  story: string;
  images: string[];
  location: string;
  isPublic: boolean;
  userTags: string[];
}

// 스탯 관련 타입들
export interface StatGrade {
  name: string;
  displayName: string;
  minValue: number;
  maxValue: number;
  color: string;
}

export interface StatValue {
  current: number;
  allocated: number;
  base: number;
  grade: StatGrade;
  displayName: string;
  icon: string;
  color: string;
}

export interface DominantStat {
  type: string;
  displayName: string;
  value: number;
  icon: string;
  color: string;
}

export interface UserStats {
  userId: string;
  strength: StatValue;
  intelligence: StatValue;
  creativity: StatValue;
  sociability: StatValue;
  adventurous: StatValue;
  discipline: StatValue;
  availablePoints: number;
  totalEarnedPoints: number;
  totalStats: number;
  averageStatValue: number;
  dominantStat: DominantStat;
  lastUpdatedAt: string;
  createdAt: string;
}

export interface StatsRankingItem {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  statValue: number;
  statType?: string;
  totalStats: number;
}

export interface UserRankingInfo {
  userId: string;
  totalStatsRank: number;
  strengthRank: number;
  intelligenceRank: number;
  creativityRank: number;
  sociabilityRank: number;
  adventurousRank: number;
  disciplineRank: number;
  totalUsers: number;
}

// 스탯 관련 요청 타입들
export interface AllocateStatPointsRequest {
  statType: string;
  points: number;
}