'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FloatingFeedbackInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true';

  // Hide on the feedback page itself
  if (pathname === '/feedback') return null;

  const href = isEmbedded ? '/feedback?embedded=true' : '/feedback';

  return (
    <Link
      href={href}
      className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-cmax-olive flex items-center justify-center hover:bg-cmax-olive-light active:scale-95 transition-all lg:hidden"
      aria-label="Send feedback"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </Link>
  );
}

export default function FloatingFeedback() {
  return (
    <Suspense fallback={null}>
      <FloatingFeedbackInner />
    </Suspense>
  );
}
