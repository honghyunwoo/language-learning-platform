# 개발 로그

## Phase 1: 프로젝트 기초 설정 (완료)

### 1. 프로젝트 초기화

#### 기술 스택
- **프레임워크**: Next.js 15.5.4 (App Router, Turbopack)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **백엔드**: Firebase (Auth, Firestore, Storage)
- **상태관리**: Zustand 5.0.8
- **데이터 페칭**: React Query 5.90.2
- **UI 라이브러리**: Headless UI 2.2.9
- **차트**: Chart.js 4.5.0
- **마크다운**: react-markdown 10.1.0
- **보안**: DOMPurify 3.2.7

#### 프로젝트 구조
```
language-learning-platform/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   └── globals.css        # 디자인 시스템
├── components/
│   └── ui/                # 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       └── index.ts
├── lib/
│   └── firebase.ts        # Firebase 초기화
├── hooks/
│   └── useAuth.ts         # 인증 훅
├── stores/
│   └── userStore.ts       # Zustand 사용자 스토어
├── types/                 # TypeScript 타입 정의
│   ├── user.ts
│   ├── post.ts
│   └── resource.ts
├── content/               # 마크다운 콘텐츠
├── tests/                 # 테스트 파일
└── docs/                  # 문서
    ├── FIREBASE_SETUP.md
    └── DEVELOPMENT_LOG.md
```

### 2. 디자인 시스템 구현

#### 색상 팔레트
- **Primary**: 9단계 블루 (50~900)
- **Gray**: 9단계 그레이 (50~900)
- **Semantic**: Success, Warning, Error, Info
- **Level**: A1(Green), A2(Blue), B1(Purple), B2(Pink)

#### 타이포그래피
- Font Size: 9단계 (xs: 12px ~ 5xl: 48px)
- Font Weight: Regular(400), Medium(500), Semibold(600), Bold(700)
- Line Height: 적절한 가독성 유지

#### 스페이싱
- 12단계 4px 기반 (1: 4px ~ 24: 96px)
- 일관된 여백 시스템

#### 기타
- Border Radius: sm(4px), md(6px), lg(8px), xl(12px), 2xl(16px), full(9999px)
- Shadows: 5단계 (sm ~ 2xl)
- Transitions: 200ms ease
- Dark Mode: 완전 지원
- Accessibility: Focus styles, Reduced motion

### 3. Firebase 설정

#### 구성 파일
- `lib/firebase.ts`: 초기화 코드 (Auth, Firestore, Storage)
- `firestore.rules`: 보안 규칙 (사용자별 권한 제어)
- `storage.rules`: 스토리지 규칙 (이미지 업로드 제한)
- `.env.local.example`: 환경변수 템플릿

#### 보안 규칙 주요 내용
- **Users**: 본인 프로필만 수정 가능, 모두 읽기 가능
- **Posts**: 공개 게시글만 읽기, 작성자만 수정/삭제
- **Comments**: 모두 읽기, 인증된 사용자만 작성
- **Resources**: 모두 읽기, 관리자만 수정 (클라이언트 불가)
- **Storage**: 프로필 이미지 5MB 제한, 이미지 형식만 허용

#### 설정 가이드
- `docs/FIREBASE_SETUP.md`: 상세한 Firebase Console 설정 방법
- 인덱스 설정, 환경변수, CLI 사용법 포함

### 4. TypeScript 타입 정의

#### User 타입
```typescript
- User: 기본 사용자 정보 (uid, email, nickname, level, goal 등)
- UserProgress: 주차별 학습 진행상황
- UserSettings: 사용자 설정 (알림, 테마, 텍스트 크기)
- UserLevel: 'A1' | 'A2' | 'B1' | 'B2'
- LearningGoal: 'travel' | 'business' | 'exam' | 'hobby'
```

#### Post 타입
```typescript
- Post: 게시글 (제목, 내용, 카테고리, 태그, 통계)
- Comment: 댓글 (중첩 댓글 지원)
- PostCategory: 'journal' | 'tip' | 'review' | 'question' | 'success'
```

#### Resource 타입
```typescript
- Resource: 학습 리소스 (YouTube, Podcast, Website, App)
- ResourceType, ResourceCategory, ResourceDuration
```

### 5. 공통 UI 컴포넌트

#### Button 컴포넌트
- **변형**: Primary, Secondary, Ghost, Danger
- **크기**: SM, MD, LG
- **기능**: Loading 상태, 전체 너비, 접근성

#### Input 컴포넌트
- **기능**: Label, Error 메시지, Helper text
- **접근성**: 자동 ID 연결, ARIA 속성

