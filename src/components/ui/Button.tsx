"use client";

import React from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isSuccess = false,
      isError = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-4 text-sm gap-2",
      lg: "h-13 px-6 text-base gap-2.5",
      icon: "h-11 w-11 p-0 justify-center",
    };

    const variantStyles = {
      primary:
        "bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-semibold shadow-emerald-glow hover:shadow-emerald-glow-lg border border-emerald-400/40",
      secondary:
        "bg-dark-800 hover:bg-dark-750 text-slate-100 border border-slate-700/60 shadow-sm",
      outline:
        "bg-transparent hover:bg-dark-800/80 text-slate-200 border border-slate-700/80",
      danger:
        "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30",
      ghost:
        "bg-transparent hover:bg-dark-800/60 text-slate-300 hover:text-white",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading || isSuccess}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            {size !== "icon" && <span>Processando...</span>}
          </span>
        ) : isSuccess ? (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check className="w-4 h-4 animate-bounce" />
            {size !== "icon" && <span>Concluído!</span>}
          </span>
        ) : isError ? (
          <span className="flex items-center gap-1.5 text-red-400">
            <AlertCircle className="w-4 h-4" />
            {size !== "icon" && <span>Falha</span>}
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
