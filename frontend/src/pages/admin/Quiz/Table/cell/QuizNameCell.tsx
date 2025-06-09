import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { QuizTypes } from "../../types/QuizType.types";

export const QuizNameCell: FC<CellContext<QuizTypes, unknown>> = ({
  row,
}) => {
  const quizName = row.original.quizName;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {quizName || "-"}
    </div>
  );
};
