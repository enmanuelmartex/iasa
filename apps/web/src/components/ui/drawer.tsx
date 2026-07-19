'use client';

// The project already uses Radix Dialog for its shadcn overlay primitives. This
// semantic Drawer facade keeps the accessible focus/Escape behavior and the
// controlled shadcn API while providing a right-side drawer.
export {
  Sheet as Drawer,
  SheetTrigger as DrawerTrigger,
  SheetClose as DrawerClose,
  SheetContent as DrawerContent,
  SheetHeader as DrawerHeader,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
} from './sheet';
