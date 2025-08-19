import React, { useState, useEffect } from 'react';
import { X, Target, Flame, Trophy, Star, Heart, Zap } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface QuestMotivationalToastProps {
  message: string;
  type: 'encouragement' | 'celebration' | 'reminder' | 'achievement' | 'streak' | 'milestone';
  emoji?: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  additionalInfo?: {
    streakCount?: number;
    completionRate?: number;
    questsLeft?: number;
    specialReward?: string;
  };
  position?: 'top' | 'bottom' | 'center';
  className?: string;
}

export const QuestMotivationalToast: React.FC<QuestMotivationalToastProps> = ({
  message,
  type,
  emoji,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
  action,
  additionalInfo,
  position = 'top',
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setProgress(100);
      
      if (autoClose) {
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev - (100 / (autoCloseDelay / 100));
            if (newProgress <= 0) {
              clearInterval(interval);
              onClose();
              return 0;
            }
            return newProgress;
          });
        }, 100);

        return () => clearInterval(interval);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'encouragement':
        return {
          bg: 'from-blue-500 to-indigo-600',
          bgLight: 'from-blue-50 to-indigo-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: Target,
          defaultEmoji: '💪'
        };
      case 'celebration':
        return {
          bg: 'from-yellow-400 to-orange-500',
          bgLight: 'from-yellow-50 to-orange-50',
          text: 'text-orange-800',
          border: 'border-orange-200',
          icon: Trophy,
          defaultEmoji: '🎉'
        };
      case 'reminder':
        return {
          bg: 'from-purple-500 to-pink-600',
          bgLight: 'from-purple-50 to-pink-50',
          text: 'text-purple-800',
          border: 'border-purple-200',
          icon: Heart,
          defaultEmoji: '💜'
        };
      case 'achievement':
        return {
          bg: 'from-green-500 to-emerald-600',
          bgLight: 'from-green-50 to-emerald-50',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: Star,
          defaultEmoji: '🌟'
        };
      case 'streak':
        return {
          bg: 'from-orange-500 to-red-600',
          bgLight: 'from-orange-50 to-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: Flame,
          defaultEmoji: '🔥'
        };
      case 'milestone':
        return {
          bg: 'from-pink-500 to-purple-600',
          bgLight: 'from-pink-50 to-purple-50',
          text: 'text-purple-800',
          border: 'border-purple-200',
          icon: Zap,
          defaultEmoji: '💎'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          bgLight: 'from-gray-50 to-gray-50',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: Target,
          defaultEmoji: '🎯'
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;
  const displayEmoji = emoji || styles.defaultEmoji;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 left-1/2 transform -translate-x-1/2';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 max-w-sm mx-auto px-4 pointer-events-auto",
        getPositionClasses(),
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shadow-2xl border-2 transition-all duration-300 transform",
          styles.border,
          `bg-gradient-to-br ${styles.bgLight}`,
          isAnimating ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"
        )}
      >
        {/* Progress Bar */}
        {autoClose && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className={cn(
                "h-full bg-gradient-to-r transition-all duration-100 ease-linear",
                styles.bg
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon and Emoji */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-lg relative",
              styles.bg
            )}>
              <IconComponent className="size-5" />
              <div className="absolute -top-1 -right-1 text-lg">
                {displayEmoji}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-sm leading-snug", styles.text)}>
                {message}
              </p>

              {/* Additional Info */}
              {additionalInfo && (
                <div className="mt-2 space-y-1">
                  {additionalInfo.streakCount && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Flame className="size-3 text-orange-500" />
                      <span>{additionalInfo.streakCount}일 연속!</span>
                    </div>
                  )}
                  {additionalInfo.completionRate && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Target className="size-3 text-blue-500" />
                      <span>진행률 {additionalInfo.completionRate}%</span>
                    </div>
                  )}
                  {additionalInfo.questsLeft && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Star className="size-3 text-purple-500" />
                      <span>{additionalInfo.questsLeft}개 퀘스트 남음</span>
                    </div>
                  )}
                  {additionalInfo.specialReward && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Trophy className="size-3 text-yellow-500" />
                      <span>{additionalInfo.specialReward}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              {action && (
                <Button
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    "mt-3 text-xs bg-gradient-to-r text-white hover:shadow-md transition-all duration-200",
                    styles.bg
                  )}
                >
                  {action.label}
                </Button>
              )}
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-white/50"
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 opacity-10">
          <IconComponent className="size-8" />
        </div>
        
        {/* Special Animation for Achievements */}
        {(type === 'achievement' || type === 'milestone') && isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xs opacity-60 animate-bounce"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Manager Hook for easy usage
export const useQuestMotivationalToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    props: Omit<QuestMotivationalToastProps, 'isVisible' | 'onClose'>;
  }>>([]);

  const showToast = (props: Omit<QuestMotivationalToastProps, 'isVisible' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, props }]);
    
    // Auto-remove after delay
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, (props.autoCloseDelay || 4000) + 500);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showEncouragement = (message: string, additionalInfo?: QuestMotivationalToastProps['additionalInfo']) => {
    showToast({
      message,
      type: 'encouragement',
      additionalInfo,
      position: 'top'
    });
  };

  const showCelebration = (message: string, additionalInfo?: QuestMotivationalToastProps['additionalInfo']) => {
    showToast({
      message,
      type: 'celebration',
      additionalInfo,
      position: 'top'
    });
  };

  const showReminder = (message: string, action?: QuestMotivationalToastProps['action']) => {
    showToast({
      message,
      type: 'reminder',
      action,
      position: 'top',
      autoClose: false
    });
  };

  const showStreak = (streakCount: number) => {
    showToast({
      message: `🔥 ${streakCount}일 연속! 멈출 수 없는 기세네요!`,
      type: 'streak',
      additionalInfo: { streakCount },
      position: 'top'
    });
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <QuestMotivationalToast
          key={toast.id}
          {...toast.props}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );

  return {
    showToast,
    showEncouragement,
    showCelebration,
    showReminder,
    showStreak,
    ToastContainer
  };
};

export default QuestMotivationalToast;