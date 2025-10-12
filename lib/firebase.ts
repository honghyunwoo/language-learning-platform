// Firebase 초기화 및 서비스 인스턴스 설정
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Storage는 결제 필요로 인해 비활성화
// import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase 설정 타입
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 환경변수 검증 함수
const validateFirebaseConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    const errorMessage = `Firebase 설정 오류: 다음 환경변수가 누락되었습니다: ${missingFields.join(', ')}\n\n.env.local 파일에 다음 변수들을 설정해주세요:\n${missingFields.map(field => `NEXT_PUBLIC_FIREBASE_${field.toUpperCase().replace(/([A-Z])/g, '_$1').slice(1)}`).join('\n')}`;

    if (typeof window !== 'undefined') {
      // 클라이언트에서만 콘솔 에러 출력
      console.error(errorMessage);
      throw new Error('Firebase 환경변수 설정이 필요합니다. 브라우저 콘솔을 확인하세요.');
    } else {
      // 서버에서는 즉시 에러 발생
      throw new Error(errorMessage);
    }
  }

  // ✅ authDomain 검증 및 경고 (프로덕션 배포 시)
  if (typeof window !== 'undefined' && config.authDomain) {
    const currentHost = window.location.host;
    const authHost = config.authDomain.replace(/^https?:\/\//, '');

    if (currentHost !== authHost && !authHost.includes('firebaseapp.com')) {
      console.warn(`
⚠️  Firebase authDomain 불일치 감지:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
현재 도메인: ${currentHost}
authDomain:  ${authHost}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Google 로그인이 작동하지 않을 수 있습니다!

✅ 해결 방법:
1. Firebase Console → Authentication → Settings → Authorized domains
   "${currentHost}"를 추가하세요.

2. 또는 .env.local의 NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN을
   "${currentHost}"로 변경하세요.
      `);
    }
  }
};

// 환경변수에서 Firebase 설정 가져오기
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// 환경변수 검증 실행
validateFirebaseConfig(firebaseConfig);

// Firebase 앱 초기화 (중복 초기화 방지)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firebase 서비스 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);
// Storage는 결제 필요로 인해 비활성화
// export { auth, db, storage };
export default app;
