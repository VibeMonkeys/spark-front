# PWA 아이콘 가이드

## 필요한 아이콘 크기
- 72x72px - 안드로이드 ldpi
- 96x96px - 안드로이드 mdpi  
- 128x128px - 크롬 웹스토어
- 144x144px - 안드로이드 hdpi
- 152x152px - iOS
- 192x192px - 안드로이드 xxhdpi
- 384x384px - 안드로이드 xxxhdpi
- 512x512px - 플래시 스크린

## 아이콘 디자인 가이드라인

### Spark 브랜드 컬러
- 주요 컬러: #9333ea (보라색)
- 보조 컬러: #2563eb (파란색)
- 그라데이션: linear-gradient(135deg, #9333ea 0%, #2563eb 100%)

### 디자인 컨셉
1. **심볼**: ⚡ (번개) 또는 🎯 (타겟) 
2. **텍스트**: "S" 또는 "SPARK"
3. **배경**: 그라데이션 또는 단색
4. **스타일**: 둥근 모서리 (iOS 스타일)

## 임시 아이콘 생성 방법

### 온라인 도구 사용
1. **Canva** (canva.com)
   - 템플릿: "App Icon" 검색
   - 크기: 512x512px로 시작
   - 모든 크기로 리사이징

2. **PWA Builder** (pwabuilder.com)
   - 이미지 업로드 후 자동 생성

### 코드로 임시 아이콘 생성
```html
<!-- SVG로 임시 아이콘 -->
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="90" fill="url(#grad)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" 
        fill="white" text-anchor="middle" font-weight="bold">S</text>
</svg>
```

## 현재 상태
- ⚠️ 임시 파일로 설정됨
- 📝 실제 디자인된 아이콘 필요
- 🔄 자동 리사이징 도구 사용 권장