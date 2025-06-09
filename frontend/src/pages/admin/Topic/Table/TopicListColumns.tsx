import { type ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { Button } from "../../../../component/Button/button";
import { TopicTypes } from "../types/TopicType.types";
import { ContentCountCell } from "./cell/ContentCountCell";
import { MaterialNameCell } from "./cell/MaterialNameCell";
import { TopicNameCell } from "./cell/TopicNameCell";

export const TopicListColumns: (
    handleEditButtonClick: (topicName: string) => void,
    handleDeleteButtonClick: (topicId: string) => void
) => ColumnDef<TopicTypes>[] = (
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
      accessorKey: "topicName",
      enableSorting: true,
      header: () => "Topic Name",
      cell: TopicNameCell,
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
            onClick={() => handleEditButtonClick(row.original.topicName)}
            // disabled={!row.original.editable}
          ></Button>
          <Button
            leadingIcon={TrashIcon}
            variant={"outline"}
            onClick={() => handleDeleteButtonClick(row.original.topicId)}
            // disabled={!row.original.editable}
          ></Button>
        </div>
      ),
    },
  ];
};
