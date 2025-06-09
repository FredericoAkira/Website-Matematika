import React from "react";
import { BASE_COLORS } from "../helper";
import { cn } from "../utils";
import { Segment } from "./types";

type LegendProps = {
  data: Segment[];
  className?: string | undefined;
};

const Legend: React.FC<LegendProps> = ({ data, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <span
            className="w-4 h-4 rounded-sm inline-block"
            style={{ backgroundColor: BASE_COLORS[index % BASE_COLORS.length] }}
          ></span>
          <span className="text-sm mb-0.5">{item.label ?? `Item ${index + 1}`}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
