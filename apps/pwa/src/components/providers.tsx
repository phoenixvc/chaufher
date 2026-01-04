'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProviderWithContext } from '@chaufher/ui';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWithContext duration={5000}>
        {children}
      </ToastProviderWithContext>
    </QueryClientProvider>
  );
}
