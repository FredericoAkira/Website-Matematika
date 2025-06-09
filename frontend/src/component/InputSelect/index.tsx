import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "../utils";
import type {
  SelectComponent,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectScrollDownButtonProps,
  SelectScrollUpButtonProps,
  SelectSeparatorProps,
  SelectTriggerProps,
} from "./types";

const SelectScrollDownButton: SelectScrollDownButtonProps = forwardRef(
  ({ className, ...props }, ref) => (
    <ScrollDownButton
      {...props}
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </ScrollDownButton>
  ),
);
SelectScrollDownButton.displayName = ScrollDownButton.displayName;

const SelectScrollUpButton: SelectScrollUpButtonProps = forwardRef(
  ({ className, ...props }, ref) => (
    <ScrollUpButton
      {...props}
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </ScrollUpButton>
  ),
);
SelectScrollUpButton.displayName = ScrollUpButton.displayName;

const SelectContent: SelectContentProps = forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <Portal>
      <Content
        {...props}
        ref={ref}
        className={cn(
          "relative z-50 min-w-[8rem] max-h-96 rounded shadow-md overflow-hidden",
          "bg-white text-neutral-default border border-neutral-outline focus-visible:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
      >
        <ScrollUpButton />
        <Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </Viewport>
        <ScrollDownButton />
      </Content>
    </Portal>
  ),
);
SelectContent.displayName = Content.displayName;

const SelectItem: SelectItemProps = forwardRef(
  (
    { className, children, description, withIndicator = true, ...props },
    ref,
  ) => (
    <Item
      {...props}
      ref={ref}
      className={cn(
        "relative w-full flex items-center rounded-sm cursor-default select-none",
        "text-xs outline-none py-1.5 pr-2",
        "focus:bg-[#0291E5] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        withIndicator ? "pl-8" : "pl-2",
        className,
      )}
    >
      {withIndicator && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <ItemIndicator>
            <CheckIcon className="h-4 w-4" />
          </ItemIndicator>
        </span>
      )}

      <div className="flex flex-col gap-0">
        <ItemText>{children}</ItemText>
        {description}
      </div>
    </Item>
  ),
);
SelectItem.displayName = Item.displayName;

const SelectLabel: SelectLabelProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Label
      {...props}
      ref={ref}
      className={cn("font-bold text-xs py-1.5 pl-8 pr-2", className)}
    />
  ),
);
SelectLabel.displayName = Label.displayName;

const SelectSeparator: SelectSeparatorProps = forwardRef(
  ({ className, ...props }, ref) => (
    <Separator
      {...props}
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-neutral-divider", className)}
    />
  ),
);
SelectSeparator.displayName = Separator.displayName;

const SelectTrigger: SelectTriggerProps = forwardRef(
  ({ className, children, ...props }, ref) => (
    <Trigger
      {...props}
      ref={ref}
      className={cn(
        "w-full flex items-center justify-between gap-2.5 rounded transition ease-out duration-200",
        "disabled:cursor-not-allowed disabled:bg-neutral-bg disabled:text-neutral-tertiary",
        "border border-gray-300 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
        "text-neutral-default data-[placeholder]:text-neutral-tertiary bg-white",
        "text-xs file:text-xxs py-2 px-3 [&>span]:line-clamp-1 [&>span]:text-left",
        className,
      )}
    >
      {children}
      <Icon asChild>
        <ChevronDownIcon className="flex-shrink-0 h-4 w-4 opacity-50" />
      </Icon>
    </Trigger>
  ),
);
SelectTrigger.displayName = Trigger.displayName;

export const Select: SelectComponent = ({ ...props }) => {
  return <Root {...props} />;
};

Select.Content = SelectContent;
Select.Group = Group;
Select.Item = SelectItem;
Select.Label = SelectLabel;
Select.ScrollDownButton = SelectScrollDownButton;
Select.ScrollUpButton = SelectScrollUpButton;
Select.Separator = SelectSeparator;
Select.Trigger = SelectTrigger;
Select.Value = Value;
