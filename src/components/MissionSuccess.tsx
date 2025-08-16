import { useEffect, useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, Trophy, Flame, TrendingUp, ArrowRight, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { userApi } from "../shared/api";

interface MissionSuccessProps {
  pointsEarned: number;
  streakCount: number;
  levelUp?: boolean;
  newLevel?: number;
  onBackToHome: () => void;
  onViewProfile?: () => void;
}

export function MissionSuccess({ 
  pointsEarned, 
  streakCount, 
  levelUp = false, 
  newLevel,
  onBackToHome,
  onViewProfile 
}: MissionSuccessProps) {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  
  // 컴포넌트에서 직접 최신 사용자 데이터 조회
  const { data: freshUserData, isLoading: isRefreshingUser } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => userApi.getUser(user!.id),
    enabled: !!user?.id,
    staleTime: 0, // 항상 최신 데이터 가져오기
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // 컴포넌트 마운트 시 사용자 데이터 새로고침
  useEffect(() => {
    refreshUser();
    // React Query 캐시도 무효화
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [refreshUser, queryClient]);
  
  // 디버깅용 로그
  useEffect(() => {
    if (freshUserData) {
      console.log('🔄 [MissionSuccess] Fresh user data received:', freshUserData);
      console.log('📊 [MissionSuccess] Completed missions:', freshUserData.completed_missions);
      console.log('🔥 [MissionSuccess] Current streak:', freshUserData.current_streak);
    }
  }, [freshUserData]);
  
  useEffect(() => {
    console.log('👤 [MissionSuccess] Context user data:', user);
  }, [user]);
  
  const handleViewProfile = () => {
    // 프로필 관련 모든 쿼리 무효화하여 최신 데이터 로드
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    queryClient.invalidateQueries({ queryKey: ['achievements'] });
    queryClient.invalidateQueries({ queryKey: ['level-progress'] });
    
    if (onViewProfile) {
      onViewProfile();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Success Animation */}
        <div className="text-center">
          <div className="size-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="size-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🎉 미션 완료!
          </h1>
          <p className="text-lg text-muted-foreground mb-1">
            멋진 경험을 완성하셨네요!
          </p>
          <p className="text-sm text-muted-foreground">
            당신의 도전 정신이 빛나는 순간입니다 ✨
          </p>
        </div>

        {/* Rewards Summary */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-center">획득한 보상</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="size-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">+{pointsEarned || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">포인트</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Flame className="size-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600">{streakCount || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">연속일</p>
              </div>
            </div>

            {/* 스탯 보상 표시 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  🎁
                </div>
                <h4 className="font-semibold text-sm text-gray-800">스탯 보상 획득!</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">자동 스탯 증가</p>
                    <p className="text-xs text-gray-500">카테고리별 +1P</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">할당 포인트</p>
                    <p className="text-xs text-gray-500">자유 배분 +2P</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-medium">
                  📊 프로필 &gt; 스탯에서 할당 포인트를 사용할 수 있어요!
                </p>
              </div>
            </div>

            {/* Level Up Notification */}
            {levelUp && newLevel && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-700">레벨 업!</h4>
                    <p className="text-sm text-purple-600">레벨 {newLevel}로 상승했습니다!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Achievement Badges */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">새로운 뱃지</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  🚶‍♂️ 탐험가
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  📸 스토리텔러
                </Badge>
                {streakCount >= 7 && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    🔥 일주일 연속
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {isRefreshingUser ? '...' : (freshUserData?.completed_missions || user?.completed_missions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">완료한 미션</p>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {isRefreshingUser ? '...' : (() => {
                    const currentUser = freshUserData || user;
                    // 현재는 완료한 미션만 존재하므로 완료된 미션이 있으면 100% 성공률
                    // 향후 실패한 미션 수 필드가 추가되면: 
                    // (completed_missions / (completed_missions + failed_missions)) * 100
                    return currentUser?.completed_missions && currentUser.completed_missions > 0 
                      ? 100
                      : 0;
                  })()}%
                </div>
                <p className="text-xs text-muted-foreground">성공률</p>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  #{isRefreshingUser ? '...' : (freshUserData?.current_streak || user?.current_streak || streakCount || 0)}
                </div>
                <p className="text-xs text-muted-foreground">연속 기록</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onBackToHome}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
            size="lg"
          >
            <Home className="size-5 mr-2" />
            <span className="font-bold">🏠 새로운 미션 찾으러 가기</span>
          </Button>
          
          {onViewProfile && (
            <Button 
              onClick={handleViewProfile}
              variant="outline"
              className="w-full bg-white/60 backdrop-blur-sm"
              size="lg"
            >
              내 프로필 보기
              <ArrowRight className="size-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Share Encouragement */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            다음 미션도 도전해보세요!
          </p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}