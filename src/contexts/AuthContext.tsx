import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '../shared/api/authApi';
import { userApi } from '../shared/api';

interface User {
  id: number;
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
  bio?: string;
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
  forceLogout: (reason?: string) => void; // 토큰 에러 등으로 인한 강제 로그아웃
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  onStateReset?: () => void; // 로그인/로그아웃 시 앱 상태 리셋 콜백
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onStateReset, setOnStateReset] = useState<(() => void) | undefined>();

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
          const user = JSON.parse(savedUser);
          setUser(user);
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          
          // JWT 토큰으로 최신 사용자 데이터 업데이트 시도
          try {
            const freshUser = await userApi.getUser(user.id);
            setUser(freshUser);
            localStorage.setItem('current_user', JSON.stringify(freshUser));
          } catch (error) {
            console.warn('⚠️ [AuthContext] Failed to refresh user data with JWT:', error);
            // JWT가 만료되었을 수 있으므로 토큰 자동 갱신이 시도될 것임
            // 저장된 데이터로 계속 진행
          }
        } else {
          // 저장된 인증 정보가 없으면 로그아웃 상태로 유지
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
    
    setUser(authData.user);
    setToken(authData.token);
    setRefreshToken(authData.refreshToken);
    
    // localStorage에 인증 정보 저장
    localStorage.setItem('current_user', JSON.stringify(authData.user));
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('refresh_token', authData.refreshToken);
    
    // 로그인 시 홈 탭으로 초기화
    localStorage.setItem('activeTab', 'home');
    localStorage.setItem('currentView', 'main');
    localStorage.removeItem('selectedMissionId');
    localStorage.removeItem('lastActiveTab');
    localStorage.removeItem('scrollPositions');
    
    // App 컴포넌트 상태 리셋 콜백 호출 (비동기로 처리)
    setTimeout(() => {
      if (onStateReset) {
        onStateReset();
      }
      // 로그인 후 스크롤을 최상단으로 이동
      window.scrollTo(0, 0);
    }, 0);
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (refresh token으로)
      if (refreshToken) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('⚠️ [AuthContext] Logout API call failed:', error);
      // API 호출이 실패해도 로컬에서는 로그아웃 처리
    }
    
    // 모든 localStorage 데이터 정리
    localStorage.clear();
    
    // 로그아웃 후에도 홈 탭으로 초기화 (다음 로그인을 위해)
    localStorage.setItem('activeTab', 'home');
    localStorage.setItem('currentView', 'main');
    
    // 로컬 상태 및 저장소 정리
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    
    // App 컴포넌트 상태 리셋 콜백 호출 (비동기로 처리)
    setTimeout(() => {
      if (onStateReset) {
        onStateReset();
      }
    }, 0);
  };

  const forceLogout = (reason?: string) => {
    console.warn('⚠️ [AuthContext] Force logout triggered:', reason);
    
    // 모든 localStorage 데이터 정리 (서버 호출 없이)
    localStorage.clear();
    
    // 강제 로그아웃 후에도 홈 탭으로 초기화 (다음 로그인을 위해)
    localStorage.setItem('activeTab', 'home');
    localStorage.setItem('currentView', 'main');
    
    // 로컬 상태 정리
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    
    // App 컴포넌트 상태 리셋 콜백 호출 (비동기로 처리)
    setTimeout(() => {
      if (onStateReset) {
        onStateReset();
      }
    }, 0);
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      const updatedUserData = await userApi.getUser(user.id);
      setUser(updatedUserData);
      localStorage.setItem('current_user', JSON.stringify(updatedUserData));
      console.log('✅ [AuthContext] User data refreshed:', updatedUserData);
    } catch (error) {
      console.error('❌ [AuthContext] Failed to refresh user data:', error);
    }
  };

  const isAuthenticated = !!(user && token && refreshToken);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken, 
      login, 
      logout, 
      forceLogout,
      refreshUser,
      isLoading, 
      isAuthenticated,
      onStateReset: setOnStateReset
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