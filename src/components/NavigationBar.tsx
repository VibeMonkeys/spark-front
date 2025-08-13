import { useState } from "react";
import { Home, Search, Target, Gift, User } from "lucide-react";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "홈" },
  { id: "explore", icon: Search, label: "탐색" },
  { id: "missions", icon: Target, label: "미션" },
  { id: "rewards", icon: Gift, label: "리워드" },
  { id: "profile", icon: User, label: "프로필" }
];

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t border-white/20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "text-purple-600 bg-purple-50" 
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                }`}
              >
                <Icon className={`size-5 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}