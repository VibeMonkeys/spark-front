#!/bin/bash

echo "🎨 Spark PWA 아이콘 생성 중..."

# 아이콘 폴더 생성
mkdir -p /Users/jinan/vibe/project/spark/spark-front/public/icons

# 다양한 크기의 PNG 아이콘 생성 (SVG를 기반으로)
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "📱 ${size}x${size} 아이콘 생성 중..."
    
    # SVG 내용 생성
    cat > "/tmp/spark-icon-${size}.svg" << EOF
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="$(($size/6))" fill="url(#grad)"/>
  <text x="$(($size/2))" y="$(($size*2/3))" 
        font-family="Arial, sans-serif" 
        font-size="$(($size/2))" 
        font-weight="bold"
        fill="white" 
        text-anchor="middle">${size}</text>
</svg>
EOF
    
    # macOS에 기본 내장된 도구들로 변환 시도
    if command -v sips >/dev/null 2>&1; then
        # macOS sips 명령 사용
        sips -s format png "/tmp/spark-icon-${size}.svg" --out "/Users/jinan/vibe/project/spark/spark-front/public/icons/icon-${size}x${size}.png" 2>/dev/null || {
            echo "⚠️  sips 변환 실패, SVG 파일을 직접 복사..."
            cp "/tmp/spark-icon-${size}.svg" "/Users/jinan/vibe/project/spark/spark-front/public/icons/icon-${size}x${size}.svg"
        }
    else
        # SVG 파일로라도 생성
        cp "/tmp/spark-icon-${size}.svg" "/Users/jinan/vibe/project/spark/spark-front/public/icons/icon-${size}x${size}.svg"
    fi
    
    echo "✅ ${size}x${size} 완료"
done

# 임시 파일 정리
rm -f /tmp/spark-icon-*.svg

echo ""
echo "🎉 아이콘 생성 완료!"
echo "📁 위치: /Users/jinan/vibe/project/spark/spark-front/public/icons/"
echo ""
echo "생성된 파일들:"
ls -la "/Users/jinan/vibe/project/spark/spark-front/public/icons/"