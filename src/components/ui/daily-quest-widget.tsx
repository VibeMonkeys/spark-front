import React, { useState } from 'react';
import { 
  Target, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Flame, 
  Trophy, 
  Star,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { useDailyQuests } from '../../hooks/useDailyQuests';
import { DailyQuestModal } from './daily-quest-modal';
import { cn } from './utils';

interface DailyQuestWidgetProps {
  variant?: 'default' | 'compact' | 'minimal' | 'detailed';
  showHeader?: boolean;
  showProgress?: boolean;
  showQuests?: boolean;
  showStreakInfo?: boolean;
  showSpecialRewards?: boolean;
  maxQuestsShown?: number;
  onQuestClick?: () => void;
  className?: string;
}

export const DailyQuestWidget: React.FC<DailyQuestWidgetProps> = ({
  variant = 'default',
  showHeader = true,
  showProgress = true,
  showQuests = true,
  showStreakInfo = true,
  showSpecialRewards = false,
  maxQuestsShown = 4,
  onQuestClick,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    quests,
    userProgress,
    summary,
    currentProgress,
    completedQuests,
    totalQuests,
    currentStreak,
    hasUnlockedReward,
    availableSpecialRewards,
    completeQuest,
    isUpdating,
    isLoading,
    motivationalMessage
  } = useDailyQuests();

  const handleQuestComplete = async (questId: number) => {
    try {
      await completeQuest(questId);
    } catch (error) {
      // Error handled silently
    }
  };

  const handleWidgetClick = () => {
    if (onQuestClick) {
      onQuestClick();
    } else {
      setIsModalOpen(true);
    }
  };

  const getQuestProgress = (questId: number) => {
    return userProgress?.find(progress => progress.questId === questId);
  };

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '🌙 늦은 밤';
    if (hour < 12) return '🌅 좋은 아침';
    if (hour < 18) return '☀️ 즐거운 오후';
    if (hour < 22) return '🌆 편안한 저녁';
    return '🌃 고요한 밤';
  };

  // Progress state styling
  const getProgressStyle = () => {
    if (currentProgress === 100) {
      return {
        bg: hasUnlockedReward ? 'from-yellow-50 to-orange-50' : 'from-green-50 to-emerald-50',
        border: hasUnlockedReward ? 'border-yellow-200' : 'border-green-200',
        text: hasUnlockedReward ? 'text-yellow-800' : 'text-green-800'
      };
    }
    if (currentProgress >= 75) {
      return { bg: 'from-orange-50 to-red-50', border: 'border-orange-200', text: 'text-orange-800' };
    }
    if (currentProgress >= 50) {
      return { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-800' };
    }
    if (currentProgress >= 25) {
      return { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', text: 'text-purple-800' };
    }
    return { bg: 'from-gray-50 to-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
  };

  const progressStyle = getProgressStyle();

  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <>
        <div 
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md",
            progressStyle.bg,
            progressStyle.border,
            "border",
            className
          )}
          onClick={handleWidgetClick}
        >
          <Target className="size-5 text-purple-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">일일 퀘스트</span>
              <span className="text-xs font-bold text-purple-600">
                {completedQuests}/{totalQuests}
              </span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
          <ChevronRight className="size-4 text-gray-400" />
        </div>
        <DailyQuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <Card className={cn("cursor-pointer transition-all hover:shadow-md", className)} onClick={handleWidgetClick}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="size-5 text-purple-600" />
                <span className="font-semibold text-gray-900">오늘의 퀘스트</span>
              </div>
              <Badge className={cn("text-xs", progressStyle.text, progressStyle.bg)}>
                {completedQuests}/{totalQuests}
              </Badge>
            </div>
            
            <Progress value={currentProgress} className="mb-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className={progressStyle.text}>{currentProgress}% 완료</span>
              {currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="size-3" />
                  <span>{currentStreak}일</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <DailyQuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default and detailed variants
  return (
    <>
      <Card className={cn("transition-all hover:shadow-lg", className)}>
        {showHeader && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="size-5 text-purple-600" />
                일일 퀘스트
              </CardTitle>
              <div className="flex items-center gap-2">
                {hasUnlockedReward && (
                  <Sparkles className="size-4 text-yellow-500 animate-pulse" />
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleWidgetClick}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{getTimeGreeting()}</p>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          {/* Progress Section */}
          {showProgress && (
            <div className={cn(
              "p-4 rounded-lg border",
              progressStyle.bg,
              progressStyle.border
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">오늘의 진행률</span>
                <span className={cn("text-sm font-bold", progressStyle.text)}>
                  {completedQuests}/{totalQuests} 완료
                </span>
              </div>
              <Progress value={currentProgress} className="h-3 mb-2" />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs", progressStyle.text)}>{currentProgress}%</span>
                {motivationalMessage && (
                  <span className="text-xs text-gray-600">{motivationalMessage.emoji}</span>
                )}
              </div>
            </div>
          )}

          {/* Streak & Stats */}
          {showStreakInfo && (currentStreak > 0 || hasUnlockedReward) && (
            <div className="flex gap-2">
              {currentStreak > 0 && (
                <div className="flex-1 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Flame className="size-4" />
                    <span className="font-bold">{currentStreak}</span>
                  </div>
                  <p className="text-xs text-orange-700">연속일</p>
                </div>
              )}
              {hasUnlockedReward && (
                <div className="flex-1 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Trophy className="size-4" />
                    <span className="font-bold">특수</span>
                  </div>
                  <p className="text-xs text-yellow-700">보상</p>
                </div>
              )}
            </div>
          )}

          {/* Special Rewards Preview */}
          {showSpecialRewards && availableSpecialRewards.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">특수 보상</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSpecialRewards.slice(0, 2).map((reward) => (
                  <div
                    key={reward.tier}
                    className={cn(
                      "p-2 rounded border text-center text-xs",
                      reward.isUnlocked
                        ? "bg-green-50 border-green-200"
                        : currentProgress >= reward.requiredPercentage
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="text-sm mb-1">{reward.emoji}</div>
                    <div className="font-medium">{reward.tier}</div>
                    {reward.isUnlocked && (
                      <Badge className="mt-1 bg-green-100 text-green-700 text-xs">획득!</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quest List Preview */}
          {showQuests && quests.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">퀘스트 목록</h4>
                {variant === 'detailed' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleWidgetClick}
                    className="text-xs text-purple-600"
                  >
                    전체보기
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {quests.slice(0, maxQuestsShown).map((quest) => {
                  const progress = getQuestProgress(quest.id);
                  const isCompleted = progress?.isCompleted || false;

                  return (
                    <div
                      key={quest.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded border transition-all",
                        isCompleted 
                          ? "bg-green-50 border-green-200" 
                          : "bg-white border-gray-200 hover:border-purple-300"
                      )}
                    >
                      <div className="text-lg">{quest.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className={cn(
                          "text-sm font-medium",
                          isCompleted ? "text-green-700 line-through" : "text-gray-900"
                        )}>
                          {quest.title}
                        </h5>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            +{quest.pointsReward}P
                          </Badge>
                        </div>
                      </div>
                      {variant === 'detailed' && (
                        <Button
                          size="sm"
                          variant={isCompleted ? "secondary" : "default"}
                          disabled={isCompleted || isUpdating}
                          onClick={(e) => {
                            e.stopPropagation();
                            !isCompleted && handleQuestComplete(quest.id);
                          }}
                          className={cn(
                            isCompleted 
                              ? "bg-green-100 hover:bg-green-200" 
                              : "bg-gradient-to-r from-purple-600 to-blue-600",
                            "min-w-[32px] h-8"
                          )}
                        >
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : isCompleted ? (
                            <CheckCircle className="size-3 text-green-600" />
                          ) : (
                            <Circle className="size-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Motivational Message */}
          {motivationalMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{motivationalMessage.emoji}</span>
                <p className="text-sm text-blue-800">{motivationalMessage.message}</p>
              </div>
            </div>
          )}

          {/* Footer Action */}
          {variant !== 'detailed' && (
            <Button
              onClick={handleWidgetClick}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Target className="size-4 mr-2" />
              퀘스트 시작하기
            </Button>
          )}
        </CardContent>
      </Card>

      <DailyQuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default DailyQuestWidget;