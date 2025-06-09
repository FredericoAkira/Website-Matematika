import { CellContext } from "@tanstack/react-table";
import { FC } from "react";
import { StudentTypes } from "../../types/StudentTypes.types";

export const GradeCell: FC<CellContext<StudentTypes, unknown>> = ({
  row,
}) => {
  const grade = row.original.grade;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {grade || "-"}
    </div>
  );
};