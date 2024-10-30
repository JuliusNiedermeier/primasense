import { Layout, LayoutMain, LayoutSidebar } from '@/app/(ui)/dashboard/_components/layout';
import { NavigationSidebar, NavigationSidebarItemList, NavigationSidebarListItem } from '@/app/(ui)/dashboard/_components/navigation-sidebar';
import { NavigationSidebarItem } from '@/app/(ui)/dashboard/_components/navigation-sidebar-item';
import { CreditCard, Group } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

const AccountLayout: FC<PropsWithChildren> = ({ children }) => {
  const navItems: NavigationSidebarListItem[] = [
    { name: 'Collections', href: '/dashboard/collections', icon: <Group size="16" /> },
    { name: 'Billing', href: '/dashboard/billing', icon: <CreditCard size="16" /> },
  ];

  return (
    <Layout>
      <LayoutSidebar>
        <NavigationSidebar>
          <NavigationSidebarItemList>
            {navItems.map((item) => (
              <NavigationSidebarItem key={item.href} href={item.href}>
                {item.icon} {item.name}
              </NavigationSidebarItem>
            ))}
          </NavigationSidebarItemList>
        </NavigationSidebar>
      </LayoutSidebar>
      <LayoutMain>{children}</LayoutMain>
    </Layout>
  );
};

export default AccountLayout;
