import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Circle, Trophy, Flame, Star, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';
import { useDailyQuests } from '../../hooks/useDailyQuests';
import { Badge } from './badge';
import { Progress } from './progress';

interface DailyQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyQuestModal: React.FC<DailyQuestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'weekly'>('today');
  const {
    quests,
    userProgress,
    summary,
    stats,
    weeklySummary,
    motivationalMessage,
    currentProgress,
    completedQuests,
    totalQuests,
    currentStreak,
    longestStreak,
    availableSpecialRewards,
    completeQuest,
    initializeDailyQuests,
    isUpdating,
    isLoading
  } = useDailyQuests();

  // 모달이 열릴 때 퀘스트가 없으면 자동으로 초기화
  useEffect(() => {
    if (isOpen && !isLoading && quests.length === 0) {
      initializeDailyQuests();
    }
  }, [isOpen, isLoading, quests.length, initializeDailyQuests]);

  // 모달 외부 클릭 시만 닫기 (내부 클릭은 무시)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen) {
        const modalContent = document.querySelector('[data-dialog-content="true"]');
        if (modalContent && !modalContent.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      // 약간의 딜레이를 두어 모달 열기 클릭과 겹치지 않도록 함
      const timer = setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  // 퀘스트 완료 처리
  const handleCompleteQuest = async (questId: number) => {
    try {
      await completeQuest(questId);
    } catch (error) {
      // Error handled silently
    }
  };

  // 퀘스트 초기화 처리
  const handleInitializeQuests = async () => {
    try {
      await initializeDailyQuests();
    } catch (error) {
      // Error handled silently
    }
  };

  // 퀘스트와 진행 상황을 매칭
  const getQuestProgress = (questId: number) => {
    return userProgress?.find(progress => progress.questId === questId);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[371px] h-[580px] mx-auto bg-white rounded-3xl border-0 shadow-2xl">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-3">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">퀘스트 불러오는 중...</h3>
            <p className="text-xs text-gray-600 text-center">
              잠시만 기다려주세요 ✨
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[371px] h-[640px] mx-auto overflow-hidden flex flex-col bg-white rounded-3xl border-0 shadow-2xl p-0" data-dialog-content="true">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full hover:bg-white/80 transition-all duration-200"
          >
            <X className="size-4 text-gray-600" />
          </Button>
          <div className="mt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  오늘의 퀘스트
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  매일 성장하는 나를 만나보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="px-4 py-2 bg-gray-50/50">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'today' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('today')}
            >
              오늘
            </button>
            <button
              className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'stats' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              통계
            </button>
            <button
              className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'weekly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('weekly')}
            >
              주간
            </button>
          </div>
          
          {/* Progress Summary - Subtle */}
          <div className="mt-2 px-2 py-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-gray-600">진행률</span>
                <span className="font-bold text-gray-800">
                  {completedQuests}/{totalQuests}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded flex items-center justify-center">
                  <Flame className="size-1.5 text-white" />
                </div>
                <span className="text-xs font-medium text-orange-600">{currentStreak}일</span>
                <span className="text-xs font-medium text-gray-600">{currentProgress}%</span>
              </div>
            </div>
            <div className="mt-1.5">
              {/* Custom Progress Bar */}
              <div className="relative w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              {/* Progress Scale */}
              <div className="relative mt-1 mb-4">
                <div className="absolute left-0 top-0">
                  <span className="text-xs text-gray-400 font-medium">0</span>
                </div>
                <div className="absolute left-1/4 top-0 -translate-x-1/2">
                  <span className="text-xs text-gray-400 font-medium">25</span>
                </div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2">
                  <span className="text-xs text-gray-400 font-medium">50</span>
                </div>
                <div className="absolute left-3/4 top-0 -translate-x-1/2">
                  <span className="text-xs text-gray-400 font-medium">75</span>
                </div>
                <div className="absolute right-0 top-0">
                  <span className="text-xs text-gray-400 font-medium">100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50/30 overflow-y-auto">
          {activeTab === 'today' && (
            <div className="px-4 py-3 space-y-4">

              {/* Special Rewards */}
              {availableSpecialRewards.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">🏆 달성 가능한 보상</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {availableSpecialRewards.map((reward) => (
                      <div
                        key={reward.tier}
                        className={`p-5 rounded-2xl border transition-all duration-200 ${
                          reward.isUnlocked
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg'
                            : currentProgress >= reward.requiredPercentage
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3">{reward.emoji}</div>
                          <div className="text-sm font-bold text-gray-900 mb-1">{reward.description}</div>
                          <div className="text-xs text-gray-600">{reward.requiredPercentage}% 달성</div>
                          {reward.isUnlocked && (
                            <div className="mt-3 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-full">
                              🎉 획득!
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quest List */}
              <div className="space-y-3">
                <div className="space-y-2">
                  {quests.length === 0 ? (
                    // 로딩 중이거나 초기화 중일 때 스켈레톤 표시
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-100 animate-pulse shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded mb-1 w-20"></div>
                            <div className="h-2 bg-gray-200 rounded mb-2 w-28"></div>
                            <div className="flex gap-1">
                              <div className="h-4 bg-gray-200 rounded-full w-10"></div>
                              <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                            </div>
                          </div>
                          <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    quests.map((quest) => {
                      const progress = getQuestProgress(quest.id);
                      const isCompleted = progress?.isCompleted || false;

                      return (
                        <div key={quest.id} className="relative group">
                          <div
                            className={`bg-white rounded-lg p-3 border transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                              isCompleted
                                ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm'
                                : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* 아이콘 영역 */}
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                                isCompleted 
                                  ? 'bg-gradient-to-br from-emerald-100 to-green-100' 
                                  : 'bg-gradient-to-br from-purple-100 to-blue-100 group-hover:scale-105'
                              }`}>
                                {quest.icon}
                              </div>
                              
                              {/* 내용 영역 */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold mb-0.5 transition-all duration-200 ${
                                  isCompleted ? 'text-emerald-700 line-through opacity-75' : 'text-gray-900'
                                }`}>
                                  {quest.title}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                                  {quest.description}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-bold py-1 px-2 rounded-full border border-purple-200">
                                    +3P
                                  </div>
                                </div>
                              </div>
                              
                              {/* 완료 버튼 영역 */}
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
                                    <CheckCircle className="size-3.5 text-white drop-shadow-sm" />
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    disabled={isUpdating}
                                    onClick={() => handleCompleteQuest(quest.id)}
                                    className="bg-gradient-to-br from-purple-500 to-blue-500 
                                             hover:from-purple-600 hover:to-blue-600 text-white text-xs
                                             shadow-md hover:shadow-lg transition-all duration-200
                                             hover:scale-105 active:scale-95 border-0 px-3 py-1.5 h-auto rounded-lg"
                                  >
                                    완료하기
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div className="p-5 bg-white">
              {/* 핵심 지표 - 대시보드 스타일 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">퀘스트 현황</h3>
                  <div className="text-2xl">
                    {(stats.averageCompletionRate || 0) >= 80 ? '🔥' : 
                     (stats.averageCompletionRate || 0) >= 60 ? '💪' : '🌱'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm opacity-90 mb-1">전체 완료율</div>
                      <div className="text-3xl font-bold">
                        {Math.round(stats.averageCompletionRate || 0)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90 mb-1">연속 기록</div>
                      <div className="text-2xl font-semibold">
                        {stats.longestStreak || 0}일
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 간단한 통계 그리드 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalDaysParticipated || 0}
                  </div>
                  <div className="text-sm text-gray-600">참여일</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalQuestsCompleted || 0}
                  </div>
                  <div className="text-sm text-gray-600">완료 퀘스트</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.perfectDays || 0}
                  </div>
                  <div className="text-sm text-gray-600">완벽한 날</div>
                </div>
              </div>

              {/* 포인트 & 보상 섹션 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">획득 포인트</span>
                  <span className="font-semibold text-gray-900">
                    {(stats.totalPointsEarned || 0).toLocaleString()}P
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">스탯 포인트</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalStatPointsEarned || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">특수 보상</span>
                  <span className="font-semibold text-gray-900">
                    {stats.specialRewardsEarned || 0}개
                  </span>
                </div>
              </div>

              {/* 간단한 메시지 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
                <div className="text-sm text-gray-700">
                  {(stats.averageCompletionRate || 0) >= 80 ? '🎉 멋진 성과를 보여주고 있어요!' :
                   (stats.averageCompletionRate || 0) >= 60 ? '👍 꾸준히 잘하고 있어요!' :
                   '🌟 좋은 시작이에요. 화이팅!'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weekly' && weeklySummary?.data && (
            <div className="p-4 space-y-4">
              {/* Weekly Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">이번 주 성과</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(weeklySummary.data.completionRate)}%
                    </div>
                    <div className="text-sm text-blue-700">완료율</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {weeklySummary.data.perfectDays}
                    </div>
                    <div className="text-sm text-purple-700">완벽한 하루</div>
                  </div>
                </div>
              </div>

              {/* Daily Breakdown */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">일별 현황</h3>
                {weeklySummary.data.dailyBreakdown.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString('ko-KR', { 
                          month: 'short', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </div>
                      {day.isPerfectDay && (
                        <Trophy className="size-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {day.completedQuests}/{day.totalQuests}
                      </span>
                      <div className="w-16">
                        <Progress value={day.completionPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200/50">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">매일 자정에 새로운 퀘스트가 시작됩니다</span>
            </div>
            <p className="text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              "삶을 게임처럼 즐겨라!" 🎮
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyQuestModal;