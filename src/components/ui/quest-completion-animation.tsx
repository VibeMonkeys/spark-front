import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Star, Zap, Plus } from 'lucide-react';
import { cn } from './utils';

interface QuestCompletionAnimationProps {
  isVisible: boolean;
  onAnimationEnd?: () => void;
  questTitle: string;
  pointsEarned: number;
  statPointsEarned?: number;
  questIcon?: string;
  questType?: 'MAKE_BED' | 'TAKE_SHOWER' | 'CLEAN_HOUSE' | 'GRATITUDE_JOURNAL';
  className?: string;
}

export const QuestCompletionAnimation: React.FC<QuestCompletionAnimationProps> = ({
  isVisible,
  onAnimationEnd,
  questTitle,
  pointsEarned,
  statPointsEarned = 1,
  questIcon = '✅',
  questType,
  className = ""
}) => {
  const [animationPhase, setAnimationPhase] = useState<'hidden' | 'enter' | 'celebrate' | 'points' | 'exit'>('hidden');
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const sequence = async () => {
        setAnimationPhase('enter');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAnimationPhase('celebrate');
        setShowParticles(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAnimationPhase('points');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setShowParticles(false);
        setAnimationPhase('exit');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnimationPhase('hidden');
        onAnimationEnd?.();
      };
      
      sequence();
    }
  }, [isVisible, onAnimationEnd]);

  const getQuestColors = () => {
    switch (questType) {
      case 'MAKE_BED':
        return {
          bg: 'from-blue-400 to-blue-600',
          particles: 'text-blue-400',
          glow: 'shadow-blue-500/50'
        };
      case 'TAKE_SHOWER':
        return {
          bg: 'from-cyan-400 to-cyan-600',
          particles: 'text-cyan-400',
          glow: 'shadow-cyan-500/50'
        };
      case 'CLEAN_HOUSE':
        return {
          bg: 'from-green-400 to-green-600',
          particles: 'text-green-400',
          glow: 'shadow-green-500/50'
        };
      case 'GRATITUDE_JOURNAL':
        return {
          bg: 'from-purple-400 to-purple-600',
          particles: 'text-purple-400',
          glow: 'shadow-purple-500/50'
        };
      default:
        return {
          bg: 'from-indigo-400 to-indigo-600',
          particles: 'text-indigo-400',
          glow: 'shadow-indigo-500/50'
        };
    }
  };

  const colors = getQuestColors();

  if (animationPhase === 'hidden') {
    return null;
  }

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
      className
    )}>
      {/* Backdrop */}
      <div className={cn(
        "absolute inset-0 bg-black transition-opacity duration-300",
        animationPhase === 'enter' || animationPhase === 'celebrate' || animationPhase === 'points' 
          ? "opacity-30" 
          : "opacity-0"
      )} />

      {/* Particles */}
      {showParticles && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute animate-bounce",
                colors.particles
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {i % 4 === 0 ? <Sparkles className="size-4" /> :
               i % 4 === 1 ? <Star className="size-3" /> :
               i % 4 === 2 ? <Zap className="size-4" /> :
               '✨'}
            </div>
          ))}
        </div>
      )}

      {/* Main Animation */}
      <div className={cn(
        "relative transition-all duration-500 transform",
        animationPhase === 'enter' && "scale-50 opacity-0",
        animationPhase === 'celebrate' && "scale-110 opacity-100",
        animationPhase === 'points' && "scale-100 opacity-100",
        animationPhase === 'exit' && "scale-75 opacity-0"
      )}>
        {/* Quest Completion Circle */}
        <div className={cn(
          "relative w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-2xl transition-all duration-300",
          colors.bg,
          colors.glow,
          animationPhase === 'celebrate' && "animate-pulse"
        )}>
          {/* Quest Icon */}
          <div className="text-4xl mb-2">{questIcon}</div>
          
          {/* Checkmark Overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            animationPhase === 'celebrate' ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}>
            <CheckCircle className="size-16 text-white" />
          </div>

          {/* Pulse Ring */}
          <div className={cn(
            "absolute inset-0 rounded-full border-4 border-white transition-all duration-1000",
            animationPhase === 'celebrate' && "animate-ping"
          )} />
        </div>

        {/* Quest Title */}
        <div className={cn(
          "mt-6 text-center transition-all duration-300",
          animationPhase === 'celebrate' || animationPhase === 'points' 
            ? "translate-y-0 opacity-100" 
            : "translate-y-4 opacity-0"
        )}>
          <h2 className="text-xl font-bold text-white mb-2">
            퀘스트 완료! 🎉
          </h2>
          <p className="text-white/90 text-sm">
            {questTitle}
          </p>
        </div>

        {/* Points Animation */}
        <div className={cn(
          "absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500",
          animationPhase === 'points' 
            ? "translate-y-0 opacity-100" 
            : "translate-y-4 opacity-0"
        )}>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <Plus className="size-4 text-green-600" />
            <span className="font-bold text-green-700">{pointsEarned}P</span>
            {statPointsEarned > 0 && (
              <>
                <div className="w-px h-4 bg-gray-300" />
                <Zap className="size-4 text-purple-600" />
                <span className="font-bold text-purple-700">+{statPointsEarned} 규율</span>
              </>
            )}
          </div>
        </div>

        {/* Floating Emojis */}
        {animationPhase === 'celebrate' && (
          <div className="absolute inset-0">
            {['🎉', '⭐', '🌟', '💫', '✨'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className={cn(
        "absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-300",
        animationPhase === 'points' 
          ? "translate-y-0 opacity-100" 
          : "translate-y-4 opacity-0"
      )}>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg text-center">
          <p className="text-sm font-medium text-gray-800">
            훌륭해요! 계속해서 멋진 하루를 만들어가세요! 💪
          </p>
          <p className="text-xs text-gray-600 mt-1">
            "삶을 게임처럼 즐겨라!" 🎮
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestCompletionAnimation;