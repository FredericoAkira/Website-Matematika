import React, { useState } from "react";
import { BASE_COLORS } from "../helper";
import { Segment } from "./types";

type DonutChartProps = {
  data: Segment[];
  size?: number;
  strokeWidth?: number;
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 150,
  strokeWidth = 20,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((segment, index) => {
          const isHovered = hoverIndex === index;
          const valuePercent = segment.value / total;
          const dashLength = valuePercent * circumference;

          const circleProps: React.SVGProps<SVGCircleElement> = {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: BASE_COLORS[index % BASE_COLORS.length],
            strokeWidth: isHovered ? strokeWidth + 6 : strokeWidth,
            strokeDasharray: `${dashLength} ${circumference - dashLength}`,
            strokeDashoffset: -cumulativeOffset,
            strokeLinecap: "butt",
            style: {
              transition: "stroke-width 0.3s ease",
              cursor: "pointer",
            },
            onMouseEnter: () => setHoverIndex(index),
            onMouseLeave: () => setHoverIndex(null),
          };

          cumulativeOffset += dashLength;

          return <circle key={index} {...circleProps} />;
        })}
      </g>

      {/* Center text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="#333"
        >
          {hoverIndex !== null ? `${data[hoverIndex].label} ${data[hoverIndex].value}` : total}
        </text>
    </svg>
  );
};

export default DonutChart;
