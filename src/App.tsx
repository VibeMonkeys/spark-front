import { useState, lazy, Suspense, useEffect, useCallback, useRef } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { missionApi } from "./shared/api";
import { NotificationModal } from "./components/ui/notification-modal";
import { ConfirmModal } from "./components/ui/confirm-modal";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "./components/ui/pull-to-refresh";

// Lazy loading으로 컴포넌트 로드
const HomePage = lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));
const FeedPage = lazy(() => import("./components/FeedPage").then(module => ({ default: module.FeedPage })));
const ProfilePage = lazy(() => import("./components/ProfilePage").then(module => ({ default: module.ProfilePage })));
const ProfileEditPage = lazy(() => import("./components/ProfileEditPage").then(module => ({ default: module.ProfileEditPage })));
const SettingsPage = lazy(() => import("./components/SettingsPage").then(module => ({ default: module.SettingsPage })));
const PasswordChangePage = lazy(() => import("./components/PasswordChangePage").then(module => ({ default: module.PasswordChangePage })));
const HelpPage = lazy(() => import("./components/HelpPage").then(module => ({ default: module.HelpPage })));
const AppInfoPage = lazy(() => import("./components/AppInfoPage").then(module => ({ default: module.AppInfoPage })));
const MissionsPage = lazy(() => import("./components/MissionsPage").then(module => ({ default: module.MissionsPage })));
const RewardsPage = lazy(() => import("./components/RewardsPage").then(module => ({ default: module.RewardsPage })));
const MissionDetail = lazy(() => import("./components/MissionDetail").then(module => ({ default: module.MissionDetail })));
const MissionVerification = lazy(() => import("./components/MissionVerification").then(module => ({ default: module.MissionVerification })));
const MissionSuccess = lazy(() => import("./components/MissionSuccess").then(module => ({ default: module.MissionSuccess })));
const NavigationBar = lazy(() => import("./components/NavigationBar").then(module => ({ default: module.NavigationBar })));
const LoginPage = lazy(() => import("./components/LoginPage").then(module => ({ default: module.LoginPage })));

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

interface AppContentProps {
  onSetShowNotification?: (fn: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void) => void;
  onSetNavigateFunction?: (fn: (view: string, tab?: string) => void) => void;
}

