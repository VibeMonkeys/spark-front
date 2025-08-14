import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Github, Users, Zap, Target } from 'lucide-react';

// 개발용 테스트 계정
const availableUsers = [
  { 
    id: 'user_01', 
    name: '김철수', 
    email: 'test@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 3,
    levelTitle: 'EXPLORER'
  },
  { 
    id: '2190d61c-379d-4452-b4da-655bf67b4b71', 
    name: '지나니', 
    email: 'jinani@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e6e3e7?w=150&h=150&fit=crop&crop=face',
    level: 1,
    levelTitle: 'BEGINNER'
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
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
            current_points: user.level === 3 ? 1250 : 320,
            total_points: user.level === 3 ? 3500 : 890,
            current_streak: user.level === 3 ? 7 : 3,
            longest_streak: user.level === 3 ? 15 : 8,
            completed_missions: user.level === 3 ? 25 : 8,
            total_days: user.level === 3 ? 45 : 12,
            join_date: '2024-01-01',
            preferences: {},
            statistics: {
              category_stats: [],
              this_month_points: user.level === 3 ? 850 : 320,
              this_month_missions: user.level === 3 ? 12 : 8,
              average_rating: user.level === 3 ? 4.2 : 3.8
            }
          },
          token: 'demo_token',
          refreshToken: 'demo_refresh_token'
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 API 호출 로직
    console.log('Form submitted:', { mode, formData });
  };

  if (mode === 'demo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="size-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                SPARK
              </h1>
            </div>
            <p className="text-lg text-gray-300 mb-2">데모 계정 선택</p>
            <p className="text-sm text-gray-400">테스트해볼 계정을 선택해주세요</p>
          </div>

          {/* Demo Account Selection */}
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 space-y-4">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedUserId === user.id
                      ? 'bg-purple-500/20 border-2 border-purple-400 shadow-lg'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-14 rounded-full object-cover ring-2 ring-white/20"
                      />
                      {selectedUserId === user.id && (
                        <div className="absolute -top-1 -right-1 size-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <ArrowRight className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                          LV.{user.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-xs text-purple-300 font-medium">{user.levelTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDemoLogin}
              disabled={!selectedUserId}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg h-12 font-semibold"
              size="lg"
            >
              <Sparkles className="size-5 mr-2" />
              체험하기
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setMode('login')}
              className="w-full border-white/20 text-white hover:bg-white/10 h-12"
            >
              실제 로그인하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="size-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold">SPARK</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">일상을 특별하게 만드는<br />랜덤 미션 서비스</h2>
            <p className="text-xl text-gray-300 mb-8">매일 새로운 미션으로 더 흥미로운 하루를 시작하세요</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Target className="size-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">다양한 미션</h3>
                <p className="text-gray-400">모험, 건강, 창의, 학습, 사회적 미션</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                <Users className="size-6 text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">커뮤니티</h3>
                <p className="text-gray-400">다른 사용자들과 경험 공유</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Zap className="size-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">성장 시스템</h3>
                <p className="text-gray-400">레벨업과 보상으로 동기부여</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="size-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="size-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">SPARK</h1>
            </div>
          </div>

          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-white">
                {mode === 'login' ? '로그인' : '회원가입'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {mode === 'login' 
                  ? 'SPARK 계정으로 로그인하세요'
                  : '새로운 SPARK 계정을 만드세요'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">이름</Label>
                    <div className="relative">
                      <User className="size-5 text-gray-400 absolute left-3 top-3" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">이메일</Label>
                  <div className="relative">
                    <Mail className="size-5 text-gray-400 absolute left-3 top-3" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">비밀번호</Label>
                  <div className="relative">
                    <Lock className="size-5 text-gray-400 absolute left-3 top-3" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-11 pr-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200">비밀번호 확인</Label>
                    <div className="relative">
                      <Lock className="size-5 text-gray-400 absolute left-3 top-3" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/10"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg h-12 font-semibold"
                >
                  <ArrowRight className="size-5 mr-2" />
                  {mode === 'login' ? '로그인' : '계정 만들기'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-gray-400">또는</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setMode('demo')}
                  className="w-full border-white/20 text-white hover:bg-white/10 h-11"
                >
                  <Sparkles className="size-4 mr-2" />
                  데모 계정으로 체험하기
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 h-11"
                >
                  <Github className="size-4 mr-2" />
                  GitHub으로 계속하기
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {mode === 'login' 
                    ? '계정이 없으신가요? 회원가입' 
                    : '이미 계정이 있으신가요? 로그인'
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}