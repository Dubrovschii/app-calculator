'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type CustomQueryClientProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const CustomQueryClientProvider: FC<CustomQueryClientProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default CustomQueryClientProvider;
