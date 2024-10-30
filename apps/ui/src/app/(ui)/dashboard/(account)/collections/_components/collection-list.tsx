import { FC, Suspense } from 'react';
import { listCollections } from '@/core/ressources/collection/actions/list-collections';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import Link from 'next/link';
import { Button } from '@/app/(ui)/_components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Skeleton } from '@/app/(ui)/_components/ui/skeleton';

const gridClassName = 'grid gap-4';

export const CollectionList: FC = () => {
  return (
    <Suspense
      fallback={
        <div className={gridClassName}>
          {Array.from(new Array(3)).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      }
    >
      <_CollectionList />
    </Suspense>
  );
};

export const _CollectionList: FC = async () => {
  const auth = await createServerAuthContext();
  const collections = await listCollections(auth, {});

  if (!collections?.length)
    return (
      <div className="mt-24">
        <span className="text-purple-400">{"You haven't created a collection yet."}</span>
        <h1 className="font-medium text-6xl mt-2">{"Let's get started"}</h1>
        <div className="rounded border p-8 bg-muted mt-8">
          <h3 className="font-medium">What is a collection</h3>
          <p className="text-muted-foreground">
            A collection stores searchable videos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi esse qui deleniti ducimus quisquam omnis corporis possimus fuga
            pariatur, id est quis mollitia ab voluptatem odit nobis quos sint maiores?
          </p>
          <Button className="mt-4 gap-4" asChild>
            <Link href="/dashboard/collections/new">
              <PlusIcon size="16" />
              Create a collection
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className={gridClassName}>
      {collections.map((collection) => (
        <Link key={collection.id} href={`/dashboard/collections/${collection.id}`} className="rounded border p-4">
          <span className="font-medium">{collection.name}</span>
        </Link>
      ))}
    </div>
  );
};
