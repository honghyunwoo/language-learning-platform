# SuperClaude 실전 활용 가이드

> 이 프로젝트(언어 학습 플랫폼)에서 SuperClaude를 **섬세하게** 활용하는 방법

## 🎯 기본 원칙

SuperClaude는 **15개 전문가**와 **25개 명령어 패턴**을 가지고 있습니다.
하지만 **전부 사용할 필요 없습니다**. 상황에 맞게 **1-3개만** 선택하세요.

---

## 📋 상황별 최적 활용법

### 🐛 **상황 1: 버그 발견**

**잘못된 사용:**
```
"버그 고쳐줘"
```

**섬세한 사용:**
```
Root Cause Analyst로 이 버그를 분석해줘:
- 증상: 로그인 후 대시보드가 무한 로딩
- 발생 시점: Firebase auth 연동 후
- 관련 파일: app/dashboard/page.tsx

체계적으로 원인을 찾고, 해결 방안을 제시해줘.
```

**왜 좋은가:**
- Root Cause Analyst 페르소나 활성화
- 명확한 컨텍스트 제공
- 체계적 분석 요청

---

### ⚡ **상황 2: 성능 문제**

**잘못된 사용:**
```
"느려요"
```

**섬세한 사용:**
```
Performance Engineer로 분석해줘:

현재 상황:
- hooks/useCommunity.ts의 usePost 훅
- 게시물 로딩이 3초 이상 걸림
- React Query 사용 중

분석 요청:
1. 병목 지점 찾기
2. 캐싱 전략 개선
3. 불필요한 리렌더링 제거
```

**왜 좋은가:**
- Performance Engineer 전문성 활용
- 구체적 파일/상황 명시
- 단계별 요청

---

### 🔒 **상황 3: 보안 검토**

**잘못된 사용:**
```
"보안 확인해줘"
```

**섬세한 사용:**
```
Security Engineer로 인증 시스템을 검토해줘:

검토 대상:
- hooks/useAuth.ts
- lib/firebase.ts
- Firestore Security Rules

체크리스트:
✅ XSS 방지
✅ CSRF 토큰
✅ Firebase 규칙 검증
✅ 민감정보 노출 여부

우선순위가 높은 이슈부터 리포트해줘.
```

**왜 좋은가:**
- Security Engineer 관점
- 명확한 체크리스트
- 우선순위 요청

---

### 🎨 **상황 4: 새로운 UI 컴포넌트**

**잘못된 사용:**
```
"프로필 카드 만들어줘"
```

**섬세한 사용:**
```
Frontend Architect로 사용자 프로필 카드를 설계하고 구현해줘:

요구사항:
- 위치: components/profile/UserProfileCard.tsx
- 데이터: User 타입 (types/user.ts)
- 스타일: Tailwind CSS (기존 디자인 시스템 준수)
- 기능: 아바타, 이름, 레벨, 뱃지 표시

디자인 원칙:
- 재사용 가능한 컴포넌트
- 반응형 디자인
- 접근성(a11y) 고려
```

**왜 좋은가:**
- Frontend Architect 전문성
- 명확한 위치와 타입
- 디자인 원칙 명시

---

### 🔧 **상황 5: 리팩토링**

**잘못된 사용:**
```
"이 코드 개선해줘"
```

**섬세한 사용:**
```
Refactoring Expert로 hooks/useCommunity.ts를 리팩토링해줘:

현재 문제:
- 파일이 500줄 이상
- useCreatePost, useUpdatePost 등 중복 로직
- 타입 안전성 부족

목표:
1. 공통 로직 추출 (useFirestoreMutation)
2. 타입 안전성 강화
3. 파일 크기 50% 감소

제약:
- 기존 API 호환성 유지
- React Query 패턴 유지
- 테스트 코드 깨지면 안 됨
```

**왜 좋은가:**
- Refactoring Expert 활용
- 명확한 목표와 제약
- 구체적 개선 방향

---

### 📚 **상황 6: 새 기능 추가**

**잘못된 사용:**
```
"채팅 기능 만들어줘"
```

**섬세한 사용:**
```
## Phase 1: 요구사항 분석
Requirements Analyst로 실시간 채팅 기능의 요구사항을 정리해줘.

## Phase 2: 설계
System Architect로 채팅 아키텍처를 설계해줘:
- Firebase Realtime Database vs Firestore
- 메시지 구조
- 읽음 상태 관리

## Phase 3: 보안
Security Engineer로 보안 요구사항을 정의해줘.

## Phase 4: 구현
Backend Architect와 Frontend Architect가 협력해서 구현해줘.

각 단계마다 내 승인을 받고 진행해줘.
```

