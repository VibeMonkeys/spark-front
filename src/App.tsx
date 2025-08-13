import { useState, lazy, Suspense } from "react";

// Lazy loading으로 컴포넌트 로드
const HomePage = lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));
const FeedPage = lazy(() => import("./components/FeedPage").then(module => ({ default: module.FeedPage })));
const ProfilePage = lazy(() => import("./components/ProfilePage").then(module => ({ default: module.ProfilePage })));
const MissionsPage = lazy(() => import("./components/MissionsPage").then(module => ({ default: module.MissionsPage })));
const RewardsPage = lazy(() => import("./components/RewardsPage").then(module => ({ default: module.RewardsPage })));
const MissionDetail = lazy(() => import("./components/MissionDetail").then(module => ({ default: module.MissionDetail })));
const MissionVerification = lazy(() => import("./components/MissionVerification").then(module => ({ default: module.MissionVerification })));
const NavigationBar = lazy(() => import("./components/NavigationBar").then(module => ({ default: module.NavigationBar })));

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentView, setCurrentView] = useState("main"); // "main", "mission-detail", "mission-verification"

  const handleMissionStart = () => {
    setCurrentView("mission-verification");
  };

  const handleMissionComplete = () => {
    setCurrentView("main");
    setActiveTab("home");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
  };

  const renderCurrentView = () => {
    if (currentView === "mission-detail") {
      return (
        <MissionDetail
          onBack={handleBackToMain}
          onStartMission={handleMissionStart}
        />
      );
    }

    if (currentView === "mission-verification") {
      return (
        <MissionVerification
          onBack={handleBackToMain}
          onSubmit={handleMissionComplete}
        />
      );
    }

    // Main app views
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "explore":
        return <FeedPage />;
      case "missions":
        return <MissionsPage />;
      case "rewards":
        return <RewardsPage />;
      case "profile":
        return <ProfilePage />;
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
    </div>
  );
}