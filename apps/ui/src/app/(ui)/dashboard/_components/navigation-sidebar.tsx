import { FC, PropsWithChildren, ReactNode } from 'react';
import { Logo } from '@/app/(ui)/_components/logo';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Files, LifeBuoy } from 'lucide-react';
import { NavigationSidebarItem } from './navigation-sidebar-item';

export type NavigationSidebarListItem = {
  name: string;
  href: string;
  icon: ReactNode;
};

const secondaryNavItems: NavigationSidebarListItem[] = [
  { name: 'Documentation', href: 'https://primasense.io/docs', icon: <Files size="16" /> },
  { name: 'Support', href: 'https://primasense.io/support', icon: <LifeBuoy size="16" /> },
];

export const NavigationSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-full flex flex-col gap-12">
      <Link href="/dashboard">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="font-medium text-sm">Primasense</span>
        </div>
      </Link>

      {children}

      <div className="mt-auto">
        <NavigationSidebarItemList>
          {secondaryNavItems.map((item) => (
            <NavigationSidebarItem key={item.href} href={item.href}>
              {item.icon} {item.name}
            </NavigationSidebarItem>
          ))}
        </NavigationSidebarItemList>
      </div>

      <div className="bg-muted rounded-full p-3 pr-6">
        <UserButton afterSignOutUrl="/" showName appearance={{ elements: { userButtonBox: { flexDirection: 'row-reverse' } } }} />
      </div>
    </div>
  );
};

export const NavigationSidebarItemList: FC<PropsWithChildren> = ({ children }) => {
  return <div className="grid">{children}</div>;
};
