import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { usePostLogout } from "../../api/usePostLogout";
import { Sidebar } from "../../component/sidebar/Sidebar";


const UserLayout: React.FC = () => {
    const { logout } = usePostLogout();
    const [ open, setOpen] = useState(false)
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden after:content-[''] after:fixed after:inset-0 after:-z-10 after:bg-[url('/src/assets/png/Background.png')] after:bg-repeat-x after:bg-top after:bg-[length:auto_100%]">
      {/* Content that can grow */}
      <div className="relative flex flex-row z-10">
        <Sidebar
          isOpen={open}
          onClickItem={() => console.log("click item")}
          onLogout={() => logout()}
          isAdmin={false}
        />
        {!open ? (
          <ChevronRight
            className={`fixed w-7 h-7 left-0 top-1/2 -translate-y-1/2 z-50 bg-white text-gray-400 cursor-pointer`}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <ChevronLeft
            className={`fixed w-7 h-7 left-[310px] top-1/2 -translate-y-1/2 z-50 bg-white text-gray-400 cursor-pointer`}
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

export default UserLayout;
