import { z } from 'zod';

export const zodKeys = <T extends z.ZodRawShape>(schema: z.ZodObject<T>): { [K in keyof T]: K } => {
  const keyMap = new Map<keyof T, keyof T>();
  Object.keys(schema.shape).forEach((key) => keyMap.set(key, key));
  return Object.fromEntries(keyMap) as { [K in keyof T]: K };
};
