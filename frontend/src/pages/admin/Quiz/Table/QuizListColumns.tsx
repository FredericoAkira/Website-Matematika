import { type ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { Button } from "../../../../component/Button/button";
import { QuizTypes } from "../types/QuizType.types";
import { ContentCountCell } from "./cell/ContentCountCell";
import { DifficultyCell } from "./cell/DifficultyCell";
import { GradeCell } from "./cell/GradeCell";
import { MaterialNameCell } from "./cell/MaterialNameCell";
import { QuizNameCell } from "./cell/QuizNameCell";

export const QuizListColumns: (
    handleEditButtonClick: (topicName: string) => void,
    handleDeleteButtonClick: (topicId: string) => void
) => ColumnDef<QuizTypes>[] = (
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
      size: 10,
    },
    {
      accessorKey: "quizName",
      enableSorting: true,
      header: () => "Quiz Name",
      cell: QuizNameCell,
    },
    {
      accessorKey: "materialName",
      enableSorting: false,
      header: () => "Material Name",
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
      enableSorting: false,
      header: () => "Grade",
      cell: GradeCell,
    },
    {
      accessorKey: "content",
      enableSorting: true,
      header: () => "Content",
      cell: ContentCountCell,
    },
    {
      accessorKey: "action",
      header: () => "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-start whitespace-nowrap">
          <Button
            leadingIcon={Edit2Icon}
            variant={"outline"}
            onClick={() => handleEditButtonClick(row.original.quizName)}
            // disabled={!row.original.editable}
          ></Button>
          <Button
            leadingIcon={TrashIcon}
            variant={"outline"}
            onClick={() => handleDeleteButtonClick(row.original.quizId)}
            // disabled={!row.original.editable}
          ></Button>
        </div>
      ),
    },
  ];
};
