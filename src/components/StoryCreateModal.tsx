import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ImageIcon, MapPin, Hash, X, FileText, Target } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storyApi } from "../shared/api";

interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  rewardPoints: number;
}

interface StoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyType: 'FREE_STORY' | 'MISSION_PROOF';
  ongoingMissions?: Mission[];
  missionId?: number;
  missionTitle?: string;
}

export function StoryCreateModal({
  isOpen,
  onClose,
  storyType,
  ongoingMissions = [],
  missionId,
  missionTitle
}: StoryCreateModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 폼 상태
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(missionId || null);
  const [storyText, setStoryText] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // 스토리 생성 mutation
  const createStoryMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // 현재는 모든 스토리를 자유 스토리로 처리 (스토리 타입은 탭에서만 구분)
      return await storyApi.createFreeStory({
        story_text: storyText,
        images,
        location: "온라인",
        is_public: isPublic,
        user_tags: userTags
      });
    },
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['story-feed-by-type'] });
      queryClient.invalidateQueries({ queryKey: ['story-feed'] });
      
      // 폼 초기화 및 모달 닫기
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error('스토리 생성 실패:', error);
      // TODO: 에러 토스트 표시
    }
  });

  const resetForm = () => {
    setSelectedMissionId(missionId || null);
    setStoryText("");
    setLocation("");
    setImages([]);
    setUserTags([]);
    setNewTag("");
    setIsPublic(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !userTags.includes(newTag.trim())) {
      setUserTags([...userTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setUserTags(userTags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) return;
    createStoryMutation.mutate();
  };

  const isFormValid = storyText.trim().length >= 10;

  const selectedMission = ongoingMissions.find(m => m.id === selectedMissionId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            스토리 작성
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6">

          {/* 스토리 텍스트 */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="story" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              스토리 내용
            </Label>
            <Textarea
              id="story"
              placeholder="오늘의 특별한 순간을 공유해주세요..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="min-h-[120px] resize-none text-sm"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {storyText.length}/500
            </p>
          </div>

          {/* 이미지 업로드 (임시 - 추후 구현) */}
          <div className="space-y-3 mb-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon className="h-4 w-4" />
              사진 (선택사항)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">사진 업로드 기능은 곧 추가될 예정입니다</p>
            </div>
          </div>

          {/* 해시태그 */}
          <div className="space-y-3 mb-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Hash className="h-4 w-4" />
              해시태그
            </Label>
            <div className="flex gap-3">
              <Input
                placeholder="태그 추가..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="px-4 text-sm"
              >
                추가
              </Button>
            </div>
            {userTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {userTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 공개 설정 */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-4">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />
            <Label htmlFor="public" className="text-sm font-medium cursor-pointer">
              다른 사용자에게 공개
            </Label>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 px-6 pb-6 -mx-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 h-11"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createStoryMutation.isPending}
              className="flex-1 h-11 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createStoryMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  작성 중...
                </div>
              ) : (
                '스토리 공유'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}