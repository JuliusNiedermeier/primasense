import { PageHeaderBreadcrumbs, PageHeaderBreadcrumbsItem } from '@/app/(ui)/_components/page-title';
import { FC, PropsWithChildren } from 'react';
import { CollectionsBreadcrumb } from './collections-breadcrumb';
import Link from 'next/link';

export const BaseCollectionBreadcrumbs: FC<PropsWithChildren<{ collectionId: string; collectionName: string }>> = ({ children, collectionId, collectionName }) => {
  return (
    <PageHeaderBreadcrumbs>
      <CollectionsBreadcrumb />

      <Link href={`/dashboard/collections/${collectionId}/dashboard`}>
        <PageHeaderBreadcrumbsItem>{collectionName}</PageHeaderBreadcrumbsItem>
      </Link>

      {children}
    </PageHeaderBreadcrumbs>
  );
};
