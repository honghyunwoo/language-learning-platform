/**
 * Activity JSON 파일 검증 스크립트
 *
 * 사용법:
 *   node scripts/validate-activity-json.js
 *   node scripts/validate-activity-json.js vocabulary
 *   node scripts/validate-activity-json.js data/activities/reading/week-1-reading.json
 */

const fs = require('fs');
const path = require('path');

// 색상 출력
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

// Activity 타입별 스키마 정의
const schemas = {
  vocabulary: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'words', 'exercises'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      words: 'array',
      exercises: 'array',
    },
    nested: {
      words: {
        required: ['id', 'word', 'pronunciation', 'partOfSpeech', 'meaning', 'example', 'exampleMeaning'],
      },
      exercises: {
        required: ['id', 'type', 'question', 'answer'],
      },
    },
  },

  reading: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'passage', 'vocabulary', 'questions'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      passage: 'object',
      vocabulary: 'array',
      questions: 'array',
    },
    nested: {
      passage: {
        required: ['text', 'wordCount', 'estimatedReadingTime'],
      },
      vocabulary: {
        required: ['word', 'meaning'],
      },
      questions: {
        required: ['id', 'type', 'question', 'answer'],
      },
    },
  },

  grammar: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'rules', 'exercises'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      rules: 'array',
      exercises: 'array',
    },
    nested: {
      rules: {
        required: ['id', 'rule', 'explanation', 'examples'],
      },
      exercises: {
        required: ['id', 'type', 'question', 'answer'],
      },
    },
  },

  listening: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'audio', 'questions'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      audio: 'object',
      questions: 'array',
    },
    nested: {
      audio: {
        required: ['text', 'speed'],
      },
      questions: {
        required: ['id', 'type', 'question', 'answer'],
      },
    },
  },

  writing: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'prompt', 'exampleSentences', 'vocabularyHelp', 'evaluationChecklist'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      prompt: 'object',
      exampleSentences: 'array',
      vocabularyHelp: 'array',
      evaluationChecklist: 'array',
    },
    nested: {
      prompt: {
        required: ['topic', 'description', 'requirements', 'wordCount'],
      },
      exampleSentences: {
        required: ['id', 'sentence', 'translation', 'useCase'],
      },
      vocabularyHelp: {
        required: ['word', 'translation', 'example'],
      },
      evaluationChecklist: {
        required: ['category', 'items'],
      },
    },
  },

  speaking: {
    required: ['id', 'weekId', 'type', 'level', 'title', 'description', 'sentences', 'evaluationChecklist'],
    types: {
      id: 'string',
      weekId: 'string',
      type: 'string',
      level: 'string',
      title: 'string',
      description: 'string',
      sentences: 'array',
      evaluationChecklist: 'array',
    },
    nested: {
      sentences: {
        required: ['id', 'text', 'translation'],
      },
      evaluationChecklist: {
        required: ['category', 'items'],
      },
    },
  },
};

