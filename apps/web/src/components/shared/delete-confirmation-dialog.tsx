'use client';

import * as React from 'react';
import { Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type DeleteConfirmationDialogProps = {
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Shown on the destructive button while the request is in flight. */
  deletingLabel?: string;
  isDeleting?: boolean;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
  onConfirm: () => void | Promise<unknown>;
};

export function DeleteConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  deletingLabel = 'Deleting...',
  isDeleting = false,
  open: controlledOpen,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  async function confirm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isDeleting) return;
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // The caller owns error reporting. Keeping the dialog open allows retrying.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isDeleting && setOpen(next)}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost" disabled={isDeleting}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isDeleting} aria-busy={isDeleting || undefined} onClick={confirm}>
            {isDeleting ? deletingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
