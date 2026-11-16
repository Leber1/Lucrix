"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Printer,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  QrCode,
  Banknote,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SaleModal } from "@/components/modules/SaleModal";
import { Modal } from "@/components/ui/Modal";

export default function VendasPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales");
      const data = await res.json();
      if (data.sales) {
        setSales(data.sales);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const totalFaturamento = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalLucro = sales.reduce((acc, s) => acc + (s.grossProfit || 0), 0);
  const ticketMedio = sales.length > 0 ? totalFaturamento / sales.length : 0;

  const filteredSales = sales.filter((s) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const customer = s.customer?.name?.toLowerCase() || "";
    const item = s.items[0]?.title?.toLowerCase() || "";
    const num = String(s.saleNumber);
    return customer.includes(term) || item.includes(term) || num.includes(term);
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Histórico de Vendas & PDV
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Registro comercial de saídas, múltiplos pagamentos e emissão de recibos.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsSaleModalOpen(true)}
        >
          Nova Venda (PDV)
        </Button>
      </div>

      {/* Indicadores de Vendas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Total Vendido</span>
          <span className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 block">
            {formatCurrency(totalFaturamento)}
          </span>
          <span className="text-[10px] text-slate-400">{sales.length} vendas registradas</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-emerald-500/30">
          <span className="text-[11px] font-medium text-emerald-400 block">Lucro Real Apurado</span>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block">
            +{formatCurrency(totalLucro)}
          </span>
          <span className="text-[10px] text-slate-300">Margem real apurada</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Ticket Médio</span>
          <span className="text-lg sm:text-2xl font-extrabold text-slate-200 mt-0.5 block">
            {formatCurrency(ticketMedio)}
          </span>
          <span className="text-[10px] text-slate-400">Por negociação</span>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cliente, mercadoria ou número do recibo..."
          className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Lista de Vendas */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Carregando histórico...</div>
      ) : filteredSales.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-400" />
          <h4 className="text-sm font-bold text-white">Nenhuma venda encontrada</h4>
          <p className="text-xs text-slate-400 mt-1">Registre sua primeira venda pelo botão acima.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      #{sale.saleNumber}
                    </span>
                    <Badge variant={sale.paymentStatus === "PAID" ? "emerald" : "amber"}>
                      {sale.paymentStatus === "PAID" ? "Pago" : "A Prazo / Misto"}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(sale.soldAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {sale.items[0]?.title || "Venda Balcão"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cliente: {sale.customer?.name || "Balcão (Não identificado)"} • Forma: {sale.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Valores e Botão de Recibo */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-extrabold text-white block">
                    {formatCurrency(sale.totalAmount)}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    +{formatCurrency(sale.grossProfit)} lucro
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedReceipt(sale)}
                >
                  Recibo
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Nova Venda */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSuccess={fetchSales}
      />

      {/* Modal do Recibo */}
      {selectedReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
          title={`Recibo de Venda #${selectedReceipt.saleNumber}`}
          description="Comprovante de pagamento e garantia de compra"
        >
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-700">
                <h3 className="font-bold text-sm text-white font-sans">
                  LUCRIX PRIME STORE
                </h3>
                <p className="text-[11px] text-slate-400">Sua Operação no Lucro</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Documento Não Fiscal de Venda #{selectedReceipt.saleNumber}
                </p>
                <p className="text-[10px] text-slate-400">{formatDate(selectedReceipt.soldAt)}</p>
              </div>

              <div className="space-y-1.5 py-2 border-b border-dashed border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">CLIENTE:</span>
                  <span className="text-white font-sans font-semibold">
                    {selectedReceipt.customer?.name || "Consumidor Balcão"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MERCADORIA:</span>
                  <span className="text-white font-sans font-semibold">
                    {selectedReceipt.items[0]?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FORMA PAGAMENTO:</span>
                  <span>{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between text-base font-bold text-white font-sans">
                <span>VALOR TOTAL PAGO:</span>
                <span className="text-emerald-400">
                  {formatCurrency(selectedReceipt.totalAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Imprimir Recibo
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={() => {
                  const text = `Comprovante de Venda Lucrix #${selectedReceipt.saleNumber}\nItem: ${selectedReceipt.items[0]?.title}\nValor: ${formatCurrency(selectedReceipt.totalAmount)}\nObrigado pela preferência!`;
                  navigator.clipboard.writeText(text);
                  alert("Comprovante copiado para a área de transferência!");
                }}
              >
                Copiar p/ WhatsApp
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
