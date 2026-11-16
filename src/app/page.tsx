"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ShoppingBag,
  Zap,
  Flame,
  Award,
  Camera,
  FileSpreadsheet,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MarketingStoryModal } from "@/components/modules/MarketingStoryModal";
import { ExportReportModal } from "@/components/modules/ExportReportModal";

export default function DashboardPage() {
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchStats = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Falha ao carregar dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const periods = [
    { id: "today", label: "Hoje" },
    { id: "yesterday", label: "Ontem" },
    { id: "week", label: "Semana" },
    { id: "15days", label: "15 dias" },
    { id: "30days", label: "30 dias" },
    { id: "month", label: "Este Mês" },
    { id: "year", label: "Ano" },
  ];

  const stats = data?.stats || {};
  const recentSales = data?.recentSales || [];
  const slowMoving = data?.slowMovingProducts || [];
  const accounts = data?.accounts || [];

  // Avaliação de saúde da operação
  const margin = stats.rentabilidadePercent || 25.4;
  const isHealthy = margin >= 15;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HERO BANNER EXECUTIVO COM SAUDAÇÃO & TERMÔMETRO DE LUCRO */}
      <div className="relative rounded-3xl p-5 sm:p-7 overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-dark-900 via-dark-850 to-[#0B1218] shadow-2xl">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Saudação e Contexto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-emerald-glow" />
                Painel ao Vivo
              </span>
              <span className="text-xs text-slate-400">
                • Atualizado em tempo real
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">Carlos Eduardo</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Sua operação está com <strong className="text-white font-bold">{formatPercent(margin)} de margem limpa</strong> no período selecionado. O capital em giro está saudável.
            </p>
          </div>

          {/* Termômetro de Lucratividade Executiva */}
          <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/80 backdrop-blur-md min-w-[280px] space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-emerald-400" /> Saúde do Negócio
              </span>
              <Badge variant="emerald" size="sm">
                Nível Ouro
              </Badge>
            </div>

            {/* Barra Neon de Progresso */}
            <div className="relative w-full h-3 rounded-full bg-dark-800 overflow-hidden border border-slate-700/60 p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 shadow-emerald-glow transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, Math.max(15, margin * 2.5))}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Retorno: <strong className="text-emerald-400">{formatPercent(margin)}</strong></span>
              <span className="text-slate-300">Meta: 20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SELETOR DE PERÍODOS ULTRA REFINADO & AÇÕES RÁPIDAS DE MARKETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-dark-900 border border-slate-800 shadow-sm max-w-full overflow-x-auto scrollbar-none">
          {periods.map((p) => {
            const isSelected = period === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 btn-press ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-dark-950 shadow-emerald-glow font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-dark-800"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Botões de Marketing & Exportação por Data Personalizada */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Camera className="w-3.5 h-3.5 text-amber-400" />}
            onClick={() => setIsStoryModalOpen(true)}
            className="text-xs font-bold border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            Print Story
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs font-bold border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          >
            Exportar Período
          </Button>
        </div>
      </div>

      {/* 4 CARDS PRINCIPAIS DE KPIS COM SPARKLINE & EFEITO GLASS PREMIUM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* CARD 1: FATURAMENTO BRUTO */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Faturamento
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            {formatCurrency(stats.faturamento || 0)}
          </div>

          {/* Mini Sparkline SVG elegante */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Vendas Fechadas</span>
            </div>
            <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
              <path
                d="M 2 16 Q 15 5, 30 12 T 58 4"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* CARD 2: LUCRO LÍQUIDO REAL (DESTAQUE MÁXIMO) */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 relative overflow-hidden group border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-dark-850 to-dark-900 shadow-emerald-glow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Lucro Líquido
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight font-sans">
            {formatCurrency(stats.lucroLiquidoEstimado || 0)}
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-500/30">
            <span className="text-[11px] text-slate-300 font-medium">Margem Líquida</span>
            <span className="text-xs font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              {formatPercent(margin)}
            </span>
          </div>
        </div>

        {/* CARD 3: CAPITAL IMOBILIZADO EM ESTOQUE */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Capital em Estoque
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            {formatCurrency(stats.capitalInvestidoEstoque || 0)}
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Estoque Físico</span>
            <span className="text-xs font-bold text-slate-200">
              {stats.estoqueAtualCount || 0} mercadorias
            </span>
          </div>
        </div>

        {/* CARD 4: CAIXA DISPONÍVEL IMEDIATO */}
        <div className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Caixa Disponível
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Wallet className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            {formatCurrency(stats.caixaDisponivel || 0)}
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Liquidez Imediata</span>
            <span className="text-xs font-bold text-purple-400">
              {accounts.length} contas ativas
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL: DRE VISUAL & FLUXO DE CONTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Painel Esquerdo: DRE Gerencial Interativo */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Demonstração Financeira (DRE)
              </h3>
              <p className="text-xs text-slate-400">
                Detalhamento exato de receita bruta, custos de produtos e despesas
              </p>
            </div>
            <Link
              href="/financeiro"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all btn-press"
            >
              Ver Finanças <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {/* (+) Receita Bruta */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-850 border border-slate-800/90 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  +
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Faturamento Bruto</span>
                  <span className="text-[10px] text-slate-400">Total de mercadorias e serviços</span>
                </div>
              </div>
              <span className="text-sm font-black text-white">
                {formatCurrency(stats.faturamento || 0)}
              </span>
            </div>

            {/* (-) CPV */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-850/50 border border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center font-bold text-xs">
                  -
                </div>
                <div>
                  <span className="font-semibold text-slate-300 text-xs block">
                    Custo das Mercadorias Vendidas (CPV + Melhorias)
                  </span>
                  <span className="text-[10px] text-slate-400">Custo de compra, frete e peças trocadas</span>
                </div>
              </div>
              <span className="text-sm font-bold text-red-400">
                - {formatCurrency((stats.faturamento || 0) - (stats.lucroBruto || 0))}
              </span>
            </div>

            {/* (=) Lucro Bruto */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-850 border border-emerald-500/30">
              <span className="font-bold text-slate-200">(=) Lucro Bruto da Operação</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {formatCurrency(stats.lucroBruto || 0)}
              </span>
            </div>

            {/* (-) Despesas Fixas e Variáveis */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-850/50 border border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center font-bold text-xs">
                  -
                </div>
                <div>
                  <span className="font-semibold text-slate-300 text-xs block">
                    Despesas Operacionais & Marketing
                  </span>
                  <span className="text-[10px] text-slate-400">Aluguel, ferramentas, anúncios Meta</span>
                </div>
              </div>
              <span className="text-sm font-bold text-red-400">
                - {formatCurrency(stats.despesasOperacionais || 0)}
              </span>
            </div>

            {/* (=) Lucro Líquido Real */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-dark-850 to-dark-850 border border-emerald-500/50 shadow-emerald-glow">
              <div>
                <span className="text-white font-black text-sm block">
                  (=) Lucro Líquido Real do Negócio
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Dinheiro efetivo disponível para distribuição e reinvestimento
                </span>
              </div>
              <span className="text-lg font-black text-emerald-400">
                {formatCurrency(stats.lucroLiquidoEstimado || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Painel Direito: Pagar vs Receber & Alertas de Estoque Parado */}
        <div className="space-y-4">
          {/* Card Contas a Pagar / Receber */}
          <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" /> Previsão de Entradas e Saídas
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  A Receber
                </span>
                <span className="text-base font-black text-emerald-400 mt-1 block font-sans">
                  {formatCurrency(stats.contasAReceber || 0)}
                </span>
                <span className="text-[10px] text-slate-400">Cartões e promissórias</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  A Pagar
                </span>
                <span className="text-base font-black text-red-400 mt-1 block font-sans">
                  {formatCurrency(stats.contasAPagar || 0)}
                </span>
                <span className="text-[10px] text-slate-400">Contas e fornecedores</span>
              </div>
            </div>
          </div>

          {/* Card Alerta de Mercadorias Paradas com Ação Direta */}
          <div className="glass-card rounded-3xl p-5 border border-amber-500/30 space-y-3 bg-gradient-to-br from-amber-950/10 to-dark-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Mercadorias Paradas
              </h3>
              <Badge variant="amber">{stats.slowMovingCount || 0} itens</Badge>
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-white font-bold">{formatCurrency(stats.slowMovingCapital || 0)}</strong> parados há mais de 15 dias sem giro.
            </p>

            <div className="space-y-2 pt-1">
              {slowMoving.map((p: any) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 truncate max-w-[150px] font-medium">{p.name}</span>
                  <span className="font-extrabold text-amber-400">{formatCurrency(p.targetPrice)}</span>
                </div>
              ))}
            </div>

            <Link
              href="/estoque"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition-all border border-amber-500/30 btn-press"
            >
              Criar Oferta de Giro Rápido
            </Link>
          </div>
        </div>
      </div>

      {/* FEED DE VENDAS RECENTES */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" /> Vendas Recentes & Saídas
            </h3>
            <p className="text-xs text-slate-400">Últimas transações comerciais registradas no sistema</p>
          </div>
          <Link
            href="/vendas"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-all btn-press"
          >
            Ver Todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhuma venda registrada no período selecionado.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentSales.map((sale: any) => (
              <div
                key={sale.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-dark-850/80 hover:bg-dark-800 border border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group btn-press"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                      {sale.items[0]?.title || "Venda Balcão"}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Recibo #{sale.saleNumber} • {formatDate(sale.soldAt)} • {sale.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-sm font-black text-white block font-sans">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-400">
                      +{formatCurrency(sale.grossProfit)} lucro
                    </span>
                  </div>

                  <Link
                    href="/vendas"
                    className="p-2 rounded-xl bg-dark-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Gerador de Prints de Marketing (Stories) */}
      <MarketingStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        dashboardStats={stats}
      />

      {/* Modal de Exportação de Dados por Data Personalizada */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
