import { Router } from 'express';
import { hybridAuth } from '../../middleware/auth.js';
import { defaultCollectionBasedRateLimiter } from '../../utils.js';
import { searchByText } from './controllers/search-by-text.js';
import { searchByImage } from './controllers/search-by-image.js';

export const searchRouter: Router = Router();

searchRouter.use(hybridAuth);

searchRouter.get('/text', defaultCollectionBasedRateLimiter, searchByText);
searchRouter.post('/image', defaultCollectionBasedRateLimiter, searchByImage);
