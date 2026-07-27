'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // A página de login não é bloqueada pelo guard
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    function checkAuth() {
      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return undefined;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };

      const tokenCookie = getCookie('cineplay_admin_token');
      const tokenLocal = typeof window !== 'undefined' ? localStorage.getItem('cineplay_admin_token') : null;

      if ((tokenCookie && tokenCookie.length > 0) || (tokenLocal && tokenLocal.length > 0)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.replace('/admin/login');
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#07070D', color: '#A0A0B5', fontSize: 14,
        fontFamily: 'Outfit, sans-serif'
      }}>
        🔒 Autenticando sessão administrativa...
      </div>
    );
  }

  return <>{children}</>;
}
