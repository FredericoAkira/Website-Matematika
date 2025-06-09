import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import useGetNotification from "../../api/Dashboard/Notification/useGetNotification";
import useGetAdminProfile from "../../api/Dashboard/useGetAdminProfile";
import { usePostLogout } from "../../api/usePostLogout";
import { Navbar } from "../../component/navbar";
import { Sidebar } from "../../component/sidebar/Sidebar";


const AdminHomePage: React.FC = () => {
    const { logout } = usePostLogout();
    const [ open, setOpen] = useState(true);
    const userId = localStorage.getItem("user");
    const { data: adminProfile } = useGetAdminProfile(userId ?? "");
    const { data: notificationData } = useGetNotification(userId ?? "");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden after:content-[''] after:fixed after:inset-0 after:-z-10 after:bg-[url('/src/assets/png/Background.png')] after:bg-repeat-x after:bg-top after:bg-[length:auto_100%]">
  {/* Sticky Navbar */}
  <div className="fixed top-0 z-40 w-full bg-white">
    <Navbar data={adminProfile?.data} notification={notificationData?.data}/>
  </div>

  {/* Main Content */}
  <div className="relative flex flex-row z-10 mt-[80px]">
    <Sidebar
      isOpen={open}
      onClickItem={() => console.log("click item")}
      onLogout={() => logout()}
      isAdmin={true}
    />

    {!open ? (
      <ChevronRight
        className="fixed w-7 h-7 left-0 top-1/2 -translate-y-1/2 z-50 bg-white text-gray-400 cursor-pointer"
        onClick={() => setOpen(!open)}
      />
    ) : (
      <ChevronLeft
        className="fixed w-7 h-7 left-[310px] top-1/2 -translate-y-1/2 z-50 bg-white text-gray-400 cursor-pointer"
        onClick={() => setOpen(!open)}
      />
    )}

    <div className={`flex-1 transition-all duration-300 ${open ? 'ml-[340px]' : 'ml-[20px]'}`}>
      <Outlet />
    </div>
  </div>
</div>

  );
};

export default AdminHomePage;
