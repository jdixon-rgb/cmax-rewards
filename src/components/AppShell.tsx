'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import DevicePreview from './DevicePreview';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true';

  if (!isEmbedded) {
    return <DevicePreview />;
  }

  return <>{children}</>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}
