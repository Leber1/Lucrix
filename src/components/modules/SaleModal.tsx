"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  X,
  ShoppingBag,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
  CheckCircle2,
  Printer,
  Share2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preSelectedProductId?: string;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preSelectedProductId,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(preSelectedProductId || "");
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [installments, setInstallments] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Carregar produtos prontos para venda
      fetch("/api/products?status=READY")
        .then((res) => res.json())
        .then((data) => {
          if (data.products) {
            setProducts(data.products);
            if (preSelectedProductId) {
              const found = data.products.find((p: any) => p.id === preSelectedProductId);
              if (found) {
                setSelectedProductId(found.id);
                setUnitPrice(found.targetPrice);
              }
            } else if (data.products.length > 0) {
              setSelectedProductId(data.products[0].id);
              setUnitPrice(data.products[0].targetPrice);
            }
          }
        });

      // Carregar clientes
      fetch("/api/customers")
        .then((res) => res.json())
        .then((data) => {
          if (data.customers) setCustomers(data.customers);
        })
        .catch(() => {});
    } else {
      setCompletedSale(null);
    }
  }, [isOpen, preSelectedProductId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Cálculos em tempo real
  const subtotal = Number(unitPrice) * Number(quantity);
  const totalAmount = subtotal - Number(discount) + Number(shippingCost);
  const estimatedCost = (selectedProduct?.totalCost || 0) * Number(quantity);
  const estimatedProfit = totalAmount - estimatedCost;
  const estimatedMargin = totalAmount > 0 ? (estimatedProfit / totalAmount) * 100 : 0;

  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setUnitPrice(prod.targetPrice);
    }
  };

  const handleConfirmSale = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        productId: selectedProductId || null,
        title: selectedProduct?.name || "Mercadoria Avulsa",
        customerId: selectedCustomerId || null,
        quantity,
        unitPrice,
        discount,
        shippingCost,
        paymentMethod,
        installmentsCount: installments,
        notes: `Venda balcão para ${clientName || "Cliente"}. Pagamento em ${paymentMethod} (${installments}x)`,
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#10B981", "#34D399", "#F59E0B", "#FFFFFF"],
        });
        setCompletedSale(data.sale);
        if (onSuccess) onSuccess();
      } else {
        alert(data.error || "Erro ao processar venda");
      }
    } catch (err) {
      console.error(err);
      alert("Falha na comunicação com o servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Card Modal */}
      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-dark-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-[1px] shadow-emerald-glow">
              <div className="w-full h-full bg-dark-950 rounded-[11px] flex items-center justify-center text-emerald-400 font-bold text-xs">
                PDV
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {completedSale ? "Venda Concluída com Sucesso!" : "Ponto de Venda & Checkout"}
              </h3>
              <p className="text-xs text-slate-400">
                {completedSale ? `Recibo #${completedSale.saleNumber}` : "Baixa de estoque e lançamento financeiro"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo: Formulário de Venda OU Comprovante de Venda */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!completedSale ? (
            <>
              {/* Seleção do Produto em Estoque */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mercadoria do Estoque *
                </label>
                {products.length === 0 ? (
                  <div className="p-3 bg-dark-850 rounded-xl border border-slate-800 text-xs text-slate-400">
                    Nenhum produto com status "Pronto para Venda" encontrado.
                  </div>
                ) : (
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.serialNumber ? `(IMEI: ${p.serialNumber})` : ""} —{" "}
                        {formatCurrency(p.targetPrice)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cliente (Nome / WhatsApp)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome do cliente (opcional)"
                  className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Valores e Quantidade */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preço Unit. (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Desconto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Frete (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "PIX", label: "Pix Instantâneo", icon: QrCode },
                    { val: "CREDIT_CARD", label: "Cartão de Crédito", icon: CreditCard },
                    { val: "CASH", label: "Dinheiro em Espécie", icon: Banknote },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => setPaymentMethod(m.val)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === m.val
                            ? "bg-emerald-500/15 border-emerald-500/60 text-white shadow-emerald-glow"
                            : "bg-dark-850 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parcelamento quando Cartão de Crédito */}
              {paymentMethod === "CREDIT_CARD" && (
                <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Número de Parcelas
                    </label>
                    <span className="text-xs font-bold text-emerald-400">
                      {installments}x de {formatCurrency(totalAmount / installments)}
                    </span>
                  </div>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full bg-dark-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num}x de {formatCurrency(totalAmount / num)} (Sem juros da loja)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Painel de Rentabilidade da Venda em Tempo Real */}
              <div className="p-4 rounded-xl bg-dark-850 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total a Pagar pelo Cliente:</span>
                  <span className="text-base font-extrabold text-white">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Custo Histórico da Mercadoria:</span>
                  <span className="text-slate-300">{formatCurrency(estimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold">Lucro Líquido Real da Venda:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    +{formatCurrency(estimatedProfit)} ({formatPercent(estimatedMargin)})
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* COMPROVANTE & RECIBO DA VENDA */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-center pb-3 border-b border-dashed border-slate-700">
                  <h3 className="font-bold text-sm text-white font-sans">
                    LUCRIX PRIME STORE
                  </h3>
                  <p className="text-[11px] text-slate-400">Sua Operação no Lucro</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Comprovante de Venda #{completedSale.saleNumber}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatDate(completedSale.soldAt || new Date())}
                  </p>
                </div>

                <div className="space-y-1 py-2 border-b border-dashed border-slate-700">
                  <div className="flex justify-between text-slate-300">
                    <span>ITEM:</span>
                    <span className="text-white font-sans font-semibold">
                      {completedSale.items[0]?.title}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>PAGAMENTO:</span>
                    <span>{completedSale.paymentMethod}</span>
                  </div>
                  {completedSale.installments?.length > 1 && (
                    <div className="flex justify-between text-slate-400">
                      <span>PARCELAMENTO:</span>
                      <span>{completedSale.installments.length}x</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm font-bold text-white font-sans">
                    <span>VALOR TOTAL:</span>
                    <span className="text-emerald-400">
                      {formatCurrency(completedSale.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-500">
                    <span>STATUS:</span>
                    <span className="font-bold">PAGAMENTO CONFIRMADO</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação para o Recibo */}
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
                    const text = `Comprovante de Venda Lucrix #${completedSale.saleNumber}\nItem: ${completedSale.items[0]?.title}\nValor: ${formatCurrency(completedSale.totalAmount)}\nObrigado pela preferência!`;
                    navigator.clipboard.writeText(text);
                    alert("Dados do comprovante copiados para o WhatsApp!");
                  }}
                >
                  Copiar / WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-dark-950/70 flex items-center justify-end gap-2">
          {!completedSale ? (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleConfirmSale}
              >
                Confirmar Venda ({formatCurrency(totalAmount)})
              </Button>
            </>
          ) : (
            <Button variant="primary" size="md" onClick={onClose}>
              Fechar Janela
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
