import { RequestHandler } from 'express';
import { APIError } from '../../../middleware/error.js';

export const updateOneVideo: RequestHandler = (request, response, next) => {
  next(new APIError('unimplemented', 'Updating a single video is not implemented yet.'));
};
