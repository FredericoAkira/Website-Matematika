import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import { forwardRef } from "react";
import { cn } from "../utils";
import type {
    AvatarComponent,
    AvatarFallbackProps,
    AvatarImageProps,
} from "./types";

const AvatarFallback: AvatarFallbackProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Fallback
      {...props}
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-neutral-bg text-neutral-secondary text-xs",
        className,
      )}
    />
  ),
);
AvatarFallback.displayName = Fallback.displayName;

const AvatarImage: AvatarImageProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Image
      {...props}
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
    />
  ),
);
AvatarImage.displayName = Image.displayName;

export const Avatar = forwardRef(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
)) as AvatarComponent;
Avatar.displayName = Root.displayName;

Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;
