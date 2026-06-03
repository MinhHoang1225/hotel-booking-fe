import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn("rounded-lg border border-border bg-white shadow-sm", className)} {...props} />;
}
