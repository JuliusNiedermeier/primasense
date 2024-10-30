import { CoreActionError, CoreActionErrorCode } from '@/core/core-action-error';

export type RouteErrorCode = 'not-found' | 'unauthenticated' | 'access-denied' | 'invalid-arguments' | 'too-many-requests' | 'internal';

const statusCodeMap: Record<RouteErrorCode, number> = {
  'not-found': 404,
  unauthenticated: 401,
  'access-denied': 403,
  'invalid-arguments': 400,
  'too-many-requests': 429,
  internal: 500,
};

const coreActionToRouteErrorCodeMap: Record<CoreActionErrorCode, RouteErrorCode> = {
  unauthenticated: 'unauthenticated',
  'permission-denied': 'access-denied',
  'invalid-config': 'invalid-arguments',
  'too-many-calls': 'too-many-requests',
  'not-found': 'not-found',
  unknown: 'internal',
  internal: 'internal',
};

export class RouteError extends Error {
  constructor(code: RouteErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.status = statusCodeMap[code];
  }

  status: number;
  code: RouteErrorCode;
}

const createErrorResponse = ({ status, code, message }: RouteError) => {
  return Response.json({ status, code, message }, { status });
};

export const createSafeRouteError = (error: unknown, fallbackMessage?: string) => {
  if (error instanceof RouteError) return error;
  if (error instanceof CoreActionError) return new RouteError(coreActionToRouteErrorCodeMap[error.code], error.message);
  return new RouteError('internal', fallbackMessage);
};

type RouteHandler<Params = {}> = (request: Request, params: Params) => Response | Promise<Response>;

export const withRouteErrorHandling = <Params = {}>(routeHandler: RouteHandler<Params>): RouteHandler<Params> => {
  return async (request, params) => {
    try {
      return await routeHandler(request, params);
    } catch (error) {
      const routeError = createSafeRouteError(error, 'Internal server error');
      console.error(error);
      return createErrorResponse(routeError);
    }
  };
};
