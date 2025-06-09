import { FC } from "react";

type AwardProps = {
    content: string;
    color: "green" | "yellow" | "red";
}

export const AwardBadge: FC<AwardProps> = ({
    content,
    color
}) => {
    const colorMap = {
        green: {
          base: "from-green-200 to-green-400 text-green-900",
        },
        yellow: {
          base: "from-yellow-200 to-yellow-400 text-yellow-900",
        },
        red: {
          base: "from-red-200 to-red-400 text-red-900",
        },
    };

    const selected = colorMap[color];

    return (
        <div className={`relative flex text-[20px] items-center justify-center px-4 py-1 rounded-full bg-gradient-to-br ${selected.base} font-bold shadow-md overflow-hidden`}>
          <div className="text-[60px] ml-2">
            {content}
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: "translateX(-100%)",
              animation: "bling 2s ease-in-out infinite",
            }}
          ></div>

          <style>{`
            @keyframes bling {
              0% {
                transform: translateX(-100%);
                opacity: 0;
              }
              30% {
                opacity: 0.4;
              }
              50% {
                transform: translateX(100%);
                opacity: 0;
              }
              100% {
                opacity: 0;
              }
            }
          `}</style>
        </div>
    )
}