import { Router } from 'express';
import { defaultUserBasedRateLimiter } from '../../utils.js';
import { createCustomerPortalSession } from './controllers/create-customer-portal-session.js';

export const customerPortalSessionsRouter: Router = Router();

customerPortalSessionsRouter.post('/', defaultUserBasedRateLimiter, createCustomerPortalSession);
