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
  {
    href: '/feedback',
    label: 'FEEDBACK',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#b8b455' : '#777'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-cmax-gray bg-cmax-darker/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16">
          {NAV_ITEMS.filter((item) => item.href !== '/feedback').map((item) => {
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

      {/* Desktop Sidebar Nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-64 border-r-2 border-cmax-gray bg-cmax-darker/95 backdrop-blur-sm flex-col">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-cmax-gray">
          <div className="font-heading font-black text-xs tracking-[0.3em] text-cmax-muted uppercase">
            CMAX
          </div>
          <div className="font-heading font-black text-xl tracking-tight text-white mt-0.5">
            REWARDS
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${
                  isActive
                    ? 'text-cmax-olive bg-cmax-olive-muted border-l-2 border-l-cmax-olive'
                    : 'text-cmax-muted hover:text-white hover:bg-cmax-dark'
                }`}
              >
                {item.icon(isActive)}
                <span className="font-heading text-xs font-bold tracking-[0.15em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cmax-gray">
          <div className="text-[10px] text-cmax-muted/50 font-mono">
            Climbmax Rock Gym
          </div>
        </div>
      </nav>
    </>
  );
}
