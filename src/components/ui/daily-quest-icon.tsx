import React, { useState } from 'react';
import { CheckSquare, Target, Sparkles } from 'lucide-react';
import { useDailyQuests } from '../../hooks/useDailyQuests';
import { DailyQuestModal } from './daily-quest-modal';

interface DailyQuestIconProps {
  className?: string;
}

export const DailyQuestIcon: React.FC<DailyQuestIconProps> = ({
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentProgress, completedQuests, totalQuests, hasUnlockedReward, isLoading } = useDailyQuests();

  // Debug modal state changes
  React.useEffect(() => {
    console.log('🎯 [DailyQuestIcon] Modal state changed:', isModalOpen);
  }, [isModalOpen]);

  // 진행률에 따른 아이콘 색상과 상태 결정
  const getIconState = () => {
    if (isLoading) {
      return {
        icon: Target,
        iconColor: 'text-gray-400',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        showBadge: false,
        badgeColor: '',
        badgeText: ''
      };
    }

    if (currentProgress === 100) {
      return {
        icon: hasUnlockedReward ? Sparkles : CheckSquare,
        iconColor: hasUnlockedReward ? 'text-yellow-600' : 'text-green-600',
        bgColor: hasUnlockedReward ? 'bg-yellow-50' : 'bg-green-50',
        borderColor: hasUnlockedReward ? 'border-yellow-200' : 'border-green-200',
        showBadge: true,
        badgeColor: hasUnlockedReward ? 'bg-yellow-500' : 'bg-green-500',
        badgeText: hasUnlockedReward ? '🎁' : '✓'
      };
    }

    if (currentProgress >= 75) {
      return {
        icon: Target,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        showBadge: true,
        badgeColor: 'bg-orange-500',
        badgeText: '3'
      };
    }

    if (currentProgress >= 50) {
      return {
        icon: Target,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        showBadge: true,
        badgeColor: 'bg-blue-500',
        badgeText: '2'
      };
    }

    if (currentProgress >= 25) {
      return {
        icon: Target,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        showBadge: true,
        badgeColor: 'bg-purple-500',
        badgeText: '1'
      };
    }

    return {
      icon: Target,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      showBadge: false,
      badgeColor: '',
      badgeText: ''
    };
  };

  const iconState = getIconState();
  const IconComponent = iconState.icon;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className={`p-2 h-8 w-8 rounded-full border transition-all duration-200 hover:scale-105 cursor-pointer ${iconState.bgColor} ${iconState.borderColor} hover:bg-opacity-80`}
        onClick={(e) => {
          console.log('🎯 [DailyQuestIcon] Button clicked!', { 
            isModalOpen, 
            buttonElement: e.target,
            isDisabled: e.currentTarget.disabled 
          });
          e.preventDefault();
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      >
        <IconComponent className={`size-4 ${iconState.iconColor}`} />
      </button>

      {/* 진행 상태 배지 */}
      {iconState.showBadge && (
        <div className={`absolute -top-1 -right-1 ${iconState.badgeColor} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm border border-white`}>
          {iconState.badgeText}
        </div>
      )}

      {/* 진행률 링 (100% 완료가 아닐 때만 표시) */}
      {currentProgress < 100 && currentProgress > 0 && (
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <svg className="size-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${(currentProgress / 100) * 87.96} 87.96`}
              className={iconState.iconColor}
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Special effect for completed quests */}
      {currentProgress === 100 && hasUnlockedReward && (
        <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400 opacity-20 pointer-events-none"></div>
      )}

      {/* 일일 퀘스트 모달 */}
      <DailyQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DailyQuestIcon;