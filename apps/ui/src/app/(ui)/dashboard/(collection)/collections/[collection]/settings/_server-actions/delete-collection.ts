'use server';

import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { deleteCollection as _deleteCollection } from '@/core/ressources/collection/actions/delete-collection';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const deleteCollection = async (collectionId: string) => {
  const auth = await createServerAuthContext();
  await _deleteCollection(auth, { collectionId });
  revalidatePath('/dashboard/collections');
  redirect('/dashboard/collections');
};
