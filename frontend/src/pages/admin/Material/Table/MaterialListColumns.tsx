import { type ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { Button } from "../../../../component/Button/button";
import { MaterialTypes } from "../types/MaterialType.types";
import { DifficultyCell } from "./cell/DifficultyCell";
import { GradeCell } from "./cell/GradeCell";
import { MaterialNameCell } from "./cell/MaterialNameCell";
import { QuizzesCell } from "./cell/QuizzesCell";
import { TopicsCell } from "./cell/TopicsCell";

export const MaterialListColumns: (
    handleEditButtonClick: (materialId: string) => void,
    handleDeleteButtonClick: (materialId: string) => void
) => ColumnDef<MaterialTypes>[] = (
    handleEditButtonClick,
    handleDeleteButtonClick
) => {
return [
    {
      id: "no",
      header: () => {
        return (
          <div className="flex gap-10 items-center">
            <span>No.</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex gap-10 items-center">
          <span>{row.index + 1}</span>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "materialName",
      enableSorting: true,
      header: () => "Material Name",
    //   header: ({ column }) => (
    //     <DataTable.ColumnSorter
    //       className="whitespace-nowrap"
    //       column={column}
    //       title="Material Name"
    //     />
    //   ),
      cell: MaterialNameCell,
    },
    {
      accessorKey: "difficulty",
      enableSorting: false,
      header: () => "Difficulty",
      cell: DifficultyCell,
    },
    {
        accessorKey: "grade",
        header: () => "Grade",
        // enableSorting: true,
        // header: ({ column }) => (
        //     <DataTable.ColumnSorter
        //         className="whitespace-nowrap"
        //         column={column}
        //         title="Grade"
        //     />
        // ),
        cell: GradeCell,
      },
    {
      accessorKey: "topicName",
      enableSorting: true,
      header: () => "Topics",
      cell: TopicsCell,
    },
    {
      accessorKey: "Quiz",
      enableSorting: true,
      header: () => "Quizzes",
      cell: QuizzesCell,
    },
    {
      accessorKey: "action",
      header: () => "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-start whitespace-nowrap">
          <Button
            leadingIcon={Edit2Icon}
            variant={"outline"}
            onClick={() => handleEditButtonClick(row.original.materialName)}
            // disabled={!row.original.editable}
          ></Button>
          <Button
            leadingIcon={TrashIcon}
            variant={"outline"}
            onClick={() => handleDeleteButtonClick(row.original.id)}
            // disabled={!row.original.editable}
          ></Button>
        </div>
      ),
    },
  ];
};
