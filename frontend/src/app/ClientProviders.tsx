'use client';

import { ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import CustomQueryClientProvider from '../shared/ui/custom-query-client-provider/CustomQueryClientProvider';
import { ToastProvider } from '../shared/ui/toast';
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CustomQueryClientProvider>
      <ToastProvider>
        <LazyMotion features={domAnimation}>{children}</LazyMotion>
      </ToastProvider>
    </CustomQueryClientProvider>
  );
}
