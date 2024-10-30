'use client';

import { QueryClientProvider as QCP, QueryClient } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient();

export const QueryClientProvider: FC<PropsWithChildren> = (props) => <QCP client={queryClient}>{props.children}</QCP>;
