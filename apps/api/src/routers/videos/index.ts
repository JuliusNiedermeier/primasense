import { Router } from 'express';
import { getManyVideos } from './controllers/get-many-videos.js';
import { hybridAuth } from '../../middleware/auth.js';
import { defaultCollectionBasedRateLimiter } from '../../utils.js';
import { createOneVideo } from './controllers/create-one-video.js';
import { deleteOneVideo } from './controllers/delete-one-video.js';
import { getOneVideo } from './controllers/get-one-video.js';
import { updateOneVideo } from './controllers/update-one-video.js';
import fileUpload from 'express-fileupload';
import { videoIdParam } from './schema.js';

export const videosRouter: Router = Router();

videosRouter.use(hybridAuth);

videosRouter.post('/', defaultCollectionBasedRateLimiter, fileUpload(), createOneVideo);
videosRouter.get('/', defaultCollectionBasedRateLimiter, getManyVideos);
videosRouter.get(`/:${videoIdParam}`, defaultCollectionBasedRateLimiter, getOneVideo);
videosRouter.patch(`/:${videoIdParam}`, defaultCollectionBasedRateLimiter, updateOneVideo);
videosRouter.delete(`/:${videoIdParam}`, defaultCollectionBasedRateLimiter, deleteOneVideo);
