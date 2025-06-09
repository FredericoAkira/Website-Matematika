//import { UserRoleEnum } from "@modules/_/auth/types/user-role.types";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { NotificationResponse } from "../../api/Dashboard/Notification/useGetNotification";
import { UserRoleEnum } from "../userRole";

export type MenuItem = {
  index?: number;
  icon?: ReactNode;
  label: string;
  url: string;
  enabled?: boolean;
  shouldCollapseOnClick: boolean;
  isAvailable?: boolean;
  isEligible?: boolean;
  shouldHide?: (role?: UserRoleEnum, grade?: string, level?: string) => boolean;
  onClickItem: () => void;
};

export type MenuItemWithChildren = MenuItem & {
  children: SidebarMenuItem[];
};

export type MenuItemWithAction = {
  icon?: ReactNode;
  label: string;
  action?: MouseEventHandler<HTMLButtonElement>;
};

export type SidebarMenuItem =
  | MenuItem
  | MenuItemWithChildren
  | MenuItemWithAction;

export type SidebarMenuItemProps = FC<SidebarMenuItem>;

export type SidebarMenuAccordionProps = FC<MenuItemWithChildren>;

export type SidebarProps = FC<{
  isOpen: boolean;
  isAdmin: boolean;
  onClickItem: () => void;
  onLogout: () => void;
}>;

export type SidebarHeaderProps = FC<{
  notification?: BaseResponse<NotificationResponse[]>;
}>
