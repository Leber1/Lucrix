"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Plus, ShoppingBag, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenQuickActions: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenQuickActions }) => {
  const pathname = usePathname();

  const isExactActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      {/* Container Flutuante Centralizado com Blur Intenso */}
      <div className="max-w-lg mx-auto px-4 pb-2 sm:pb-3 pointer-events-auto">
        <div className="relative h-16 rounded-3xl bg-dark-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] px-2 flex items-center justify-between">
          
          {/* Item 1: Início */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative group btn-press",
              isExactActive("/") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="relative">
              <Home
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isExactActive("/") && "text-emerald-400 stroke-[2.3]"
                )}
              />
              {isExactActive("/") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-emerald-glow" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium">Início</span>
          </Link>

          {/* Item 2: Estoque */}
          <Link
            href="/estoque"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative group btn-press",
              isExactActive("/estoque") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="relative">
              <Package
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isExactActive("/estoque") && "text-emerald-400 stroke-[2.3]"
                )}
              />
              {isExactActive("/estoque") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-emerald-glow" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium">Estoque</span>
          </Link>

          {/* BOTÃO CENTRAL (+): DESTAQUE MÁXIMO COM ANEL NEON */}
          <div className="flex-1 flex items-center justify-center -mt-6">
            <button
              onClick={onOpenQuickActions}
              aria-label="Ações Rápidas"
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-dark-950 flex items-center justify-center shadow-emerald-glow-lg border-2 border-dark-900 active:scale-90 transition-all duration-200 group hover:scale-105"
            >
              {/* Anel de luz pulsante externa */}
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-md group-hover:blur-lg transition-all" />
              <Plus className="relative w-7 h-7 stroke-[3] text-dark-950 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Item 3: Vendas */}
          <Link
            href="/vendas"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative group btn-press",
              isExactActive("/vendas") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="relative">
              <ShoppingBag
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isExactActive("/vendas") && "text-emerald-400 stroke-[2.3]"
                )}
              />
              {isExactActive("/vendas") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-emerald-glow" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium">Vendas</span>
          </Link>

          {/* Item 4: Relatórios */}
          <Link
            href="/relatorios"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 relative group btn-press",
              isExactActive("/relatorios") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="relative">
              <BarChart3
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isExactActive("/relatorios") && "text-emerald-400 stroke-[2.3]"
                )}
              />
              {isExactActive("/relatorios") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-emerald-glow" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium">Relatórios</span>
          </Link>

        </div>
      </div>
    </nav>
  );
};
