import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔒 Firebase Auth는 클라이언트 사이드 인증을 사용합니다
// - 토큰을 localStorage에 저장 (쿠키 사용 안 함)
// - Middleware는 서버 사이드에서 실행되므로 localStorage 접근 불가
// - 따라서 서버 사이드 쿠키 체크가 불가능
//
// ✅ 해결: 각 페이지에서 useAuth Hook으로 클라이언트 인증 체크
// - app/dashboard/page.tsx에서 useEffect로 로그인 체크
// - 로그인 안 되어 있으면 /login으로 리다이렉트

export async function middleware(_request: NextRequest) {
  // Middleware 비활성화: 모든 요청 통과
  // 인증 체크는 각 페이지의 useAuth에서 수행
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
