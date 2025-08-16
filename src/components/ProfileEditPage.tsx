import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../shared/api/base';

interface ProfileEditData {
  name: string;
  bio: string;
  avatarUrl: string;
}

// API 함수들
const updateProfile = async (userId: string, data: ProfileEditData) => {
  const response = await api.put(`/api/v1/users/${userId}/profile`, data);
  
  if (response.data.success) {
    return response.data;
  } else {
    throw new Error(response.data.error?.message || '프로필 업데이트에 실패했습니다');
  }
};


interface ProfileEditPageProps {
  onBack?: () => void;
}

export function ProfileEditPage({ onBack }: ProfileEditPageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileEditData) => updateProfile(user.id, data),
    onSuccess: () => {
      // 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      // 성공 알림 (추후 toast로 대체)
      alert('프로필이 성공적으로 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      alert(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: name.trim(),
      bio: bio.trim(),
      avatarUrl
    });
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              프로필 편집
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-lg">프로필 이미지</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <ImageWithFallback
                  src={avatarUrl}
                  alt={name}
                  className="size-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="avatarUrl">이미지 URL</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="프로필 이미지 URL을 입력하세요"
                />
              </div>
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
                  maxLength={50}
                />
              </div>

              <div>
                <Label htmlFor="bio">한줄소개</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자신을 소개해보세요 (선택사항)"
                  maxLength={200}
                  rows={3}
                  className="resize-none"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {bio.length}/200
                </div>
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  이메일은 변경할 수 없습니다.
                </p>
              </div>
            </CardContent>
          </Card>


          {/* 저장 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}