import { Container } from '@/app/(ui)/_components/container';
import { FC } from 'react';
import { redirect } from 'next/navigation';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { safely } from '@/utils/safely';
import { getCollection } from '@/core/ressources/collection/actions/get-collection';
import { PageHeader, PageHeaderBreadcrumbsItem, PageHeaderSubtitle, PageHeaderTitle } from '@/app/(ui)/_components/page-title';
import { BaseCollectionBreadcrumbs } from '@/app/(ui)/dashboard/(collection)/collections/[collection]/_components/base-collection-breadcrumbs';
import { VideoList } from './_components/video-list';
import { VideoUploadDropzone } from './_components/video-upload-dropzone';
import { VideoUploadManager } from './_components/video-upload-manager';

type VideosPageProps = { params: { collection: string } };

const pageTitle = 'Videos';

const VideosPage: FC<VideosPageProps> = async ({ params }) => {
  const auth = await createServerAuthContext();
  const { success, data: collection } = await safely(getCollection(auth, { id: params.collection }));

  // The second check should not be required. Collection keeps being possibly undefined. What is happening here?
  if (!success || !collection) return redirect('/dashboard/collections');

  return (
    <>
      <Container className="min-h-full">
        <div className="flex gap-4 items-center justify-between mb-8">
          <PageHeader className="flex-1">
            <BaseCollectionBreadcrumbs collectionId={collection.id} collectionName={collection.name}>
              <PageHeaderBreadcrumbsItem>{pageTitle}</PageHeaderBreadcrumbsItem>
            </BaseCollectionBreadcrumbs>
            <PageHeaderTitle>{pageTitle}</PageHeaderTitle>
            <PageHeaderSubtitle>View all indexed videos</PageHeaderSubtitle>
          </PageHeader>
        </div>

        <VideoUploadDropzone collectionID={params.collection}>
          <VideoList collectionId={params.collection} />
        </VideoUploadDropzone>
      </Container>
      <Container className="sticky bottom-8 flex justify-end">
        <VideoUploadManager />
      </Container>
    </>
  );
};

export default VideosPage;
