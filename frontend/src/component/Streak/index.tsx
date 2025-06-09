import React from "react";
import trophy from "../../assets/ribbon-svgrepo-com.svg";

interface StreakFlameProps {
  count: number;
  size?: number;
}

const StreakFlame: React.FC<StreakFlameProps> = ({ count, size = 40 }) => {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="mt-3"
    >
      {/* Custom SVG Flame */}
      <img src={trophy} alt="streak icon" width={size} height={size} />
      {/* Streak Count */}
        <span
            style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-40%, -90%)",
                fontSize: size * 0.4,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FFD700, #FFC107, #FFECB3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // textShadow: "0 0 3px rgba(0,0,0,0.4)",
            }}
        >
            {count}
        </span>
    </div>
  );
};

export default StreakFlame;
