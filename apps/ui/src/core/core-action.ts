import { ZodSchema } from 'zod';
import { CoreActionError, createSafeCoreActionError } from './core-action-error';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './services/upstash-redis';
import { AuthContext } from './auth-context';

export type CoreActionConfig<A extends CoreAction<any, any>> = Parameters<A>[1];

export type CoreAction<Config extends {}, Result> = (auth: AuthContext, config: Config) => Promise<Result>;

type CreateCoreActionConfig<AConfig extends {}> = {
  actionID: string;
  configSchema: ZodSchema<AConfig>;
  rateLimitIdentifier: (actionArgs: { auth: AuthContext; config: AConfig }) => string | Promise<string>;
  requireUser?: boolean;
};

export const createCoreAction = <AConfig extends {}, AResult>(config: CreateCoreActionConfig<AConfig>, action: CoreAction<AConfig, AResult>) => {
  const rateLimiter = new Ratelimit({ redis, prefix: `carl:${config.actionID}`, limiter: Ratelimit.slidingWindow(60, '1m') });

  return async (auth: AuthContext, actionConfig: AConfig) => {
    try {
      // Require authenticated user
      if (config.requireUser && !auth.user) throw new CoreActionError('unauthenticated', `Action '${config.actionID}' must be called by an authenticated user`);

      // Validate configuration
      const actionConfigParseResult = config.configSchema.safeParse(actionConfig);
      if (!actionConfigParseResult.success) throw new CoreActionError('invalid-config', `Action '${config.actionID}' has been called with an invalid config`);

      // Rate limit
      const rateLimitIdentifier = await config.rateLimitIdentifier({ auth, config: actionConfig });
      const rateLimitResult = await rateLimiter.limit(rateLimitIdentifier);
      if (!rateLimitResult.success) throw new CoreActionError('too-many-calls', `Action '${config.actionID}' has been called too many times`);

      // Execute core action
      return await action(auth, actionConfig);
    } catch (error) {
      // Normalize errors
      throw createSafeCoreActionError(error);
    }
  };
};
