import { XIcon } from "lucide-react";

import { cn } from "../utils";
import type { BadgeProps } from "./types";
import { badgeVariants } from "./variants";

export const Badge: BadgeProps = ({
  className,
  children,
  dismissable = false,
  leading,
  leadingIcon: LeadingIcon,
  rounded = false,
  size = "default",
  trailing,
  trailingIcon: TrailingIcon,
  variant,
  onDismissed,
  ...props
}) => {
  const leadingSlot = leading
    ? leading
    : LeadingIcon && (
        <LeadingIcon
          className={cn(
            "flex-shrink-0",
            size === "default" ? "w-3 h-3" : "w-4 h-4",
          )}
        />
      );

  const trailingSlot = trailing
    ? trailing
    : TrailingIcon && (
        <TrailingIcon
          className={cn(
            "flex-shrink-0",
            size === "default" ? "w-3 h-3" : "w-4 h-4",
          )}
        />
      );

  return (
    <div
      className={cn(
        badgeVariants({ className, size, variant }),
        rounded && "p-2 rounded-full",
      )}
      {...props}
    >
      {leadingSlot}
      {children}
      {dismissable ? (
        <button
          type="button"
          onClick={onDismissed}
        >
          <XIcon
            className={cn(
              "flex-shrink-0",
              size === "default" ? "w-3 h-3" : "w-4 h-4",
            )}
          />
        </button>
      ) : (
        trailingSlot
      )}
    </div>
  );
};
