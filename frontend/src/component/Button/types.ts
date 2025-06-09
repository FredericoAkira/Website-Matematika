import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    ReactNode,
    RefAttributes,
} from "react";
import { LinkProps } from "react-router-dom";
import { buttonVariants } from "./variants";

type ButtonProps = {
    leading?: ReactNode;
    leadingIcon?: LucideIcon;
    trailing?: ReactNode;
    trailingIcon?: LucideIcon;
};

export type ButtonLinkProps = ForwardRefExoticComponent<
    LinkProps &
      RefAttributes<HTMLAnchorElement> &
      VariantProps<typeof buttonVariants> &
      ButtonProps
  >;
  
  type ButtonSubScomponents = {
    Link: ButtonLinkProps;
  };
  
  export type ButtonComponent = ForwardRefExoticComponent<
    ButtonHTMLAttributes<HTMLButtonElement> &
      RefAttributes<HTMLButtonElement> &
      VariantProps<typeof buttonVariants> &
      ButtonProps
  > &
    ButtonSubScomponents;
  