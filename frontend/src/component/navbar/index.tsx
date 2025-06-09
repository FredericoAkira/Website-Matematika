import { FC, Fragment, forwardRef, useState } from "react";

import { default as LogoPng, default as WordmarkPng } from "../../assets/png/amico.png";

import { BellDotIcon, BellIcon } from "lucide-react";
import { NotificationResponse } from "../../api/Dashboard/Notification/useGetNotification";
import usePostAddNotif, { AddNotifReq } from "../../api/Dashboard/Notification/usePostAddNotif";
import usePostEditNotif from "../../api/Dashboard/Notification/usePostEditNotif";
import { AdminProfile } from "../../api/Dashboard/useGetAdminProfile";
import avatar from "../../assets/png/avatar.png";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button/button";
import { DetailDialog } from "../Notification/DetailDialog";
import { Profile } from "../Profile";
import { cn } from "../utils";
import type { NavbarIconWrapperProps } from "./types";

const NavbarIconWrapper: NavbarIconWrapperProps = forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "transition ease-out duration-200 p-1",
          "rounded border border-transparent focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:border-primary-500 focus-visible:ring-primary-100",
        )}
      >
        {children}
      </button>
    );
  },
);

export type NotificationProps = FC<{
  data?: NotificationResponse[];
}>;

const MyNotifications: NotificationProps = ({data}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasUnreadNotifications = data?.length;
  const editNotification = usePostEditNotif();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState<NotificationResponse>();

  const editNotif = (notifId: string, status: string) => {
    editNotification.mutate({itemOne: notifId, itemTwo: status}, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
  }

  return (
    <NavbarIconWrapper>
      <div className="flex flex-col items-center -translate-y-1.5 gap-1 ml-4" onClick={() => setIsOpen(!isOpen)}>
        {hasUnreadNotifications ? (
          <BellDotIcon className="w-6 h-6 text-[#0291E5] mt-2 cursor-pointer fill-blue-200" />
        ) : (
          <BellIcon className="w-7 h-7 text-[#0291E5] mt-2 cursor-pointer" />
        )}
      </div>
      {isOpen && (
        data ? (
          <div className="absolute right-5 w-72 h-72 overflow-y-scroll bg-white shadow-lg rounded-sm z-50 border border-gray-300">
            <h2 className="p-3 border-b border-b-gray-500">Notifikasi</h2>
            {data.map(item => (
              <div className="flex flex-col gap-4 w-full" onClick={() => {
                if (item.status === "OPEN") {
                  editNotif(item.notifId, "PENDING");
                }
                setItemSelected(item)
                setIsDetailOpen(true);
              }}>
                <div className={`relative border-b border-b-gray-500 p-3 ${item.status === "OPEN" ? "bg-blue-100" : "bg-white"}`}>
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
    </NavbarIconWrapper>
  );
};

export type ProfileProps = FC<{
  data?: AdminProfile
}>;

const MyProfileInformation: ProfileProps = ({data}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const addNotification = usePostAddNotif()
  const temporaryNotif = () => {
    const userId = localStorage.getItem("user");
    const data: AddNotifReq = {
      senderId: userId ?? "",
      receiverId: userId ?? "",
      header: "Testing Notif",
      content: "Disini nanti isi notifnya",
      status: "OPEN"
    }
    addNotification.mutate(data, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
  }
  return (
    // profile && (
      <Fragment>
        <Avatar className="w-8 h-8 cursor-pointer" onClick={() => setOpenDialog(true)}>
          <Avatar.Image src={data?.profilePhoto ?? avatar} />
          <Avatar.Fallback>
            nameError
          </Avatar.Fallback>
        </Avatar>
        <div className="flex items-center gap-4">
          <div className="flex flex-col -translate-y-0.5 text-[#0F172A]">
            <p className="font-bold text-sm">
                {/* {profile.employeeName} */}
                {data?.username ?? "Account Name"}
            </p>
          </div>
          <Button onClick={temporaryNotif}>Add Notifciation</Button>
          <Profile open={openDialog} setOpen={setOpenDialog} data={data}/>
        </div>
      </Fragment>
    // )
  );
};

export type NavbarProps = FC<{
  data?: AdminProfile
  notification?: NotificationResponse[]
}>;

export const Navbar: NavbarProps = ({data, notification}) => {
  return (
    <nav className="w-full h-[80px] p-4 bg-white z-1">
      <div className="w-full h-[48px] flex items-center justify-between">
        <div className="flex gap-5">
          <div className={`flex gap-2`}>
            <img
              alt="Logo"
              className="object-contain"
              src={LogoPng}
              width={60}
              height={20}
            />
            <img
              alt="Wordmark"
              className="object-contain"
              src={WordmarkPng}
              width={70}
              height={20}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* <MyTasks /> */}
            <MyNotifications data={notification}/>
          </div>
          <MyProfileInformation data={data}/>
        </div>
      </div>
    </nav>
  );
};
