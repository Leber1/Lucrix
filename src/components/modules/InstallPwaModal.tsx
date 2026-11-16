"use client";

import React from "react";
import { X, Smartphone, Share, PlusSquare, CheckCircle, Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LucrixLogo } from "@/components/ui/LucrixLogo";

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <LucrixLogo size="sm" showText={false} />
            <div>
              <h3 className="text-base font-extrabold text-white">Instalar App no Celular</h3>
              <p className="text-xs text-slate-400">PWA oficial para iPhone e Android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-dark-850 hover:bg-dark-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Instruções para iPhone / iOS Safari */}
          <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                
              </span>
              <span>No iPhone (Safari):</span>
            </div>

            <ol className="space-y-2 text-slate-300 list-decimal list-inside pl-1">
              <li>
                Toque no botão <strong>Compartilhar</strong> (o quadrado com uma seta para cima na barra inferior do Safari).
              </li>
              <li>
                Role para baixo e selecione a opção <strong>"Adicionar à Tela de Início"</strong>.
              </li>
              <li>
                Toque em <strong>"Adicionar"</strong> no canto superior direito.
              </li>
            </ol>
            <p className="text-[11px] text-emerald-400 font-medium pt-1">
              Pronto! O ícone da Lucrix ficará na sua tela de início e abrirá em tela cheia como um aplicativo nativo!
            </p>
          </div>

          {/* Instruções para Android (Chrome) */}
          <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                ▲
              </span>
              <span>No Android (Google Chrome):</span>
            </div>

            <ol className="space-y-2 text-slate-300 list-decimal list-inside pl-1">
              <li>Toque nos <strong>três pontinhos</strong> no canto superior direito do Chrome.</li>
              <li>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
              <li>Confirme a instalação.</li>
            </ol>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold shadow-emerald-glow"
          onClick={onClose}
        >
          Entendi, vou instalar!
        </Button>
      </div>
    </div>
  );
};
