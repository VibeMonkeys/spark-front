import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Star, Zap, Gift, Sparkles, Crown } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Dialog, DialogContent } from './dialog';
import { Progress } from './progress';
import { cn } from './utils';

interface QuestLevelUpNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  previousLevel: number;
  pointsEarned: number;
  newLevelTitle?: string;
  previousLevelTitle?: string;
  newUnlocks?: Array<{
    type: 'feature' | 'reward' | 'quest';
    title: string;
    description: string;
    icon: string;
  }>;
  streakBonus?: number;
  totalPoints?: number;
}

export const QuestLevelUpNotification: React.FC<QuestLevelUpNotificationProps> = ({
  isOpen,
  onClose,
  newLevel,
  previousLevel,
  pointsEarned,
  newLevelTitle = `레벨 ${newLevel}`,
  previousLevelTitle = `레벨 ${previousLevel}`,
  newUnlocks = [],
  streakBonus = 0,
  totalPoints = 0
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'levelUp' | 'celebrate' | 'exit'>('enter');
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const sequence = async () => {
        setAnimationPhase('enter');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAnimationPhase('levelUp');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAnimationPhase('celebrate');
        setShowFireworks(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setShowFireworks(false);
      };
      
      sequence();
    }
  }, [isOpen]);

  // 레벨에 따른 스타일링
  const getLevelStyles = (level: number) => {
    if (level >= 50) {
      return {
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        bgGradient: 'from-purple-50 to-pink-50',
        textColor: 'text-purple-800',
        emoji: '👑',
        tier: 'LEGENDARY'
      };
    }
    if (level >= 30) {
      return {
        gradient: 'from-yellow-400 via-orange-500 to-red-500',
        bgGradient: 'from-yellow-50 to-orange-50',
        textColor: 'text-orange-800',
        emoji: '💎',
        tier: 'MASTER'
      };
    }
    if (level >= 20) {
      return {
        gradient: 'from-blue-500 via-purple-500 to-pink-500',
        bgGradient: 'from-blue-50 to-purple-50',
        textColor: 'text-blue-800',
        emoji: '🌟',
        tier: 'EXPERT'
      };
    }
    if (level >= 10) {
      return {
        gradient: 'from-green-400 via-blue-500 to-indigo-500',
        bgGradient: 'from-green-50 to-blue-50',
        textColor: 'text-green-800',
        emoji: '⭐',
        tier: 'ADVANCED'
      };
    }
    return {
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      textColor: 'text-gray-800',
      emoji: '🎯',
      tier: 'BEGINNER'
    };
  };

  const currentStyles = getLevelStyles(newLevel);
  const previousStyles = getLevelStyles(previousLevel);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="relative">
          {/* Fireworks Effect */}
          {showFireworks && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  <Sparkles className="size-4 text-yellow-400" />
                </div>
              ))}
            </div>
          )}

          <Card className={cn(
            "border-2 transition-all duration-700 transform overflow-hidden",
            `border-transparent bg-gradient-to-br ${currentStyles.bgGradient}`,
            animationPhase === 'enter' && "scale-50 opacity-0",
            animationPhase === 'levelUp' && "scale-110",
            animationPhase === 'celebrate' && "scale-105 shadow-2xl ring-4 ring-yellow-300 ring-opacity-50",
            animationPhase === 'exit' && "scale-95 opacity-80"
          )}>
            {/* Animated Header Bar */}
            <div className={cn(
              "h-3 bg-gradient-to-r transition-all duration-1000",
              animationPhase === 'levelUp' ? currentStyles.gradient : previousStyles.gradient
            )}></div>
            
            <CardContent className="p-6 text-center space-y-6">
              {/* Close Button */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-white/50"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Level Up Animation */}
              <div className="space-y-4">
                <div className="text-4xl animate-bounce">{currentStyles.emoji}</div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 레벨 업!
                  </h1>
                  <p className="text-lg text-gray-700">
                    일일 퀘스트로 성장했어요!
                  </p>
                </div>

                {/* Level Transition */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br shadow-lg",
                      previousStyles.gradient
                    )}>
                      {previousLevel}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">이전</p>
                  </div>
                  
                  <TrendingUp className={cn(
                    "size-8 transition-transform duration-500",
                    animationPhase === 'levelUp' && "scale-125",
                    currentStyles.textColor
                  )} />
                  
                  <div className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br shadow-lg transition-all duration-500",
                      currentStyles.gradient,
                      animationPhase === 'levelUp' && "animate-pulse scale-110"
                    )}>
                      {newLevel}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">현재</p>
                  </div>
                </div>

                {/* Level Title */}
                <div className="space-y-1">
                  <Badge className={cn(
                    "text-lg px-4 py-1 bg-gradient-to-r text-white",
                    currentStyles.gradient
                  )}>
                    {newLevelTitle}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {currentStyles.tier} 등급
                  </p>
                </div>
              </div>

              {/* Rewards Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Star className="size-4" />
                      <span className="font-bold">+{pointsEarned}</span>
                    </div>
                    <p className="text-xs text-gray-600">포인트</p>
                  </div>
                  
                  {streakBonus > 0 && (
                    <div className="p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                        <Zap className="size-4" />
                        <span className="font-bold">+{streakBonus}</span>
                      </div>
                      <p className="text-xs text-gray-600">스트릭 보너스</p>
                    </div>
                  )}
                  
                  {totalPoints > 0 && (
                    <div className="p-3 bg-white/60 rounded-lg col-span-2">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Crown className="size-4" />
                        <span className="font-bold">{totalPoints.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-600">총 포인트</p>
                    </div>
                  )}
                </div>
              </div>

              {/* New Unlocks */}
              {newUnlocks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Gift className="size-4" />
                    새로운 기능 해금!
                  </h3>
                  <div className="space-y-2">
                    {newUnlocks.map((unlock, index) => (
                      <div key={index} className="p-3 bg-white/60 rounded-lg text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{unlock.icon}</span>
                          <span className="font-medium text-sm">{unlock.title}</span>
                        </div>
                        <p className="text-xs text-gray-600">{unlock.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivational Message */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  일일 퀘스트를 통한 꾸준한 성장! 🌱
                </p>
                <p className="text-xs text-gray-500">
                  "삶을 게임처럼 즐겨라!" 🎮
                </p>
                <p className="text-xs text-gray-500">
                  계속해서 멋진 습관을 만들어가세요!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={onClose}
                  className={cn(
                    "w-full bg-gradient-to-r text-white font-semibold py-2 transition-all duration-200 hover:scale-105",
                    currentStyles.gradient
                  )}
                >
                  계속 도전하기
                </Button>
                
                <p className="text-xs text-gray-500">
                  매일 작은 성취가 큰 변화를 만듭니다
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestLevelUpNotification;