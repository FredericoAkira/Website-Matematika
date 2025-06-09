import {
  Action,
  Close,
  Description,
  Provider,
  Root,
  Title,
  Viewport,
} from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { ElementRef, forwardRef } from "react";


import { cn } from "../utils";
import type {
  ToastActionProps,
  ToastCloseProps,
  ToastComponent,
  ToastDescriptionProps,
  ToastProps,
  ToastTitleProps,
  ToastViewportProps,
} from "./types";
import { toastVariants } from "./variants";


const ToastProvider = Provider;

const ToastViewport: ToastViewportProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Viewport
      {...props}
      ref={ref}
      className={cn(
        "fixed top-0 right-0 z-[100] flex flex-col-reverse max-h-screen w-full max-w-sm p-4 focus:outline-none",
        className,
      )}
    />
  ),
);
ToastViewport.displayName = Viewport.displayName;

const ToastAction: ToastActionProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Action
      {...props}
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-slate-100/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-slate-50 group-[.destructive]:focus:ring-red-500 dark:border-slate-800 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:focus:ring-slate-300 dark:group-[.destructive]:border-slate-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-slate-50 dark:group-[.destructive]:focus:ring-red-900",
        className,
      )}
    />
  ),
);
ToastAction.displayName = Action.displayName;

const ToastClose: ToastCloseProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Close
      {...props}
      ref={ref}
      className={cn(
        "rounded-md p-1 text-neutral-default",
        "border border-transparent focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
        className,
      )}
    >
      <XIcon className="h-5 w-5" />
    </Close>
  ),
);
ToastClose.displayName = Close.displayName;

const ToastTitle: ToastTitleProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Title
      {...props}
      ref={ref}
      className={cn("text-xs font-bold text-red-500", className)}
    />
  ),
);
ToastTitle.displayName = Title.displayName;

const ToastDescription: ToastDescriptionProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Description
      {...props}
      ref={ref}
      className={cn("text-xs text-red-400", className)}
    />
  ),
);
ToastDescription.displayName = Description.displayName;

export const Toast = forwardRef<ElementRef<typeof Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Root
        {...props}
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
      />
    );
  },
) as ToastComponent;
Toast.displayName = Root.displayName;

Toast.Action = ToastAction;
Toast.Close = ToastClose;
Toast.Description = ToastDescription;
Toast.Provider = ToastProvider;
Toast.Title = ToastTitle;
Toast.Viewport = ToastViewport;
