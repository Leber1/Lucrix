"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucrixLogo } from "@/components/ui/LucrixLogo";
import { Button } from "@/components/ui/Button";
import { Building2, User, Mail, Phone, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [segment, setSegment] = useState("ELECTRONICS");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCode, setPinCode] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          segment,
          ownerName,
          email,
          phone,
          pinCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/");
      } else {
        setError(data.error || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Falha de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LucrixLogo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Cadastre sua Empresa na <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">LUCRIX</span>
          </h1>
          <p className="text-xs text-slate-400">
            Comece a controlar compras, vendas, estoque e lucros em minutos.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome da sua Loja ou Empresa *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Prime Tech Celulares"
                className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Segmento da sua Operação
            </label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full bg-dark-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ELECTRONICS">Smartphones & Eletrônicos (IMEI/Serial)</option>
              <option value="APPAREL">Vestuário & Calçados (Grade/Tamanho/Cor)</option>
              <option value="SERVICES">Assistência Técnica & Serviços (O.S.)</option>
              <option value="GENERAL">Comércio Geral & Lojistas</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seu Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Nome do Sócio"
                  className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp / Telefone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seu E-mail Profissional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Crie um PIN (4 Dígitos) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-sm font-bold shadow-emerald-glow"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Cadastrar & Acessar Sistema
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-4"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
