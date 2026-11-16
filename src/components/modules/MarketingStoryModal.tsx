"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Sparkles,
  Share2,
  Camera,
  Flame,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Package,
  Award,
  Layers,
} from "lucide-react";
import { LucrixLogo } from "@/components/ui/LucrixLogo";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface MarketingStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardStats?: any;
}

export const MarketingStoryModal: React.FC<MarketingStoryModalProps> = ({
  isOpen,
  onClose,
  dashboardStats,
}) => {
  const [template, setTemplate] = useState<"venda" | "compra" | "lucro_dia">("venda");
  const [productName, setProductName] = useState("iPhone 15 Pro Max 256GB Titânio Natural");
  const [salePrice, setSalePrice] = useState<number>(6790);
  const [profit, setProfit] = useState<number>(1370);
  const [purchaseCost, setPurchaseCost] = useState<number>(5420);
  const [dailySales, setDailySales] = useState<number>(12400);
  const [dailyProfit, setDailyProfit] = useState<number>(3150);

  if (!isOpen) return null;

  const handleShare = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: ["#10B981", "#34D399", "#FFFFFF"],
    });

    const shareText =
      template === "venda"
        ? `🔥 Mais uma venda finalizada na Lucrix!\nItem: ${productName}\nValor: ${formatCurrency(salePrice)} (Lucro Real: +${formatCurrency(profit)})\nSua operação no lucro!`
        : template === "compra"
        ? `📦 Mercadoria nova comprada e cadastrada!\nItem: ${productName}\nCusto: ${formatCurrency(purchaseCost)}\nControlado pela Lucrix!`
        : `📊 Fechamento do dia com chave de ouro!\nFaturamento: ${formatCurrency(dailySales)}\nLucro Líquido: +${formatCurrency(dailyProfit)}\nOperação lucrativa com a Lucrix!`;

    navigator.clipboard.writeText(shareText);
    alert("Texto e dados copiados para sua área de transferência! Agora tire um print da tela para postar nos Stories do Instagram ou Status do WhatsApp!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[95vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-emerald-glow">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Gerador de Prints de Marketing (Stories)
              </h3>
              <p className="text-xs text-slate-400">
                Cards cinematográficos formatados para postar no Instagram e WhatsApp
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

        {/* Seletor de Modelo do Print */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "venda", label: "Print de Venda", icon: ShoppingBag },
            { id: "compra", label: "Print de Compra", icon: Package },
            { id: "lucro_dia", label: "Fechamento do Dia", icon: Flame },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = template === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setTemplate(m.id as any)}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all btn-press ${
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-500 text-white shadow-emerald-glow"
                    : "bg-dark-850 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* CARD DE PRÉ-VISUALIZAÇÃO DO STORY (FORMATO CINEMATOGRÁFICO DE LUXO) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#090D14] via-[#0C121C] to-[#080B11] border-2 border-emerald-500/40 shadow-2xl overflow-hidden space-y-6 text-center select-none">
          {/* Brilhos de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Topo do Story: Logo Oficial Lucrix */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <LucrixLogo size="md" showText={true} showSlogan={true} />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              Operação no Lucro
            </span>
          </div>

          {/* Notificação Flutuante Estilo iOS na Tela de Bloqueio */}
          <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/10 backdrop-blur-xl shadow-2xl text-left space-y-1.5 transform hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LUCRIX APP • AGORA
              </span>
              <span className="text-[10px] font-mono">14:45</span>
            </div>

            {template === "venda" && (
              <>
                <h4 className="text-sm font-extrabold text-white">
                  🎉 Nova Venda Confirmada!
                </h4>
                <p className="text-xs text-slate-300">
                  {productName} • Valor: <strong className="text-white">{formatCurrency(salePrice)}</strong>
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Lucro Líquido Real: +{formatCurrency(profit)}
                  </span>
                  <Badge variant="emerald" size="sm">
                    {formatPercent((profit / salePrice) * 100)} Margem
                  </Badge>
                </div>
              </>
            )}

            {template === "compra" && (
              <>
                <h4 className="text-sm font-extrabold text-white">
                  📦 Mercadoria Nova Adicionada ao Estoque
                </h4>
                <p className="text-xs text-slate-300">
                  {productName} • Valor de Compra: <strong className="text-white">{formatCurrency(purchaseCost)}</strong>
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Pronto para Venda com Margem Saudável
                  </span>
                  <Badge variant="emerald" size="sm">Estoque Ativo</Badge>
                </div>
              </>
            )}

            {template === "lucro_dia" && (
              <>
                <h4 className="text-sm font-extrabold text-white">
                  🏆 Fechamento Comercial Concluído!
                </h4>
                <p className="text-xs text-slate-300">
                  Faturamento Total: <strong className="text-white">{formatCurrency(dailySales)}</strong>
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400">
                    Lucro Líquido no Bolso: +{formatCurrency(dailyProfit)}
                  </span>
                  <Badge variant="emerald" size="sm">Nível Ouro</Badge>
                </div>
              </>
            )}
          </div>

          {/* Destaque do Lucro em Letras Gigantes */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              {template === "venda" ? "Lucro Líquido desta Venda" : template === "compra" ? "Capital Alocado" : "Lucro Limpo do Dia"}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 tracking-tight font-sans">
              {template === "venda"
                ? `+${formatCurrency(profit)}`
                : template === "compra"
                ? formatCurrency(purchaseCost)
                : `+${formatCurrency(dailyProfit)}`}
            </div>
            <p className="text-[11px] text-slate-400">
              Registrado e auditado no aplicativo Lucrix
            </p>
          </div>

          {/* Rodapé do Story */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>app.lucrix.pro</span>
            <span className="text-emerald-400 font-bold">Gestão Inteligente</span>
          </div>
        </div>

        {/* Botão de Copiar Texto & Avisar para Tirar Print */}
        <div className="space-y-2">
          <Button
            size="md"
            variant="primary"
            className="w-full font-bold shadow-emerald-glow"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            Copiar Texto do Post & Compartilhar
          </Button>

          <p className="text-[11px] text-slate-400 text-center">
            💡 <strong>Dica para o seu Sócio:</strong> Tire um print da caixa acima no seu celular e poste diretamente nos Stories do Instagram para mostrar a autoridade da sua loja!
          </p>
        </div>
      </div>
    </div>
  );
};
