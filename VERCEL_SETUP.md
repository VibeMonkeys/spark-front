# Vercel 배포 빠른 설정 가이드

## 🚀 1단계: 환경변수 설정

### Vercel 대시보드에서 설정할 환경변수

| Name | Value | Environment |
|------|-------|------------|
| `VITE_API_BASE_URL` | `https://your-backend.railway.app/api/v1` | Production, Preview |
| `VITE_APP_NAME` | `SPARK` | All |
| `VITE_NODE_ENV` | `production` | Production |

### 설정 방법
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables 
3. 위 표의 환경변수들을 하나씩 추가

## 🔧 2단계: 백엔드 CORS 설정 업데이트

백엔드 Railway 서버에서 Vercel 도메인을 CORS에 추가해야 합니다:

```kotlin
@CrossOrigin(origins = [
    "http://localhost:3001", 
    "http://localhost:3002", 
    "http://localhost:5173",
    "https://your-app.vercel.app",           // 추가 필요
    "https://your-app-git-*.vercel.app"      // Preview 브랜치용
])
```

## 📋 3단계: 배포 체크리스트

- [ ] 환경변수 3개 모두 설정 완료
- [ ] 백엔드 CORS에 Vercel 도메인 추가
- [ ] GitHub 자동 배포 연동 완료
- [ ] 첫 배포 성공 확인

## ✅ 4단계: 배포 후 확인

### 브라우저 개발자 도구에서 확인
```
🌐 [API] Base URL: https://your-backend.railway.app/api/v1
🔧 [API] Environment: production
```

### 기능 테스트
- [ ] 홈: 오늘의 미션 로드
- [ ] 탐색: 스토리 피드 로드  
- [ ] 미션: 미션 목록 로드
- [ ] 리워드: 상품 목록 로드
- [ ] 프로필: 사용자 정보 로드

## 🔗 배포 완료 후 URL

```
Production: https://your-app.vercel.app
Backend: https://your-backend.railway.app
```

## ❗ 트러블슈팅

### API 연결 실패 시
1. Network 탭에서 CORS 에러 확인
2. 환경변수 `VITE_API_BASE_URL` 재확인
3. 백엔드 Railway 서버 상태 확인

### 환경변수 적용 안 될 때
1. Vercel 대시보드에서 환경변수 재확인
2. Deployments → Redeploy 실행
3. 브라우저 캐시 삭제 후 재접속