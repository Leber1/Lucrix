"use client";

import React, { useState, useEffect } from "react";
import {
  Repeat,
  Plus,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Sparkles,
  Calendar,
  CheckCircle2,
  Package,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function CatirasPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Catira
  const [title, setTitle] = useState("");
  const [productOutName, setProductOutName] = useState("");
  const [costOut, setCostOut] = useState<number>(3000);
  const [valueOut, setValueOut] = useState<number>(4200);
  const [productInName, setProductInName] = useState("");
  const [valueIn, setValueIn] = useState<number>(1800);
  const [cashDifference, setCashDifference] = useState<number>(2000); // cliente paga volta
  const [additionalCost, setAdditionalCost] = useState<number>(50);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      if (data.trades) setTrades(data.trades);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Cálculos dinâmicos da catira
  // Entregou produto de custo C + Despesas D.
  // Recebeu produto avaliado em V + Volta em dinheiro E.
  // Lucro = (V + E) - (C + D)
  const totalCost = Number(costOut) + Number(additionalCost);
  const totalReceived = Number(valueIn) + Number(cashDifference);
  const projectedProfit = totalReceived - totalCost;

  const handleSaveTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `Permuta: ${productOutName} por ${productInName}`,
          productOutName,
          valueOut,
          costOut,
          productInName,
          valueIn,
          cashDifference,
          additionalCost,
          notes,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTrades();
      } else {
        alert("Erro ao salvar catira");
      }
    } catch (err) {
      alert("Falha na gravação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Módulo de Trocas & Catiras
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Cálculo de permuta, volta financeira, agregação de estoque e lucro apurado.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Nova Catira / Permuta
        </Button>
      </div>

      {/* Histórico de Catiras */}
      <div className="space-y-3">
        {trades.map((t: any) => (
          <div
            key={t.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-purple-400" /> {t.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(t.operationDate)}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={t.realizedProfit >= 0 ? "emerald" : "red"}>
                  {t.realizedProfit >= 0 ? "Lucrativa" : "Prejuízo"}
                </Badge>
                <span className="text-sm font-extrabold text-emerald-400">
                  +{formatCurrency(t.realizedProfit)} lucro apurado
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-dark-850">
                <span className="text-slate-400 block text-[10px]">Custo Item Entregue:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(t.costOut)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-850">
                <span className="text-slate-400 block text-[10px]">Item Recebido (Avaliado):</span>
                <span className="font-semibold text-slate-200">{formatCurrency(t.valueIn)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-850">
                <span className="text-slate-400 block text-[10px]">Volta em Dinheiro:</span>
                <span className="font-bold text-emerald-400">
                  {t.cashDifference >= 0 ? "+" : ""}
                  {formatCurrency(t.cashDifference)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-850">
                <span className="text-slate-400 block text-[10px]">Despesas da Troca:</span>
                <span className="font-medium text-slate-300">
                  {formatCurrency(t.additionalCost)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Catira com Simulador em Tempo Real */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Simulador & Registro de Troca (Catira)"
        description="Avalie a operação de permuta e apure o lucro antes de fechar negócio"
      >
        <form onSubmit={handleSaveTrade} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título da Operação
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Troca iPhone 14 Pro por iPhone 12 + R$ 2.000 volta"
              className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Produto Entregue pela Loja */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
              1. Mercadoria que Sai da Loja
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nome do Item</label>
                <input
                  type="text"
                  value={productOutName}
                  onChange={(e) => setProductOutName(e.target.value)}
                  placeholder="Ex: iPhone 14 Pro 128GB"
                  className="w-full bg-dark-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Seu Custo Histórico (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={costOut}
                  onChange={(e) => setCostOut(Number(e.target.value))}
                  className="w-full bg-dark-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Produto Recebido do Cliente */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              2. Mercadoria Recebida na Permuta
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nome do Item</label>
                <input
                  type="text"
                  value={productInName}
                  onChange={(e) => setProductInName(e.target.value)}
                  placeholder="Ex: iPhone 12 64GB Azul"
                  className="w-full bg-dark-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Valor Avaliado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={valueIn}
                  onChange={(e) => setValueIn(Number(e.target.value))}
                  className="w-full bg-dark-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Volta Financeira e Custos Extras */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Volta em Dinheiro (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={cashDifference}
                onChange={(e) => setCashDifference(Number(e.target.value))}
                placeholder="Positivo: cliente paga você"
                className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">
                Se você pagou a volta, digite negativo.
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custos Extras (Frete/Teste)
              </label>
              <input
                type="number"
                step="0.01"
                value={additionalCost}
                onChange={(e) => setAdditionalCost(Number(e.target.value))}
                className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Resultado do Negócio em Tempo Real */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-dark-850 to-dark-900 border border-emerald-500/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Investido (Custo + Despesas):</span>
              <span className="text-slate-200 font-semibold">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Recuperado (Mercadoria + Dinheiro):</span>
              <span className="text-white font-bold">{formatCurrency(totalReceived)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">Lucro Real Estimado da Catira:</span>
              <span className="text-base font-extrabold text-emerald-400">
                +{formatCurrency(projectedProfit)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Confirmar Catira
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
