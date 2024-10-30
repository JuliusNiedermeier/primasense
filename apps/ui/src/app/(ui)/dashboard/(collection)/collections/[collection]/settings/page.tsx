import { Container } from '@/app/(ui)/_components/container';
import { FC } from 'react';
import { redirect } from 'next/navigation';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { safely } from '@/utils/safely';
import { getCollection } from '@/core/ressources/collection/actions/get-collection';
import { PageHeader, PageHeaderBreadcrumbsItem, PageHeaderSubtitle, PageHeaderTitle } from '@/app/(ui)/_components/page-title';
import { BaseCollectionBreadcrumbs } from '../_components/base-collection-breadcrumbs';
import { Button } from '@/app/(ui)/_components/ui/button';
import { Clipboard } from 'lucide-react';
import { RegenerateApiKeyButton } from './_components/regenerate-api-key-button';
import { DeleteCollectionButton } from './_components/delete-collection-button';

type VideosPageProps = { params: { collection: string } };

const pageTitle = 'Settings';

const VideosPage: FC<VideosPageProps> = async ({ params }) => {
  const auth = await createServerAuthContext();
  const { success, data: collection } = await safely(getCollection(auth, { id: params.collection }));

  // The second check should not be required. Collection keeps being possibly undefined. What is happening here?
  if (!success || !collection) return redirect('/dashboard/collections');

  return (
    <Container>
      <div className="flex gap-4 items-center justify-between mb-8">
        <PageHeader className="flex-1">
          <BaseCollectionBreadcrumbs collectionId={collection.id} collectionName={collection.name}>
            <PageHeaderBreadcrumbsItem>{pageTitle}</PageHeaderBreadcrumbsItem>
          </BaseCollectionBreadcrumbs>
          <PageHeaderTitle>{pageTitle}</PageHeaderTitle>
          <PageHeaderSubtitle>View and change settings for the currect collection</PageHeaderSubtitle>
        </PageHeader>
      </div>

      <div className="mb-12 p-8 rounded border">
        <h3 className="font-medium">API Key</h3>
        <span>This is your API key for this collection. You can invalidate this key anytime, by generating a new key.</span>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" className="font-mono flex-1 justify-between gap-4">
            {collection.apiKey}
            <span className="text-sm text-muted-foreground ml-auto">Copy API Key</span>
            <Clipboard size="16" />
          </Button>
          <RegenerateApiKeyButton collectionId={collection.id} />
        </div>
      </div>

      <div className="flex items-center justify-between p-8 rounded border border-destructive bg-destructive/10">
        <div>
          <h3 className="font-medium text-destructive">Delete this collection</h3>
          <span>Once you delete a collection, there is no going back. Please be certain.</span>
        </div>
        <DeleteCollectionButton collectionId={collection.id} />
      </div>
    </Container>
  );
};

export default VideosPage;