// 타입 검증
function checkType(value, expectedType) {
  if (expectedType === 'array') {
    return Array.isArray(value);
  }
  if (expectedType === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  return typeof value === expectedType;
}

// JSON 파일 검증
function validateJSON(filePath) {
  const errors = [];
  const warnings = [];

  // 파일 존재 확인
  if (!fs.existsSync(filePath)) {
    errors.push(`파일을 찾을 수 없습니다: ${filePath}`);
    return { errors, warnings };
  }

  // JSON 파싱
  let data;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch (err) {
    errors.push(`JSON 파싱 실패: ${err.message}`);
    return { errors, warnings };
  }

  // Activity 타입 확인
  const activityType = data.type;
  if (!schemas[activityType]) {
    errors.push(`알 수 없는 Activity 타입: ${activityType}`);
    return { errors, warnings };
  }

  const schema = schemas[activityType];

  // 필수 필드 검증
  schema.required.forEach((field) => {
    if (!(field in data)) {
      errors.push(`필수 필드 누락: ${field}`);
    }
  });

  // 타입 검증
  Object.keys(schema.types).forEach((field) => {
    if (field in data) {
      const expectedType = schema.types[field];
      if (!checkType(data[field], expectedType)) {
        errors.push(`타입 불일치: ${field} (기대: ${expectedType}, 실제: ${typeof data[field]})`);
      }
    }
  });

  // 중첩 필드 검증
  if (schema.nested) {
    Object.keys(schema.nested).forEach((field) => {
      if (data[field]) {
        const nestedSchema = schema.nested[field];
        const items = Array.isArray(data[field]) ? data[field] : [data[field]];

        items.forEach((item, index) => {
          nestedSchema.required.forEach((nestedField) => {
            if (!(nestedField in item)) {
              errors.push(`${field}[${index}]: 필수 필드 누락 - ${nestedField}`);
            }
          });
        });
      }
    });
  }

  // CEFR 레벨 검증
  if (data.level && !['A1', 'A2', 'B1', 'B2'].includes(data.level)) {
    warnings.push(`잘못된 CEFR 레벨: ${data.level} (A1, A2, B1, B2만 허용)`);
  }

  // ID 형식 검증
  if (data.id && !data.id.match(/^week-\d+-\w+$/)) {
    warnings.push(`ID 형식 권장: week-{N}-{type} (현재: ${data.id})`);
  }

  return { errors, warnings };
}

// 디렉토리 내 모든 JSON 파일 검증
function validateDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && file.endsWith('.json')) {
      const { errors, warnings } = validateJSON(fullPath);
      results.push({ file: fullPath, errors, warnings });
    }
  });

  return results;
}

// 메인 실행
function main() {
  const args = process.argv.slice(2);

  log(colors.cyan, '\n=== Activity JSON 검증 시작 ===\n');

  let results = [];

  if (args.length === 0) {
    // 모든 Activity 타입 검증
    const activitiesDir = path.join(__dirname, '../data/activities');
    const activityTypes = fs.readdirSync(activitiesDir);

    // 검증에서 제외할 폴더 목록
    const excludedFolders = ['uploaded', 'week-1', 'week-2'];

    activityTypes.forEach((type) => {
      // uploaded 폴더와 week-* 폴더는 스킵 (다른 스키마 사용)
      if (excludedFolders.includes(type) || type.startsWith('week-')) {
        log(colors.yellow, `\n[${type}] 검증 스킵 (다른 스키마)`);
        return;
      }

      const typeDir = path.join(activitiesDir, type);
      if (fs.statSync(typeDir).isDirectory()) {
        log(colors.cyan, `\n[${type}] 검증 중...`);
        const typeResults = validateDirectory(typeDir);
        results.push(...typeResults);
      }
    });
  } else if (args[0].endsWith('.json')) {
    // 특정 파일 검증
    const { errors, warnings } = validateJSON(args[0]);
    results.push({ file: args[0], errors, warnings });
  } else {
    // 특정 타입 검증
    const typeDir = path.join(__dirname, `../data/activities/${args[0]}`);
    if (fs.existsSync(typeDir)) {
      const typeResults = validateDirectory(typeDir);
      results.push(...typeResults);
    } else {
      log(colors.red, `❌ 디렉토리를 찾을 수 없습니다: ${typeDir}`);
      process.exit(1);
    }
  }

  // 결과 출력
  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach(({ file, errors, warnings }) => {
    const fileName = path.basename(file);

    if (errors.length === 0 && warnings.length === 0) {
      log(colors.green, `✅ ${fileName}: 검증 통과`);
    } else {
      if (errors.length > 0) {
        log(colors.red, `\n❌ ${fileName}:`);
        errors.forEach((err) => log(colors.red, `   - ${err}`));
        totalErrors += errors.length;
      }

      if (warnings.length > 0) {
        log(colors.yellow, `\n⚠️  ${fileName}:`);
        warnings.forEach((warn) => log(colors.yellow, `   - ${warn}`));
        totalWarnings += warnings.length;
      }
    }
  });

  // 요약
  log(colors.cyan, '\n=== 검증 완료 ===');
  log(colors.cyan, `파일 수: ${results.length}`);
  log(totalErrors > 0 ? colors.red : colors.green, `에러: ${totalErrors}`);
  log(totalWarnings > 0 ? colors.yellow : colors.green, `경고: ${totalWarnings}`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main();
