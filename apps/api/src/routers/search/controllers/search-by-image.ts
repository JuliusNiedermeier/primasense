import { RequestHandler } from 'express';

export const searchByImage: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send('Not implemented. Search a collection with an image');
  } catch (error) {
    next(error);
  }
};
