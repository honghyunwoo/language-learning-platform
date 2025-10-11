/**
 * 검증된 Activity 파일들을 public/activities/로 배포
 * 타입별 폴더 구조로 정리
 */

const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../data/activities/uploaded');
const PUBLIC_DIR = path.join(__dirname, '../public/activities');

// 타입별 폴더명 매핑
const TYPE_FOLDERS = {
  vocabulary: 'vocabulary',
  grammar: 'grammar',
  listening: 'listening',
  speaking: 'speaking',
  reading: 'reading',
  writing: 'writing',
};

function deployActivities() {
  console.log('\n=== Activity 배포 시작 ===\n');

  // public/activities/ 폴더 생성
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 타입별 폴더 생성
  Object.values(TYPE_FOLDERS).forEach((folder) => {
    const folderPath = path.join(PUBLIC_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  const files = fs.readdirSync(UPLOAD_DIR).filter((f) => f.endsWith('.json'));
  let deployed = 0;

  files.forEach((file) => {
    const sourcePath = path.join(UPLOAD_DIR, file);

    try {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      const json = JSON.parse(content);

      const type = json.type;
      if (!type || !TYPE_FOLDERS[type]) {
        console.log(`⚠️  ${file}: 알 수 없는 타입 (${type}), 스킵`);
        return;
      }

      // 목적지 경로: public/activities/{type}/week-{week}-{type}.json
      const destFolder = path.join(PUBLIC_DIR, TYPE_FOLDERS[type]);
      const destPath = path.join(destFolder, file);

      // 파일 복사
      fs.copyFileSync(sourcePath, destPath);

      console.log(`✅ ${file} → ${TYPE_FOLDERS[type]}/`);
      deployed++;
    } catch (error) {
      console.error(`❌ ${file}: 오류 - ${error.message}`);
    }
  });

  console.log(`\n총 ${deployed}개 파일 배포 완료`);

  // 메타데이터 파일 생성
  generateMetadata();

  console.log('\n=== 배포 완료 ===\n');
}

function generateMetadata() {
  const metadata = {
    generatedAt: new Date().toISOString(),
    totalActivities: 0,
    byType: {},
    byWeek: {},
    files: [],
  };

  Object.entries(TYPE_FOLDERS).forEach(([type, folder]) => {
    const folderPath = path.join(PUBLIC_DIR, folder);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.json'));

    metadata.byType[type] = files.length;
    metadata.totalActivities += files.length;

    files.forEach((file) => {
      const match = file.match(/week-(\d+)-(\w+)\.json/);
      if (match) {
        const [, week] = match;
        const weekKey = `week-${week}`;
        metadata.byWeek[weekKey] = (metadata.byWeek[weekKey] || 0) + 1;

        metadata.files.push({
          file,
          type,
          week: parseInt(week),
          path: `/activities/${folder}/${file}`,
        });
      }
    });
  });

  // 메타데이터 저장
  const metadataPath = path.join(PUBLIC_DIR, 'activities-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(`\n📋 메타데이터 생성 완료: activities-metadata.json`);
  console.log(`   총 ${metadata.totalActivities}개 Activity`);
}

deployActivities();
