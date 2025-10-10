# 🐛 Issues Log & Tracking System

이 문서는 프로젝트에서 발생한 모든 문제와 해결 방법을 추적합니다.

## 📋 현재 활성 이슈 (Active Issues)

### 🔴 Critical (즉시 수정 필요)

_현재 Critical 이슈 없음_

### 🟡 High Priority (조속히 해결 필요)

_현재 High Priority 이슈 없음_

### ✅ 최근 해결된 이슈

#### ISSUE-001: Build 실패 - TypeScript 타입 에러 (Multiple Files)
**발생일**: 2025-10-09
**해결일**: 2025-10-09
**상태**: ✅ RESOLVED
**우선순위**: P0 (Critical)
**영향범위**: Build process 전체 실패

**에러 목록**:
1. **hooks/useCommunity.ts:238:30**
   ```
   Type error: Cannot find name 'addDoc'.
   ```
   - 문제: Firebase Firestore `addDoc` import 누락
   - 위치: hooks/useCommunity.ts:238

2. **hooks/useCommunity.ts:352:16**
   ```
   Type error: 'result' is of type 'unknown'.
   ```
   - 문제: mutation result 타입 정의 누락
   - 위치: hooks/useCommunity.ts:352

3. **hooks/useCommunity.ts:470:44**
   ```
   Type error: Object literal may only specify known properties, and 'postId' does not exist in type '{ parentId: string; userId: string; }'.
   ```
   - 문제: toggleLike 함수 파라미터 타입 불일치
   - 위치: hooks/useCommunity.ts:470

4. **hooks/useFirestore.ts:29:13**
   ```
   Type error: 'db' is referenced directly or indirectly in its own type annotation.
   ```
   - 문제: 순환 참조 타입 정의
   - 위치: hooks/useFirestore.ts:29

5. **hooks/useFirestore.ts:116:28**
   ```
   Type error: Cannot find name 'Post'.
   ```
   - 문제: Post 타입 import 누락
   - 위치: hooks/useFirestore.ts:116

6. **app/dashboard/community/write/page.tsx:165:91**
   ```
   Error: Unexpected any. Specify a different type.
   ```
   - 문제: explicit `any` 사용 금지 (ESLint 규칙)
   - 위치: app/dashboard/community/write/page.tsx:165

**해결 계획**:
1. Firebase import 추가
2. 타입 정의 수정
3. 타입 import 추가
4. any 타입 제거

**관련 파일**:
- hooks/useCommunity.ts
- hooks/useFirestore.ts
- app/dashboard/community/write/page.tsx

---

#### ISSUE-002: Firebase Emulator 실패 - Java 없음
**발생일**: 2025-10-09
**상태**: 🔴 ACTIVE
**우선순위**: P1 (High)
**영향범위**: Firebase Emulator 실행 불가

**에러 메시지**:
```
Error: Could not spawn `java -version`. Please make sure Java is installed and on your system PATH.
Error: spawn java ENOENT
```

**원인**:
- Java가 시스템에 설치되지 않았거나 PATH에 등록되지 않음

**해결 방법**:
1. Java JDK 설치
2. 시스템 PATH에 Java 경로 추가
3. 또는 Firebase Emulator 없이 작업 (실제 Firestore 사용)

**관련 프로세스**:
- bash daa3d7 (firebase emulators:start)

---

### 🟡 Warnings (경고, 수정 권장)

#### ISSUE-003: ESLint 경고 (Multiple Files)
**발생일**: 2025-10-09
**상태**: 🟡 ACTIVE
**우선순위**: P2 (Medium)
**영향범위**: Build 성공하지만 경고 발생

**경고 목록**:
1. **app/dashboard/community/page.tsx:260:27**
   ```
   Warning: Using `<img>` could result in slower LCP and higher bandwidth.
   Consider using `<Image />` from `next/image`
   ```
   - 해결: `<img>` → `next/image`의 `<Image />` 사용

2. **app/dashboard/resources/page.tsx:81:9**
   ```
   Warning: 'router' is assigned a value but never used.
   ```
   - 해결: 사용되지 않는 router 변수 제거

3. **components/ui/Toast.tsx:3:60**
   ```
   Warning: 'useEffect' is defined but never used.
   ```
   - 해결: 사용되지 않는 useEffect import 제거

4. **lib/firebase.ts:3:19**
   ```
   Warning: 'Auth' is defined but never used.
   ```
   - 해결: 사용되지 않는 Auth 타입 제거

5. **lib/firebase.ts:4:24**
   ```
   Warning: 'Firestore' is defined but never used.
   ```
   - 해결: 사용되지 않는 Firestore 타입 제거

---

### 🟢 Low Priority (낮은 우선순위)

#### ISSUE-004: Background 프로세스 과다 실행
**발생일**: 2025-10-09
**상태**: 🟢 ACTIVE
**우선순위**: P3 (Low)
**영향범위**: 시스템 리소스 낭비

