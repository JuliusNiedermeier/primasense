import { RequestHandler } from 'express';
import { APIError } from '../../../middleware/error.js';

export const getOneVideo: RequestHandler = (request, response, next) => {
  next(new APIError('unimplemented', 'Retrieving a single video is not implemented yet.'));
};
