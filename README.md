# Spark Front

Figma에서 생성된 React + TypeScript + Tailwind CSS 프로젝트입니다.

## 🚀 시작하기

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm start
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
spark-front/
├── src/
│   ├── components/          # React 컴포넌트들
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── main.tsx            # 앱 진입점
├── styles/
│   └── globals.css         # 전역 스타일
├── package.json             # 의존성 및 스크립트
├── tsconfig.json            # TypeScript 설정
├── vite.config.ts           # Vite 설정
├── tailwind.config.js       # Tailwind CSS 설정
└── postcss.config.js        # PostCSS 설정
```

## 🛠️ 사용 기술

- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Vite** - 빠른 빌드 도구
- **shadcn/ui** - UI 컴포넌트 라이브러리

## 🔗 백엔드 연동

프로젝트는 스프링부트 백엔드와 연동되도록 설정되어 있습니다:

- **프론트엔드**: http://localhost:3000
- **백엔드**: http://localhost:8080
- **API 프록시**: `/api/*` 요청이 자동으로 백엔드로 전달됩니다

### API 호출 예시
```typescript
// /api/missions → http://localhost:8080/missions
const response = await fetch('/api/missions');
```

## 📱 주요 기능

- 홈 페이지
- 피드 페이지
- 미션 페이지
- 보상 페이지
- 프로필 페이지
- 미션 상세 및 인증
