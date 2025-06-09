import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import type {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    RefAttributes,
} from "react";
  
  export type AvatarFallbackProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Fallback> & RefAttributes<HTMLSpanElement>,
      "ref"
    > &
      RefAttributes<HTMLSpanElement>
  >;
  
  export type AvatarImageProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Image> & RefAttributes<HTMLImageElement>,
      "ref"
    > &
      RefAttributes<HTMLImageElement>
  >;
  
  type AvatarSubComponents = {
    Fallback: AvatarFallbackProps;
    Image: AvatarImageProps;
  };
  
  export type AvatarComponent = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Root> & RefAttributes<HTMLSpanElement>,
      "ref"
    > &
      RefAttributes<HTMLSpanElement>
  > &
    AvatarSubComponents;
  