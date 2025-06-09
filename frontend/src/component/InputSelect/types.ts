import {
    Content,
    Group,
    Item,
    Label,
    Root,
    ScrollDownButton,
    ScrollUpButton,
    Separator,
    Trigger,
    Value,
} from "@radix-ui/react-select";
import type {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    ReactNode,
    RefAttributes,
} from "react";
  
  export type SelectContentProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Content> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type SelectGroupProps = typeof Group;
  
  export type SelectItemProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Item> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement> & {
        description?: ReactNode;
        withIndicator?: boolean;
      }
  >;
  
  export type SelectLabelProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Label> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type SelectScrollDownButtonProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof ScrollDownButton> &
        RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type SelectScrollUpButtonProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof ScrollUpButton> &
        RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type SelectSeparatorProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Separator> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type SelectTriggerProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Trigger> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  export type SelectValueProps = typeof Value;
  
  type SelectSubComponents = {
    Content: SelectContentProps;
    Group: SelectGroupProps;
    Item: SelectItemProps;
    Label: SelectLabelProps;
    ScrollDownButton: SelectScrollDownButtonProps;
    ScrollUpButton: SelectScrollUpButtonProps;
    Separator: SelectSeparatorProps;
    Trigger: SelectTriggerProps;
    Value: SelectValueProps;
  };
  
  export type SelectComponent = typeof Root & SelectSubComponents;
  