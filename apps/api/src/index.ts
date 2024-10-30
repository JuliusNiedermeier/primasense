import express from 'express';
import cors from 'cors';
import { errorHandlerMiddleware } from './middleware/error.js';
import { collectionsRouter } from './routers/collections/index.js';
import { customerPortalSessionsRouter } from './routers/customer-portal-sessions/index.js';
import { videosRouter } from './routers/videos/index.js';
import { searchRouter } from './routers/search/index.js';
import { hybridAuth, jwtOnlyAuth } from './middleware/auth.js';
import { checkoutSessionsRouter } from './routers/checkout-sessions/index.js';

// TODO: Check if rate limiter at router level produces the correct rate limit identifier
// TODO: Check if it is beneficial to use fileUpload middleware globally
// app.use(fileUpload)

const app = express();

app.use(cors());
app.use(express.json());

// Internal endpoints
app.use('/collections', jwtOnlyAuth, collectionsRouter);
app.use('/checkout-sessions', jwtOnlyAuth, checkoutSessionsRouter);
app.use('/customer-portal-sessions', jwtOnlyAuth, customerPortalSessionsRouter);

// Public endpoints
app.use('/videos', hybridAuth, videosRouter);
app.use('/search', hybridAuth, searchRouter);

app.use(errorHandlerMiddleware);

const port = 4000;

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
