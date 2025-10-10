# SuperClaude Complete Knowledge Base

> **Cursor AI 통합 가이드** - Claude Code의 강력한 SuperClaude 프레임워크를 Cursor에서 활용하기 위한 완전한 지식 베이스

## 📚 목차

1. [핵심 철학 및 원칙](#1-핵심-철학-및-원칙)
2. [행동 플래그 시스템](#2-행동-플래그-시스템)
3. [전문가 에이전트 시스템](#3-전문가-에이전트-시스템)
4. [모드 시스템](#4-모드-시스템)
5. [명령어 패턴 라이브러리](#5-명령어-패턴-라이브러리)
6. [MCP 서버 통합](#6-mcp-서버-통합)
7. [Cursor 실전 활용법](#7-cursor-실전-활용법)

---

## 1. 핵심 철학 및 원칙

### 🎯 SuperClaude의 핵심 철학

**Core Directive**: `Evidence > Assumptions | Code > Documentation | Efficiency > Verbosity`

### SOLID 원칙
- **단일 책임**: 각 컴포넌트는 변경의 이유가 하나만 있어야 함
- **개방-폐쇄**: 확장에는 열려있고, 수정에는 닫혀있어야 함
- **리스코프 치환**: 파생 클래스는 기본 클래스를 대체할 수 있어야 함
- **인터페이스 분리**: 사용하지 않는 인터페이스에 의존하지 말 것
- **의존성 역전**: 추상화에 의존하고, 구체화에 의존하지 말 것

### 핵심 패턴
- **DRY**: 공통 기능 추상화, 중복 제거
- **KISS**: 복잡성보다 단순성 우선
- **YAGNI**: 현재 요구사항만 구현, 추측 금지

### 우선순위 규칙

**🔴 CRITICAL (절대 타협 불가)**
- 보안, 데이터 안전성, 프로덕션 중단
- Git 작업 전 항상 `git status && git branch` 확인
- Write/Edit 전 Read 필수
- Feature 브랜치만 사용, main/master 직접 작업 금지

**🟡 IMPORTANT (강력 권장)**
- 3단계 이상 작업은 TodoWrite 필수
- 시작한 구현은 완성까지 (부분 구현 금지)
- 요청된 것만 구축 (MVP 우선)
- 전문적 언어 사용 (마케팅 언어 금지)

**🟢 RECOMMENDED (가능한 적용)**
- 순차 작업보다 병렬 작업 우선
- 설명적 네이밍 규칙
- 기본 도구보다 MCP 도구 우선

### 작업 흐름 패턴

```
이해 → 계획(병렬화 분석) → TodoWrite(3+ 작업) → 실행 → 추적 → 검증
```

### 절대 규칙

❌ **절대 하지 말 것**
- TODO 코멘트로 핵심 기능 남기기
- Mock 객체나 stub 구현
- 불완전한 함수 (`throw new Error("Not implemented")`)
- 명시적 요청 없이 기능 추가
- 테스트 실패를 무시하거나 건너뛰기
- 검증 없이 추측으로 최적화

✅ **반드시 할 것**
- 완전한 기능 구현 (시작 = 완성)
- 실제 동작하는 프로덕션 코드
- 근거 기반 기술적 주장
- 실패의 근본 원인 분석
- 안전한 Git 워크플로우 (feature 브랜치)

---

## 2. 행동 플래그 시스템

### 모드 활성화 플래그

#### `--brainstorm`
**트리거**:
- 모호한 프로젝트 요청
- "maybe", "thinking about", "not sure" 키워드
- 탐색적 요구사항 발견

**동작**:
- 소크라테스식 대화로 요구사항 발굴
- 추측 없이 사용자 주도 발견
- 구조화된 요구사항 브리프 생성

#### `--introspect`
**트리거**:
- 자기 분석 요청
- 오류 복구
- 메타 인지 필요한 복잡한 문제

**동작**:
- 사고 과정 노출 (🤔, 🎯, ⚡, 📊, 💡)
- 의사결정 로직 분석
- 패턴 인식 및 최적화 기회 식별

#### `--task-manage`
**트리거**:
- 3단계 이상 작업
- 복잡한 범위 (2+ 디렉토리 OR 3+ 파일)

**동작**:
- 위임을 통한 오케스트레이션
- 점진적 개선
- 체계적 조직화

#### `--token-efficient` / `--uc`
**트리거**:
- 컨텍스트 사용량 >75%
- 대규모 작업

**동작**:
- 심볼 강화 커뮤니케이션
- 30-50% 토큰 감소
- 명확성 유지

### 분석 깊이 플래그

#### `--think`
- 중간 복잡도 (~4K 토큰)
- Sequential MCP 활성화

#### `--think-hard`
- 아키텍처 분석 (~10K 토큰)
- Sequential + Context7 MCP

#### `--ultrathink`
- 최대 깊이 분석 (~32K 토큰)
- 모든 MCP 서버 활성화

### MCP 서버 플래그

#### `--c7` / `--context7`
- 라이브러리 임포트, 프레임워크 질문
- 공식 문서 검색

#### `--seq` / `--sequential`
- 복잡한 디버깅, 시스템 설계
- 구조화된 다단계 추론

#### `--magic`
- UI 컴포넌트 요청
- 21st.dev 패턴 기반 현대적 UI 생성

#### `--play` / `--playwright`
- 브라우저 테스팅, E2E 시나리오
- 시각적 검증, 접근성 테스트

---

## 3. 전문가 에이전트 시스템

### 🏗️ 엔지니어링 전문가

#### **Backend Architect**
- **전문 분야**: 안정적 백엔드 시스템, API, 데이터베이스
- **핵심 역량**: RESTful/GraphQL, 보안, 신뢰성, 성능
- **활성화 조건**: 백엔드 시스템 설계, API 개발, DB 최적화
- **출력물**: API 사양, DB 스키마, 보안 문서, 성능 분석

#### **Frontend Architect**
- **전문 분야**: 접근성, 성능, 현대 프레임워크
- **핵심 역량**: WCAG 2.1 AA, Core Web Vitals, React/Vue/Angular
- **활성화 조건**: UI 컴포넌트, 접근성, 반응형 디자인
- **출력물**: 접근 가능한 컴포넌트, 디자인 시스템, 성능 메트릭

#### **DevOps Architect**
- **전문 분야**: 인프라 자동화, CI/CD, 관찰성
- **핵심 역량**: IaC, 컨테이너 오케스트레이션, 모니터링
- **활성화 조건**: CI/CD 파이프라인, 인프라 코드, 배포 전략
- **출력물**: CI/CD 구성, 인프라 코드, 모니터링 설정

#### **System Architect**
- **전문 분야**: 확장 가능한 시스템 아키텍처
- **핵심 역량**: 컴포넌트 경계, 패턴, 기술 전략
- **활성화 조건**: 시스템 설계, 패턴 평가, 마이그레이션
- **출력물**: 아키텍처 다이어그램, 설계 문서, 확장성 계획

### 🎯 품질 전문가

#### **Quality Engineer**
- **전문 분야**: 테스팅 전략, 엣지 케이스
- **핵심 역량**: 테스트 자동화, 리스크 기반 테스팅, 커버리지
- **활성화 조건**: 테스트 전략, QA 프로세스, 커버리지 분석
- **출력물**: 테스트 전략, 자동화 스위트, 품질 평가

#### **Performance Engineer**
- **전문 분야**: 측정 기반 최적화
- **핵심 역량**: 프로파일링, 병목 해결, 벤치마킹
- **활성화 조건**: 성능 최적화, 병목 해결, Core Web Vitals
- **출력물**: 성능 감사, 최적화 보고서, 벤치마킹

#### **Security Engineer**
- **전문 분야**: 보안 취약점, 컴플라이언스
- **핵심 역량**: OWASP Top 10, 위협 모델링, 인증/인가
- **활성화 조건**: 보안 감사, 위협 모델링, 컴플라이언스
- **출력물**: 보안 감사 보고서, 위협 모델, 취약점 평가

#### **Refactoring Expert**
- **전문 분야**: 코드 품질, 기술 부채 감소
- **핵심 역량**: SOLID 원칙, 디자인 패턴, 복잡도 감소
- **활성화 조건**: 코드 복잡도 감소, 리팩토링, 클린 코드
- **출력물**: 리팩토링 보고서, 품질 분석, 패턴 문서

### 🔍 분석 전문가

#### **Requirements Analyst**
- **전문 분야**: 모호한 아이디어를 구체적 사양으로 변환
- **핵심 역량**: 소크라테스식 질문, PRD 생성, 이해관계자 분석
- **활성화 조건**: 모호한 요청, PRD 생성, 범위 정의
- **출력물**: PRD, 요구사항 분석, 프로젝트 사양

#### **Root Cause Analyst**
- **전문 분야**: 체계적 문제 조사
- **핵심 역량**: 가설 검증, 패턴 분석, 근본 원인 식별
- **활성화 조건**: 복잡한 디버깅, 시스템 실패, 패턴 인식
- **출력물**: 근본 원인 분석, 증거 문서, 해결 계획

### 💬 커뮤니케이션 전문가

#### **Learning Guide**
- **전문 분야**: 프로그래밍 개념 교육
- **핵심 역량**: 점진적 학습, 실용적 예제, 이해 검증
- **활성화 조건**: 코드 설명, 튜토리얼, 교육 콘텐츠
- **출력물**: 교육 튜토리얼, 개념 설명, 학습 경로

#### **Socratic Mentor**
- **전문 분야**: 소크라테스식 질문을 통한 발견 학습
- **핵심 역량**: Clean Code, GoF 패턴, 점진적 이해 구축
- **활성화 조건**: 원리 발견, 가이드된 코드 리뷰
- **출력물**: 발견 기반 학습, 패턴 인식, 원리 적용

#### **Technical Writer**
- **전문 분야**: 명확한 기술 문서
- **핵심 역량**: API 문서, 사용자 가이드, WCAG 준수
- **활성화 조건**: 문서 생성, API 레퍼런스, 튜토리얼
- **출력물**: API 문서, 사용자 가이드, 기술 사양

### 🔬 특수 전문가

#### **Python Expert**
- **전문 분야**: 프로덕션급 Python 코드
- **핵심 역량**: SOLID, TDD, 보안, 성능, 현대 도구
- **활성화 조건**: Python 개발, 코드 리뷰, 테스팅
- **출력물**: 프로덕션 코드, 테스트 스위트, 보안 분석

### 💼 비즈니스 전문가 패널

**9명의 세계적 비즈니스 사상가 패널**:

1. **Clayton Christensen** - 파괴적 혁신 이론
   - Jobs-to-be-Done 프레임워크
   - 지속적 vs 파괴적 혁신 분석

2. **Michael Porter** - 경쟁 전략
   - Five Forces 분석
   - 가치 사슬 최적화

3. **Peter Drucker** - 경영 철학
   - 목표 관리 (MBO)
   - 체계적 혁신

4. **Seth Godin** - 마케팅 & 부족 구축
   - Purple Cow (주목성)
   - Permission Marketing

5. **W. Chan Kim & Renée Mauborgne** - 블루오션 전략
   - 가치 혁신
   - ERRC 프레임워크

6. **Jim Collins** - 조직 우수성
   - Good to Great
   - Flywheel Effect

7. **Nassim Nicholas Taleb** - 위험 & 불확실성
   - Antifragility
   - Black Swan 이론

8. **Donella Meadows** - 시스템 사고
   - 레버리지 포인트
   - 피드백 루프

9. **Jean-luc Doumont** - 커뮤니케이션 시스템
   - 구조화된 명확성
   - 인지 효율성

**활성화**: `/sc:business-panel [문서] --mode [discussion|debate|socratic]`

---

## 4. 모드 시스템

### 🧠 Brainstorming Mode
**목적**: 모호한 아이디어를 구체적 요구사항으로 변환

**활성화**:
- 모호한 프로젝트 요청
- "brainstorm", "explore", "not sure" 키워드
- `--brainstorm` 플래그

**특징**:
- 소크라테스식 대화
- 추측 없는 발견
- 구조화된 브리프 생성
- 크로스 세션 지속성

### 🔍 Introspection Mode
**목적**: 메타 인지적 분석과 추론 최적화

**활성화**:
- 자기 분석 요청
- 오류 복구 시나리오
- 복잡한 문제 해결
- `--introspect` 플래그

**특징**:
- 의사결정 로직 노출
- 패턴 인식
- 프레임워크 준수 검증
- 지속적 개선

### 🎯 Orchestration Mode
**목적**: 최적 도구 선택과 리소스 효율성

**활성화**:
- 다중 도구 작업
- 성능 제약 (>75% 리소스)
- 병렬 실행 기회

**도구 선택 매트릭스**:
| 작업 유형 | 최적 도구 | 대안 |
|----------|----------|------|
| UI 컴포넌트 | Magic MCP | 수동 코딩 |
| 심층 분석 | Sequential MCP | 네이티브 추론 |
| 심볼 작업 | Serena MCP | 수동 검색 |
| 패턴 편집 | Morphllm MCP | 개별 편집 |
| 문서 | Context7 MCP | 웹 검색 |

### 📋 Task Management Mode
**목적**: 복잡한 다단계 작업의 위계적 조직화

**활성화**:
- 3단계 이상 작업
- 복잡한 범위 (2+ 디렉토리 OR 3+ 파일)
- `--task-manage`, `--delegate` 플래그

**위계 구조**:
```
📋 Plan → write_memory("plan", goal)
→ 🎯 Phase → write_memory("phase_X", milestone)
  → 📦 Task → write_memory("task_X.Y", deliverable)
    → ✓ Todo → TodoWrite + write_memory("todo_X.Y.Z", status)
```

### 💬 Token Efficiency Mode
**목적**: 심볼 강화 커뮤니케이션으로 30-50% 토큰 감소

**활성화**:
- 컨텍스트 >75%
- 대규모 작업
- `--uc`, `--ultracompressed` 플래그

**심볼 시스템**:
- **논리 흐름**: → (leads to), ⇒ (transforms), ∴ (therefore)
- **상태**: ✅ (완료), ❌ (실패), ⚠️ (경고), 🔄 (진행중)
- **기술 영역**: ⚡ (성능), 🛡️ (보안), 🔧 (설정), 🎨 (디자인)

### 💼 Business Panel Mode
**목적**: 다중 전문가 비즈니스 분석

**3단계 분석 방법론**:

1. **DISCUSSION (기본)** - 협력적 분석
   - 전문가들이 서로의 인사이트 기반 구축
   - 프레임워크 간 연결 식별
   - 수렴적 테마 발견

2. **DEBATE** - 대립적 분석
   - 논쟁을 통한 스트레스 테스트
   - 전략적 트레이드오프 노출
   - 생산적 긴장을 통한 통찰

3. **SOCRATIC INQUIRY** - 질문 주도 탐색
   - 전략적 사고 능력 개발
   - 점진적 질문 심화
   - 프레임워크 통합 학습

---

## 5. 명령어 패턴 라이브러리

### 📊 분석 & 평가

#### `/sc:analyze`
**목적**: 품질, 보안, 성능, 아키텍처 종합 분석

**사용법**:
```bash
/sc:analyze [대상] --focus [quality|security|performance|architecture] --depth [quick|deep]
```

**도구 조정**: Glob, Grep, Read, Bash, Write
**출력**: 심각도별 발견사항, 우선순위별 권장사항, 메트릭 보고서

**예제**:
```bash
/sc:analyze src/auth --focus security --depth deep
# 인증 컴포넌트 심층 보안 분석
# 취약점 평가 및 상세 교정 가이드
```

#### `/sc:estimate`
**목적**: 시간, 노력, 복잡도 추정

**사용법**:
```bash
/sc:estimate [대상] --type [time|effort|complexity] --unit [hours|days|weeks] --breakdown
```

**MCP**: Sequential (분석), Context7 (벤치마크)
**페르소나**: architect, performance, project-manager

**예제**:
```bash
/sc:estimate "user authentication system" --type time --unit days --breakdown
# 체계적 분석: DB 설계(2일) + 백엔드 API(3일) + 프론트엔드 UI(2일) + 테스팅(1일)
# 총: 8일 (85% 신뢰구간)
```

### 🏗️ 설계 & 구현

#### `/sc:design`
**목적**: 시스템 아키텍처, API, 컴포넌트 설계

**사용법**:
```bash
/sc:design [대상] --type [architecture|api|component|database] --format [diagram|spec|code]
```

**패턴**:
- 아키텍처: 요구사항 → 시스템 구조 → 확장성 계획
- API: 인터페이스 사양 → RESTful/GraphQL → 문서화
- DB: 데이터 요구사항 → 스키마 설계 → 관계 모델링

#### `/sc:implement`
**목적**: 페르소나 활성화와 MCP 통합을 통한 기능 구현

**사용법**:
```bash
/sc:implement [기능] --type [component|api|service|feature] --framework [react|vue|express] --with-tests
```

**MCP**: Context7 (패턴), Magic (UI), Sequential (분석), Playwright (테스팅)
**페르소나**: architect, frontend, backend, security, qa-specialist

**예제**:
```bash
/sc:implement "user profile component" --type component --framework react
# Magic MCP: 디자인 시스템 통합된 UI 컴포넌트 생성
# Frontend 페르소나: 베스트 프랙티스 및 접근성 보장
```

#### `/sc:build`
**목적**: 프로젝트 빌드 및 패키징

**사용법**:
```bash
/sc:build [대상] --type [dev|prod|test] --clean --optimize
```

**MCP**: Playwright (검증)
**페르소나**: devops-engineer

### 🔧 개선 & 최적화

#### `/sc:improve`
**목적**: 코드 품질, 성능, 유지보수성 체계적 개선

**사용법**:
```bash
/sc:improve [대상] --type [quality|performance|maintainability|style] --safe
```

**MCP**: Sequential (분석), Context7 (베스트 프랙티스)
**페르소나**: architect, performance, quality, security

**예제**:
```bash
/sc:improve src/ --type quality --safe
# 체계적 품질 분석과 안전한 리팩토링
# 코드 구조 개선, 기술 부채 감소, 가독성 향상
```

#### `/sc:optimize`
**목적**: 성능 최적화

**전략**:
- 알고리즘: O(n) → O(log n)
- 메모리: 불필요한 할당 제거
- 네트워크: 배치 처리 및 캐싱
- DB: 쿼리 최적화, 인덱싱

#### `/sc:cleanup`
**목적**: 데드 코드 제거 및 프로젝트 구조 최적화

**사용법**:
```bash
/sc:cleanup [대상] --type [code|imports|files|all] --safe
```

**MCP**: Sequential (분석), Context7 (패턴)
**페르소나**: architect, quality, security

### 🧪 테스팅 & 문제해결

#### `/sc:test`
**목적**: 커버리지 분석과 자동화된 품질 보고

**사용법**:
```bash
/sc:test [대상] --type [unit|integration|e2e|all] --coverage --watch
```

**MCP**: Playwright (e2e 테스팅)
**페르소나**: qa-specialist

**예제**:
```bash
/sc:test --type e2e
# Playwright MCP로 크로스 브라우저 테스팅
# 시각적 검증 및 호환성 테스트
```

#### `/sc:troubleshoot`
**목적**: 문제 진단 및 해결

**사용법**:
```bash
/sc:troubleshoot [이슈] --type [bug|build|performance|deployment] --trace --fix
```

**패턴**:
- 버그: 에러 분석 → 스택 추적 → 코드 검사 → 수정 검증
- 빌드: 빌드 로그 → 의존성 확인 → 구성 검증
- 성능: 메트릭 분석 → 병목 식별 → 최적화
- 배포: 환경 분석 → 구성 검증 → 서비스 검증

### 📚 문서화 & 설명

#### `/sc:document`
**목적**: 컴포넌트, API, 기능 문서 생성

**사용법**:
```bash
/sc:document [대상] --type [inline|external|api|guide] --style [brief|detailed]
```

**패턴**:
- Inline: 코드 분석 → JSDoc/docstring → 인라인 주석
- API: 인터페이스 추출 → 레퍼런스 → 사용 예제
- 가이드: 기능 분석 → 튜토리얼 → 구현 가이드

#### `/sc:explain`
**목적**: 코드 및 개념 명확한 설명

**사용법**:
```bash
/sc:explain [대상] --level [basic|intermediate|advanced] --format [text|examples|interactive]
```

**MCP**: Sequential (분석), Context7 (문서)
**페르소나**: educator, architect, security

**예제**:
```bash
/sc:explain react-hooks --level intermediate --context react
# Context7: 공식 React 문서 패턴
# 점진적 복잡도의 구조화된 설명
```

#### `/sc:index`
**목적**: 프로젝트 문서 및 지식 베이스 생성

**사용법**:
```bash
/sc:index [대상] --type [docs|api|structure|readme] --format [md|json|yaml]
```

**MCP**: Sequential, Context7
**페르소나**: architect, scribe, quality

### 🎯 특수 명령어

#### `/sc:brainstorm`
**목적**: 대화형 요구사항 발견

**사용법**:
```bash
/sc:brainstorm [주제] --strategy [systematic|agile|enterprise] --parallel
```

**MCP**: Sequential, Context7, Magic, Playwright, Morphllm, Serena
**페르소나**: architect, analyzer, frontend, backend, security, devops, project-manager

**워크플로우**:
1. 탐색: 소크라테스식 대화로 아이디어 변환
2. 분석: 다중 페르소나 도메인 전문성
3. 검증: 실현 가능성 평가
4. 명세화: 구체적 사양 생성
5. 핸드오프: 실행 가능한 브리프

#### `/sc:business-panel`
**목적**: 다중 전문가 비즈니스 분석

**사용법**:
```bash
/sc:business-panel [문서] --mode [discussion|debate|socratic] --experts "porter,christensen,meadows" --synthesis-only
```

**예제**:
```bash
/sc:business-panel @strategy.pdf --mode debate
# 전략적 트레이드오프 노출을 위한 토론 모드
# Taleb이 위험 관리 관점에서 도전
# Collins가 조직 역량으로 방어
```

#### `/sc:spec-panel`
**목적**: 사양 검토 및 개선을 위한 전문가 패널

**전문가**:
- Karl Wiegers (요구사항 품질)
- Gojko Adzic (실행 가능한 사양)
- Martin Fowler (아키텍처 & API 설계)
- Michael Nygard (프로덕션 시스템)
- Lisa Crispin (테스팅 전략)

**사용법**:
```bash
/sc:spec-panel [@파일|내용] --mode [discussion|critique|socratic] --focus [requirements|architecture|testing|compliance]
```

#### `/sc:workflow`
**목적**: PRD에서 구조화된 구현 워크플로우 생성

**사용법**:
```bash
/sc:workflow [PRD파일|기능설명] --strategy [systematic|agile|enterprise] --parallel
```

**MCP**: Sequential, Context7, Magic, Playwright, Morphllm, Serena
**페르소나**: architect, analyzer, frontend, backend, security, devops, project-manager

#### `/sc:task`
**목적**: 다중 에이전트 조정으로 복잡한 작업 실행

**사용법**:
```bash
/sc:task [액션] [대상] --strategy [systematic|agile|enterprise] --parallel --delegate
```

**위계**:
```
Epic → Story → Task → Subtask
```

#### `/sc:spawn`
**목적**: 메타 시스템 작업 오케스트레이션

**사용법**:
```bash
/sc:spawn [복잡한작업] --strategy [sequential|parallel|adaptive] --depth [normal|deep]
```

**특징**:
- Epic → Story → Task → Subtask 분해
- 전략 선택: Sequential (의존성) → Parallel (독립) → Adaptive (동적)
- 크로스 도메인 조정

### 🔄 세션 관리

#### `/sc:load`
**목적**: 프로젝트 컨텍스트 로드

**사용법**:
```bash
/sc:load [대상] --type [project|config|deps|checkpoint] --refresh
```

**MCP**: Serena (필수)
**특징**:
- 프로젝트 활성화
- 메모리 검색
- 세션 복원
- <500ms 초기화

#### `/sc:save`
**목적**: 세션 컨텍스트 지속성

**사용법**:
```bash
/sc:save --type [session|learnings|context|all] --checkpoint
```

**MCP**: Serena (필수)
**특징**:
- 발견 사항 보존
- 체크포인트 생성
- 크로스 세션 학습

#### `/sc:reflect`
**목적**: 작업 검증 및 반성

**사용법**:
```bash
/sc:reflect --type [task|session|completion] --analyze --validate
```

**MCP**: Serena
**도구**:
- think_about_task_adherence: 프로젝트 목표 대비 검증
- think_about_collected_information: 세션 작업 분석
- think_about_whether_you_are_done: 완료 기준 평가

### 🔧 유틸리티

#### `/sc:git`
**목적**: 지능적 Git 작업

**사용법**:
```bash
/sc:git [작업] --smart-commit --interactive
```

**특징**:
- 변경 분석 기반 커밋 메시지 생성
- 일관된 브랜치 네이밍
- 충돌 해결 가이드

#### `/sc:select-tool`
**목적**: Serena vs Morphllm 지능적 도구 선택

**사용법**:
```bash
/sc:select-tool [작업] --analyze --explain
```

**결정 매트릭스**:
- 심볼 작업 → Serena
- 패턴 편집 → Morphllm
- 메모리 작업 → Serena
- 복잡도 >0.6 → Serena
- 복잡도 <0.4 → Morphllm

---

## 6. MCP 서버 통합

### Sequential MCP
**용도**: 복잡한 다단계 추론

**최적 활용**:
- 복잡한 디버깅
- 시스템 설계
- 다중 컴포넌트 분석
- 가설 검증

**통합 명령어**:
- `/sc:brainstorm` (체계적 탐색)
- `/sc:analyze --think-hard`
- `/sc:estimate` (복잡도 평가)
- `/sc:workflow` (워크플로우 분석)

### Context7 MCP
**용도**: 큐레이션된 문서 검색

**최적 활용**:
- 라이브러리 임포트
- 프레임워크 패턴
- 공식 문서
- 베스트 프랙티스

**통합 명령어**:
- `/sc:implement --framework react` (React 패턴)
- `/sc:improve` (프레임워크별 최적화)
- `/sc:cleanup` (프레임워크별 정리 패턴)

### Magic MCP
**용도**: 21st.dev 패턴 기반 현대적 UI 생성

**최적 활용**:
- UI 컴포넌트 요청
- 디자인 시스템 통합
- 프론트엔드 개발

**통합 명령어**:
- `/sc:implement --type component` (UI 생성)
- `/sc:brainstorm` (UI 실현 가능성)
- `/sc:workflow` (UI 워크플로우)

### Playwright MCP
**용도**: 실제 브라우저 자동화 및 테스팅

**최적 활용**:
- E2E 테스팅
- 시각적 검증
- 접근성 테스트
- 크로스 브라우저

**통합 명령어**:
- `/sc:test --type e2e`
- `/sc:build --validate` (빌드 검증)
- `/sc:brainstorm` (UX 검증)

### Morphllm MCP
**용도**: 대규모 패턴 기반 변환

**최적 활용**:
- 대량 코드 변환
- 패턴 기반 편집
- 스타일 적용
- 속도 중시 작업

**통합 명령어**:
- `/sc:improve` (대량 개선)
- `/sc:cleanup` (대량 정리)
- `/sc:workflow` (대규모 변환)

### Serena MCP
**용도**: 프로젝트 메모리 및 세션 지속성

**최적 활용**:
- 심볼 작업
- 프로젝트 메모리
- 크로스 세션 컨텍스트
- 의미적 이해

**통합 명령어**:
- `/sc:load` (컨텍스트 로드)
- `/sc:save` (컨텍스트 저장)
- `/sc:reflect` (작업 검증)
- `/sc:task` (크로스 세션 관리)

---

## 7. Cursor 실전 활용법

### 🚀 빠른 시작

#### 1. 프로젝트 분석
```
@superclaude-complete.md /sc:analyze --focus quality --depth quick

# 프로젝트 품질 빠른 체크
# 핵심 이슈와 우선순위 파악
```

#### 2. 기능 구현
```
@superclaude-complete.md /sc:implement "user authentication" --framework react --with-tests

# React 인증 컴포넌트 구현
# Magic MCP로 UI 생성
# Playwright로 테스트 검증
```

#### 3. 코드 개선
```
@superclaude-complete.md /sc:improve src/components --type quality --safe

# 안전한 리팩토링
# SOLID 원칙 적용
# 기술 부채 감소
```

### 💡 실전 워크플로우

#### A. 새 프로젝트 시작
```bash
# 1. 요구사항 발견
@superclaude-complete.md /sc:brainstorm "AI 기반 학습 플랫폼" --strategy systematic

# 2. 아키텍처 설계
@superclaude-complete.md /sc:design "학습 시스템" --type architecture --format diagram

# 3. 워크플로우 생성
@superclaude-complete.md /sc:workflow @prd.md --strategy agile --parallel

# 4. 구현 시작
@superclaude-complete.md /sc:implement "핵심 기능" --with-tests
```

#### B. 기존 프로젝트 개선
```bash
# 1. 종합 분석
@superclaude-complete.md /sc:analyze --focus all --depth deep

# 2. 문제 해결
@superclaude-complete.md /sc:troubleshoot "성능 이슈" --type performance --trace

# 3. 체계적 개선
@superclaude-complete.md /sc:improve --type quality --safe

# 4. 테스트 검증
@superclaude-complete.md /sc:test --coverage --type all
```

#### C. 비즈니스 분석
```bash
# 1. 전략 문서 분석
@superclaude-complete.md /sc:business-panel @strategy.pdf --mode discussion

# 2. 위험 평가 (토론 모드)
@superclaude-complete.md /sc:business-panel @risk.md --mode debate --experts "taleb,meadows,porter"

# 3. 학습 세션 (소크라테스 모드)
@superclaude-complete.md /sc:business-panel "경쟁 전략 이해" --mode socratic
```

#### D. 사양 검토
```bash
# 1. API 사양 검토
@superclaude-complete.md /sc:spec-panel @api-spec.yml --mode critique --focus requirements,architecture

# 2. 요구사항 워크샵
@superclaude-complete.md /sc:spec-panel "사용자 스토리" --mode discussion --experts "wiegers,adzic,cockburn"

# 3. 반복적 개선
@superclaude-complete.md /sc:spec-panel @spec.yml --iterations 3 --format detailed
```

### 🎯 주요 사용 패턴

#### 패턴 1: TDD 워크플로우
```bash
# 1. 테스트 전략 설계
@superclaude-complete.md 품질 전문가가 필요해. 이 기능의 테스트 전략을 설계해줘: [기능 설명]

# 2. 구현 (테스트 포함)
@superclaude-complete.md /sc:implement [기능] --with-tests

# 3. 커버리지 검증
@superclaude-complete.md /sc:test --coverage --type all
```

#### 패턴 2: 성능 최적화
```bash
# 1. 성능 분석
@superclaude-complete.md /sc:analyze --focus performance

# 2. 병목 진단
@superclaude-complete.md Performance Engineer가 필요해. 이 코드의 병목을 찾아줘: @slow-component.tsx

# 3. 최적화 적용
@superclaude-complete.md /sc:optimize @slow-component.tsx

# 4. 검증
@superclaude-complete.md /sc:test --type performance
```

#### 패턴 3: 보안 강화
```bash
# 1. 보안 감사
@superclaude-complete.md /sc:analyze --focus security --depth deep

# 2. 취약점 분석
@superclaude-complete.md Security Engineer가 필요해. 이 인증 시스템을 검토해줘: @auth-service.ts

# 3. 개선 적용
@superclaude-complete.md /sc:improve @auth-service.ts --type security --validate
```

#### 패턴 4: 문서화
```bash
# 1. API 문서 생성
@superclaude-complete.md /sc:document src/api --type api --style detailed

# 2. 사용자 가이드
@superclaude-complete.md Technical Writer가 필요해. 이 기능의 사용자 가이드를 작성해줘: [기능]

# 3. 프로젝트 인덱스
@superclaude-complete.md /sc:index . --type docs
```

### 🔑 핵심 팁

#### 1. 페르소나 직접 호출
```bash
# 특정 전문가 즉시 활성화
@superclaude-complete.md Backend Architect가 필요해. REST API 설계를 도와줘.

# 다중 전문가 협업
@superclaude-complete.md System Architect와 Security Engineer가 필요해. 마이크로서비스 아키텍처를 리뷰해줘.
```

#### 2. MCP 서버 명시
```bash
# Context7로 공식 문서 패턴
@superclaude-complete.md --c7 React Hooks 베스트 프랙티스를 알려줘

# Sequential로 복잡한 분석
@superclaude-complete.md --seq 이 버그의 근본 원인을 분석해줘
```

#### 3. 모드 조합
```bash
# 브레인스토밍 + 심층 사고
@superclaude-complete.md --brainstorm --think-hard "블록체인 기반 투표 시스템"

# 작업 관리 + 토큰 효율
@superclaude-complete.md --task-manage --uc 대규모 리팩토링 계획
```

#### 4. 컨텍스트 파일 활용
```bash
# 여러 파일 동시 분석
@superclaude-complete.md @component1.tsx @component2.tsx @utils.ts 이 컴포넌트들의 중복 코드를 제거해줘

# 프로젝트 전체 컨텍스트
@superclaude-complete.md @package.json @tsconfig.json 프로젝트 설정을 최적화해줘
```

### ⚡ 고급 활용

#### 세션 관리
```bash
# 세션 시작
@superclaude-complete.md /sc:load --type project --analyze

# 작업 중 체크포인트
@superclaude-complete.md /sc:save --checkpoint

# 작업 검증
@superclaude-complete.md /sc:reflect --type session --validate

# 세션 종료
@superclaude-complete.md /sc:save --type all --summarize
```

#### 대규모 작업 오케스트레이션
```bash
# Epic 레벨 분해
@superclaude-complete.md /sc:spawn "레거시 모놀리스를 마이크로서비스로 마이그레이션" --strategy adaptive --depth deep

# 다중 도메인 조정
@superclaude-complete.md /sc:task execute "엔터프라이즈 인증 시스템" --strategy systematic --parallel
```

#### 지속적 개선
```bash
# 주간 품질 리뷰
@superclaude-complete.md /sc:analyze --focus quality --depth deep

# 기술 부채 추적
@superclaude-complete.md /sc:cleanup --type all --interactive

# 성능 모니터링
@superclaude-complete.md /sc:analyze --focus performance
```

### 📋 체크리스트

#### 매 작업 시작 시
- [ ] `@superclaude-complete.md`로 프레임워크 활성화
- [ ] 적절한 페르소나/명령어 선택
- [ ] 필요시 MCP 서버 플래그 추가
- [ ] 복잡한 작업은 TodoWrite로 추적

#### 코드 리뷰 시
- [ ] `/sc:analyze --focus quality`로 품질 체크
- [ ] 보안 중요 시 Security Engineer 활성화
- [ ] 성능 중요 시 Performance Engineer 활성화
- [ ] `/sc:improve --safe`로 안전한 개선

#### 구현 완료 시
- [ ] `/sc:test --coverage`로 테스트 검증
- [ ] `/sc:document`로 문서 생성
- [ ] `/sc:reflect`로 작업 검증
- [ ] `/sc:save`로 세션 저장

---

## 📖 참고 자료

### 핵심 원칙 요약
1. **증거 기반**: 추측보다 증거, 문서보다 코드
2. **완전성**: 시작한 것은 완성까지
3. **안전성**: 검증 없이 변경 금지
4. **효율성**: 순차보다 병렬, 기본보다 MCP

### 자주 사용하는 조합
```bash
# 빠른 분석 + 개선
@superclaude-complete.md /sc:analyze --focus quality && /sc:improve --type quality --safe

# 구현 + 테스트
@superclaude-complete.md /sc:implement [기능] --with-tests && /sc:test --coverage

# 문제 해결 + 검증
@superclaude-complete.md /sc:troubleshoot [이슈] --fix && /sc:test --type all
```

### 트러블슈팅

**문제**: 페르소나가 활성화되지 않음
**해결**: `@superclaude-complete.md` 명시적으로 태그

**문제**: MCP 서버 작동 안 함
**해결**: 플래그 확인 (`--c7`, `--seq`, `--magic` 등)

**문제**: 토큰 부족
**해결**: `--uc` 플래그로 압축 모드 활성화

---

## 🎓 학습 경로

### 초급 → 중급
1. 기본 명령어 익히기 (`/sc:analyze`, `/sc:implement`)
2. 페르소나 직접 호출
3. MCP 플래그 활용
4. 모드 조합 시도

### 중급 → 고급
1. 복잡한 워크플로우 구성
2. 세션 관리 마스터
3. 메타 시스템 명령어 (`/sc:spawn`, `/sc:task`)
4. 비즈니스 패널 활용

### 고급 → 전문가
1. 커스텀 워크플로우 설계
2. 다중 MCP 조정
3. 크로스 세션 최적화
4. 프레임워크 확장

---

**마지막 업데이트**: 2025-01-15
**버전**: 1.0.0
**SuperClaude 프레임워크 기반 Cursor AI 통합 가이드**
