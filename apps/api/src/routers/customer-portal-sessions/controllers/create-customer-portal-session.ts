import { RequestHandler } from 'express';
import { type Output, parse, string, object } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { stripe } from '../../../services/stripe.js';

export const CreateCustomerPortalSessionBodySchema = object({ returnUrl: string() });
export const CreateCustomerPortalSessionResponseSchema = object({ url: string() });

export type CreateCustomerPortalSessionBody = Output<typeof CreateCustomerPortalSessionBodySchema>;
export type CreateCustomerPortalSessionResponse = Output<typeof CreateCustomerPortalSessionResponseSchema>;

export const createCustomerPortalSession: RequestHandler<{}, CreateCustomerPortalSessionResponse, CreateCustomerPortalSessionBody, {}> = async (req, res, next) => {
  try {
    const { returnUrl } = parse(CreateCustomerPortalSessionBodySchema, req.body);

    // TODO: Add proper typing for user claims by extending JwtPayload in the gloabl scope
    const stripeCustomer = (req.auth.user.claims.public_metadata as any).stripeCustomer as string | undefined;

    if (!stripeCustomer) throw new APIError('permission-denied', 'The requesting user is not a stripe customer yet.');

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer,
      return_url: returnUrl,
    });

    const response = parse(CreateCustomerPortalSessionResponseSchema, { url: session.url });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
