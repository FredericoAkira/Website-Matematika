import { forwardRef } from "react";
import { cn } from "../utils";
import { ButtonComponent } from "./types";
import { buttonVariants } from "./variants";

export const Button = forwardRef(
    (
      {
        className,
        children,
        leading,
        leadingIcon: LeadingIcon,
        size,
        trailing,
        trailingIcon: TrailingIcon,
        variant,
        ...props
      },
      ref,
    ) => {
      const leadingSlot = leading
        ? leading
        : LeadingIcon && <LeadingIcon className="flex-shrink-0 w-4 h-4" />;
  
      const trailingSlot = trailing
        ? trailing
        : TrailingIcon && <TrailingIcon className="flex-shrink-0 w-4 h-4" />;
  
      return (
        <button
          {...props}
          ref={ref}
          className={cn(buttonVariants({ className, size, variant }))}
        >
          {leadingSlot}
          {children}
          {trailingSlot}
        </button>
      );
    },
  ) as ButtonComponent;