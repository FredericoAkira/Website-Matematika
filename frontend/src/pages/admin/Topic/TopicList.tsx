/* eslint-disable react-hooks/exhaustive-deps */
import { PaginationState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostSetAccess, { AccessReq } from "../../../api/Access/usePostSetAccess";
import useGetTopicList from "../../../api/Topic/useGetTopicList";
import usePostDeleteTopic from "../../../api/Topic/usePostDeleteTopic";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Input } from "../../../component/InputField/input";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { TopicListColumns } from "./Table/TopicListColumns";
import { TopicTable } from "./Table/TopicTable";
import { TopicForm } from "./TopicForm";

export const TopicList = () => {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTopic, setSearchTopic] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const { data: topicList, refetch } = useGetTopicList(
    pagination.pageIndex,
    pagination.pageSize,
    filter,
    search
  );
  const deleteTopic = usePostDeleteTopic();
  const accessMaterial = usePostSetAccess();
  const optionFilterMaterial = useGetLOV();
  const [searchMateri, setSearchMateri] = useState<string>("");
  
  useEffect(() => {
    optionFilterMaterial.mutate({
      type: "materiallov",
      search: searchMateri
    })
  }, [searchMateri]);
  
  const handleAddTopic = () => {
    setOpenForm(true)
  }

  const handleEdit = (topicName: string) => {
    const data: AccessReq = {
      userId: localStorage.getItem("user") ?? "",
      type: "topic",
      itemName: topicName
    }
    accessMaterial.mutate(data, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
    navigate(`/admin/topic/${topicName}`);
  };

  const handleDelete = (topicId: string) => {
    deleteTopic.mutate(topicId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="relative mr-5 overflow-y-hidden mb-3">
      <div className="flex flex-col w-full items-center justify-between border-solid bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3">
        {!openForm && (
          <>
            <div className="flex flex-col w-full mb-5">
              <p>Topic Page</p>
              <hr className="w-full my-2 border-gray-300" />
              <div className="flex flex-row justify-between items-center mt-3">
                <div className="flex flex-row gap-2">
                  <Input
                    className="border border-gray-400"
                    placeholder="Search Name"
                    value={searchTopic}
                    onChange={({ target: { value } }) =>
                      setSearchTopic(value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(searchTopic ?? ""); // Update the search state when Enter is pressed
                      }
                    }}
                  />
                  <Button
                    disabled={!searchTopic}
                    onClick={() => {
                        setPagination({
                          pageIndex: 0,
                          pageSize: 10,
                        });
                      setSearch(searchTopic ?? "");
                    }}
                  >
                    Search
                  </Button>

                  <Button
                    onClick={() => {
                      //   setPagination({
                      //     pageIndex: 0,
                      //     pageSize: 10,
                      //   });
                      setSearch("");
                      setSearchTopic("");
                      setFilter("")
                    }}
                    variant={"ghost"}
                  >
                    Reset
                  </Button>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div className="mr-3 -mt-2">
                    <InputSelect
                      onChange={(value) => {
                        setFilter(value?.meaning ?? "");
                      }}
                      handleSearch={setSearchMateri}
                      options={optionFilterMaterial.data?.data.data.map((item) => (
                          {
                            meaning: item.name,
                            value: item.name
                        }
                      ))}
                      name="gradeFilter"
                      label="Material Filter"
                      required={false}
                      value={filter}
                    />
                  </div>
                  <div className="mt-2">
                    <Button
                      trailingIcon={PlusIcon}
                      variant={"default"}
                      className="p-2 text-[13px]"
                      onClick={handleAddTopic}
                    >
                      Tambah Topic
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-3">
              <TopicTable
                columns={TopicListColumns(handleEdit, handleDelete)}
                data={
                  topicList?.data?.content?.map((content) => ({
                    actions: ["Edit", "Delete"],
                    topicName: content.name,
                    materialName: content.parent,
                    totalContent: content.description,
                    topicId: content.id ?? "",
                  })) ?? []
                }
                // errorMessage={
                //   error && (
                //     <div className="flex flex-col items-center justify-center gap-3">
                //       <p>Something went wrong</p>
                //       <Button variant={"outline"} onClick={() => {}}>
                //         Refetch data
                //       </Button>
                //     </div>
                //   )
                // }
                // loading={isFetching}
                pagination={
                  topicList?.data
                    ? {
                        state: pagination,
                        setState: setPagination,
                        totalItem: topicList.data.totalElements,
                        totalPage: topicList.data.totalPages,
                        perPage: pagination.pageSize,
                        currentPage: pagination.pageIndex,
                      }
                    : undefined
                }
              />
            </div>
          </>
        )}

        {openForm && (
          <TopicForm onClose={() => setOpenForm(false)} refetch={refetch} source="Add" />
        )}
      </div>
    </div>
  );
};
