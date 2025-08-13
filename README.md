# Spark Front

Figma에서 생성된 React + TypeScript + Tailwind CSS 프로젝트입니다.

## 🚀 시작하기

### 필수 조건
- Node.js 18+ 버전이 설치되어 있어야 합니다
- npm 또는 yarn 패키지 매니저가 필요합니다

### 1단계: 의존성 설치
```bash
npm install
```
⚠️ **중요**: 프로젝트를 처음 실행하기 전에 반드시 이 단계를 먼저 수행해야 합니다.

### 2단계: 개발 서버 실행
```bash
npm start
# 또는
npm run dev
```

### 3단계: 브라우저에서 확인
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

**참고**: 개발 서버가 시작되면 터미널에 로컬 및 네트워크 URL이 표시됩니다.

## ❗ 문제 해결

### "vite: command not found" 오류
이 오류는 의존성이 설치되지 않았을 때 발생합니다.

**해결 방법:**
```bash
npm install
```

### Tailwind CSS 경고
`./**/*.ts` 패턴이 `node_modules`를 포함하여 성능 문제를 일으킬 수 있습니다.

**해결 방법:**
`tailwind.config.js`에서 `"./**/*.{js,ts,jsx,tsx}"` 패턴을 제거하고 `"./src/**/*.{js,ts,jsx,tsx}"`만 사용합니다.

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
