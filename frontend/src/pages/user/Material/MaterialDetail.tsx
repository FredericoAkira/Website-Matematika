import { ArrowLeft, BookOpenText, ChevronRight, SchoolIcon, Sword } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostSetAccess, { AccessReq } from "../../../api/Access/usePostSetAccess";
import useGetMaterialDetailUser from "../../../api/Material/useGetDetailMaterialUser";
import useGetTopicDetail from "../../../api/Topic/useGetTopicDetail";
import { Button } from "../../../component/Button/button";
import TabWidget from "./TabWidget";

export const MaterialDetail = () => {
  const { materialName } = useParams();
  const decodedTitle = decodeURIComponent(materialName || "");
  const accessMaterial = usePostSetAccess();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>();
  const { data: intro } = useGetMaterialDetailUser(materialName ?? "");
  const { data: details } = useGetTopicDetail(selectedTab ?? intro?.data.data.topics[0] ?? "");

  const handleAccess = (materialName: string) => {
    const data: AccessReq = {
      userId: localStorage.getItem("user") ?? "",
      type: "material",
      itemName: materialName
    }

    accessMaterial.mutate(data, {
      onSuccess: () => {
        console.log("Sukses latest material");
        setOpen(true);
      }
    })
  }

  return (
    <div className="relative overflow-y-hidden">
      <div className="flex items-center justify-between bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3 mx-3">
        <div className="w-full mt-5 mx-5">
          <div className="flex flex-row items-center gap-3">
            <ArrowLeft
              onClick={() => {
                if (open) {
                  setOpen(false);
                } else {
                  navigate(-1);
                }
              }}
              className="cursor-pointer"
            />
            <p className="text-[20px] font-semibold">
              {decodedTitle}
            </p>
          </div>
          <hr className="w-full my-2 border-gray-300" />

          {!open && (
            <div className="py-6 md:p-5">
              <div className="border-b border-b-gray-300 pb-2 mb-5">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="flex flex-row items-center gap-2"> <SchoolIcon/> Kelas: {intro?.data.data.grade} </span>
                  <span className="flex flex-row items-center gap-2"> <Sword/> Kesulitan: {intro?.data.data.difficulty} </span>
                  {/* <span className="flex flex-row items-center gap-2"> <Trophy/> Completion: {getXP(intro?.data.data.difficulty)}XP </span> */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mt-1">
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-[18px] font-semibold -mt-2">
                      Deskripsi Materi
                    </p>
                  </div>
                  <p className="ml-2 text-[16px] text-gray-700">
                    {intro?.data.data.description}
                  </p>
                </div>

                <div className="mt-3 md:mt-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <BookOpenText className="w-6 h-6 -mt-1"/>
                    <p className="text-[18px] font-semibold -mt-2">
                      Yang akan dipelajari di materi ini
                    </p>
                  </div>

                  {intro?.data.data.topics?.map((content: string, idx: number) => (
                    <p key={idx} className="ml-4 text-[16px] text-gray-700">
                      - {content}
                    </p>
                  ))}
                </div>
              </div>

      
              <div className="w-full flex justify-end pr-3 mt-10">
                <Button className="right-0" onClick={() => handleAccess(decodedTitle)}>
                  <p className="text-[14px]">Masuk</p><ChevronRight />{" "}
                </Button>
              </div>
            </div>
          )}
          {open && (
            <div className="p-3 w-[50dvw] md:w-full items-center justify-center">
              <div className="flex flex-col w-[70dvw] md:w-full gap-3">
                <TabWidget
                  tabs={intro?.data.data.topics ?? []}
                  selectedTab={selectedTab ?? intro?.data.data.topics[0] ?? ""}
                  onTabSelect={(label) => setSelectedTab(label)}
                  data={details?.data.data}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
