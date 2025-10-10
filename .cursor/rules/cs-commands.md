# Cursor-SuperClaude (CS) Commands

이 파일은 Cursor에서 사용할 수 있는 `/cs:` 명령어 시스템입니다.
SuperClaude 프레임워크의 기능을 Cursor 내장 Claude에서 사용할 수 있도록 통합했습니다.

## 🎯 사용법

채팅에서 `/cs:명령어이름 [옵션]` 형식으로 입력하세요.

예: `/cs:cleanup` 또는 `/cs:analyze --focus security`

---

## 📋 명령어 목록

### 🔧 개발 워크플로우

#### `/cs:brainstorm` - 아이디어 구체화
**목적**: 모호한 아이디어를 구체적인 요구사항으로 전환
**사용법**: `/cs:brainstorm [주제] [--depth shallow|normal|deep]`
**동작**:
1. 소크라테스식 대화로 요구사항 발굴
2. 다양한 관점에서 타당성 분석
3. 구체적인 기술 사양서 생성
**예시**: `/cs:brainstorm "실시간 채팅 기능" --depth deep`

#### `/cs:design` - 시스템 설계
**목적**: 아키텍처 및 컴포넌트 설계
**사용법**: `/cs:design [대상] [--type architecture|api|component|database]`
**동작**:
1. 요구사항 분석 및 기존 시스템 검토
2. 업계 표준 및 모범 사례 적용
3. 다이어그램 및 상세 사양 생성
**예시**: `/cs:design payment-api --type api`

#### `/cs:implement` - 기능 구현
**목적**: 코드 작성 및 기능 개발
**사용법**: `/cs:implement [기능명] [--framework react|vue|express] [--with-tests]`
**동작**:
1. 프레임워크 감지 및 모범 사례 적용
2. 코드 생성 (Frontend/Backend/전체 스택)
3. 보안 검증 및 테스트 통합
**예시**: `/cs:implement "사용자 프로필 컴포넌트" --framework react --with-tests`

#### `/cs:test` - 테스트 실행
**목적**: 테스트 실행 및 커버리지 분석
**사용법**: `/cs:test [대상] [--type unit|integration|e2e] [--coverage]`
**동작**:
1. 테스트 프레임워크 자동 감지
2. 테스트 실행 및 실시간 모니터링
3. 커버리지 리포트 및 실패 분석
**예시**: `/cs:test src/components --type unit --coverage`

#### `/cs:build` - 빌드 실행
**목적**: 프로젝트 빌드 및 패키징
**사용법**: `/cs:build [--type dev|prod] [--clean] [--optimize]`
**동작**:
1. 빌드 설정 분석
2. 빌드 실행 및 오류 처리
3. 최적화 및 배포 준비
**예시**: `/cs:build --type prod --optimize`

---

### 🔍 코드 품질

#### `/cs:analyze` - 코드 분석
**목적**: 코드 품질, 보안, 성능 종합 분석
**사용법**: `/cs:analyze [대상] [--focus quality|security|performance|architecture]`
**동작**:
1. 정적 분석 및 패턴 인식
2. 심각도 기반 문제 분류
3. 실행 가능한 개선 권장사항 제시
**예시**: `/cs:analyze src/auth --focus security`

#### `/cs:improve` - 코드 개선
**목적**: 코드 품질 향상 및 리팩토링
**사용법**: `/cs:improve [대상] [--type quality|performance|maintainability]`
**동작**:
1. 개선 기회 분석
2. 체계적 리팩토링 적용
3. 기능 보존 검증
**예시**: `/cs:improve legacy-modules --type maintainability`

#### `/cs:cleanup` - 코드 정리
**목적**: 레거시 코드 제거 및 프로젝트 정리
**사용법**: `/cs:cleanup [대상] [--type code|imports|files|all] [--safe]`
**동작**:
1. 사용하지 않는 코드/파일 탐지
2. 안전한 제거 (백업 지원)
3. Import 최적화 및 구조 개선
**예시**: `/cs:cleanup src/ --type all --safe`

#### `/cs:troubleshoot` - 문제 해결
**목적**: 버그 진단 및 해결
**사용법**: `/cs:troubleshoot [문제설명] [--type bug|build|performance|deployment]`
**동작**:
1. 체계적 근본 원인 분석
2. 구조화된 디버깅 절차
3. 검증된 해결책 제시 및 적용
**예시**: `/cs:troubleshoot "TypeScript 컴파일 에러" --type build --fix`

---

### 📝 유틸리티

#### `/cs:explain` - 코드 설명
**목적**: 코드 동작 및 로직 설명
**사용법**: `/cs:explain [파일경로 또는 코드블록]`
**동작**: 코드를 분석하여 이해하기 쉽게 한국어로 설명

#### `/cs:document` - 문서화
**목적**: README, API 문서, JSDoc 등 생성
**사용법**: `/cs:document [대상] [--type readme|api|jsdoc]`
**동작**: 코드를 분석하여 포괄적인 문서 자동 생성

#### `/cs:git` - Git 작업
**목적**: 커밋 메시지, PR 설명 등 작성
**사용법**: `/cs:git [작업] [--type commit|pr|branch]`
**동작**: Git 히스토리 분석 및 적절한 메시지 생성

---

## 🎨 특별 기능

### 복합 워크플로우

여러 명령어를 조합하여 완전한 개발 워크플로우를 실행할 수 있습니다:

```
1. /cs:brainstorm "새 기능 아이디어"
2. /cs:design "설계 수립"
3. /cs:implement "코드 작성"
4. /cs:test --coverage
5. /cs:build --type prod
```

### 자동 분석

명령어 실행 시 자동으로:
- 프레임워크 감지 (React, Vue, Next.js 등)
- 프로젝트 구조 분석
- 모범 사례 적용
- 보안 검증

---

## 💡 팁

1. **옵션 생략 가능**: 대부분의 명령어는 옵션 없이도 작동합니다
2. **점진적 작업**: 큰 작업은 단계별로 나누어 실행하세요
3. **안전 모드**: `--safe` 옵션으로 안전한 변경만 적용
4. **미리보기**: `--preview` 옵션으로 변경사항 미리 확인

---

## 🚨 주의사항

- 모든 변경사항은 실행 전에 검토하세요
- 중요한 작업 전에는 Git 커밋을 권장합니다
- `--safe` 모드를 사용하여 안전하게 시작하세요
