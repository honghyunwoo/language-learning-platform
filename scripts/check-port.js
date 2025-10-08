#!/usr/bin/env node

/**
 * 포트 충돌 체크 스크립트
 *
 * 지정된 포트가 사용 중인지 확인하고, 사용 중이면 프로세스를 종료합니다.
 * package.json의 scripts에서 "predev": "node scripts/check-port.js"로 설정하여 사용하세요.
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const TARGET_PORT = 3008;

async function checkPort() {
  try {
    console.log(`\n🔍 포트 ${TARGET_PORT} 사용 여부 확인 중...`);

    if (process.platform === 'win32') {
      // Windows
      const { stdout } = await execPromise(`netstat -ano | findstr :${TARGET_PORT}`);

      if (stdout) {
        console.log(`⚠️  포트 ${TARGET_PORT}가 이미 사용 중입니다.`);

        // PID 추출
        const lines = stdout.trim().split('\n');
        const pids = new Set();

        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            pids.add(pid);
          }
        });

        if (pids.size > 0) {
          console.log(`\n🔧 다음 프로세스를 종료합니다: ${Array.from(pids).join(', ')}`);

          for (const pid of pids) {
            try {
              await execPromise(`taskkill /PID ${pid} /F`);
              console.log(`✅ PID ${pid} 종료 완료`);
            } catch (error) {
              console.log(`⚠️  PID ${pid} 종료 실패 (이미 종료되었을 수 있습니다)`);
            }
          }

          // 포트가 완전히 해제될 때까지 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`\n✅ 포트 ${TARGET_PORT}가 해제되었습니다.`);
        }
      } else {
        console.log(`✅ 포트 ${TARGET_PORT}는 사용 가능합니다.`);
      }
    } else {
      // Linux/Mac
      try {
        const { stdout } = await execPromise(`lsof -ti:${TARGET_PORT}`);

        if (stdout) {
          const pids = stdout.trim().split('\n');
          console.log(`⚠️  포트 ${TARGET_PORT}가 이미 사용 중입니다.`);
          console.log(`\n🔧 다음 프로세스를 종료합니다: ${pids.join(', ')}`);

          for (const pid of pids) {
            try {
              await execPromise(`kill -9 ${pid}`);
              console.log(`✅ PID ${pid} 종료 완료`);
            } catch (error) {
              console.log(`⚠️  PID ${pid} 종료 실패 (이미 종료되었을 수 있습니다)`);
            }
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`\n✅ 포트 ${TARGET_PORT}가 해제되었습니다.`);
        }
      } catch (error) {
        console.log(`✅ 포트 ${TARGET_PORT}는 사용 가능합니다.`);
      }
    }

    console.log('');
  } catch (error) {
    console.error('❌ 포트 확인 중 오류 발생:', error.message);
    process.exit(0); // 오류가 있어도 계속 진행
  }
}

checkPort();