function AppContent({ onSetShowNotification, onSetNavigateFunction }: AppContentProps) {
  const { user, isLoading, login } = useAuth();
  const queryClient = useQueryClient();
  // 새로고침 시에도 현재 뷰 상태 복원
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView || "main";
  });
  const [previousView, setPreviousView] = useState<string>("main"); // 이전 뷰 추적
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(() => {
    const savedMissionId = localStorage.getItem('selectedMissionId');
    return savedMissionId ? parseInt(savedMissionId) : null;
  });
  const [missionResult, setMissionResult] = useState<{
    pointsEarned: number;
    streakCount: number;
    levelUp?: boolean;
    newLevel?: number;
  } | null>(null);
  const [selectedSettingsSection, setSelectedSettingsSection] = useState<string | null>(null);

  // 탭 상태를 localStorage에서 복원
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'home';
  });

  // 스크롤 위치 저장을 위한 ref
  const scrollPositions = useRef<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('scrollPositions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 이전 활성 탭 추적
  const [previousActiveTab, setPreviousActiveTab] = useState(activeTab);

  // 스크롤 위치 저장 함수
  const saveScrollPosition = useCallback((tab: string) => {
    const scrollY = window.scrollY;
    scrollPositions.current[tab] = scrollY;
    localStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current));
  }, []);

  // 스크롤 위치 복원 함수
  const restoreScrollPosition = useCallback((tab: string, isNewTab: boolean = false) => {
    if (isNewTab) {
      // 새 탭으로 이동하는 경우 최상단으로
      window.scrollTo(0, 0);
    } else {
      // 기존 탭으로 복귀하는 경우 저장된 위치로
      const savedPosition = scrollPositions.current[tab] || 0;
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 0);
    }
  }, []);

  // activeTab 변경시 스크롤 위치 관리
  useEffect(() => {
    // 이전 탭의 스크롤 위치 저장
    if (previousActiveTab && previousActiveTab !== activeTab) {
      saveScrollPosition(previousActiveTab);
    }

    // 새 탭인지 확인 (localStorage에 저장된 위치가 없으면 새 탭)
    const isNewTab = !(activeTab in scrollPositions.current);
    
    // 현재 탭의 스크롤 위치 복원
    restoreScrollPosition(activeTab, isNewTab);

    // localStorage에 activeTab 저장
    localStorage.setItem('activeTab', activeTab);
    setPreviousActiveTab(activeTab);
  }, [activeTab, previousActiveTab, saveScrollPosition, restoreScrollPosition]);

  // 알림 모달 상태
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    autoClose?: boolean;
    autoCloseDelay?: number;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  // 확인 모달 상태 (이동 버튼 포함)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  const showNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, autoClose = true, autoCloseDelay = 2000) => {
    setNotification({ isOpen: true, type, title, message, autoClose, autoCloseDelay });
  }, []);

  // Pull-to-refresh 기능
  const handleRefresh = useCallback(async () => {
    try {
      // 현재 화면에 따라 적절한 데이터 새로고침
      await queryClient.invalidateQueries();
    } catch (error) {
      // 에러는 조용히 처리
    }
  }, [queryClient]);

  const pullToRefreshState = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: !!user && currentView === 'main' // 로그인 상태이고 메인 화면일 때만 활성화
  });

  // showNotification 함수를 상위 컴포넌트에 전달
  useEffect(() => {
    if (onSetShowNotification) {
      onSetShowNotification(showNotification);
    }
  }, [onSetShowNotification, showNotification]);

  // 네비게이션 함수 생성
  const handleNavigateFromNotification = useCallback((view: string, tab?: string) => {
    setCurrentView(view);
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  // 네비게이션 함수를 상위 컴포넌트에 전달
  useEffect(() => {
    if (onSetNavigateFunction) {
      onSetNavigateFunction(handleNavigateFromNotification);
    }
  }, [onSetNavigateFunction, handleNavigateFromNotification]);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirmModal = (
    type: 'success' | 'error' | 'warning' | 'info', 
    title: string, 
    message: string, 
    confirmText: string = '확인',
    onConfirm?: () => void
  ) => {
    setConfirmModal({ isOpen: true, type, title, message, confirmText, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // 미션 시작 API 호출
  const startMissionMutation = useMutation({
    mutationFn: ({ missionId, userId }: { missionId: number; userId: number }) => {
      return missionApi.startMission(missionId, userId);
    },
    onSuccess: (data) => {
      
      // 성공시 관련 쿼리들을 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['missions-ongoing', user?.id] }); // 사용자별 진행중 미션
      queryClient.invalidateQueries({ queryKey: ['missions', 'today', user?.id] }); // 오늘의 미션
      queryClient.invalidateQueries({ queryKey: ['missions'] }); // 모든 미션 관련 쿼리 무효화
      
      // 알림 없이 바로 미션 탭으로 이동
      
      // 미션 시작 후에는 무조건 missions 탭으로 이동
      setCurrentView("main");
      localStorage.setItem('currentView', 'main');
      setActiveTab('missions');
      localStorage.setItem('activeTab', 'missions'); // 새로고침 시에도 미션 탭 유지
      setSelectedMissionId(null);
      localStorage.removeItem('selectedMissionId');
      localStorage.removeItem('lastActiveTab'); // 이전 탭 정보 제거
    },
    onError: (error: any) => {
      console.error('❌ [App] Mission start failed:', error);
      console.error('❌ [App] Full error object:', JSON.stringify(error, null, 2));
      
      // 에러 구조 파싱: axios 에러와 직접 응답 모두 처리
      const errorResponse = error?.response?.data || error;
      const errorCode = errorResponse?.error?.code;
      const errorMessage = errorResponse?.error?.message || errorResponse?.message || '알 수 없는 오류가 발생했습니다.';
      console.error('❌ [App] Parsed error:', { errorCode, errorMessage });
      
      let title = '미션 시작 실패';
      let message = errorMessage;
      
      switch (errorCode) {
        case 'DAILY_LIMIT_EXCEEDED':
          title = '일일 미션 제한 초과';
          message = '오늘 시작할 수 있는 미션 수를 초과했습니다. 내일 다시 시도해주세요.';
          break;
        case 'MISSION_IN_PROGRESS':
          // 확인 모달로 표시하고 미션 탭으로 이동 버튼 제공
          showConfirmModal(
            'warning',
            '진행 중인 미션 있음',
            '이미 진행 중인 미션이 있습니다. 현재 미션을 확인하러 가시겠습니까?',
            '미션 확인하기',
            () => {
              setCurrentView("main");
              localStorage.setItem('currentView', 'main');
              setActiveTab('missions');
              localStorage.setItem('activeTab', 'missions');
              setSelectedMissionId(null);
              localStorage.removeItem('selectedMissionId');
              localStorage.removeItem('lastActiveTab');
            }
          );
          return; // showNotification을 호출하지 않고 바로 리턴
        case 'MISSION_NOT_FOUND':
          title = '미션을 찾을 수 없음';
          message = '선택한 미션을 찾을 수 없습니다. 다른 미션을 선택해주세요.';
          break;
        default:
          message = `미션 시작에 실패했습니다. ${errorMessage}`;
      }
      
      showNotification('error', title, message);
    }
  });

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지 표시
  if (!user) {
    return <LoginPage />;
  }

  const handleMissionStart = () => {
    
    if (!selectedMissionId || !user?.id) {
      console.error('❌ [App] Mission start failed - missing data:', { selectedMissionId, userId: user?.id });
      showNotification(
        'warning',
        '미션 정보 누락',
        '미션 정보를 찾을 수 없습니다. 다시 시도해주세요.'
      );
      return;
    }

    
    // 실제 미션 시작 API 호출
    startMissionMutation.mutate({
      missionId: selectedMissionId,
      userId: user.id
    });
  };

  // 뷰 변경 헬퍼 함수
  const navigateToView = (newView: string) => {
    setPreviousView(currentView);
    setCurrentView(newView);
    localStorage.setItem('currentView', newView);
  };

  const handleMissionVerify = () => {
    navigateToView("mission-verification");
  };

  const handleMissionComplete = (result?: {
    pointsEarned: number;
    streakCount: number;
    levelUp?: boolean;
    newLevel?: number;
  }) => {
    if (result) {
      setMissionResult(result);
      setCurrentView("mission-success");
    } else {
      // 기본값으로 성공 화면 표시
      setMissionResult({
        pointsEarned: 20,
        streakCount: 7,
        levelUp: false
      });
      setCurrentView("mission-success");
    }
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    localStorage.setItem('currentView', 'main');
    // 이전 탭으로 복원 (기본값은 home)
    const lastTab = localStorage.getItem('lastActiveTab') || 'home';
    setActiveTab(lastTab);
    setSelectedMissionId(null);
    localStorage.removeItem('selectedMissionId');
    setMissionResult(null);
  };

  const handleMissionSelect = (missionId: number) => {
    // 현재 탭을 localStorage에 저장
    localStorage.setItem('lastActiveTab', activeTab);
    setSelectedMissionId(missionId);
    localStorage.setItem('selectedMissionId', missionId.toString());
    setCurrentView("mission-detail");
    localStorage.setItem('currentView', 'mission-detail');
  };

  const handleMissionContinue = (missionId: number) => {
    // 현재 탭을 localStorage에 저장
    localStorage.setItem('lastActiveTab', activeTab);
    setSelectedMissionId(missionId);
    localStorage.setItem('selectedMissionId', missionId.toString()); // 새로고침 시에도 미션 ID 유지
    navigateToView("mission-verification");
  };

  const handleBackFromVerification = () => {
    // 인증 후에는 항상 미션 탭으로 이동
    setCurrentView("main");
    localStorage.setItem('currentView', 'main');
    setActiveTab("missions");
    localStorage.setItem('activeTab', 'missions');
    localStorage.removeItem('selectedMissionId');
    localStorage.removeItem('lastActiveTab');
  };

  const renderCurrentView = () => {
    if (currentView === "profile-edit") {
      return <ProfileEditPage onBack={() => setCurrentView("settings")} />;
    }

    if (currentView === "settings") {
      return (
        <SettingsPage 
          onBack={() => {
            setCurrentView("main");
            setActiveTab("profile");
            setSelectedSettingsSection(null);
          }}
          onNavigate={(section: string) => {
            setSelectedSettingsSection(section);
            if (section === 'profile') {
              setCurrentView("profile-edit");
            } else if (section === 'password') {
              setCurrentView("password-change");
            } else if (section === 'help') {
              setCurrentView("help");
            } else if (section === 'about') {
              setCurrentView("app-info");
            } else {
              // For now, just show a notification for other sections
              showNotification('info', '준비 중', `${section} 기능은 준비 중입니다.`);
            }
          }}
        />
      );
    }

    if (currentView === "password-change") {
      return (
        <PasswordChangePage
          onBack={() => setCurrentView("settings")}
          onSuccess={() => setCurrentView("settings")}
          onShowNotification={showNotification}
        />
      );
    }

    if (currentView === "help") {
      return (
        <HelpPage
          onBack={() => setCurrentView("settings")}
          onShowNotification={showNotification}
        />
      );
    }

    if (currentView === "app-info") {
      return (
        <AppInfoPage
          onBack={() => setCurrentView("settings")}
        />
      );
    }

    if (currentView === "mission-detail") {
      return (
        <MissionDetail
          missionId={selectedMissionId}
          onBack={handleBackToMain}
          onStartMission={() => {}} // 빈 함수 - MissionDetail에서 직접 처리
          onVerifyMission={handleMissionVerify}
          onViewMissionDetail={handleMissionSelect}
          isStartingMission={startMissionMutation.isPending}
          onShowNotification={showNotification}
          onNavigateToMissions={() => {
            setCurrentView("main");
            localStorage.setItem('currentView', 'main');
            setActiveTab('missions');
            localStorage.setItem('activeTab', 'missions');
            setSelectedMissionId(null);
            localStorage.removeItem('selectedMissionId');
            localStorage.removeItem('lastActiveTab');
          }}
        />
      );
    }

    if (currentView === "mission-verification") {
      return (
        <MissionVerification
          missionId={selectedMissionId}
          onBack={handleBackFromVerification}
          onSubmit={handleMissionComplete}
        />
      );
    }

    if (currentView === "mission-success" && missionResult) {
      return (
        <MissionSuccess
          pointsEarned={missionResult.pointsEarned}
          streakCount={missionResult.streakCount}
          levelUp={missionResult.levelUp}
          newLevel={missionResult.newLevel}
          onBackToHome={handleBackToMain}
          onViewProfile={() => {
            setCurrentView("main");
            localStorage.setItem('currentView', 'main');
            setActiveTab("profile");
            localStorage.setItem('activeTab', 'profile');
            setSelectedMissionId(null);
            setMissionResult(null);
            localStorage.removeItem('selectedMissionId');
            localStorage.removeItem('lastActiveTab');
          }}
        />
      );
    }

    // Main app views
    switch (activeTab) {
      case "home":
        return <HomePage onMissionSelect={handleMissionSelect} />;
      case "explore":
        return <FeedPage />;
      case "missions":
        return <MissionsPage onMissionSelect={handleMissionSelect} onMissionContinue={handleMissionContinue} onNotification={showNotification} onTabChange={setActiveTab} />;
      case "rewards":
        return <RewardsPage />;
      case "profile":
        return <ProfilePage onEditProfile={() => setCurrentView("settings")} />;
      default:
        return <HomePage />;
    }
  };

  // 배경 드래그 효과를 위한 transform 계산
  const getBackgroundTransform = () => {
    if (pullToRefreshState.isRefreshing || !pullToRefreshState.isPulling) return 0;
    // 드래그할수록 배경도 아래로 (더 격하게!)
    return Math.min(pullToRefreshState.pullDistance * 0.7, 80);
  };

  const backgroundTransform = getBackgroundTransform();

  return (
    <div className="size-full">
      {/* Pull-to-refresh 인디케이터 */}
      <PullToRefreshIndicator {...pullToRefreshState} />
      
      {/* 메인 콘텐츠 - 드래그 시 같이 움직임 */}
      <div 
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${backgroundTransform}px)`
        }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">로딩 중...</span>
          </div>
        }>
          {renderCurrentView()}
        </Suspense>
      </div>
      
      {/* 하단 네비게이션 - 드래그 시 같이 움직임 */}
      {currentView === "main" && (
        <div 
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translateY(${backgroundTransform}px)`
          }}
        >
          <Suspense fallback={
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          }>
            <NavigationBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Suspense>
        </div>
      )}
      
      {/* 알림 모달 */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose={notification.autoClose}
        autoCloseDelay={notification.autoCloseDelay}
      />
      
      {/* 확인 모달 (이동 버튼 포함) */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        showCancel={true}
      />
    </div>
  );
}

// AppContent를 감싸는 컴포넌트
function AppWithNotifications() {
  const [showNotificationRef, setShowNotificationRef] = useState<((type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void) | null>(null);
  const [navigateRef, setNavigateRef] = useState<((view: string, tab?: string) => void) | null>(null);

  const handleShowNotification = useCallback((showNotificationFn: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void) => {
    setShowNotificationRef(() => showNotificationFn);
  }, []);

  const handleSetNavigateFunction = useCallback((navigateFn: (view: string, tab?: string) => void) => {
    setNavigateRef(() => navigateFn);
  }, []);

  return (
    <NotificationProvider 
      onShowNotification={showNotificationRef || undefined}
      onNavigate={navigateRef || undefined}
    >
      <AppContent 
        onSetShowNotification={handleShowNotification} 
        onSetNavigateFunction={handleSetNavigateFunction}
      />
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWithNotifications />
      </AuthProvider>
    </QueryClientProvider>
  );
}