/**
 * PWA Icon Generator
 * Delta 6: 10가지 사이즈 + purpose: "any maskable" 지원
 *
 * Requirements:
 * - 1024x1024 소스 이미지 (public/icon-source.png)
 * - sharp 라이브러리 설치 완료
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const SOURCE_IMAGE = path.join(PUBLIC_DIR, 'icon-source.png');

// Delta 6: Lighthouse PWA 감사 통과를 위한 10가지 사이즈
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // iOS Safari
];

async function generateIcons() {
  console.log('🎨 PWA 아이콘 생성 시작...\n');

  // 1. 소스 이미지 존재 확인
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`❌ 소스 이미지를 찾을 수 없습니다: ${SOURCE_IMAGE}`);
    console.error('📝 다음 중 하나를 수행하세요:');
    console.error('   1. public/icon-source.png 파일 생성 (1024x1024 PNG)');
    console.error('   2. 기존 로고 파일을 icon-source.png로 이름 변경');
    process.exit(1);
  }

  // 2. 소스 이미지 정보 확인
  try {
    const metadata = await sharp(SOURCE_IMAGE).metadata();
    console.log(`✅ 소스 이미지: ${metadata.width}x${metadata.height} ${metadata.format}`);

    if (metadata.width < 512 || metadata.height < 512) {
      console.warn('⚠️  경고: 소스 이미지가 512x512보다 작습니다. 품질이 저하될 수 있습니다.');
    }
  } catch (error) {
    console.error('❌ 소스 이미지 읽기 실패:', error.message);
    process.exit(1);
  }

  // 3. 각 사이즈별로 아이콘 생성
  console.log(`\n📦 ${ICON_SIZES.length}개 아이콘 생성 중...\n`);

  for (const { size, name } of ICON_SIZES) {
    const outputPath = path.join(PUBLIC_DIR, name);

    try {
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);

      console.log(`  ✅ ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`  ❌ ${name} 생성 실패:`, error.message);
    }
  }

  console.log('\n🎉 PWA 아이콘 생성 완료!');
  console.log('\n📝 다음 단계:');
  console.log('   1. public/manifest.json 업데이트 (Delta 10)');
  console.log('   2. npm run build로 빌드 테스트');
  console.log('   3. Lighthouse PWA 감사 실행');
}

// 실행
generateIcons().catch((error) => {
  console.error('💥 치명적 오류:', error);
  process.exit(1);
});
