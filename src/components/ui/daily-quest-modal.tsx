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

  // 전역 클릭 이벤트로 모달 닫기
  useEffect(() => {
    const handleClick = () => {
      if (isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // 약간의 딜레이를 두어 모달 열기 클릭과 겹치지 않도록 함
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [isOpen, onClose]);

  // 퀘스트 완료 처리
  const handleCompleteQuest = async (questId: number) => {
    try {
      await completeQuest(questId);
    } catch (error) {
      console.error('Quest completion failed:', error);
    }
  };

  // 퀘스트 초기화 처리
  const handleInitializeQuests = async () => {
    try {
      await initializeDailyQuests();
    } catch (error) {
      console.error('Quest initialization failed:', error);
    }
  };

  // 퀘스트와 진행 상황을 매칭
  const getQuestProgress = (questId: number) => {
    return userProgress?.find(progress => progress.questId === questId);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[360px] h-[520px] mx-auto bg-white rounded-3xl border-0 shadow-2xl">
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
      <DialogContent className="w-[360px] h-[520px] mx-auto overflow-hidden flex flex-col bg-white rounded-3xl border-0 shadow-2xl p-0">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full hover:bg-white/80 transition-all duration-200"
          >
            <X className="size-4 text-gray-600" />
          </Button>
          <div>
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
          
          {/* Progress Summary Card */}
          <div className="mt-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">오늘의 진행률</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-400 rounded-md flex items-center justify-center">
                  <Flame className="size-2.5 text-white" />
                </div>
                <span className="text-sm font-bold text-orange-600">{currentStreak}일</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <Progress value={currentProgress} className="h-2 bg-gray-100 rounded-full" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {completedQuests}/{totalQuests}
              </span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {currentProgress}% 완료 • {4 - completedQuests}개 남음
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          {activeTab === 'today' && (
            <div className="px-4 py-3 space-y-4">
              {/* Motivational Message */}
              {motivationalMessage && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">{motivationalMessage.emoji}</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-amber-900 leading-relaxed">
                        {motivationalMessage.message}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        오늘도 멋진 하루 만들어가요! ✨
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">📋 퀘스트</h3>
                  <div className="text-xs text-gray-600 font-medium">
                    {completedQuests}/{totalQuests || 4} 완료
                  </div>
                </div>
                
                <div className="space-y-2">
                  {quests.length === 0 ? (
                    // 로딩 중이거나 초기화 중일 때 스켈레톤 표시
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 animate-pulse">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
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
                        <div key={quest.id} className="relative">
                          <div
                            className={`bg-white rounded-lg p-3 border transition-all duration-200 hover:shadow-md ${
                              isCompleted
                                ? 'border-green-200 bg-green-50/50 shadow-sm'
                                : 'border-gray-200 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                                isCompleted 
                                  ? 'bg-green-100' 
                                  : 'bg-gradient-to-br from-purple-50 to-blue-50'
                              }`}>
                                {quest.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold mb-0.5 ${
                                  isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                                }`}>
                                  {quest.title}
                                </h4>
                                <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">
                                  {quest.description}
                                </p>
                                <div className="flex items-center gap-1">
                                  <div className="bg-purple-100 text-purple-700 text-xs font-bold py-0.5 px-1.5 rounded-full">
                                    +{quest.pointsReward}P
                                  </div>
                                  <div className="bg-blue-100 text-blue-700 text-xs font-bold py-0.5 px-1.5 rounded-full">
                                    +{quest.statReward} 규율
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="size-3.5 text-white" />
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    disabled={isUpdating}
                                    onClick={() => handleCompleteQuest(quest.id)}
                                    className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 
                                             hover:from-purple-600 hover:to-blue-600 rounded-lg p-0
                                             shadow-lg hover:shadow-xl transition-all duration-200"
                                  >
                                    <Circle className="size-3.5 text-white" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* 완료 상태 프로그레스 바 */}
                          <div className="mt-1 px-3">
                            <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ease-out ${
                                  isCompleted 
                                    ? 'w-full bg-gradient-to-r from-green-400 to-green-500' 
                                    : 'w-0 bg-gray-200'
                                }`}
                              />
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
            <div className="p-4 space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalDaysParticipated}
                  </div>
                  <div className="text-sm text-purple-700">참여일수</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(stats.averageCompletionRate)}%
                  </div>
                  <div className="text-sm text-blue-700">평균 완료율</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.longestStreak}
                  </div>
                  <div className="text-sm text-orange-700">최고 스트릭</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.perfectDays}
                  </div>
                  <div className="text-sm text-green-700">완벽한 하루</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">총 완료한 퀘스트</span>
                  <span className="font-medium">{stats.totalQuestsCompleted}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">획득한 포인트</span>
                  <span className="font-medium">{stats.totalPointsEarned.toLocaleString()}P</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">획득한 스탯</span>
                  <span className="font-medium">{stats.totalStatPointsEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">특수 보상</span>
                  <span className="font-medium">{stats.specialRewardsEarned}회</span>
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