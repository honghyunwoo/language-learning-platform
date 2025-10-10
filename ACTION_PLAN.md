# 🎯 언어 학습 플랫폼 실행 계획

**작성일**: 2025-10-09
**현재 상태**: 분석 완료, 개발 서버 실행 중 (http://localhost:3008)

---

## 📋 현재 상황 요약

### ✅ 좋은 점
- 프로젝트 구조 깔끔 (중복 파일 거의 없음)
- 최신 기술 스택 (Next.js 15, React 19, TypeScript)
- 개발 서버 정상 작동
- 문서화 우수 (ADR, API 문서)

### ⚠️ 문제점
- 🔴 Critical 보안 이슈 3건
- 🔴 성능 병목 4건
- 🔴 비즈니스 모델 부재
- ⚠️ 테스트 코드 0개

---

## 🎯 우선순위별 실행 계획

### 🔴 Priority 1: 보안 (즉시 - 오늘)

**예상 시간**: 2-3시간
**ROI**: 무한대 (데이터 유출 방지)

#### 1.1 XSS 방어 (30분)
```bash
# 위치: app/dashboard/community/[id]/page.tsx:171
# 이미 DOMPurify 설치되어 있음 ✅

✅ 수정 코드 준비됨 (docs/SECURITY_AUDIT_REPORT.md 참조)
```

#### 1.2 Firestore Rules (30분)
```bash
# 위치: firestore.rules:18
# 사용자 프로필 보호 규칙 추가

✅ 수정 코드 준비됨
```

#### 1.3 입력 검증 (1시간)
```bash
# 신규 파일: lib/utils/sanitize.ts
# NoSQL Injection 방지

✅ 구현 필요
```

#### 1.4 미들웨어 강화 (1시간)
```bash
# Firebase Admin SDK 설치
npm install firebase-admin

# middleware.ts 수정
✅ 구현 필요
```

**즉시 실행 명령어**:
```bash
cd "c:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform"

# 1. 보안 브랜치 생성
git checkout -b security/critical-fixes

# 2. 수정 진행...
```

---

### 🟡 Priority 2: 성능 최적화 (1주일)

**예상 시간**: 1주일 (하루 2-3시간)
**ROI**: 45% 성능 향상, Firestore 비용 70% 절감

#### 2.1 Firebase Modular SDK (1일차)
```bash
# 예상 절감: 150KB (번들 50% 감소)
# 위치: lib/firebase.ts

✅ 수정 코드 준비됨 (docs/PERFORMANCE_ANALYSIS_REPORT.md)
```

#### 2.2 Dynamic Import (2일차)
```bash
# 예상 절감: 초기 로드 35% 감소
# 위치: app/dashboard/activities/

6개 Activity 컴포넌트 dynamic import 적용
```

#### 2.3 Journal 통합 Hook (3일차)
```bash
# 예상 절감: Firestore 비용 66% 감소
# 신규 파일: hooks/useJournalData.ts

현재: 3개 Hook이 각각 조회
개선: 1개 통합 Hook
```

#### 2.4 Dashboard 메모이제이션 (4일차)
```bash
# 예상 절감: 리렌더링 40% 감소
# 위치: app/dashboard/page.tsx

7개 Hook useMemo로 최적화
```

---

### 🟢 Priority 3: 테스트 인프라 (2주차)

**예상 시간**: 2주 (파트타임)
**ROI**: 버그 발견 80% 빠름, 배포 신뢰도 95%

#### 3.1 Vitest 설치 (5일차)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom

# vitest.config.ts 생성
# tests/ 디렉토리 구조 생성
```

#### 3.2 첫 테스트 작성 (6-7일차)
```bash
tests/
├── unit/
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useCommunity.test.ts
│   └── utils/
│       └── sanitize.test.ts
└── integration/
    └── api/
        └── firestore.test.ts
```

---

### 🎯 Priority 4: 비즈니스 전략 (병행 진행)

**예상 시간**: 2-4주
**ROI**: 사업 성패 결정

#### 4.1 타겟 고객 인터뷰 (1주차)
```
목표: 20명
방법: 온라인 설문 + 1:1 인터뷰
질문:
- 영어 학습 목적은?
- 현재 사용 중인 도구는?
- 가장 큰 어려움은?
- 얼마나 지불할 의향이 있는가?
```

#### 4.2 페르소나 정의 (2주차)
```
예시: "영어 면접 준비 직장인 진수"
- 나이: 28-35세
- 레벨: B1
- 목표: 3개월 내 외국계 기업 면접 통과
- 페인: 학원 비싸고, Duolingo는 면접 준비 안 됨
```

#### 4.3 MVP 피벗 (3주차)
```
현재: 48개 활동 (A1-B2 전체)
→ 피벗: 12개 활동 (B1 면접 영어 특화)

변경:
- 듣기: 면접 질문 청취
- 말하기: 자기소개, 경력 설명
- 읽기: 직무 설명서
- 쓰기: 커버레터
```

#### 4.4 Freemium 설계 (4주차)
```
무료: A1 레벨 + 주 3개 활동
$29/월: 전체 + AI 피드백
$99: 면접 통과 보장
```

---

## 🗓️ 실행 타임라인

### Week 1: 보안 + 성능 (집중)
```
월요일: 보안 Critical 3건
화요일: Firebase Modular SDK
수요일: Dynamic Import
목요일: Journal 통합
금요일: Dashboard 최적화
주말: 고객 인터뷰 시작
```

### Week 2: 테스트 + 인터뷰
```
월-수: Vitest 설치 및 첫 테스트
목-금: 고객 인터뷰 계속
주말: 인터뷰 분석
```

### Week 3-4: 비즈니스 피벗
```
Week 3: 페르소나 정의 + MVP 설계
Week 4: Freemium 모델 + 첫 100명 확보 전략
```

---

## 💡 오늘 당장 할 수 있는 것

### 옵션 A: 보안부터 (추천) ✅
```bash
# 이유: Critical 이슈, 30분~1시간이면 완료
# 효과: 데이터 유출 방지

cd "c:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform"
git checkout -b security/xss-fix

# 1. XSS 방어 (가장 쉬움)
code app/dashboard/community/[id]/page.tsx

# 2. Firestore Rules
code firestore.rules

# 3. 테스트
firebase deploy --only firestore:rules
```

### 옵션 B: 성능부터
```bash
# 이유: 즉시 효과 보임 (번들 150KB 감소)
# 시간: 1-2시간

git checkout -b perf/firebase-modular

# 1. Firebase SDK 변경
code lib/firebase.ts

# 2. 빌드 및 측정
npm run build
```

### 옵션 C: 비즈니스부터
```bash
# 이유: 방향 먼저 정하고 싶다면
# 시간: 2-3시간 (설문 작성)

# 1. Google Forms로 설문 작성
# 2. 타겟 커뮤니티에 배포 (Reddit, Facebook 그룹)
# 3. 20명 응답 수집
```

---

## 🤔 추천 순서 (개인적 의견)

### 만약 내가 PM이라면:

**Day 1 (오늘)**: 보안 Critical 3건 🔴
- 이유: 가장 시급하고, 빠르게 끝남
- 시간: 2-3시간
- 결과: 안심하고 개발 진행 가능

**Day 2**: 고객 인터뷰 설문 작성 📝
- 이유: 방향 정하기 전에 고객 목소리 들어야
- 시간: 2시간
- 결과: 20명 응답 수집 시작 (일주일 소요)

**Day 3-5**: 성능 최적화 ⚡
- 이유: 사용자 경험 개선, 비용 절감
- 시간: 하루 2-3시간 × 3일
- 결과: 45% 성능 향상

**Day 6-7**: 인터뷰 분석 + 페르소나 정의 🎯
- 이유: 비즈니스 방향 결정
- 시간: 하루 4-5시간 × 2일
- 결과: 명확한 타겟 고객

**Week 2 이후**: MVP 피벗 실행

---

## ❓ 당신의 선택

**질문 1**: 혼자 개발하나요, 아니면 팀이 있나요?
- 혼자 → 보안 → 비즈니스 → 성능 → 테스트 순서
- 팀 → 병행 가능 (보안+비즈니스 동시)

**질문 2**: 시간은 얼마나 있나요?
- 풀타임 → 2주 안에 Critical 모두 해결 가능
- 파트타임 → 한 달 계획

**질문 3**: 가장 신경 쓰이는 것은?
- 보안 → 보안부터
- 사용자 없음 → 비즈니스부터
- 느림 → 성능부터

---

## 🎯 내 추천 (한 문장)

**"오늘 보안 3건 고치고, 내일 고객 인터뷰 설문 돌리고, 다음 주에 성능 최적화하세요."**

---

**다음 단계**: 어떤 것부터 시작할지 결정해주시면, 구체적인 코드와 함께 진행하겠습니다!
