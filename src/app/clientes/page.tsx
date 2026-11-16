"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Phone, Mail, MapPin, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      });
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Base de Clientes & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Histórico comercial, telefones e compras realizadas por cada cliente.
          </p>
        </div>

        <Button size="md" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente por nome ou CPF..."
          className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((cli) => (
          <div
            key={cli.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {cli.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{cli.name}</h3>
                <p className="text-xs text-slate-400">{cli.document || "CPF não informado"}</p>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{cli.phone || "Sem telefone"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{cli.email || "Sem e-mail"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{cli.city ? `${cli.city} - ${cli.state}` : "Sem endereço"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
