import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 경로 (인증 필요)
const protectedPaths = ['/dashboard'];

// 인증된 사용자가 접근하면 안 되는 경로 (로그인, 회원가입)
const authPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 인증 페이지인지 확인
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Firebase Auth 토큰 확인 (쿠키 또는 헤더)
  // Note: Firebase는 클라이언트 사이드 인증을 사용하므로
  // 미들웨어에서는 기본적인 체크만 수행
  // 실제 인증 확인은 클라이언트에서 useAuth로 처리

  // 보호된 경로 접근 시 체크 (서버 사이드에서는 기본 체크만)
  if (isProtectedPath) {
    // 클라이언트에서 인증 확인 필요
    // 여기서는 일단 통과시키고, 클라이언트에서 useEffect로 체크
    return NextResponse.next();
  }

  // 인증 페이지는 그대로 통과
  if (isAuthPath) {
    return NextResponse.next();
  }

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
