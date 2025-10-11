/**
 * Placeholder Icon Generator
 * 브랜드 로고가 없을 때 임시 PWA 아이콘 생성
 *
 * 나중에 public/icon-source.png를 교체하고 generate-pwa-icons.js 재실행
 */

const sharp = require('sharp');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'icon-source.png');

async function generatePlaceholder() {
  console.log('🎨 플레이스홀더 아이콘 생성 중...\n');

  // 1024x1024 인디고 그라데이션 배경 + 텍스트
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- 배경 -->
      <rect width="1024" height="1024" fill="url(#grad)" />

      <!-- 중앙 원 -->
      <circle cx="512" cy="512" r="380" fill="white" opacity="0.2" />
      <circle cx="512" cy="512" r="320" fill="white" opacity="0.3" />

      <!-- 텍스트 -->
      <text
        x="512"
        y="560"
        font-family="Arial, sans-serif"
        font-size="280"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
      >영</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(OUTPUT_PATH);

    console.log(`✅ 플레이스홀더 생성 완료: ${OUTPUT_PATH}`);
    console.log('\n📝 다음 단계:');
    console.log('   1. node scripts/generate-pwa-icons.js 실행');
    console.log('   2. 나중에 브랜드 로고로 교체: public/icon-source.png');
    console.log('   3. 교체 후 generate-pwa-icons.js 재실행');
  } catch (error) {
    console.error('❌ 생성 실패:', error.message);
    process.exit(1);
  }
}

generatePlaceholder();
