/* eslint-disable react-hooks/exhaustive-deps */
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useGetLOV from "../../../api/useGetLOV";
import { Button } from "../../../component/Button/button";
import { Dialog } from "../../../component/Dialog";
import { InputSelect } from "../../../component/InputSelect/InputSelect";
import { FilterStudent } from "./MainView";

type FilterQuizProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  setFilter: (key: keyof FilterStudent, value: string) => void;
  resetFilter: () => void;
  filterValue: FilterStudent;
};

export const StudentFilter: React.FC<FilterQuizProps> = ({
  open,
  setOpen,
  setFilter,
  resetFilter,
  filterValue
}) => {
    const [filters, setFilters] = useState<FilterStudent>(filterValue);
    const [searchGrade, setSearchGrade] = useState("");
    const optionGrade = useGetLOV();
    const [searchProf, setSearchProf] = useState("");
    const optionProficiency = useGetLOV();

  useEffect(() => {
    optionGrade.mutate({
      type: "gradelov",
      search: searchGrade
    })
  }, [searchGrade]);

  useEffect(() => {
    optionProficiency.mutate({
      type: "userlevellov",
      search: searchProf
    })
  }, [searchProf]);

  const reset = () => {
    setFilters({
      filterGrade:"",
      filterLevel:""
    })
    resetFilter()
  }

  useEffect(() => {
    setFilters(filterValue);
  }, [filterValue]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content className="gap-4 w-[70vw] max-w-[90vw]">
        <Dialog.Header className="-mr-3">
          <div className="flex justify-end">
            <button
              className="text-xs"
              onClick={() => {
                resetFilter();
                setOpen?.(false);
              }}
            >
              <XIcon className="text-red-500 w-6 cursor-pointer mr-3" />
            </button>
          </div>
        </Dialog.Header>

        <h2 className="text-lg font-bold -mb-3 ml-3">Filter</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="pl-3 lg:px-3">
              <InputSelect
                onChange={(val) =>
                  setFilters((prev) => ({
                      ...prev,
                      ["filterGrade"]: val?.meaning ?? "",
                  }))
                }
                handleSearch={setSearchGrade}
                options={optionGrade.data?.data.data.map((item) => (
                  {
                    meaning: item.name,
                    value: item.name
                  }
                ))}
                name="filterGrade"
                label="Grade"
                required={false}
                value={filters.filterGrade}
              />
            </div>
            <div className="pl-3">
              <InputSelect
                onChange={(val) =>
                  setFilters((prev) => ({
                      ...prev,
                      ["filterDifficulty"]: val?.meaning ?? "",
                  }))
                }
                handleSearch={setSearchProf}
                options={optionProficiency.data?.data.data.map((item) => (
                  {
                    meaning: item.name,
                    value: item.name
                  }
                ))}
                name="filterDifficulty"
                label="Difficulty"
                required={false}
                value={filters.filterLevel}
              />
            </div>
        </div>

        <Dialog.Footer>
          <Button
            variant={"outline"}
            onClick={() => reset()}
            //disabled={!form.watch("interviewCategoryDownload")}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
                setFilter("filterLevel", filters.filterLevel);
                setFilter("filterGrade", filters.filterGrade)
                setOpen(false);
            }}
            //disabled={!form.watch("interviewCategoryDownload")}
          >
            Apply
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
