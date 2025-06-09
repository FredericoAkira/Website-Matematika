import {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    RefAttributes,
} from "react";
  
  export type NavbarIconWrapperProps = ForwardRefExoticComponent<
    ButtonHTMLAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement>
  >;
