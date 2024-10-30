import { createCoreAction } from '@/core/core-action';
import { CoreActionError } from '@/core/core-action-error';
import { stripe } from '@/core/services/stripe';
import { z } from 'zod';

const configSchema = z.object({ sessionID: z.string() });

export const getCheckoutSession = createCoreAction(
  { actionID: 'get-checkout-session', configSchema, requireUser: true, rateLimitIdentifier: ({ auth }) => auth.user?.id || '' },
  async (auth, config) => {
    if (!auth.user) throw new CoreActionError('permission-denied', 'This action can only be called by a user');
    const session = await stripe.checkout.sessions.retrieve(config.sessionID);
    if (auth.user.id !== session.client_reference_id) throw new CoreActionError('permission-denied', 'Permission denied.');
    return session;
  },
);
