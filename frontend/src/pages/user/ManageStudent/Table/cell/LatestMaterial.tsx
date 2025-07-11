import { CellContext } from "@tanstack/react-table";
import { FC } from "react";
import { StudentTypes } from "../../types/StudentTypes.types";


export const LatestMaterialCell: FC<CellContext<StudentTypes, unknown>> = ({
  row,
}) => {
  const materialName = row.original.latestTopic;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {materialName || "-"}
    </div>
  );
}