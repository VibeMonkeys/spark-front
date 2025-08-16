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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-8">
        {/* Toss-style Success Animation */}
        <div className="text-center">
          <div className="size-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Trophy className="size-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            미션 완료!
          </h1>
          <p className="text-base text-gray-600">
            멋진 경험을 완성하셨네요
          </p>
        </div>

        {/* Toss-style Rewards Summary */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  +{pointsEarned || 0}P
                </div>
                <p className="text-sm text-gray-600">포인트 획득</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="size-4 text-orange-500" />
                  <span className="text-xl font-bold text-gray-900">{streakCount || 0}일 연속</span>
                </div>
                <p className="text-sm text-gray-600">연속 기록 달성</p>
              </div>
            </div>

            {/* Level Up Notification */}
            {levelUp && newLevel && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">레벨 업!</h4>
                    <p className="text-sm text-gray-600">레벨 {newLevel}로 상승했습니다</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Toss-style Stats Card */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
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

        {/* Toss-style Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onBackToHome}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl h-14 shadow-sm"
          >
            <Home className="size-5 mr-2" />
            홈으로 돌아가기
          </Button>
          
          {onViewProfile && (
            <Button 
              onClick={handleViewProfile}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 font-semibold rounded-2xl h-14 hover:bg-gray-50"
            >
              내 프로필 보기
              <ArrowRight className="size-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}