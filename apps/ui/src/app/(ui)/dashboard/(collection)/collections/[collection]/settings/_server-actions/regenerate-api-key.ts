'use server';

import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { regenerateApiKey as _regenerateApiKey } from '@/core/ressources/collection/actions/regenerate-api-key';
import { safely } from '@/utils/safely';
import { revalidatePath } from 'next/cache';

export const regenerateApiKey = async (collectionId: string) => {
  const auth = await createServerAuthContext();
  const { success } = await safely(_regenerateApiKey(auth, { collectionId }));
  if (!success) return false;
  revalidatePath(`/dashboard/collections/${collectionId}/settings`, 'page');
};
