'use server';

import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { CoreActionConfig } from '@/core/core-action';
import { createUserPortalUrl } from '@/core/ressources/user-portal/actions/create-user-portal-url';
import { safely } from '@/utils/safely';
import { redirect } from 'next/navigation';

export const redirectToUserPortal = async (config: CoreActionConfig<typeof createUserPortalUrl>) => {
  const auth = await createServerAuthContext();
  const url = await safely(createUserPortalUrl(auth, config));
  if (!url.success || !url.data) return null;
  redirect(url.data);
};
