# SPARK Frontend Deployment Guide

## Vercel 배포 가이드

### 1. 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해야 합니다:

#### 필수 환경변수
```bash
VITE_API_BASE_URL=https://your-backend-url.railway.app/api/v1
VITE_APP_NAME=SPARK
VITE_NODE_ENV=production
```

### 2. Vercel 대시보드에서 환경변수 설정하기

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 접속
   - 프로젝트 선택

2. **Settings → Environment Variables**
   - `Settings` 탭 클릭
   - `Environment Variables` 메뉴 선택

3. **환경변수 추가**
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend-url.railway.app/api/v1
   Environments: Production, Preview, Development
   ```
   
   ```
   Name: VITE_APP_NAME  
   Value: SPARK
   Environments: Production, Preview, Development
   ```
   
   ```
   Name: VITE_NODE_ENV
   Value: production
   Environments: Production
   ```

### 3. 자동 배포 설정

#### GitHub 연동
1. Vercel 대시보드에서 `New Project` 클릭
2. GitHub 리포지토리 선택: `spark-front`
3. Framework Preset: `Vite` 자동 감지
4. Root Directory: `./` (기본값)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Install Command: `npm install`

### 4. 배포 후 확인사항

#### 브라우저 개발자 도구에서 확인
```javascript
// Console에서 확인 가능한 로그
🌐 [API] Base URL: https://your-backend-url.railway.app/api/v1
🔧 [API] Environment: production
```

#### API 연결 테스트
1. 홈 페이지에서 오늘의 미션이 로드되는지 확인
2. 탐색 페이지에서 스토리 피드가 로드되는지 확인
3. 미션 페이지에서 미션 목록이 로드되는지 확인
4. 리워드 페이지에서 상품 목록이 로드되는지 확인

### 5. 트러블슈팅

#### CORS 에러 발생 시
백엔드 서버(Railway)에서 CORS 설정 확인:
```kotlin
@CrossOrigin(origins = ["https://your-frontend-domain.vercel.app"])
```

#### 환경변수가 적용되지 않을 때
1. Vercel 대시보드에서 환경변수 재확인
2. 프로젝트 재배포 (Deployments → Redeploy)
3. 브라우저 캐시 초기화

#### API 요청 실패 시
1. Network 탭에서 요청 URL 확인
2. Backend Railway URL이 활성 상태인지 확인
3. API 응답 상태 코드 및 에러 메시지 확인

### 6. 성능 최적화

#### Build 최적화
```json
// vite.config.ts에서 설정
{
  "build": {
    "rollupOptions": {
      "output": {
        "manualChunks": {
          "react": ["react", "react-dom"],
          "ui": ["@radix-ui/react-dialog", "@radix-ui/react-slot"],
          "utils": ["clsx", "tailwind-merge"]
        }
      }
    }
  }
}
```

### 7. 모니터링

#### Vercel Analytics
- Real User Monitoring
- Core Web Vitals 측정
- 페이지별 성능 분석

#### Error Tracking
- 콘솔 에러 모니터링
- API 에러 추적
- 사용자 피드백 수집

### 8. 주요 URL 매핑

```
Production: https://your-app.vercel.app
Preview: https://your-app-git-branch.vercel.app  
Backend: https://your-backend.railway.app
```

### 9. 배포 체크리스트

- [ ] 환경변수 설정 완료
- [ ] GitHub 리포지토리 연동
- [ ] 자동 배포 테스트
- [ ] API 연결 확인
- [ ] CORS 설정 확인
- [ ] 모든 페이지 동작 테스트
- [ ] 모바일 반응형 확인
- [ ] 성능 최적화 적용

## 추가 정보

### 개발 환경
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Zustand
- **Backend**: Spring Boot + Kotlin (Railway)
- **Database**: PostgreSQL