import {
    Close,
    Content,
    Description,
    Overlay,
    Portal,
    Root,
    Title,
    Trigger,
} from "@radix-ui/react-dialog";
import { forwardRef, Fragment } from "react";

import { cn } from "../utils";
import type {
    DialogCloseProps,
    DialogComponent,
    DialogContentProps,
    DialogDescriptionProps,
    DialogFooterProps,
    DialogHeaderProps,
    DialogOverlayProps,
    DialogPortalProps,
    DialogTitleProps,
    DialogTriggerProps,
} from "./types";

export const Dialog = Root as DialogComponent;

const DialogTrigger = Trigger as DialogTriggerProps;

const DialogPortal = Portal as DialogPortalProps;

const DialogClose = Close as DialogCloseProps;

const DialogOverlay: DialogOverlayProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Overlay
      {...props}
      ref={ref}
      className={cn(
        "fixed z-50 inset-0 bg-black/25 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
    />
  ),
);
DialogOverlay.displayName = Overlay.displayName;

const DialogContent: DialogContentProps = forwardRef(
  (
    {
      annotations,
      className,
      children,
      icon,
      scrollable,
      maxWidth,
      dialogOverlayClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <DialogPortal>
        {scrollable ? (
          <Fragment>
            <DialogOverlay
              className={cn(
                "grid place-items-center overflow-y-auto",
                dialogOverlayClassName,
              )}
            >
              <Content
                {...props}
                ref={ref}
                className={cn(
                  !scrollable &&
                    "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  "outline-none focus:outline-none duration-200",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                  "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                  !scrollable &&
                    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                )}
              >
                <div
                  className={cn(
                    `w-full ${
                      maxWidth ?? "max-w-xl"
                    } flex items-start gap-6 p-6 bg-white rounded-lg shadow-xl`,
                    className,
                  )}
                >
                  {icon && <div className="flex-shrink-0">{icon}</div>}
                  <div className="flex-1 flex flex-col gap-6">{children}</div>
                </div>
              </Content>
            </DialogOverlay>
            {annotations}
          </Fragment>
        ) : (
          <Fragment>
            <DialogOverlay />
            <Content
              {...props}
              ref={ref}
              className={cn(
                !scrollable &&
                  "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "outline-none focus:outline-none duration-200",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                !scrollable &&
                  "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
              )}
            >
              <div
                className={cn(
                  `w-full ${
                    maxWidth ?? "max-w-xl"
                  } flex items-start gap-6 p-6 bg-white rounded-lg shadow-xl`,
                  className,
                )}
              >
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <div className="flex-1 flex flex-col gap-6">{children}</div>
              </div>
            </Content>
          </Fragment>
        )}
      </DialogPortal>
    );
  },
);
DialogContent.displayName = Content.displayName;

const DialogHeader: DialogHeaderProps = ({ className, ...props }) => (
  <div
    {...props}
    className={cn("flex flex-col gap-1", className)}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter: DialogFooterProps = ({ className, ...props }) => (
  <div
    {...props}
    className={cn("flex items-center justify-end gap-3", className)}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle: DialogTitleProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Title
      {...props}
      ref={ref}
      className={cn("text-neutral-default text-md font-bold", className)}
    />
  ),
);
DialogTitle.displayName = Title.displayName;

const DialogDescription: DialogDescriptionProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Description
      {...props}
      ref={ref}
      className={cn("text-xs text-neutral-tertiary", className)}
    />
  ),
);
DialogDescription.displayName = Description.displayName;

Dialog.Close = DialogClose;
Dialog.Content = DialogContent;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Trigger = DialogTrigger;
