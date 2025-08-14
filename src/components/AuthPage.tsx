import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Sparkles, LogIn, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../shared/api/authApi';

interface AuthPageProps {
  onSuccess: (authData: any) => void;
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      console.log('Login success:', response);
      onSuccess(response);
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
      console.log('Signup success:', response);
      onSuccess(response);
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

    if (mode === 'login') {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } else {
      signupMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Auth Form */}
        <Card className="border-0 bg-white/90 backdrop-blur-md shadow-2xl ring-1 ring-white/20">
          <CardHeader className="pt-8 pb-6 text-center">
            {/* App Title inside card */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="size-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SPARK
                </h1>
                <p className="text-xs text-gray-500 mt-1">Random Mission Service</p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'login' ? '다시 만나서 반가워요! 🎉' : '새로운 모험을 시작해보세요! 🚀'}
              </h2>
              <p className="text-gray-600">
                {mode === 'login' ? '계정에 로그인하여 미션을 계속하세요' : '회원가입하고 랜덤 미션에 도전하세요'}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Name Field (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded">
                      <UserPlus className="size-3 text-white" />
                    </div>
                    이름
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'hover:border-purple-400 focus:ring-purple-500'}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                  <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded">
                    <Mail className="size-3 text-white" />
                  </div>
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`transition-all duration-200 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'hover:border-purple-400 focus:ring-purple-500'}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="size-4" />
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? '최소 6자 이상' : '비밀번호를 입력하세요'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="size-4" />
                    비밀번호 확인
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 ${
                  mode === 'login' 
                    ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600' 
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600'
                } ${isLoading ? 'scale-95 opacity-90' : ''}`}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="text-lg">{mode === 'login' ? '로그인 중...' : '가입 중...'}</span>
                  </div>
                ) : (
                  <>
                    {mode === 'login' ? (
                      <>
                        <LogIn className="size-6 mr-3" />
                        <span className="text-lg">로그인 시작! 🚀</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-6 mr-3" />
                        <span className="text-lg">모험 시작! 🎉</span>
                      </>
                    )}
                  </>
                )}
              </Button>
              
              {/* Mode Switch */}
              <div className="pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    {mode === 'login' ? '아직 계정이 없으신가요? 🤔' : '이미 계정이 있으신가요? 😊'}
                  </p>
                  <button
                    onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      mode === 'login'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    }`}
                  >
                    {mode === 'login' ? '🎉 회원가입하기' : '🚀 로그인하기'}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}