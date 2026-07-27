import type { Metadata } from 'next';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export const metadata: Metadata = {
  title: 'Painel Admin — CinePlay',
  description: 'Painel de administração CinePlay',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>
        {children}
      </div>
    </AdminAuthGuard>
  );
}
