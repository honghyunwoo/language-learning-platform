# 언어 학습 플랫폼 - 프로젝트 규칙

이 파일은 **언어 학습 플랫폼** 프로젝트 전용 Claude 작업 규칙입니다.
글로벌 `~/.claude/RULES.md` 규칙과 함께 적용됩니다.

## 🎯 프로젝트 목표

**핵심 미션**: 돈이 없는 사람들도 무료로 영어 회화 고수가 될 수 있는 플랫폼 구축

**차별화 포인트**:
- 완전 무료 (광고 없음)
- 회화 중심 (시험 준비 아님)
- AI 대화 시뮬레이션
- 개인 맞춤 학습

## 📁 프로젝트 구조 규칙

### 파일 정리 원칙

**🔴 절대 규칙 (항상 지켜야 함)**:
1. **ENHANCED/temp/test 파일은 즉시 삭제**
   - 작업 완료 즉시 `*-ENHANCED.json`, `*-temp.*`, `*-test.*` 삭제
   - 예외: `app/test-apis` (개발용 유틸리티)

2. **docs/ 폴더 정리**
   - 오래된 기획서는 `docs/archive/`로 이동
   - 최신 문서만 루트에 유지:
     - `ULTIMATE_MASTER_PLAN.md` (최종 마스터플랜)
     - `DETAILED_EXECUTION_PLAN.md` (실행 계획)
     - `COMPREHENSIVE_FEATURE_PLAN.md` (기능 계획)

3. **Background 프로세스 정리**
   - 작업 완료 시 불필요한 background bash 종료
   - dev 서버는 1개만 유지
   - 완료된 build 프로세스는 kill

**🟡 권장 규칙 (가능하면 지켜야 함)**:
1. **데이터 파일 구조**
   ```
   data/
   ├── levelTest/         (레벨 테스트)
   ├── activities/        (학습 활동)
   │   ├── vocabulary/
   │   ├── listening/
   │   ├── speaking/
   │   ├── grammar/
   │   ├── writing/
   │   └── reading/
   └── conversations/     (대화 시뮬레이션)
   ```

2. **컴포넌트 구조**
   ```
   app/
   ├── level-test/        (레벨 테스트 UI)
   ├── dashboard/         (메인 대시보드)
   └── (feature)/         (기능별 폴더)

   components/
   ├── ui/                (공통 UI)
   ├── dashboard/         (대시보드 전용)
   └── activities/        (활동 컴포넌트)
   ```

3. **스크립트 정리**
   ```
   scripts/
   ├── check-port.js             (포트 체크)
   ├── validate-activity-json.js (데이터 검증)
   ├── promptLibrary.ts          (AI 프롬프트)
   └── validateData.ts           (타입 검증)
   ```

### 데이터 생성 규칙

**Quality over Speed**:
- 급하게 많이 만들기보다, 천천히 고품질로
- 각 데이터에는 반드시:
  - ✅ 한글 번역
  - ✅ 실생활 예문
  - ✅ 발음 기호 (IPA)
  - ✅ 상황 설명

**검증 필수**:
```bash
# 데이터 생성 후 항상 실행
npm run validate-data

# 빌드 전 확인
npm run build
```

## 🧹 세션 종료 시 체크리스트

**매 세션 종료 전에 확인**:

```bash
# 1. 임시 파일 확인 및 삭제
find . -name "*ENHANCED*" -o -name "*temp*" | grep -v node_modules

# 2. Background 프로세스 확인
# (시스템 리마인더 확인 후 불필요한 것 kill)

# 3. docs 폴더 정리 상태 확인
ls docs/ | grep -E "(MASTER|PLAN|REPORT)"

# 4. 타입스크립트 에러 확인
npx tsc --noEmit

# 5. Git 상태 확인 (필요시 커밋)
git status
```

## 📝 작업 메모 규칙

### SESSION_NOTES.md 작성

**각 세션 작업 내용을 기록**:

