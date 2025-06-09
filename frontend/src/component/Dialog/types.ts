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
import type {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    HTMLAttributes,
    JSX,
    ReactNode,
    RefAttributes,
} from "react";
  
  export type DialogCloseProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Close> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  export type DialogContentProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Content> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement> & {
        annotations?: ReactNode;
        scrollable?: boolean;
        icon?: ReactNode;
        maxWidth?: string;
        dialogOverlayClassName?: string;
      }
  >;
  
  export type DialogDescriptionProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Description> &
        RefAttributes<HTMLParagraphElement>,
      "ref"
    > &
      RefAttributes<HTMLParagraphElement>
  >;
  
  export type DialogFooterProps = {
    ({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element;
    displayName: string;
  };
  
  export type DialogHeaderProps = {
    ({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element;
    displayName: string;
  };
  
  export type DialogOverlayProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Overlay> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type DialogPortalProps = ForwardRefExoticComponent<
    ComponentPropsWithoutRef<typeof Portal> & RefAttributes<never>
  >;
  
  export type DialogTitleProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Title> & RefAttributes<HTMLHeadingElement>,
      "ref"
    > &
      RefAttributes<HTMLHeadingElement>
  >;
  
  export type DialogTriggerProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Trigger> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  type DialogSubComponents = {
    Close: DialogCloseProps;
    Content: DialogContentProps;
    Description: DialogDescriptionProps;
    Footer: DialogFooterProps;
    Header: DialogHeaderProps;
    Title: DialogTitleProps;
    Trigger: DialogTriggerProps;
  };
  
  export type DialogComponent = ForwardRefExoticComponent<
    ComponentPropsWithoutRef<typeof Root> & RefAttributes<never>
  > &
    DialogSubComponents;
  