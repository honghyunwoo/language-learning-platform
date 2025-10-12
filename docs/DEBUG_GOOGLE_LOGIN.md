# Google 로그인 디버깅 가이드

Google 로그인이 작동하지 않을 때 문제를 진단하고 해결하는 단계별 가이드입니다.

---

## 🔍 1단계: 브라우저 콘솔 확인

### 방법
1. **F12** 키를 눌러 개발자 도구 열기
2. **Console** 탭으로 이동
3. 기존 로그 삭제 (Clear console)
4. Google 로그인 버튼 클릭
5. 콘솔에 출력되는 에러 메시지 확인

### 확인할 내용
```
Google 로그인 실패 (상세): ...
Error code: auth/xxx-xxx
Error message: ...
```

### 주요 에러 코드

| 에러 코드 | 의미 | 해결 방법 |
|---------|------|---------|
| `auth/unauthorized-domain` | 도메인이 Firebase에 승인되지 않음 | **3단계**로 이동하여 도메인 추가 |
| `auth/popup-blocked` | 브라우저가 팝업 차단 | 브라우저 설정에서 팝업 허용 |
| `auth/popup-closed-by-user` | 사용자가 팝업을 닫음 | 정상 동작 (다시 시도) |
| `auth/network-request-failed` | 네트워크 오류 | 인터넷 연결 확인 |

---

## 🌐 2단계: Network 탭 확인

### 방법
1. **F12** → **Network** 탭
2. **Clear** (🚫 아이콘) 클릭하여 기존 요청 삭제
3. Google 로그인 버튼 클릭
4. `accounts.google.com` 또는 `identitytoolkit.googleapis.com` 요청 찾기
5. 해당 요청 클릭 → **Headers** 탭 확인

### 확인할 내용

#### Request URL
```
https://accounts.google.com/...
```
- ❌ CORS 에러 표시 → **4단계** COOP 헤더 확인
- ❌ 403 Forbidden → **3단계** Firebase 도메인 설정 확인
- ❌ 401 Unauthorized → Firebase API Key 확인

#### Response Headers (메인 페이지)
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
```
- ❌ 이 헤더가 없거나 다른 값 → **4단계**로 이동

---

## 🔥 3단계: Firebase Console 확인

### 3-1. Authorized Domains 확인

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. **Authentication** → **Settings** → **Authorized domains** 탭
4. 현재 Vercel 배포 URL이 목록에 있는지 확인

#### 예시
```
✅ localhost (개발용)
✅ your-project.firebaseapp.com (기본 도메인)
❌ your-app.vercel.app (누락됨!) ← 추가 필요
```

### 3-2. 도메인 추가 방법
1. **Add domain** 버튼 클릭
2. Vercel URL 입력 (예: `your-app.vercel.app`)
   - ⚠️ `https://` 없이 도메인만 입력
   - ⚠️ 경로 없이 호스트명만 입력 (예: `/login` 제외)
3. **Add** 클릭

### 3-3. 여러 도메인 추가 (권장)
```
✅ localhost
✅ your-project.firebaseapp.com
✅ your-app.vercel.app
✅ your-app-staging.vercel.app (스테이징 환경)
✅ your-custom-domain.com (커스텀 도메인)
```

---

## 🔒 4단계: COOP 헤더 확인

### 4-1. 브라우저에서 확인

1. **F12** → **Network** 탭
2. 페이지 새로고침 (F5)
3. 첫 번째 Document 요청 클릭
4. **Headers** 탭 → **Response Headers** 확인

#### 확인할 헤더
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

- ✅ 이 값이면 정상
- ❌ `same-origin` → Firebase 로그인 차단됨 (수정 필요)
- ❌ 헤더 없음 → 설정이 적용되지 않음

### 4-2. 설정 파일 확인

#### [vercel.json](../vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin-allow-popups"
        }
      ]
    }
  ]
}
```

#### [next.config.ts](../next.config.ts)
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin-allow-popups',
        },
      ],
    },
  ];
}
```

---

## 🧹 5단계: 캐시 클리어

### 5-1. Vercel 캐시 클리어

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Deployments** 탭
4. 최신 배포 옆 **...** 메뉴 → **Redeploy**
5. **Redeploy** 버튼 클릭

