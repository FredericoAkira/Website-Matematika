import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { QuizTypes } from "../../types/QuizType.types";

export const ContentCountCell: FC<CellContext<QuizTypes, unknown>> = ({
  row,
}) => {
  const contentCount = row.original.totalContent;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {contentCount || "-"}
    </div>
  );
};
