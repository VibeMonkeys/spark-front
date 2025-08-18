#!/usr/bin/env python3
"""
Spark PWA 아이콘 자동 생성기
PIL(Pillow) 라이브러리를 사용하여 모든 크기의 아이콘을 생성합니다.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("❌ PIL 라이브러리가 필요합니다!")
    print("설치 명령: pip install Pillow")
    exit(1)

def create_spark_icon(size, output_path):
    """Spark 브랜드 아이콘 생성"""
    
    # 캔버스 생성
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 둥근 사각형 배경 (그라데이션 대신 단색)
    background_color = (147, 51, 234)  # #9333ea (Purple)
    corner_radius = int(size * 0.18)  # 18% 둥근 모서리
    
    # 둥근 사각형 그리기
    draw.rounded_rectangle(
        [(0, 0), (size, size)], 
        radius=corner_radius, 
        fill=background_color
    )
    
    # 텍스트 "S" 그리기
    try:
        # 시스템 폰트 찾기
        font_size = int(size * 0.55)  # 55% 크기
        font = ImageFont.truetype("Arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
        except:
            # 기본 폰트 사용
            font = ImageFont.load_default()
    
    text = "S"
    
    # 텍스트 크기 계산
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # 중앙 정렬
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2
    
    # 텍스트 그리기
    draw.text((text_x, text_y), text, fill='white', font=font)
    
    # 작은 번개 이모티콘 (큰 아이콘에만)
    if size >= 192:
        spark_size = int(size * 0.15)
        spark_x = int(size * 0.75)
        spark_y = int(size * 0.25)
        draw.text((spark_x, spark_y), "⚡", fill='white', font=font)
    
    # 저장
    img.save(output_path, 'PNG')
    print(f"✅ {output_path} 생성 완료 ({size}x{size})")

def main():
    # 아이콘 크기들
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # 출력 폴더
    icons_dir = "/Users/jinan/vibe/project/spark/spark-front/public/icons"
    
    # 폴더가 없으면 생성
    os.makedirs(icons_dir, exist_ok=True)
    
    print("🎨 Spark PWA 아이콘 생성 시작...")
    
    # 각 크기별 아이콘 생성
    for size in sizes:
        output_path = os.path.join(icons_dir, f"icon-{size}x{size}.png")
        create_spark_icon(size, output_path)
    
    print("\n🎉 모든 아이콘 생성 완료!")
    print(f"📁 위치: {icons_dir}")
    
    # 생성된 파일들 확인
    print("\n📋 생성된 파일들:")
    for filename in sorted(os.listdir(icons_dir)):
        if filename.endswith('.png'):
            filepath = os.path.join(icons_dir, filename)
            file_size = os.path.getsize(filepath)
            print(f"   {filename} ({file_size:,} bytes)")

if __name__ == "__main__":
    main()