import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '../shared/api/authApi';
import { userApi } from '../shared/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  level: number;
  level_title: string;
  current_points: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  completed_missions: number;
  total_days: number;
  join_date: string;
  preferences: Record<string, boolean>;
  statistics: {
    category_stats: Array<{
      name: string;
      completed: number;
      total: number;
      percentage: number;
      color: string;
    }>;
    this_month_points: number;
    this_month_missions: number;
    average_rating: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 localStorage에서 인증 정보 복원
  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('current_user');
      const savedToken = localStorage.getItem('auth_token');
      const savedRefreshToken = localStorage.getItem('refresh_token');

      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          console.log('🔑 [AuthContext] Restored user from localStorage:', JSON.parse(savedUser));
          
          // TODO: 토큰 유효성 검사 및 자동 갱신 로직
          // 현재는 간단히 저장된 정보만 복원
        } catch (error) {
          console.error('Failed to parse saved auth data:', error);
          localStorage.removeItem('current_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        // 임시: 테스트를 위해 자동 로그인 (나중에 제거)
        console.log('🔧 [AuthContext] No saved user found, auto-login for testing');
        const testUserId = '2190d61c-379d-4452-b4da-655bf67b4b71'; // 지나니
        
        userApi.getUser(testUserId)
          .then(realUser => {
            console.log('✅ [AuthContext] Auto-login user loaded:', realUser);
            setUser(realUser);
            setToken('temp_token_for_testing');
            localStorage.setItem('current_user', JSON.stringify(realUser));
            localStorage.setItem('auth_token', 'temp_token_for_testing');
          })
          .catch(error => {
            console.error('❌ [AuthContext] Auto-login failed:', error);
          });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.token);
    
    // localStorage에 인증 정보 저장
    localStorage.setItem('current_user', JSON.stringify(authData.user));
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('refresh_token', authData.refreshToken);
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // API 호출이 실패해도 로컬에서는 로그아웃 처리
    }
    
    // 로컬 상태 및 저장소 정리
    setUser(null);
    setToken(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}