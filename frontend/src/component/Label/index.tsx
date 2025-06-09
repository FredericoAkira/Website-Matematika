import { forwardRef, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: ReactNode;
  size?: string;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, size, required, ...props }, ref) => {
    return (
        <div className="flex flex-row gap-0.5">
            <label
            {...props}
            ref={ref}
            className={cn("text-left text-sm text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-50", size, className)}
            >
            {children}
            </label>
            {required && (<span className="text-red-600 -mt-0.5">*</span>)}
        </div>
    );
  }
);

Label.displayName = "Label";
