'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProviderWrapper({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}