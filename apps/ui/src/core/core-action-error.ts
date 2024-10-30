export type CoreActionErrorCode = 'unauthenticated' | 'invalid-config' | 'permission-denied' | 'not-found' | 'too-many-calls' | 'internal' | 'unknown';

export class CoreActionError extends Error {
  constructor(code: CoreActionErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
  }

  code: CoreActionErrorCode;
}

export const createSafeCoreActionError = (error: unknown, fallbackMessage?: string) => {
  if (error instanceof CoreActionError) return error;
  if (error instanceof Error) return new CoreActionError('unknown', error.message, { cause: error.cause });
  return new CoreActionError('unknown', fallbackMessage);
};

export const withCoreActionErrorHandling = <A extends any[], R>(action: (...args: A) => R, fallbackMessage?: string): ((...args: A) => R) => {
  return (...args: A) => {
    try {
      return action(...args);
    } catch (error) {
      throw createSafeCoreActionError(error, fallbackMessage);
    }
  };
};

// In the future a makeError function would be nice.
// Such a function would produce an error, throw it (or not if prevented) and send a log event to a centralid´zed logger.
// This way the error is not only reported if specificly stated in the catch block
