'use client';

import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { createCollection } from './_server-actions/create-collection';
import { Container } from '@/app/(ui)/_components/container';
import { PageHeader, PageHeaderBreadcrumbs, PageHeaderBreadcrumbsItem, PageHeaderSubtitle, PageHeaderTitle } from '@/app/(ui)/_components/page-title';
import { CollectionsBreadcrumb } from '@/app/(ui)/dashboard/(collection)/collections/[collection]/_components/collections-breadcrumb';
import { Button } from '@/app/(ui)/_components/ui/button';
import { Loader2 } from 'lucide-react';

const NewCollectionPage: FC = () => {
  const [value, setValue] = useState('');

  const mutation = useMutation({ mutationFn: async ({ name }: { name: string }) => createCollection({ name }) });

  return (
    <Container>
      <PageHeader className="flex-1">
        <PageHeaderBreadcrumbs>
          <CollectionsBreadcrumb />
          <PageHeaderBreadcrumbsItem>New</PageHeaderBreadcrumbsItem>
        </PageHeaderBreadcrumbs>
        <PageHeaderTitle>New Collection</PageHeaderTitle>
        <PageHeaderSubtitle>Create a new Collection</PageHeaderSubtitle>
      </PageHeader>

      <div className="mt-24">
        <input
          className="px-0 py-4 border-b text-6xl font-bold outline-none focus:border-foreground"
          placeholder="My new collection..."
          autoFocus
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
        />
        <Button className="block mt-8" onClick={() => mutation.mutate({ name: value })}>
          {mutation.isLoading ? <Loader2 className="animate-spin mr-2" size="16" /> : 'Create collection'}
        </Button>
      </div>
    </Container>
  );
};

export default NewCollectionPage;
