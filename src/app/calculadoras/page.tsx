"use client";

import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRightLeft,
  Building,
  Scale,
  CreditCard,
  Target,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CalculadorasPage() {
  const [selectedCalc, setSelectedCalc] = useState<string>("lojista");

  // State Calculadora Lojista & Revendedor
  const [calcLojista, setCalcLojista] = useState({
    custoCompra: 3000,
    melhorias: 150,
    frete: 50,
    taxaCartao: 5.5,
    margemDesejada: 25,
  });

  // State Calculadora Markup & Ponto de Equilíbrio
  const [calcEquilibrio, setCalcEquilibrio] = useState({
    custosFixosMensais: 8500, // Aluguel, salários, energia, internet
    margemContribuicaoMedia: 32, // %
    ticketMedio: 2800,
  });

  // State Calculadora Brique
  const [calcBrique, setCalcBrique] = useState({
    valorMercado: 4500,
    ofertaCompra: 2800,
    custoRevisao: 200,
    prazoDiasVenda: 15,
  });

  // State Taxas de Cartão & Parcelamento
  const [calcTaxas, setCalcTaxas] = useState({
    valorVenda: 4000,
    parcelas: 6,
    taxaPorParcela: 1.6, // taxa base aproximada
    repasseCliente: true,
  });

  // Cálculos Lojista:
  const custoTotalLojista =
    Number(calcLojista.custoCompra) + Number(calcLojista.melhorias) + Number(calcLojista.frete);
  // Preço de venda = Custo Total / (1 - (Margem% + TaxaCartao%)/100)
  const divisorLojista = 1 - (Number(calcLojista.margemDesejada) + Number(calcLojista.taxaCartao)) / 100;
  const precoSugeridoLojista =
    divisorLojista > 0 ? custoTotalLojista / divisorLojista : custoTotalLojista * 1.5;
  const lucroRealLojista = precoSugeridoLojista * (Number(calcLojista.margemDesejada) / 100);
  const taxasPagasLojista = precoSugeridoLojista * (Number(calcLojista.taxaCartao) / 100);

  // Cálculos Ponto de Equilíbrio:
  const pontoEquilibrioFinanceiro =
    calcEquilibrio.margemContribuicaoMedia > 0
      ? Number(calcEquilibrio.custosFixosMensais) /
        (Number(calcEquilibrio.margemContribuicaoMedia) / 100)
      : 0;
  const unidadesNecessarias =
    calcEquilibrio.ticketMedio > 0 ? Math.ceil(pontoEquilibrioFinanceiro / Number(calcEquilibrio.ticketMedio)) : 0;

  // Cálculos Brique:
  const custoTotalBrique = Number(calcBrique.ofertaCompra) + Number(calcBrique.custoRevisao);
  const lucroBrutoBrique = Number(calcBrique.valorMercado) - custoTotalBrique;
  const roiBrique = custoTotalBrique > 0 ? (lucroBrutoBrique / custoTotalBrique) * 100 : 0;

  const calculatorsList = [
    { id: "lojista", label: "Lojista & Revendedor", icon: Calculator, badge: "Mais Usada" },
    { id: "brique", label: "Brique & Oportunidade", icon: Sparkles },
    { id: "equilibrio", label: "Ponto de Equilíbrio & Markup", icon: Target },
    { id: "taxas", label: "Simulador de Maquininha", icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Central de Inteligência & Calculadoras
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Ferramentas matemáticas comerciais para precificação segura e proteção de margem.
          </p>
        </div>
      </div>

      {/* Menu Superior de Calculadoras */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {calculatorsList.map((calc) => {
          const Icon = calc.icon;
          const isSelected = selectedCalc === calc.id;
          return (
            <button
              key={calc.id}
              onClick={() => setSelectedCalc(calc.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-emerald-glow"
                  : "bg-dark-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-dark-850"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                {calc.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {calc.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold leading-tight">{calc.label}</span>
            </button>
          );
        })}
      </div>

      {/* CALCULADORA 1: LOJISTA & REVENDEDOR */}
      {selectedCalc === "lojista" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Parâmetros de Precificação
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custo de Compra (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcLojista.custoCompra}
                  onChange={(e) =>
                    setCalcLojista({ ...calcLojista, custoCompra: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Melhorias / Reparos (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcLojista.melhorias}
                  onChange={(e) =>
                    setCalcLojista({ ...calcLojista, melhorias: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Frete / Deslocamento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcLojista.frete}
                  onChange={(e) =>
                    setCalcLojista({ ...calcLojista, frete: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Taxa Máquina de Cartão (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcLojista.taxaCartao}
                  onChange={(e) =>
                    setCalcLojista({ ...calcLojista, taxaCartao: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Margem Líquida Desejada (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcLojista.margemDesejada}
                  onChange={(e) =>
                    setCalcLojista({ ...calcLojista, margemDesejada: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Resultado Lojista */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Preço de Venda Sugerido
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formatCurrency(precoSugeridoLojista)}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Garante {calcLojista.margemDesejada}% de lucro líquido no bolso.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-850 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Custo Total Real:</span>
                <span className="text-slate-200">{formatCurrency(custoTotalLojista)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxa Estimada da Máquina:</span>
                <span className="text-red-400">- {formatCurrency(taxasPagasLojista)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-slate-800">
                <span>Lucro Líquido Limpo:</span>
                <span>+{formatCurrency(lucroRealLojista)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 2: PONTO DE EQUILÍBRIO & MARKUP */}
      {selectedCalc === "equilibrio" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> Custos da Estrutura Operacional
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custos Fixos Mensais (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={calcEquilibrio.custosFixosMensais}
                  onChange={(e) =>
                    setCalcEquilibrio({
                      ...calcEquilibrio,
                      custosFixosMensais: Number(e.target.value),
                    })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
                <span className="text-[10px] text-slate-400">Aluguel, equipe, sistemas</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Margem de Contribuição Média (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={calcEquilibrio.margemContribuicaoMedia}
                  onChange={(e) =>
                    setCalcEquilibrio({
                      ...calcEquilibrio,
                      margemContribuicaoMedia: Number(e.target.value),
                    })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400">Margem média das vendas</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ticket Médio por Venda (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={calcEquilibrio.ticketMedio}
                  onChange={(e) =>
                    setCalcEquilibrio({
                      ...calcEquilibrio,
                      ticketMedio: Number(e.target.value),
                    })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Resultado Ponto de Equilíbrio */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Meta Mínima de Faturamento
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formatCurrency(pontoEquilibrioFinanceiro)}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Faturamento mínimo necessário para não ter prejuízo no mês.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-850 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Vendas Mínimas por Mês:</span>
                <span className="font-bold text-white">{unidadesNecessarias} negócios</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Média Diária (26 dias úteis):</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(pontoEquilibrioFinanceiro / 26)}/dia
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 3: BRIQUE & OPORTUNIDADE */}
      {selectedCalc === "brique" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Análise de Oportunidade de Compra
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Valor de Mercado do Item (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcBrique.valorMercado}
                  onChange={(e) =>
                    setCalcBrique({ ...calcBrique, valorMercado: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proposta de Compra Ofertada (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcBrique.ofertaCompra}
                  onChange={(e) =>
                    setCalcBrique({ ...calcBrique, ofertaCompra: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custo Estimado de Revisão (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcBrique.custoRevisao}
                  onChange={(e) =>
                    setCalcBrique({ ...calcBrique, custoRevisao: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimativa de Giro (Dias)
                </label>
                <input
                  type="number"
                  value={calcBrique.prazoDiasVenda}
                  onChange={(e) =>
                    setCalcBrique({ ...calcBrique, prazoDiasVenda: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Resultado Brique */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Retorno sobre Investimento (ROI)
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formatPercent(roiBrique)}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Lucro estimado de {formatCurrency(lucroBrutoBrique)} no giro de{" "}
                {calcBrique.prazoDiasVenda} dias.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-850 space-y-1.5 text-xs">
              <Badge variant={roiBrique > 20 ? "emerald" : "amber"}>
                {roiBrique > 20 ? "Excelente Oportunidade" : "Margem Apertada"}
              </Badge>
              <div className="text-[11px] text-slate-400 pt-1">
                Rentabilidade equivalente a{" "}
                <span className="font-bold text-emerald-400">
                  {((roiBrique / calcBrique.prazoDiasVenda) * 30).toFixed(1)}% ao mês
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULADORA 4: TAXAS DE CARTÃO */}
      {selectedCalc === "taxas" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Simulador de Repasse de Taxa
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Valor Limpo da Venda (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcTaxas.valorVenda}
                  onChange={(e) =>
                    setCalcTaxas({ ...calcTaxas, valorVenda: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantidade de Parcelas
                </label>
                <select
                  value={calcTaxas.parcelas}
                  onChange={(e) =>
                    setCalcTaxas({ ...calcTaxas, parcelas: Number(e.target.value) })
                  }
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 18].map((n) => (
                    <option key={n} value={n}>
                      {n}x no Cartão
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/40 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Valor para Cobrar do Cliente
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {formatCurrency(
                calcTaxas.valorVenda * (1 + (calcTaxas.parcelas * 1.45) / 100)
              )}
            </div>
            <p className="text-xs text-slate-300">
              {calcTaxas.parcelas}x de{" "}
              {formatCurrency(
                (calcTaxas.valorVenda * (1 + (calcTaxas.parcelas * 1.45) / 100)) /
                  calcTaxas.parcelas
              )}
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Você recebe exatamente {formatCurrency(calcTaxas.valorVenda)} na sua conta.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
