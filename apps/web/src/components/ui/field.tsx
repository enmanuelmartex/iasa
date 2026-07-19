import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.ComponentPropsWithoutRef<'fieldset'>>(
  ({ className, ...props }, ref) => <fieldset ref={ref} className={cn('space-y-5', className)} {...props} />,
);
FieldSet.displayName = 'FieldSet';

const FieldLegend = React.forwardRef<HTMLLegendElement, React.ComponentPropsWithoutRef<'legend'>>(
  ({ className, ...props }, ref) => <legend ref={ref} className={cn('text-base font-semibold text-foreground', className)} {...props} />,
);
FieldLegend.displayName = 'FieldLegend';

const FieldGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('grid gap-5', className)} {...props} />,
);
FieldGroup.displayName = 'FieldGroup';

const Field = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('group/field grid gap-2 data-[invalid=true]:text-destructive', className)} {...props} />
  ),
);
Field.displayName = 'Field';

const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => <Label ref={ref} className={cn('text-sm font-medium text-foreground group-data-[invalid=true]/field:text-destructive', className)} {...props} />,
);
FieldLabel.displayName = 'FieldLabel';

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-xs leading-relaxed text-muted-foreground', className)} {...props} />,
);
FieldDescription.displayName = 'FieldDescription';

type FieldErrorItem = { message?: unknown } | string | undefined;
function FieldError({ className, errors, children, ...props }: React.ComponentPropsWithoutRef<'div'> & { errors?: FieldErrorItem[] }) {
  const messages = errors?.map((item) => typeof item === 'string' ? item : item?.message).filter((item): item is string => typeof item === 'string' && Boolean(item));
  const content = children ?? (messages?.length ? messages.join(', ') : null);
  if (!content) return null;
  return <div role="alert" className={cn('text-xs font-medium text-destructive', className)} {...props}>{content}</div>;
}

function FieldSeparator({ className, children, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('relative py-1', className)} {...props}>{children ? <><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">{children}</span></> : <Separator />}</div>;
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet };
