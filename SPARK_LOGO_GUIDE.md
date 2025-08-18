# ✨ SPARK 로고 PWA 아이콘 만들기 가이드

## 🎯 목표
로그인 화면의 SPARK 로고와 동일한 디자인으로 PWA 아이콘을 만들어보자!

## 📐 현재 로그인 화면 디자인
```tsx
<div className="size-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
  <Sparkles className="size-6 text-white" />
</div>
```

### 디자인 스펙:
- **배경**: Purple-Blue 그라데이션 (`#8b5cf6` → `#2563eb`)
- **모서리**: 둥근 사각형 (`rounded-2xl`)
- **아이콘**: Sparkles ✨ (흰색)
- **크기**: 정사각형

---

## 🛠️ 제작 방법

### **방법 1: Figma (추천)**

1. **Figma 열기**: [figma.com](https://figma.com)
2. **새 파일 생성**
3. **512x512 Frame 생성**
4. **배경 만들기**:
   ```
   Rectangle → 512x512
   Fill → Linear Gradient
   색상 1: #8b5cf6 (Purple)
   색상 2: #2563eb (Blue)
   Corner Radius: 90px (18% of 512)
   ```
5. **Sparkles 아이콘 추가**:
   ```
   Plugins → "Lucide" 검색 → 설치
   "Sparkles" 검색 → 추가
   크기: 256x256 (50% of 512)
   색상: White (#FFFFFF)
   중앙 정렬
   ```
6. **Export**:
   ```
   Export → PNG
   512x512, 384x384, 192x192, 152x152, 144x144, 128x128, 96x96, 72x72
   ```

### **방법 2: Canva**

1. **Canva 열기**: [canva.com](https://canva.com)
2. **"Custom Size" → 512x512px**
3. **배경**:
   ```
   Elements → Shapes → Rectangle
   크기: 전체 화면
   색상: Gradient (Purple to Blue)
   모서리: 둥글게
   ```
4. **아이콘**:
   ```
   Elements → Icons → "sparkles" 검색
   색상: White
   중앙 배치
   ```
5. **Download**: PNG, 다양한 크기

### **방법 3: 온라인 아이콘 생성기**

1. **PWA Builder**: [pwabuilder.com/imageGenerator](https://pwabuilder.com/imageGenerator)
2. **Favicon.io**: [favicon.io](https://favicon.io/favicon-generator/)
3. **기본 설정**:
   ```
   Background: Purple Gradient
   Icon: Sparkles ✨
   Shape: Rounded Rectangle
   ```

---

## 🎨 **임시 방법: 이모티콘 아이콘**

지금 당장 테스트하려면 이모티콘으로도 가능해요!

```bash
# 이모티콘 버전으로 임시 생성
```