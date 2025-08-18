#!/bin/bash

echo "✨ SPARK 로고 스타일 SVG 아이콘 생성 중..."

# 아이콘 폴더로 이동
cd /Users/jinan/vibe/project/spark/spark-front/public/icons

# 기존 아이콘들 백업
mkdir -p backup
mv *.png backup/ 2>/dev/null || true
echo "📁 기존 아이콘들 백업 완료"

# 다양한 크기의 SPARK 로고 SVG 생성
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "✨ ${size}x${size} SPARK 로고 아이콘 생성 중..."
    
    # 비율 계산
    corner_radius=$((size / 6))  # rounded-2xl 느낌
    sparkles_size=$((size / 2))  # 50% 크기
    sparkles_x=$((size / 2))
    sparkles_y=$((size / 2))
    
    # 별 크기들
    main_star_size=$((sparkles_size / 3))
    small_star_size=$((sparkles_size / 8))
    line_width=$((size / 25))
    
    # SPARK 로고 스타일 SVG 생성
    cat > "icon-${size}x${size}.svg" << EOF
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sparkGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>
  
  <!-- 둥근 사각형 배경 (로그인 화면과 동일) -->
  <rect width="${size}" height="${size}" rx="${corner_radius}" fill="url(#sparkGrad${size})"/>
  
  <!-- Sparkles 아이콘 (✨ 모양) -->
  <g transform="translate(${sparkles_x},${sparkles_y})" fill="white">
    <!-- 메인 별 (십자가 모양) -->
    <rect x="${-line_width/2}" y="${-main_star_size/2}" width="${line_width}" height="${main_star_size}" />
    <rect x="${-main_star_size/2}" y="${-line_width/2}" width="${main_star_size}" height="${line_width}" />
    
    <!-- 대각선들 -->
    <rect x="${-line_width/2}" y="${-main_star_size/2}" width="${line_width}" height="${main_star_size}" 
          transform="rotate(45)" />
    <rect x="${-main_star_size/2}" y="${-line_width/2}" width="${main_star_size}" height="${line_width}" 
          transform="rotate(45)" />
    
    <!-- 작은 별들 -->
    <g transform="translate(${main_star_size*0.8},${-main_star_size*0.6})">
      <rect x="${-small_star_size/2}" y="${-small_star_size/2}" width="${small_star_size}" height="${line_width/2}" />
      <rect x="${-line_width/4}" y="${-small_star_size/2}" width="${line_width/2}" height="${small_star_size}" />
    </g>
    
    <g transform="translate(${-main_star_size*0.9},${main_star_size*0.5})">
      <rect x="${-small_star_size/2}" y="${-small_star_size/2}" width="${small_star_size}" height="${line_width/2}" />
      <rect x="${-line_width/4}" y="${-small_star_size/2}" width="${line_width/2}" height="${small_star_size}" />
    </g>
    
    <g transform="translate(${main_star_size*0.6},${main_star_size*0.8})">
      <rect x="${-small_star_size/3}" y="${-small_star_size/3}" width="${small_star_size/2}" height="${line_width/3}" />
      <rect x="${-line_width/6}" y="${-small_star_size/3}" width="${line_width/3}" height="${small_star_size/2}" />
    </g>
  </g>
  
</svg>
EOF

    # macOS sips로 PNG 변환 시도
    if command -v sips >/dev/null 2>&1; then
        sips -s format png "icon-${size}x${size}.svg" --out "icon-${size}x${size}.png" 2>/dev/null && rm "icon-${size}x${size}.svg"
        echo "✅ icon-${size}x${size}.png 생성 완료"
    else
        echo "✅ icon-${size}x${size}.svg 생성 완료 (PNG 변환 불가)"
    fi
done

echo ""
echo "🎉 SPARK 로고 아이콘 생성 완료!"
echo "📁 생성된 파일들:"
ls -la *.png *.svg 2>/dev/null | head -10

echo ""
echo "🌐 브라우저에서 확인: http://localhost:3000/icons/icon-192x192.png"