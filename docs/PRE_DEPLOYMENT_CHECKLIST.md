# 배포 전 체크리스트

## 빠른 점검 (5분)

배포하기 전에 이 체크리스트를 확인하세요.

### 1. 보안 체크

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] GitHub 저장소에 `.env.local` 파일이 커밋되지 않음
- [ ] Firebase API 키가 코드에 하드코딩되지 않음
- [ ] 모든 시크릿이 환경 변수로 관리됨

```bash
# 확인 방법
git status  # .env.local이 untracked인지 확인
grep -r "AIzaSy" ./app ./lib  # 하드코딩된 API 키 검색 (없어야 함)
```

### 2. 빌드 체크

- [ ] 로컬에서 프로덕션 빌드 성공

```bash
npm run build
```

**예상 결과**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

- [ ] 빌드 에러 없음
- [ ] TypeScript 타입 에러 없음
- [ ] Lint 경고 확인 및 수정

### 3. 환경 변수 준비

`.env.example` 파일과 실제 `.env.local` 파일 비교:

```bash
# .env.example의 모든 키가 .env.local에 존재하는지 확인
diff <(grep -o '^[A-Z_]*=' .env.example | sort) <(grep -o '^[A-Z_]*=' .env.local | sort)
```

- [ ] 모든 필수 환경 변수가 설정됨
- [ ] Firebase 설정 값이 올바름 (복사/붙여넣기 에러 없음)
- [ ] 환경 변수 값에 공백이나 줄바꿈이 없음

### 4. Firebase 설정 확인

Firebase Console에서:

- [ ] Authentication 활성화됨 (이메일/비밀번호)
- [ ] Firestore Database 생성됨
- [ ] 보안 규칙 설정됨 (테스트 모드에서 프로덕션 모드로 변경 권장)
- [ ] 허용 도메인 목록에 Vercel 도메인 추가 준비
  - Firebase Console → Authentication → Settings → Authorized domains
  - 배포 후 `[project-name].vercel.app` 추가 필요

### 5. 코드 품질 체크

- [ ] 모든 변경사항이 커밋됨

```bash
git status
# "nothing to commit, working tree clean"이어야 함
```

- [ ] 디버그 코드 제거됨 (`console.log` 등)
- [ ] 주석 처리된 코드 정리됨
- [ ] TODO 주석 확인 및 정리

```bash
# TODO 검색
grep -r "TODO" ./app ./lib
```

### 6. 의존성 체크

- [ ] `package.json`과 `package-lock.json` 동기화됨

```bash
npm ci  # clean install로 확인
```

- [ ] 보안 취약점 확인

```bash
npm audit
# 고위험(High) 취약점이 없어야 함
```

### 7. 페이지 라우팅 체크

로컬 개발 서버에서 확인:

```bash
npm run dev
```

- [ ] `/` (홈페이지) 접근 가능
- [ ] `/dashboard` 로그인 후 접근 가능
- [ ] `/dashboard/learn/week-1` 활동 렌더링 확인
- [ ] `/dashboard/placement-test` 배치고사 접근 가능
- [ ] 404 페이지 동작 확인

### 8. 반응형 디자인 체크

브라우저 개발자 도구에서:

- [ ] 모바일 (375px): 레이아웃 정상
- [ ] 태블릿 (768px): 레이아웃 정상
- [ ] 데스크톱 (1920px): 레이아웃 정상

### 9. PWA 체크 (Service Worker)

- [ ] `public/sw.js` 파일 존재
- [ ] `public/manifest.json` 파일 존재
- [ ] Service Worker 등록 코드 확인 (`app/layout.tsx`)

로컬에서 확인:

```bash
npm run build
npm run start
# 브라우저 개발자 도구 → Application → Service Workers
# "sw.js" 등록 확인
```

### 10. 데이터베이스 마이그레이션 체크

Firestore 컬렉션 구조:

- [ ] `users` 컬렉션 생성됨 (또는 자동 생성 준비됨)
- [ ] `progress` 컬렉션 구조 확인
- [ ] 인덱스 생성 필요 여부 확인

---

## 고급 체크 (선택사항)

### 성능 최적화

- [ ] Next.js Image 컴포넌트 사용 (`<Image>` vs `<img>`)
- [ ] 동적 임포트 사용 (`next/dynamic`)
- [ ] 번들 크기 분석

```bash
npm run build
# Build output에서 페이지별 크기 확인
# First Load JS < 200KB 권장
```

### SEO 최적화

- [ ] `metadata` 설정 (`app/layout.tsx`)
- [ ] Open Graph 이미지 설정
- [ ] `robots.txt` 설정 (선택사항)

### 에러 핸들링

- [ ] `app/error.tsx` 파일 존재
- [ ] `app/dashboard/error.tsx` 파일 존재
- [ ] 전역 에러 바운더리 동작 확인

---

## 체크리스트 완료 후

모든 항목을 확인했다면:

1. 최종 커밋 및 푸시:

```bash
git add .
git commit -m "chore: pre-deployment checklist completed"
git push origin main
```

2. `docs/VERCEL_DEPLOYMENT_GUIDE.md` 문서를 따라 배포 시작

3. 배포 후 확인:
   - [ ] 프로덕션 URL 접속 가능
   - [ ] Firebase 연결 정상
   - [ ] 로그인/회원가입 동작
   - [ ] 학습 활동 렌더링
   - [ ] Service Worker 등록 (PWA)

---

## 트러블슈팅 빠른 가이드

### 빌드 실패

```bash
# 로컬에서 빌드 에러 확인
npm run build

# TypeScript 에러 확인
npx tsc --noEmit

# Lint 확인
npm run lint
```

### 환경 변수 누락

```bash
# .env.example과 .env.local 비교
cat .env.example
cat .env.local

# Vercel 대시보드에서 환경 변수 재확인
```

### Firebase 연결 실패

```bash
# Firebase 설정 값 확인 (.env.local)
cat .env.local | grep FIREBASE

# Firebase Console에서 웹 앱 설정 재확인
```

---

**준비 완료!** 이제 Vercel 배포를 시작하세요.
