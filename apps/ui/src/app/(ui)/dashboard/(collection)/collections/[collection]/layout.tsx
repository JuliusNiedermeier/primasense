import { Layout, LayoutMain, LayoutSidebar } from '@/app/(ui)/dashboard/_components/layout';
import { FC, PropsWithChildren } from 'react';
import { CollectionNavigationSidebar } from './_components/collection-navigation-sidebar';
import { listCollections } from '@/core/ressources/collection/actions/list-collections';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';

const CollectionLayout: FC<PropsWithChildren> = async ({ children }) => {
  const auth = await createServerAuthContext();
  const collections = await listCollections(auth, {});

  const strippedCollections = collections ? collections.map(({ id, name }) => ({ id, name })) : [];

  return (
    <Layout>
      <LayoutSidebar>
        <CollectionNavigationSidebar collections={strippedCollections} />
      </LayoutSidebar>
      <LayoutMain>{children}</LayoutMain>
    </Layout>
  );
};

export default CollectionLayout;
