import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";

import { cn } from "../utils";
import type {
    TabsComponent,
    TabsContentProps,
    TabsListProps,
    TabsTriggerProps,
} from "./types";

const TabsContent: TabsContentProps = forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      {...props}
      ref={ref}
      className={cn("focus:outline-none", className)}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

const TabsList: TabsListProps = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    {...props}
    ref={ref}
    className={cn(
      "w-full inline-flex items-center justify-center rounded p-1 bg-[#D4EBFE] text-gray-600",
      className,
    )}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger: TabsTriggerProps = forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-1 inline-flex items-center justify-center rounded-sm py-2 px-3 transition-all ease-out duration-200",
        "border border-transparent focus:outline-none",
        "focus-visible:ring-2 focus-visible:border-[#2BAFFC] focus-visible:ring-[#2BAFFC]",
        "disabled:pointer-events-none disabled:opacity-50",
        "text-xs text-neutral-secondary whitespace-nowrap",
        "data-[state=active]:bg-[#095A88] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-semibold",
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const Tabs = forwardRef(({ ...props }, ref) => {
  return (
    <TabsPrimitive.Root
      {...props}
      ref={ref}
    />
  );
}) as TabsComponent;

Tabs.Content = TabsContent;
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
