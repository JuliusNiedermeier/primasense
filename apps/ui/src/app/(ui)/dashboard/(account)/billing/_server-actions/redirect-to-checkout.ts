'use server';

import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { CoreActionConfig } from '@/core/core-action';
import { createCheckoutSession } from '@/core/ressources/checkout-session/actions/create-checkout-session';
import { safely } from '@/utils/safely';
import { redirect } from 'next/navigation';

export const redirectToCheckout = async (config: CoreActionConfig<typeof createCheckoutSession>) => {
  const auth = await createServerAuthContext();
  const checkoutSessionUrl = await safely(createCheckoutSession(auth, config));
  if (!checkoutSessionUrl.success || !checkoutSessionUrl.data) return false;
  redirect(checkoutSessionUrl.data);
};
