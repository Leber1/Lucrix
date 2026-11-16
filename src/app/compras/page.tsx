"use client";

import React, { useState, useEffect } from "react";
import { Truck, Plus, Package, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<any[]>([
    {
      id: "pur-1",
      description: "Lote de 3x iPhone 14 Pro 128GB Lacrados",
      supplier: { name: "Mega Distribuidora Tech SP" },
      totalAmount: 11550,
      paymentMethod: "PIX",
      status: "COMPLETED",
      purchasedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "pur-2",
      description: "Kit de Telas OLED e Baterias Originais Foxconn",
      supplier: { name: "TechParts Distribuidora Campinas" },
      totalAmount: 1450,
      paymentMethod: "TERM",
      status: "COMPLETED",
      purchasedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
  ]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Entrada de Mercadorias & Compras
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Controle de pedidos de compra com fornecedores e agregação de estoque.
          </p>
        </div>

        <Button size="md" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Nova Compra
        </Button>
      </div>

      <div className="space-y-3">
        {purchases.map((p) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{p.description}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fornecedor: {p.supplier?.name} • Data: {formatDate(p.purchasedAt)} • Forma: {p.paymentMethod}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-sm font-black text-white block">
                {formatCurrency(p.totalAmount)}
              </span>
              <Badge variant="emerald">{p.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
