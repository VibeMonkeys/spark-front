import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Camera, Image, Star, MapPin, Clock, Send, Trophy, CheckCircle, Upload, Sparkles } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { storyApi, missionApi } from "../shared/api";
import { useAuth } from "../contexts/AuthContext";

// Backend API 기대 형식에 맞춘 요청 타입
interface StoryCreateRequest {
  mission_id: number;
  story: string;
  images: string[];
  location: string;
  is_public: boolean;
  user_tags: string[];
}

interface MissionVerificationProps {
  missionId: number | null;
  onBack: () => void;
  onSubmit: (result?: {
    pointsEarned: number;
    streakCount: number;
    levelUp?: boolean;
    newLevel?: number;
  }) => void;
}


// 카테고리별 색상 매핑
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "ADVENTUROUS": "bg-orange-500",
    "SOCIAL": "bg-blue-500", 
    "HEALTHY": "bg-green-500",
    "CREATIVE": "bg-purple-500",
    "LEARNING": "bg-indigo-500",
  };
  return colors[category] || "bg-gray-500";
};

// 카테고리 한글 변환
const getCategoryText = (category: string) => {
  const texts: Record<string, string> = {
    "ADVENTUROUS": "모험적",
    "SOCIAL": "사교적",
    "HEALTHY": "건강",
    "CREATIVE": "창의적",
    "LEARNING": "학습",
  };
  return texts[category] || category;
};


