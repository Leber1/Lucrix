"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Bell, ShieldCheck, Sparkles, Building2, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LucrixLogo } from "@/components/ui/LucrixLogo";

interface NavbarProps {
  onOpenMenu: () => void;
  availableCash?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenu, availableCash = 52000 }) => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
        {/* Lado Esquerdo: Hambúrguer 3 linhas + Logomarca Oficial Lucrix */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="p-2.5 -ml-2 text-slate-300 hover:text-white rounded-2xl bg-dark-900/60 hover:bg-dark-850 border border-slate-800/80 transition-all btn-press shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center">
            <LucrixLogo size="md" showText={true} showSlogan={true} />
          </Link>
        </div>

        {/* Lado Direito: Saldo em Caixa / Notificações / Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Caixa Rápido com Efeito Vidro */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-dark-900 to-dark-850 border border-slate-800/90 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Caixa Total
              </span>
              <span className="font-extrabold text-xs text-emerald-400">
                {formatCurrency(availableCash)}
              </span>
            </div>
          </div>

          {/* Botão de Notificações com Glow */}
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative p-2.5 text-slate-300 hover:text-white rounded-2xl bg-dark-900/60 hover:bg-dark-850 border border-slate-800/80 transition-all btn-press"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-emerald-glow" />
          </button>

          {/* Empresa Ativa */}
          <Link
            href="/assinatura"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-dark-900/60 hover:bg-dark-850 border border-slate-800/80 transition-all btn-press"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs shadow-sm">
              LP
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">Lucrix Prime</span>
              <span className="text-[10px] text-emerald-400/90 font-medium leading-tight">
                Plano Pro
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </Link>
        </div>
      </div>
    </header>
  );
};
