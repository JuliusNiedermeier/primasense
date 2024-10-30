import { nanoid } from 'nanoid';

export const generateApiKey = () => `sk_${nanoid(40)}`;
