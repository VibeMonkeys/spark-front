import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import { DailyMissionLimit } from "../api/types";
import { Clock, Target, Zap, Moon, Sun } from "lucide-react";

const limitIndicatorVariants = cva(
  "relative overflow-hidden rounded-xl border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200",
        warning: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200",
        danger: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200", 
        success: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
        complete: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MissionLimitIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof limitIndicatorVariants> {
  limit: DailyMissionLimit;
  showProgress?: boolean;
  showBadge?: boolean;
  compact?: boolean;
}

export function MissionLimitIndicator({
  limit,
  showProgress = true,
  showBadge = true,
  compact = false,
  variant,
  className,
  ...props
}: MissionLimitIndicatorProps) {
  // 진행률 계산
  const progressPercentage = (limit.current_started / limit.max_daily_starts) * 100;
  
  // 상태에 따른 variant 자동 결정
  const autoVariant = variant || (() => {
    if (limit.current_started >= limit.max_daily_starts) return "danger";
    if (limit.current_started >= limit.max_daily_starts - 1) return "warning";
    if (limit.current_started > 0) return "success";
    return "default";
  })();

  // 아이콘 및 색상 결정
  const getStatusConfig = () => {
    if (limit.current_started >= limit.max_daily_starts) {
      return {
        icon: Moon,
        iconColor: "text-red-500",
        badgeVariant: "destructive" as const,
        progressColor: "bg-gradient-to-r from-red-400 to-pink-500",
        glowColor: "shadow-red-200"
      };
    }
    if (limit.current_started >= limit.max_daily_starts - 1) {
      return {
        icon: Zap,
        iconColor: "text-orange-500",
        badgeVariant: "secondary" as const,
        progressColor: "bg-gradient-to-r from-orange-400 to-amber-500",
        glowColor: "shadow-orange-200"
      };
    }
    if (limit.current_started > 0) {
      return {
        icon: Target,
        iconColor: "text-green-500",
        badgeVariant: "default" as const,
        progressColor: "bg-gradient-to-r from-green-400 to-emerald-500",
        glowColor: "shadow-green-200"
      };
    }
    return {
      icon: Sun,
      iconColor: "text-blue-500",
      badgeVariant: "outline" as const,
      progressColor: "bg-gradient-to-r from-blue-400 to-indigo-500",
      glowColor: "shadow-blue-200"
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm", className)} {...props}>
        <StatusIcon className={cn("size-4", statusConfig.iconColor)} />
        {showBadge && (
          <Badge variant={statusConfig.badgeVariant} className="text-xs font-medium">
            {limit.current_started}/{limit.max_daily_starts}
          </Badge>
        )}
        {showProgress && (
          <div className="flex-1 min-w-16">
            <Progress 
              value={progressPercentage} 
              className="h-1.5"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(limitIndicatorVariants({ variant: autoVariant }), statusConfig.glowColor, className)} {...props}>
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
      <div className="absolute -top-1 -right-1 size-8 bg-white/30 rounded-full blur-sm" />
      
      <div className="relative flex items-start gap-4 p-4">
        {/* 아이콘 섹션 */}
        <div className={cn(
          "flex items-center justify-center size-12 rounded-xl shadow-sm transition-all duration-300",
          limit.current_started >= limit.max_daily_starts 
            ? "bg-gradient-to-br from-red-100 to-red-200" 
            : limit.current_started >= limit.max_daily_starts - 1
            ? "bg-gradient-to-br from-orange-100 to-orange-200"
            : limit.current_started > 0
            ? "bg-gradient-to-br from-green-100 to-green-200"
            : "bg-gradient-to-br from-blue-100 to-blue-200"
        )}>
          <StatusIcon className={cn("size-6", statusConfig.iconColor)} />
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span>일일 미션 제한</span>
                {showBadge && (
                  <Badge variant={statusConfig.badgeVariant} className="text-xs font-bold px-2 py-0.5">
                    {limit.current_started}/{limit.max_daily_starts}
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-gray-600">
                {limit.can_start 
                  ? `${limit.remaining_starts}회 더 시작할 수 있어요` 
                  : "오늘의 미션 시작 횟수를 모두 사용했어요"}
              </p>
            </div>
          </div>
          
          {showProgress && (
            <div className="space-y-2">
              <div className="relative">
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-gray-200 overflow-hidden"
                />
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-500 shadow-sm",
                    statusConfig.progressColor
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="size-3" />
                  <span className="font-medium">{limit.reset_time} 초기화</span>
                </div>
                
                {!limit.can_start && (
                  <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <span className="font-medium">제한 도달</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { limitIndicatorVariants };