import { type CellContext } from "@tanstack/react-table";
import { type FC } from "react";
import { TopicTypes } from "../../types/TopicType.types";

export const TopicNameCell: FC<CellContext<TopicTypes, unknown>> = ({
  row,
}) => {
  const topicName = row.original.topicName;
  return (
    <div className="flex-col items-center justify-start text-wrap max-w-30">
      {topicName || "-"}
    </div>
  );
};
