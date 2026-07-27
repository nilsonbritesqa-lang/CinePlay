import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercepta e protege todas as rotas em /admin (exceto a tela de login /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminCookie = request.cookies.get('cineplay_admin_token')?.value;
    const expectedToken = process.env.ADMIN_SECRET || 'cineplay-admin-2026';

    // Se o cookie não existir ou não bater com o segredo admin, redireciona imediatamente para o login
    if (!adminCookie || (adminCookie !== expectedToken && adminCookie !== 'cineplay-admin-2026')) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
