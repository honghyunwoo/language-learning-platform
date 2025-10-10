# 마스터 플랜 부록: 리스크/ADR/KPI (Week 1-24)

> 이 문서는 `MASTER_PLAN_6_MONTHS.md`와 `MASTER_PLAN_PHASE_2_3.md`의 부록입니다.

---

## 📊 통합 리스크 매트릭스 (6개월 전체)

### 리스크 평가 기준

**확률**:
- 🔴 High: 40%+
- 🟡 Medium: 20-39%
- 🟢 Low: <20%

**영향**:
- 🔥 Critical: 프로젝트 중단 또는 4주+ 지연
- ⚠️ High: 주요 기능 축소 또는 2-4주 지연
- 💡 Medium: 일정 조정 (1-2주) 또는 품질 저하
- 📝 Low: 사소한 불편, 쉽게 복구 가능

---

### Phase 1 리스크 (Week 1-8)

| ID | 리스크 | 확률 | 영향 | 점수 | 완화 전략 | 비상 계획 |
|----|--------|------|------|------|-----------|-----------|
| **R1.1** | 🔴 보안 패치 중 프로덕션 버그 | 30% | ⚠️ High | **9** | • Vercel Preview 배포 테스트<br>• Rollback 절차 문서화<br>• 수동 테스트 체크리스트 | 즉시 Rollback → 수정 → 재배포 (4h 이내) |
| **R1.2** | 🟡 인터뷰 대상자 모집 실패 (<5명) | 20% | ⚠️ High | **6** | • 인센티브 증액 ($5 → $10)<br>• 채널 확대 (Reddit + LinkedIn)<br>• 지인 네트워크 활용 | 기존 분석 데이터 + 경쟁사 리서치로 대체 |
| **R1.3** | 🟡 지불 의향 30% 미만 | 25% | 🔥 Critical | **10** | • 대안 니치 2개 사전 준비<br>• 추가 인터뷰 5명 예비<br>• 가격 탄력성 테스트 ($3/$5/$7) | 니치 재선정 (B2 비즈니스 영어) 또는 무료 모델 전환 |
| **R1.4** | 🔴 시간 부족 (주 20h 초과 필요) | 40% | 💡 Medium | **6** | • 우선순위 엄격 관리<br>• 저우선순위 Task 연기<br>• MVP 범위 축소 가능 | Phase 1 종료 1-2주 연기 (전체 일정 조정) |
| **R1.5** | 🟢 테스트 작성 지연 (10% 미달성) | 35% | 📝 Low | **3** | • 목표 유연 조정 (7-8% 허용)<br>• 보안 Critical Path 우선 | Phase 2로 이월 (전체 영향 적음) |

**Phase 1 최고 리스크**: **R1.3** (지불 의향 부족) - 점수 10

---

### Phase 2 리스크 (Week 9-16)

| ID | 리스크 | 확률 | 영향 | 점수 | 완화 전략 | 비상 계획 |
|----|--------|------|------|------|-----------|-----------|
| **R2.1** | 🟡 OpenAI API 비용 초과 ($50+/월) | 25% | 💡 Medium | **5** | • 비용 모니터링 알림 설정<br>• 무료 3회/월 제한 강화<br>• 캐싱 전략 (중복 분석 방지) | 무료 제한 1회/월로 축소 또는 프리미엄만 AI 제공 |
| **R2.2** | 🔴 베타 테스터 모집 실패 (<30명) | 30% | ⚠️ High | **9** | • 인센티브 강화 (1개월 → 3개월 무료)<br>• 다양한 채널 동시 진행<br>• 기존 사용자 추천 프로그램 | 목표 하향 (30명 → 20명) + Phase 3 그로스 강화 |
| **R2.3** | 🟡 음성 인식 정확도 낮음 (<70%) | 30% | ⚠️ High | **9** | • Whisper API 최적 설정 (언어 힌트)<br>• 녹음 품질 가이드 제공<br>• 재녹음 기능 강조 | 텍스트 입력 대안 제공 (임시) + 음성 인식 개선 연구 |
| **R2.4** | 🟡 NPS 점수 <20 (매우 낮음) | 20% | 🔥 Critical | **10** | • 1:1 인터뷰로 문제점 파악<br>• 빠른 피드백 반영<br>• 베타 커뮤니티 활성화 | 대규모 피봇: 니치 재선정 OR 기능 재설계 (4주 지연) |
| **R2.5** | 🔴 솔로 개발자 번아웃 | 30% | ⚠️ High | **9** | • 주 20시간 엄수 (오버워크 금지)<br>• 주말 완전 휴식<br>• MVP 범위 축소 옵션 | 2주 휴식 + 일정 재조정 (Phase 3 축소) |

