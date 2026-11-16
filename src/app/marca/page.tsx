"use client";

import React from "react";
import { LucrixLogo } from "@/components/ui/LucrixLogo";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Copy, Check, Download, ShieldCheck, Layers, Eye } from "lucide-react";

export default function MarcaPage() {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const brandColors = [
    { name: "Lucrix Emerald Light", hex: "#34D399", desc: "Acentos de brilho e números positivos" },
    { name: "Lucrix Emerald Primary", hex: "#10B981", desc: "Cor principal de ação e rentabilidade" },
    { name: "Lucrix Emerald Dark", hex: "#047857", desc: "Profundidade e bordas de destaque" },
    { name: "Deep Night (Obsidian)", hex: "#07090E", desc: "Fundo principal dark mode" },
    { name: "Graphite Surface", hex: "#111722", desc: "Superfície dos cartões e módulos" },
    { name: "Muted Slate", hex: "#94A3B8", desc: "Tipografia secundária e legendas" },
    { name: "Soft Danger", hex: "#EF4444", desc: "Despesas, perdas e alertas" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-10">
      {/* Topo Hero da Marca */}
      <div className="text-center space-y-3 pt-4">
        <Badge variant="emerald" size="md">
          Brand Book Oficial • Lucrix v1.0
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Identidade Visual & Diretrizes da Marca
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Um ecossistema visual proprietário, desenvolvido para transmitir autoridade, elegância e prosperidade financeira.
        </p>
      </div>

      {/* Showcase Central do Logo */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/30 text-center relative overflow-hidden bg-gradient-to-b from-dark-900 via-dark-850 to-[#07090E] shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <LucrixLogo size="xl" showText={true} showSlogan={true} />

          <div className="max-w-md mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            O símbolo combina as letras <strong>L</strong> e <strong>X</strong> em uma geometria contínua de precisão, onde a extremidade direita do "X" projeta uma <strong>seta ascendente de lucro e crescimento contínuo</strong>.
          </div>
        </div>
      </div>

      {/* Variações de Aplicação do Monograma */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Variações de Tamanho e Aplicação
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <LucrixLogo size="sm" showText={false} />
            <span className="text-[11px] text-slate-400 font-mono">Tamanho P (32px)</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <LucrixLogo size="md" showText={false} />
            <span className="text-[11px] text-slate-400 font-mono">Tamanho M (40px)</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <LucrixLogo size="lg" showText={false} />
            <span className="text-[11px] text-slate-400 font-mono">Tamanho G (48px)</span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 flex flex-col items-center justify-center gap-2">
            <LucrixLogo size="xl" showText={false} />
            <span className="text-[11px] text-emerald-400 font-mono">Tamanho GG (64px)</span>
          </div>
        </div>
      </div>

      {/* Paleta Oficial de Cores com Copiar Hexadecimal */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Paleta Cromática Oficial
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {brandColors.map((color) => (
            <div
              key={color.hex}
              onClick={() => copyToClipboard(color.hex)}
              className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group btn-press"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white/10 shadow-sm shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {color.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{color.hex}</p>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
                {copiedColor === color.hex ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
