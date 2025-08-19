import React, { useState, useEffect } from 'react';
import { X, Sparkles, Gift, Trophy, Star, Crown, Gem } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Dialog, DialogContent } from './dialog';
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

interface SpecialRewardNotificationProps {
  reward: SpecialReward;
  isOpen: boolean;
  onClose: () => void;
  questsCompleted?: number;
  totalQuests?: number;
  currentStreak?: number;
  additionalMessage?: string;
}

export const SpecialRewardNotification: React.FC<SpecialRewardNotificationProps> = ({
  reward,
  isOpen,
  onClose,
  questsCompleted = 0,
  totalQuests = 4,
  currentStreak = 0,
  additionalMessage
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    if (isOpen) {
      setAnimationPhase('enter');
      const timer1 = setTimeout(() => {
        setShowConfetti(true);
        setAnimationPhase('celebrate');
      }, 500);
      
      const timer2 = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  const getRewardStyles = () => {
    switch (reward.tier) {
      case 'BRONZE':
        return {
          gradient: 'from-orange-400 via-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          borderColor: 'border-orange-300',
          textColor: 'text-orange-800',
          icon: Trophy,
          sparkleColor: 'text-orange-400'
        };
      case 'SILVER':
        return {
          gradient: 'from-gray-300 via-gray-400 to-gray-500',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          icon: Star,
          sparkleColor: 'text-gray-400'
        };
      case 'GOLD':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
          bgGradient: 'from-yellow-50 to-yellow-100',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-800',
          icon: Crown,
          sparkleColor: 'text-yellow-400'
        };
      case 'PLATINUM':
        return {
          gradient: 'from-purple-400 via-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-300',
          textColor: 'text-purple-800',
          icon: Gem,
          sparkleColor: 'text-purple-400'
        };
      default:
        return {
          gradient: 'from-blue-400 via-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-300',
          textColor: 'text-blue-800',
          icon: Gift,
          sparkleColor: 'text-blue-400'
        };
    }
  };

  const styles = getRewardStyles();
  const IconComponent = styles.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="relative">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full animate-bounce",
                    styles.sparkleColor
                  )}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}

          <Card className={cn(
            "border-2 transition-all duration-500 transform",
            styles.borderColor,
            animationPhase === 'enter' && "scale-75 opacity-0",
            animationPhase === 'celebrate' && "scale-105 shadow-2xl",
            animationPhase === 'exit' && "scale-95 opacity-80"
          )}>
            <div className={cn(
              "h-2 bg-gradient-to-r",
              styles.gradient
            )}></div>
            
            <CardContent className={cn(
              "p-6 bg-gradient-to-br",
              styles.bgGradient
            )}>
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-white/50"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Main Content */}
              <div className="text-center space-y-4">
                {/* Reward Icon and Emoji */}
                <div className="relative">
                  <div className={cn(
                    "w-20 h-20 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform duration-300",
                    styles.gradient,
                    animationPhase === 'celebrate' && "animate-pulse"
                  )}>
                    <IconComponent className="size-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                    {reward.emoji}
                  </div>
                  {animationPhase === 'celebrate' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className={cn(
                        "size-6 animate-spin",
                        styles.sparkleColor
                      )} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    🎉 특수 보상 획득!
                  </h2>
                  <p className={cn(
                    "text-lg font-semibold",
                    styles.textColor
                  )}>
                    {reward.description}
                  </p>
                </div>

                {/* Reward Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={cn(
                      "text-lg px-4 py-1 bg-gradient-to-r text-white",
                      styles.gradient
                    )}>
                      +{reward.basePoints} 포인트
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>완료율: {reward.requiredPercentage}% 달성</p>
                    <p>완료한 퀘스트: {questsCompleted}/{totalQuests}</p>
                    {currentStreak > 0 && (
                      <p className="flex items-center justify-center gap-1">
                        🔥 연속 {currentStreak}일째!
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Message */}
                {additionalMessage && (
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      {additionalMessage}
                    </p>
                  </div>
                )}

                {/* Motivational Message */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    "삶을 게임처럼 즐겨라!" 🎮
                  </p>
                  <p className="text-xs text-gray-500">
                    계속해서 멋진 하루를 만들어보세요!
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={onClose}
                  className={cn(
                    "w-full bg-gradient-to-r text-white font-semibold py-2 transition-all duration-200 hover:scale-105",
                    styles.gradient
                  )}
                >
                  계속하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialRewardNotification;