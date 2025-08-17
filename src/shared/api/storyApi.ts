import { api } from './base';
import { 
  ApiResponse, 
  PagedResponse, 
  Story, 
  StoryFeedItem, 
  MissionVerificationRequest,
  MissionVerificationResponse 
} from './types';

export interface StoryComment {
  id: number;
  storyId: number;
  userId: number;
  userName: string;
  userAvatarUrl: string;
  content: string;
  createdAt: string;
}

export interface AddCommentRequest {
  content: string;
}

export interface UpdateStoryRequest {
  storyText: string;
  userTags: string[];
  isPublic: boolean;
}

export interface CreateFreeStoryRequest {
  story_text: string;
  images: string[];
  location: string;
  is_public: boolean;
  user_tags: string[];
}

export const storyApi = {
  // 미션 인증 스토리 생성
  createStory: async (request: MissionVerificationRequest): Promise<MissionVerificationResponse> => {
    const response = await api.post<ApiResponse<MissionVerificationResponse>>('/stories', request);
    return response.data.data;
  },

  // 자유 스토리 생성
  createFreeStory: async (request: CreateFreeStoryRequest): Promise<Story> => {
    const response = await api.post<ApiResponse<Story>>('/stories/free', request);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to create free story');
    }
    return response.data.data;
  },

  // 스토리 피드 조회 (기존 - 호환성 유지)
  getStoryFeed: async (
    sortBy: string = 'latest',
    page: number = 0,
    size: number = 20,
    category?: string,
    userId?: number
  ): Promise<PagedResponse<StoryFeedItem>> => {
    const params = new URLSearchParams({
      sortBy,
      page: page.toString(),
      size: size.toString(),
    });
    if (category) params.append('category', category);
    if (userId) params.append('userId', userId.toString());
    
    const response = await api.get<ApiResponse<PagedResponse<any>>>(`/stories/feed?${params}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch story feed');
    }
    return response.data.data;
  },

  // StoryType별 스토리 피드 조회 (새로운 API)
  getStoryFeedByType: async (
    storyType: 'FREE_STORY' | 'MISSION_PROOF',
    cursor?: number,
    size: number = 20,
    direction: string = 'NEXT',
    userId?: number
  ): Promise<PagedResponse<StoryFeedItem>> => {
    const params = new URLSearchParams({
      size: size.toString(),
      direction,
    });
    if (cursor) params.append('cursor', cursor.toString());
    if (userId) params.append('userId', userId.toString());
    
    const response = await api.get<ApiResponse<PagedResponse<any>>>(`/stories/feed/${storyType}?${params}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch story feed by type');
    }
    return response.data.data;
  },

  // 스토리 상세 조회
  getStory: async (storyId: number, userId?: number): Promise<Story> => {
    const params = userId ? `?userId=${userId}` : '';
    const response = await api.get<ApiResponse<Story>>(`/stories/${storyId}${params}`);
    return response.data;
  },

  // 사용자의 스토리 조회
  getUserStories: async (
    targetUserId: number,
    page: number = 0,
    size: number = 20,
    currentUserId?: number
  ): Promise<PagedResponse<Story>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (currentUserId) params.append('currentUserId', currentUserId.toString());
    
    const response = await api.get<ApiResponse<PagedResponse<Story>>>(`/stories/user/${targetUserId}?${params}`);
    return response.data;
  },

  // 스토리 좋아요
  likeStory: async (storyId: number, userId: number): Promise<StoryFeedItem> => {
    const response = await api.post<ApiResponse<any>>(`/stories/${storyId}/like?userId=${userId}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to like story');
    }
    return response.data.data;
  },

  // 스토리 좋아요 취소
  unlikeStory: async (storyId: number, userId: number): Promise<StoryFeedItem> => {
    const response = await api.delete<ApiResponse<any>>(`/stories/${storyId}/like?userId=${userId}`);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to unlike story');
    }
    return response.data.data;
  },

  // 스토리 댓글 조회
  getStoryComments: async (storyId: number): Promise<StoryComment[]> => {
    const response = await api.get<ApiResponse<StoryComment[]>>(`/stories/${storyId}/comments`);
    return response.data;
  },

  // 스토리 댓글 추가
  addComment: async (storyId: number, userId: number, request: AddCommentRequest): Promise<StoryComment> => {
    const response = await api.post<ApiResponse<StoryComment>>(
      `/stories/${storyId}/comments?userId=${userId}`,
      request
    );
    return response.data;
  },

  // 스토리 수정
  updateStory: async (storyId: number, userId: number, request: UpdateStoryRequest): Promise<Story> => {
    const response = await api.put<ApiResponse<Story>>(`/stories/${storyId}?userId=${userId}`, request);
    return response.data;
  },

  // 스토리 삭제
  deleteStory: async (storyId: number, userId: number): Promise<void> => {
    await api.delete(`/stories/${storyId}?userId=${userId}`);
  },

  // 스토리 검색
  searchStories: async (
    keyword?: string,
    hashTag?: string,
    category?: string,
    location?: string,
    page: number = 0,
    size: number = 20,
    userId?: number
  ): Promise<PagedResponse<Story>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (keyword) params.append('keyword', keyword);
    if (hashTag) params.append('hashTag', hashTag);
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (userId) params.append('userId', userId.toString());
    
    const response = await api.get<ApiResponse<PagedResponse<Story>>>(`/stories/search?${params}`);
    return response.data;
  },
};