**Phase 2 최고 리스크**: **R2.4** (NPS 낮음) - 점수 10

---

### Phase 3 리스크 (Week 17-24)

| ID | 리스크 | 확률 | 영향 | 점수 | 완화 전략 | 비상 계획 |
|----|--------|------|------|------|-----------|-----------|
| **R3.1** | 🟡 Firebase/Vercel 비용 폭증 ($200+) | 25% | 💡 Medium | **5** | • Firestore 쿼리 최적화<br>• 캐싱 전략 강화<br>• 사전 비용 시뮬레이션 | Spark → Blaze 플랜 이동 + 예산 재검토 (ROI 분석) |
| **R3.2** | 🟡 100명 목표 미달성 (<80명) | 30% | 💡 Medium | **6** | • 그로스 해킹 지속<br>• 추천 프로그램 인센티브 증액<br>• 콘텐츠 마케팅 강화 | 목표 하향 (80명 허용) + 론칭 연기 2주 |
| **R3.3** | 🟢 성능 목표 미달 (번들 >200KB) | 20% | 📝 Low | **2** | • 의존성 분석 철저<br>• Code splitting 확대<br>• 단계적 최적화 | 목표 완화 (200KB 허용) + 향후 개선 로드맵 |
| **R3.4** | 🟢 테스트 커버리지 미달 (<35%) | 25% | 📝 Low | **3** | • Critical Path 우선 집중<br>• E2E 테스트 범위 조정<br>• 단위 테스트 자동화 | 35% 목표로 하향 + Phase 4에서 보완 |
| **R3.5** | 🟡 법적 이슈 (개인정보 보호법) | 15% | ⚠️ High | **6** | • 변호사 검토 (무료 상담)<br>• Termly.io 템플릿 활용<br>• GDPR/CCPA 가이드 참고 | 론칭 연기 1-2주 + 법적 자문 ($500 예산) |

**Phase 3 최고 리스크**: **R3.2** (100명 미달) - 점수 6

---

### 전체 기간 공통 리스크

| ID | 리스크 | 확률 | 영향 | 점수 | 완화 전략 | 비상 계획 |
|----|--------|------|------|------|-----------|-----------|
| **R0.1** | 🔴 개인 사정 (건강/가족) | 15% | 🔥 Critical | **8** | • 여유 시간 확보 (20h 엄수)<br>• 주간 건강 체크<br>• 정기 휴식 | 프로젝트 1-4주 중단 + 복귀 후 일정 재조정 |
| **R0.2** | 🟢 Firebase/Vercel 장애 | 5% | ⚠️ High | **3** | • Uptime 모니터링<br>• 상태 페이지 구독<br>• 다운타임 대응 매뉴얼 | 사용자 공지 + 복구 대기 (외부 통제 불가) |
| **R0.3** | 🟢 경쟁사 출현 (유사 서비스) | 10% | 💡 Medium | **2** | • 빠른 출시 (MVP 우선)<br>• 차별화 포인트 강조<br>• 커뮤니티 구축 | 차별화 전략 재수립 + 가격 경쟁력 강화 |

---

## 📝 ADR (Architecture Decision Records)

### ADR-001: XSS 방어 - DOMPurify 사용

**Status**: ✅ Accepted (2025-10-09)

**Context**:
- 커뮤니티 게시글에서 사용자 HTML 입력을 허용해야 함 (링크, 볼드 등)
- XSS(Cross-Site Scripting) 공격 위험이 존재 (보안 분석 결과)
- 사용자 경험: 풍부한 텍스트 포맷 필요

