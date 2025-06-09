/* eslint-disable react-hooks/exhaustive-deps */
import * as Accordion from "@radix-ui/react-accordion";
import { BellDotIcon, BellIcon, ChevronDownIcon, LogOutIcon } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import usePostGradeUp from "../../api/Access/usePostGradeUp";
import { useAuthStore } from "../../api/auth";
import useGetNotification, { NotificationResponse } from "../../api/Dashboard/Notification/useGetNotification";
import usePostEditNotif from "../../api/Dashboard/Notification/usePostEditNotif";
import useGetUserProfile from "../../api/Dashboard/useGetUserProfile";
import useGetLevelCap from "../../api/useGetLevelCap";
import usePostLevelUp, { LevelResponse, LevelUpReq } from "../../api/usePostLevelUp";
import avatar from "../../assets/png/avatar.png";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button/button";
import { ConfirmationDialog } from "../Dialog/ConfirmationDialog";
import { LevelUpDialog } from "../Dialog/LevelUpDialog";
import { DetailDialog } from "../Notification/DetailDialog";
import { Profile } from "../Profile";
import { ProgressBar } from "../Progress";
import { UserRoleEnum } from "../userRole";
import { cn } from "../utils";
import { sidebarMenus } from "./menu";
import { adminSidebarMenus } from "./menuAdmin";
import type {
  SidebarHeaderProps,
  SidebarMenuAccordionProps,
  SidebarMenuItemProps,
  SidebarProps,
} from "./types";

