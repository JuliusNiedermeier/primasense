import type { AuthRequestProp } from './middleware/auth.ts';

declare global {
  namespace Express {
    interface Request extends AuthRequestProp {}
  }
}
