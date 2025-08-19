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
      console.error('Quest completion failed:', error);
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
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.totalDaysParticipated}
                      </div>
                      <div className="text-sm text-purple-700">참여일수</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(stats.averageCompletionRate)}%
                      </div>
                      <div className="text-sm text-blue-700">평균 완료율</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.perfectDays}
                      </div>
                      <div className="text-sm text-orange-700">완벽한 하루</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.specialRewardsEarned}
                      </div>
                      <div className="text-sm text-green-700">특수 보상</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">상세 통계</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                      <span className="text-sm text-gray-600">최고 스트릭</span>
                      <span className="font-medium">{stats.longestStreak}일</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {weeklySummary?.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="size-4" />
                    이번 주 성과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {Math.round(weeklySummary.data.completionRate)}%
                      </div>
                      <div className="text-sm text-blue-700">완료율</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {weeklySummary.data.perfectDays}
                      </div>
                      <div className="text-sm text-purple-700">완벽한 하루</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {weeklySummary.data.dailyBreakdown.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {new Date(day.date).toLocaleDateString('ko-KR', { 
                              month: 'short', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </span>
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
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            {leaderboard?.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    주간 리더보드
                  </CardTitle>
                  <CardDescription>완료율 기준 순위</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.data.leaderboard.slice(0, 10).map((user, index) => (
                      <div key={user.userId} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.userName}</div>
                          <div className="text-xs text-gray-500">
                            완료율 {user.completionRate}% • {user.currentStreak}일 연속
                          </div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">
                          {user.totalPoints.toLocaleString()}P
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {leaderboard.data.userRank && (
                    <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
                      <div className="text-center">
                        <div className="text-sm text-purple-700">내 순위</div>
                        <div className="font-bold text-purple-900">
                          {leaderboard.data.userRank.rank}위 / {leaderboard.data.userRank.totalParticipants}명
                        </div>
                        <div className="text-xs text-purple-600">
                          상위 {Math.round(leaderboard.data.userRank.percentile)}%
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DailyQuestPage;