import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetGroupDetail from "../../../api/Student/useGetGroupDetail";
import TabWidget from "./Tabs/TabWidget";

export const GroupDetailPage = () => {
    const { groupId } = useParams();
    const {data: detailGroup, refetch} = useGetGroupDetail(groupId ?? "");
    const navigate = useNavigate();
    const [tabOpen, setTabOpen] = useState<string>("Student");

    return (
        <div className="relative overflow-y-hidden">
            <div className="flex flex-col items-center bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3 h-[calc(100vh-20px)]">
                <div className="w-full mt-5 mx-5">
                    <div className="flex flex-row items-center gap-3">
                        <ArrowLeft
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        />
                    </div>
                    <hr className="w-full my-2 border-gray-300" />
                </div>

                {/* header */}
                <div className="flex flex-col w-full items-center justify-between border-solid rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] mx-3 translate-y-3">
                    <div className="flex flex-row w-full">
                        <div className="w-full flex flex-row items-center m-3 gap-2">
                            <div className="w-full">
                                <div className="flex flex-col justify-between">
                                    <p className="text-[24px] font-semibold ml-5">{detailGroup?.data.groupName}</p>
                                    <div className="flex flex-row ml-5">
                                        <p className="text-[14px] font-normal">Jumlah Anggota: {detailGroup?.data.students.length ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-3">
                        <TabWidget
                            selectedTab={tabOpen}
                            onTabSelect={setTabOpen}
                            tabs={["Student", "Chat"]}
                            data={detailGroup?.data.students ?? []}
                            groupName={detailGroup?.data.groupName ?? ""}
                            groupId= {groupId ?? ""}
                            refetch={refetch}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}