**문제**:
- 9개의 background 프로세스 동시 실행 중
- 5개의 build 프로세스 모두 실패 상태이지만 계속 실행 중
- 2개의 dev 서버 실행 중 (1개만 필요)

**프로세스 목록**:
```
✅ 44ed24: npm run build (completed) - 성공
❌ 12502f: npm run dev (killed) - 종료됨
❌ daa3d7: firebase emulators (failed) - Java 없음
❌ 28c70b: npm run build (failed) - Type error
❌ 5a22f0: npm run build (failed) - Type error
❌ b788fd: npm run build (failed) - Type error
❌ 3c82db: npm run build (failed) - Type error
❌ 0f9a56: npm run build (failed) - Type error
✅ 31857e: npm run dev (completed) - 성공 (사용 중)
```

**해결 계획**:
1. 실패한 build 프로세스 모두 종료
2. dev 서버는 31857e만 유지
3. Firebase emulator는 Java 설치 전까지 종료

---

#### ISSUE-005: Next.js Static Build 에러 (Windows 경로)
**발생일**: 2025-10-09
**상태**: 🟢 KNOWN_ISSUE
**우선순위**: P3 (Low)
**영향범위**: Dev 서버 시작 시 경고 (기능 영향 없음)

**에러 메시지**:
```
[Error: EINVAL: invalid argument, readlink 'C:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform\.next\static\IzLYkCrneCzbZvvhidOpG']
  errno: -4071,
  code: 'EINVAL',
  syscall: 'readlink'
```

**원인**:
- Windows와 Next.js static file symlink 호환성 문제
- .next 폴더 캐시 이슈

**해결 방법**:
1. `.next` 폴더 삭제 후 재빌드
2. 또는 무시 (기능에 영향 없음)

---

## 📊 이슈 통계

### 우선순위별
- 🔴 P0 (Critical): 2개
- 🟡 P1-P2 (High-Medium): 1개
- 🟢 P3 (Low): 2개

### 상태별
- 🔴 Active: 3개
- 🟢 Known Issue: 2개
- ✅ Resolved: 0개

### 카테고리별
- TypeScript/Type Error: 6개
- Build/Compilation: 6개
- Runtime Warning: 5개
- Environment Setup: 1개 (Java)
- Process Management: 1개

---

## 🔧 해결된 이슈 (Resolved Issues)

### ✅ ISSUE-R001: Python 이모지 인코딩 에러
**발생일**: 2025-10-09
**해결일**: 2025-10-09
**우선순위**: P2 (Medium)

**문제**:
```
UnicodeEncodeError: 'cp949' codec can't encode character '\u2705' in position 0
```

**해결 방법**:
```python
import sys
sys.stdout.reconfigure(encoding='utf-8')
```

**영향**: JSON 검증 스크립트 정상 작동

---

## 🎯 수정 우선순위 가이드

### P0 (Critical) - 즉시 수정
- 빌드 실패로 인한 개발 차단
- 프로덕션 배포 불가능
- 핵심 기능 작동 불가

### P1 (High) - 24시간 내 수정
- 개발 환경 문제
- 중요 기능 오작동
- 성능 저하

### P2 (Medium) - 주간 수정
- 경고 메시지
- 코드 품질 이슈
- 최적화 필요

### P3 (Low) - 월간 수정 또는 무시
- 사소한 경고
- 기능에 영향 없는 에러
- 개선 제안

---

## 🔄 자동화 시스템

### 1. 빌드 전 체크리스트
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# ESLint 체크
npx eslint . --ext .ts,.tsx

# JSON 검증
npm run validate:json
```

### 2. 세션 종료 전 체크리스트
```bash
# Background 프로세스 확인
# /bashes 명령으로 확인

# 실패한 프로세스 종료
# kill 명령 사용

# Git 상태 확인
git status

# 임시 파일 정리
find . -name "*ENHANCED*" -o -name "*temp*" | grep -v node_modules
```

### 3. 이슈 추적 자동화
- 빌드 실패 시 자동으로 이 파일에 기록
- 해결 시 Resolved 섹션으로 이동
- 우선순위 자동 분류

---

## 📝 이슈 템플릿

### 새 이슈 추가 시 사용:

```markdown
#### ISSUE-XXX: [간단한 제목]
**발생일**: YYYY-MM-DD
**상태**: 🔴/🟡/🟢 ACTIVE/RESOLVED
**우선순위**: P0/P1/P2/P3
**영향범위**: [영향 범위 설명]

**에러 메시지**:
```
[에러 메시지]
```

**원인**:
- [원인 설명]

**해결 방법**:
1. [해결 단계]

**관련 파일**:
- [파일 목록]
```

---

**마지막 업데이트**: 2025-10-09
**다음 리뷰**: TypeScript 에러 수정 후
