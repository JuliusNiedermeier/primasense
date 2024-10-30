import { CoreActionError } from '@/core/core-action-error';
import { z } from 'zod';
import { stripe } from '@/core/services/stripe';
import { ClerkPublicMetadataSchema } from '@/core/services/clerk';
import { createCoreAction } from '@/core/core-action';

const configSchema = z.object({ returnUrl: z.string().url() });

export const createUserPortalUrl = createCoreAction(
  { actionID: 'create-user-portal-url', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!auth.user) throw new CoreActionError('permission-denied', 'This action can only be called by a user');
    const parsedPublicUserMetadata = ClerkPublicMetadataSchema.safeParse(auth.user.publicMetadata);
    if (!parsedPublicUserMetadata.success) throw new CoreActionError('internal', 'Misconfigured clerk public metadata detected.');

    if (!parsedPublicUserMetadata.data.stripe_customer) return null;

    const portal = await stripe.billingPortal.sessions.create({
      customer: parsedPublicUserMetadata.data.stripe_customer,
      return_url: config.returnUrl,
    });

    return portal.url;
  },
);
