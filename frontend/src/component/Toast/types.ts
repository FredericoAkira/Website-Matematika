import * as RadixToast from "@radix-ui/react-toast";
import {
    Action,
    Close,
    Description,
    Root,
    Title,
    ToastAction,
    Viewport,
} from "@radix-ui/react-toast";
import type { VariantProps } from "class-variance-authority";
import type {
    ComponentPropsWithoutRef,
    FC,
    ForwardRefExoticComponent,
    ReactElement,
    ReactNode,
    RefAttributes,
} from "react";
  
  import { toastVariants } from "./variants";
  
  export type ToastElementProps = ComponentPropsWithoutRef<ToastComponent> & {
    icon?: ReactNode;
  };
  
  export type ToastActionElement = ReactElement<typeof ToastAction>;
  
  export type ToastProps = ComponentPropsWithoutRef<typeof Root> &
    VariantProps<typeof toastVariants>;
  
  export type ToastActionProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Action> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  export type ToastCloseProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Close> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  export type ToastDescriptionProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Description> &
        RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type ToastProviderProps = FC<RadixToast.ToastProviderProps>;
  
  export type ToastTitleProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Title> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type ToastViewportProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Viewport> & RefAttributes<HTMLOListElement>,
      "ref"
    > &
      RefAttributes<HTMLOListElement>
  >;
  
  type ToastSubComponents = {
    Action: ToastActionProps;
    Close: ToastCloseProps;
    Description: ToastDescriptionProps;
    Provider: ToastProviderProps;
    Title: ToastTitleProps;
    Viewport: ToastViewportProps;
  };
  
  export type ToastComponent = ForwardRefExoticComponent<
    Omit<ToastProps & RefAttributes<HTMLLIElement>, "ref"> &
      VariantProps<typeof toastVariants> &
      RefAttributes<typeof toastVariants>
  > &
    ToastSubComponents;
  