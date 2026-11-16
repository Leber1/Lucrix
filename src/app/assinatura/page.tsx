"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function AssinaturaPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<any>(null);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleCheckout = async (plan: any) => {
    setSelectedPlanForCheckout(plan);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, paymentMethod: "PIX" }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutResult(data);
        fetchSubscription();
      }
    } catch (e) {
      alert("Falha no checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Topo */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="emerald" size="md">
          Checkout SaaS • Asaas Integrado
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Planos Transparentes Para Escalar Seu Negócio
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Sem taxas ocultas, cancele quando quiser. Ativação imediata via Pix ou Cartão.
        </p>
      </div>

      {/* Plano Atual Ativo */}
      {tenant && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              LX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{tenant.name}</h3>
                <Badge variant="emerald">Plano {tenant.plan}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Status da Assinatura:{" "}
                <span className="text-emerald-400 font-semibold">Ativa e Regularizada</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Cobrança Mensal Asaas</span>
            <span className="text-xs font-semibold text-white">Renovação Automática</span>
          </div>
        </div>
      )}

      {/* Grid de Planos */}
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
                  Mais Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
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
                  className="w-full"
                  disabled={isCurrent}
                  onClick={() => handleCheckout(p)}
                >
                  {isCurrent ? "Plano Atual" : `Contratar ${p.name}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Checkout Asaas com Pix Instantâneo */}
      {selectedPlanForCheckout && checkoutResult && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedPlanForCheckout(null);
            setCheckoutResult(null);
          }}
          title={`Assinatura Lucrix ${selectedPlanForCheckout.name}`}
          description="Pagamento seguro processado via gateway Asaas"
        >
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-dark-850 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                QR Code Pix Instantâneo
              </span>

              {/* QR Code Icon / Box */}
              <div className="w-44 h-44 mx-auto bg-white rounded-xl p-3 flex items-center justify-center shadow-lg">
                <QrCode className="w-36 h-36 text-dark-950" />
              </div>

              <p className="text-xs text-slate-300">
                Abra o app do seu banco e escaneie o código ou copie a chave Pix abaixo.
              </p>

              <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 truncate max-w-[260px]">
                  {checkoutResult.asaas?.pixCopyPaste}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(checkoutResult.asaas?.pixCopyPaste);
                    alert("Chave Pix Copiada com sucesso!");
                  }}
                  className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded hover:bg-dark-800"
                  title="Copiar Código Pix"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setSelectedPlanForCheckout(null);
                setCheckoutResult(null);
              }}
            >
              Já Realizei o Pagamento
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