**Decision**:
DOMPurify 라이브러리를 사용하여 HTML sanitize 수행.

**허용 태그**: `p`, `br`, `strong`, `em`, `a`, `ul`, `ol`, `li`만 허용.

**구현**:
```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
  ALLOW_DATA_ATTR: false
});
```

**Consequences**:
- ✅ 긍정적:
  - 검증된 라이브러리 (GitHub 15K+ stars)
  - 적극적 유지보수 (최신 XSS 페이로드 대응)
  - 유연한 설정 (허용 태그 커스터마이징)
- ❌ 부정적:
  - 번들 크기 +15KB (minified + gzipped)
  - 복잡한 Markdown 지원 불가 (표, 코드 블록 등)
- ⚠️ 위험:
  - 향후 Markdown 에디터 필요 시 마이그레이션 비용

**Alternatives Considered**:
1. **js-xss**: 한국어 문서 부족, 커뮤니티 작음
2. **직접 정규식 구현**: 보안 리스크 매우 높음 (새로운 XSS 기법 대응 어려움)
3. **Markdown 전환**: 기존 데이터 마이그레이션 필요, 사용자 학습 곡선

**Review Date**: 2026-04-09 (6개월 후)

---

### ADR-002: 입력 검증 - Zod 스키마

**Status**: ✅ Accepted (2025-10-09)

**Context**:
- Firestore 쿼리에 사용자 입력을 직접 전달 시 NoSQL Injection 위험
- TypeScript 타입만으로는 런타임 검증 불가
- 14개 주요 Hook에서 사용자 입력 처리 중

**Decision**:
Zod 라이브러리를 사용하여 런타임 스키마 검증 수행.

**구현**:
```typescript
import { z } from 'zod';

export const postQuerySchema = z.object({
  title: z.string().max(100).trim(),
  category: z.enum(['general', 'question', 'study']),
  level: z.enum(['A1', 'A2', 'B1', 'B2'])
});

// Hook에서 사용
const validatedInput = postQuerySchema.parse(userInput);
```

**Consequences**:
- ✅ 긍정적:
  - TypeScript 완벽 통합 (타입 추론 자동)
  - 명확한 에러 메시지 (사용자 피드백 개선)
  - React Hook Form 통합 가능 (`@hookform/resolvers`)
- ❌ 부정적:
  - 번들 크기 +12KB
  - 스키마 정의 초기 투자 시간 (10개 스키마 × 30분 = 5h)
- ⚠️ 위험:
  - 과도한 검증 시 사용자 경험 저하 (너무 엄격한 규칙)

**Alternatives Considered**:
1. **Yup**: 비슷한 기능이지만 TypeScript 통합 약함
2. **Joi**: 브라우저 번들 크기 더 큼 (+25KB)
3. **수동 검증**: 유지보수 어려움, 일관성 부족

**Review Date**: 2026-04-09

---

### ADR-003: 서버사이드 인증 - Firebase Admin SDK

**Status**: ✅ Accepted (2025-10-09)

**Context**:
- 기존: 클라이언트 Firebase SDK만으로 인증 체크
- 문제: 토큰 위조 가능, API Route 무단 접근
- Next.js Middleware에서 서버사이드 검증 필요

**Decision**:
Firebase Admin SDK를 사용하여 Middleware에서 ID 토큰 검증.

**구현**:
```typescript
// middleware.ts
import { verifyIdToken } from '@/lib/firebase/admin';

const token = request.cookies.get('__session')?.value;
const decodedToken = await verifyIdToken(token);
```

**Consequences**:
- ✅ 긍정적:
  - 서버사이드 토큰 검증 (위조 불가)
  - API Route 보호 강화
  - Firebase Admin 기능 사용 가능 (사용자 관리, Firestore Admin 등)
- ❌ 부정적:
  - 서비스 계정 키 관리 필요 (환경 변수)
  - Vercel Serverless 콜드 스타트 시간 +100ms
- ⚠️ 위험:
  - 서비스 계정 키 노출 시 전체 시스템 침해 (GitHub Secrets 사용 필수)

