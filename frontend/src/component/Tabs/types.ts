import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import type {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    RefAttributes,
} from "react";
  
  export type TabsContentProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Content> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type TabsListProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof List> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  >;
  
  export type TabsTriggerProps = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Trigger> & RefAttributes<HTMLButtonElement>,
      "ref"
    > &
      RefAttributes<HTMLButtonElement>
  >;
  
  type TabsSubComponents = {
    Content: TabsContentProps;
    List: TabsListProps;
    Trigger: TabsTriggerProps;
  };
  
  export type TabsComponent = ForwardRefExoticComponent<
    Omit<
      ComponentPropsWithoutRef<typeof Root> & RefAttributes<HTMLDivElement>,
      "ref"
    > &
      RefAttributes<HTMLDivElement>
  > &
    TabsSubComponents;
  