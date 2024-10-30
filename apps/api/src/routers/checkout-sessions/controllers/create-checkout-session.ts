import { RequestHandler } from 'express';
import { type Output, parse, string, object } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { stripe } from '../../../services/stripe.js';
import { env } from '../../../env.js';
import { CheckoutSessionsRouterQuerySchema, collectionIdQueryParam } from '../schema.js';

export const CreateCheckoutSessionQuerySchema = CheckoutSessionsRouterQuerySchema;
export const CreateCheckoutSessionBodySchema = object({ successUrl: string(), cancelUrl: string() });
export const CreateCheckoutSessionResponseSchema = object({ url: string() });

export type CreateCheckoutSessionQuery = Output<typeof CreateCheckoutSessionQuerySchema>;
export type CreateCheckoutSessionBody = Output<typeof CreateCheckoutSessionBodySchema>;
export type CreateCheckoutSessionResponse = Output<typeof CreateCheckoutSessionResponseSchema>;

export const createCheckoutSession: RequestHandler<{}, CreateCheckoutSessionResponse, CreateCheckoutSessionBody, CreateCheckoutSessionQuery> = async (req, res, next) => {
  try {
    console.log(req.params, req.body);
    const { [collectionIdQueryParam]: collectionId } = parse(CreateCheckoutSessionQuerySchema, req.query);
    if (!req.auth.permissions.find((permissions) => permissions.collection === collectionId)) throw new APIError('permission-denied', 'Permission denied.');

    const { successUrl, cancelUrl } = parse(CreateCheckoutSessionBodySchema, req.body);

    // TODO: Add proper types for user claims by extending JwtPayload in global scope
    const stripeCustomer = (req.auth.user.claims.public_metadata as any).stripeCustomer as string | undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: env.STRIPE_PRICE_ID }],
      success_url: `${successUrl}?session={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: collectionId,
      // This is used to prefill name, address and card info
      // Currently only the one that created the subscription, can manage it.
      // Hypothetically a user could transfer the subscription to another owner of the collection in the future.
      // Another way would be to make the collection itself the stripe customer.
      // Important to note is that credit card information would the be shared accross all collection owners
      customer: stripeCustomer,
    });

    const response = parse(CreateCheckoutSessionResponseSchema, { url: session.url });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
