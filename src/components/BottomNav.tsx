'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'HOME',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8b455' : '#777'} strokeWidth="2.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'BOARD',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8b455' : '#777'} strokeWidth="2.5">
        <rect x="3" y="12" width="5" height="9" />
        <rect x="9.5" y="4" width="5" height="17" />
        <rect x="16" y="8" width="5" height="13" />
      </svg>
    ),
  },
  {
    href: '/admin',
    label: 'ADMIN',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8b455' : '#777'} strokeWidth="2.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-cmax-gray bg-cmax-darker/95 backdrop-blur-sm">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                isActive ? 'text-cmax-olive' : 'text-cmax-muted'
              }`}
            >
              {item.icon(isActive)}
              <span className="font-heading text-[10px] font-bold tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
