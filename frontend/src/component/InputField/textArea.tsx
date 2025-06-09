import { forwardRef } from "react";

import { cn } from "../utils";
import { TextareaProps } from "./types";

export const Textarea: TextareaProps = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cn(
          "w-full min-h-[80px] flex items-center gap-2.5 rounded transition ease-out duration-200",
          "disabled:cursor-not-allowed disabled:bg-neutral-bg disabled:text-neutral-tertiary",
          "border border-neutral-outline focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-[#0291E5]",
          "text-neutral-default placeholder:text-neutral-tertiary bg-white",
          "text-xs file:text-xxs py-2 px-3 pr-9",
          className,
        )}
      />
    );
  },
);
Textarea.displayName = "Textarea";
