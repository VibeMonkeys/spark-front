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
  refreshToken: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 localStorage에서 인증 정보 복원
  useEffect(() => {
    const initAuth = async () => {
      try {
        // localStorage에서 저장된 인증 정보 확인
        const savedUser = localStorage.getItem('current_user');
        const savedToken = localStorage.getItem('auth_token');
        const savedRefreshToken = localStorage.getItem('refresh_token');
        
        if (savedUser && savedToken && savedRefreshToken) {
          // 저장된 인증 정보가 있으면 복원
          console.log('🔄 [AuthContext] Restoring saved JWT auth state');
          const user = JSON.parse(savedUser);
          setUser(user);
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          
          // JWT 토큰으로 최신 사용자 데이터 업데이트 시도
          try {
            const freshUser = await userApi.getUser(user.id);
            console.log('✅ [AuthContext] Updated user data with JWT:', freshUser);
            setUser(freshUser);
            localStorage.setItem('current_user', JSON.stringify(freshUser));
          } catch (error) {
            console.warn('⚠️ [AuthContext] Failed to refresh user data with JWT:', error);
            // JWT가 만료되었을 수 있으므로 토큰 자동 갱신이 시도될 것임
            // 저장된 데이터로 계속 진행
          }
        } else {
          // 저장된 인증 정보가 없으면 로그아웃 상태로 유지
          console.log('ℹ️ [AuthContext] No saved auth state - user needs to login');
          // 인증 관련 저장소 정리
          localStorage.removeItem('current_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Failed to initialize auth:', error);
        // 오류 발생 시 인증 정보 정리
        localStorage.removeItem('current_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    console.log('🔐 [AuthContext] Logging in user with JWT:', authData.user.email);
    
    setUser(authData.user);
    setToken(authData.token);
    setRefreshToken(authData.refreshToken);
    
    // localStorage에 인증 정보 저장
    localStorage.setItem('current_user', JSON.stringify(authData.user));
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    console.log('✅ [AuthContext] JWT tokens saved to localStorage');
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (refresh token으로)
      if (refreshToken) {
        await authApi.logout();
        console.log('✅ [AuthContext] Server logout successful');
      }
    } catch (error) {
      console.error('⚠️ [AuthContext] Logout API call failed:', error);
      // API 호출이 실패해도 로컬에서는 로그아웃 처리
    }
    
    console.log('🚪 [AuthContext] Logging out and clearing JWT tokens');
    
    // 로컬 상태 및 저장소 정리
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  };

  const isAuthenticated = !!(user && token && refreshToken);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
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