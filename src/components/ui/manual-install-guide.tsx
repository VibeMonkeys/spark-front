import React, { useState } from 'react';
import { Card } from './card';
import { Button } from './button';

export const ManualInstallGuide: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  return (
    <Card className="mx-4 my-4 p-4 bg-purple-50 border-purple-200">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">📱</div>
        <div className="flex-1">
          <h3 className="font-semibold text-purple-900 mb-2">
            Spark를 앱처럼 설치하세요!
          </h3>
          <p className="text-sm text-purple-800 mb-3">
            브라우저에서 바로 앱처럼 설치할 수 있어요
          </p>
          
          {!showGuide ? (
            <Button 
              onClick={() => setShowGuide(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
              size="sm"
            >
              설치 방법 보기
            </Button>
          ) : (
            <div className="space-y-3">
              {isChrome ? (
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <h4 className="font-semibold text-purple-900">Chrome에서 설치:</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                      주소창 오른쪽 <strong>설치 버튼 📱</strong> 클릭
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                      또는 <strong>Chrome 메뉴(⋮) → "앱 설치..."</strong>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                      {isMac ? 'Dock' : '바탕화면'}에서 <strong>Spark 앱</strong> 실행
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-purple-900 mb-2">Safari에서:</h4>
                  <p className="text-sm text-gray-700">
                    공유 버튼(↗️) → "홈 화면에 추가" 선택
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowGuide(false)}
                  variant="outline"
                  size="sm"
                  className="text-purple-700 border-purple-300"
                >
                  닫기
                </Button>
                <Button 
                  onClick={() => {
                    // 개발자 도구 열기 안내
                    alert('Chrome에서: F12 → Application → Manifest 확인\n' +
                          '또는 주소창 우클릭 → "앱 설치..." 메뉴 찾기');
                  }}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  개발자 도구 열기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};