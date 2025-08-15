import * as React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { MissionLimitIndicator } from "./mission-limit-indicator";
import { DailyMissionLimit } from "../api/types";

interface MissionLimitExceededModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limit: DailyMissionLimit;
  onClose?: () => void;
}

export function MissionLimitExceededModal({
  open,
  onOpenChange,
  limit,
  onClose
}: MissionLimitExceededModalProps) {
  const handleClose = () => {
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <DialogTitle className="text-xl font-semibold">
            일일 미션 시작 제한 초과
          </DialogTitle>
          
          <DialogDescription className="text-sm text-gray-600">
            오늘 시작할 수 있는 미션 수를 모두 사용했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 현재 제한 상태 표시 */}
          <MissionLimitIndicator 
            limit={limit} 
            variant="danger"
            showProgress={true}
            showBadge={true}
          />

          {/* 상세 정보 */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">오늘 시작한 미션</span>
              <Badge variant="destructive">
                {limit.current_started}/{limit.max_daily_starts}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">남은 시작 가능 횟수</span>
              <span className="font-medium">
                {limit.remaining_starts}회
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">제한 초기화 시간</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium">{limit.reset_time}</span>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="font-medium text-blue-800 mb-1">
              💡 알려드려요!
            </p>
            <p>
              미션은 하루에 최대 {limit.max_daily_starts}개까지 시작할 수 있어요. 
              새로운 미션은 {limit.reset_time}에 다시 시작할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            onClick={handleClose}
            className="w-full"
          >
            확인
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full text-sm"
          >
            진행 중인 미션 보기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}