/* eslint-disable react-hooks/exhaustive-deps */
import { PaginationState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostSetAccess, { AccessReq } from "../../../api/Access/usePostSetAccess";
import useGetMaterialList from "../../../api/Material/useGetMaterialList";
import usePostDeleteMaterial from "../../../api/Material/usePostDeleteMaterial";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Input } from "../../../component/InputField/input";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { MaterialForm } from "./MaterialForm";
import { MaterialListColumns } from "./Table/MaterialListColumns";
import { MaterialTable } from "./Table/MaterialTable";

export const MaterialListAdmin = () => {
  const [openForm, setOpenForm] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchMaterial, setSearchMaterial] = useState<string | undefined>(
    undefined
  );
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const { data: materialList, refetch } = useGetMaterialList(
    pagination.pageIndex,
    pagination.pageSize,
    localStorage.getItem("user") ?? "",
    filter,
    search
  );
  const deleteMaterial = usePostDeleteMaterial();
  const accessMaterial = usePostSetAccess();
  const navigate = useNavigate();

  const handleAddMaterial = () => {
    setOpenForm(true)
  }

  const handleEdit = (materialName: string) => {
    const data: AccessReq = {
      userId: localStorage.getItem("user") ?? "",
      type: "material",
      itemName: materialName
    }
    accessMaterial.mutate(data, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
    navigate(`/admin/material/${materialName}`);
  };

  const handleDelete = (materialId: string) => {
    deleteMaterial.mutate(materialId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const [searchMateri, setSearchMateri] = useState<string>("");
  const optionFilterMaterial = useGetLOV();

  useEffect(() => {
    optionFilterMaterial.mutate({
      type: "gradelov",
      search: searchMateri
    })
  }, [searchMateri]);

  return (
    <div className="relative mr-5 overflow-y-hidden mb-3">
        <div className="flex flex-col w-full items-center justify-between border-solid bg-white/70 rounded-lg p-3 shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)] translate-y-3">
            {!openForm && (
                <>
                    <div className="flex flex-col w-full mb-5">
                    <p>Material Page</p>
                    <hr className="w-full my-2 border-gray-300" />
                    <div className="flex flex-row justify-between items-center mt-3">
                        <div className="flex flex-row gap-2">
                        <Input
                            className="border border-gray-400"
                            placeholder="Search Name"
                            value={searchMaterial}
                            onChange={({ target: { value } }) => setSearchMaterial(value)}
                            onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setSearch(searchMaterial ?? ""); // Update the search state when Enter is pressed
                            }
                            }}
                        />
                        <Button
                            disabled={!searchMaterial}
                            onClick={() => {
                              setPagination({
                                pageIndex: 0,
                                pageSize: 10,
                              });
                            setSearch(searchMaterial ?? "");
                            }}
                        >
                            Search
                        </Button>
                        <Button
                          onClick={() => {
                            setPagination({
                              pageIndex: 0,
                              pageSize: 10,
                            });
                            setSearch("");
                            setSearchMaterial("");
                            setFilter("");
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
                                  setFilter(value?.value ?? "");
                              }}
                              handleSearch={setSearchMateri}
                              options={optionFilterMaterial.data?.data.data.map((item) => (
                                  {
                                      meaning: item.name,
                                      value: item.id
                                  }
                              ))}
                              name="gradeFilter"
                              label="Grade Filter"
                              required={false}
                              value={filter}
                            />
                          </div>
                          <div className="mt-2">
                            <Button
                                trailingIcon={PlusIcon}
                                variant={"default"}
                                className="p-2 text-[13px]"
                                onClick={handleAddMaterial}
                            >
                                Tambah Materi
                            </Button>
                          </div>
                        </div>
                    </div>
                    </div>
                    <div className="w-full my-3">
                      <MaterialTable
                        columns={MaterialListColumns(handleEdit, handleDelete)}
                        data={
                            materialList?.data?.content?.map((content) => ({
                              id: content.materialId,
                              actions: ["Edit", "Delete"],
                              materialName: content.materialName,
                              grade: content.grade,
                              topics: content.topics,
                              quizzes: content.quizzes,
                              difficulty: content.difficulty
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
                          materialList?.data
                          ? {
                              state: pagination,
                              setState: setPagination,
                              totalItem: materialList.data.totalElements,
                              totalPage: materialList.data.totalPages,
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
                <MaterialForm onClose={() => setOpenForm(false)} refetch={refetch} source="Add"/>
            )}
        </div>
    </div>
  );
};
