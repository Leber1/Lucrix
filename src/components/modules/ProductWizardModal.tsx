"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Package,
  ShoppingCart,
  Wrench,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  Sparkles,
  Smartphone,
  Shirt,
  HelpCircle,
  Eye,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ProductWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export const ProductWizardModal: React.FC<ProductWizardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State em 5 Etapas
  const [formData, setFormData] = useState({
    // Etapa 1: Produto
    name: initialData?.name || "",
    categoryType: initialData?.categoryType || "SMARTPHONE",
    brand: initialData?.brand || "Apple",
    model: initialData?.model || "",
    serialNumber: initialData?.serialNumber || "",
    serialNumber2: initialData?.serialNumber2 || "",
    color: initialData?.color || "Titânio Natural",
    storage: initialData?.storage || "256GB",
    batteryHealth: initialData?.batteryHealth || 98,
    apparelSize: initialData?.apparelSize || "M",
    condition: initialData?.condition || "SEMI_NEW",
    quantity: initialData?.quantity || 1,
    imageUrl:
      initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    description: initialData?.description || "",

    // Etapa 2: Compra
    supplierName: initialData?.supplierName || "Mega Distribuidora Tech",
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split("T")[0],
    purchasePrice: initialData?.purchasePrice || 4800,
    shippingCost: initialData?.shippingCost || 40,
    paymentMethod: initialData?.paymentMethod || "PIX",

    // Etapa 3: Melhorias / Reparos / Despesas vinculadas
    expenses: initialData?.expenses || [
      { description: "Película 3D & Capinha MagSafe", amount: 90, supplier: "TechParts" },
    ],

    // Etapa 4: Venda & Precificação
    targetPrice: initialData?.targetPrice || 6190,
    minPrice: initialData?.minPrice || 5900,

    // Etapa 5: Status
    status: initialData?.status || "READY",
  });

  if (!isOpen) return null;

  // Cálculos dinâmicos
  const totalExpenses = formData.expenses.reduce(
    (sum: number, exp: any) => sum + (Number(exp.amount) || 0),
    0
  );
  const totalCost = Number(formData.purchasePrice) + Number(formData.shippingCost) + totalExpenses;
  const projectedProfit = Number(formData.targetPrice) - totalCost;
  const projectedMargin =
    formData.targetPrice > 0 ? (projectedProfit / Number(formData.targetPrice)) * 100 : 0;

  const handleAddExpense = () => {
    setFormData({
      ...formData,
      expenses: [...formData.expenses, { description: "", amount: 0, supplier: "" }],
    });
  };

  const handleRemoveExpense = (index: number) => {
    setFormData({
      ...formData,
      expenses: formData.expenses.filter((_: any, i: number) => i !== index),
    });
  };

  const handleUpdateExpense = (index: number, field: string, value: any) => {
    const updated = [...formData.expenses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, expenses: updated });
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: isDraft ? "DRAFT" : formData.status,
        draftStep: currentStep,
        additionalCosts: totalExpenses,
        totalCost,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Celebração visual espetacular com Confetti se concluído!
        if (!isDraft) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#10B981", "#34D399", "#F59E0B", "#FFFFFF"],
          });
        }

        setSaveSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setSaveSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 800);
      } else {
        setIsSubmitting(false);
        alert("Erro ao salvar produto");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Produto", icon: Package },
    { num: 2, title: "Compra", icon: ShoppingCart },
    { num: 3, title: "Melhorias", icon: Wrench },
    { num: 4, title: "Venda", icon: TrendingUp },
    { num: 5, title: "Status", icon: Tag },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop com Blur Intenso */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Wizard Modal */}
      <div className="relative w-full max-w-4xl bg-dark-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header com Stepper Tecnológico */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-[1.5px] shadow-emerald-glow">
                <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xs">
                  LX
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  Assistente Guiado de Cadastro
                </h3>
                <p className="text-xs text-slate-400">
                  Etapa {currentStep} de 5 — <strong className="text-emerald-400">{steps[currentStep - 1].title}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-dark-850 hover:bg-dark-800 transition-colors btn-press"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper com Barra Conectada Neon */}
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {steps.map((st) => {
              const Icon = st.icon;
              const isPast = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex-1 flex flex-col items-center gap-1.5 pb-2 border-b-2 transition-all btn-press ${
                    isCurrent
                      ? "border-emerald-400 text-emerald-400 font-extrabold"
                      : isPast
                      ? "border-emerald-600 text-emerald-500 font-bold"
                      : "border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-bold hidden sm:inline">
                      {st.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Dividido: Formulário à Esquerda + Live Preview à Direita */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6">
          
          {/* LADO ESQUERDO: CAMPOS DA ETAPA ATUAL (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* ETAPA 1: DADOS DO PRODUTO */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Seletor Visual de Categoria */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "SMARTPHONE", label: "Smartphone", icon: Smartphone },
                    { type: "APPAREL", label: "Vestuário", icon: Shirt },
                    { type: "GENERAL", label: "Comércio Geral", icon: Package },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.categoryType === cat.type;
                    return (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoryType: cat.type })}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all btn-press ${
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-500/60 text-white shadow-emerald-glow font-bold"
                            : "bg-dark-850 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                        <span className="text-xs">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nome da Mercadoria *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: iPhone 15 Pro Max 256GB Titânio"
                    className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Marca / Fabricante
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ex: Apple, Samsung"
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Condição
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="NEW">Novo Lacrado</option>
                      <option value="SEMI_NEW">Seminovo Impecável</option>
                      <option value="USED">Usado com Marcas</option>
                      <option value="FOR_PARTS">Para Peças / Sucata</option>
                    </select>
                  </div>
                </div>

                {/* Campos dinâmicos para celular */}
                {formData.categoryType === "SMARTPHONE" && (
                  <div className="p-4 rounded-2xl bg-dark-850 border border-emerald-500/20 space-y-3 shadow-sm">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" /> Ficha Técnica do Celular
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                          IMEI / Número de Série *
                        </label>
                        <input
                          type="text"
                          value={formData.serialNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, serialNumber: e.target.value })
                          }
                          placeholder="359482109283741"
                          className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                          Saúde Bateria (%)
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={formData.batteryHealth}
                          onChange={(e) =>
                            setFormData({ ...formData, batteryHealth: Number(e.target.value) })
                          }
                          className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    URL da Foto Real
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* ETAPA 2: AQUISIÇÃO & COMPRA */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Fornecedor / Origem *
                    </label>
                    <input
                      type="text"
                      value={formData.supplierName}
                      onChange={(e) =>
                        setFormData({ ...formData, supplierName: e.target.value })
                      }
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Data da Compra
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData({ ...formData, purchaseDate: e.target.value })
                      }
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Custo de Aquisição (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, purchasePrice: Number(e.target.value) })
                      }
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-base text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Frete / Deslocamento (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.shippingCost}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingCost: Number(e.target.value) })
                      }
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: MELHORIAS & REPAROS */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Custos Extras Agregados</h4>
                    <p className="text-xs text-slate-400">
                      Peças trocadas, higienização e acessórios que valorizam o item
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={handleAddExpense}
                  >
                    Novo Custo
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.expenses.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-dark-850 border border-slate-800 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={exp.description}
                        onChange={(e) =>
                          handleUpdateExpense(idx, "description", e.target.value)
                        }
                        placeholder="Ex: Troca de Tela OLED, Bateria"
                        className="flex-1 bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={exp.amount}
                        onChange={(e) =>
                          handleUpdateExpense(idx, "amount", Number(e.target.value))
                        }
                        className="w-24 bg-dark-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white font-bold text-right focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExpense(idx)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-dark-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPA 4: PRECIFICAÇÃO & SIMULAÇÃO */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1.5 uppercase">
                      Preço de Venda Desejado (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.targetPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, targetPrice: Number(e.target.value) })
                      }
                      className="w-full bg-dark-850 border border-emerald-500/50 rounded-2xl px-4 py-3 text-lg text-emerald-400 font-black focus:outline-none focus:border-emerald-400 shadow-emerald-glow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Preço Mínimo de Desconto
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, minPrice: Number(e.target.value) })
                      }
                      className="w-full bg-dark-850 border border-slate-800 rounded-2xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 5: STATUS & REVISÃO */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Status Inicial no Sistema
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { val: "READY", title: "Pronto para Venda", desc: "Já vai direto para a vitrine" },
                    { val: "IN_REPAIR", title: "Em Reparo", desc: "Aguardando peças ou bancada" },
                    { val: "IN_IMPROVEMENT", title: "Em Higienização", desc: "Polimento / Revisão" },
                    { val: "DRAFT", title: "Rascunho", desc: "Salvar para concluir depois" },
                  ].map((st) => (
                    <button
                      key={st.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st.val })}
                      className={`p-3.5 rounded-2xl border text-left transition-all btn-press ${
                        formData.status === st.val
                          ? "bg-emerald-500/20 border-emerald-500 text-white shadow-emerald-glow font-bold"
                          : "bg-dark-850 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <h5 className="text-xs font-bold text-white">{st.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">{st.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LADO DIREITO: LIVE PREVIEW CARD (O EFEITO "UAU" EM TEMPO REAL) (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Prévia ao Vivo do Item
              </span>
              <Badge variant="emerald">Live Card</Badge>
            </div>

            {/* Cartão Renderizado com os dados digitados */}
            <div className="glass-card rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl p-4 space-y-3 bg-gradient-to-br from-dark-850 to-dark-900">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-dark-950">
                <img
                  src={formData.imageUrl}
                  alt={formData.name || "Prévia"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <Badge variant="emerald">
                    {formData.status === "READY" ? "Pronto" : formData.status}
                  </Badge>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/70 text-slate-200 border border-white/10 backdrop-blur-md">
                    {formData.condition === "NEW" ? "Novo" : "Seminovo"}
                  </span>
                </div>
                {formData.batteryHealth && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-dark-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Bateria {formData.batteryHealth}%
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white leading-snug truncate">
                  {formData.name || "Nome da Mercadoria"}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  IMEI: {formData.serialNumber || "000.000.000"}
                </p>
              </div>

              {/* Termômetro de Margem Real */}
              <div className="p-3 rounded-2xl bg-dark-900/90 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Custo Total:</span>
                  <span className="font-bold text-slate-200">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">Preço de Venda:</span>
                  <span className="text-sm font-black text-emerald-400">
                    {formatCurrency(formData.targetPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400 font-bold">Lucro Estimado:</span>
                  <span className="text-xs font-black text-emerald-400">
                    +{formatCurrency(projectedProfit)} ({formatPercent(projectedMargin)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-dark-950/80 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Voltar
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => handleSubmit(true)}>
                Salvar Rascunho
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Próxima Etapa
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                isSuccess={saveSuccess}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleSubmit(false)}
              >
                Finalizar & Ativar Mercadoria
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
