'use client';

import { useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserLevel, LearningGoal, DailyLearningTime } from '@/types/user';

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  level: UserLevel;
  learningGoal: LearningGoal;
  dailyLearningTime: DailyLearningTime;
}

export interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase 인증 상태 구독
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user && db) {
        // Firestore에서 사용자 프로필 가져오기
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          }
        } catch (err) {
          console.error('사용자 프로필 로드 실패:', err);
          setError('사용자 정보를 불러오는데 실패했습니다.');
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 이메일/비밀번호 회원가입
  const signUp = async (data: SignUpData): Promise<void> => {
    if (!auth || !db) {
      setError('Firebase가 초기화되지 않았습니다.');
      throw new Error('Firebase not initialized');
    }

    try {
      setError(null);
      setLoading(true);

      // Firebase Authentication 계정 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 프로필 업데이트 (displayName)
      await updateProfile(userCredential.user, {
        displayName: data.nickname,
      });

      // Firestore에 사용자 문서 생성
      const today = new Date().toISOString().split('T')[0];
      const newUser: User = {
        uid: userCredential.user.uid,
        email: data.email,
        nickname: data.nickname,
        level: data.level,
        learningGoal: data.learningGoal,
        dailyLearningTime: data.dailyLearningTime,
        profilePictureUrl: null,
        bio: '',
        createdAt: new Date().toISOString(),
        currentWeek: `${data.level}-W1`,
        streak: 0,
        lastLearningDate: today,
        totalLearningTime: 0,
        badges: [],
        followerCount: 0,
        followingCount: 0,
        settings: {
          emailNotifications: true,
          theme: 'auto',
          textSize: 'medium',
          profilePublic: true,
        },
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setCurrentUser(newUser);
    } catch (err: any) {
      console.error('회원가입 실패:', err);

      // Firebase 에러 메시지를 한국어로 변환
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (err.code === 'auth/weak-password') {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('올바른 이메일 형식이 아닙니다.');
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 이메일/비밀번호 로그인
  const signIn = async (data: SignInData): Promise<void> => {
    if (!auth) {
      setError('Firebase가 초기화되지 않았습니다.');
      throw new Error('Firebase not initialized');
    }

    try {
      setError(null);
      setLoading(true);

      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      console.error('로그인 실패:', err);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('올바른 이메일 형식이 아닙니다.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google 로그인
  const signInWithGoogle = async (): Promise<void> => {
    if (!auth || !db) {
      setError('Firebase가 초기화되지 않았습니다.');
      throw new Error('Firebase not initialized');
    }

    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Firestore에 사용자 문서가 없으면 생성 (최초 로그인 시)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));

      if (!userDoc.exists()) {
        // 신규 사용자: 전체 프로필 생성
        const today = new Date().toISOString().split('T')[0];
        const newUser: User = {
          uid: result.user.uid,
          email: result.user.email || '',
          nickname: result.user.displayName || '사용자',
          level: 'A1', // 기본값
          learningGoal: 'hobby', // 기본값
          dailyLearningTime: 30, // 기본값
          profilePictureUrl: result.user.photoURL,
          bio: '',
          createdAt: new Date().toISOString(),
          currentWeek: 'A1-W1',
          streak: 0,
          lastLearningDate: today,
          totalLearningTime: 0,
          badges: [],
          followerCount: 0,
          followingCount: 0,
          settings: {
            emailNotifications: true,
            theme: 'auto',
            textSize: 'medium',
            profilePublic: true,
          },
        };

        await setDoc(doc(db, 'users', result.user.uid), newUser);
        setCurrentUser(newUser);
      } else {
        // 기존 사용자: 프로필 사진이 없으면 Google 사진으로 업데이트
        const existingUser = userDoc.data() as User;

        if (!existingUser.profilePictureUrl && result.user.photoURL) {
          await updateDoc(doc(db, 'users', result.user.uid), {
            profilePictureUrl: result.user.photoURL,
          });

          // 로컬 상태도 업데이트
          setCurrentUser({
            ...existingUser,
            profilePictureUrl: result.user.photoURL,
          });
        }
      }
    } catch (err: any) {
      console.error('Google 로그인 실패:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 팝업이 닫혔습니다.');
      } else {
        setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    if (!auth) {
      return;
    }

    try {
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('로그아웃 실패:', err);
      setError('로그아웃에 실패했습니다.');
      throw err;
    }
  };

  return {
    currentUser,
    firebaseUser,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    isAuthenticated: !!currentUser,
  };
};
