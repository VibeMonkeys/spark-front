import React, { useState } from 'react';
import { Lock, Trophy, Star, Crown, Gem, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import { cn } from './utils';

interface SpecialReward {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  description: string;
  emoji: string;
  basePoints: number;
  requiredPercentage: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface SpecialRewardsGridProps {
  rewards: SpecialReward[];
  currentProgress: number;
  onRewardClick?: (reward: SpecialReward) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export const SpecialRewardsGrid: React.FC<SpecialRewardsGridProps> = ({
  rewards,
  currentProgress,
  onRewardClick,
  variant = 'default',
  className = ""
}) => {
  const [selectedReward, setSelectedReward] = useState<SpecialReward | null>(null);

  const getRewardStyles = (tier: SpecialReward['tier']) => {
    switch (tier) {
      case 'BRONZE':
        return {
          gradient: 'from-orange-400 to-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          borderColor: 'border-orange-300',
          textColor: 'text-orange-800',
          lightBg: 'bg-orange-50',
          darkBg: 'bg-orange-100',
          icon: Trophy
        };
      case 'SILVER':
        return {
          gradient: 'from-gray-400 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          lightBg: 'bg-gray-50',
          darkBg: 'bg-gray-100',
          icon: Star
        };
      case 'GOLD':
        return {
          gradient: 'from-yellow-400 to-yellow-600',
          bgGradient: 'from-yellow-50 to-yellow-100',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-800',
          lightBg: 'bg-yellow-50',
          darkBg: 'bg-yellow-100',
          icon: Crown
        };
      case 'PLATINUM':
        return {
          gradient: 'from-purple-400 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-300',
          textColor: 'text-purple-800',
          lightBg: 'bg-purple-50',
          darkBg: 'bg-purple-100',
          icon: Gem
        };
      default:
        return {
          gradient: 'from-blue-400 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-300',
          textColor: 'text-blue-800',
          lightBg: 'bg-blue-50',
          darkBg: 'bg-blue-100',
          icon: Trophy
        };
    }
  };

  const getRewardStatus = (reward: SpecialReward) => {
    if (reward.isUnlocked) {
      return { status: 'unlocked', message: '획득 완료!', color: 'text-green-600' };
    }
    if (currentProgress >= reward.requiredPercentage) {
      return { status: 'available', message: '획득 가능!', color: 'text-blue-600' };
    }
    if (currentProgress >= reward.requiredPercentage * 0.8) {
      return { status: 'close', message: '거의 다 왔어요!', color: 'text-orange-600' };
    }
    return { status: 'locked', message: '잠금됨', color: 'text-gray-500' };
  };

  const sortedRewards = [...rewards].sort((a, b) => a.requiredPercentage - b.requiredPercentage);

  if (variant === 'compact') {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
        {sortedRewards.map((reward) => {
          const styles = getRewardStyles(reward.tier);
          const status = getRewardStatus(reward);
          const IconComponent = styles.icon;

          return (
            <div
              key={reward.tier}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 relative",
                reward.isUnlocked
                  ? `${styles.borderColor} ${styles.lightBg} shadow-md`
                  : currentProgress >= reward.requiredPercentage
                  ? `${styles.borderColor} ${styles.lightBg} animate-pulse`
                  : "border-gray-200 bg-gray-50 opacity-60",
                "hover:scale-105"
              )}
              onClick={() => onRewardClick?.(reward)}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{reward.emoji}</div>
                {reward.isUnlocked && (
                  <CheckCircle className="absolute -top-1 -right-1 size-4 text-green-500 bg-white rounded-full" />
                )}
                {!reward.isUnlocked && currentProgress < reward.requiredPercentage && (
                  <Lock className="absolute -top-1 -right-1 size-3 text-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn("space-y-4", className)}>
        {sortedRewards.map((reward) => {
          const styles = getRewardStyles(reward.tier);
          const status = getRewardStatus(reward);
          const IconComponent = styles.icon;
          const progressToReward = Math.min((currentProgress / reward.requiredPercentage) * 100, 100);

          return (
            <Card
              key={reward.tier}
              className={cn(
                "transition-all duration-200 cursor-pointer hover:shadow-lg",
                reward.isUnlocked
                  ? `${styles.borderColor} border-2 ${styles.lightBg}`
                  : currentProgress >= reward.requiredPercentage
                  ? `${styles.borderColor} border-2 ${styles.lightBg} ring-2 ring-opacity-50 ${styles.borderColor.replace('border-', 'ring-')}`
                  : "border-gray-200",
                selectedReward?.tier === reward.tier && "ring-2 ring-blue-300"
              )}
              onClick={() => {
                setSelectedReward(reward);
                onRewardClick?.(reward);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center relative",
                    reward.isUnlocked
                      ? `bg-gradient-to-br ${styles.gradient} text-white shadow-lg`
                      : currentProgress >= reward.requiredPercentage
                      ? `${styles.darkBg} ${styles.textColor}`
                      : "bg-gray-100 text-gray-400"
                  )}>
                    <IconComponent className="size-6" />
                    <div className="absolute -top-1 -right-1 text-lg">
                      {reward.emoji}
                    </div>
                    {reward.isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="size-3 text-white" />
                      </div>
                    )}
                    {!reward.isUnlocked && currentProgress < reward.requiredPercentage && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-400 rounded-full p-1">
                        <Lock className="size-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={cn(
                        "font-semibold",
                        reward.isUnlocked ? styles.textColor : "text-gray-900"
                      )}>
                        {reward.description}
                      </h3>
                      <Badge
                        className={cn(
                          reward.isUnlocked
                            ? "bg-green-100 text-green-700"
                            : currentProgress >= reward.requiredPercentage
                            ? `${styles.lightBg} ${styles.textColor}`
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {reward.tier}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          필요: {reward.requiredPercentage}% 완료
                        </span>
                        <span className={cn("font-medium", status.color)}>
                          {status.message}
                        </span>
                      </div>

                      {!reward.isUnlocked && (
                        <div className="space-y-1">
                          <Progress value={progressToReward} className="h-2" />
                          <div className="text-xs text-gray-500 text-right">
                            {currentProgress}% / {reward.requiredPercentage}%
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Sparkles className="size-3 text-yellow-500" />
                          <span className="text-gray-600">+{reward.basePoints}P</span>
                        </div>
                        {reward.unlockedAt && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="size-3" />
                            <span>
                              {new Date(reward.unlockedAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Default variant - Grid layout
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {sortedRewards.map((reward) => {
        const styles = getRewardStyles(reward.tier);
        const status = getRewardStatus(reward);
        const IconComponent = styles.icon;
        const progressToReward = Math.min((currentProgress / reward.requiredPercentage) * 100, 100);

        return (
          <Card
            key={reward.tier}
            className={cn(
              "transition-all duration-200 cursor-pointer hover:shadow-md",
              reward.isUnlocked
                ? `${styles.borderColor} border-2 ${styles.lightBg}`
                : currentProgress >= reward.requiredPercentage
                ? `${styles.borderColor} border-2 ${styles.lightBg} animate-pulse`
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onRewardClick?.(reward)}
          >
            <CardContent className="p-4 text-center">
              {/* Icon and Emoji */}
              <div className="relative mb-3">
                <div className={cn(
                  "w-12 h-12 mx-auto rounded-full flex items-center justify-center",
                  reward.isUnlocked
                    ? `bg-gradient-to-br ${styles.gradient} text-white shadow-md`
                    : currentProgress >= reward.requiredPercentage
                    ? `${styles.darkBg} ${styles.textColor}`
                    : "bg-gray-100 text-gray-400"
                )}>
                  <IconComponent className="size-5" />
                </div>
                <div className="absolute -top-1 -right-2 text-xl">
                  {reward.emoji}
                </div>
                {reward.isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="size-3 text-white" />
                  </div>
                )}
                {!reward.isUnlocked && currentProgress < reward.requiredPercentage && (
                  <div className="absolute -bottom-1 -right-1 bg-gray-400 rounded-full p-1">
                    <Lock className="size-3 text-white" />
                  </div>
                )}
              </div>

              {/* Title and Tier */}
              <h3 className="font-medium text-sm mb-1 line-clamp-2">
                {reward.description}
              </h3>
              <Badge className={cn(
                "text-xs mb-2",
                reward.isUnlocked
                  ? "bg-green-100 text-green-700"
                  : currentProgress >= reward.requiredPercentage
                  ? `${styles.lightBg} ${styles.textColor}`
                  : "bg-gray-100 text-gray-600"
              )}>
                {reward.tier}
              </Badge>

              {/* Progress or Status */}
              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  {reward.requiredPercentage}% 필요
                </div>
                
                {!reward.isUnlocked && (
                  <div className="space-y-1">
                    <Progress value={progressToReward} className="h-1.5" />
                    <div className="text-xs text-gray-500">
                      {currentProgress}%
                    </div>
                  </div>
                )}

                <div className={cn("text-xs font-medium", status.color)}>
                  {status.message}
                </div>

                <div className="text-xs text-gray-600">
                  +{reward.basePoints}P
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SpecialRewardsGrid;