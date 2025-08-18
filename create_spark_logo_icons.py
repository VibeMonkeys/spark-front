#!/usr/bin/env python3
"""
SPARK 로고 스타일 PWA 아이콘 생성기
로그인 화면과 동일한 디자인으로 아이콘을 만듭니다.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import math
    import os
except ImportError:
    print("❌ PIL 라이브러리가 필요합니다!")
    print("설치 명령: pip install Pillow")
    exit(1)

def draw_sparkles_icon(draw, center_x, center_y, size):
    """
    Sparkles 아이콘을 그립니다 (✨ 모양)
    """
    # 중심점
    cx, cy = center_x, center_y
    
    # 메인 별 (큰 별)
    main_size = size * 0.4
    
    # 4개 방향 선 (십자가 모양)
    line_width = max(2, int(size * 0.08))
    
    # 세로선
    draw.rectangle([
        cx - line_width//2, 
        cy - main_size//2, 
        cx + line_width//2, 
        cy + main_size//2
    ], fill='white')
    
    # 가로선
    draw.rectangle([
        cx - main_size//2, 
        cy - line_width//2, 
        cx + main_size//2, 
        cy + line_width//2
    ], fill='white')
    
    # 대각선들
    diagonal_length = main_size * 0.7
    diagonal_width = max(1, int(size * 0.06))
    
    # 오른쪽 위 대각선
    for i in range(int(diagonal_length)):
        x = cx + i * 0.7
        y = cy - i * 0.7
        if 0 <= x < 1000 and 0 <= y < 1000:  # 경계 체크
            draw.ellipse([x-diagonal_width, y-diagonal_width, x+diagonal_width, y+diagonal_width], fill='white')
    
    # 왼쪽 위 대각선
    for i in range(int(diagonal_length)):
        x = cx - i * 0.7
        y = cy - i * 0.7
        if 0 <= x < 1000 and 0 <= y < 1000:
            draw.ellipse([x-diagonal_width, y-diagonal_width, x+diagonal_width, y+diagonal_width], fill='white')
    
    # 작은 별들 추가
    small_stars = [
        (cx + main_size * 0.8, cy - main_size * 0.6, size * 0.15),
        (cx - main_size * 0.9, cy + main_size * 0.5, size * 0.12),
        (cx + main_size * 0.6, cy + main_size * 0.8, size * 0.1),
    ]
    
    for star_x, star_y, star_size in small_stars:
        # 작은 십자가
        small_line = max(1, int(star_size * 0.8))
        draw.rectangle([
            star_x - small_line//2, 
            star_y - star_size//2, 
            star_x + small_line//2, 
            star_y + star_size//2
        ], fill='white')
        draw.rectangle([
            star_x - star_size//2, 
            star_y - small_line//2, 
            star_x + star_size//2, 
            star_y + small_line//2
        ], fill='white')

def create_spark_logo_icon(size, output_path):
    """SPARK 로고 스타일 아이콘 생성"""
    
    # 캔버스 생성 (투명 배경)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 그라데이션 배경 (Purple to Blue)
    # PIL에서는 그라데이션이 복잡하므로 단색으로 시작
    corner_radius = int(size * 0.18)  # 18% 둥근 모서리 (rounded-2xl 느낌)
    
    # 그라데이션 효과를 위해 여러 색상으로 레이어 만들기
    for i in range(size):
        for j in range(size):
            # 둥근 사각형 내부인지 확인
            distance_to_corner = min(
                min(i, j, size-i-1, size-j-1),
                corner_radius
            )
            
            if (i < corner_radius and j < corner_radius):
                # 왼쪽 위 모서리
                dist = math.sqrt((i - corner_radius)**2 + (j - corner_radius)**2)
                if dist > corner_radius:
                    continue
            elif (i < corner_radius and j >= size - corner_radius):
                # 왼쪽 아래 모서리
                dist = math.sqrt((i - corner_radius)**2 + (j - (size - corner_radius - 1))**2)
                if dist > corner_radius:
                    continue
            elif (i >= size - corner_radius and j < corner_radius):
                # 오른쪽 위 모서리
                dist = math.sqrt((i - (size - corner_radius - 1))**2 + (j - corner_radius)**2)
                if dist > corner_radius:
                    continue
            elif (i >= size - corner_radius and j >= size - corner_radius):
                # 오른쪽 아래 모서리
                dist = math.sqrt((i - (size - corner_radius - 1))**2 + (j - (size - corner_radius - 1))**2)
                if dist > corner_radius:
                    continue
            
            # 그라데이션 계산 (from-purple-500 to-blue-600)
            # 대각선 그라데이션
            gradient_ratio = (i + j) / (2 * size)
            
            # Purple: #8b5cf6, Blue: #2563eb
            purple_r, purple_g, purple_b = 139, 92, 246
            blue_r, blue_g, blue_b = 37, 99, 235
            
            r = int(purple_r + (blue_r - purple_r) * gradient_ratio)
            g = int(purple_g + (blue_g - purple_g) * gradient_ratio)
            b = int(purple_b + (blue_b - purple_b) * gradient_ratio)
            
            img.putpixel((i, j), (r, g, b, 255))
    
    # Sparkles 아이콘 그리기
    center_x = size // 2
    center_y = size // 2
    sparkles_size = int(size * 0.5)  # 아이콘 크기
    
    draw_sparkles_icon(draw, center_x, center_y, sparkles_size)
    
    # 저장
    img.save(output_path, 'PNG')
    print(f"✨ {output_path} 생성 완료 ({size}x{size})")

def main():
    print("✨ SPARK 로고 스타일 PWA 아이콘 생성 시작...")
    
    # 아이콘 크기들
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # 출력 폴더
    icons_dir = "/Users/jinan/vibe/project/spark/spark-front/public/icons"
    
    # 기존 파일들 백업
    import shutil
    backup_dir = f"{icons_dir}/backup"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        
    for filename in os.listdir(icons_dir):
        if filename.endswith('.png'):
            shutil.move(
                os.path.join(icons_dir, filename),
                os.path.join(backup_dir, filename)
            )
    print(f"📁 기존 아이콘들을 {backup_dir}로 백업했습니다.")
    
    # 각 크기별 SPARK 로고 아이콘 생성
    for size in sizes:
        output_path = os.path.join(icons_dir, f"icon-{size}x{size}.png")
        create_spark_logo_icon(size, output_path)
    
    print("\n🎉 SPARK 로고 아이콘 생성 완료!")
    print(f"📁 위치: {icons_dir}")
    
    # 생성된 파일들 확인
    print("\n📋 생성된 파일들:")
    for filename in sorted(os.listdir(icons_dir)):
        if filename.endswith('.png'):
            filepath = os.path.join(icons_dir, filename)
            file_size = os.path.getsize(filepath)
            print(f"   ✨ {filename} ({file_size:,} bytes)")

if __name__ == "__main__":
    main()