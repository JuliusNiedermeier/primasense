import Link from 'next/link';
import { FC } from 'react';
import { CollectionList } from './_components/collection-list';
import { Container } from '@/app/(ui)/_components/container';
import { PageHeader, PageHeaderBreadcrumbs, PageHeaderTitle } from '@/app/(ui)/_components/page-title';
import { Button } from '@/app/(ui)/_components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CollectionsBreadcrumb } from '@/app/(ui)/dashboard/(collection)/collections/[collection]/_components/collections-breadcrumb';

const CollectionsPage: FC = () => {
  return (
    <>
      <Container>
        <div className="flex items-center justify-between mb-8">
          <PageHeader>
            <PageHeaderBreadcrumbs>
              <CollectionsBreadcrumb />
            </PageHeaderBreadcrumbs>
            <PageHeaderTitle>Collections</PageHeaderTitle>
          </PageHeader>
          <Button className="mt-4 gap-4" asChild>
            <Link href="/dashboard/collections/new">
              <PlusIcon size="16" />
              Add collection
            </Link>
          </Button>
        </div>

        <CollectionList />
      </Container>
    </>
  );
};

export default CollectionsPage;
