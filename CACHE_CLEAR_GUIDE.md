# 🔧 브라우저 캐시 완전 정리 가이드

## ❌ 문제 상황
```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "text/html"
```

이 에러는 브라우저가 **이전 캐시된 파일**을 참조하려고 할 때 발생합니다.

## ✅ 해결 방법

### **Chrome/Edge** 🌐
1. **F12** 또는 **Ctrl+Shift+I**로 개발자도구 열기
2. **Network 탭** 클릭
3. **"Disable cache"** 체크박스 활성화
4. **Ctrl+Shift+R** 또는 새로고침 버튼 우클릭 → **"Empty Cache and Hard Reload"**

### **Safari** 🍎
1. **개발 메뉴 활성화**: Safari → 환경설정 → 고급 → "메뉴 막대에서 개발 메뉴 보기"
2. **개발** → **"캐시 비우기"**
3. **Cmd+Shift+R**로 강력 새로고침

### **Firefox** 🔥
1. **F12**로 개발자도구 열기
2. **네트워크 탭** 클릭
3. **캐시 비활성화** 체크
4. **Ctrl+Shift+R**로 강력 새로고침

### **완전 정리** 💣
브라우저 설정에서:
1. **개인정보 및 보안**
2. **인터넷 사용 기록 삭제**
3. **캐시된 이미지 및 파일** 선택
4. **삭제**

## 🚀 빠른 테스트

캐시 정리 후 http://localhost:3000 에 접속하여 확인하세요!

**또는** 이미 배포된 https://spark.vercel.app 에서 최신 버전을 바로 테스트할 수 있습니다.