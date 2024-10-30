import { redirect } from 'next/navigation';

export const GET = (request: Request) => redirect(`${new URL(request.url).pathname}/dashboard`);