```markdown
# Session YYYY-MM-DD

## 완료한 작업
- [ ] Phase X.Y: 작업 내용
- [ ] 파일 생성/수정: 경로

## 다음 세션 TODO
- [ ] 다음 작업 1
- [ ] 다음 작업 2

## 정리한 내용
- 삭제한 파일: X개
- Archive로 이동: Y개
- Background 프로세스 정리: Z개

## 참고사항
- 특이사항이나 주의할 점
```

### 진행 상황 트래킹

**`docs/PROGRESS.md` 업데이트**:
- Phase 완료 시 체크
- 주요 마일스톤 달성 시 기록
- 문제점 발견 시 이슈 기록

## 🚀 개발 워크플로우

### 새 기능 개발

```bash
# 1. 계획 수립
# - TodoWrite로 task 분해
# - 필요한 데이터/컴포넌트 파악

# 2. 데이터 생성 (필요시)
# - scripts/promptLibrary.ts 활용
# - validateData.ts로 검증

# 3. 컴포넌트 구현
# - 기존 패턴 따르기
# - TypeScript strict mode

# 4. 통합 및 테스트
# - dev 서버에서 확인
# - 타입 에러 체크

# 5. 정리
# - 임시 파일 삭제
# - 문서 업데이트
```

### 버그 수정

```bash
# 1. 문제 재현 및 분석
# 2. 근본 원인 파악 (workaround 금지)
# 3. 수정 및 검증
# 4. 유사 패턴 전체 검색
# 5. 문서 업데이트
```

## 🎨 코드 스타일

### 컴포넌트 작성

```typescript
'use client'; // 클라이언트 컴포넌트

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  // 1. Hooks
  const { currentUser } = useAuth();
  const [state, setState] = useState<Type>(initialValue);

  // 2. Effects & Handlers
  const handleClick = () => { };

  // 3. Early returns
  if (!currentUser) return null;

  // 4. Render
  return <div>...</div>;
}
```

### Hook 작성

```typescript
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { db } from '@/lib/firebase';

export const useMyHook = (param: string) => {
  return useQuery({
    queryKey: ['key', param],
    queryFn: async () => {
      // Firestore 작업
    },
    enabled: !!param && !!db,
    staleTime: 1000 * 60 * 5,
  });
};
```

## 🔥 Firebase 규칙

### Collection 구조

```
users/                  (사용자 정보)
├── {uid}/
    ├── level
    ├── recommendedWeek
    └── lastLevelTest

levelTestResults/       (테스트 결과)
├── {testId}/
    ├── userId
    ├── scores
    └── timestamp

journalEntries/        (학습 일지)
userProgress/          (진행 상황)
```

### 쿼리 최적화

- `staleTime`: 5분 (자주 변경되지 않는 데이터)
- `gcTime`: 30분-1시간
- `enabled`: 조건부 쿼리 활성화
- 복합 인덱스 필요 시 Firebase Console에서 생성

## 📊 성능 규칙

### 번들 크기 최적화

- Chart.js → Dynamic import
- 이미지 → next/image
- 큰 컴포넌트 → Lazy load

### 렌더링 최적화

- useMemo로 expensive 계산 메모이제이션
- useCallback으로 함수 메모이제이션
- React.memo로 컴포넌트 메모이제이션

## 🎯 Phase별 우선순위

### ✅ 완료
- **Phase 1**: Level Test System (UI + Logic + Firestore)

### 🔄 진행 중
- **Phase 3**: Conversation Simulation (핵심 차별화)

### ⏳ 대기
- **Phase 2**: Week 1-8 Content (이미 완료됨, 검토 필요)
- **Phase 4**: Gamification
- **Phase 5**: TTS Enhancement
- **Phase 6-12**: Community, Analytics, PWA, Mobile

## 📌 중요 링크

- [ULTIMATE_MASTER_PLAN.md](../docs/ULTIMATE_MASTER_PLAN.md) - 최종 마스터플랜
- [DETAILED_EXECUTION_PLAN.md](../docs/DETAILED_EXECUTION_PLAN.md) - 상세 실행 계획
- [Firebase Console](https://console.firebase.google.com/)

---

**마지막 업데이트**: 2025-10-09
**작성자**: Claude & User
**다음 검토 예정**: Phase 3 완료 후