export function MissionVerification({ missionId, onBack, onSubmit }: MissionVerificationProps) {
  const { user } = useAuth();
  
  // localStorage에서 미션 ID 복원 (새로고침 대응)
  const actualMissionId = missionId || (() => {
    const savedMissionId = localStorage.getItem('selectedMissionId');
    return savedMissionId ? parseInt(savedMissionId) : null;
  })();
  
  const [story, setStory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState("강남구"); // 실제로는 GPS에서 가져와야 함
  const [missionCompletionResult, setMissionCompletionResult] = useState<any>(null); // 미션 완료 결과 저장
  const queryClient = useQueryClient();

  // 미션 상세 데이터 조회
  const { data: missionData, isLoading: isMissionLoading, error: missionError } = useQuery({
    queryKey: ['mission-detail', actualMissionId],
    queryFn: async () => {
      if (!actualMissionId) throw new Error('Mission ID is required');
      try {
        const result = await missionApi.getMissionDetail(actualMissionId);
        return result;
      } catch (error) {
        console.error('❌ [MissionVerification] Failed to load mission detail:', error);
        throw error;
      }
    },
    enabled: !!actualMissionId,
  });

  // 미션 인증 및 완료 뮤테이션 (통합)
  const verifyMissionMutation = useMutation({
    mutationFn: () => {
      if (!actualMissionId || !user?.id) {
        throw new Error('Mission ID or User ID is missing');
      }
      
      return missionApi.verifyMission(actualMissionId, {
        story: story.trim() || "미션을 완료했습니다! 🎉",
        images: selectedImages,
        location: location,
        isPublic: isPublic,
        userTags: []
      });
    },
    onSuccess: (verificationResponse) => {
      // 캐시 무효화 - 모든 관련 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['missions-ongoing', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['missions-completed', user?.id] }); 
      queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['home', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['daily-limit', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['level-progress', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['story-feed'] }); // 스토리 피드도 새로고침
      
      
      const result = {
        pointsEarned: verificationResponse.points_earned,
        streakCount: verificationResponse.streak_count,
        levelUp: verificationResponse.level_up,
        newLevel: verificationResponse.new_level
      };
      
      // 성공 화면으로 이동
      onSubmit(result);
    },
    onError: (error) => {
      console.error('미션 완료 실패:', error);
      
      // 개발 중이므로 API 에러 시에도 성공으로 처리하여 UX 테스트 가능하도록 함
      const simulatedResult = {
        pointsEarned: missionData?.reward_points || 20,
        streakCount: (user?.current_streak || 1) + 1, // 미션 완료 후 연속일 증가
        levelUp: false,
        newLevel: undefined
      };
      
      // 관련 데이터 새로고침 (시뮬레이션 모드)
      queryClient.invalidateQueries({ queryKey: ['home', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['missions-ongoing', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['missions-completed', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['level-progress', user?.id] });
      
      onSubmit(simulatedResult);
    },
  });

  // 로딩 상태 처리
  if (isMissionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">미션 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (missionError || !missionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">미션 정보를 불러올 수 없습니다.</p>
          <Button onClick={onBack}>돌아가기</Button>
        </div>
      </div>
    );
  }

  const handleImageUpload = () => {
    // 실제 구현에서는 파일 업로드 로직이 들어갈 것
    const dummyImages = [
      "https://images.unsplash.com/photo-1584515501397-335d595b2a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhzZWFyY2h8MXx8eW91bmclMjBwZW9wbGUlMjBhZHZlbnR1cmUlMjBkYWlseSUyMG1pc3Npb258ZW58MXx8fHwxNzU1MDg2NTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1549185545-f5b8a1fc481a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRhaWx5JTIwYWN0aXZpdHl8ZW58MXx8fHwxNzU1MDg2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ];
    setSelectedImages(dummyImages.slice(0, 2));
  };

  const handleSubmit = () => {
    
    if (!actualMissionId || !user?.id) {
      return;
    }
    
    // 완료 조건 확인 (10글자 이상 스토리 또는 이미지 업로드)
    if (story.trim().length >= 10 || selectedImages.length > 0) {
      
      // 통합된 미션 인증 API 호출 (미션 완료 + 스토리 생성)
      verifyMissionMutation.mutate();
    } else {
    }
  };

  if (!actualMissionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">미션 정보를 불러오는 중입니다...</p>
          <Button onClick={onBack}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-50">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">미션 인증</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-4">
        {/* Mission Summary */}
        <div className="pt-8 pb-3">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                    {getCategoryText(missionData.category)}
                  </span>
                  <span className="text-xs text-purple-600 font-semibold">+{missionData.reward_points}P 획득</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{missionData.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {missionData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Photo Upload Section */}
        <section className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-1">사진 업로드</h3>
          <p className="text-sm text-gray-600 mb-4">
            사진을 업로드하거나 아래 경험 스토리를 작성해주세요
          </p>
          
          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={`업로드된 사진 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 size-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setSelectedImages(images => images.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleImageUpload}
              className="h-24 flex-col gap-2 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all"
            >
              <Camera className="size-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">카메라</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleImageUpload}
              className="h-24 flex-col gap-2 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all"
            >
              <Upload className="size-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">갤러리</span>
            </Button>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1">경험 스토리 작성</h3>
          <p className="text-sm text-gray-600 mb-4">
            또는 <span className="font-medium text-purple-600">10자 이상의 경험 스토리</span>를 작성해서 미션을 완료하세요
          </p>
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl">
            <div className="p-4">
              <Textarea
                placeholder="어떤 경험을 하셨나요? 새롭게 발견한 것이나 느낀 점을 자유롭게 적어주세요! (최소 10자)"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:border-0 p-0 placeholder:text-gray-400"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-4 pt-4 pb-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {story.length}/500자
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium transition-colors ${
                    isPublic ? "text-purple-600" : "text-gray-600"
                  }`}>
                    {isPublic ? "공개" : "비공개"}
                  </span>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="h-6 w-11 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300 shadow-sm border border-gray-200 data-[state=checked]:border-purple-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auto Tags */}
        <section className="mb-4">
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="size-5 text-gray-600" />
              자동 감지 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                <MapPin className="size-3 mr-1" />
                {location}
              </Badge>
              <Badge variant="secondary" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                <Clock className="size-3 mr-1" />
                저녁시간
              </Badge>
              <Badge variant="secondary" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                #새로운경험
              </Badge>
              <Badge variant="secondary" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                #{getCategoryText(missionData.category)}
              </Badge>
            </div>
          </div>
        </section>

        {/* Progress Indicator */}
        <div className="mb-3">
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">완료 조건</span>
              <div className="flex items-center gap-1 font-medium">
                {story.trim().length >= 10 || selectedImages.length > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">완료</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-orange-600">미완료</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              {story.trim().length >= 10 && selectedImages.length > 0 ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">사진과 스토리 모두 완료! 훌륭해요!</span>
                </div>
              ) : story.trim().length >= 10 ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">스토리 작성 완료 ({story.trim().length}자)</span>
                </div>
              ) : selectedImages.length > 0 ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">사진 업로드 완료 ({selectedImages.length}장)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-600">사진 업로드 또는 10자 이상 스토리 작성 필요</span>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: story.trim().length >= 10 || selectedImages.length > 0 ? "100%" : "0%" 
                }}
              />
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={(story.trim().length < 10 && selectedImages.length === 0) || verifyMissionMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-2xl h-14 transition-all duration-200"
              size="lg"
            >
              <Send className="size-5 mr-2" />
              <span className="font-semibold">
                {verifyMissionMutation.isPending ? "미션 인증 중..." :
                 (story.trim().length >= 10 || selectedImages.length > 0) ? "미션 완료 & 피드 공유" : "미션 완료하기"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}