#### Card 컴포넌트
- **하위 컴포넌트**: Header, Title, Description, Content, Footer
- **기능**: Hover 효과, 패딩 제어

#### Badge 컴포넌트
- **변형**: Default, Success, Warning, Error, Info, Level
- **레벨**: A1~B2 색상 자동 매핑

#### Modal 컴포넌트
- **기반**: Headless UI (접근성 완벽)
- **기능**: 애니메이션, 배경 블러, 닫기 버튼

### 6. 인증 시스템

#### useAuth 훅
```typescript
기능:
- signUp(email, password, nickname, level, goal, time): 이메일 회원가입
- signIn(email, password): 이메일 로그인
- signInWithGoogle(): Google 로그인
- logout(): 로그아웃
- 자동 Firestore 프로필 생성/동기화
- 한국어 에러 메시지 변환
```

#### 로그인 페이지
- 이메일/비밀번호 입력
- 폼 유효성 검사
- Google 로그인 버튼
- 회원가입 링크

#### 회원가입 페이지
- **1단계**: 계정 정보 (이메일, 비밀번호, 닉네임)
- **2단계**: 학습 정보 (레벨, 목표, 학습 시간)
- 단계 진행 표시기
- Google 회원가입 옵션

### 7. 랜딩 페이지

#### 섹션 구성
1. **헤더**: 로고, 로그인/회원가입 버튼, Sticky
2. **히어로**: 메인 메시지, CTA 버튼, 레벨 뱃지
3. **특징**: 3개 카드 (커리큘럼, 진도 추적, 커뮤니티)
4. **통계**: 12주 커리큘럼, 4개 레벨, 100+ 리소스
5. **CTA**: 회원가입 유도
6. **푸터**: 링크 그룹 (학습, 커뮤니티, 정보)

#### 디자인
- 그라디언트 배경
- 반응형 레이아웃
- 다크 모드 지원
- 아이콘과 시각적 요소

## 검증 체크리스트

### 코드 품질
- [x] TypeScript 타입 안정성
- [x] 컴포넌트 재사용성
- [x] Props 유효성 검사
- [x] 접근성 (ARIA, Focus)
- [x] 다크 모드 지원
- [x] 반응형 디자인

### 보안
- [x] 환경변수 분리
- [x] Firebase 보안 규칙
- [x] XSS 방지 (DOMPurify)
- [x] 비밀번호 최소 길이
- [x] 클라이언트 유효성 검사

### 성능
- [x] Next.js 최적화 (App Router, Turbopack)
- [x] 컴포넌트 코드 스플리팅
- [x] 이미지 최적화 준비
- [x] Firebase 쿼리 최적화 준비

### 문서화
- [x] Firebase 설정 가이드
- [x] 개발 로그
- [x] 코드 주석
- [x] 타입 정의

## 알려진 이슈

### 미해결
- Firebase 프로젝트 아직 미생성 (사용자가 직접 생성 필요)
- `.env.local` 파일 미생성 (환경변수 설정 필요)

### 주의사항
- Tailwind CSS v4는 새로운 문법 사용 (`@theme inline`)
- Headless UI는 'use client' 필수
- Firebase는 클라이언트 사이드에서만 초기화

## 다음 단계 (Phase 2)

### 우선순위 1: 대시보드
- [ ] 레이아웃 컴포넌트 (Header, Sidebar)
- [ ] 학습 통계 카드
- [ ] 주간 진행상황 차트
- [ ] 스트릭 표시
- [ ] 최근 활동 타임라인

### 우선순위 2: 커리큘럼 시스템
- [ ] 레벨별 주차 목록
- [ ] 주차 상세 페이지
- [ ] 활동 체크리스트
- [ ] 마크다운 콘텐츠 렌더링
- [ ] 진도율 표시

### 우선순위 3: 학습 일지
- [ ] 일지 작성 폼
- [ ] 학습 시간 입력
- [ ] 노트 작성
- [ ] 일지 목록
- [ ] 캘린더 뷰

## 현재 상태 요약

**완료율**: Phase 1 100% 완료

**작동 가능 여부**: Firebase 설정 완료 시 즉시 테스트 가능

**주요 성과**:
- 완전한 디자인 시스템 구축
- 재사용 가능한 UI 컴포넌트 라이브러리
- 안전한 인증 시스템
- 프로페셔널한 랜딩 페이지

**다음 작업**: 사용자가 Firebase 프로젝트 생성 후 대시보드 개발 시작
