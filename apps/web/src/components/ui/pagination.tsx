import * as React from 'react';
import { IconChevronLeft, IconChevronRight, IconDots } from '@tabler/icons-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li {...props} />;
}

type PaginationLinkProps = React.ComponentProps<'button'> & {
  isActive?: boolean;
};

function PaginationLink({ className, isActive, type = 'button', ...props }: PaginationLinkProps) {
  return (
    <button
      type={type}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'icon' }),
        'size-9 shadow-none',
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label="Go to previous page"
      className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'h-9 gap-1 px-2.5 shadow-none', className)}
      {...props}
    >
      <IconChevronLeft />
      <span>{children ?? 'Previous'}</span>
    </button>
  );
}

function PaginationNext({ className, children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label="Go to next page"
      className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'h-9 gap-1 px-2.5 shadow-none', className)}
      {...props}
    >
      <span>{children ?? 'Next'}</span>
      <IconChevronRight />
    </button>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden="true" className={cn('flex size-9 items-center justify-center', className)} {...props}>
      <IconDots className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
