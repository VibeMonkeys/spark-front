import { useEffect, useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trophy, Flame, TrendingUp, ArrowRight, Home, Target } from "lucide-react";
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
  }, []); // 의존성 배열을 빈 배열로 변경하여 마운트 시에만 실행
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200/40 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200/25 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-purple-300/35 rounded-full blur-md animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Success Animation */}
        <div className="text-center">
          <div className="relative">
            <div className="size-28 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white">
              <Trophy className="size-14 text-white" />
            </div>
            {/* Celebration rings */}
            <div className="absolute inset-0 size-28 mx-auto rounded-full border-2 border-purple-200 animate-ping opacity-75"></div>
            <div className="absolute inset-0 size-32 mx-auto rounded-full border border-purple-100 animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            🎉 미션 완료!
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-2">
            멋진 경험을 완성하셨네요
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>✨ 새로운 성취를 달성했어요!</span>
          </div>
        </div>

        {/* Enhanced Rewards Summary */}
        <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border border-purple-200">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  +{pointsEarned || 0}P
                </div>
                <p className="text-base font-medium text-purple-700">포인트 획득</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl border border-orange-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="size-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600">{streakCount || 0}일 연속</span>
                </div>
                <p className="text-base font-medium text-orange-700">연속 기록 달성</p>
              </div>
            </div>

            {/* Level Up Notification */}
            {levelUp && newLevel && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 mt-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 text-lg">🎊 레벨 업!</h4>
                    <p className="text-base font-medium text-purple-700">레벨 {newLevel}로 상승했습니다</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Stats Card */}
        <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {isRefreshingUser ? '...' : (freshUserData?.completed_missions || user?.completed_missions || 0)}
                </div>
                <p className="text-sm text-gray-600">완료한 미션</p>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {isRefreshingUser ? '...' : (() => {
                    const currentUser = freshUserData || user;
                    return currentUser?.completed_missions && currentUser.completed_missions > 0 
                      ? 100
                      : 0;
                  })()}%
                </div>
                <p className="text-sm text-gray-600">성공률</p>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  #{isRefreshingUser ? '...' : (freshUserData?.current_streak || user?.current_streak || streakCount || 0)}
                </div>
                <p className="text-sm text-gray-600">연속 기록</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onBackToHome}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-3xl h-16 shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Home className="size-5 mr-3" />
            홈으로 돌아가기
          </Button>
          
          {onViewProfile && (
            <Button 
              onClick={handleViewProfile}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 font-bold rounded-3xl h-16 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02]"
            >
              내 프로필 보기
              <ArrowRight className="size-5 ml-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}