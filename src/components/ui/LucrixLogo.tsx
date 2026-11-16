"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LucrixLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSlogan?: boolean;
}

export const LucrixLogo: React.FC<LucrixLogoProps> = ({
  className,
  size = "md",
  showText = true,
  showSlogan = false,
}) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Símbolo Monograma LX com Geometria 3D de Precisão & Glow Esmeralda */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl p-[1.5px] transition-all duration-300 group-hover:scale-105",
          iconSizes[size]
        )}
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-600/40 via-emerald-400/30 to-emerald-300/10 blur-md group-hover:blur-lg transition-all" />

        {/* Borda com gradiente aeroespacial */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-dark-900" />

        {/* Corpo do Ícone */}
        <div className="relative w-full h-full bg-[#080B11] rounded-[14px] flex items-center justify-center overflow-hidden border border-emerald-500/30 shadow-inner">
          {/* Reflexo sutil de vidro diagonal */}
          <div className="absolute -top-10 -left-10 w-24 h-12 bg-white/10 rotate-45 pointer-events-none blur-[1px]" />

          {/* SVG Geométrico do Monograma LX */}
          <svg
            viewBox="0 0 100 100"
            className="w-3/4 h-3/4 drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="emeraldMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="45%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="emeraldAccent" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>

            {/* Letra L com chanfro tecnológico */}
            <path
              d="M 22 18 L 22 76 C 22 79 25 82 28 82 L 48 82 C 51 82 52 80 50 78 L 38 66 L 38 18 C 38 15 35 14 32 14 L 28 14 C 25 14 22 15 22 18 Z"
              fill="url(#emeraldMain)"
            />

            {/* Letra X - Barra 1 (Descendente) */}
            <path
              d="M 44 22 C 42 19 44 16 48 16 L 56 16 C 59 16 62 18 64 21 L 86 64 C 88 67 86 70 82 70 L 74 70 C 71 70 68 68 66 65 Z"
              fill="url(#emeraldMain)"
            />

            {/* Letra X - Barra 2 (Ascendente com Seta de Lucro integrada) */}
            <path
              d="M 46 68 C 43 68 41 66 42 63 L 64 26 C 66 23 69 21 72 21 L 82 21 C 86 21 88 24 85 28 L 68 60 C 66 64 63 68 59 68 Z"
              fill="url(#emeraldAccent)"
            />

            {/* Ponta da Seta Superior de Crescimento Financeiro */}
            <polygon
              points="76,14 88,14 88,26"
              fill="#34D399"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Tipografia da Marca Lucrix */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                "font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-sans uppercase",
                textSizes[size]
              )}
            >
              LUCRIX
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 tracking-wider">
              PRO
            </span>
          </div>

          {showSlogan && (
            <span className="text-[10px] font-medium tracking-wide text-emerald-400/90 mt-1 uppercase">
              Sua operação no lucro
            </span>
          )}
        </div>
      )}
    </div>
  );
};