### 5-2. 브라우저 캐시 클리어

1. **F12** → **Application** 탭
2. **Service Workers** → 등록된 SW 옆 **Unregister** 클릭
3. **Storage** → **Clear site data** 클릭
4. 브라우저 Hard Refresh: **Ctrl + Shift + R** (Windows/Linux) 또는 **Cmd + Shift + R** (Mac)

### 5-3. 시크릿 모드 테스트

1. 브라우저 시크릿/프라이빗 모드 열기
   - Chrome: **Ctrl + Shift + N**
   - Firefox: **Ctrl + Shift + P**
   - Safari: **Cmd + Shift + N**
2. 배포된 URL 접속
3. Google 로그인 시도

---

## 🛠️ 6단계: 환경변수 확인

### 6-1. Vercel 환경변수 확인

1. [Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수가 모두 설정되어 있는지 확인:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### 6-2. authDomain 특별 확인

#### 잘못된 예
```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.vercel.app/login (경로 포함 X)
```

#### 올바른 예
```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```
또는
```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.vercel.app
```

### 6-3. 환경변수 수정 후

1. 변수 수정 후 **Save** 클릭
2. **Deployments** → **Redeploy** 필수 (환경변수는 배포 시에만 적용됨)

---

## 📋 문제 해결 체크리스트

배포 후 다음 체크리스트를 순서대로 확인하세요:

### ✅ 기본 설정
- [ ] Firebase Console → Authentication → Sign-in method에서 Google 로그인 활성화
- [ ] Firebase Console → Authentication → Authorized domains에 Vercel 도메인 추가
- [ ] Vercel 환경변수 모두 설정됨 (`NEXT_PUBLIC_FIREBASE_*`)

### ✅ 헤더 설정
- [ ] `vercel.json`에 COOP 헤더 설정 (`same-origin-allow-popups`)
- [ ] 브라우저 개발자 도구에서 COOP 헤더 확인

### ✅ 캐시 클리어
- [ ] Vercel Redeploy 실행
- [ ] 브라우저 캐시 삭제 (Hard Refresh)
- [ ] Service Worker Unregister
- [ ] 시크릿 모드 테스트

### ✅ 에러 확인
- [ ] 브라우저 콘솔에 에러 메시지 없음
- [ ] Network 탭에 403/401 에러 없음
- [ ] `lib/firebase.ts`의 authDomain 경고 없음

---

## 🚨 자주 발생하는 문제

### 1. "unauthorized-domain" 에러

**원인**: Firebase Console에 도메인 미등록

**해결**:
```bash
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Vercel URL 입력 (예: your-app.vercel.app)
```

### 2. COOP 헤더가 적용되지 않음

**원인**: Vercel CDN 캐싱 또는 잘못된 설정

**해결**:
```bash
1. vercel.json과 next.config.ts 양쪽에 COOP 설정
2. Vercel Dashboard → Deployments → Redeploy
3. 브라우저 Hard Refresh (Ctrl+Shift+R)
```

### 3. authDomain 불일치 경고

**콘솔 메시지**:
```
⚠️ Firebase authDomain 불일치 감지:
현재 도메인: your-app.vercel.app
authDomain: localhost
```

**해결**:
```bash
1. Vercel → Settings → Environment Variables
2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN을
   "your-project.firebaseapp.com"로 수정
3. Redeploy
```

### 4. 팝업이 열리지 않음

**원인**: 브라우저 팝업 차단

**해결**:
```bash
Chrome: 주소창 오른쪽 팝업 차단 아이콘 클릭 → 허용
Firefox: 설정 → 개인 정보 및 보안 → 팝업 차단 예외 추가
Safari: 설정 → 웹 사이트 → 팝업 윈도우 → 허용
```

---

## 📞 추가 도움

위 모든 단계를 시도했지만 여전히 문제가 해결되지 않는 경우:

1. **브라우저 콘솔** 스크린샷 (에러 메시지 전체)
2. **Network 탭** 스크린샷 (`accounts.google.com` 요청)
3. **Firebase Console → Authorized domains** 스크린샷
4. **Vercel 환경변수** 목록 (값은 숨기고 키만)

위 4가지 정보를 준비하여 문의하세요.

---

**마지막 업데이트**: 2025-10-12
