import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { FeedPage } from "./components/FeedPage";
import { ProfilePage } from "./components/ProfilePage";
import { MissionsPage } from "./components/MissionsPage";
import { RewardsPage } from "./components/RewardsPage";
import { MissionDetail } from "./components/MissionDetail";
import { MissionVerification } from "./components/MissionVerification";
import { NavigationBar } from "./components/NavigationBar";

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
      {renderCurrentView()}
      {currentView === "main" && (
        <NavigationBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}