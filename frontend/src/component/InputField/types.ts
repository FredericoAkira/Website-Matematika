import type {
    ForwardRefExoticComponent,
    RefAttributes,
    TextareaHTMLAttributes,
} from "react";
  
  export type TextareaProps = ForwardRefExoticComponent<
    TextareaHTMLAttributes<HTMLTextAreaElement> &
      RefAttributes<HTMLTextAreaElement>
  >;
  