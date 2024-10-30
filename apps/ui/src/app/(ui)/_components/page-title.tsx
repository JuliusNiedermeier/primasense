import { Children, FC, HTMLAttributes, PropsWithChildren, forwardRef } from 'react';
import { cn } from '@/app/(ui)/_utils/cn';
import { SlashIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(({ children, className, ...restProps }, ref) => {
  return (
    <div ref={ref} className={cn('mb-16', className)} {...restProps}>
      {children}
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

interface PageHeaderBreadcrumbsProps extends HTMLAttributes<HTMLDivElement> {}

export const PageHeaderBreadcrumbs = forwardRef<HTMLDivElement, PageHeaderBreadcrumbsProps>(({ children, className, ...restProps }, ref) => {
  return (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...restProps}>
      {Children.toArray(children)
        .filter((child) => !!child)
        .map((child, index) => (
          <>
            {index !== 0 && <SlashIcon />} {child}
          </>
        ))}
    </div>
  );
});

PageHeaderBreadcrumbs.displayName = 'PageHeaderBreadcrumbs';

export const PageHeaderBreadcrumbsItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Button variant="link" className="gap-2 px-0">
      {children}
    </Button>
  );
};

PageHeaderBreadcrumbsItem.displayName = 'PageHeaderBreadcrumbsItem';

interface PageHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const PageHeaderTitle = forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(({ className, ...props }, ref) => {
  return <h1 className={cn('text-3xl font-medium mt-4', className)} {...props} ref={ref} />;
});

PageHeaderTitle.displayName = 'PageHeaderTitle';

export const PageHeaderSubtitle: FC<PropsWithChildren> = ({ children }) => {
  return <h3 className="text-muted-foreground">{children}</h3>;
};

PageHeaderSubtitle.displayName = 'PageHeaderSubtitle';