**왜 좋은가:**
- 단계별 전문가 활용
- 체계적 진행
- 사용자 통제 유지

---

## 💡 **팁: 전문가 조합하기**

### **조합 1: 품질 검증 파이프라인**
```
1. Quality Engineer로 코드 리뷰
2. Security Engineer로 보안 검토
3. Performance Engineer로 성능 검증
4. Technical Writer로 문서화

→ 완벽한 PR 준비 완료!
```

### **조합 2: 문제 해결 프로세스**
```
1. Root Cause Analyst로 원인 분석
2. System Architect로 해결 전략 수립
3. Refactoring Expert로 구현
4. Quality Engineer로 검증
```

### **조합 3: 학습 모드**
```
1. Learning Guide로 개념 학습
2. Socratic Mentor로 질문 기반 이해
3. Technical Writer로 정리
```

---

## 🎨 **프로젝트별 커스텀 페르소나**

이 프로젝트(언어 학습 플랫폼)에 특화된 요청:

### **"Firebase Specialist" 모드**
```
Backend Architect + Security Engineer 조합으로:
- Firestore 쿼리 최적화
- Security Rules 검증
- Firebase 모범 사례 적용
```

### **"Next.js Expert" 모드**
```
Frontend Architect + Performance Engineer 조합으로:
- App Router 최적화
- Server/Client Component 분리
- 번들 사이즈 최적화
```

### **"Korean Content Specialist" 모드**
```
Technical Writer로:
- 한국어 주석 작성
- 한국어 에러 메시지
- 한국어 문서화
```

---

## ⚠️ **피해야 할 패턴**

### ❌ **과도한 요청**
```
"15개 전문가 모두 동원해서 완벽하게 만들어줘"
→ 혼란스럽고 일관성 없는 결과
```

### ❌ **모호한 요청**
```
"좋게 해줘"
→ AI가 추측해야 함
```

### ❌ **컨텍스트 없는 요청**
```
"버그 고쳐"
→ 어떤 버그? 어디서? 언제?
```

---

## ✅ **체크리스트: 좋은 요청**

요청하기 전에 체크하세요:

- [ ] 어떤 전문가가 필요한지 명확한가?
- [ ] 구체적인 파일/코드 위치를 제시했는가?
- [ ] 현재 상황과 문제를 설명했는가?
- [ ] 원하는 결과를 명확히 했는가?
- [ ] 제약사항을 언급했는가?

---

## 🚀 **빠른 참조: 15개 전문가**

| 전문가 | 언제 사용? |
|--------|-----------|
| **System Architect** | 시스템 설계, 아키텍처 결정 |
| **Backend Architect** | API, 서버 로직, DB |
| **Frontend Architect** | UI 컴포넌트, 상태관리 |
| **Performance Engineer** | 성능 최적화, 병목 해결 |
| **Security Engineer** | 보안 검토, 취약점 분석 |
| **Quality Engineer** | 코드 품질, 테스트 |
| **DevOps Architect** | 빌드, 배포, CI/CD |
| **Refactoring Expert** | 코드 개선, 리팩토링 |
| **Requirements Analyst** | 요구사항 정리, 분석 |
| **Root Cause Analyst** | 버그 원인 분석 |
| **Python Expert** | Python 코드 (이 프로젝트엔 미사용) |
| **Learning Guide** | 개념 학습, 튜토리얼 |
| **Socratic Mentor** | 질문 기반 학습 |
| **Technical Writer** | 문서화, 주석 |
| **Business Panel** | 비즈니스 분석 (선택적) |

---

## 📝 **실전 연습**

### **연습 1: 지금 당장 해보기**
```
"Quality Engineer로 hooks/useFirestore.ts를 리뷰해줘.
특히 타입 안전성과 에러 처리에 집중해줘."
```

### **연습 2: 조합 사용**
```
"이 컴포넌트를:
1. Frontend Architect로 리팩토링하고
2. Performance Engineer로 최적화하고
3. Technical Writer로 문서화해줘"
```

### **연습 3: 프로젝트 특화**
```
"Firebase + Next.js 전문가로서:
hooks/useCommunity.ts의 Firestore 쿼리를
최적화하고 캐싱 전략을 개선해줘"
```

---

## 🎯 **최종 조언**

1. **단순하게 시작** - 한 번에 1-2개 전문가만
2. **명확하게 요청** - 컨텍스트와 목표 제시
3. **점진적 개선** - 완벽보다는 반복
4. **피드백 제공** - 결과를 보고 조정

**SuperClaude는 도구입니다. 당신이 주인입니다.** 🎨
