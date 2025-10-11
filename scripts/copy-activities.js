/**
 * Copy Activities Script
 * data/activities/ → public/activities/ 복사
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'data', 'activities');
const TARGET_DIR = path.join(process.cwd(), 'public', 'activities');

const ACTIVITY_TYPES = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

function copyActivities() {
  console.log('\n=== Activity 파일 복사 시작 ===\n');

  // Target 디렉토리 생성
  ensureDirectoryExists(TARGET_DIR);

  let copiedCount = 0;
  let errorCount = 0;

  ACTIVITY_TYPES.forEach((type) => {
    const sourceFolder = path.join(SOURCE_DIR, type);
    const targetFolder = path.join(TARGET_DIR, type);

    if (!fs.existsSync(sourceFolder)) {
      console.warn(`⚠️  Source folder not found: ${sourceFolder}`);
      return;
    }

    ensureDirectoryExists(targetFolder);

    const files = fs.readdirSync(sourceFolder);

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        try {
          const sourcePath = path.join(sourceFolder, file);
          const targetPath = path.join(targetFolder, file);

          // JSON 파일 읽기 및 검증
          const content = fs.readFileSync(sourcePath, 'utf-8');
          const json = JSON.parse(content);

          // 파일 복사
          fs.copyFileSync(sourcePath, targetPath);

          console.log(`✅ Copied: ${type}/${file}`);
          copiedCount++;
        } catch (error) {
          console.error(`❌ Error copying ${type}/${file}:`, error.message);
          errorCount++;
        }
      }
    });
  });

  console.log('\n=== Activity 파일 복사 완료 ===');
  console.log(`총 복사: ${copiedCount}개`);
  console.log(`에러: ${errorCount}개\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// 메타데이터 생성
function generateMetadata() {
  console.log('\n=== Activity 메타데이터 생성 시작 ===\n');

  const metadata = [];

  ACTIVITY_TYPES.forEach((type) => {
    const folder = path.join(SOURCE_DIR, type);

    if (!fs.existsSync(folder)) {
      return;
    }

    const files = fs.readdirSync(folder);

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(folder, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const activity = JSON.parse(content);

          metadata.push({
            id: activity.id,
            type: activity.type,
            weekId: activity.weekId,
            level: activity.level,
            title: activity.title,
            description: activity.description,
            estimatedTime: activity.estimatedTime,
            difficulty: activity.difficulty,
          });
        } catch (error) {
          console.error(`❌ Error reading ${type}/${file}:`, error.message);
        }
      }
    });
  });

  // 메타데이터 파일 저장
  const metadataPath = path.join(TARGET_DIR, '..', 'activities-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(`✅ 메타데이터 생성 완료: ${metadata.length}개 Activity`);
  console.log(`   파일 위치: ${metadataPath}\n`);
}

// 실행
try {
  copyActivities();
  generateMetadata();
  console.log('🎉 모든 작업 완료!\n');
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
