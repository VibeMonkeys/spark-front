import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../components/ui/utils";
import { DailyMissionLimit } from "../api/types";

const limitIndicatorVariants = cva(
  "flex items-center gap-2 p-2 rounded-lg border",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        warning: "bg-orange-50 border-orange-200",
        danger: "bg-red-50 border-red-200",
        success: "bg-green-50 border-green-200",
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

  // Badge variant 결정
  const badgeVariant = limit.can_start ? "default" : "destructive";

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        {showBadge && (
          <Badge variant={badgeVariant} className="text-xs">
            {limit.current_started}/{limit.max_daily_starts}
          </Badge>
        )}
        {showProgress && (
          <Progress 
            value={progressPercentage} 
            className="w-16 h-1.5"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn(limitIndicatorVariants({ variant: autoVariant }), className)} {...props}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            일일 미션 시작 제한
          </span>
          {showBadge && (
            <Badge variant={badgeVariant}>
              {limit.current_started}/{limit.max_daily_starts}
            </Badge>
          )}
        </div>
        
        {showProgress && (
          <div className="space-y-1">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {limit.remaining_starts}회 남음
              </span>
              <span>
                {limit.reset_time} 초기화
              </span>
            </div>
          </div>
        )}
        
        {!limit.can_start && (
          <p className="text-xs text-destructive mt-1">
            오늘 미션 시작 제한에 도달했습니다
          </p>
        )}
      </div>
    </div>
  );
}

export { limitIndicatorVariants };