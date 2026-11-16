"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  QrCode,
  Copy,
  Zap,
  Building2,
  Lock,
  User,
  Phone,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function AssinaturaPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout State
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [step, setStep] = useState<"form" | "pix" | "success">("form");
  const [subscriberName, setSubscriberName] = useState("Carlos Eduardo");
  const [subscriberEmail, setSubscriberEmail] = useState("carlos@lucrix.app");
  const [subscriberPhone, setSubscriberPhone] = useState("(11) 98844-2200");
  const [subscriberCpf, setSubscriberCpf] = useState("389.201.849-01");
  const [billingType, setBillingType] = useState<"PIX" | "CREDIT_CARD">("PIX");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (data.success) {
        setTenant(data.tenant);
        setPlans(data.plans);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleStartCheckout = (plan: any) => {
    setSelectedPlan(plan);
    setStep("form");
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout/asaas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          name: subscriberName,
          email: subscriberEmail,
          phone: subscriberPhone,
          cpfCnpj: subscriberCpf,
          billingType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCheckoutData(data);
        setStep("pix");
        fetchSubscription();
      } else {
        alert(data.error || "Erro no processamento com o Asaas");
      }
    } catch (err) {
      alert("Falha de conexão com gateway");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#34D399", "#F59E0B", "#FFFFFF"],
    });
    setStep("success");
    setTimeout(() => {
      setSelectedPlan(null);
      fetchSubscription();
    }, 2000);
  };

  const handleCopyPix = () => {
    const code = checkoutData?.subscription?.pix?.payload || "00020126580014br.gov.bcb.pix0136...";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-10">
      {/* Topo */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="emerald" size="md">
          Checkout Oficial • Asaas Integrado
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Planos Feitos Para a Sua Operação Lucrar Mais
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Sem burocracia, cancelamento a qualquer momento e ativação instantânea via Pix.
        </p>
      </div>

      {/* Plano Atual Ativo */}
      {tenant && (
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl mx-auto shadow-emerald-glow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
              LX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{tenant.name}</h3>
                <Badge variant="emerald">Plano {tenant.plan}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Status: <span className="text-emerald-400 font-bold">Ativo & Regularizado</span> • Gateway Asaas
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Assinatura Mensal</span>
            <span className="text-xs font-bold text-emerald-400">Renovação Automática</span>
          </div>
        </div>
      )}

      {/* Grid de Planos Comerciais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((p) => {
          const isCurrent = tenant?.plan === p.id;
          return (
            <div
              key={p.id}
              className={`glass-card rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                p.highlight
                  ? "border-emerald-500/50 shadow-emerald-glow bg-dark-900"
                  : "border-slate-800 bg-dark-900/60"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-dark-950 font-bold text-[10px] uppercase tracking-wider shadow-sm">
                  Mais Escolhido
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-sans">
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-xs text-slate-400">/{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                  {p.features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  size="md"
                  variant={p.highlight ? "primary" : "secondary"}
                  className="w-full font-bold btn-press"
                  disabled={isCurrent}
                  onClick={() => handleStartCheckout(p)}
                >
                  {isCurrent ? "Plano Atual Ativo" : `Contratar ${p.name}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CHECKOUT GUIADO ASAAS */}
      {selectedPlan && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          title={`Checkout Asaas — ${selectedPlan.name}`}
          description={`Assinatura no valor de ${formatCurrency(selectedPlan.price)}/mês`}
        >
          {step === "form" && (
            <form onSubmit={handleProcessCheckout} className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  1. Dados do Titular da Assinatura
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Nome / Razão Social</label>
                    <input
                      type="text"
                      required
                      value={subscriberName}
                      onChange={(e) => setSubscriberName(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">CPF ou CNPJ</label>
                    <input
                      type="text"
                      required
                      value={subscriberCpf}
                      onChange={(e) => setSubscriberCpf(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">E-mail para Recibos</label>
                    <input
                      type="email"
                      required
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={subscriberPhone}
                      onChange={(e) => setSubscriberPhone(e.target.value)}
                      className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Escolha a Forma de Pagamento
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingType("PIX")}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all btn-press ${
                      billingType === "PIX"
                        ? "bg-emerald-500/20 border-emerald-500 text-white shadow-emerald-glow"
                        : "bg-dark-850 border-slate-800 text-slate-400"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xs">Pix Instantâneo</span>
                    <span className="text-[10px] text-emerald-400">Ativação em 5 seg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingType("CREDIT_CARD")}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all btn-press ${
                      billingType === "CREDIT_CARD"
                        ? "bg-emerald-500/20 border-emerald-500 text-white shadow-emerald-glow"
                        : "bg-dark-850 border-slate-800 text-slate-400"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xs">Cartão de Crédito</span>
                    <span className="text-[10px] text-slate-400">Recorrência mensal</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setSelectedPlan(null)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="md" type="submit" isLoading={isProcessing}>
                  Continuar para Pagamento ({formatCurrency(selectedPlan.price)})
                </Button>
              </div>
            </form>
          )}

          {step === "pix" && (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="p-4 rounded-3xl bg-dark-850 border border-emerald-500/40 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  QR Code Pix Gerado via Asaas
                </span>

                <div className="w-44 h-44 mx-auto bg-white rounded-2xl p-3 flex items-center justify-center shadow-2xl border-4 border-emerald-400">
                  <QrCode className="w-36 h-36 text-dark-950" />
                </div>

                <p className="text-xs text-slate-300">
                  Abra o aplicativo do seu banco, escolha <strong>Pix</strong> e escaneie o código ou copie a chave:
                </p>

                <div className="p-3 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 truncate max-w-[240px]">
                    {checkoutData?.subscription?.pix?.payload || "00020126580014br.gov.bcb.pix0136..."}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="p-2 text-emerald-400 hover:text-white rounded-xl bg-dark-800 hover:bg-emerald-500/20 transition-colors btn-press flex items-center gap-1 font-bold text-xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-emerald-glow"
                onClick={handleConfirmPayment}
              >
                Confirmar Pagamento Realizado
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="p-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-400 shadow-emerald-glow">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-black text-white">Assinatura Ativada com Sucesso!</h3>
              <p className="text-xs text-slate-300">
                Sua empresa agora tem acesso completo aos recursos do {selectedPlan.name}.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
