"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  CreditCard,
  Building2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SuperAdminPage() {
  const [tenants] = useState([
    {
      id: "ten-1",
      name: "Lucrix Prime Store",
      trade: "Revenda de Celulares & Eletrônicos",
      plan: "PRO",
      mrr: 39.9,
      status: "ACTIVE",
      asaasId: "cus_0019283",
      joinedAt: "10/11/2026",
    },
    {
      id: "ten-2",
      name: "SmartTech Assistência",
      trade: "Assistência Técnica Apple & Samsung",
      plan: "BUSINESS",
      mrr: 79.9,
      status: "ACTIVE",
      asaasId: "cus_0019284",
      joinedAt: "12/11/2026",
    },
    {
      id: "ten-3",
      name: "Boutique Bella Donna",
      trade: "Varejo de Vestuário Feminino",
      plan: "STARTER",
      mrr: 19.9,
      status: "ACTIVE",
      asaasId: "cus_0019285",
      joinedAt: "14/11/2026",
    },
  ]);

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);
  const totalARR = totalMRR * 12;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Painel Super Admin (SaaS Metrics)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Métricas de receita recorrente (MRR), gestão de empresas assinantes e saúde comercial.
          </p>
        </div>

        <Badge variant="purple" size="md">
          Acesso Master
        </Badge>
      </div>

      {/* Indicadores SaaS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-semibold block">MRR (Receita Mensal)</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {formatCurrency(totalMRR)}
          </span>
          <span className="text-[10px] text-slate-400">Faturamento recorrente</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">ARR Projetado</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {formatCurrency(totalARR)}
          </span>
          <span className="text-[10px] text-slate-400">Projeção anualizada</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Assinantes Ativos</span>
          <span className="text-2xl font-black text-white mt-1 block">{tenants.length}</span>
          <span className="text-[10px] text-emerald-400 font-medium">0% Churn (Retenção 100%)</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Gateway Asaas</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">Online</span>
          <span className="text-[10px] text-slate-400">Webhooks operantes</span>
        </div>
      </div>

      {/* Tabela de Empresas Assinantes */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" /> Empresas Assinantes Cadastradas
        </h3>

        <div className="divide-y divide-slate-800">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-center font-bold text-white">
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {t.trade} • Desde {t.joinedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <Badge variant={t.plan === "BUSINESS" ? "purple" : "emerald"}>
                  Plano {t.plan}
                </Badge>
                <span className="font-extrabold text-white text-sm">
                  {formatCurrency(t.mrr)}/mês
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Ativo" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
