"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucrixLogo } from "@/components/ui/LucrixLogo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Lock, Mail, KeyRound, Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "pin">("pin");
  const [email, setEmail] = useState("admin@lucrix.app");
  const [password, setPassword] = useState("123456");
  const [pinCode, setPinCode] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload =
        loginMethod === "pin"
          ? { pinCode }
          : { email, password };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redireciona para o painel principal
        router.push("/");
      } else {
        setError(data.error || "Credenciais inválidas");
      }
    } catch (err: any) {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@lucrix.app" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/");
      }
    } catch (e) {
      setError("Erro ao acessar conta demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 relative overflow-hidden">
      {/* Luzes de fundo com blur aeroespacial */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Card Central Glassmorphism */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Topo com Logomarca Oficial */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LucrixLogo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Acesse a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">LUCRIX</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sua operação no lucro • Gestão comercial e financeira
          </p>
        </div>

        {/* Seletor de Modo: PIN Rápido ou Email */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-dark-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setLoginMethod("pin")}
            className={`py-2 rounded-xl text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 ${
              loginMethod === "pin"
                ? "bg-emerald-500 text-dark-950 shadow-emerald-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Acesso Rápido (PIN)</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`py-2 rounded-xl text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 ${
              loginMethod === "email"
                ? "bg-emerald-500 text-dark-950 shadow-emerald-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email e Senha</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Formulário de Acesso */}
        <form onSubmit={handleLogin} className="space-y-4">
          {loginMethod === "pin" ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 text-center uppercase tracking-wider">
                Digite seu PIN de 4 Dígitos
              </label>

              <div className="flex justify-center">
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="••••"
                  className="w-48 text-center text-3xl font-mono tracking-[0.5em] bg-dark-900 border border-emerald-500/40 rounded-2xl py-3 text-emerald-400 focus:outline-none focus:border-emerald-400 shadow-emerald-glow"
                />
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                PIN de demonstração já configurado: <strong className="text-emerald-400">1234</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seu E-mail Cadastrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@lucrix.app"
                    className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-dark-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full text-sm font-bold shadow-emerald-glow-lg"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Entrar no Sistema
          </Button>
        </form>

        {/* Botão de 1 Clique para Teste Rápido do Sócio */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all btn-press shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Acesso Rápido com 1 Clique (Conta Demo)</span>
          </button>
        </div>

        {/* Rodapé: Cadastro de Nova Empresa */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Ainda não cadastrou sua empresa?{" "}
            <Link
              href="/registro"
              className="text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-4"
            >
              Criar Conta Grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
