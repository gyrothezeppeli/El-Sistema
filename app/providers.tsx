// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const preserveOriginalTheme = pathname === '/dashboard/instrumentos' || pathname?.startsWith('/partituras/');

  return (
    <SessionProvider>
      <div className={preserveOriginalTheme ? undefined : 'warm-glass-theme'}>
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </SessionProvider>
  );
}