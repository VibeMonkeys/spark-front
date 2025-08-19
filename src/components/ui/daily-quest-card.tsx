import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Star, Zap } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { cn } from './utils';

interface DailyQuestCardProps {
  quest: {
    id: number;
    type: 'MAKE_BED' | 'TAKE_SHOWER' | 'CLEAN_HOUSE' | 'GRATITUDE_JOURNAL';
    title: string;
    description: string;
    icon: string;
    order: number;
    pointsReward: number;
    statReward: number;
  };
  isCompleted: boolean;
  isLoading?: boolean;
  completedAt?: string;
  onComplete: (questId: number) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showAnimation?: boolean;
  className?: string;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  quest,
  isCompleted,
  isLoading = false,
  completedAt,
  onComplete,
  variant = 'default',
  showAnimation = true,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleComplete = async () => {
    if (isCompleted || isLoading) return;
    
    if (showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    onComplete(quest.id);
  };

  // 퀘스트 타입별 특별 스타일
  const getQuestStyles = () => {
    switch (quest.type) {
      case 'MAKE_BED':
        return {
          accentColor: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'TAKE_SHOWER':
        return {
          accentColor: 'from-cyan-500 to-cyan-600',
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-200',
          textColor: 'text-cyan-700'
        };
      case 'CLEAN_HOUSE':
        return {
          accentColor: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'GRATITUDE_JOURNAL':
        return {
          accentColor: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700'
        };
      default:
        return {
          accentColor: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const styles = getQuestStyles();

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        isCompleted 
          ? "bg-green-50 border-green-200" 
          : `${styles.bgColor} ${styles.borderColor} hover:shadow-sm`,
        isAnimating && "scale-105",
        className
      )}>
        <div className="text-2xl">{quest.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm",
            isCompleted ? "text-green-700 line-through" : "text-gray-900"
          )}>
            {quest.title}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="secondary" className="text-xs">
              +{quest.pointsReward}P
            </Badge>
            <Badge variant="secondary" className="text-xs">
              +{quest.statReward} 규율
            </Badge>
          </div>
        </div>
        <Button
          size="sm"
          variant={isCompleted ? "secondary" : "default"}
          disabled={isCompleted || isLoading}
          onClick={handleComplete}
          className={cn(
            isCompleted 
              ? "bg-green-100 hover:bg-green-200" 
              : `bg-gradient-to-r ${styles.accentColor} hover:shadow-md`,
            "min-w-[32px] h-8"
          )}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : isCompleted ? (
            <CheckCircle className="size-4 text-green-600" />
          ) : (
            <Circle className="size-4" />
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isCompleted 
          ? "bg-green-50 border-green-200 ring-2 ring-green-100" 
          : `${styles.bgColor} ${styles.borderColor} hover:${styles.borderColor.replace('border-', 'ring-2 ring-')}`,
        isAnimating && "scale-105 ring-4 ring-purple-200",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl",
              isCompleted ? "bg-green-100" : styles.bgColor
            )}>
              {quest.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isCompleted ? "text-green-700 line-through" : "text-gray-900"
                )}>
                  {quest.title}
                </h3>
                <div className="text-xs text-gray-500 ml-2">
                  #{quest.order}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {quest.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "flex items-center gap-1",
                    isCompleted ? "bg-green-100 text-green-700" : `${styles.textColor} bg-opacity-10`
                  )}>
                    <Star className="size-3" />
                    +{quest.pointsReward}P
                  </Badge>
                  <Badge className={cn(
                    "flex items-center gap-1",
                    isCompleted ? "bg-green-100 text-green-700" : `${styles.textColor} bg-opacity-10`
                  )}>
                    <Zap className="size-3" />
                    +{quest.statReward} 규율
                  </Badge>
                </div>
                
                {completedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="size-3" />
                    {new Date(completedAt).toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </div>
              
              <Button
                className={cn(
                  "w-full mt-4 transition-all duration-200",
                  isCompleted 
                    ? "bg-green-100 hover:bg-green-200 text-green-700" 
                    : `bg-gradient-to-r ${styles.accentColor} hover:shadow-lg hover:scale-105`,
                  isAnimating && "animate-pulse"
                )}
                disabled={isCompleted || isLoading}
                onClick={handleComplete}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    완료 처리 중...
                  </div>
                ) : isCompleted ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4" />
                    완료됨
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Circle className="size-4" />
                    퀘스트 완료하기
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md cursor-pointer group",
      isCompleted 
        ? "bg-green-50 border-green-200" 
        : `${styles.bgColor} ${styles.borderColor} hover:border-opacity-60`,
      isAnimating && "scale-105",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform duration-200",
            isCompleted ? "bg-green-100" : styles.bgColor,
            !isCompleted && "group-hover:scale-110"
          )}>
            {quest.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-semibold mb-1",
              isCompleted ? "text-green-700 line-through" : "text-gray-900"
            )}>
              {quest.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {quest.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  isCompleted && "bg-green-100 text-green-700"
                )}
              >
                +{quest.pointsReward}P
              </Badge>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  isCompleted && "bg-green-100 text-green-700"
                )}
              >
                +{quest.statReward} 규율
              </Badge>
            </div>
          </div>
          
          <Button
            size="lg"
            variant={isCompleted ? "secondary" : "default"}
            disabled={isCompleted || isLoading}
            onClick={handleComplete}
            className={cn(
              "flex-shrink-0 transition-all duration-200",
              isCompleted 
                ? "bg-green-100 hover:bg-green-200" 
                : `bg-gradient-to-r ${styles.accentColor} hover:shadow-lg`,
              "min-w-[44px] h-11"
            )}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isCompleted ? (
              <CheckCircle className="size-5 text-green-600" />
            ) : (
              <Circle className="size-5" />
            )}
          </Button>
        </div>
        
        {completedAt && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="size-3" />
              <span>
                {new Date(completedAt).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}에 완료
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyQuestCard;