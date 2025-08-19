import React from 'react';
import { Flame, Trophy, Star, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from './utils';

interface DailyQuestStreakProps {
  currentStreak: number;
  longestStreak: number;
  perfectDays?: number;
  totalDays?: number;
  lastActiveDate?: string;
  streakMilestones?: Array<{
    days: number;
    title: string;
    emoji: string;
    achieved: boolean;
  }>;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export const DailyQuestStreak: React.FC<DailyQuestStreakProps> = ({
  currentStreak,
  longestStreak,
  perfectDays = 0,
  totalDays = 0,
  lastActiveDate,
  streakMilestones = [
    { days: 3, title: '첫 걸음', emoji: '🌱', achieved: false },
    { days: 7, title: '일주일', emoji: '⭐', achieved: false },
    { days: 14, title: '두 주', emoji: '🔥', achieved: false },
    { days: 30, title: '한 달', emoji: '💎', achieved: false },
    { days: 100, title: '백일', emoji: '👑', achieved: false },
  ],
  variant = 'default',
  className = ""
}) => {
  // 스트릭 레벨 계산
  const getStreakLevel = (streak: number) => {
    if (streak >= 100) return { level: 'legendary', color: 'from-purple-500 to-pink-500', emoji: '👑' };
    if (streak >= 30) return { level: 'master', color: 'from-yellow-400 to-orange-500', emoji: '💎' };
    if (streak >= 14) return { level: 'expert', color: 'from-red-500 to-orange-500', emoji: '🔥' };
    if (streak >= 7) return { level: 'advanced', color: 'from-blue-500 to-purple-500', emoji: '⭐' };
    if (streak >= 3) return { level: 'beginner', color: 'from-green-400 to-blue-500', emoji: '🌱' };
    return { level: 'starter', color: 'from-gray-400 to-gray-500', emoji: '🎯' };
  };

  const currentLevel = getStreakLevel(currentStreak);
  const longestLevel = getStreakLevel(longestStreak);

  // 다음 마일스톤 계산
  const nextMilestone = streakMilestones.find(m => m.days > currentStreak);
  const progress = nextMilestone 
    ? (currentStreak / nextMilestone.days) * 100 
    : 100;

  // 마일스톤 달성 상태 업데이트
  const updatedMilestones = streakMilestones.map(milestone => ({
    ...milestone,
    achieved: currentStreak >= milestone.days
  }));

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-4 p-3 bg-gradient-to-r rounded-lg text-white",
        currentLevel.color,
        className
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentLevel.emoji}</span>
          <div>
            <div className="font-bold text-lg">{currentStreak}일</div>
            <div className="text-xs opacity-90">연속</div>
          </div>
        </div>
        <div className="h-8 w-px bg-white/30"></div>
        <div className="flex items-center gap-2">
          <Trophy className="size-4 opacity-75" />
          <div>
            <div className="font-medium">{longestStreak}일</div>
            <div className="text-xs opacity-90">최고</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className={cn(
          "text-white bg-gradient-to-r",
          currentLevel.color
        )}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{currentLevel.emoji}</span>
                연속 {currentStreak}일
              </CardTitle>
              <CardDescription className="text-white/80">
                현재 스트릭 레벨: {currentLevel.level}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm opacity-90">Days</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <Flame className="size-4" />
                <span className="font-bold text-lg">{currentStreak}</span>
              </div>
              <p className="text-xs text-gray-600">현재 스트릭</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                <Trophy className="size-4" />
                <span className="font-bold text-lg">{longestStreak}</span>
              </div>
              <p className="text-xs text-gray-600">최고 기록</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Star className="size-4" />
                <span className="font-bold text-lg">{perfectDays}</span>
              </div>
              <p className="text-xs text-gray-600">완벽한 하루</p>
            </div>
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  다음 목표: {nextMilestone.title}
                </span>
                <span className="text-sm text-gray-600">
                  {currentStreak}/{nextMilestone.days}일
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full bg-gradient-to-r transition-all duration-500",
                    currentLevel.color
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {nextMilestone.days - currentStreak}일 남음
              </p>
            </div>
          )}

          {/* Milestones */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="size-4" />
              스트릭 마일스톤
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {updatedMilestones.map((milestone) => (
                <div
                  key={milestone.days}
                  className={cn(
                    "p-2 rounded border text-center transition-all",
                    milestone.achieved
                      ? "bg-green-50 border-green-200"
                      : currentStreak >= milestone.days * 0.8
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="text-lg mb-1">{milestone.emoji}</div>
                  <div className="text-xs font-medium">{milestone.title}</div>
                  <div className="text-xs text-gray-500">{milestone.days}일</div>
                  {milestone.achieved && (
                    <Badge className="mt-1 bg-green-100 text-green-700 text-xs">달성!</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Last Active */}
          {lastActiveDate && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="size-3" />
                <span>
                  마지막 활동: {new Date(lastActiveDate).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-xl bg-gradient-to-r",
              currentLevel.color
            )}>
              <span className="text-white">{currentLevel.emoji}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">스트릭</h3>
              <p className="text-sm text-gray-600">{currentLevel.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
            <div className="text-sm text-gray-600">연속일</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
              <Trophy className="size-4" />
              <span className="font-bold">{longestStreak}</span>
            </div>
            <p className="text-xs text-yellow-700">최고 기록</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Star className="size-4" />
              <span className="font-bold">{perfectDays}</span>
            </div>
            <p className="text-xs text-green-700">완벽한 하루</p>
          </div>
        </div>

        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                다음: {nextMilestone.title} {nextMilestone.emoji}
              </span>
              <span className="text-sm text-gray-600">
                {currentStreak}/{nextMilestone.days}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full bg-gradient-to-r transition-all duration-300",
                  currentLevel.color
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyQuestStreak;