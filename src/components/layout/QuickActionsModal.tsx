"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  PackagePlus,
  Repeat,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductWizard: () => void;
  onOpenSaleModal: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onOpenProductWizard,
  onOpenSaleModal,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      label: "Nova Venda",
      desc: "Vender produtos ou serviços e emitir recibo",
      icon: ShoppingBag,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      onClick: () => {
        onClose();
        onOpenSaleModal();
      },
    },
    {
      label: "Cadastrar Produto",
      desc: "Assistente guiado em 5 etapas com rascunhos",
      icon: PackagePlus,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      onClick: () => {
        onClose();
        onOpenProductWizard();
      },
    },
    {
      label: "Registrar Troca / Catira",
      desc: "Permuta com produto recebido e volta em dinheiro",
      icon: Repeat,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      href: "/catiras",
    },
    {
      label: "Nova Compra",
      desc: "Entrada de lote ou compra com fornecedor",
      icon: Truck,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      href: "/compras",
    },
    {
      label: "Lançar Despesa",
      desc: "Despesas fixas, variáveis ou custos extras",
      icon: ArrowDownRight,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      href: "/financeiro?tab=despesas",
    },
    {
      label: "Ordem de Serviço (O.S.)",
      desc: "Manutenção de aparelhos, orçamentos e peças",
      icon: Wrench,
      color: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      href: "/servicos",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Action Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-dark-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Ações Rápidas
            </h3>
            <p className="text-xs text-slate-400">Selecione a operação desejada</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {actions.map((act, i) => {
            const Icon = act.icon;
            if (act.href) {
              return (
                <Link
                  key={i}
                  href={act.href}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
                      act.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {act.label}
                    </h4>
                    <p className="text-xs text-slate-400">{act.desc}</p>
                  </div>
                </Link>
              );
            }

            return (
              <button
                key={i}
                onClick={act.onClick}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-slate-700 transition-all text-left group w-full"
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
                    act.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-xs text-slate-400">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
