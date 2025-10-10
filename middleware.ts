import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 경로 (인증 필요)
const protectedPaths = ['/dashboard'];

// 인증된 사용자가 접근하면 안 되는 경로 (로그인, 회원가입)
const authPaths = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 인증 페이지인지 확인
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // 보호된 경로 접근 시 세션 확인
  if (isProtectedPath) {
    const sessionToken = request.cookies.get('session')?.value;

    // 세션 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Firebase Admin SDK로 토큰 검증
    // 현재는 토큰 존재만 확인 (클라이언트에서 추가 검증)
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
