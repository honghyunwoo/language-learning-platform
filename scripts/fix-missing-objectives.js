/**
 * Listening/Reading 파일에 objectives 필드 추가
 */

const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../data/activities/uploaded');

const OBJECTIVES_BY_TYPE = {
  listening: [
    '주요 내용 파악 능력 향상',
    '세부 정보 청취 및 이해',
    '억양과 발음 패턴 인식',
  ],
  reading: [
    '글의 주제와 요지 파악',
    '세부 정보 추출 및 이해',
    '문맥을 통한 어휘 추론',
  ],
};

function fixObjectives() {
  console.log('\n=== objectives 필드 추가 시작 ===\n');

  const files = fs.readdirSync(UPLOAD_DIR).filter((f) => f.endsWith('.json'));
  let fixed = 0;

  files.forEach((file) => {
    const filePath = path.join(UPLOAD_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);

      // objectives가 없는 listening/reading 파일만 수정
      if (!json.objectives && (json.type === 'listening' || json.type === 'reading')) {
        json.objectives = OBJECTIVES_BY_TYPE[json.type];

        // 파일 저장 (2칸 들여쓰기)
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');

        console.log(`✅ ${file}: objectives 추가 완료`);
        fixed++;
      }
    } catch (error) {
      console.error(`❌ ${file}: 오류 - ${error.message}`);
    }
  });

  console.log(`\n총 ${fixed}개 파일 수정 완료\n`);
}

fixObjectives();
