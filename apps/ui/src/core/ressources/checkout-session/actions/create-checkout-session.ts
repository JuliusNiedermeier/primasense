import { CoreActionError } from '@/core/core-action-error';
import { z } from 'zod';
import { stripe } from '@/core/services/stripe';
import { env } from '@/env';
import { ClerkPublicMetadataSchema } from '@/core/services/clerk';
import { createCoreAction } from '@/core/core-action';

const configSchema = z.object({ successUrl: z.string().url(), cancelUrl: z.string().url() });

export const createCheckoutSession = createCoreAction(
  {
    actionID: 'create-checkout-session',
    configSchema,
    rateLimitIdentifier: ({ auth }) => auth.user?.id || '',
    requireUser: true,
  },
  async (auth, config) => {
    if (!auth.user) throw new CoreActionError('permission-denied', 'This action can only be called by a user');
    const parsedPublicUserMetadata = ClerkPublicMetadataSchema.safeParse(auth.user.publicMetadata);
    if (!parsedPublicUserMetadata.success) throw new CoreActionError('internal', 'Misconfigured clerk public metadata detected.');

    const successUrl = new URL(config.successUrl);
    successUrl.searchParams.set('session', '{CHECKOUT_SESSION_ID}');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: env.STRIPE_METERED_PRICE_ID }],
      success_url: successUrl.href,
      cancel_url: config.cancelUrl,
      client_reference_id: auth.user.id,
      customer: parsedPublicUserMetadata.data.stripe_customer,
    });

    return session.url;
  },
);
