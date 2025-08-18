#!/bin/bash

echo "✨ SPARK 로고 스타일 PWA 아이콘 생성 중..."

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
    
    # 비율 계산 (bash에서 안전한 계산)
    corner_radius=$((size / 6))
    sparkles_x=$((size / 2))
    sparkles_y=$((size / 2))
    
    # 별 크기들
    main_star_half=$((size / 8))
    small_star_size=$((size / 20))
    line_width=$((size / 32))
    if [ $line_width -lt 3 ]; then line_width=3; fi
    
    # 대각선 요소들
    diagonal_half=$((size / 12))
    
    # 작은 별 위치들
    small1_x=$((sparkles_x + size / 6))
    small1_y=$((sparkles_y - size / 8))
    small2_x=$((sparkles_x - size / 5))
    small2_y=$((sparkles_y + size / 8))
    small3_x=$((sparkles_x + size / 8))
    small3_y=$((sparkles_y + size / 6))
    
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
    <rect x="-${line_width}" y="-${main_star_half}" width="$((line_width * 2))" height="$((main_star_half * 2))" />
    <rect x="-${main_star_half}" y="-${line_width}" width="$((main_star_half * 2))" height="$((line_width * 2))" />
    
    <!-- 대각선들 -->
    <g transform="rotate(45)">
      <rect x="-$((line_width / 2))" y="-${diagonal_half}" width="${line_width}" height="$((diagonal_half * 2))" />
      <rect x="-${diagonal_half}" y="-$((line_width / 2))" width="$((diagonal_half * 2))" height="${line_width}" />
    </g>
    
    <!-- 작은 별들 -->
    <g transform="translate($((small1_x - sparkles_x)),$((small1_y - sparkles_y)))">
      <rect x="-${small_star_size}" y="-1" width="$((small_star_size * 2))" height="2" />
      <rect x="-1" y="-${small_star_size}" width="2" height="$((small_star_size * 2))" />
    </g>
    
    <g transform="translate($((small2_x - sparkles_x)),$((small2_y - sparkles_y)))">
      <rect x="-${small_star_size}" y="-1" width="$((small_star_size * 2))" height="2" />
      <rect x="-1" y="-${small_star_size}" width="2" height="$((small_star_size * 2))" />
    </g>
    
    <g transform="translate($((small3_x - sparkles_x)),$((small3_y - sparkles_y)))">
      <rect x="-$((small_star_size / 2))" y="-1" width="${small_star_size}" height="2" />
      <rect x="-1" y="-$((small_star_size / 2))" width="2" height="${small_star_size}" />
    </g>
  </g>
  
</svg>
EOF

    echo "✅ icon-${size}x${size}.svg 생성 완료"
done

echo ""
echo "🎉 SPARK 로고 SVG 아이콘 생성 완료!"
echo "📁 생성된 파일들:"
ls -la *.svg 2>/dev/null | head -10

echo ""
echo "🌐 브라우저에서 확인:"
echo "   http://localhost:3000/icons/icon-192x192.svg"
echo "   http://localhost:3000/icons/icon-512x512.svg"

echo ""
echo "📝 참고: SVG 파일로 생성되었습니다."
echo "   PWA는 SVG도 지원하므로 바로 사용 가능합니다!"