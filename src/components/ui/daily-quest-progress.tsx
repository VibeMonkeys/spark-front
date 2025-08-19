import React from 'react';
import { Target, Flame, Trophy, Star, Sparkles, CheckCircle } from 'lucide-react';
import { Progress } from './progress';
import { Badge } from './badge';
import { Card, CardContent } from './card';

interface DailyQuestProgressProps {
  currentProgress: number;
  completedQuests: number;
  totalQuests: number;
  currentStreak: number;
  longestStreak?: number;
  hasSpecialReward?: boolean;
  statusMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showAnimation?: boolean;
}

export const DailyQuestProgress: React.FC<DailyQuestProgressProps> = ({
  currentProgress,
  completedQuests,
  totalQuests,
  currentStreak,
  longestStreak,
  hasSpecialReward = false,
  statusMessage,
  className = "",
  variant = 'default',
  showAnimation = true
}) => {
  // 진행률에 따른 색상과 이모지 결정
  const getProgressState = () => {
    if (currentProgress === 100) {
      return {
        color: hasSpecialReward ? 'from-yellow-400 to-orange-400' : 'from-green-400 to-emerald-400',
        textColor: hasSpecialReward ? 'text-yellow-700' : 'text-green-700',
        bgColor: hasSpecialReward ? 'bg-yellow-50' : 'bg-green-50',
        borderColor: hasSpecialReward ? 'border-yellow-200' : 'border-green-200',
        emoji: hasSpecialReward ? '🎁' : '✅',
        message: hasSpecialReward ? '특수 보상 획득!' : '완벽한 하루!'
      };
    }
    
    if (currentProgress >= 75) {
      return {
        color: 'from-orange-400 to-red-400',
        textColor: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        emoji: '🔥',
        message: '거의 다 왔어요!'
      };
    }
    
    if (currentProgress >= 50) {
      return {
        color: 'from-blue-400 to-indigo-400',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        emoji: '💪',
        message: '절반 완료!'
      };
    }
    
    if (currentProgress >= 25) {
      return {
        color: 'from-purple-400 to-pink-400',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        emoji: '🌟',
        message: '좋은 시작!'
      };
    }
    
    return {
      color: 'from-gray-300 to-gray-400',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      emoji: '🎯',
      message: '시작해볼까요?'
    };
  };

  const progressState = getProgressState();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg ${progressState.bgColor} ${progressState.borderColor} border ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{progressState.emoji}</span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {completedQuests}/{totalQuests} 완료
            </div>
            <div className="text-xs text-gray-600">
              {currentProgress}%
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <Progress 
            value={currentProgress} 
            className="h-2"
          />
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-orange-600">
            <Flame className="size-3" />
            <span className="text-xs font-medium">{currentStreak}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`${progressState.bgColor} ${progressState.borderColor} ${className}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{progressState.emoji}</span>
              <h3 className="text-lg font-bold text-gray-900">일일 퀘스트</h3>
            </div>
            <p className={`text-sm font-medium ${progressState.textColor}`}>
              {statusMessage || progressState.message}
            </p>
          </div>

          {/* Progress Circle */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${currentProgress}, 100`}
                  className={`transition-all duration-1000 ease-out ${
                    currentProgress === 100 
                      ? hasSpecialReward ? 'text-yellow-500' : 'text-green-500'
                      : currentProgress >= 75 ? 'text-orange-500'
                      : currentProgress >= 50 ? 'text-blue-500'
                      : currentProgress >= 25 ? 'text-purple-500'
                      : 'text-gray-400'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {completedQuests}/{totalQuests}
                  </div>
                  <div className="text-sm text-gray-600">완료</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Target className="size-4" />
                <span className="font-bold">{currentProgress}%</span>
              </div>
              <p className="text-xs text-gray-600">진행률</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Flame className="size-4" />
                <span className="font-bold">{currentStreak}</span>
              </div>
              <p className="text-xs text-gray-600">연속일</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                <Trophy className="size-4" />
                <span className="font-bold">{longestStreak || 0}</span>
              </div>
              <p className="text-xs text-gray-600">최고기록</p>
            </div>
          </div>

          {/* Special Reward Indicator */}
          {hasSpecialReward && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-700">
                <Sparkles className="size-4" />
                <span className="text-sm font-medium">특수 보상 획득 가능!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`p-4 rounded-lg ${progressState.bgColor} ${progressState.borderColor} border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{progressState.emoji}</span>
          <h3 className="font-semibold text-gray-900">오늘의 퀘스트</h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900">
            {completedQuests}/{totalQuests}
          </div>
          <div className="text-xs text-gray-600">{currentProgress}%</div>
        </div>
      </div>

      <Progress 
        value={currentProgress} 
        className={`h-3 mb-3 ${showAnimation ? 'transition-all duration-700 ease-out' : ''}`}
      />

      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${progressState.textColor}`}>
          {statusMessage || progressState.message}
        </p>
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">
                {currentStreak}일 연속
              </span>
            </div>
          )}
          {hasSpecialReward && (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
              <Sparkles className="size-3 mr-1" />
              특수 보상
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyQuestProgress;