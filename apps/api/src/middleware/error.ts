import { ErrorRequestHandler } from 'express';

type ErrorStatus =
  | 'unimplemented'
  | 'unauthenticated'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'too-many-requests'
  | 'internal';

interface ErrorWireFormat {
  code: number;
  status: ErrorStatus;
  message: string;
}

const statusCodeMap: Record<ErrorStatus, number> = {
  unimplemented: 501,
  unauthenticated: 401,
  'permission-denied': 403,
  'not-found': 404,
  'already-exists': 409,
  'invalid-argument': 400,
  'deadline-exceeded': 500,
  'too-many-requests': 429,
  internal: 500,
};

export class APIError extends Error {
  constructor(status: ErrorStatus, message: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.code = statusCodeMap[status];
  }

  status: ErrorStatus;
  code: number;

  toJSON(): ErrorWireFormat {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
    };
  }
}

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Error) console.error(`${err.name}: ${err.message}`);
  if (err instanceof APIError) return res.status(err.code).json(err.toJSON());
  const internalError = new APIError('internal', 'Internal server error');
  return res.status(internalError.code).json(internalError.toJSON());
};
