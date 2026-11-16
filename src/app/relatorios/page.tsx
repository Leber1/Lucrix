"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Package,
  Layers,
  Sparkles,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("30days");

  // Dados consolidados de inteligência
  const topProducts = [
    { name: "iPhone 15 Pro Max 256GB Titânio", faturamento: 20370, lucro: 4110, margem: 20.2, qty: 3 },
    { name: "iPhone 14 Pro 128GB Roxo", faturamento: 14970, lucro: 2880, margem: 19.2, qty: 3 },
    { name: "Galaxy S24 Ultra 512GB", faturamento: 12380, lucro: 2580, margem: 20.8, qty: 2 },
    { name: "iPhone 13 128GB Meia-Noite", faturamento: 9870, lucro: 2490, margem: 25.2, qty: 3 },
  ];

  const categoryMargin = [
    { category: "Smartphones Apple", volume: 45210, margemMedia: 21.4, percentVendas: 65.7 },
    { category: "Smartphones Samsung", volume: 12380, margemMedia: 20.8, percentVendas: 18.0 },
    { category: "Assistência & Manutenção", volume: 6800, margemMedia: 62.5, percentVendas: 9.9 },
    { category: "Acessórios & Cabos", volume: 4410, margemMedia: 48.0, percentVendas: 6.4 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Relatórios Estratégicos & Curva ABC
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Inteligência de precificação, produtos mais rentáveis e giro de mercadorias.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Exportar Relatório PDF
        </Button>
      </div>

      {/* Curva ABC de Produtos Mais Rentáveis */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Curva ABC — Campeões de Lucro
            </h3>
            <p className="text-xs text-slate-400">Mercadorias que mais geraram dinheiro limpo no caixa</p>
          </div>
          <Badge variant="emerald">Classe A (80% do Lucro)</Badge>
        </div>

        <div className="space-y-2.5">
          {topProducts.map((p, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                  {i + 1}º
                </div>
                <div>
                  <h4 className="font-bold text-white">{p.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {p.qty} unidades vendidas • Faturamento {formatCurrency(p.faturamento)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-slate-400 block">Margem Líquida</span>
                  <span className="font-semibold text-slate-200">{formatPercent(p.margem)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block font-medium">Lucro Total</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    +{formatCurrency(p.lucro)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rentabilidade por Categoria */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Desempenho por Categoria
        </h3>

        <div className="divide-y divide-slate-800">
          {categoryMargin.map((c, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">{c.category}</h4>
                <p className="text-[11px] text-slate-400">
                  {formatCurrency(c.volume)} em vendas ({c.percentVendas}% do faturamento)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Margem Média</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {formatPercent(c.margemMedia)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
