import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetChatList from "../../../api/Chat/useGetChatList";
import { Avatar } from "../../../component/Avatar";

export const ChatListPage = () => {
    const navigate = useNavigate();
    const {data: chatList} = useGetChatList(localStorage.getItem("user") ?? "");
    console.log(chatList);

    return(
        <div className="relative overflow-y-hidden">
            <div className="flex flex-row items-center justify-between bg-white/70 border-solid rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3">
                <div className="flex flex-col w-full mt-3 ml-3">
                    <div className="w-full flex flex-row items-center gap-2 mt-2">
                        <ArrowLeft
                            onClick={() => navigate("../home")}
                            className="cursor-pointer"
                        />
                        <p className="text-[20px] font-semibold -mt-0.5">
                            Group Chat
                        </p>
                    </div>
                    <hr className="w-full my-2 border-gray-300" />

                    {
                        chatList?.data.map((item) => (
                            <div className="relative flex justify-between items-center border-solid rounded-lg p-3 bg-white my-5 mx-3 shadow-md">
                                <div className="w-full flex flex-row items-center mx-3 gap-2 my-1">
                                    <Avatar />
                                    <div className="w-full flex flex-row justify-between items-center">
                                        <div className="flex flex-row gap-2">
                                            <p className="text-[20px] font-semibold -mt-1">
                                                {item.label}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            className="w-8 h-8 mr-3 cursor-pointer"
                                            onClick={() => navigate(`/chat/${item.value}`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}