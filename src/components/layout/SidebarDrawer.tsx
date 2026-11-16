"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Wallet,
  ShoppingBag,
  Package,
  Users,
  Truck,
  ShieldAlert,
  Wrench,
  Calculator,
  Settings,
  CreditCard,
  Building2,
  Repeat,
  ShieldCheck,
  FileSpreadsheet,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LucrixLogo } from "@/components/ui/LucrixLogo";

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
  admin?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuSections: MenuSection[] = [
    {
      title: "FINANCEIRO & CONTROLE",
      items: [
        { label: "Financeiro & DRE", href: "/financeiro", icon: Wallet, badge: "DRE" },
        { label: "Compras & Pedidos", href: "/compras", icon: Truck },
        { label: "Trocas & Catiras", href: "/catiras", icon: Repeat, badge: "Permutas" },
        { label: "Gestão de Sócios", href: "/socios", icon: Users },
      ],
    },
    {
      title: "ATENDIMENTO & OPERAÇÕES",
      items: [
        { label: "Clientes & CRM", href: "/clientes", icon: Users },
        { label: "Fornecedores", href: "/fornecedores", icon: Truck },
        { label: "Ordens de Serviço (O.S.)", href: "/servicos", icon: Wrench, badge: "Técnico" },
        { label: "Garantias & Ocorrências", href: "/garantias", icon: ShieldAlert },
      ],
    },
    {
      title: "INTELIGÊNCIA & NEGÓCIO",
      items: [
        { label: "8 Calculadoras Comerciais", href: "/calculadoras", icon: Calculator, highlight: true },
        { label: "Relatórios & Curva ABC", href: "/relatorios", icon: FileSpreadsheet },
      ],
    },
    {
      title: "SISTEMA & PLANOS",
      items: [
        { label: "Assinatura & Planos", href: "/assinatura", icon: CreditCard, badge: "Asaas" },
        { label: "Identidade & Marca", href: "/marca", icon: Sparkles, badge: "Design" },
        { label: "Configurações da Empresa", href: "/configuracoes", icon: Settings },
        { label: "Painel Super Admin", href: "/admin", icon: ShieldCheck, admin: true },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop escuro com blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card Lateral da Esquerda */}
      <div className="relative w-80 max-w-[85vw] h-full bg-dark-900 border-r border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Topo do Drawer com a Identidade Lucrix */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-dark-950/60">
          <LucrixLogo size="md" showText={true} showSlogan={true} />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-dark-800/60 hover:bg-dark-800 transition-colors btn-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegação com Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                {section.title}
              </span>
              <div className="mt-2 space-y-1">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group",
                        isActive
                          ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                          : "text-slate-300 hover:text-white hover:bg-dark-800/70"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white",
                            item.highlight && "text-emerald-400"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800 text-slate-300 border border-slate-700 font-medium">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé do Menu com Versão & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-dark-950/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300">Lucrix v1.0 Enterprise</span>
            <span className="text-[10px] text-slate-400">Hostinger Ready • Asaas Integrado</span>
          </div>
          <Link
            href="/login"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors btn-press flex items-center gap-1.5 text-xs font-semibold"
            title="Sair / Trocar Usuário"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xs:inline">Sair</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
