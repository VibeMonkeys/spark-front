import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Trophy, Star, Target, TrendingUp, Info, Settings, LogOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserLevelProgress } from "../shared/api/levelApi";

interface LevelProgressProps {
  levelProgress: UserLevelProgress;
  className?: string;
  showDetails?: boolean;
  onLevelInfoClick?: () => void;
}

export const LevelProgress: FC<LevelProgressProps> = ({ 
  levelProgress, 
  className = "", 
  showDetails = false,
  onLevelInfoClick
}) => {
  const {
    current_level,
    level_title_display,
    current_points,
    total_points,
    points_to_next_level,
    level_progress_percentage,
    next_level_points,
    icon,
    color
  } = levelProgress;

  const isMaxLevel = next_level_points === null;

  return (
    <Card className={`border-0 bg-white/60 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="size-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                레벨 {current_level}
                <Badge 
                  className="text-white border-0 shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {level_title_display}
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                총 {total_points.toLocaleString()}포인트 달성
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Trophy className="size-4" />
                <span className="font-medium">{current_points.toLocaleString()}P</span>
              </div>
            </div>
            {onLevelInfoClick && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLevelInfoClick}
                className="text-blue-600 hover:text-blue-700"
              >
                <Info className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isMaxLevel ? (
          <>
            {/* 진행률 바 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">다음 레벨까지</span>
                <span className="font-medium" style={{ color: color }}>
                  {Math.round(level_progress_percentage)}%
                </span>
              </div>
              <Progress 
                value={level_progress_percentage} 
                className="h-2"
                style={{ 
                  // @ts-ignore
                  '--progress-background': color 
                }}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>현재 {current_points.toLocaleString()}P</span>
                <span>목표 {next_level_points?.toLocaleString()}P</span>
              </div>
            </div>

            {/* 필요한 포인트 */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Target className="size-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-blue-600 font-bold">{points_to_next_level.toLocaleString()}P</span> 더 모으면 레벨업!
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <Star className="size-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">최고 레벨 달성!</span>
            <Star className="size-5 text-yellow-500" />
          </div>
        )}

        {showDetails && (
          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: color }}>{current_level}</div>
              <div className="text-xs text-muted-foreground">현재 레벨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(level_progress_percentage)}%
              </div>
              <div className="text-xs text-muted-foreground">진행률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isMaxLevel ? "MAX" : points_to_next_level.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {isMaxLevel ? "최고 레벨" : "남은 포인트"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};