import { Router } from 'express';
import { defaultCollectionBasedRateLimiter } from '../../utils.js';
import { createCheckoutSession } from './controllers/create-checkout-session.js';
import { getCheckoutSession } from './controllers/get-checkout-session.js';
import { checkoutSessionIdParam } from './schema.js';

export const checkoutSessionsRouter: Router = Router();

checkoutSessionsRouter.post('/', defaultCollectionBasedRateLimiter, createCheckoutSession);
checkoutSessionsRouter.get(`/:${checkoutSessionIdParam}`, defaultCollectionBasedRateLimiter, getCheckoutSession);
