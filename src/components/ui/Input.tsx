import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref} 
        className={cn(
          "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";