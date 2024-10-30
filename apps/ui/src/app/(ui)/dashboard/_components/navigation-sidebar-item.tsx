'use client';

import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { Button } from '@/app/(ui)/_components/ui/button';
import Link from 'next/link';
import { cn } from '@/app/(ui)/_utils/cn';

type NavigationSidebarItemProps = {
  href: string;
};

export const NavigationSidebarItem: FC<PropsWithChildren<NavigationSidebarItemProps>> = ({ children, href }) => {
  const path = usePathname();

  return (
    <Button variant="link" asChild className={cn('gap-2 justify-start text-muted-foreground', { 'bg-muted text-foreground': path.startsWith(href) })}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};
