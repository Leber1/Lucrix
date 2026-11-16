"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Plus, CheckCircle2, Clock, AlertCircle, ShieldAlert, Smartphone } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function ServicosPage() {
  const [activeTab, setActiveTab] = useState<"os" | "garantias">("os");
  const [orders, setOrders] = useState<any[]>([
    {
      id: "os-1",
      orderNumber: 2001,
      device: "iPhone 13 Pro 128GB Dourado",
      serialOrImei: "359182746192039",
      defectReport: "Aparelho não liga após queda leve. Tela sem trincos externos.",
      diagnosis: "Curto no conector da bateria e display descolado internamente.",
      status: "APPROVED",
      laborCost: 280,
      partsCost: 140,
      totalAmount: 420,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [warranties, setWarranties] = useState<any[]>([
    {
      id: "war-1",
      claimNumber: 3001,
      itemName: "iPhone 14 128GB Estelar",
      serialNumber: "354928109847120",
      issueReport: "Câmera principal tremendo ao focar em vídeo",
      status: "IN_REVIEW",
      createdAt: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Ordens de Serviço & Garantias
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Assistência técnica, peças consumidas, mão de obra e termos de garantia.
          </p>
        </div>

        <Button size="md" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Nova O.S.
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("os")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "os"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Ordens de Serviço (O.S.)
        </button>
        <button
          onClick={() => setActiveTab("garantias")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "garantias"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Termos de Garantia & Ocorrências
        </button>
      </div>

      {activeTab === "os" ? (
        <div className="space-y-3">
          {orders.map((os) => (
            <div
              key={os.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-xs">
                    O.S.
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      #{os.orderNumber} — {os.device}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      IMEI: {os.serialOrImei} • {formatDate(os.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{os.status}</Badge>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {formatCurrency(os.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300">
                <p>
                  <strong className="text-slate-400">Defeito Reclamado:</strong> {os.defectReport}
                </p>
                <p>
                  <strong className="text-slate-400">Laudo Técnico:</strong> {os.diagnosis}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-dark-850 flex justify-between text-xs text-slate-400 border border-slate-800">
                <span>Mão de Obra: {formatCurrency(os.laborCost)}</span>
                <span>Peças Aplicadas: {formatCurrency(os.partsCost)}</span>
                <span className="text-emerald-400 font-bold">
                  Total Orçamento: {formatCurrency(os.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {warranties.map((w) => (
            <div
              key={w.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Garantia #{w.claimNumber} — {w.itemName}
                  </h3>
                  <p className="text-[11px] text-slate-400">IMEI: {w.serialNumber}</p>
                </div>
                <Badge variant="amber">{w.status}</Badge>
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-400">Relato do Cliente:</strong> {w.issueReport}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
