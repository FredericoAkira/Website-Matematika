type ProgressBarProps = {
    value: number;
  };
  
export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
    return (
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
        <span className={`absolute inset-0 text-xs text-center ${value < 50 ? "text-[#00639D]" : "text-white"} font-semibold leading-4`}>
          {value}%
        </span>
      </div>
    );
};
