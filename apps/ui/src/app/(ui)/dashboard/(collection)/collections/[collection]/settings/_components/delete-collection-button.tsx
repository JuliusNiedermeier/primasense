'use client';

import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger } from '@/app/(ui)/_components/ui/dialog';
import { Button } from '@/app/(ui)/_components/ui/button';
import { deleteCollection } from '../_server-actions/delete-collection';

type DeleteCollectionButtonProps = {
  collectionId: string;
};

export const DeleteCollectionButton: FC<DeleteCollectionButtonProps> = ({ collectionId }) => {
  const deleteCollectionMutation = useMutation({ mutationFn: async () => deleteCollection(collectionId) });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete this collection</Button>
      </DialogTrigger>
      <DialogContent>
        <span className="font-medium">Do you really want to delete this collection?</span>
        <span className="text-sm text-muted-foreground">This action cannot be undone. All videos currently in this collection will be lost.</span>
        <Button variant="destructive" className="gap-2" onClick={() => deleteCollectionMutation.mutate()}>
          {deleteCollectionMutation.isLoading && <Loader2 className="animate-spin" size={20} />}
          Yes, delete this collection
        </Button>
      </DialogContent>
    </Dialog>
  );
};
