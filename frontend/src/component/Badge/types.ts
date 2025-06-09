import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from "react";

import { badgeVariants } from "./variants";

export type BadgeProps = FC<
  HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof badgeVariants> & {
      dismissable?: boolean;
      leading?: ReactNode;
      leadingIcon?: LucideIcon;
      rounded?: boolean;
      trailing?: ReactNode;
      trailingIcon?: LucideIcon;
      onDismissed?: MouseEventHandler<HTMLButtonElement>;
    }
>;

export type BadgeVariant =
  | "danger"
  | "default"
  | "success"
  | "warning"
  | "epic-e"
  | "epic-p"
  | "epic-i"
  | "epic-c1"
  | "epic-c2";
