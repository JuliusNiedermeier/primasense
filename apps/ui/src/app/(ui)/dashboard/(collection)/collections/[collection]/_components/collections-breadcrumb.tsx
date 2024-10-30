import { PageHeaderBreadcrumbsItem } from '@/app/(ui)/_components/page-title';
import { Group } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

export const CollectionsBreadcrumb: FC = () => {
  return (
    <Link href="/dashboard/collections">
      <PageHeaderBreadcrumbsItem>
        <Group size="16" />
        Collections
      </PageHeaderBreadcrumbsItem>
    </Link>
  );
};
