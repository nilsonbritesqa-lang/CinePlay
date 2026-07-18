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
          padding: collapsed ? '20px 14px' : '20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
          flexShrink: 0,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Image src="/logo-cineplay.jpeg" alt="CinePlay" width={32} height={32} style={{ borderRadius: 6, objectFit: 'cover' }} />
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>CinePlay</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>ADMIN PANEL</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
              width: 30, height: 30, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', flexShrink: 0,
            }}
          >
            {collapsed ? <Menu size={14} /> : <X size={14} />}
          </button>
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
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)', fontSize: 13,
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
