import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@cineplay.com.br';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'cineplay2026!';

    if (email === expectedEmail && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso!',
        token: process.env.ADMIN_SECRET || 'cineplay-admin-2026'
      });

      // Define cookie de sessão por 7 dias
      response.cookies.set('cineplay_admin_token', process.env.ADMIN_SECRET || 'cineplay-admin-2026', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos. Verifique suas credenciais.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar login.' },
      { status: 500 }
    );
  }
}
