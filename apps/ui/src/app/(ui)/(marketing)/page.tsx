import { FC } from 'react';
import { Container } from '@/app/(ui)/_components/container';
import { Button } from '@/app/(ui)/_components/ui/button';
import Link from 'next/link';

const HomePage: FC = () => {
  return (
    <Container className="mt-24">
      <h1 className="text-6xl font-bold">
        Expressive <br />
        Video <br />
        Search
      </h1>

      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </Container>
  );
};

export default HomePage;
