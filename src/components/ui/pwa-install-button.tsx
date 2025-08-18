import React from 'react';
import { Button } from './button';
import { usePWA } from '../../utils/pwa';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className,
  variant = 'default',
  size = 'default'
}) => {
  const { isInstallable, isInstalled, installPWA } = usePWA();

  const handleInstall = async () => {
    try {
      const success = await installPWA();
      if (success) {
        console.log('✅ PWA 설치 성공!');
      }
    } catch (error) {
      console.error('❌ PWA 설치 실패:', error);
    }
  };

  // 이미 설치되었거나 설치할 수 없으면 버튼 숨기기
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant={variant}
      size={size}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ${className || ''}`}
    >
      <svg 
        className="mr-2 h-4 w-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 18l9-5-9-5-9 5 9 5z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 12l0 6" 
        />
      </svg>
      앱 설치하기
    </Button>
  );
};