import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { TopicTypes } from "../../types/TopicType.types";

export const MaterialNameCell: FC<CellContext<TopicTypes, unknown>> = ({
  row,
}) => {
  const materialName = row.original.materialName;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {materialName || "-"}
    </div>
  );
};
