'use client';

import { NavigationSidebar, NavigationSidebarItemList, NavigationSidebarListItem } from '@/app/(ui)/dashboard/_components/navigation-sidebar';
import { NavigationSidebarItem } from '@/app/(ui)/dashboard/_components/navigation-sidebar-item';
import { Button } from '@/app/(ui)/_components/ui/button';
import { ArrowLeft, Film, LayoutDashboard, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ComponentProps, FC } from 'react';
import { CollectionSwitcher } from './collection-switcher';

type CollectionNavigationSidebarProps = {
  collections: ComponentProps<typeof CollectionSwitcher>['collections'];
};

export const CollectionNavigationSidebar: FC<CollectionNavigationSidebarProps> = ({ collections }) => {
  const { collection } = useParams();

  const collectionsPath = '/dashboard/collections';

  const withBasePath = (path: string) => `${collectionsPath}/${collection}${path}`;

  const navItems: NavigationSidebarListItem[] = [
    { name: 'Dashboard', href: withBasePath('/dashboard'), icon: <LayoutDashboard size="16" /> },
    { name: 'Videos', href: withBasePath('/videos'), icon: <Film size="16" /> },
    { name: 'Search', href: withBasePath('/search'), icon: <Search size="16" /> },
    { name: 'Settings', href: withBasePath('/settings'), icon: <Settings size="16" /> },
  ];

  return (
    <NavigationSidebar>
      <NavigationSidebarItemList>
        <Button variant="link" className="gap-2 justify-start text-muted-foreground mb-4" asChild>
          <Link href={collectionsPath}>
            <ArrowLeft size="16" />
            Collections
          </Link>
        </Button>

        <div className="mb-8">
          <CollectionSwitcher collections={collections} />
        </div>

        {navItems.map((item) => (
          <NavigationSidebarItem key={item.href} href={item.href}>
            {item.icon} {item.name}
          </NavigationSidebarItem>
        ))}
      </NavigationSidebarItemList>
    </NavigationSidebar>
  );
};
