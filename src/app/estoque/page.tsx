"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  ShoppingBag,
  Edit2,
  Trash2,
  Eye,
  Repeat,
  AlertCircle,
  Smartphone,
  Wrench,
  CheckCircle,
  Tag,
  Clock,
} from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductWizardModal } from "@/components/modules/ProductWizardModal";
import { SaleModal } from "@/components/modules/SaleModal";
import { Modal } from "@/components/ui/Modal";

export default function EstoquePage() {
  const [activeTab, setActiveTab] = useState<"READY" | "DRAFT">("READY");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProductIdForSale, setSelectedProductIdForSale] = useState<string>("");
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?status=${activeTab}&search=${search}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeTab, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mercadoria do estoque?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      alert("Erro ao excluir produto");
    }
  };

  // KPIs de topo do estoque
  const totalCount = products.reduce((acc, p) => acc + (p.quantity || 1), 0);
  const totalInvested = products.reduce((acc, p) => acc + (p.totalCost || 0) * (p.quantity || 1), 0);
  const totalTargetSales = products.reduce(
    (acc, p) => acc + (p.targetPrice || 0) * (p.quantity || 1),
    0
  );
  const totalProjectedProfit = totalTargetSales - totalInvested;

  const filteredProducts = products.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Topo com Título e Botão de Novo Cadastro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestão de Estoque & Mercadorias
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Controle individual por IMEI/Serial, custos agregados e margem real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/catiras"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold hover:bg-purple-500/20 transition-colors"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Permutas & Catiras</span>
          </Link>

          <Button
            size="md"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsWizardOpen(true)}
          >
            Cadastrar Produto
          </Button>
        </div>
      </div>

      {/* Indicadores de Topo do Estoque */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Qtd. de Mercadorias</span>
          <span className="text-lg sm:text-2xl font-extrabold text-white mt-0.5 block">
            {totalCount} itens
          </span>
          <span className="text-[10px] text-slate-400">Volume físico cadastrado</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 block">Valor Investido</span>
          <span className="text-lg sm:text-2xl font-extrabold text-slate-200 mt-0.5 block">
            {formatCurrency(totalInvested)}
          </span>
          <span className="text-[10px] text-slate-400">Custo de compra + melhorias</span>
        </div>

        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-emerald-500/30">
          <span className="text-[11px] font-medium text-emerald-400 block">Lucro Projetado</span>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-0.5 block">
            +{formatCurrency(totalProjectedProfit)}
          </span>
          <span className="text-[10px] text-slate-300">Margem líquida esperada</span>
        </div>
      </div>

      {/* Abas: Ativos | Rascunhos | Acesso a Trocas */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("READY")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "READY"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mercadorias Ativas
          </button>

          <button
            onClick={() => setActiveTab("DRAFT")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "DRAFT"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Rascunhos & Em Reparo
          </button>
        </div>

        {/* Alternância Grid / Lista */}
        <div className="flex items-center gap-1 bg-dark-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg ${
              viewMode === "grid" ? "bg-dark-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg ${
              viewMode === "list" ? "bg-dark-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, IMEI, marca ou modelo..."
            className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Todos os Status</option>
          <option value="READY">Pronto para Venda</option>
          <option value="IN_REPAIR">Em Reparo</option>
          <option value="IN_IMPROVEMENT">Em Higienização</option>
        </select>
      </div>

      {/* Lista ou Grid de Produtos */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Carregando mercadorias...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
          <Package className="w-10 h-10 mx-auto mb-2 text-slate-400" />
          <h4 className="text-sm font-bold text-white">Nenhum produto encontrado</h4>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre um novo item ou ajuste os filtros de pesquisa.
          </p>
          <Button
            size="sm"
            variant="primary"
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsWizardOpen(true)}
          >
            Cadastrar Produto
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const profit = p.targetPrice - p.totalCost;
            return (
              <div
                key={p.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800/90 hover:border-emerald-500/40 transition-all flex flex-col group shadow-xl hover:shadow-emerald-glow"
              >
                {/* Imagem & Badges Flutuantes */}
                <div className="relative h-48 w-full bg-dark-950 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant={p.status === "READY" ? "emerald" : "amber"}>
                      {p.status === "READY" ? "Pronto" : p.status}
                    </Badge>
                    {p.condition && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/75 text-slate-200 border border-white/10 backdrop-blur-md uppercase tracking-wider">
                        {p.condition === "NEW" ? "Novo" : "Seminovo"}
                      </span>
                    )}
                  </div>

                  {p.batteryHealth && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-dark-950/85 backdrop-blur-md text-[11px] font-extrabold text-emerald-400 border border-emerald-500/30 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Bateria {p.batteryHealth}%
                    </div>
                  )}
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {p.name}
                    </h3>
                    {p.serialNumber && (
                      <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                        <span className="text-slate-400">IMEI:</span>
                        <span className="text-slate-300 font-bold">{p.serialNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Informações de Custos e Venda */}
                  <div className="p-3.5 rounded-2xl bg-dark-900/80 border border-slate-800/80 space-y-2 text-xs shadow-inner">
                    <div className="flex justify-between text-slate-400">
                      <span>Custo Total Real:</span>
                      <span className="font-bold text-slate-200">
                        {formatCurrency(p.totalCost)}
                      </span>
                    </div>
                    {p.additionalCosts > 0 && (
                      <div className="flex justify-between text-[11px] text-amber-400">
                        <span>Melhorias / Peças:</span>
                        <span className="font-bold">+{formatCurrency(p.additionalCosts)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-800/80 text-white font-bold items-center">
                      <span className="text-slate-300">Preço de Venda:</span>
                      <span className="text-base font-black text-emerald-400 font-sans">
                        {formatCurrency(p.targetPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-400 font-medium">
                      <span>Lucro Líquido:</span>
                      <span className="font-extrabold text-emerald-400">
                        +{formatCurrency(profit)} ({formatPercent(p.marginProjected)})
                      </span>
                    </div>
                  </div>

                  {/* AÇÕES PRÓPRIAS DO PRODUTO: Vender, Editar, Excluir, Detalhes */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs font-bold"
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedProductIdForSale(p.id);
                        setIsSaleModalOpen(true);
                      }}
                    >
                      Vender Agora
                    </Button>

                    <button
                      onClick={() => setSelectedProductDetails(p)}
                      title="Ver Detalhes e Custos"
                      className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 transition-colors btn-press"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Excluir"
                      className="p-2.5 text-slate-400 hover:text-red-400 rounded-xl bg-dark-850 hover:bg-red-500/10 border border-slate-800 transition-colors btn-press"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISUALIZAÇÃO EM LISTA */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
          <div className="divide-y divide-slate-800">
            {filteredProducts.map((p) => {
              const profit = p.targetPrice - p.totalCost;
              return (
                <div
                  key={p.id}
                  className="p-3 sm:p-4 hover:bg-dark-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-900 border border-slate-800 overflow-hidden shrink-0">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {p.serialNumber ? `IMEI: ${p.serialNumber}` : "Sem IMEI"} • Qtd: {p.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Custo Total</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(p.totalCost)}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Preço de Venda</span>
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(p.targetPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setSelectedProductIdForSale(p.id);
                          setIsSaleModalOpen(true);
                        }}
                      >
                        Vender
                      </Button>
                      <button
                        onClick={() => setSelectedProductDetails(p)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-dark-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Guiado em 5 Etapas de Cadastro de Produto */}
      <ProductWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={fetchProducts}
      />

      {/* Modal de Venda */}
      <SaleModal
        isOpen={isSaleModalOpen}
        preSelectedProductId={selectedProductIdForSale}
        onClose={() => {
          setIsSaleModalOpen(false);
          setSelectedProductIdForSale("");
        }}
        onSuccess={fetchProducts}
      />

      {/* Modal de Detalhes da Mercadoria e Histórico */}
      {selectedProductDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProductDetails(null)}
          title={selectedProductDetails.name}
          description={`Ficha técnica e histórico financeiro do item`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-slate-400 block">Número de Série / IMEI:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedProductDetails.serialNumber || "Não cadastrado"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <span className="text-slate-400 block">Fornecedor de Origem:</span>
                <span className="text-white font-semibold">
                  {selectedProductDetails.supplierName || "Particular"}
                </span>
              </div>
            </div>

            {/* Custos Vinculados */}
            <div>
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
                Custos de Melhoria & Reparos
              </h4>
              {selectedProductDetails.expenses && selectedProductDetails.expenses.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedProductDetails.expenses.map((exp: any, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-dark-850 border border-slate-800 flex justify-between text-xs"
                    >
                      <span className="text-slate-300">{exp.description}</span>
                      <span className="font-bold text-amber-400">
                        {formatCurrency(exp.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Nenhum custo extra lançado.</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-emerald-500/40 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block">Custo Total: {formatCurrency(selectedProductDetails.totalCost)}</span>
                <span className="text-slate-400 block">Venda: {formatCurrency(selectedProductDetails.targetPrice)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 block font-medium">Margem Projetada</span>
                <span className="text-base font-extrabold text-emerald-400">
                  +{formatCurrency(selectedProductDetails.targetPrice - selectedProductDetails.totalCost)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
