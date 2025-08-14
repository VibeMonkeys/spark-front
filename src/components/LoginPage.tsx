import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { User, LogIn, Sparkles } from 'lucide-react';

const availableUsers = [
  { 
    id: 'user_01', 
    name: '김철수', 
    email: 'test@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 3,
    levelTitle: '탐험가'
  },
  { 
    id: 'user_02', 
    name: '이영희', 
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face',
    level: 2,
    levelTitle: '초보자'
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleLogin = () => {
    if (selectedUserId) {
      login(selectedUserId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* App Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="size-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SPARK
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            랜덤 미션 서비스에 오신 것을 환영합니다!
          </p>
          <p className="text-sm text-muted-foreground">
            사용할 계정을 선택해주세요
          </p>
        </div>

        {/* User Selection */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="size-5" />
              계정 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedUserId === user.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-12 rounded-full object-cover"
                    />
                    {selectedUserId === user.id && (
                      <div className="absolute -top-1 -right-1 size-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="size-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        LV.{user.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-purple-600 font-medium">{user.levelTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!selectedUserId}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg transform hover:scale-105 transition-all duration-200 h-14"
          size="lg"
        >
          <LogIn className="size-5 mr-2" />
          <span className="font-bold">시작하기</span>
        </Button>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 데모용 계정입니다. 실제 서비스에서는 회원가입/로그인이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
}