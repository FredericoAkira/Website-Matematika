import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { QuizTypes } from "../../types/QuizType.types";

export const GradeCell: FC<CellContext<QuizTypes, unknown>> = ({
  row,
}) => {
  const grade = row.original.grade;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {grade || "-"}
    </div>
  );
};
