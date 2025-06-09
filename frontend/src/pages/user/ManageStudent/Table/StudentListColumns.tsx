import { type ColumnDef } from "@tanstack/react-table";
import { EyeIcon, TrashIcon } from "lucide-react";
import { Button } from "../../../../component/Button/button";
import { DataTable } from "../../../../component/DataTable";
import { StudentTypes } from "../types/StudentTypes.types";
import { FullNameCell } from "./cell/FullNameCell";
import { GradeCell } from "./cell/GradeCell";
import { LatestMaterialCell } from "./cell/LatestMaterial";
import { LatestQuizCell } from "./cell/LatestQuiz";
import { StatusCell } from "./cell/StatusCell";


export const StudentListColumns: (
    handleOpenDetail: (studentId: string) => void,
    handleDeleteButtonClick: (materialId: string) => void
) => ColumnDef<StudentTypes>[] = (
    handleOpenDetail,
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
      size: 10,
    },

    {
      accessorKey: "fullName",
      enableSorting: true,
      header: () => "Full Name",
    //   header: ({ column }) => (
    //     <DataTable.ColumnSorter
    //       className="whitespace-nowrap"
    //       column={column}
    //       title="Material Name"
    //     />
    //   ),
      cell: FullNameCell,
    },
    
    {
      accessorKey: "topicName",
      enableSorting: true,
      header: () => "Materi Terakhir",
      cell: LatestMaterialCell,
    },
    
    {
      accessorKey: "Quiz",
      enableSorting: true,
      header: () => "Kuis Terakhir",
      cell: LatestQuizCell,
    },

    {
      accessorKey: "status",
        enableSorting: true,
        header: ({ column }) => (
            <DataTable.ColumnSorter
                className="whitespace-nowrap"
                column={column}
                title="Status"
            />
        ),
        cell: StatusCell,
    },

    {
        accessorKey: "grade",
        enableSorting: true,
        header: ({ column }) => (
            <DataTable.ColumnSorter
                className="whitespace-nowrap"
                column={column}
                title="Grade"
            />
        ),
        cell: GradeCell,
    },
    

    {
      accessorKey: "action",
      header: () => "Action",
      cell: ({ row }) => (
        <div className="flex md:flex-col lg:flex-row items-center justify-start whitespace-nowrap md:gap-2">
          <Button
            className="cursor-pointer"
            leadingIcon={EyeIcon}
            variant={"outline"}
            onClick={() => handleOpenDetail(row.original.id)}
            // disabled={!row.original.editable}
          ></Button>
          <Button
            className="cursor-pointer"
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
