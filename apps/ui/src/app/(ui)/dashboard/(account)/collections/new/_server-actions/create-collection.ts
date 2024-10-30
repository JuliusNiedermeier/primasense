'use server';

import { createCollection as _createCollection } from '@/core/ressources/collection/actions/create-collection';
import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { safely } from '@/utils/safely';
import { CoreActionConfig } from '@/core/core-action';

export const createCollection = async (config: CoreActionConfig<typeof _createCollection>) => {
  const auth = await createServerAuthContext();
  const { success, data: collection, error } = await safely(_createCollection(auth, config));

  if (!success) {
    // Needs better error handling.
    // What should be returned?
    // How do I set the status code of a server action?
    // How should errors be returned from server actions?
    console.error(error);
    return;
  }

  revalidatePath('/dashboard/collections');
  redirect(`/dashboard/collections/${collection.id}`);
};
