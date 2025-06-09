import { CellContext } from "@tanstack/react-table";
import { FC } from "react";
import { MaterialTypes } from "../../types/MaterialType.types";

export const GradeCell: FC<CellContext<MaterialTypes, unknown>> = ({
  row,
}) => {
  const grade = row.original.grade;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {grade || "-"}
    </div>
  );
};