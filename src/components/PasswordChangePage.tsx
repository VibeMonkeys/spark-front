import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../shared/api';
import { useAuth } from '../contexts/AuthContext';

interface PasswordChangePageProps {
  onBack: () => void;
  onSuccess: () => void;
  onShowNotification: (type: 'success' | 'error', title: string, message: string) => void;
}

export function PasswordChangePage({ onBack, onSuccess, onShowNotification }: PasswordChangePageProps) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 검증 규칙
  const passwordValidation = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return userApi.changePassword(user!.id, data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      onShowNotification('success', '비밀번호 변경 완료', '비밀번호가 성공적으로 변경되었습니다.');
      onSuccess();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      onShowNotification('error', '비밀번호 변경 실패', errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      onShowNotification('warning', '입력 확인', '모든 필드를 입력해주세요.');
      return;
    }

    if (!isPasswordValid) {
      onShowNotification('warning', '비밀번호 확인', '비밀번호가 보안 요구사항을 만족하지 않습니다.');
      return;
    }

    if (!doPasswordsMatch) {
      onShowNotification('warning', '비밀번호 확인', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      {isValid ? <Check className="size-3" /> : <X className="size-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              비밀번호 변경
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="size-5 text-gray-600" />
                현재 비밀번호
              </CardTitle>
              <CardDescription>
                보안을 위해 현재 비밀번호를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Password */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">새 비밀번호</CardTitle>
              <CardDescription>
                보안이 강화된 새로운 비밀번호를 설정하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">비밀번호 요구사항</h4>
                  <div className="space-y-1">
                    <ValidationItem isValid={passwordValidation.minLength} text="8자 이상" />
                    <ValidationItem isValid={passwordValidation.hasUpperCase} text="영문 대문자 포함" />
                    <ValidationItem isValid={passwordValidation.hasLowerCase} text="영문 소문자 포함" />
                    <ValidationItem isValid={passwordValidation.hasNumber} text="숫자 포함" />
                    <ValidationItem isValid={passwordValidation.hasSpecialChar} text="특수문자 포함" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirm Password */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">비밀번호 확인</CardTitle>
              <CardDescription>
                위에서 입력한 새 비밀번호를 다시 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              
              {confirmPassword && (
                <div className="mt-2">
                  {doPasswordsMatch ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="size-3" />
                      <span>비밀번호가 일치합니다</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <X className="size-3" />
                      <span>비밀번호가 일치하지 않습니다</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!currentPassword || !isPasswordValid || !doPasswordsMatch || changePasswordMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {changePasswordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </div>
        </form>

        {/* Security Tips */}
        <Card className="mt-6 border-0 bg-blue-50/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">보안 팁</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 다른 사이트와 동일한 비밀번호를 사용하지 마세요</li>
              <li>• 개인정보(생년월일, 이름 등)를 비밀번호에 포함하지 마세요</li>
              <li>• 정기적으로 비밀번호를 변경하세요</li>
              <li>• 비밀번호를 다른 사람과 공유하지 마세요</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}