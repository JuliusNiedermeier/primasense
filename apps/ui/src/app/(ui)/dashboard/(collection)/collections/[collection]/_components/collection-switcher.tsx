'use client';

import { Badge } from '@/app/(ui)/_components/ui/badge';
import { Button } from '@/app/(ui)/_components/ui/button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/app/(ui)/_components/ui/select';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';
import Link from 'next/link';

type CollectionSwitcherProps = {
  collections: { name: string; id: string }[];
};

export const CollectionSwitcher: FC<CollectionSwitcherProps> = ({ collections }) => {
  const { collection } = useParams();
  const { push } = useRouter();

  // The collection param should never be an array
  if (Array.isArray(collection)) return null;

  return (
    <Select value={collection} onValueChange={(value) => push(`/dashboard/collections/${value}/dashboard`)}>
      <SelectTrigger className="border-none bg-muted font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {collections.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            <div className="flex items-center text-left gap-2 mr-4">
              <Badge className="w-20 justify-center">Premium</Badge>
              <span className="w-32 whitespace-nowrap overflow-hidden text-ellipsis">{collection.name}</span>
            </div>
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button variant="ghost" className="w-full gap-4 justify-start" asChild>
          <Link href="/dashboard/collections/new">
            <Plus size="16" />
            New collection
          </Link>
        </Button>
      </SelectContent>
    </Select>
  );
};
