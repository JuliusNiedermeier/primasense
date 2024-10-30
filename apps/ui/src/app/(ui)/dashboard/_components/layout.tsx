import { FC, PropsWithChildren } from 'react';
import { Container } from '@/app/(ui)/_components/container';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <Container className="flex gap-36">{children}</Container>;
};

export const LayoutSidebar: FC<PropsWithChildren> = ({ children }) => {
  return <aside className="h-screen sticky top-0 pt-10 pb-8">{children}</aside>;
};

export const LayoutMain: FC<PropsWithChildren> = ({ children }) => {
  return <main className="flex-1 py-8 min-h-screen">{children}</main>;
};
