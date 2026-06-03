import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "secondary" && "border border-border bg-white text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        variant === "outline" && "border border-border text-foreground hover:bg-muted", 
        className
      )}
      
      {...props}
    />
  );
}
