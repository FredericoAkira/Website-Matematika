import { cva } from "class-variance-authority";

export const toastVariants = cva(
  "group relative w-full flex items-start justify-between gap-2 p-3 outline-none shadow-[0px_3px_10px_0px_rgba(0,0,0,0.10)] pointer-events-auto overflow-hidden rounded-lg transition-all ease-out duration-200 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-default",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
