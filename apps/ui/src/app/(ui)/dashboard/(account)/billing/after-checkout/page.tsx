import { createServerAuthContext } from '@/app/(ui)/_utils/create-server-auth-context';
import { getCheckoutSession } from '@/core/ressources/checkout-session/actions/get-checkout-session';
import { ClerkPublicMetadata, ClerkPublicMetadataSchema } from '@/core/services/clerk';
import { safely } from '@/utils/safely';
import { clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

type AfterCheckoutPageProps = {
  searchParams: { session: string };
};

const AfterCheckoutPage: FC<AfterCheckoutPageProps> = async ({ searchParams }) => {
  const auth = await createServerAuthContext();

  if (!auth.user) {
    console.error('Not authenticated when trying to get stripe customer from checkout session.');
    redirect('/dashboard/billing');
  }

  const { data: subscription } = await safely(getCheckoutSession(auth, { sessionID: searchParams.session }));

  const metadata: ClerkPublicMetadata = { stripe_customer: subscription?.customer as string, stripe_subscription: subscription?.subscription as string };
  const parsedMetadata = ClerkPublicMetadataSchema.safeParse(metadata);

  if (!parsedMetadata.success) return 'Failed to process your purchase. Please contact us.';

  await clerkClient.users.updateUserMetadata(auth.user.id, { publicMetadata: parsedMetadata.data });
  redirect('/dashboard/billing');
};

export default AfterCheckoutPage;
