import { RequestHandler } from 'express';
import { type Output, parse } from 'valibot';
import { APIError } from '../../../middleware/error.js';
import { stripe } from '../../../services/stripe.js';
import { type Stripe } from 'stripe';
import { CheckoutSessionsRouterParamsSchema, checkoutSessionIdParam } from '../schema.js';

export const GetCheckoutSessionParamsSchema = CheckoutSessionsRouterParamsSchema;

export type GetCheckoutSessionParams = Output<typeof GetCheckoutSessionParamsSchema>;
export type GetCheckoutSessionResponse = Stripe.Response<Stripe.Checkout.Session>;

export const getCheckoutSession: RequestHandler<GetCheckoutSessionParams, GetCheckoutSessionResponse, {}, {}> = async (req, res, next) => {
  try {
    const { [checkoutSessionIdParam]: sessionId } = parse(GetCheckoutSessionParamsSchema, req.params);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!req.auth.permissions.find((permissions) => permissions.collection === session.client_reference_id)) throw new APIError('permission-denied', 'Permission denied.');
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};
