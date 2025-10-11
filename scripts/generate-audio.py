#!/usr/bin/env python3
"""
TTS Audio Generator

TTS Manifest를 읽어서 Google Text-to-Speech (gTTS)로 MP3 파일 생성

필수 패키지 설치:
    pip install gtts

실행:
    python scripts/generate-audio.py
"""

import json
import os
import sys
from pathlib import Path
from gtts import gTTS
import time

# 경로 설정
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
MANIFEST_PATH = SCRIPT_DIR / 'tts-manifest.json'
OUTPUT_DIR = PROJECT_ROOT / 'public' / 'audio'

# 통계
stats = {
    'total': 0,
    'success': 0,
    'failed': 0,
    'skipped': 0
}

def load_manifest():
    """Manifest 파일 로드"""
    print('[INFO] TTS Manifest loading...')

    if not MANIFEST_PATH.exists():
        print(f'[ERROR] Manifest file not found: {MANIFEST_PATH}')
        print('        Run `node scripts/generate-tts-manifest.js` first.')
        sys.exit(1)

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f'[OK] Found {data["totalAudioFiles"]} audio files')
    return data

def ensure_output_dir():
    """출력 디렉토리 생성"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f'[INFO] Output directory: {OUTPUT_DIR}')

def generate_audio_file(audio_item):
    """개별 오디오 파일 생성"""
    audio_id = audio_item['id']
    script = audio_item['script']
    audio_path = audio_item['audioPath']
    speed = audio_item.get('speed', 1.0)

    # 출력 파일 경로 (audio_path에서 파일명 추출)
    filename = os.path.basename(audio_path)
    output_path = OUTPUT_DIR / filename

    # 이미 존재하면 스킵
    if output_path.exists():
        print(f'[SKIP] [{audio_id}] Already exists: {filename}')
        stats['skipped'] += 1
        return True

    try:
        print(f'[GEN] [{audio_id}] Generating: {filename}')
        print(f'      Script: {script[:60]}{"..." if len(script) > 60 else ""}')

        # gTTS 생성
        tts = gTTS(
            text=script,
            lang='en',
            slow=(speed < 1.0)
        )

        # MP3 저장
        tts.save(str(output_path))

        print(f'[OK] [{audio_id}] Done: {output_path.name}')
        stats['success'] += 1
        return True

    except Exception as e:
        print(f'[ERROR] [{audio_id}] Failed: {str(e)}')
        stats['failed'] += 1
        return False

def generate_all_audio(manifest):
    """모든 오디오 파일 생성"""
    audio_files = manifest['audioFiles']
    stats['total'] = len(audio_files)

    print(f'\n[START] Generating {stats["total"]} audio files...\n')

    for idx, audio_item in enumerate(audio_files, 1):
        print(f'\n[{idx}/{stats["total"]}] ', end='')
        generate_audio_file(audio_item)

        # API 속도 제한 방지 (gTTS는 무료이므로 약간의 딜레이)
        if idx < stats['total']:
            time.sleep(0.5)

    print('\n' + '='*60)
    print('[DONE] Audio generation complete!')
    print(f'\n[STATS]:')
    print(f'   Total files: {stats["total"]}')
    print(f'   Success: {stats["success"]}')
    print(f'   Skipped: {stats["skipped"]}')
    print(f'   Failed: {stats["failed"]}')

    if stats['failed'] > 0:
        print(f'\n[WARN] {stats["failed"]} files failed')
        return False

    return True

def verify_audio_files(manifest):
    """생성된 오디오 파일 검증"""
    print('\n[VERIFY] Checking audio files...')

    missing = []
    for audio_item in manifest['audioFiles']:
        audio_path = audio_item['audioPath']
        filename = os.path.basename(audio_path)
        output_path = OUTPUT_DIR / filename

        if not output_path.exists():
            missing.append(filename)

    if missing:
        print(f'[WARN] {len(missing)} files missing:')
        for f in missing:
            print(f'   - {f}')
        return False

    print(f'[OK] All {len(manifest["audioFiles"])} files verified!')
    return True

def main():
    """메인 실행"""
    print('TTS Audio Generator\n')

    try:
        # 1. Manifest 로드
        manifest = load_manifest()

        # 2. 출력 디렉토리 생성
        ensure_output_dir()

        # 3. 오디오 파일 생성
        success = generate_all_audio(manifest)

        if not success:
            print('\n[WARN] Some files failed. Please retry.')
            sys.exit(1)

        # 4. 검증
        if verify_audio_files(manifest):
            print('\n[SUCCESS] All audio files generated and verified!')
            print(f'[INFO] Location: {OUTPUT_DIR}')
            print('\nNext step: Run `npm run dev` and test audio playback')
        else:
            print('\n[WARN] Some files missing. Please retry.')
            sys.exit(1)

    except KeyboardInterrupt:
        print('\n\n[WARN] User interrupted')
        sys.exit(1)
    except Exception as e:
        print(f'\n[ERROR] {str(e)}')
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
