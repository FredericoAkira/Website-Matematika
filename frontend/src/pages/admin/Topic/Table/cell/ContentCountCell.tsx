import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { TopicTypes } from "../../types/TopicType.types";

export const ContentCountCell: FC<CellContext<TopicTypes, unknown>> = ({
  row,
}) => {
  const contentCount = row.original.totalContent;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {contentCount || "-"}
    </div>
  );
};
