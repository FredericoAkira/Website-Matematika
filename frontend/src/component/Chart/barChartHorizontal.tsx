import React from "react";
import { BASE_COLORS } from "../helper"; // your colors

type BarSegment = {
  label: string;
  value: number;
};

type SideBarChartProps = {
  data: BarSegment[];
  width?: number;
  barHeight?: number;
  gap?: number;
};

const SideBarChart: React.FC<SideBarChartProps> = ({
  data,
  width = 200,
  barHeight = 20,
  gap = 15,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const totalHeight = data.length * (barHeight + gap);

  return (
    <svg width={width} height={totalHeight} className="bg-white rounded-lg p-2 w-full">
      {data.map((segment, index) => {
        const barWidth = (segment.value / maxValue) * (width - 100); // leave space for labels

        return (
          <g key={index} transform={`translate(0, ${index * (barHeight + gap)})`}>
            {/* Label */}
            <text
                x={0}
                y={barHeight / 2}
                alignmentBaseline="middle"
                fontSize="12"
                fill="#333"
                >
                {segment.label.length > 10 ? (
                    <>
                    <tspan x={0} dy="-0.5em">{segment.label.slice(0, 10)}</tspan>
                    <tspan x={0} dy="1em">{segment.label.slice(10)}</tspan>
                    </>
                ) : (
                    segment.label
                )}
                </text>

            {/* Bar */}
            <rect
              x={80}
              y={0}
              width={barWidth}
              height={barHeight}
              fill={BASE_COLORS[index % BASE_COLORS.length]}
              rx={4}
              ry={4}
            />

            {/* Value text */}
            <text
              x={80 + barWidth + 5}
              y={barHeight / 2}
              alignmentBaseline="middle"
              fontSize="12"
              fill="black"
            >
              {segment.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default SideBarChart;
