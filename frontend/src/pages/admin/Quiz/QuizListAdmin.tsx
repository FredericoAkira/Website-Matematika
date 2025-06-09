import { PaginationState } from "@tanstack/react-table";
import { Filter, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostSetAccess, { AccessReq } from "../../../api/Access/usePostSetAccess";
import useGetQuizList from "../../../api/Quiz/useGetQuizList";
import usePostDeleteQuiz from "../../../api/Quiz/usePostDeleteQuiz";
import { Button } from "../../../component/Button/button";
import { Input } from "../../../component/InputField/input";
import { FilterDialog } from "./FilterDialog";
import { QuizForm } from "./QuizForm";
import { QuizListColumns } from "./Table/QuizListColumns";
import { QuizTable } from "./Table/QuizTable";

export type FilterState = {
  materialName: string;
  filterGrade: string;
  filterDifficulty: string;
};

export const QuizListAdmin = () => {
  const [openForm, setOpenForm] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [searchQuiz, setSearchQuiz] = useState<string | undefined>(undefined);
  const [searchQuery, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    materialName: "",
    filterGrade: "",
    filterDifficulty: "",
  });
  const navigate = useNavigate();

  const handleAddMaterial = () => {
    setOpenForm(true)
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      materialName: "",
      filterGrade: "",
      filterDifficulty: "",
    });
  };

  const { data: quizList, refetch } = useGetQuizList(
    pagination.pageIndex,
    pagination.pageSize,
    localStorage.getItem("user") ?? "",
    filters.materialName,
    filters.filterDifficulty,
    filters.filterGrade,
    searchQuery
  );

  const deleteTopic = usePostDeleteQuiz();
  const accessMaterial = usePostSetAccess();

  const handleEdit = (quizName: string) => {
    const data: AccessReq = {
      userId: localStorage.getItem("user") ?? "",
      type: "quiz",
      itemName: quizName
    }
    accessMaterial.mutate(data, {
      onSuccess: () => {
        console.log("Sukses");
      }
    })
    navigate(`/admin/quiz/${quizName}`)
  };

  const handleDelete = (quizId: string) => {
    deleteTopic.mutate(quizId, {
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
              <p>Kuis Page</p>
              <hr className="w-full my-2 border-gray-300" />
              <div className="flex flex-row justify-between items-center mt-3">
                <div className="flex flex-row gap-2">
                  <Input
                    className="border border-gray-400"
                    placeholder="Search Name"
                    value={searchQuiz}
                    onChange={({ target: { value } }) =>
                      setSearchQuiz(value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(searchQuiz ?? ""); // Update the search state when Enter is pressed
                      }
                    }}
                  />
                  <Button
                    disabled={!searchQuiz}
                    onClick={() => {
                      //   setPagination({
                      //     pageIndex: 0,
                      //     pageSize: 10,
                      //   });
                      setSearch(searchQuiz ?? "");
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
                      setSearchQuiz("");
                      resetFilters();
                    }}
                    variant={"ghost"}
                  >
                    Reset
                  </Button>
                </div>
                <div className="flex flex-row gap-2">
                  <Button
                    trailingIcon={Filter}
                    variant={"default"}
                    className="p-2 text-[12px]"
                    onClick={() => setOpenFilter(true)}
                  >
                    Filter
                  </Button>
                  <Button
                    trailingIcon={PlusIcon}
                    variant={"default"}
                    className="p-2 text-[12px]"
                    onClick={handleAddMaterial}
                  >
                    Tambah Kuis
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full mt-3">
              <QuizTable
                columns={QuizListColumns(handleEdit, handleDelete)}
                data={
                  quizList?.data?.content?.map((content) => ({
                    actions: ["Edit", "Delete"],
                    quizName: content.quizName,
                    materialName: content.materialName,
                    totalContent: content.totalContent,
                    quizId: content.id ?? "",
                    difficulty: content.difficulty,
                    grade: content.grade
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
                  quizList?.data
                    ? {
                        state: pagination,
                        setState: setPagination,
                        totalItem: quizList.data.totalElements,
                        totalPage: quizList.data.totalPages,
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
          <QuizForm onClose={() => setOpenForm(false)} refetch={refetch} source="Add" />
        )}

        <FilterDialog
          open={openFilter}
          setOpen={setOpenFilter}
          setFilter={handleFilterChange}
          resetFilter={resetFilters}
          filterValue={filters}
        />
      </div>
    </div>
  );
};
