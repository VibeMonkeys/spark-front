import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, User, Lock, Bell, Shield, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsPageProps {
  onBack: () => void;
  onNavigate: (section: string) => void;
}

export function SettingsPage({ onBack, onNavigate }: SettingsPageProps) {
  const { user } = useAuth();

  const settingsOptions = [
    {
      id: 'profile',
      title: '프로필 편집',
      description: '이름, 한줄소개, 프로필 사진 변경',
      icon: User,
      color: 'bg-blue-500',
    },
    {
      id: 'password',
      title: '비밀번호 변경',
      description: '계정 보안을 위한 비밀번호 변경',
      icon: Lock,
      color: 'bg-green-500',
    },
    {
      id: 'notifications',
      title: '알림 설정',
      description: '미션, 리워드 알림 설정',
      icon: Bell,
      color: 'bg-yellow-500',
    },
    {
      id: 'privacy',
      title: '개인정보 보호',
      description: '데이터 사용 및 프라이버시 설정',
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      id: 'help',
      title: '도움말',
      description: '자주 묻는 질문 및 사용법',
      icon: HelpCircle,
      color: 'bg-orange-500',
    },
    {
      id: 'about',
      title: '앱 정보',
      description: '버전 정보 및 이용약관',
      icon: Info,
      color: 'bg-gray-500',
    },
  ];

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
              설정
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* User Info Card */}
        <Card className="border-0 bg-white backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {user?.bio && (
                  <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <div className="space-y-3">
          {settingsOptions.map((option) => (
            <Card 
              key={option.id}
              className="border-0 bg-white backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer"
              onClick={() => onNavigate(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-lg ${option.color} flex items-center justify-center`}>
                    <option.icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight className="size-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">SPARK v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">더 나은 일상을 위한 미션 앱</p>
        </div>
      </div>
    </div>
  );
}