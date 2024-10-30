import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from './_components/query-client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Primasense',
  description: 'Expressive Video Search',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
