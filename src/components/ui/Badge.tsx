import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "amber" | "red" | "blue" | "slate" | "purple";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "emerald",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wide",
    md: "px-2.5 py-1 text-xs font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border uppercase font-mono tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