**Alternatives Considered**:
1. **NextAuth.js**: 오버킬 (이미 Firebase Auth 사용 중)
2. **JWT 직접 검증**: Firebase 토큰 구조 복잡, 유지보수 어려움
3. **클라이언트만 검증**: 보안 위험 매우 높음

**Review Date**: 2026-04-09

---

### ADR-004: 테스트 프레임워크 - Jest + Testing Library + Playwright

**Status**: ✅ Accepted (2025-10-09)

**Context**:
- 현재 테스트 커버리지 0%
- 목표: 6개월 내 40% 달성
- 솔로 개발자 리소스 제약

**Decision**:
- **단위/통합 테스트**: Jest + React Testing Library
- **E2E 테스트**: Playwright

**구현**:
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test"
  }
}
```

**Consequences**:
- ✅ 긍정적:
  - Jest: Next.js 공식 지원, 빠른 실행
  - Testing Library: React 권장 도구, 사용자 중심 테스트
  - Playwright: 크로스 브라우저, 실제 사용자 시나리오
- ❌ 부정적:
  - 학습 곡선 (Playwright 처음 사용)
  - CI 실행 시간 증가 (E2E 느림)
- ⚠️ 위험:
  - 테스트 유지보수 부담 (코드 변경 시 테스트도 수정)

**Alternatives Considered**:
1. **Vitest**: Jest보다 빠르지만 Next.js 통합 미성숙
2. **Cypress**: Playwright보다 느림, 유료 기능 많음
3. **수동 테스트만**: 장기적으로 지속 불가능

**Review Date**: 2025-12-09 (3개월 후, 커버리지 25% 달성 시점)

---

### ADR-005: 비즈니스 니치 - B1 면접 영어

**Status**: ✅ Accepted (2025-11-09, Week 8)

**Context**:
- Phase 1 고객 인터뷰 10명 완료
- 지불 의향: 60% (6명/10명)
- 평균 NPS: 8.2/10
- Pain Point 1위: "영어 면접 준비 막막함" (90%)

**Decision**:
**타겟**: B1 레벨 면접 영어 (취업 준비생 20-30대)
**차별화**: 실전 면접 시뮬레이션 + AI 개인화 피드백
**수익 모델**: Freemium (무료 3회/월, 프리미엄 $5/월)

**근거**:
- 인터뷰 데이터: 60% 지불 의향 (목표 50% 초과)
- 경쟁사 분석:
  - Cambly: 1:1 원어민 ($99/월, 비쌈)
  - ELSA Speak: 발음만 (면접 시나리오 없음)
  - Busuu: 일반 회화 (면접 특화 아님)
- TAM (Total Addressable Market):
  - 한국 취업 준비생: 300K명/년
  - 1% 전환: 3,000명 × $5 = $15K MRR

**Consequences**:
- ✅ 긍정적:
  - 명확한 타겟 (마케팅 효율 증가)
  - 경쟁 우위 (면접 특화)
  - 측정 가능한 성과 (취업 성공률)
- ❌ 부정적:
  - 시장 규모 제한 (B1만 타겟)
  - 계절성 (취업 시즌 편중 가능)
- ⚠️ 위험:
  - 니치가 너무 좁으면 성장 한계 (향후 확장 필요)

**Alternatives Considered**:
1. **B2 비즈니스 영어**: 지불 의향 40% (낮음)
2. **A2 여행 영어**: 지불 의향 30% (매우 낮음)
3. **A1-B2 전체**: 차별화 없음, "모두" = "아무도 아님"

**Review Date**: 2026-05-09 (6개월 후, 100명 데이터 기반 재평가)

---

### ADR-006: AI 피드백 엔진 - OpenAI API

**Status**: ✅ Accepted (2025-11-15, Week 10)

**Context**:
- MVP 핵심 기능: 음성 녹음 → AI 피드백
- 선택지: 직접 모델 학습 vs 외부 API 사용

**Decision**:
OpenAI API 사용 (Whisper + GPT-4)

**비용 분석**:
- Whisper: $0.006/분 (음성 → 텍스트)
- GPT-4: $0.03/1K tokens (평균 1K tokens/피드백)
- 예상 사용량: 50명 × 10회 = 500회/월
- 예상 비용: (500 × $0.006) + (500 × $0.03) = **$18/월**

**Consequences**:
- ✅ 긍정적:
  - 빠른 개발 (API 통합 4h vs 모델 학습 400h+)
  - 최신 기술 (GPT-4 성능 우수)
  - 유지보수 부담 없음 (OpenAI 업데이트)
- ❌ 부정적:
  - 월 비용 $18 (프리미엄 수익으로 커버 필요)
  - 외부 의존성 (OpenAI 장애 시 서비스 중단)
  - 데이터 전송 (개인정보 이슈)
- ⚠️ 위험:
  - OpenAI 가격 인상 (향후 비용 증가 가능)
  - API Rate Limit (급격한 사용자 증가 시)

**Alternatives Considered**:
1. **직접 모델 학습**: 시간/비용 막대 (GPU $500+, 학습 3개월+)
2. **Google Speech-to-Text**: 정확도 Whisper 대비 낮음
3. **텍스트 입력만**: 사용자 경험 저하 (음성 연습 불가)

**ROI 분석**:
- 비용: $18/월
- 수익: 5명 × $5 = $25/월 (프리미엄)
- 순익: $7/월 (39% 마진) ✅ 수익성 있음

**Review Date**: 2026-02-09 (3개월 후, 비용/성능 재평가)

---

### ADR-007: 성능 최적화 전략 - Firebase Modular + Code Splitting

**Status**: ✅ Accepted (2025-12-15, Week 17)

**Context**:
- 현재 번들 크기: 380KB (목표: 190KB)
- Lighthouse Performance: 65점 (목표: 90점)
- 최대 병목: Firebase SDK 300KB

**Decision**:
1. Firebase SDK Modular Import 전환 (150KB 절감)
2. Activity 컴포넌트 Dynamic Import (60KB 절감)
3. 이미지 최적화 (Next.js Image 컴포넌트)

**구현 우선순위**:
```
Week 17-18: Firebase 모듈화 (150KB) + Code Splitting (60KB)
→ 280KB - 210KB = 70KB (목표 60KB 초과 달성)

