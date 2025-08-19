import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Trophy, 
  Flame, 
  Star, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Clock,
  Sparkles,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDailyQuests } from '../hooks/useDailyQuests';
import { NotificationBell } from './ui/notification-bell';

interface DailyQuestPageProps {
  onBack?: () => void;
}

export const DailyQuestPage: React.FC<DailyQuestPageProps> = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState<'today' | 'stats' | 'history' | 'leaderboard'>('today');
  
  const {
    quests,
    userProgress,
    summary,
    stats,
    weeklySummary,
    monthlySummary,
    leaderboard,
    motivationalMessage,
    currentProgress,
    completedQuests,
    totalQuests,
    currentStreak,
    longestStreak,
    availableSpecialRewards,
    completeQuest,
    isUpdating,
    isLoading
  } = useDailyQuests();

  // 퀘스트 완료 처리
  const handleCompleteQuest = async (questId: string) => {
    try {
      await completeQuest(parseInt(questId));
    } catch (error) {
      // Error handled silently
    }
  };

  // 퀘스트 완료 상태 확인 (백엔드 응답에서 직접 확인)
  const isQuestCompleted = (quest: any) => {
    return quest.isCompleted;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  일일 퀘스트
                </h1>
                <p className="text-xs text-gray-500">삶을 게임처럼 즐겨라! 🎮</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="size-4" />
              </Button>
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Hero Progress Section */}
        <div className="py-6">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="size-6" />
                  <h2 className="text-xl font-bold">오늘의 진행률</h2>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {completedQuests}/{totalQuests} 완료
                </div>
                <Progress 
                  value={currentProgress} 
                  className="h-3 bg-white/20" 
                />
                <p className="text-sm opacity-90 mt-2">{currentProgress}% 달성</p>
              </div>
              
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-orange-200">
                    <Flame className="size-4" />
                    <span className="font-bold">{currentStreak}</span>
                  </div>
                  <p className="text-xs opacity-75">연속일</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-yellow-200">
                    <Trophy className="size-4" />
                    <span className="font-bold">{longestStreak}</span>
                  </div>
                  <p className="text-xs opacity-75">최고기록</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-green-200">
                    <Award className="size-4" />
                    <span className="font-bold">{availableSpecialRewards.filter(r => r.isUnlocked).length}</span>
                  </div>
                  <p className="text-xs opacity-75">특수보상</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        {motivationalMessage && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{motivationalMessage.emoji}</span>
                <div>
                  <p className="font-medium text-yellow-800">{motivationalMessage.message}</p>
                  {motivationalMessage.additionalInfo && (
                    <p className="text-sm text-yellow-600 mt-1">
                      {motivationalMessage.additionalInfo.streakCount && 
                        `🔥 ${motivationalMessage.additionalInfo.streakCount}일 연속!`}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today" className="text-xs">오늘</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">통계</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">기록</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">순위</TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-4">
            {/* Special Rewards */}
            {availableSpecialRewards.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="size-4 text-yellow-500" />
                    특수 보상
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {availableSpecialRewards.map((reward) => (
                      <div
                        key={reward.tier}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          reward.isUnlocked
                            ? 'bg-green-50 border-green-200 scale-105'
                            : currentProgress >= reward.requiredPercentage
                            ? 'bg-blue-50 border-blue-200 pulse'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="text-xl mb-1">{reward.emoji}</div>
                        <div className="text-xs font-medium mb-1">{reward.description}</div>
                        <div className="text-xs text-gray-500">{reward.requiredPercentage}%</div>
                        {reward.isUnlocked && (
                          <Badge className="mt-1 bg-green-100 text-green-700 text-xs">획득!</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quest List */}
            <div className="space-y-3">
              {quests.map((quest) => {
                const isCompleted = isQuestCompleted(quest);

                return (
                  <Card
                    key={quest.id}
                    className={`transition-all hover:shadow-md ${
                      isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white hover:border-purple-300'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{quest.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}>
                            {quest.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              +{quest.rewardPoints}P
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +5 규율
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          variant={isCompleted ? "secondary" : "default"}
                          disabled={isCompleted || isUpdating}
                          onClick={() => !isCompleted && handleCompleteQuest(quest.id)}
                          className={`${
                            isCompleted 
                              ? "bg-green-100 hover:bg-green-200" 
                              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          } min-w-[44px] h-11`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : isUpdating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <Circle className="size-5" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            {stats && (
              <>
                {/* 게임화된 전체 진행률 헤더 */}
                <Card className="bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 text-white border-0 shadow-xl overflow-hidden relative">
                  <CardContent className="p-6">
                    {/* 배경 장식 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <TrendingUp className="size-8 text-white/80" />
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                          <Trophy className="size-6 text-yellow-300" />
                          나의 퀘스트 여정
                        </h3>
                        <div className="text-sm opacity-90">일일 퀘스트 마스터가 되는 길!</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-yellow-300">{stats.totalDaysParticipated}</div>
                          <div className="text-xs opacity-75">참여일수</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-300">{stats.perfectDays}</div>
                          <div className="text-xs opacity-75">완벽한 하루</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-300">{Math.round(stats.averageCompletionRate * 100)}%</div>
                          <div className="text-xs opacity-75">평균 완료율</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 업적 및 성과 카드들 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* 연속 기록 카드 */}
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <Flame className="size-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {stats.longestStreak}일
                      </div>
                      <div className="text-sm text-orange-700 font-medium">최고 스트릭</div>
                      <div className="text-xs text-orange-600 mt-1">🔥 불타는 의지!</div>
                    </CardContent>
                  </Card>

                  {/* 퀘스트 완료 카드 */}
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Target className="size-6 text-green-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {stats.totalQuestsCompleted}개
                      </div>
                      <div className="text-sm text-green-700 font-medium">완료 퀘스트</div>
                      <div className="text-xs text-green-600 mt-1">✅ 목표 달성!</div>
                    </CardContent>
                  </Card>

                  {/* 포인트 획득 카드 */}
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Star className="size-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {stats.totalPointsEarned.toLocaleString()}P
                      </div>
                      <div className="text-sm text-purple-700 font-medium">획득 포인트</div>
                      <div className="text-xs text-purple-600 mt-1">⭐ 보상 수집!</div>
                    </CardContent>
                  </Card>

                  {/* 특수 보상 카드 */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Award className="size-6 text-yellow-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {stats.specialRewardsEarned}개
                      </div>
                      <div className="text-sm text-yellow-700 font-medium">특수 보상</div>
                      <div className="text-xs text-yellow-600 mt-1">🏆 레전드급!</div>
                    </CardContent>
                  </Card>
                </div>

                {/* 게임화된 진행률 바 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="size-4 text-blue-500" />
                      레벨업 진행률
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 완료율 진행바 */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">퀘스트 마스터 레벨</span>
                          <span className="text-sm font-bold text-blue-600">{Math.round(stats.averageCompletionRate * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.round(stats.averageCompletionRate * 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {stats.averageCompletionRate >= 0.9 ? "🌟 레전드급!" : 
                           stats.averageCompletionRate >= 0.7 ? "🔥 고수급!" : 
                           stats.averageCompletionRate >= 0.5 ? "💪 중급자!" : "🌱 성장중!"}
                        </div>
                      </div>

                      {/* 스트릭 진행바 */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">연속 달성 챔피언</span>
                          <span className="text-sm font-bold text-orange-600">{stats.longestStreak}일</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.min(stats.longestStreak * 10, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {stats.longestStreak >= 30 ? "🏆 스트릭 킹!" : 
                           stats.longestStreak >= 14 ? "🔥 화력 전개!" : 
                           stats.longestStreak >= 7 ? "💪 좋은 흐름!" : "🌱 시작이 좋아요!"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 성과 요약 카드 */}
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="size-4 text-indigo-500" />
                      나의 퀘스트 여정 요약
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="size-4 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">총 참여 기간</span>
                        </div>
                        <span className="font-bold text-blue-600">{stats.totalDaysParticipated}일간</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="size-4 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">스탯 포인트 획득</span>
                        </div>
                        <span className="font-bold text-green-600">+{stats.totalStatPointsEarned}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Trophy className="size-4 text-purple-600" />
                          </div>
                          <span className="text-sm text-gray-700">완벽한 하루 달성률</span>
                        </div>
                        <span className="font-bold text-purple-600">
                          {Math.round((stats.perfectDays / Math.max(stats.totalDaysParticipated, 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* 격려 메시지 */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {stats.averageCompletionRate >= 0.9 ? "🌟" :
                           stats.averageCompletionRate >= 0.7 ? "🔥" :
                           stats.averageCompletionRate >= 0.5 ? "💪" : "🌱"}
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {stats.averageCompletionRate >= 0.9 ? "와! 완전 레전드급이에요! 👑" :
                           stats.averageCompletionRate >= 0.7 ? "정말 대단해요! 꾸준함의 달인! 🎉" :
                           stats.averageCompletionRate >= 0.5 ? "좋은 페이스로 성장하고 있어요! 💪" : "시작이 반이에요! 화이팅! 🌟"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          매일 조금씩, 꾸준히 성장하는 당신이 최고예요!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {weeklySummary?.data && (
              <>
                {/* 주간 성과 헤더 */}
                <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Calendar className="size-6" />
                        <h3 className="text-xl font-bold">이번 주 성과</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-3xl font-bold text-yellow-300 mb-1">
                            {Math.round(parseFloat(weeklySummary.data.completionRate.replace('%', '')))}%
                          </div>
                          <div className="text-sm opacity-90">주간 완료율</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-300 mb-1">
                            {weeklySummary.data.perfectDays}일
                          </div>
                          <div className="text-sm opacity-90">완벽한 하루</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 일별 상세 기록 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="size-4 text-blue-500" />
                      일별 진행 상황
                    </CardTitle>
                    <div className="text-sm text-gray-600">매일의 퀘스트 완료 현황을 확인해보세요</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weeklySummary.data.dailyBreakdown && weeklySummary.data.dailyBreakdown.map((day, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                            day.isPerfectDay 
                              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-md' 
                              : day.completionPercentage >= 75 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                              : day.completionPercentage >= 50 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              day.isPerfectDay 
                                ? 'bg-yellow-400 text-yellow-900' 
                                : day.completionPercentage >= 75 
                                ? 'bg-green-400 text-green-900'
                                : day.completionPercentage >= 50 
                                ? 'bg-blue-400 text-blue-900'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {day.isPerfectDay ? '👑' : 
                               day.completionPercentage >= 75 ? '🔥' :
                               day.completionPercentage >= 50 ? '💪' : '🌱'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {new Date(day.date).toLocaleDateString('ko-KR', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  weekday: 'short'
                                })}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                {day.isPerfectDay && <Trophy className="size-3 text-yellow-600" />}
                                <span>
                                  {day.isPerfectDay ? '완벽한 하루!' : 
                                   day.completionPercentage >= 75 ? '훌륭해요!' :
                                   day.completionPercentage >= 50 ? '좋은 시작!' : '다음엔 더 잘해요!'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">
                                {day.completedQuests}/{day.totalQuests}
                              </div>
                              <div className="text-xs text-gray-500">
                                {day.completionPercentage}% 완료
                              </div>
                            </div>
                            <div className="w-20">
                              <Progress 
                                value={day.completionPercentage} 
                                className={`h-3 ${
                                  day.isPerfectDay ? 'bg-yellow-100' :
                                  day.completionPercentage >= 75 ? 'bg-green-100' :
                                  day.completionPercentage >= 50 ? 'bg-blue-100' : 'bg-gray-100'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 주간 요약 메시지 */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-lg mb-2">
                          {parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 90 ? '🏆' :
                           parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 70 ? '🔥' :
                           parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 50 ? '💪' : '🌱'}
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          이번 주 {parseFloat(weeklySummary.data.completionRate.replace('%', ''))}% 완료!
                        </p>
                        <p className="text-xs text-gray-600">
                          {parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 90 ? '완벽한 한 주였어요! 정말 대단합니다! 👑' :
                           parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 70 ? '훌륭한 성과예요! 꾸준함이 빛나는 한 주! ✨' :
                           parseFloat(weeklySummary.data.completionRate.replace('%', '')) >= 50 ? '좋은 페이스로 진행하고 있어요! 💫' : '다음 주에는 더 좋은 결과가 있을 거예요! 화이팅! 🌟'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            {leaderboard?.data && (
              <>
                {/* 리더보드 헤더 */}
                <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-xl overflow-hidden relative">
                  <CardContent className="p-6">
                    {/* 배경 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-2 right-2 opacity-20">
                      <Trophy className="size-16" />
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="size-8 text-yellow-200" />
                        <h3 className="text-2xl font-bold">명예의 전당</h3>
                      </div>
                      <p className="text-sm opacity-90">일일 퀘스트 챔피언들의 경쟁!</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 상위 3명 podium */}
                {leaderboard.data.leaderboard.length >= 3 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {/* 2위 */}
                    <Card className="bg-gradient-to-b from-gray-100 to-gray-300 border-2 border-gray-400">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xl">🥈</span>
                        </div>
                        <div className="font-bold text-sm text-gray-800 mb-1">
                          {leaderboard.data.leaderboard[1]?.userName}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {leaderboard.data.leaderboard[1]?.completionRate}% 완료
                        </div>
                        <div className="text-xs font-medium text-purple-600">
                          {leaderboard.data.leaderboard[1]?.totalPoints.toLocaleString()}P
                        </div>
                      </CardContent>
                    </Card>

                    {/* 1위 (더 큰 카드) */}
                    <Card className="bg-gradient-to-b from-yellow-100 to-yellow-400 border-2 border-yellow-500 transform scale-110 z-10">
                      <CardContent className="p-4 text-center">
                        <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-2xl">👑</span>
                        </div>
                        <div className="font-bold text-sm text-yellow-900 mb-1">
                          {leaderboard.data.leaderboard[0]?.userName}
                        </div>
                        <div className="text-xs text-yellow-800 mb-1">
                          {leaderboard.data.leaderboard[0]?.completionRate}% 완료
                        </div>
                        <div className="text-xs font-bold text-purple-700">
                          {leaderboard.data.leaderboard[0]?.totalPoints.toLocaleString()}P
                        </div>
                      </CardContent>
                    </Card>

                    {/* 3위 */}
                    <Card className="bg-gradient-to-b from-orange-100 to-orange-300 border-2 border-orange-400">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-300 flex items-center justify-center">
                          <span className="text-xl">🥉</span>
                        </div>
                        <div className="font-bold text-sm text-orange-800 mb-1">
                          {leaderboard.data.leaderboard[2]?.userName}
                        </div>
                        <div className="text-xs text-orange-700 mb-1">
                          {leaderboard.data.leaderboard[2]?.completionRate}% 완료
                        </div>
                        <div className="text-xs font-medium text-purple-600">
                          {leaderboard.data.leaderboard[2]?.totalPoints.toLocaleString()}P
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* 전체 순위표 */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="size-4 text-blue-500" />
                      완전 순위표
                    </CardTitle>
                    <div className="text-sm text-gray-600">완료율 기준 랭킹</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {leaderboard.data.leaderboard.slice(0, 10).map((user, index) => (
                        <div 
                          key={user.userId} 
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                            index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {/* 순위 배지 */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700' :
                            index === 2 ? 'bg-gradient-to-r from-orange-300 to-red-300 text-orange-900' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index < 3 ? 
                              (index === 0 ? '👑' : index === 1 ? '🥈' : '🥉') : 
                              (index + 1)
                            }
                          </div>

                          {/* 사용자 정보 */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900">{user.userName}</span>
                              {index < 3 && (
                                <Badge className={`text-xs ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {index === 0 ? '챔피언' : index === 1 ? '준우승' : '3등'}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Flame className="size-3 text-orange-500" />
                              <span>완료율 {user.completionRate}%</span>
                              <span>•</span>
                              <span>{user.currentStreak}일 연속</span>
                            </div>
                          </div>

                          {/* 포인트 표시 */}
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-600">
                              {user.totalPoints.toLocaleString()}P
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.perfectDays}일 완벽
                            </div>
                          </div>

                          {/* 트로피 아이콘 (상위 3명) */}
                          {index < 3 && (
                            <div className="ml-2">
                              <Trophy className={`size-4 ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-500' :
                                'text-orange-500'
                              }`} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 내 순위 카드 */}
                {leaderboard.data.userRank && (
                  <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Star className="size-5 text-purple-600" />
                          <span className="font-bold text-purple-800">나의 현재 순위</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                          <div className="text-2xl font-bold text-purple-900 mb-1">
                            {leaderboard.data.userRank.rank}위
                          </div>
                          <div className="text-sm text-purple-700 mb-2">
                            전체 {leaderboard.data.userRank.totalParticipants}명 중
                          </div>
                          <div className="text-xs text-purple-600">
                            상위 {Math.round(leaderboard.data.userRank.percentile)}% 달성!
                          </div>
                          
                          {/* 격려 메시지 */}
                          <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-700">
                            {leaderboard.data.userRank.percentile <= 10 ? "🏆 최상위권! 정말 대단해요!" :
                             leaderboard.data.userRank.percentile <= 25 ? "🔥 상위권 진입! 멋져요!" :
                             leaderboard.data.userRank.percentile <= 50 ? "💪 중간 이상! 꾸준히 해요!" :
                             "🌱 성장하고 있어요! 화이팅!"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DailyQuestPage;