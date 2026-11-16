"use client";

import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  Check,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LucrixLogo } from "@/components/ui/LucrixLogo";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const firstDayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDayMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  if (!isOpen) return null;

  const handleFetchPreview = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reports/export?startDate=${startDate}&endDate=${endDate}&format=json`
      );
      const data = await res.json();
      if (data.success) {
        setReportData(data);
      }
    } catch (e) {
      alert("Erro ao buscar dados do período");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open(
      `/api/reports/export?startDate=${startDate}&endDate=${endDate}&format=csv`,
      "_blank"
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[95vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Exportar Levantamento por Data Personalizada
              </h3>
              <p className="text-xs text-slate-400">
                Gere demonstrativos em PDF ou planilhas Excel (CSV)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-dark-850 hover:bg-dark-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seleção de Datas */}
        <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Escolha o Intervalo de Datas
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="w-full font-bold btn-press"
            isLoading={loading}
            onClick={handleFetchPreview}
          >
            Calcular Levantamento do Período
          </Button>
        </div>

        {/* Resumo do Levantamento */}
        {reportData && (
          <div className="p-5 rounded-2xl bg-dark-850 border border-emerald-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Resumo Consolidado ({formatDate(startDate)} até {formatDate(endDate)})
              </span>
              <Badge variant="emerald">
                {reportData.summary.qtdVendas} Vendas
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Faturamento Bruto</span>
                <span className="text-sm font-extrabold text-white mt-0.5 block font-sans">
                  {formatCurrency(reportData.summary.totalFaturamento)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Custo Mercadorias</span>
                <span className="text-sm font-semibold text-red-400 mt-0.5 block font-sans">
                  - {formatCurrency(reportData.summary.totalCustoVendas)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-dark-900 border border-emerald-500/40">
                <span className="text-emerald-400 block text-[10px] font-bold">Lucro Líquido Real</span>
                <span className="text-sm font-black text-emerald-400 mt-0.5 block font-sans">
                  +{formatCurrency(reportData.summary.totalLucroLiquido)}
                </span>
              </div>
            </div>

            {/* Ações de Exportação: PDF e Excel */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                className="font-bold"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrintPdf}
              >
                Imprimir / Salvar PDF
              </Button>

              <Button
                variant="primary"
                size="md"
                className="font-bold shadow-emerald-glow"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleDownloadCsv}
              >
                Baixar Planilha Excel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
