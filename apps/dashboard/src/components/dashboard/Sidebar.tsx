'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { label: 'Overview', href: '', icon: '🏠' },
  { label: 'Moderation', href: '/moderation', icon: '🛡️' },
  { label: 'AntiNuke', href: '/antinuke', icon: '⚛️' },
  { label: 'AutoMod', href: '/automod', icon: '🤖' },
  { label: 'Welcome', href: '/welcome', icon: '👋' },
  { label: 'Permissions', href: '/permissions', icon: '🔐' },
  { label: 'Backup', href: '/backup', icon: '💾' },
  { label: 'Logs', href: '/logs', icon: '📋' },
];

export function Sidebar({ guildId }: { guildId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${guildId}`;

  return (
    <aside className="w-56 bg-surface-raised border-r border-surface-border flex-shrink-0 py-4">
      <nav className="space-y-1 px-2">
        {NAV.map(({ label, href, icon }) => {
          const full = `${base}${href}`;
          const active = pathname === full;
          return (
            <Link
              key={href}
              href={full}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand text-white'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-surface-border'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
