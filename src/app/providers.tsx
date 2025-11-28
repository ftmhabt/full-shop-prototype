'use client';
import { ThemeProvider as NextProvider } from 'next-themes';

export function Providers({ 
  children, 
  savedTheme 
}: { 
  children: React.ReactNode;
  savedTheme?: string | null;
}) {
  return (
    <NextProvider
      attribute="class"
      defaultTheme={savedTheme || 'system'}
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      {children}
    </NextProvider>
  );
}