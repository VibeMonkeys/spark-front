import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../shared/api/authApi';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

// 개발용 테스트 계정 (init_data.sql에서 생성된 사용자들)
const availableUsers = [
  { 
    id: '5', 
    name: '테스트유저1', 
    email: 'testuser1@spark.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 5,
    levelTitle: 'EXPLORER',
    currentPoints: 450,
    totalPoints: 1200
  },
  { 
    id: '6', 
    name: '테스트유저2', 
    email: 'testuser2@spark.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e6e3e7?w=150&h=150&fit=crop&crop=face',
    level: 8,
    levelTitle: 'EXPLORER',
    currentPoints: 720,
    totalPoints: 2500
  },
  { 
    id: '7', 
    name: '고급유저', 
    email: 'premium@spark.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 15,
    levelTitle: 'ADVENTURER',
    currentPoints: 1800,
    totalPoints: 8500
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleDemoLogin = () => {
    if (selectedUserId) {
      const user = availableUsers.find(u => u.id === selectedUserId);
      if (user) {
        login({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar_url: user.avatar,
            level: user.level,
            level_title: user.levelTitle,
            current_points: user.currentPoints,
            total_points: user.totalPoints,
            current_streak: user.level >= 15 ? 25 : user.level >= 8 ? 12 : 5,
            longest_streak: user.level >= 15 ? 45 : user.level >= 8 ? 25 : 12,
            completed_missions: user.level >= 15 ? 85 : user.level >= 8 ? 35 : 18,
            total_days: user.level >= 15 ? 120 : user.level >= 8 ? 42 : 25,
            join_date: '2024-01-01',
            preferences: {},
            statistics: {
              category_stats: [],
              this_month_points: user.currentPoints,
              this_month_missions: user.level >= 15 ? 35 : user.level >= 8 ? 15 : 8,
              average_rating: user.level >= 15 ? 4.8 : user.level >= 8 ? 4.2 : 4.5
            }
          },
          token: 'demo_token',
          refreshToken: 'demo_refresh_token'
        });
      }
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
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    selectedUserId === user.id
                      ? 'border-purple-400 bg-purple-50/50 shadow-lg'
                      : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/20'
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-14 rounded-full object-cover ring-2 ring-purple-100"
                      />
                      {selectedUserId === user.id && (
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
              ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
            <Button
              onClick={handleDemoLogin}
              disabled={!selectedUserId}
              variant="outline"
              className="w-full h-11 font-medium border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              <Sparkles className="size-4 mr-2" />
              체험 시작하기
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