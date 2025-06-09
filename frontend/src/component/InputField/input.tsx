import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ type, className = "", ...props }, ref) => {
      return (
        // <div className={className}>
          <input
            {...props}
            ref={ref}
            className={`
                flex items-center gap-2.5 rounded transition ease-out duration-200
                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-600
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0291E5] text-neutral-default
                placeholder:text-neutral-tertiary bg-white file:rounded-full file:mr-2 text-xs file:text-xxs py-2 px-3 ${className}`} // ✅ Ensures custom styles take effect
            type={type}
          />
        // </div>
      );
    }
  );
  