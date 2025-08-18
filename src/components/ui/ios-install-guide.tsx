import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';

export const IOSInstallGuide: React.FC = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // iOS 감지
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // 이미 홈화면에 추가된 상태인지 확인
    const standalone = (window.navigator as any).standalone === true ||
                      window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(iOS);
    setIsInStandaloneMode(standalone);
  }, []);

  // iOS이고 아직 설치하지 않은 경우에만 표시
  if (!isIOS || isInStandaloneMode) {
    return null;
  }

  return (
    <Card className="mx-4 my-4 p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">📱</div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            Spark를 앱처럼 사용하세요!
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            홈 화면에 추가하면 앱처럼 빠르게 접근할 수 있어요
          </p>
          
          {!showGuide ? (
            <Button 
              onClick={() => setShowGuide(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              size="sm"
            >
              설치 방법 보기
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                  Safari 하단의 <strong>공유 버튼 (↗️)</strong> 터치
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                  <strong>"홈 화면에 추가"</strong> 선택
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                  홈 화면에서 <strong>Spark 앱</strong> 실행
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowGuide(false)}
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-blue-300"
                >
                  닫기
                </Button>
                <Button 
                  onClick={() => {
                    // iOS에서는 프로그래매틱 설치가 안되므로 안내만
                    alert('Safari 하단의 공유 버튼(↗️)을 눌러 "홈 화면에 추가"를 선택해주세요!');
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  지금 추가하기
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => setShowGuide(false)}
          variant="ghost"
          size="sm"
          className="text-blue-600 p-1"
        >
          ✕
        </Button>
      </div>
    </Card>
  );
};