const SidebarHeader: SidebarHeaderProps = ({notification}) => {
  const userId = localStorage.getItem("user") ?? "";
  const auth = useAuthStore((state) => state.role) ?? undefined;
  const { data: profileData, refetch } = useGetUserProfile(userId);
  const hasUnreadNotifications = notification?.data && notification?.data.length > 0;
  const editNotification = usePostEditNotif();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState<NotificationResponse>();
  const [isOpen, setIsOpen] = useState(false);
  const {data: levelCap} = useGetLevelCap(profileData?.data.grade ?? "");
  const levelUp = usePostLevelUp();
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [levelData, setLevelData] = useState<LevelResponse>();
  const gradeUp = usePostGradeUp();
  const [isConfirmationUp, setIsConfirmationUp] = useState(false);


  const progress = Math.min(
    ((profileData?.data.exp ?? 0) / (levelCap?.data.data || 1)) * 100,
    100
  );

  const badge = profileData?.data.level === "Novice" ? "success" : profileData?.data.level === "Expert" ? "danger" : "warning";

  const editNotif = (notifId: string, status: string) => {
    editNotification.mutate({itemOne: notifId, itemTwo: status}, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
  }
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(levelData);
  },[])
  

  useEffect(() => {
    if(profileData && levelCap?.data){
      const data: LevelUpReq = {
        userId: userId,
        totalProgress: profileData?.data.exp ?? 0,
        levelCap: levelCap?.data.data,
        currentLevel: profileData?.data.level ?? ""
      }

      levelUp.mutate(data, {
        onSuccess:(data) => {
          console.log(data.data);
          setLevelData(data);
          setIsLevelUp(data.data.levelChanged)
        }
      })
    }
    refetch()
  }, [levelCap?.data, profileData?.data.exp])

  const shouldRefetch = localStorage.getItem("shouldRefetchSidebar");
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      localStorage.removeItem("shouldRefetchSidebar");
    }
  }, [shouldRefetch]);

  const handleGradeUp = () => {
    gradeUp.mutate(userId, {
      onSuccess:(data) => {
        refetch()
        console.log(data)
      }
    })
  }

  return (
    <header className={`flex flex-col ${progress === 100 ? "h-[150px]" : "h-[140px]"} w-full`}>
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-14 h-14 cursor-pointer" onClick={() => setOpenDialog(true)}>
            <Avatar.Image src={profileData?.data.profilePhoto ?? avatar} />
            <Avatar.Fallback>
              nameError
            </Avatar.Fallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-[18px]">{profileData?.data.username}</h1>
              {auth !== UserRoleEnum.Teacher && (
                <div className="flex flex-row justify-center items-center">
                  <Badge variant={badge}>
                    {profileData?.data.level}
                  </Badge>
                </div>
              )}
          </div>
        </div>

        <div className="flex flex-col items-center -translate-y-1.5 gap-1 mr-4" onClick={() => setIsOpen(!isOpen)}>
          {hasUnreadNotifications ? (
            <BellDotIcon className="w-6 h-6 text-[#0291E5] mt-2 cursor-pointer" />
          ) : (
            <BellIcon className="w-7 h-7 text-[#0291E5] mt-2 cursor-pointer" />
          )}
        </div>
      </div>
      <div className="flex flex-col mt-2 bg-blue-200 p-3 rounded-xl border border-black">
        <p className="text-[14px]">Kelas {profileData?.data.grade}</p>
        <div className="flex flex-row items-center">
          <div className="w-[65%]">
            <ProgressBar value={progress}/>
          </div>
          <p className="text-[12px] font-semibold ml-2">{profileData?.data.exp ?? 0} / {levelCap?.data.data}</p>
        </div>
        <div className="w-full flex mt-1">
          {progress === 100 && (
            <Button className="text-[10px] px-3 py-1" variant={"outline"} onClick={() => setIsConfirmationUp(true)}>
              Naik Level
            </Button>
          )}
        </div>
      </div>

        {isOpen && (
          notification?.data ? (
            <div className="absolute left-5 top-24 w-72 h-72 overflow-y-scroll bg-white shadow-lg rounded-sm z-50 border border-gray-300">
              <h2 className="p-3 border-b border-b-gray-500">Notifikasi</h2>
              {notification.data.map(item => (
                <div className="flex flex-col gap-4 w-full" onClick={() => {
                  if (item.status === "OPEN") {
                      editNotif(item.notifId, "PENDING");
                  } else if (item.status === "OPEN - AS"){
                      editNotif(item.notifId, "PENDING - AS");
                  }
                  setItemSelected(item)
                  setIsDetailOpen(true);
                  }}
                >
                        <div className={`relative border-b border-b-gray-500 p-3 ${item.status === "OPEN" || item.status === "OPEN - AS" ? "bg-blue-100" : "bg-white"}`}>
                          <div className="flex flex-col items-start p-2">
                            <div className="flex flex-row -ml-1">
                              <h2 className="font-bold text-[14px] mr-3">{item.header}</h2>
                              {item.status === "OPEN" && <Badge variant={"success"} className="-mt-0.5">new</Badge>}
                            </div>
                            <hr className="my-1 -ml-1 border-black w-full" />
                            <p className="-ml-1">{item.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <DetailDialog open={isDetailOpen} setOpen={setIsDetailOpen} data={itemSelected} onClose={editNotif}/>
                  </div>
                ) : (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 z-50">
                    <p>No Data</p>
                  </div>
                )
        )}

      <Profile open={openDialog} setOpen={setOpenDialog}
        data={
          {
            username: profileData?.data.username ?? "",
            profilePhoto: profileData?.data.profilePhoto ?? "",
            email: profileData?.data.email ?? "",
            grade: profileData?.data.grade ?? ""
          }
        }
      />
      <LevelUpDialog
        open={isLevelUp}
        setOpen={setIsLevelUp}
        data={levelData}
        onClose={() => refetch()}
      />
      <ConfirmationDialog
        open={isConfirmationUp}
        setOpen={setIsConfirmationUp}
        errorMessage= "Kamu dapat mengubah kelas di profile nanti"
        titleMessage= "Apakah kamu ingin Naik Kelas?"
        onClose= {handleGradeUp}
        buttonNo= {true}
      />
    </header>
  );
};

const SidebarMenuAccordion: SidebarMenuAccordionProps = ({
  children,
  label,
  icon,
  url,
  shouldCollapseOnClick,
  onClickItem,
  ...props
}) => {

  const index = "index" in props ? props.index || 0 : 0;

  const location = useLocation();

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const isIndexed = useMemo(
    () => location.pathname === url,
    [location.pathname, url],
  );

  useEffect(() => {
    setIsOpened(location.pathname === url);
  }, [location.pathname, url]);

  const handleAccordionToggle = () => {
    setIsOpened((prev) => !prev);
  };

  return (
    // isVisible && (
      <Accordion.Root
        collapsible
        type="single"
        value={isOpened ? label : "closed"}
      >
        <Accordion.AccordionItem value={label}>
          <Accordion.AccordionTrigger asChild>
            <NavLink
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-3 rounded transition ease-out duration-200",
                "bg-transparent hover:bg-[#FFEFEF] text-[#1F1F1F] hover:text-primary-600",
                "data-[state=open]:text-primary-600",
                "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-primary-600",
                isIndexed && "data-[state=open]:bg-[#FFEFEF]",
              )}
              to={{ pathname: url }}
              onClick={() => {
                handleAccordionToggle();
                if (shouldCollapseOnClick && onClickItem) {
                  onClickItem();
                }
              }}
            >
              <span className="flex items-center gap-4">
                <div className="flex-shrink-0 w-5 h-5">{icon}</div>
                <span className="text-xs line-clamp-1">{label}</span>
              </span>
              <ChevronDownIcon className="h-5 w-5 flex-shrink-0 transition ease-out duration-200" />
            </NavLink>
          </Accordion.AccordionTrigger>
          <Accordion.AccordionContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <nav className="mt-2 flex flex-col gap-1">
              {children.map((menu) =>
                "children" in menu ? (
                  <SidebarMenuAccordion
                    key={menu.label}
                    {...menu}
                    index={index + 1}
                    url={`${url}/${menu.url}`}
                    onClickItem={
                      "shouldCollapseOnClick" in menu
                        ? menu.shouldCollapseOnClick
                          ? onClickItem
                          : () => {}
                        : () => {}
                    }
                  />
                ) : (
                  <SidebarMenuItem
                    key={menu.label}
                    {...menu}
                    index={index + 1}
                    url={
                      ("isAvailable" in menu && !menu.isAvailable) ||
                      ("isEligible" in menu && !menu.isEligible)
                        ? "#"
                        : `${url}/${"url" in menu && menu.url}`
                    }
                    onClickItem={
                      "shouldCollapseOnClick" in menu
                        ? menu.shouldCollapseOnClick
                          ? onClickItem
                          : () => {}
                        : () => {}
                    }
                  />
                ),
              )}
            </nav>
          </Accordion.AccordionContent>
        </Accordion.AccordionItem>
      </Accordion.Root>
    // )
  );
};

const SidebarMenuItem: SidebarMenuItemProps = ({ icon, label, ...props }) => {
  const enabled = "enabled" in props ? props.enabled : undefined;

  const isAvailable = "isAvailable" in props ? props.isAvailable : undefined;

  const isEligible = "isEligible" in props ? props.isEligible : undefined;

  const index = "index" in props ? props.index || 0 : 0;

  const baseClassNames = cn(
    "w-full flex items-center gap-4 px-4 py-3 rounded transition ease-out duration-200",
    "text-left text-[#1F1F1F] hover:text-white !important hover:bg-[#0291E5] !important",
    enabled === false && "!text-neutral-tertiary pointer-events-none",
    (isAvailable !== undefined && !isAvailable) ||
      (isEligible !== undefined && !isEligible)
      ? "text-neutral-tertiary"
      : "hover:text-white",
  );

  const location = useLocation();

  const isActive = useCallback(
    (url: string) => {
      url = url.replace("/", "");
      const searchParams = location.search;
      let pathname = location.pathname.replace("/", "");
      if (searchParams) pathname += searchParams;
      if (url === "") return pathname === "";
      if(pathname.startsWith("admin")){
        return pathname === url;
      }
      return pathname.includes(url)
    },
    [location.pathname, location.search],
  );

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    "url" in props && props.url !== "#" ?
      // ? isVisible &&
      (
          <>
            <NavLink
              className={cn(
                baseClassNames,
                isActive(props.url) && "text-white bg-[#0291E5]",
              )}
              to={props.url}
            >
              {children}
            </NavLink>
          </>
        )
      // : isVisible && (
      : (
          <button
            className={baseClassNames}
            onClick={(e) =>
              "action" in props
                ? (() => {
                    if (isAvailable !== undefined && !isAvailable)
                      e.currentTarget.value = "isAvailable";
                    if (isEligible !== undefined && !isEligible)
                      e.currentTarget.value = "isEligible";
                    if ("action" in props && props.action) {
                      props.action(e); // Ensure `action` is executed when clicked
                    }
                  })()
                : {}
            }
          >
            {children}
          </button>
        );

  return (
    <Wrapper>
      {icon ? (
        <span className="flex-shrink-0 w-5 h-5 block">{icon}</span>
      ) : (
        <span style={{ width: 20 * index }} />
      )}
      <span className="text-xs line-clamp-1 flex-1">{label}</span>
    </Wrapper>
  );
};

type SidebarMenuProps = {
  onClickItem: () => void;
  chat?: boolean;
};
const SidebarMenu: FC<SidebarMenuProps> = ({ onClickItem, chat }) => {
  const auth = useAuthStore((state) => state.role) ?? undefined;
  const mainSidebarMenus = auth === UserRoleEnum.Admin ? adminSidebarMenus : sidebarMenus({ auth, chat });

  return (
    <nav className="flex-1 flex flex-col gap-1 overflow-auto">
        {(
        mainSidebarMenus.map((menu) =>
          "children" in menu ? (
            <SidebarMenuAccordion
              key={menu.label}
              {...menu}
              onClickItem={onClickItem}
            />
          ) : (
            <SidebarMenuItem
              key={menu.label}
              {...menu}
              onClickItem={
                "shouldCollapseOnClick" in menu
                  ? menu.shouldCollapseOnClick
                    ? onClickItem
                    : () => {}
                  : () => {}
              }
            />
          ),
        )
      )}
    </nav>
  );
};

export const Sidebar: SidebarProps = ({ isOpen, onClickItem, onLogout, isAdmin }) => {
  const userId = localStorage.getItem("user") ?? "";
  const { data: notification } = useGetNotification(userId);
  const hasGroupChatNotif = notification?.data?.some(
    (notif) => notif.status.toLowerCase() === "groupchat"
  );
  return (
    <aside
      className={cn(
        "fixed left-0 w-[320px] bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-150",
        isOpen ? "opacity-100" : "w-0 opacity-0",
        isAdmin ? "h-[90vh]" : "h-full"
      )}
    >
      <div className="flex-1 self-stretch flex flex-col gap-4 overflow-hidden pt-2">
        {
          !isAdmin && (
            <SidebarHeader notification={notification}/>
          )
        }
        <SidebarMenu onClickItem={onClickItem} chat={hasGroupChatNotif} />
      </div>
      <div className="self-stretch">
        <SidebarMenuItem
          icon={<LogOutIcon className="w-5 h-5" />}
          label="Log Out"
          action={onLogout}
          onClickItem={onLogout}
        />
      </div>
    </aside>
  );
};
