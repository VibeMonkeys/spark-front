import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, DemoUser } from '../shared/api/authApi';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

// 백엔드에서 동적으로 데모 사용자를 가져옵니다

export function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 데모 사용자 목록 조회
  const { data: demoUsers, isLoading: isDemoUsersLoading } = useQuery({
    queryKey: ['demo-users'],
    queryFn: authApi.getDemoUsers,
    enabled: mode === 'demo'
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      login(response);
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      
      let errorMessage = '로그인에 실패했습니다.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    }
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (response) => {
      login(response);
    },
    onError: (error: any) => {
      console.error('Signup error:', error);
      
      let errorMessage = '회원가입에 실패했습니다.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const demoLoginMutation = useMutation({
    mutationFn: (userId: string) => authApi.demoLogin(userId),
    onSuccess: (response) => {
      login(response);
    },
    onError: (error: any) => {
      console.error('Demo login error:', error);
      setErrors({ general: '데모 로그인에 실패했습니다.' });
    }
  });

  const handleDemoLogin = () => {
    if (selectedUserId) {
      demoLoginMutation.mutate(selectedUserId);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (mode === 'signup' && formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (mode === 'signup') {
      // 비밀번호 확인 검증
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }

      // 이름 검증
      if (!formData.name) {
        newErrors.name = '이름을 입력해주세요.';
      } else if (formData.name.length < 2) {
        newErrors.name = '이름은 최소 2자 이상이어야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 기존 에러 클리어
    setErrors({});

    if (mode === 'login') {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } else if (mode === 'signup') {
      signupMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
    }
  };

  // 데모 계정 선택 화면
  if (mode === 'demo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Unified Demo Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="size-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    SPARK
                  </h1>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">데모 계정 선택</h2>
                <p className="text-gray-600">체험해볼 계정을 선택해주세요</p>
              </div>

              {/* Demo Account Selection */}
              <div className="space-y-6 mb-8">
              {isDemoUsersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">데모 계정을 불러오는 중...</p>
                </div>
              ) : (
                demoUsers?.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    selectedUserId === user.id.toString()
                      ? 'border-purple-400 bg-purple-50/50 shadow-lg'
                      : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/20'
                  }`}
                  onClick={() => setSelectedUserId(user.id.toString())}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="size-14 rounded-full object-cover ring-2 ring-purple-100"
                      />
                      {selectedUserId === user.id.toString() && (
                        <div className="absolute -top-1 -right-1 size-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          LV.{user.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-purple-600 font-medium">{user.levelTitle}</p>
                    </div>
                  </div>
                </div>
              )) || [])}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
            <Button
              onClick={handleDemoLogin}
              disabled={!selectedUserId || demoLoginMutation.isPending}
              variant="outline"
              className="w-full h-11 font-medium border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              <Sparkles className="size-4 mr-2" />
              {demoLoginMutation.isPending ? '로그인 중...' : '체험 시작하기'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setMode('login')}
              className="w-full h-11 border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              실제 로그인하기
            </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 로그인/회원가입 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Unified Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="size-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="size-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SPARK
                </h1>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                일상을 특별하게 만드는 랜덤 미션
              </p>
            </div>
            {errors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">이름</Label>
                  <div className="relative">
                    <User className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${errors.name ? 'border-red-300 focus:border-red-400' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</Label>
                <div className="relative">
                  <Mail className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${errors.email ? 'border-red-300 focus:border-red-400' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</Label>
                <div className="relative">
                  <Lock className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${errors.password ? 'border-red-300 focus:border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 h-11 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${errors.confirmPassword ? 'border-red-300 focus:border-red-400' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              )}

              <Button
                type="submit"
                variant="outline"
                disabled={loginMutation.isPending || signupMutation.isPending}
                className="w-full h-11 font-medium border-gray-300 hover:bg-gray-50"
              >
                {(loginMutation.isPending || signupMutation.isPending) ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">또는</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setMode('demo')}
                className="w-full h-11 border-gray-200 hover:bg-purple-50 hover:border-purple-300 text-gray-700"
              >
                <Sparkles className="size-4 mr-2 text-purple-500" />
                데모 계정으로 체험하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            {mode === 'login' 
              ? '계정이 없으신가요? 회원가입하기' 
              : '이미 계정이 있으신가요? 로그인하기'
            }
          </button>
        </div>
      </div>
    </div>
  );
}