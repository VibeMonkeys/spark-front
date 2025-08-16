import { useState, lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { missionApi } from "./shared/api";
import { NotificationModal } from "./components/ui/notification-modal";
import { ConfirmModal } from "./components/ui/confirm-modal";

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

function AppContent() {
  const { user, isLoading, login } = useAuth();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState("main"); // "main", "mission-detail", "mission-verification", "mission-success", "profile-edit", "settings", "password-change", "help", "app-info"
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
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

  // activeTab 변경시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

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

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, autoClose = true, autoCloseDelay = 3000) => {
    setNotification({ isOpen: true, type, title, message, autoClose, autoCloseDelay });
  };

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
      
      showNotification(
        'success',
        '🎯 미션 시작!',
        '미션이 시작되었습니다! 미션 탭에서 진행 중인 미션을 확인하고 인증해보세요.',
        true, // autoClose
        3000  // 3초 후 자동 닫기
      );
      
      // 미션 탭으로 이동
      setCurrentView("main");
      setActiveTab("missions");
      setSelectedMissionId(null);
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
              setActiveTab("missions");
              setSelectedMissionId(null);
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

  const handleMissionVerify = () => {
    setCurrentView("mission-verification");
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
    setActiveTab("home");
    setSelectedMissionId(null);
    setMissionResult(null);
  };

  const handleMissionSelect = (missionId: number) => {
    setSelectedMissionId(missionId);
    setCurrentView("mission-detail");
  };

  const handleMissionContinue = (missionId: number) => {
    setSelectedMissionId(missionId);
    setCurrentView("mission-verification");
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
            setActiveTab("missions");
            setSelectedMissionId(null);
          }}
        />
      );
    }

    if (currentView === "mission-verification") {
      return (
        <MissionVerification
          missionId={selectedMissionId}
          onBack={handleBackToMain}
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
            setActiveTab("profile");
            setSelectedMissionId(null);
            setMissionResult(null);
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

  return (
    <div className="size-full">
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">로딩 중...</span>
        </div>
      }>
        {renderCurrentView()}
      </Suspense>
      
      {currentView === "main" && (
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}