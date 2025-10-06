# 🚀 배포 가이드 (한국어 상세 설명)

**난이도**: ⭐☆☆☆☆ (매우 쉬움)
**소요 시간**: 약 30분
**비용**: 무료

---

## 📌 목차

1. [GitHub에 코드 업로드](#1단계-github에-코드-업로드) (10분)
2. [Vercel로 배포](#2단계-vercel로-배포) (5분)
3. [Firebase 설정](#3단계-firebase-설정) (15분)
4. [최종 테스트](#4단계-최종-테스트) (5분)

---

## 🎯 1단계: GitHub에 코드 업로드

### **1-1. GitHub 저장소 생성**

#### **방법 A: GitHub 웹사이트에서 (쉬움)**

1. **GitHub 로그인**
   - https://github.com 접속
   - 로그인 (계정 없으면 가입)

2. **새 저장소 만들기**
   - 오른쪽 상단 `+` 클릭
   - `New repository` 클릭

3. **저장소 설정**
   ```
   Repository name: language-learning-platform
   Description: 영어 학습 플랫폼
   Public ✅ (공개) 또는 Private (비공개 - 무료)

   ❌ Add a README file (체크 해제!)
   ❌ Add .gitignore (체크 해제!)
   ❌ Choose a license (선택 안 함!)
   ```

4. **Create repository 클릭**

---

### **1-2. 코드 업로드**

#### **터미널 열기**
- Windows: `cmd` 또는 `PowerShell`
- 프로젝트 폴더로 이동

```bash
cd "c:\Users\hynoo\OneDrive\바탕 화면\공부하기\language-learning-platform"
```

#### **Git 설정 (처음 한 번만)**

```bash
# Git 사용자 이름 설정
git config --global user.name "여러분의이름"

# Git 이메일 설정 (GitHub 이메일과 동일하게!)
git config --global user.email "여러분의이메일@example.com"
```

#### **코드 업로드 명령어**

```bash
# 1. Git 초기화 (이미 되어있으면 Skip)
git init

# 2. 모든 파일 추가
git add .

# 3. 커밋 생성
git commit -m "Initial commit: Language Learning Platform"

# 4. 메인 브랜치 이름 설정
git branch -M main

# 5. GitHub 저장소 연결 (⚠️ 여러분의 GitHub 주소로 변경!)
git remote add origin https://github.com/여러분의username/language-learning-platform.git

# 6. 업로드!
git push -u origin main
```

**⚠️ 주의**: 5번 명령어의 `여러분의username`을 본인의 GitHub 사용자명으로 바꾸세요!

**예시**:
```bash
git remote add origin https://github.com/john123/language-learning-platform.git
```

---

### **1-3. 업로드 확인**

1. GitHub 저장소 페이지 새로고침
2. 모든 파일이 보이면 성공! ✅

---

## 🚀 2단계: Vercel로 배포

### **2-1. Vercel 계정 생성**

1. **Vercel 접속**
   - https://vercel.com 접속
   - `Sign Up` 클릭

2. **GitHub으로 가입** (강력 추천!)
   - `Continue with GitHub` 클릭
   - GitHub 연동 승인

---

### **2-2. 프로젝트 배포**

1. **Vercel 대시보드**
   - 로그인 후 `Add New...` 클릭
   - `Project` 선택

2. **GitHub 저장소 Import**
   - `Import Git Repository` 섹션에서
   - `language-learning-platform` 저장소 찾기
   - `Import` 클릭

3. **프로젝트 설정**
   ```
   Project Name: language-learning-platform (그대로 둠)
   Framework Preset: Next.js (자동 감지됨)
   Root Directory: ./ (그대로 둠)
   ```

4. **환경 변수 설정 (중요!)**

   `Environment Variables` 섹션 펼치기

   **⚠️ 아래 변수들을 하나씩 추가하세요:**

   ```
   이름: NEXT_PUBLIC_FIREBASE_API_KEY
   값: (Firebase 콘솔에서 복사 - 3단계에서 확인)

   이름: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   값: (Firebase 콘솔에서 복사)

   이름: NEXT_PUBLIC_FIREBASE_PROJECT_ID
   값: (Firebase 콘솔에서 복사)

   이름: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   값: (Firebase 콘솔에서 복사)

   이름: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   값: (Firebase 콘솔에서 복사)

   이름: NEXT_PUBLIC_FIREBASE_APP_ID
   값: (Firebase 콘솔에서 복사)
   ```

   **📌 팁**: Firebase 설정값은 3단계에서 확인할 수 있습니다.
   일단 환경 변수는 비워두고 나중에 추가해도 됩니다!

5. **Deploy 클릭!**
   - 빌드 시작 (약 2-3분 소요)
   - ✅ 성공하면 축하 메시지 표시
   - 🎉 배포 완료!

---

### **2-3. 배포 URL 확인**

배포 완료 후 나타나는 URL 예시:
```
https://language-learning-platform-abc123.vercel.app
```

**이 URL이 여러분의 서비스 주소입니다!** 🎉

---

## 🔥 3단계: Firebase 설정

### **3-1. Firebase 프로젝트 생성**

1. **Firebase 콘솔 접속**
   - https://console.firebase.google.com
   - Google 계정으로 로그인

2. **프로젝트 추가**
   - `프로젝트 추가` 클릭
   - 프로젝트 이름: `language-learning-platform` (또는 원하는 이름)
   - `계속` 클릭

3. **Google Analytics 설정**
   - `이 프로젝트에 Google Analytics 사용 설정` 체크 (선택사항)
   - `프로젝트 만들기` 클릭
   - 완료 대기 (약 30초)

---

### **3-2. Firebase 웹 앱 추가**

1. **앱 추가**
   - Firebase 콘솔에서 `</> 웹` 아이콘 클릭
   - 앱 닉네임: `Language Learning Platform`
   - ✅ `Firebase Hosting도 설정합니다` 체크
   - `앱 등록` 클릭

2. **Firebase SDK 구성 복사**

   아래와 같은 설정이 표시됩니다:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "language-learning-xxxx.firebaseapp.com",
     projectId: "language-learning-xxxx",
     storageBucket: "language-learning-xxxx.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

   **📋 이 값들을 메모장에 복사해두세요!**

3. **콘솔로 이동** 클릭

---

### **3-3. Firebase Authentication 설정**

1. **좌측 메뉴에서 `Authentication` 클릭**
2. **`시작하기` 클릭**
3. **로그인 제공업체 설정**

   **이메일/비밀번호 활성화:**
   - `이메일/비밀번호` 클릭
   - `사용 설정` 토글 켜기
   - `저장` 클릭

   **Google 로그인 활성화:**
   - `Google` 클릭
   - `사용 설정` 토글 켜기
   - 프로젝트 지원 이메일 선택
   - `저장` 클릭

---

### **3-4. Firestore Database 설정**

1. **좌측 메뉴에서 `Firestore Database` 클릭**
2. **`데이터베이스 만들기` 클릭**

3. **보안 규칙 선택**
   - `프로덕션 모드에서 시작` 선택 (보안 규칙 적용)
   - `다음` 클릭

4. **위치 선택**
   - `asia-northeast3 (Seoul)` 선택 (한국 서버)
   - `사용 설정` 클릭
   - 완료 대기 (약 1분)

---

### **3-5. Firestore 보안 규칙 적용**

1. **`규칙` 탭 클릭**

2. **아래 규칙을 복사해서 붙여넣기:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 헬퍼 함수
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // 사용자 프로필
    match /users/{userId} {
      allow read: if true;
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false;
    }

    // 사용자 진행 상황
    match /userProgress/{progressId} {
      allow read, write: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
    }

    // 학습 일지
    match /journals/{journalId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isOwner(resource.data.userId);
    }

    // 알림
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);
      allow update: if isOwner(resource.data.userId);
      allow create, delete: if false;
    }

    // 게시글
    match /posts/{postId} {
      allow read: if resource.data.isPublished == true ||
        isOwner(resource.data.authorId);
      allow create: if isAuthenticated() &&
        request.resource.data.authorId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.authorId);
    }

    // 댓글
    match /comments/{commentId} {
      allow read: if true;
      allow create: if isAuthenticated() &&
        request.resource.data.authorId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.authorId);
    }

    // 팔로우 관계
    match /follows/{followId} {
      allow read: if true;
      allow create, delete: if isAuthenticated() &&
        request.resource.data.followerId == request.auth.uid;
    }
  }
}
```

3. **`게시` 클릭**

---

### **3-6. Vercel에 환경 변수 추가**

이제 Firebase 설정값을 Vercel에 추가합니다!

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - `language-learning-platform` 클릭

3. **Settings 탭 클릭**

4. **Environment Variables 메뉴 클릭**

5. **환경 변수 추가 (하나씩!)**

   ```
   Name: NEXT_PUBLIC_FIREBASE_API_KEY
   Value: (Firebase에서 복사한 apiKey 값)
   ✅ Production, Preview, Development 모두 체크
   [Add] 클릭
   ```

   **아래 항목들도 동일하게 추가:**
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

6. **재배포**
   - 상단의 `Deployments` 탭 클릭
   - 최신 배포 항목의 `...` 메뉴 클릭
   - `Redeploy` 클릭
   - `Redeploy` 확인

---

## ✅ 4단계: 최종 테스트

### **4-1. 배포된 사이트 접속**

1. Vercel에서 제공한 URL 접속
   ```
   https://language-learning-platform-abc123.vercel.app
   ```

2. 페이지가 정상적으로 로드되는지 확인

---

### **4-2. 회원가입 테스트**

1. **회원가입 페이지 이동**
   - `/signup` 접속

2. **테스트 계정 생성**
   ```
   이메일: test@example.com
   비밀번호: test123456
   닉네임: 테스터
   레벨: A1
   학습 목표: 취미
   학습 시간: 30분
   ```

3. **회원가입 완료 확인**
   - 대시보드로 리다이렉트 되는지
   - 프로필 정보가 표시되는지

---

### **4-3. Google 로그인 테스트**

1. **로그인 페이지 이동**
   - `/login` 접속

2. **Google로 로그인 클릭**

3. **Google 계정 선택**

4. **로그인 성공 확인**
   - 대시보드 접속
   - Google 프로필 사진 표시

---

### **4-4. Activity 테스트**

1. **커리큘럼 메뉴 클릭**

2. **A1 레벨 → Week 1 → Listening 클릭**

3. **Activity 로드 확인**
   - 오디오 재생 버튼 작동
   - 문제 표시
   - 타이머 작동

4. **완료 버튼 클릭**

5. **진행률 업데이트 확인**
   - 대시보드에서 진행률 증가 확인

---

## 🎉 배포 완료!

축하합니다! 이제 누구나 접속할 수 있는 영어 학습 플랫폼이 완성되었습니다!

---

## 🌐 도메인 연결 (선택사항)

### **커스텀 도메인 사용하려면?**

**예**: `mylearningplatform.com`

1. **도메인 구매**
   - Namecheap, GoDaddy, Cloudflare 등에서 구매

2. **Vercel에서 도메인 추가**
   - 프로젝트 Settings → Domains
   - `Add` 클릭
   - 도메인 입력 후 추가

3. **DNS 설정**
   - 도메인 제공업체에서 DNS 설정
   - Vercel이 제공하는 레코드 추가

4. **완료!**
   - 약 10분~1시간 후 도메인으로 접속 가능

---

## 🔧 자주 묻는 질문 (FAQ)

### **Q1. 배포 후 사이트가 안 열려요**
**A**: 환경 변수를 확인하세요!
- Vercel Settings → Environment Variables
- 모든 Firebase 설정값이 올바른지 확인
- 재배포 (Redeploy)

### **Q2. 로그인이 안 돼요**
**A**: Firebase Authentication 설정 확인
- Firebase 콘솔 → Authentication
- 이메일/비밀번호, Google 로그인 활성화 확인

### **Q3. 데이터가 저장이 안 돼요**
**A**: Firestore 보안 규칙 확인
- Firebase 콘솔 → Firestore Database → 규칙
- 위에서 제공한 규칙이 적용되었는지 확인

### **Q4. 배포 비용이 나오나요?**
**A**: 무료입니다! (단, 사용량 제한 있음)
- Vercel: 월 100GB 대역폭 무료
- Firebase: 무료 플랜 (Spark) 충분
- 사용자 많아지면 업그레이드 필요

### **Q5. 코드 수정하면 자동으로 배포되나요?**
**A**: 네! GitHub에 Push하면 자동 배포됩니다.
```bash
git add .
git commit -m "수정 내용"
git push
```

---

## 📞 도움이 필요하시면?

- Firebase 문서: https://firebase.google.com/docs
- Vercel 문서: https://vercel.com/docs
- Next.js 문서: https://nextjs.org/docs

---

**배포 성공을 기원합니다!** 🚀🎉
