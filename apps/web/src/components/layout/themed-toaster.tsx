'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: '!bg-card !border-border !text-foreground shadow-lg',
          description: '!text-muted-foreground',
        },
      }}
    />
  );
}
