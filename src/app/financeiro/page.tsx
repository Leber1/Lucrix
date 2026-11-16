"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  CreditCard,
  Banknote,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<"fluxo" | "contas" | "receber" | "dre">("fluxo");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal Novo Lançamento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [formCategory, setFormCategory] = useState("GERAL");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formAccountId, setFormAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/financial");
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.accounts?.length > 0 && !formAccountId) {
          setFormAccountId(json.accounts[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formAmount <= 0) return alert("Informe um valor válido");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          category: formCategory,
          description: formDescription,
          amount: formAmount,
          accountId: formAccountId,
          status: "PAID",
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormDescription("");
        setFormAmount(0);
        fetchFinance();
      }
    } catch (e) {
      alert("Erro ao salvar lançamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = data?.metrics || {};
  const accounts = data?.accounts || [];
  const transactions = data?.transactions || [];
  const pendingReceivables = data?.pendingReceivables || [];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestão Financeira & DRE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Controle de fluxo de caixa, carteiras bancárias e competência vs caixa.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Novo Lançamento
        </Button>
      </div>

      {/* Indicadores Principais de Liquidez */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-emerald-500/30">
          <span className="text-[11px] font-medium text-emerald-400 block">Saldo em Caixa</span>
          <span className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 block">
            {formatCurrency(metrics.totalBalance)}
          </span>
          <span className="text-[10px] text-slate-400">Total nas carteiras ativas</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">A Receber (Cartões/Prazo)</span>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block">
            {formatCurrency(metrics.totalReceivables)}
          </span>
          <span className="text-[10px] text-slate-400">Futuros créditos programados</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">A Pagar Programado</span>
          <span className="text-lg sm:text-2xl font-extrabold text-red-400 mt-0.5 block">
            {formatCurrency(metrics.totalPayables)}
          </span>
          <span className="text-[10px] text-slate-400">Contas fixas e fornecedores</span>
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "fluxo", label: "Fluxo de Caixa" },
          { id: "contas", label: "Carteiras & Bancos" },
          { id: "receber", label: "Contas a Receber" },
          { id: "dre", label: "DRE Gerencial" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO DA ABA 1: FLUXO DE CAIXA */}
      {activeTab === "fluxo" && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Extrato de Lançamentos
          </h3>

          <div className="divide-y divide-slate-800">
            {transactions.map((t: any) => (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between text-xs hover:bg-dark-850/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      t.type === "INCOME"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {t.type === "INCOME" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t.description}</h4>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(t.date)} • {t.category} • {t.account?.name || "Geral"}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-sm font-extrabold ${
                    t.type === "INCOME" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"} {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: CARTEIRAS E CONTAS BANCÁRIAS */}
      {activeTab === "contas" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {accounts.map((acc: any) => (
            <div
              key={acc.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {acc.type}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{acc.name}</h4>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  {formatCurrency(acc.balance)}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Status: Ativa</span>
                {acc.isDefault && <Badge variant="emerald">Padrão</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: CONTAS A RECEBER */}
      {activeTab === "receber" && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Previsão de Entradas (Parcelas a Receber)
          </h3>
          <div className="space-y-2">
            {pendingReceivables.map((r: any) => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-white">
                    Parcela {r.number}/{r.totalCount} — Venda #{r.sale?.saleNumber}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cliente: {r.sale?.customer?.name || "Balcão"} • Vencimento: {formatDate(r.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 text-sm block">
                    {formatCurrency(r.amount)}
                  </span>
                  <Badge variant="amber">Pendente</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 4: DRE GERENCIAL COMPLETA */}
      {activeTab === "dre" && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 max-w-2xl mx-auto">
          <div className="text-center pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Demonstrativo do Resultado do Exercício (DRE)</h3>
            <p className="text-xs text-slate-400">Visão sintética contábil de competência da operação</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-dark-850">
              <span className="text-slate-300 font-semibold">(+) RECEITA BRUTA DE VENDAS</span>
              <span className="font-bold text-white">{formatCurrency(68800)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-dark-850/60">
              <span className="text-slate-400">(-) CUSTO DAS MERCADORIAS VENDIDAS (CPV)</span>
              <span className="font-medium text-red-400">- {formatCurrency(46500)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-dark-850 border border-slate-800">
              <span className="text-emerald-400 font-bold">(=) LUCRO BRUTO OPERACIONAL</span>
              <span className="font-extrabold text-emerald-400">{formatCurrency(22300)} (32.4%)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-dark-850/60">
              <span className="text-slate-400">(-) DESPESAS OPERACIONAIS & MARKETING</span>
              <span className="font-medium text-red-400">- {formatCurrency(5400)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-dark-850/60">
              <span className="text-slate-400">(-) RETIRADA DE PRÓ-LABORE DOS SÓCIOS</span>
              <span className="font-medium text-red-400">- {formatCurrency(5000)}</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-dark-850 border border-emerald-500/40 text-sm">
              <span className="text-white font-extrabold">(=) LUCRO LÍQUIDO REAL</span>
              <span className="font-black text-emerald-400">{formatCurrency(11900)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Lançamento */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento Financeiro"
        description="Registre uma despesa, custo fixo ou receita avulsa"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormType("EXPENSE")}
              className={`p-3 rounded-xl border font-bold text-xs ${
                formType === "EXPENSE"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-dark-850 text-slate-400 border-slate-800"
              }`}
            >
              Despesa (-)
            </button>
            <button
              type="button"
              onClick={() => setFormType("INCOME")}
              className={`p-3 rounded-xl border font-bold text-xs ${
                formType === "INCOME"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-dark-850 text-slate-400 border-slate-800"
              }`}
            >
              Receita (+)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Descrição do Lançamento *
            </label>
            <input
              type="text"
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Ex: Aluguel, Anúncios Meta, Embalagens"
              className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(Number(e.target.value))}
                className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Conta / Carteira
              </label>
              <select
                value={formAccountId}
                onChange={(e) => setFormAccountId(e.target.value)}
                className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatCurrency(a.balance)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Salvar Lançamento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
