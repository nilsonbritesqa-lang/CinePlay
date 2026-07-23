'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Bot, Megaphone, Settings,
  BarChart2, MessageCircle, Menu, X, LogOut, ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/posts',     icon: FileText,        label: 'Posts' },
  { href: '/admin/agentes',   icon: Bot,             label: 'Agentes IA' },
  { href: '/admin/ctas',      icon: Megaphone,       label: 'CTAs / Patrocinadores' },
  { href: '/admin/chatbot',   icon: MessageCircle,   label: 'Chatbot' },
  { href: '/admin/analytics', icon: BarChart2,       label: 'Analytics' },
  { href: '/admin/config',    icon: Settings,        label: 'Configurações' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside style={{
        width: collapsed ? 64 : 260,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: collapsed ? '16px 10px' : '20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: collapsed ? 14 : 10,
          flexShrink: 0,
        }}>
          {collapsed ? (
            <>
              <img
                src="/logo-cineplay.png"
                alt="CinePlay"
                style={{
                  height: 32,
                  width: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
              <button
                onClick={() => setCollapsed(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer',
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <Menu size={14} />
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                <img
                  src="/logo-cineplay.png"
                  alt="CinePlay"
                  style={{
                    height: 72,
                    width: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 2 }}>
                  Painel Administrativo
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer',
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', flexShrink: 0,
                  alignSelf: 'flex-start',
                }}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '10px' : '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                  color: isActive ? 'var(--brand-red)' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(229, 9, 20, 0.2)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 13,
                  transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)', fontSize: 13,
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <ExternalLink size={16} />
            {!collapsed && 'Ver Site'}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('cineplay_admin_token');
              document.cookie = 'cineplay_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              window.location.href = '/admin/login';
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: '#EF4444', fontSize: 13,
              background: 'none', border: 'none', cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%',
            }}
          >
            <LogOut size={16} />
            {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>
    </>
  );
}
