#!/usr/bin/env node

/**
 * TTS Manifest Generator
 *
 * Placement Test와 Week 1-16의 모든 듣기 스크립트를 수집하여
 * TTS 오디오 파일 생성을 위한 manifest.json 생성
 *
 * 실행: node scripts/generate-tts-manifest.js
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const PATHS = {
  placementTest: path.join(__dirname, '../public/assessment/placement_test.json'),
  weeks1to8: 'C:\\Users\\hynoo\\Downloads\\english_curriculum_weeks1-8_json',
  weeks9to16: 'C:\\Users\\hynoo\\Downloads\\elite_track_weeks9-16_plus_placement',
  output: path.join(__dirname, 'tts-manifest.json')
};

// Manifest 데이터 구조
const manifest = {
  generatedAt: new Date().toISOString(),
  totalAudioFiles: 0,
  audioFiles: []
};

/**
 * Placement Test 듣기 스크립트 추출
 */
function extractPlacementTestAudio() {
  console.log('📖 Placement Test 분석 중...');

  const data = JSON.parse(fs.readFileSync(PATHS.placementTest, 'utf-8'));
  const listeningSection = data.sections.find(s => s.name === 'Listening (Script-based)');

  if (!listeningSection) {
    console.log('⚠️  Placement Test에 듣기 섹션이 없습니다.');
    return;
  }

  listeningSection.items.forEach((item, idx) => {
    manifest.audioFiles.push({
      id: `placement_${item.difficulty.toLowerCase()}`,
      source: 'placement_test',
      audioPath: item.audio,
      script: item.script,
      difficulty: item.difficulty,
      speaker: 'en-US-Standard-D', // Google TTS 음성
      speed: 1.0,
      context: `Placement Test - Question ${idx + 1}`
    });
  });

  console.log(`✅ Placement Test: ${listeningSection.items.length}개 오디오 발견`);
}

/**
 * Week 듣기 파일 처리
 */
function extractWeekAudio(weekNum, filePath, isElite = false) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Week ${weekNum} 듣기 파일 없음: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const audioFiles = [];

  // Main audio
  if (data.audioFiles?.main) {
    audioFiles.push({
      id: `week${weekNum}_main`,
      source: `week-${weekNum}-listening${isElite ? '-elite' : ''}`,
      audioPath: data.audioFiles.main,
      script: extractFullScript(data.content?.fullTranscript),
      difficulty: data.level,
      speaker: 'en-US-Standard-D',
      speed: 1.0,
      context: `Week ${weekNum} - Main dialogue`
    });
  }

  // Slow version
  if (data.audioFiles?.slow) {
    audioFiles.push({
      id: `week${weekNum}_slow`,
      source: `week-${weekNum}-listening${isElite ? '-elite' : ''}`,
      audioPath: data.audioFiles.slow,
      script: extractFullScript(data.content?.fullTranscript),
      difficulty: data.level,
      speaker: 'en-US-Standard-D',
      speed: 0.75,
      context: `Week ${weekNum} - Slow version`
    });
  }

  // Segments
  if (data.audioFiles?.segments && Array.isArray(data.audioFiles.segments)) {
    data.content?.fullTranscript?.paragraphs?.forEach((para, idx) => {
      if (data.audioFiles.segments[idx]) {
        audioFiles.push({
          id: `week${weekNum}_seg${idx + 1}`,
          source: `week-${weekNum}-listening${isElite ? '-elite' : ''}`,
          audioPath: data.audioFiles.segments[idx],
          script: para.text,
          difficulty: data.level,
          speaker: para.speaker === 'A' ? 'en-US-Standard-D' : 'en-US-Standard-C',
          speed: 1.0,
          context: `Week ${weekNum} - Segment ${idx + 1} (Speaker ${para.speaker})`
        });
      }
    });
  }

  manifest.audioFiles.push(...audioFiles);
  console.log(`✅ Week ${weekNum}: ${audioFiles.length}개 오디오 추가`);
}

/**
 * Full transcript에서 전체 스크립트 추출
 */
function extractFullScript(transcript) {
  if (!transcript?.paragraphs) return '';

  return transcript.paragraphs
    .map(p => p.text)
    .join(' ');
}

/**
 * Week 1-8 처리
 */
function processWeeks1to8() {
  console.log('\n📚 Week 1-8 분석 중...');

  for (let week = 1; week <= 8; week++) {
    const filename = `week-${week}-listening.json`;
    const filepath = path.join(PATHS.weeks1to8, filename);
    extractWeekAudio(week, filepath, false);
  }
}

/**
 * Week 9-16 Elite Track 처리
 */
function processWeeks9to16() {
  console.log('\n🎓 Week 9-16 Elite Track 분석 중...');

  for (let week = 9; week <= 16; week++) {
    const filename = `week-${week}-listening-elite.json`;
    const filepath = path.join(PATHS.weeks9to16, filename);
    extractWeekAudio(week, filepath, true);
  }
}

/**
 * Manifest 파일 저장
 */
function saveManifest() {
  manifest.totalAudioFiles = manifest.audioFiles.length;

  fs.writeFileSync(
    PATHS.output,
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`\n✅ TTS Manifest 생성 완료!`);
  console.log(`📁 저장 위치: ${PATHS.output}`);
  console.log(`🎧 총 오디오 파일: ${manifest.totalAudioFiles}개`);

  // 통계 출력
  const stats = {
    placement: manifest.audioFiles.filter(a => a.source === 'placement_test').length,
    weeks1to8: manifest.audioFiles.filter(a => a.source.match(/week-[1-8]-listening$/)).length,
    weeks9to16: manifest.audioFiles.filter(a => a.source.match(/week-\d+-listening-elite/)).length
  };

  console.log(`\n📊 분류별 통계:`);
  console.log(`   - Placement Test: ${stats.placement}개`);
  console.log(`   - Week 1-8: ${stats.weeks1to8}개`);
  console.log(`   - Week 9-16 Elite: ${stats.weeks9to16}개`);
}

/**
 * 메인 실행
 */
function main() {
  console.log('🚀 TTS Manifest Generator 시작\n');

  try {
    // 1. Placement Test
    extractPlacementTestAudio();

    // 2. Week 1-8
    processWeeks1to8();

    // 3. Week 9-16 Elite
    processWeeks9to16();

    // 4. Manifest 저장
    saveManifest();

    console.log('\n✨ 완료! 다음 단계: npm run generate-audio');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = { main, extractPlacementTestAudio, extractWeekAudio };