Week 19-20: 쿼리 최적화 + 캐싱
→ 성능 개선 (로딩 시간 -30%)

Week 21-22: 최종 최적화
→ 190KB 최종 목표 달성
```

**Consequences**:
- ✅ 긍정적:
  - 50% 번들 감소 (380KB → 190KB)
  - Lighthouse 90+ 달성 예상
  - SEO 개선 (페이지 속도 중요 지표)
- ❌ 부정적:
  - 대규모 리팩토링 (19개 파일 수정)
  - 테스트 필요 (Breaking Change 위험)
- ⚠️ 위험:
  - Firebase 모듈화 시 일부 기능 오작동 가능

**Alternatives Considered**:
1. **서버 컴포넌트 전환**: Next.js 15 미성숙, 리스크 높음
2. **CDN 외부 호스팅**: Firebase SDK 여전히 클라이언트 필요
3. **점진적 최적화**: 목표 달성 어려움 (작은 개선만)

**Review Date**: 2026-01-15 (1개월 후, 실제 성능 측정)

---

## 📊 KPI (Key Performance Indicators)

### 기술 KPI

| 지표 | Week 0 | Week 8 | Week 16 | Week 24 | 측정 방법 | 목표 달성 기준 |
|------|--------|--------|---------|---------|-----------|----------------|
| **보안 등급** | B+ (치명적 3) | A (치명적 0) | A | A | 수동 보안 테스트 | ✅ 치명적 0개 유지 |
| **테스트 커버리지** | 0% | 10% | 25% | 40% | `npm run test:coverage` | ✅ 40% 이상 |
| **번들 크기** | 380KB | 380KB | 280KB | 190KB | Next.js Build 분석 | ✅ 190KB 이하 |
| **Lighthouse Performance** | 65 | 70 | 78 | 90 | Lighthouse CI | ✅ 90 이상 |
| **LCP (Largest Contentful Paint)** | 3.5s | 3.2s | 2.8s | 2.2s | Vercel Analytics | ✅ <2.5s |
| **FID (First Input Delay)** | 120ms | 100ms | 80ms | 60ms | Vercel Analytics | ✅ <100ms |
| **CLS (Cumulative Layout Shift)** | 0.15 | 0.12 | 0.08 | 0.05 | Vercel Analytics | ✅ <0.1 |
| **에러율** | - | - | <1% | <0.5% | Sentry | ✅ <0.5% |
| **Uptime** | - | - | 99% | 99.5% | UptimeRobot | ✅ 99.5% 이상 |

### 비즈니스 KPI

| 지표 | Week 0 | Week 8 | Week 16 | Week 24 | 측정 방법 | 목표 달성 기준 |
|------|--------|---------|---------|---------|-----------|----------------|
| **총 가입자** | 0 | 0 | 50 | 120 | Firestore `/users` 카운트 | ✅ 100명 이상 |
| **활성 사용자 (월)** | 0 | 0 | 30 | 100 | 월 1회 이상 로그인 | ✅ 100명 이상 |
| **프리미엄 사용자** | 0 | 0 | 2-3 | 5-7 | Stripe 구독 수 | ✅ 5명 이상 |
| **전환율** | - | - | 5% | 5-7% | (프리미엄 / 활성) × 100 | ✅ 5% 이상 유지 |
| **MRR (Monthly Recurring Revenue)** | $0 | $0 | $10-15 | $25-35 | Stripe Dashboard | ✅ $25 이상 |
| **NPS (Net Promoter Score)** | - | - | 40 | 50+ | 분기별 설문 (0-10점) | ✅ 50 이상 |
| **Churn Rate (이탈률)** | - | - | - | <10% | 월간 구독 취소율 | ✅ <10% |
| **CAC (Customer Acquisition Cost)** | - | - | $5 | $3 | 마케팅 비용 / 신규 가입 | ✅ <$5 |
| **LTV (Lifetime Value)** | - | - | $15 | $30 | 평균 구독 기간 × $5 | ✅ LTV/CAC > 3 |

### 사용자 행동 KPI

| 지표 | Week 0 | Week 8 | Week 16 | Week 24 | 측정 방법 | 목표 달성 기준 |
|------|--------|---------|---------|---------|-----------|----------------|
| **총 면접 시도 횟수** | 0 | 0 | 100 | 500 | Firestore `/interviews` 카운트 | ✅ 500회 이상 |
| **평균 면접/사용자** | - | - | 3.3 | 5 | 총 시도 / 활성 사용자 | ✅ 5회 이상 |
| **면접 완료율** | - | - | 70% | 80% | 완료 / 시작 × 100 | ✅ 80% 이상 |
| **평균 세션 시간** | - | - | 8분 | 12분 | Google Analytics 4 | ✅ 10분 이상 |
| **재방문율 (주간)** | - | - | 40% | 60% | 주 2회 이상 로그인 | ✅ 50% 이상 |
| **추천 프로그램 참여율** | - | - | - | 30% | 추천 링크 생성 / 전체 | ✅ 30% 이상 |
| **AI 피드백 만족도** | - | - | 7.5/10 | 8.5/10 | 피드백 후 설문 (1-10점) | ✅ 8.0 이상 |

---

## 📈 성공 지표 대시보드 (Week 24 목표)

### 기술 성과

```
✅ 보안: A등급 (치명적 0개, 고위험 0개)
✅ 성능: Lighthouse 90+ (LCP 2.2s, FID 60ms, CLS 0.05)
✅ 품질: 테스트 커버리지 40% (Critical Path 100%)
✅ 번들: 190KB (초기 380KB 대비 50% 감소)
✅ 안정성: Uptime 99.5%, 에러율 <0.5%
```

### 비즈니스 성과

```
✅ 사용자: 100명 활성 (목표 달성)
✅ 수익: MRR $25+ (5명 × $5/월)
✅ 만족도: NPS 50+ (Promoters 우세)
✅ 전환율: 5-7% (프리미엄)
✅ 유지율: Churn <10% (90% 리텐션)
```

### 제품 성과

```
✅ 콘텐츠: 3가지 면접 시나리오 × 10개 질문 = 30개
✅ AI 정확도: 음성 인식 85%+, 피드백 만족도 8.5/10
✅ 사용성: 면접 완료율 80%, 평균 세션 12분
✅ 그로스: 추천 프로그램 30% 참여, CAC $3
✅ 커뮤니티: 게시글 50개+, 댓글 200개+
```

---

## 🎯 Go/No-Go 의사결정 매트릭스

### Phase 1 종료 (Week 8)

| 기준 | 목표 | 최소 허용 | 상태 | 결정 |
|------|------|-----------|------|------|
| 보안 패치 완료 | 치명적 0개 | 치명적 0개 | ⏳ | **필수 (GO/NO-GO)** |
| 테스트 커버리지 | 10% | 8% | ⏳ | 권장 |
| 고객 인터뷰 | 10명 | 8명 | ⏳ | 권장 |
| 지불 의향 | ≥50% | ≥30% | ⏳ | **필수 (GO/PIVOT/NO-GO)** |
| ADR 문서 | 5개 | 3개 | ⏳ | 선택 |

**의사결정 트리**:
- 보안 패치 완료 ✅ + 지불 의향 ≥50% → **GO** (Phase 2 진행)
- 보안 패치 완료 ✅ + 지불 의향 30-49% → **PIVOT** (니치 조정)
- 보안 패치 완료 ✅ + 지불 의향 <30% → **NO-GO** (프로젝트 재검토)
- 보안 패치 미완료 ❌ → **NO-GO** (Phase 1 연장)

---

### Phase 2 종료 (Week 16)

| 기준 | 목표 | 최소 허용 | 상태 | 결정 |
|------|------|-----------|------|------|
| MVP 완성 | 3가지 시나리오 | 2가지 | ⏳ | **필수 (GO/NO-GO)** |
| 베타 활성 사용자 | 30명 | 20명 | ⏳ | **필수 (GO/NO-GO)** |
| 프리미엄 전환 | 2명 (5%) | 1명 (3%) | ⏳ | 권장 |
| NPS 점수 | ≥40 | ≥20 | ⏳ | **필수 (GO/PIVOT)** |
| 테스트 커버리지 | 25% | 22% | ⏳ | 권장 |

**의사결정 트리**:
- MVP ✅ + 베타 ≥20명 ✅ + NPS ≥40 → **GO** (Phase 3 진행)
- MVP ✅ + 베타 ≥20명 ✅ + NPS 20-39 → **PIVOT** (대규모 개선 4주)
- MVP ✅ + 베타 <20명 ❌ → **NO-GO** (그로스 재전략)
- MVP 미완성 ❌ → **NO-GO** (Phase 2 연장 2주)

---

### Phase 3 종료 (Week 24) - 상용화 준비

| 기준 | 목표 | 최소 허용 | 상태 | 결정 |
|------|------|-----------|------|------|
| 활성 사용자 | 100명 | 80명 | ⏳ | **필수 (GO/NO-GO)** |
| 프리미엄 전환 | 5명 (5%) | 4명 (5%) | ⏳ | **필수 (GO/NO-GO)** |
| 테스트 커버리지 | 40% | 35% | ⏳ | 권장 |
| Lighthouse | 90 | 85 | ⏳ | 권장 |
| 번들 크기 | 190KB | 200KB | ⏳ | 권장 |
| 법적 문서 | 완료 | 완료 | ⏳ | **필수 (GO/NO-GO)** |
| Uptime | 99.5% | 99% | ⏳ | **필수 (GO/NO-GO)** |

**의사결정 트리**:
- 사용자 ≥80명 ✅ + 전환 ≥4명 ✅ + 법적 ✅ + Uptime ✅ → **🚀 상용화 GO**
- 사용자 <80명 ❌ → **NO-GO** (Phase 3 연장 2주, 그로스 집중)
- 전환 <4명 ❌ → **PIVOT** (가격 조정 또는 프리미엄 기능 개선)
- 법적/Uptime 미완성 ❌ → **NO-GO** (론칭 연기 1-2주)

---

## 📅 주차별 체크포인트

### Week 4 Checkpoint ✅

- [ ] 보안 패치 3개 완료
- [ ] 수동 테스트 통과
- [ ] Vercel 재배포 성공

**결정**: Phase 1 Week 5-6 진행 OR 추가 보안 이슈 해결

---

### Week 8 Checkpoint (Phase 1 종료) 🎯

- [ ] 지불 의향 결과 확인
- [ ] **GO/PIVOT/NO-GO 결정**
- [ ] Phase 2 계획 조정

**결정**: Phase 2 진행 OR 니치 재선정 OR 프로젝트 중단

---

### Week 12 Checkpoint ✅

- [ ] MVP 1개 시나리오 완성
- [ ] 베타 신청 30명 이상
- [ ] Freemium 결제 동작

**결정**: Week 13-14 베타 운영 진행 OR 모집 기간 연장

---

### Week 16 Checkpoint (Phase 2 종료) 🎯

- [ ] NPS 설문 결과 확인
- [ ] **GO/PIVOT 결정**
- [ ] Phase 3 우선순위 재정렬

**결정**: Phase 3 진행 OR 대규모 개선 (4주 추가)

---

### Week 20 Checkpoint ✅

- [ ] 번들 220KB 달성
- [ ] 테스트 커버리지 35%
- [ ] 활성 사용자 75명

**결정**: Week 21-24 최종 스퍼트 OR 일정 조정

---

### Week 24 Checkpoint (최종) 🚀

- [ ] 모든 상용화 체크리스트 완료
- [ ] **상용화 GO/NO-GO 결정**
- [ ] 론칭 준비 완료

**결정**: 🚀 Public 론칭 OR 연기 (1-2주 추가 준비)

---

## 🎓 학습한 교훈 (예상)

### 기술적 교훈

1. **Firebase Modular Import**: 번들 크기 50% 감소, 초기 투자 가치 있음
2. **DOMPurify**: 보안과 UX 균형, 허용 태그 신중히 선택
3. **OpenAI API**: 외부 의존성이지만 개발 속도 10배 향상
4. **Playwright E2E**: 초기 설정 어렵지만 Critical Path 보호 효과적

### 비즈니스 교훈

1. **니치 중요성**: "모두"가 아닌 "B1 면접 영어" 명확한 타겟
2. **고객 인터뷰**: 10명 인터뷰가 3개월 방향 결정 (ROI 매우 높음)
3. **Freemium 전환율**: 5% 달성 가능, 무료 제한 3회가 적절
4. **추천 프로그램**: 30% 참여율, 그로스 핵심 채널

### 프로세스 교훈

1. **주 20시간 엄수**: 번아웃 방지, 장기 지속 가능성 핵심
2. **MVP 우선**: 완벽보다 빠른 검증, 베타 테스터 피드백 반영
3. **ADR 문서화**: 의사결정 이유 기록, 향후 재검토 시 유용
4. **Go/No-Go 게이트**: 명확한 기준, 감정 배제 의사결정

---

## 📚 참고 자료

### 기술 문서
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OpenAI API Pricing](https://openai.com/pricing)
- [Playwright Testing](https://playwright.dev)

### 비즈니스 프레임워크
- Porter's Five Forces (경쟁사 분석)
- Christensen's Jobs-to-be-Done (인터뷰 방법론)
- Lean Startup (MVP, Build-Measure-Learn)
- Freemium Best Practices (5% 전환율 벤치마크)

### 템플릿
- `docs/templates/ADR_TEMPLATE.md` (ADR 작성 가이드)
- `docs/templates/INTERVIEW_GUIDE.md` (고객 인터뷰 질문지)
- `docs/templates/WEEKLY_REPORT.md` (주간 리포트 양식)

---

**문서 버전**: 1.0
**최종 수정**: 2025-10-09
**다음 리뷰**: 2025-11-09 (Phase 1 종료 시)

