"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  TrendingUp,
  Percent,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function SociosPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [distributionType, setDistributionType] = useState("PROFIT_SHARE");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      if (data.partners) {
        setPartners(data.partners);
        if (data.partners.length > 0 && !selectedPartnerId) {
          setSelectedPartnerId(data.partners[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const totalCapital = partners.reduce((acc, p) => acc + (p.totalCapitalInvested || 0), 0);
  const totalWithdrawn = partners.reduce((acc, p) => acc + (p.totalWithdrawn || 0), 0);

  const handleSaveDistribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Informe um valor válido");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: selectedPartnerId,
          amount,
          type: distributionType,
          notes,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setAmount(0);
        setNotes("");
        fetchPartners();
      }
    } catch (e) {
      alert("Erro ao registrar operação");
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
            Gestão Societária & Distribuição de Lucros
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Controle de cotas societárias, aportes de capital e retiradas de pró-labore.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Lançar Retirada / Aporte
        </Button>
      </div>

      {/* Indicadores Societários */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Capital Social Aportado</span>
          <span className="text-xl font-extrabold text-white mt-1 block">
            {formatCurrency(totalCapital)}
          </span>
          <span className="text-[10px] text-slate-400">Total investido pelos sócios</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/30">
          <span className="text-[11px] font-medium text-emerald-400 block">Lucros Distribuídos</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
            {formatCurrency(totalWithdrawn)}
          </span>
          <span className="text-[10px] text-slate-300">Total retirado no histórico</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-slate-400 block">Sócios Ativos</span>
          <span className="text-xl font-extrabold text-slate-200 mt-1 block">
            {partners.length} Sócios
          </span>
          <span className="text-[10px] text-slate-400">100% das cotas distribuídas</span>
        </div>
      </div>

      {/* Cards dos Sócios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  {partner.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{partner.name}</h3>
                  <p className="text-xs text-slate-400">{partner.email || partner.phone}</p>
                </div>
              </div>
              <Badge variant="emerald">{partner.sharePercentage}% Cota</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Capital Aportado:</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {formatCurrency(partner.totalCapitalInvested)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total de Retiradas:</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                  {formatCurrency(partner.totalWithdrawn)}
                </span>
              </div>
            </div>

            {/* Histórico Recente de Distribuições */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Últimos Lançamentos
              </span>
              {partner.distributions && partner.distributions.length > 0 ? (
                <div className="space-y-1.5">
                  {partner.distributions.slice(0, 3).map((d: any) => (
                    <div
                      key={d.id}
                      className="p-2 rounded-lg bg-dark-850 flex justify-between text-xs text-slate-300"
                    >
                      <span>
                        {d.type === "CAPITAL_INJECTION" ? "Aporte" : "Distribuição de Lucro"} •{" "}
                        {formatDate(d.date)}
                      </span>
                      <span className="font-bold text-white">{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Nenhuma distribuição recente.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lançar Aporte / Retirada */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Operação de Capital Societário"
        description="Registre retirada de lucros, pró-labore ou injeção de capital"
      >
        <form onSubmit={handleSaveDistribution} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Selecione o Sócio
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sharePercentage}% cota)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDistributionType("PROFIT_SHARE")}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                distributionType === "PROFIT_SHARE"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-dark-850 text-slate-400 border-slate-800"
              }`}
            >
              Distribuição de Lucro
            </button>
            <button
              type="button"
              onClick={() => setDistributionType("CAPITAL_INJECTION")}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                distributionType === "CAPITAL_INJECTION"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                  : "bg-dark-850 text-slate-400 border-slate-800"
              }`}
            >
              Aporte de Capital
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0,00"
              className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Observações</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Fechamento trimestral de lucros"
              className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Confirmar Operação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
