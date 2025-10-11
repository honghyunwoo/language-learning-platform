/**
 * Uploaded Activities 분석 스크립트
 * 48개 Activity JSON 파일의 구조와 품질을 분석
 */

const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../data/activities/uploaded');

// 색상 출력
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function analyze() {
  console.log('\n' + colors.cyan + '=== Uploaded Activities 분석 시작 ===' + colors.reset + '\n');

  const files = fs.readdirSync(UPLOAD_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.log(colors.red + '❌ JSON 파일이 없습니다.' + colors.reset);
    return;
  }

  console.log(colors.green + `✅ 총 ${files.length}개 파일 발견\n` + colors.reset);

  const results = {
    total: files.length,
    byType: {},
    byWeek: {},
    issues: [],
    statistics: {
      totalExercises: 0,
      totalExamples: 0,
      avgEstimatedTime: 0,
      missingFields: [],
    },
  };

  files.forEach((file) => {
    const filePath = path.join(UPLOAD_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);

      // 타입별 카운트
      const type = json.type || 'unknown';
      results.byType[type] = (results.byType[type] || 0) + 1;

      // 주차별 카운트
      const week = json.week || 'unknown';
      results.byWeek[`week-${week}`] = (results.byWeek[`week-${week}`] || 0) + 1;

      // 필수 필드 검증
      const requiredFields = ['id', 'type', 'level', 'week', 'title', 'estimatedTime', 'objectives', 'content'];
      const missingFields = requiredFields.filter(field => !json[field]);

      if (missingFields.length > 0) {
        results.issues.push({
          file,
          type: 'missing_fields',
          fields: missingFields,
        });
      }

      // 통계 수집
      if (json.estimatedTime) {
        results.statistics.avgEstimatedTime += json.estimatedTime;
      }

      // Exercises 카운트
      if (json.content?.exercises) {
        const exerciseCount = Array.isArray(json.content.exercises)
          ? json.content.exercises.length
          : 0;
        results.statistics.totalExercises += exerciseCount;
      }

      // Examples 카운트
      if (json.content?.examples) {
        const exampleCount = Object.keys(json.content.examples).length;
        results.statistics.totalExamples += exampleCount;
      }

      // 타입별 특수 검증
      if (type === 'vocabulary') {
        if (!json.content?.theory?.semanticFields) {
          results.issues.push({
            file,
            type: 'vocabulary_missing_semantic_fields',
          });
        }
      }

      if (type === 'grammar') {
        if (!json.content?.coreTheory && !json.content?.linguisticFoundation) {
          results.issues.push({
            file,
            type: 'grammar_missing_theory',
          });
        }
      }

      if (type === 'listening') {
        if (!json.audioFiles) {
          results.issues.push({
            file,
            type: 'listening_missing_audio_files',
          });
        }
      }

    } catch (error) {
      results.issues.push({
        file,
        type: 'parse_error',
        error: error.message,
      });
    }
  });

  // 평균 계산
  results.statistics.avgEstimatedTime = Math.round(
    results.statistics.avgEstimatedTime / files.length
  );

  // 결과 출력
  console.log(colors.magenta + '📊 타입별 분포:' + colors.reset);
  Object.entries(results.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}개`);
  });

  console.log('\n' + colors.magenta + '📅 주차별 분포:' + colors.reset);
  Object.entries(results.byWeek)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([week, count]) => {
      const expected = 6;
      const status = count === expected
        ? colors.green + '✅'
        : colors.yellow + '⚠️';
      console.log(`  ${status} ${week}: ${count}/${expected}개` + colors.reset);
    });

  console.log('\n' + colors.magenta + '📈 통계:' + colors.reset);
  console.log(`  총 Exercises: ${results.statistics.totalExercises}개`);
  console.log(`  총 Examples: ${results.statistics.totalExamples}개`);
  console.log(`  평균 예상 시간: ${results.statistics.avgEstimatedTime}분`);

  // 이슈 출력
  if (results.issues.length > 0) {
    console.log('\n' + colors.yellow + '⚠️  발견된 이슈:' + colors.reset);
    results.issues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.file}: ${issue.type}`);
      if (issue.fields) {
        console.log(`     누락 필드: ${issue.fields.join(', ')}`);
      }
      if (issue.error) {
        console.log(`     에러: ${issue.error}`);
      }
    });
  } else {
    console.log('\n' + colors.green + '✅ 모든 파일이 정상입니다!' + colors.reset);
  }

  // 완성도 점수
  const completeness = ((files.length - results.issues.length) / files.length) * 100;
  console.log('\n' + colors.cyan + `📊 전체 완성도: ${completeness.toFixed(1)}%` + colors.reset);

  // Week-Type 매트릭스
  console.log('\n' + colors.magenta + '📋 Week-Type 매트릭스:' + colors.reset);
  const matrix = {};
  files.forEach((file) => {
    const match = file.match(/week-(\d+)-(\w+)\.json/);
    if (match) {
      const [, week, type] = match;
      if (!matrix[week]) matrix[week] = {};
      matrix[week][type] = '✓';
    }
  });

  const types = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];
  console.log('\n  Week | ' + types.join(' | '));
  console.log('  ' + '-'.repeat(70));

  for (let week = 1; week <= 8; week++) {
    const row = types.map(type => matrix[week]?.[type] || ' ').join(' | ');
    console.log(`  W${week}   | ${row}`);
  }

  console.log('\n' + colors.cyan + '=== 분석 완료 ===' + colors.reset + '\n');
}

analyze();
