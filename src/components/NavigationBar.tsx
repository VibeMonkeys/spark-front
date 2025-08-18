import { useState } from "react";
import { Home, FileText, Target, Gift, User } from "lucide-react";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "홈" },
  { id: "explore", icon: FileText, label: "스토리" },
  { id: "missions", icon: Target, label: "미션" },
  { id: "rewards", icon: Gift, label: "리워드" },
  { id: "profile", icon: User, label: "프로필" }
];

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-pb">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 min-w-[64px] ${
                  isActive 
                    ? "text-purple-600 bg-purple-50 scale-105" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95"
                }`}
              >
                <Icon className={`size-6 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
                <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}