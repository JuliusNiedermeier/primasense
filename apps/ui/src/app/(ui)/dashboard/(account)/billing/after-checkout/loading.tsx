import { Loader2 } from 'lucide-react';
import { FC } from 'react';

const AfterCheckoutLoadingPage: FC = async () => {
  return (
    <div className="grid h-screen place-content-center">
      <div className="flex gap-4 items-center">
        <Loader2 className="animate-spin" size="16" />
        <span>Finalizing your subscription</span>
      </div>
    </div>
  );
};

export default AfterCheckoutLoadingPage;
