import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
        className,
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";
