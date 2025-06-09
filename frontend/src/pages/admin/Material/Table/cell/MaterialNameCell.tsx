import { CellContext } from "@tanstack/react-table";
import { FC } from "react";
import { MaterialTypes } from "../../types/MaterialType.types";

export const MaterialNameCell: FC<CellContext<MaterialTypes, unknown>> = ({
  row,
}) => {
  const materialName = row.original.materialName;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {materialName || "-"}
    </div>
  );
}