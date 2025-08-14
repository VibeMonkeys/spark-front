import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Trophy, Star, Target, Gift, Lock, CheckCircle, X } from "lucide-react";
import { levelApi, LevelSystemResponse } from "../shared/api/levelApi";
import { useAuth } from "../contexts/AuthContext";
import { LevelProgress } from "./LevelProgress";

interface LevelSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelSystemModal: FC<LevelSystemModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("progress");

  const { data: levelSystem, isLoading, error } = useQuery<LevelSystemResponse>({
    queryKey: ['level-system', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User ID required');
      return levelApi.getLevelSystem(user.id);
    },
    enabled: isOpen && !!user?.id,
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Trophy className="size-6 text-yellow-500" />
                레벨 시스템
              </DialogTitle>
              <DialogDescription className="mt-1">
                포인트를 모아 레벨을 올리고 새로운 혜택을 얻어보세요
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : error || !levelSystem ? (
          <div className="p-6 text-center text-muted-foreground">
            레벨 시스템 정보를 불러올 수 없습니다.
          </div>
        ) : (
          <div className="p-6 pt-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress">내 진행 상황</TabsTrigger>
                <TabsTrigger value="levels">모든 레벨</TabsTrigger>
                <TabsTrigger value="titles">레벨 타이틀</TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-4 mt-4">
                <LevelProgress 
                  levelProgress={levelSystem.user_progress} 
                  showDetails={true}
                  className="mb-4"
                />

                {/* 다음 레벨 미리보기 */}
                {levelSystem.user_progress.next_level_points && (
                  <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="size-5 text-blue-500" />
                        다음 레벨 미리보기
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const nextLevel = levelSystem.all_levels.find(
                          level => level.level === levelSystem.user_progress.current_level + 1
                        );
                        return nextLevel ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{nextLevel.icon}</div>
                              <div>
                                <div className="font-semibold">
                                  레벨 {nextLevel.level} - {nextLevel.level_title_display}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {nextLevel.description}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">새로운 혜택:</div>
                              <div className="space-y-1">
                                {nextLevel.benefits.map((benefit, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Gift className="size-3 text-green-500" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="levels" className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {levelSystem.all_levels.map((level) => {
                      const isCurrentLevel = level.level === levelSystem.user_progress.current_level;
                      const isCompleted = level.level < levelSystem.user_progress.current_level;
                      const isLocked = level.level > levelSystem.user_progress.current_level + 1;

                      return (
                        <Card key={level.level} className={`
                          ${isCurrentLevel ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}
                          ${isCompleted ? 'bg-green-50/30' : ''}
                          ${isLocked ? 'opacity-60' : ''}
                        `}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div 
                                  className="size-12 rounded-full flex items-center justify-center text-xl"
                                  style={{ backgroundColor: `${level.color}20`, color: level.color }}
                                >
                                  {level.icon}
                                </div>
                                {isCompleted && (
                                  <CheckCircle className="size-4 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
                                )}
                                {isLocked && (
                                  <Lock className="size-4 text-gray-400 absolute -top-1 -right-1 bg-white rounded-full" />
                                )}
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold">
                                    레벨 {level.level}
                                  </div>
                                  <Badge 
                                    className="text-white border-0"
                                    style={{ backgroundColor: level.color }}
                                  >
                                    {level.level_title_display}
                                  </Badge>
                                  {isCurrentLevel && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                      현재
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                  {level.description}
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Trophy className="size-3" />
                                    <span>{level.required_points.toLocaleString()}P 필요</span>
                                  </div>
                                  {level.next_level_points && (
                                    <div className="flex items-center gap-1">
                                      <Target className="size-3" />
                                      <span>다음: {level.next_level_points.toLocaleString()}P</span>
                                    </div>
                                  )}
                                </div>
                                
                                {level.benefits.length > 0 && (
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-muted-foreground">혜택:</div>
                                    <div className="space-y-1">
                                      {level.benefits.slice(0, 2).map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Gift className="size-2 text-green-500" />
                                          <span>{benefit}</span>
                                        </div>
                                      ))}
                                      {level.benefits.length > 2 && (
                                        <div className="text-xs text-muted-foreground ml-3">
                                          +{level.benefits.length - 2}개 더
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="titles" className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {levelSystem.level_titles.map((titleGroup) => (
                      <Card key={titleGroup.title}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <div className="text-2xl">{titleGroup.icon}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{titleGroup.display_name}</span>
                                <Badge variant="outline">{titleGroup.level_range}</Badge>
                              </div>
                              <CardDescription className="text-sm">
                                {titleGroup.description}
                              </CardDescription>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {titleGroup.levels.map((level) => {
                              const isCompleted = level.level < levelSystem.user_progress.current_level;
                              const isCurrent = level.level === levelSystem.user_progress.current_level;
                              
                              return (
                                <div 
                                  key={level.level}
                                  className={`
                                    p-3 rounded-lg border flex items-center gap-3
                                    ${isCurrent ? 'bg-blue-50 border-blue-200' : ''}
                                    ${isCompleted ? 'bg-green-50 border-green-200' : ''}
                                    ${!isCurrent && !isCompleted ? 'bg-gray-50 border-gray-200' : ''}
                                  `}
                                >
                                  <div 
                                    className="size-8 rounded-full flex items-center justify-center text-sm"
                                    style={{ backgroundColor: `${level.color}20`, color: level.color }}
                                  >
                                    {level.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">레벨 {level.level}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {level.required_points.toLocaleString()}P
                                    </div>
                                  </div>
                                  {isCurrent && (
                                    <Badge variant="outline" className="text-xs">현재</Badge>
                                  )}
                                  {isCompleted && (
                                    <CheckCircle className="size-4 text-green-500" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};